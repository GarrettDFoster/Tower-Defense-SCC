//settings.js should be loaded before this

//===
//   Prepare simulation interface & buttons
//===

//update cost value on page
document.getElementById('budget').innerText = BUDGET;

//update the cost of the design on the page
game_state.grid.buildDefense(game_state.design);
document.getElementById('cost').innerText = game_state.grid.cost;
if (game_state.grid.cost > BUDGET) {
    alert('Max Budget of $' + BUDGET + ' exceeded!');
}

//attach event listenter to pause button
document.getElementById('pause_button').addEventListener('click', pause);

function pause() {
    game_state.paused = true;
    document.getElementById('pause_button').style.display = 'none';
    document.getElementById('resume_button').style.display = 'inline';
}

//attach event listenter to resume button
document.getElementById('resume_button').addEventListener('click', resume);

function resume() {
    game_state.paused = false;
    document.getElementById('resume_button').style.display = 'none';
    document.getElementById('pause_button').style.display = 'inline';
}

//hide pause button initially;
pause();

//attach event listener to the edit button
document.getElementById('edit_button').addEventListener('click', function () {
    var href = location.href.split('/');
    href[href.length - 1] = 'edit.html?design=' + game_state.design;
    location.href = href.join('/');
});

//===
//   Simulation Engine
//===

//build the tower defense
game_state.grid.buildDefense(game_state.design);

//start the simulation after a 1 second delay
window.setTimeout(
    window.setInterval(update, 1000 / 3),
    1000);

//update loops through turn order: Shoot Monsters > Move Monsters > Spawn Monster
function update() {

    //create a shortcut to get the grid
    var grid = game_state.grid;

    if (!game_state.paused) {

        //simulate one phase at a time
        switch (game_state.phase) {

            //===
            //  Shoot Monsters
            //===

            case ('Shoot'):

                //increment turn counter
                game_state.turn += 1;

                //get ordered list of tiles (diagonal closest to end, bottom right to top left, working towards start)
                var tiles = grid.getTilesInRange(grid.end_tile.location, 20);

                //go through each tile and check for a Tower
                for (var i = 0; i < tiles.length; i++) {
                    var tower_tile = tiles[i];

                    //if there is a Tower, get ordered list of tiles within its range
                    if (!tower_tile.is_empty && tower_tile.occupant instanceof Tower) {

                        var tiles_in_range = grid.getTilesInRange(tower_tile.location, tower_tile.occupant.range);

                        //go through each tile in its range and check for monsters...stop when max targets reached
                        var shots_left = tower_tile.occupant.max_targets;
                        for (var j = 0; j < tiles_in_range.length; j++) {

                            if (shots_left <= 0) {
                                break;
                            }

                            var monster_tile = tiles_in_range[j];
                            if (monster_tile.occupant instanceof Monster) {
                                //check that monster is alive
                                if (!monster_tile.occupant.is_dead) {

                                    //shoot monster
                                    shots_left -= 1; //decrease shots_left
                                    tower_tile.occupant.giveDamage(monster_tile.occupant);
                                }
                            }
                        }
                    }
                }
                break;

            //===
            //  Move Monsters
            //===

            case ('Move'):


                //go through ordered list of monsters from game state (first monster created moves first, last monster created moves last)
                for (var i = 0; i < game_state.monsters.length; i++) {
                    var monster = game_state.monsters[i];

                    if (monster.delay > 0) {
                        monster.delay -= 1;
                        continue;
                    }

                    //get best move for monster
                    var direction = monster.chooseMove(grid);

                    //check to see if not moving
                    if (direction === 'stuck') {
                        //attack neighbor
                        var tiles = [
                            grid.nextUp(monster.location),
                            grid.nextRight(monster.location),
                            grid.nextDown(monster.location),
                            grid.nextLeft(monster.location)
                        ];
                        for (var t = 0; t < tiles.length; t++) {
                            if (tiles[t]) {
                                monster.giveDamage(tiles[t].occupant);
                                if (tiles[t].occupant.is_dead) {
                                    tiles[t].clear();
                                }
                            }
                        }
                    } else {
                        monster.move(direction, grid);
                    }
                }
                break;

            //===
            //  Spawn Monsters
            //===

            case ('Spawn'):

                if (!grid.start_tile.is_empty && grid.start_tile.occupant instanceof Monster) {

                    //if monster is on start_tile add turn number to that monsters HP
                    grid.start_tile.occupant.hit_points += game_state.turn;

                } else {

                    //else spawn new monster with HP equal to turn number
                    grid.start_tile.add(new Monster(grid.start_tile.location, game_state.turn));
                    game_state.monsters.push(grid.start_tile.occupant);

                }
        }

        //===
        //   Clean up dead monsters
        //===

        //go through ordered list of monsters from game state
        var living_monsters = [];
        for (var i = 0; i < game_state.monsters.length; i++) {
            var monster = game_state.monsters[i];

            //check if monster is dead...if they are remove them from and tile (and game)
            if (monster.is_dead) {
                grid.clearTile(monster.location);
            } else {
                living_monsters.push(monster);
            }
        }
        //update game_state with set of living monsters
        game_state.monsters = living_monsters;

        //===
        //  Check for game end
        //===

        if (!grid.end_tile.is_empty && grid.end_tile.occupant instanceof Monster) {
            game_state.phase = 'Paused';
            clearInterval();
        }



        //===
        //   Update phase
        //===

        switch (game_state.phase) {
            case ('Shoot'):
                game_state.phase = 'Move';
                break;
            case ('Move'):
                game_state.phase = 'Spawn';
                break;
            case ('Spawn'):
                game_state.phase = 'Shoot';
                break;
            default:
                break;
        }
    }

    //===
    //  Draw current state to screen
    //===

    var html = '<caption>Turn Number: ' + game_state.turn + ', Phase: ' + game_state.phase + '</caption>';
    for (var i = 0; i < grid.rows; i++) {
        html += '<tr>';
        for (var j = 0; j < grid.columns; j++) {
            var t = grid.tiles[i][j];
            if (t.is_empty) {
                if (i == ROWS - 1 && j == 0) { //checking for start or end tile
                    html += '<td class="start">Start</td>';
                } else if (i == 0 && j == COLS - 1) {
                    html += '<td class="end">End</td>';
                } else {
                    html += '<td>&nbsp;</td>';
                }
            } else {
                html += '<td bgcolor="' + t.occupant.bg_color + '">' + t.occupant.label + '<sup>' + t.occupant.hit_points + '</sup></td>';
            }
        }
        html += '</tr>';
    }
    document.getElementById('game_board').innerHTML = html;
}


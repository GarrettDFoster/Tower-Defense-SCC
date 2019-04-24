const ROWS = 10;
const COLS = 10;

var game_state = {};
game_state.turn = 0;
game_state.grid = new Grid(ROWS, COLS);
game_state.monsters = [];
game_state.game_over = false;

//generate a bunch of inputs to place board
var html = '<caption>Input your defense! Click "Start" when ready.</caption>';
for (var i = 0; i < ROWS; i++) {
    html += '<tr>';
    for (var j = 0; j < COLS; j++) {
        html += '<td><input type="text" minlength="0" maxlength="1" size="2"></td>';
    }
    html += '</tr>';
}
document.getElementById('game_board').innerHTML = html;
document.getElementById('start_button').addEventListener('click', start);

function start() {
    //go through and build board from inputs
    var table = document.getElementById('game_board');
    for (var i = 0; i < ROWS; i++) {
        var row = table.getElementsByTagName('tr')[i];
        for (var j = 0; j < COLS; j++) {
            var td = row.getElementsByTagName('td')[j];
            var input = td.getElementsByTagName('input')[0];

            switch (input.value.toUpperCase()) {
                case ('S'):
                    game_state.grid.tiles[i][j].occupant = new SniperTower([i, j]);
                    break;
                case ('B'):
                    game_state.grid.tiles[i][j].occupant = new Bunker([i, j]);
                    break;
                case ('F'):
                    game_state.grid.tiles[i][j].occupant = new Forest([i, j]);
                    break;
                case ('E'):
                    game_state.grid.tiles[i][j].occupant = new ElectricFence([i, j]);
                    break;
                case ('T'):
                    game_state.grid.tiles[i][j].occupant = new TigerTrap([i, j]);
                    break;
                case ('W'):
                    game_state.grid.tiles[i][j].occupant = new WaterTrap([i, j]);
                    break;
                default:
                    break;
            }
        }
    }

    el = document.getElementById('start_button');
    button = document.createElement('button');
    button.id = 'pause_button';
    button.innerText = "Pause";
    button.addEventListener('click',pause);
    el.parentNode.insertBefore(button,el);    
    el.parentNode.removeChild(el);    

    //call update once to initialize
    window.setInterval(function () {
        /// call your function here
        update();
    }, 1000);
}

function pause(){
    game_state.game_over = true;
    el = document.getElementById('pause_button');
    button = document.createElement('button');
    button.id = 'resume_button';
    button.innerText = "Resume";
    button.addEventListener('click',resume);
    el.parentNode.insertBefore(button,el);    
    el.parentNode.removeChild(el);     
}

function resume(){
    game_state.game_over = false;
    el = document.getElementById('resume_button');
    button = document.createElement('button');
    button.id = 'pause_button';
    button.innerText = "Pause";
    button.addEventListener('click',pause);
    el.parentNode.insertBefore(button,el);    
    el.parentNode.removeChild(el);     
}

//update loops through turn order: Shoot Monsters > Move Monsters > (check for game end) > Spawn Monster
function update() {

    if (!game_state.game_over) {
        //increment turn counter
        game_state.turn += 1;

        //===
        //  Shoot Monsters
        //===

        //get ordered list of tiles (diagonal closest to end, bottom right to top left, working towards start)
        var grid = game_state.grid
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
        //  Move Monsters
        //===

        //go through ordered list of monsters from game state (first monster created moves first, last monster created moves last)
        for (var i = 0; i < game_state.monsters.length; i++) {
            var monster = game_state.monsters[i];

            //get list of possible moves
            var possible_moves = grid.getTilesInRange(monster.location, 1);

            //go through list of possible moves
            for (var j = 0; j < possible_moves.length; j++) {
                var move_tile = possible_moves[j];

                if (move_tile.is_blocked && move_tile.occupant instanceof Structure) {
                    //damage structures in way
                    monster.giveDamage(move_tile.occupant);

                    //check for and remove broken structures
                    if (move_tile.occupant.is_dead) {
                        move_tile.clear();
                    }
                } else {
                    //else update position of monster
                    grid.move(monster, move_tile.location);
                    break;
                }

            }
        }

        //===
        //  Spawn Monsters
        //===

        if (!grid.start_tile.is_empty && grid.start_tile.occupant instanceof Monster) {

            //if monster is on start_tile add turn number to that monsters HP
            grid.start_tile.occupant.hit_points += game_state.turn;

        } else {

            //else spawn new monster with HP equal to turn number
            var new_monster = new Monster(grid.start_tile.location, game_state.turn);
            grid.start_tile.occupant = new_monster;
            game_state.monsters.push(new_monster);

        }

        //===
        //  Check for game end
        //===

        if (!grid.end_tile.is_empty && grid.end_tile.occupant instanceof Monster) {
            game_state.game_over = true;
            clearInterval();
        }

        //===
        //  Draw current state to screen
        //===

        var html = '<caption>Turn Number: ' + game_state.turn + '</caption>';
        for (var i = 0; i < grid.rows; i++) {
            html += '<tr>';
            for (var j = 0; j < grid.columns; j++) {
                var t = grid.tiles[i][j];
                if (t.is_empty) {
                    html += '<td>&nbsp;</td>';
                } else {
                    html += '<td bgcolor="' + t.occupant.bg_color + '">' + t.occupant.label + '<sup>' + t.occupant.hit_points + '</sup></td>';
                }
            }
            html += '</tr>';
        }
        document.getElementById('game_board').innerHTML = html;
    }
}


class Monster extends Entity {
    delay;
    label = 'M';
    bg_color = '#F2D7D5';
    last_move; //remembering the last_move help monsters to not get stuck

    constructor(location, turn) {
        super(location, turn); //TODO need to check if monster already exists on spawn point
        this.delay = 0;
        this.damage = 1; //overwrite default value
    }

    chooseMove(grid) {
        /*
        Strategy is to check a 1 block wide path in each direction; up, right, down, and then left.
        At the end of each path check for movement up or right (once) and add that to the score if it's open.
        We will pick the direction with the highest score.
        Paths gain a point for being able to go up or right and lose a point for being able to go down or left.
        */

        //score going up
        var last_tile = grid.getTile(this.location);
        var next_tile = grid.nextUp(this.location);
        var valid_move = false;
        var up_score;
        while (isOpen(next_tile)) {
            valid_move = true;
            last_tile = next_tile;
            next_tile = grid.nextUp(next_tile.location);
        }
        if (isOpen(grid.nextRight(last_tile.location))) {
            next_tile = grid.nextRight(last_tile.location);
        } else {
            next_tile = last_tile;
        }
        if (!valid_move) {
            up_score = Infinity;
        } else if (this.last_move === 'down') {
            up_score = 20;
        } else {
            up_score = distToEnd(next_tile);
        }

        //score going right
        last_tile = grid.getTile(this.location);
        next_tile = grid.nextRight(this.location);
        valid_move = false;
        var right_score;
        while (isOpen(next_tile)) {
            valid_move = true;
            last_tile = next_tile;
            next_tile = grid.nextRight(next_tile.location);
        }
        if (isOpen(grid.nextUp(last_tile.location))) {
            next_tile = grid.nextUp(last_tile.location);
        } else {
            next_tile = last_tile;
        }
        if (!valid_move) {
            right_score = Infinity;
        } else if (this.last_move === 'left') {
            right_score = 20;
        } else {
            right_score = distToEnd(next_tile);
        }

        //score going down
        last_tile = grid.getTile(this.location);
        next_tile = grid.nextDown(this.location);
        valid_move = false;
        var down_score;
        while (isOpen(next_tile)) {
            valid_move = true;
            last_tile = next_tile;
            next_tile = grid.nextDown(next_tile.location);
        }
        if (isOpen(grid.nextRight(last_tile.location))) {
            next_tile = grid.nextRight(last_tile.location);
        } else {
            next_tile = last_tile;
        }
        if (!valid_move) {
            down_score = Infinity;
        } else if (this.last_move === 'down') {
            down_score = 20;
        } else {
            down_score = distToEnd(next_tile);
        }

        //score going left
        last_tile = grid.getTile(this.location);
        next_tile = grid.nextLeft(this.location);
        valid_move = false;
        var left_score;
        while (isOpen(next_tile)) {
            valid_move = true;
            last_tile = next_tile;
            next_tile = grid.nextLeft(next_tile.location);
        }
        if (isOpen(grid.nextUp(last_tile.location))) {
            next_tile = grid.nextUp(last_tile.location);
        } else {
            next_tile = last_tile;
        }
        if (!valid_move) {
            left_score = Infinity;
        } else if (this.last_move === 'down') {
            left_score = 20;
        } else {
            left_score = distToEnd(next_tile);
        }

        //choose path based on up > right > down > left preference
        var direction = 'up';
        var score = up_score;
        if (right_score < score) {
            direction = 'right';
            score = right_score;
        }
        if (down_score < score) {
            direction = 'down';
            score = down_score;
        }
        if (left_score < score) {
            direction = 'left';
            score = left_score;
        }
        if (score == Infinity) {
            return 'stuck';
        } else {
            return direction;
        }


        function isOpen(location) {
            //check if point is defined
            if (typeof (location) === 'undefined') {
                return false;
            }

            //check if point is unblocked
            if (location.is_blocked) {
                return false;
            }

            return true;
        }

        function distToEnd(tile) {
            //start is at [9,0]
            //end is at [0,9]
            //start is 18 moves from end

            return tile.location[0] + (9 - tile.location[1]);
        }
    }

    move(direction, grid) {
        if (this.delay > 0) {
            this.delay -= 1;
        } else {
            var old_tile = grid.getTile(this.location);
            var new_tile = old_tile;
            switch (direction) {
                case 'up':
                    new_tile = grid.nextUp(this.location);
                    break;
                case 'right':
                    new_tile = grid.nextRight(this.location);
                    break;
                case 'down':
                    new_tile = grid.nextDown(this.location);
                    break;
                case 'left':
                    new_tile = grid.nextLeft(this.location);
                    break;
                default:
                    break;
            }

            //update new tile
            if (new_tile.trap) {
                //delay the monster
                this.delay = new_tile.trap.delay;

                //damage the monster
                new_tile.trap.giveDamage(this);

                //damage the trap
                this.giveDamage(new_tile.trap);
            }
            if (!this.is_dead) {
                //update the tile's occupant
                new_tile.add(this);

                //update the entities location
                this.location = new_tile.location;
            }

            //update old tile's occupant
            if (old_tile.trap) {
                old_tile.add(old_tile.trap);
            } else {
                old_tile.clear();
            }

            //update last move
            this.last_move = direction;
        }
    }
}
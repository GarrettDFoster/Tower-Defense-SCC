class Tile {
    location;
    occupant = undefined; //this is the Entity (Structure or Monster) that occupies the tile. Only one Entity may occupy a tile at a time

    constructor(row, column) {
        this.location = [row,column];
    }

    clear() {
        this.occupant = undefined;
    }

    getTilesInRange(range) {
        var tile_list = [];
        var diagonal_move = [
            [1, 1],
            [1, -1],
            [-1, -1],
            [-1, 1]
        ];

        //clockwise spiral start up and close and work out to far
        for (var i = 1; i <= range; i++) {
            var current_location = this.location.concat();

            //start directly above location
            current_location[0] -= i; //update the row value
            tile_list.push(current_location.concat());

            for (var side = 0; side < 4; side++) {

                for (var step = 0; step < i; step++) {
                    current_location[0] += diagonal_move[side][0];
                    current_location[1] += diagonal_move[side][1];
                    tile_list.push(current_location.concat());
                }
            }
            tile_list.pop(); //the last element created each cycle will be a duplicate so remove it
        }
        return tile_list;
    }

    get is_empty() {
        if (typeof (this.occupant) == 'undefined') {
            return true;
        } else {
            return false;
        }
    }

    get is_blocked() {
        if (!this.is_empty && this.occupant.is_blocking) {
            return true;
        } else {
            return false;
        }
    }
}
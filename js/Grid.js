class Grid {
    rows; //the number of rows on the gameboard
    columns; //the number of columns on the gameboard
    tiles; //array that holds all tiles on grid
    start_tile; //pointer to the starting tile in the grid
    end_tile;// pointer to the ending tile in the grid    

    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;

        //create empty gameboard
        this.tiles = [];
        for (var r = 0; r < this.rows; r++) {
            var row = [];
            for (var c = 0; c < this.columns; c++) {
                row.push(new Tile(r, c));
            }
            this.tiles.push(row);
        }

        //initialize start_tile
        this.start_tile = this.tiles[this.rows - 1][0];

        //initialize end_tile
        this.end_tile = this.tiles[0][this.columns - 1];
    }

    add(entity, row, column) {
        let tile = this.tiles[row, column];
        if (tile.is_empty) {
            tile.occupant = entity;
        } else {
            Error('Cannot assign more than 1 entity to tile.');
        }
    }

    getTilesInRange(location, range) {
        var tile_list = [];
        var diagonal_move = [
            [1, 1],
            [1, -1],
            [-1, -1],
            [-1, 1]
        ];

        //clockwise spiral start up and close and work out to far
        for (var i = 1; i <= range; i++) {
            var current_location = location.concat();

            //start directly above location
            current_location[0] -= i; //update the row value
            if (current_location[0] >= 0 && current_location[0] < this.rows && current_location[1] >= 0 && current_location[1] < this.columns) {
                tile_list.push(this.tiles[current_location[0]][current_location[1]]);
            }

            for (var side = 0; side < 3; side++) {

                for (var step = 0; step < i; step++) {
                    current_location[0] += diagonal_move[side][0];
                    current_location[1] += diagonal_move[side][1];
                    if (current_location[0] >= 0 && current_location[0] < this.rows && current_location[1] >= 0 && current_location[1] < this.columns) {
                        tile_list.push(this.tiles[current_location[0]][current_location[1]]);
                    }
                }
            }
            //for the last diagonal (side = 4) we want to stop 1 step early to avoid duplicates
            for (var step = 0; step < i-1; step++) {
                current_location[0] += diagonal_move[side][0];
                current_location[1] += diagonal_move[side][1];
                if (current_location[0] >= 0 && current_location[0] < this.rows && current_location[1] >= 0 && current_location[1] < this.columns) {
                    tile_list.push(this.tiles[current_location[0]][current_location[1]]);
                }
            }
        }
        return tile_list;
    }

    clearTile(location){
        this.tiles[location[0]][location[1]].clear();
    }

    move(entity,new_location) {
        var old_location = entity.location.concat();
        this.tiles[old_location[0]][old_location[1]].clear();
        this.tiles[new_location[0]][new_location[1]].occupant = entity;
        entity.location = new_location;
    }


}
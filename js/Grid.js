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
                row.push(new Tile(r,c));
            }
            this.tiles.push(row);
        }

        //initialize start_tile
        this.start_tile = this.tiles[this.rows - 1][0];

        //initialize end_tile
        this.end_tile = this.tiles[0][this.columns - 1];
    }

    add(entity,row,column) {
        let tile = this.tiles[row,column];
        if(tile.is_empty){
        tile.occupant = entity;
        }else{
           Error('Cannot assign more than 1 entity to tile.');            
        }
    }

    
}
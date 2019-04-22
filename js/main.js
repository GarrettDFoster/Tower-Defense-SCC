const ROWS = 10;
const COLS = 10;

var game_state = {};
game_state.turn = 0;
game_state.grid = new Grid(ROWS,COLS);

//need a way to add towers to board before starting

//update loops through turn order: Shoot Monsters > Move Monsters > (check for game end) > Spawn Monster
function update(){
    //shoot monsters (never said which tower shoots first...diagonal closest to end, top to bottom, working towards start)
    

    //move monsters (keep a running list, move them based on spawn order...first moves first)

    //check for game end

    //spawn monster (make sure to check if a monster already exists on the start point, if it does we need to just update the HP)
}
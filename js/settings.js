//===
//   Setup Global Variables
//===

const ROWS = 10;
const COLS = 10;
const BUDGET = 100;

var game_state = {};
game_state.turn = 0;
game_state.grid = new Grid(ROWS, COLS);
game_state.monsters = [];
game_state.paused = false;
game_state.phase = 'Shoot'; //lets us animate the different steps to give a bit more info
game_state.design = location.href.split('?design=')[1] ? location.href.split('?design=')[1] : '000000000X00000000000000000000000000000000000000000000000000000000000000000000000000000000X000000000';
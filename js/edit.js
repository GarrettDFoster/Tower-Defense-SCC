//settings.js should be loaded before this

//update cost value on page
document.getElementById('budget').innerText = BUDGET;

//generate inputs so users can design/edit their tower defense, set the value of each based on the design string
var html = '<caption>Input your defense! Then click "Simulate" to test it out.</caption>';
for (var i = 0; i < ROWS; i++) {
    html += '<tr>';
    for (var j = 0; j < COLS; j++) {
        if (i == ROWS - 1 && j == 0) { //checking for start or end tile
            html += '<td class="start">Start</td>';
        } else if (i == 0 && j == COLS - 1) {
            html += '<td class="end">End</td>';
        } else {
            var val = game_state.design[i * ROWS + j].toUpperCase();
            if (!['S', 'B', 'F', 'E', 'S', 'W'].includes(val)) {
                val = '';
            }
            html += '<td><input type="text" minlength="0" maxlength="1" size="2" value="' + val + '"></td>';
        }
    }
    html += '</tr>';
}
document.getElementById('game_board').innerHTML = html;

//attach event listenters to inputs to update cost
var inputs = document.getElementsByTagName('input');
for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('change', updateCost);
}

function updateCost() {
    //building the defense on the grid sets the cost
    game_state.grid.buildDefense(getInputString());

    if (game_state.grid.cost > BUDGET) {
        //remove last input
        this.value = ""; //FIXME this will fail if called on an initial string
        alert('Max Budget of $' + BUDGET + ' exceeded!');

        //re-build the defense after removing tower
        game_state.grid.buildDefense(getInputString());
    }
    document.getElementById('cost').innerText = game_state.grid.cost;
}

//call updateCost once to initialize cost values
updateCost();

//create a function to generate a string from all the text inputs
function getInputString() {
    var input_string = '';

    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        //start tile
        if (i == (ROWS - 1) * COLS - 1) {
            input_string += 'X';
        }

        //end tile
        if (i == COLS - 1) {
            input_string += 'X';
        }

        //blank tile
        if (inputs[i].value == "") {
            input_string += 0;
        } else {
            input_string += inputs[i].value.toUpperCase();
        }
    }

    game_state.design = input_string;
    return input_string;
}

//attach event listenter to simulate button
document.getElementById('simulate_button').addEventListener('click', function () {
    var href = location.href.split('/');
    href[href.length - 1] = 'view.html?design=' + getInputString();
    location.href = href.join('/');
});

//attach event listenter to reset button
document.getElementById('reset_button').addEventListener('click', function () {
    var href = location.href.split('/');
    href[href.length - 1] = 'view.html';
    location.href = href.join('/');
});


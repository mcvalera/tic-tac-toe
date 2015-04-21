$(document).ready(function() {
  console.log("document ready");

  createGame();
});

var human = "X";
var ai = "O";
var currentTurn = human;
var blankCells = 9;
var game; // 3x3 array

// initialize game with empty 3x3 board
function createGame() {
  game = new Array(3);
  for (var i = 0; i < game.length; i++) {
    game[i] = new Array(3);
    for (var j = 0; j < game[i].length; j++) {
      game[i][j] = ""
    }
  }
}

function reloadGame() {}

function nextTurn() {
  console.log("next turn");
  if (currentTurn === human) {
    currentTurn = ai;
  } else {
    currentTurn = human;
  }
}

function humansMove(id,row,column) {
  // if cell is already occupied, the move is invalid
  content = $("#"+id).text();
  if (content.length > 0) {
    $(".dynamic_text").addClass("dynamic_text").html("<h4>Invalid move</h4>");
    return;
  }
  $("#"+id).addClass("x").html("X");
  // populate 2d array with corresponding tile
  game[row][column] = "X";
  // decrement number of blank cells
  blankCells -= 1;
  console.log(blankCells);

  var result = checkForWinner(game);
  if (result !== "continue") {
    if (result === "draw") {
      $(".dynamic_text").addClass("dynamic_text").html("<h4>Draw!</h4>");
      return;
    } else if (result === "X") {
      // to check if human can win --hopefully not!
        $(".dynamic_text").addClass("dynamic_text").html("<h4>You win!</h4>");
    } else {
        $(".dynamic_text").addClass("dynamic_text").html("<h4>I win!</h4>");
    }
    reloadGame();
  }
  nextTurn();
}

function checkForWinner(game) {
  // check for horizontal wins, left to right
  for (var row = 0; row < game.length; row++) {
    if (game[row][0] === game[row][1] && game[row][1] === game[row][2]) {
      if (game[row][0] !== "") {
        return game[row][0]; // returns either X or O depending on winning combo
      }
    }
  }
  // check for vertical wins, top to bottom
  for (var col = 0; col < game.length; col++) {
    if (game[0][col] === game[1][col] && game[1][col] === game[2][col]) {
      if (game[0][col] !== "") {
        return game[0][col]; // returns either X or O depending on winning combo
      }
    }
  }
 // check for diagonal wins, top left to bottom right and bottom left to top right
 if ((game[0][0] === game[1][1] && game[1][1] === game[2][2]) || (game[2][0] === game[1][1] && game[1][1] === game[0][2])) {
    if (game[1][1] !== "") {
      return game[1][1]; // returns either X or O depending on winning combo
    }
 }
 // return draw when all cells are filled and no winner is found
 if (blankCells === 0) {
    return "draw";
 }
 // resume playing until game ends in a draw or a winner is found
 return "continue";
}


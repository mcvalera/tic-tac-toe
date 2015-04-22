$(document).ready(function() {
  console.log("document ready");

  createGame();
  loadEventListener(); // for button to reload the game
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

function reloadGame() {
  currentTurn = human;
  blankCells = 9;
  console.log("blank cells - " + blankCells);
  clearTable();
  createGame();
}

function clearTable() {
  $("td").empty();
  // empty();
}

function loadEventListener() {
  $("#reload").click(function() {
    reloadGame();
    $(".dynamic_text").html('<h4 class="start_text">Start whenever you\'re ready</h4>');
  });
  //.addClass("start_text")
}

function nextTurn() {
  if (currentTurn === human) {
    currentTurn = ai;
  } else {
    currentTurn = human;
  }
}

// accessed from onclick attribute in view.html
function humansMove(id,row,column) {

  // remove prompt to start once player begins game
  if (blankCells === 9) {
    $(".start_text").fadeOut("slow");
  }

  // if cell is already occupied, the move is invalid
  var content = $("#"+id).text();
  if (content.length > 0) {
    $(".dynamic_text").addClass("dynamic_text").html("<h4>Invalid move</h4>");
    return;
  }
  $("#"+id).addClass("x").html("X");

  // populate 2d array with corresponding tile
  game[row][column] = "X";

  // decrement number of blank cells
  blankCells -= 1;
  console.log("blank cells left - " + blankCells); //check if blank cell decrementing

  var result = checkForWinner(game);
  if (result !== "continue") {
    endTheGame(result);
  }
  nextTurn();
  console.log("the current turn - " + currentTurn);
  aiMove(); //undefined still
  result = checkForWinner(game);
  if (result !== "continue") {
    endTheGame(result);
  }
}

function aiMove() {
  // return if it's not the ai's turn -- maybe get rid of this later
  if (currentTurn !== ai) {
    return;
  }
  // return if there are no turns left / no blank cells available
  if (blankCells === 0) {
    return;
  }
}

// when a draw happens or a winner has been found
function endTheGame(result) {
  if (result === "draw") {
    $(".dynamic_text").addClass("dynamic_text").html("<h4>Draw!</h4>");
  } else if (result === "X") {
    // to check if human can win --hopefully not!
      $(".dynamic_text").addClass("dynamic_text").html("<h4>You win!</h4>");
  } else {
      $(".dynamic_text").addClass("dynamic_text").html("<h4>I win!</h4>");
  }
  // reloadGame(); //allow user to reload game manually by pressing start over button
  return;
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


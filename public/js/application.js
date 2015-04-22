$(document).ready(function() {
  console.log("document ready");

  createGame();
  loadEventListener(); // for button to reload the game
});

var currentTurn = "X"; // where X is always human player, and O is always AI
var blankCells = 9;
var game; // 3x3 array
var gameClone; //for AI to explore possibilities on
var currentTurnInPossibilities; //declare AI / "O" as default later?

function reloadGame() {
  currentTurn = "X";
  blankCells = 9;
  console.log("blank cells - " + blankCells);
  clearTable();
  createGame();
}

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

function clearTable() {
  $("td").empty();
}

function loadEventListener() {
  $("#reload").click(function() {
    reloadGame();
    $(".dynamic_text").html('<h4 class="start_text">Start whenever you\'re ready</h4>');
  });
}

function switchTurn() {
  if (currentTurn === "X") {
    currentTurn = "O";
  } else {
    currentTurn = "X";
  }
}

// accessed from onclick attribute in view.html
function humansMove(id,row,column) {
  // debugger;
  // remove prompt to start once player begins game
  if (blankCells === 9) {
    $(".start_text").fadeOut("slow");
  }

  // if cell is already occupied, the move is invalid
  var content = $("#"+id).text();
  if (content.length > 0) {
    $(".dynamic_text").html("<h4>Invalid move</h4>");
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
  switchTurn();
  console.log("the current turn - " + currentTurn);
  aiMove(); //undefined still
  result = checkForWinner(game);
  if (result !== "continue") {
    endTheGame(result);
  }
}

function aiMove() {
  // debugger;
  console.log("ai move");
  // return if it's not the ai's turn -- maybe get rid of this later
  console.log("current turn - letter " + currentTurn)
  if (currentTurn !== "O") {
    return;
  }
  // return if there are no turns left / no blank cells available
  if (blankCells === 0) {
    return;
  }
  // debugger;
  createGameClone();
  currentTurnInPossibilities = "O";
  var possibleResult, row, col, choice = -1000;
  // for each blank cell, plop in "O"
  // debugger;
  for (var i = 0; i < gameClone.length; i++) {
    for (var j = 0; j <gameClone[i].length; j++) {
      if (gameClone[i][j] === "") {
        // debugger;
        gameClone[i][j] = currentTurnInPossibilities;
        console.log("gameClone[i][j]" + "[" +i+ "][" +j+ "] tile - " + gameClone[i][j]);
        console.log("game[i][j] - " + game[i][j]);

        blankCells -= 1; // decrementing unnecessarily currently blah
        // console.log("blankCells - " + blankCells);

        switchTurnInPossibilities();
        console.log("switch turn in possibilities - first turn should be x - " + currentTurnInPossibilities);

        possibleResult = searchThroughDepths(1);
        $(".check").html("row " + row + "column " + col + "possibleResult " + possibleResult + "<br>")
        gameClone[i][j] = "";
        blankCells +=1;
        if (choice === -1000) {
          choice = possibleResult;
          row = i;
          col = j;
        } else if (possibleResult > choice) {
          choice = possibleResult;
          row = i;
          col = j;
        }
        switchTurnInPossibilities();
      }
    }
  }
  $(".check").html("choice "+ choice + "row " + row + "col " + col);
  game[row][col] = "O"
  blankCells -= 1;
  populateTable(row, col);
  switchTurn();
}

function populateTable(row, col) {
  var elemId = row*3 + col + 1;
  $("#"+elemId).html("O"); //CONTINUE HERE
}

function searchThroughDepths(level) {
  var possibleResult = checkForWinner(gameClone);
  console.log("searchThroughDepths - possibleResult is - "+ possibleResult);
  if (possibleResult === "O") { // AI wins
    return 100 - level;
  } else if (possibleResult === "X") { // human player wins
    return level - 100;
  } else if (possibleResult === "draw") {
    return 0;
  }

  var choice = -1000;
  var otherOptions;

  for (var i = 0; i < gameClone.length; i++) {
    for (var j = 0; j < gameClone[i].length; j++) {
      if (gameClone[i][j] === "") {
        console.log("per blank cell in searchThroughDepths");

        gameClone[i][j] = currentTurnInPossibilities;
        console.log("gameClone[i][j]" + "[" +i+ "][" +j+ "] tile - " + gameClone[i][j]);
        console.log("game[i][j] - " + game[i][j]);

        switchTurnInPossibilities();

        blankCells -= 1;
        otherOptions = searchThroughDepths(level+1);
        switchTurnInPossibilities();
        gameClone[i][j] == "";
        blankCells += 1;
        if (choice === -1000) {
          choice = otherOptions;
        } else if (currentTurnInPossibilities === "O") {
            if (otherOptions > choice) {
              choice = otherOptions;
            }
        } else if (currentTurnInPossibilities === "X") {
            if (otherOptions < choice) {
              choice = otherOptions;
            }
        }
      }
    }
  }
  return choice;
}

function createGameClone() {
  gameClone = new Array(3);
  for (var k = 0; k < gameClone.length; k++) {
    gameClone[k] = new Array(3);
  }

  for (var i = 0; i < gameClone.length; i++) {
    for (var j = 0; j < gameClone[i].length; j++) {
      gameClone[i][j] = game[i][j];
    }
  }
}

function switchTurnInPossibilities() {
  if (currentTurnInPossibilities === "O") {
    currentTurnInPossibilities = "X"; //switch to human player
  } else {
    currentTurnInPossibilities = "O";
  }
}

// when a draw happens or a winner has been found
function endTheGame(result) {
  if (result === "draw") {
    $(".dynamic_text").html("<h4>Draw!</h4>");
  } else if (result === "X") {
    // to check if human can win --hopefully not!
      $(".dynamic_text").html("<h4>You win!</h4>");
  } else {
      $(".dynamic_text").html("<h4>I win!</h4>");
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
 // console.log("check for winner - continue");
 return "continue";
}


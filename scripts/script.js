var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';

const winCombos=[
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
];


/* 
Constant cells will now store the reference of all the items that has a class "cell"
and in order to access all these elements that has class cell we need to use Array
or basically cells here is an reference type Array constant.
*/
const cells = document.querySelectorAll(".cell");
//startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  console.log(origBoard);
  for (var i = 0; i < cells.length; i++){
    cells[i].innerText = " ";
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}

// square is basically a variable that represent the event that is getting occur on the squares of TicTacToe
function turnClick(square){
  //console.log(square.target.id); // It will print the ID of the square which get clicked.
  if(typeof origBoard[square.target.id] == 'number'){
    turn(square.target.id, huPlayer);
    // After the user turn before the AI runs it will check whether the game has get tied or not
    // checkTie() basically checks that whether the game get tied or not
    if(!checkTie()) turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
	// origBoard here is just an array that has value from 0 to 8.
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player; // It will set the huPlayer in that particular square where actionEvent happened.
	
	// Now we'll determine the winner using the Java-Script
	// After every turn or click we need to check whether the game has win or not

	let gameWon = checkWin(origBoard, player); // checkWin here is another function who determines that which player win the game.
	if (gameWon) gameOver(gameWon);  //At time when a player win the game the gameOver function get called with gameWon.  
}


// function checkWin will check whether the game has won yet or not.
// Here :-
//  a represents the accumulator
//  e represent the current element on the board
//  i represents the index value
function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, []);
  
    let gameWon = null;
    for(let [index, win] of winCombos.entries()){ 
      if(win.every(elem => plays.indexOf(elem) > -1)){
       gameWon = {index: index, player: player};
       break; // the for loop breaks if the condition satisfies for every element of win array
      }
    }
  return gameWon;
} 


/**
 * gameWon is actually an Object that contains:-
 * 1.) index of all wining moves of player
 * 2.) player who wins the game 
 */

function gameOver(gameWon){
  // we'll set a background color to all those cells that are in the wining combination
  for(let index of winCombos[gameWon.index]){
    document.getElementById(index).style.background = (gameWon.player === huPlayer ? 'blue' : 'red');
  }

  // we'll remove the click event from the cells so that after the game finishes no more clicks get addressed by machine 
  for(var i=0; i< cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }

  declareWinner(gameWon.player == huPlayer ? "You Win!!": 'You Lose');
  //thisFunctionDoesNotExistAndWasCreatedWithTheOnlyPurposeOfStopJavascriptExecutionOfAllTypesIncludingCatchAndAnyArbitraryWeirdScenario();

}
// Every Time a turn is taken by the player we need to check whether the game is won or not


function declareWinner(who){
  document.querySelector('.endgame').style.display = 'block';
  document.querySelector('.endgame .text').innerText = who;
}



// The Normal Version in which we haven't used the MiniMax algo
function bestSpot(){
  return minimax(origBoard, aiPlayer).index; // It will return the value of the 0th index of the array that returned by method emptySquares()
}

// emptySquares() basically return an array that contains all the empty cells id in it
function emptySquares(){
  return origBoard.filter(s => typeof s == 'number'); 
}

function checkTie(){
  if(emptySquares().length == 0){
    for(var i=0; i< cells.length;i++){
       // We can also change the style of an element in JS without using the document element
      cells[i].style.background = 'green'; 
      // and we'll remove the eventListener property
      cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner('Tie Game!!');
    return true;
  }
  return false;
}


// minimax is a type of backtracking(Recursive) algo
// as its an backtracking/recursive
function minimax(newBoard, player){    // The value of origBoard get copied in newBoard
  var availSpots = emptySquares(newBoard);  // the argument newBoard will get copied in the origBoard

  // returns a value if the terminal state is found (+10, 0, -10)
  if(checkWin(newBoard, huPlayer)){
    return {score: -10}; // If it founds a terminal point at some value with huPlayer it will return an Object with a score property that has value equal to -10
  }
  else if(checkWin(newBoard, aiPlayer)){
    return {score: 10};
  }else if(availSpots.length === 0){  // or it can also happen that their remains no any empty cells 
    return {score: 0};
  }

  // we'll traverse to each empty spots in the board and call the minimax at each spot
  var moves = [];
  for(var i=0; i<availSpots.length; i++){
    var move = {};
    move.index = newBoard[availSpots[i]];  // newBoard is actual array with the current situation of the board
    newBoard[availSpots[i]] = player; 
    if(player == aiPlayer){
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    }else{
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }

  var bestMove;

  if(player === aiPlayer){
    var bestScore = -10000;
    for(var i = 0; i<moves.length;i++){
      if(moves[i].score> bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }else{
    var bestScore = 10000;
    for(var i=0; i<moves.length;i++){
      if(moves[i].score< bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
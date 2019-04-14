var grid;
var playerCoordinate = {
  x: 7.5,
  y: -7.5
};

window.onload = function() {
  initGame();
};

function initGame() {
  grid = new Array(16).fill(0);

  for(var i = 0; i < 16; i++) {
    grid[i] = new Array(16).fill(0);

    for(var j = 0; j < 16; j++) {
      grid[i][j] = {
        bomb: false,
        number: 0,
        revealed: false,
        flagged: false
      };
    }
  }

  //Plant bombs
  plantBombs(20);

  //Print grid to console
  initGrid(grid) //firebase
  printGrid();
}

function plantBombs(totalBombs) {
  var bombsPlanted = 0;
  
  while (bombsPlanted < totalBombs) {
    var x = getRandomNumber(16);
    var y = getRandomNumber(16);
    if(!grid[x][y].bomb) {
      grid[x][y].bomb = true;
      grid[x][y].number = "X";
      countNumbers(x,y);
      bombsPlanted++;
    }
  }
}

//Increment numbers based on a given bomb position
function countNumbers(x,y) {
  if (inBounds(x-1,y-1)) {grid[x-1][y-1].number++;}
  if (inBounds(x  ,y-1)) {grid[x  ][y-1].number++;}
  if (inBounds(x+1,y-1)) {grid[x+1][y-1].number++;}
  if (inBounds(x-1,y  )) {grid[x-1][y  ].number++;}
  if (inBounds(x+1,y  )) {grid[x+1][y  ].number++;}
  if (inBounds(x-1,y+1)) {grid[x-1][y+1].number++;}
  if (inBounds(x  ,y+1)) {grid[x  ][y+1].number++;}
  if (inBounds(x+1,y+1)) {grid[x+1][y+1].number++;}
}

function inBounds(x,y) {
  if (x < 0 || y < 0 || x > 15 || y > 15) {
    return false;
  }
  if (grid[x][y].bomb) {
    return false;
  }
  return true;
}

function printGrid() {
  var string = "\n";

  for (var i = 0; i < 16; i++) {
    for (var k = 0 ; k < 16; k++){
      string += grid[i][k].number + " ";
    }
    string += "\n";
  }

  console.log(string);
}

function getRandomNumber(max){
  return Math.floor((Math.random() * 1000) + 1) % max;
}
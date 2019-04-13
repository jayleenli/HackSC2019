AFRAME.registerComponent('generate-lines', {
  init: function() {
    var element = this.el;

    var i, count;
    for(i = -8, count = 0; i <= 8; i++, count++) {
      element.setAttribute('line__gridx' + count, {
        start: {
          x: -8, 
          y: 0,
          z: -i
        },
        end: {
          x: 8, 
          y: 0,
          z: -i
        },
        color: 'white'
      });

      element.setAttribute('line__gridz' + count, {
        start: {
          x: i, 
          y: 0,
          z: 8
        },
        end: {
          x: i, 
          y: 0,
          z: -8
        },
        color: 'white'
      });
    }
  }
});

AFRAME.registerComponent('position-display', {
  tick: function () {
    var rotation = this.el.object3D.rotation;
    var position = this.el.object3D.position;

    var textElement = document.querySelector('#position-text');
    textElement.setAttribute('text', {
      value: "Rotation: " +  rotation.x.toFixed(2) + " " + rotation.y.toFixed(2) + " " + rotation.z.toFixed(2) + "\nPosition: " + position.x.toFixed(2) + " " + position.y.toFixed(2) + " " + position.z.toFixed(2)
    });
  }
});

AFRAME.registerComponent('move', {
  init: function () {
    var controllerElement = this.el;
    var cameraRigElement = document.querySelector('#camera-rig');
    var cameraElement = document.querySelector('#camera');

    var thumbstickPressed = false;
    var threshold = 0.7;

    controllerElement.addEventListener('triggerdown', () => {
      var cameraPosition = cameraRigElement.object3D.position;
      console.log(cameraPosition);
    });

    controllerElement.addEventListener('axismove', (event) => {
      var thumbstick = event.detail.axis;

      var textElement = document.querySelector('#thumbstick-text');
      var squareElement = document.querySelector('#current-square');
      textElement.setAttribute('text', {
        value: "Thumbstick: " +  thumbstick[0].toFixed(2) + " " + thumbstick[1].toFixed(2)
      });

      var horizontal = 0;
      var vertical = 0;

      if(thumbstick[1] < -threshold) {vertical = -1;}    //up
      if(thumbstick[1] > threshold) {vertical = 1;}      //down
      if(thumbstick[0] < -threshold) {horizontal = -1;}  //left
      if(thumbstick[0] > threshold) {horizontal = 1;}    //right

      var cameraRotation = cameraElement.object3D.rotation;
      if(Math.abs(cameraRotation.y) > Math.PI * 3/4) {
        horizontal *= -1;
        vertical *= -1;
      }
      else if (cameraRotation.y > Math.PI / 4 && cameraRotation.y <= Math.PI * 3/4) {
        var temp = horizontal;
        horizontal = vertical;
        vertical = -temp;
      }
      else if (cameraRotation.y < Math.PI / -4 && cameraRotation.y >= Math.PI * -3/4) {
        var temp = horizontal;
        horizontal = -vertical;
        vertical = temp;
      }

      if((horizontal || vertical) && !thumbstickPressed) {
        thumbstickPressed = true;

        var cameraRigPosition = cameraRigElement.object3D.position;
        var squarePosition = squareElement.object3D.position;
      
        cameraRigElement.setAttribute('position', {
          x: cameraRigPosition.x + horizontal,
          y: cameraRigPosition.y,
          z: cameraRigPosition.z + vertical
        });

        squareElement.setAttribute('position', {
          x: squarePosition.x + horizontal,
          y: squarePosition.y,
          z: squarePosition.z + vertical
        });
      }
      else if(!horizontal && !vertical) {
        thumbstickPressed = false;
      }
    });
  }
});

AFRAME.registerComponent('reset-camera', {
  init: function() {
    var controllerElement = this.el;
    var cameraRigElement = document.querySelector('#camera-rig');
    var cameraElement = document.querySelector('#camera');

    controllerElement.addEventListener('triggerdown', () => {
      var cameraPosition = cameraElement.object3D.position;
      
      cameraRigElement.setAttribute('position', {
        x: -7.5,
        y: 0,
        z: 7.5
      });
    });
  }
});


/* Game Logic */
/* Generate object for the grid */
class GridBlock {
  constructor(setBomb,number) {
    this.setBomb = setBomb; 
    this.number = number;//Bombs will have set number -1
    this.steppedOn = false;
    this.marked = false;
  }
  //Getters
  get numberVal() {
    return this.number;
  }

  get hasBeenSteppedOn() {
    return this.steppedOn;
  }

  //Methods
  isBomb() {
    return this.setBomb;
  }
  placeBomb() {
    this.setBomb = true;
    this.number = "X"; 
  }
  setSteppedOn() {
    this.steppedOn = true;
  }
  unsetSteppedOn() {
    this.steppedOn = false;
  }
  isMarked() {
    this.marked = true;
  }

  setNumber(num) {
    this.number = num;
  }
  incrementNumber() {
    this.number++;
  }

}

function getRandomNumber(max){
  return Math.floor((Math.random() * 1000) + 1) % max;
}

/* Generate the grid */
function createBoard () {
  /* Plant bombs */
  totalBombs = 20; //5 for 16x16
  bombsPlanted = 0;
  
  while (bombsPlanted < totalBombs) {
    x = getRandomNumber(16);
    y = getRandomNumber(16);
    if (!grid[x][y].isBomb()) {
      grid[x][y].placeBomb();
      countNumbers(x,y);
      bombsPlanted++;

    }
  }
}

//increment numbers based on a given bomb position
function countNumbers(x,y) {
  if (inBounds(x-1,y-1))
  {
    grid[x-1][y-1].incrementNumber();
  }
  if (inBounds(x,y-1))
  {
    grid[x][y-1].incrementNumber();
  }
  if (inBounds(x+1,y-1))
  {
    grid[x+1][y-1].incrementNumber();
  }

  if (inBounds(x-1,y))
  {
    grid[x-1][y].incrementNumber();
  }
  if (inBounds(x+1,y))
  {
    grid[x+1][y].incrementNumber();
  }

  if (inBounds(x-1,y+1))
  {
    grid[x-1][y+1].incrementNumber();
  }
  if (inBounds(x,y+1))
  {
    grid[x][y+1].incrementNumber();
  }
  if (inBounds(x+1,y+1))
  {
    grid[x+1][y+1].incrementNumber();
  }
}

function inBounds(x,y) {

  if (x < 0 || y < 0 || x > 15 || y > 15) {
    return false;
  }
  //console.log("is bomb " + grid[x][y].isBomb())
  if (grid[x][y].isBomb()==true)
  {
    return false;
  }
  return true;
}

var grid = new Array(16);

for (var i = 0; i < grid.length; i++) {
    grid[i] = new Array(16);
    for(var j = 0; j < grid[i].length; j++) {
      grid[i][j] = new GridBlock(false,0);
    }
}

createBoard();
console.log("bombs planted!");
console.log("count numbers");

var printgrid = "";
for (var i = 0; i < 16; i++)
{
  for (var k = 0 ; k < 16; k++)
  {
    printgrid += grid[i][k].numberVal + " ";
  }
  printgrid +="\n";
}
console.log(printgrid);
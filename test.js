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
			value: "Rotation: " +  rotation.x.toFixed(2) + " " + rotation.y.toFixed(2) + " " + rotation.z.toFixed(2) + ", Position: " + position.x.toFixed(2) + " " + position.y.toFixed(2) + " " + position.z.toFixed(2)
		});
	}
});

AFRAME.registerComponent('spawn', {
	init: function() {
		// Initialze grid for game
		initGame();

		var squareElement = this.el;
		var cameraRigElement = document.querySelector('#camera-rig');

		var x, y;
		while(true) {
			x = getRandomNumber(16);
    	y = getRandomNumber(16);

    	if(!grid[x][y].bomb && grid[x][y].number == 0) {
    		// Move camera to spawn location
	      var squarePosition = squareElement.object3D.position;
	      var cameraPosition = cameraRigElement.object3D.position;

	      squarePosition.z = x - 7.5;
	      squarePosition.x = y - 7.5;

	      cameraPosition.z = x - 7.5;
	      cameraPosition.x = y - 7.5;

	      // Initialize grid in Firebase
	      initGrid(grid, {x: x, y: y}); //firebase
	      break;
	    }
		}
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
			// console.log(cameraPosition);
		});

		controllerElement.addEventListener('axismove', (event) => {
			var thumbstick = event.detail.axis;

			var textElement = document.querySelector('#thumbstick-text');
			var squareElement = document.querySelector('#current-square');
			var skyElement = document.querySelector('a-sky');
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

				var squarePosition = squareElement.object3D.position;
				var cameraRigPosition = cameraRigElement.object3D.position;

				var newCoordinate = {
					x: squarePosition.z + vertical + 7.5,
					y: squarePosition.x + horizontal + 7.5
				}

				if(newCoordinate.x >= 0 && newCoordinate.x < 16 && newCoordinate.y >= 0 && newCoordinate.y < 16) {
					squarePosition.x += horizontal;
					squarePosition.z += vertical;
					cameraRigPosition.x += horizontal;
					cameraRigPosition.z += vertical;
					stepOn(newCoordinate.x, newCoordinate.y); //firebase

					if(grid[newCoordinate.x][newCoordinate.y].bomb) {
						skyElement.setAttribute('color', "red");
						died(); //firebase
					}
					(async function(){
						  var checkWin = await checkWin();
						  if (checkWin == true) {
						  	console.log('you won');
						  	skyElement.setAttribute('color', "green");
							updateWin();
						  }
					  })();
				}
			}
			else if(!horizontal && !vertical) {
				thumbstickPressed = false;
			}
		});
	}
});
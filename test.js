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

AFRAME.registerComponent('generate-boxes', {
	init: function() {

		var element = this.el;

		console.log(element.innerHTML);
		//first one -7.5 .70 7.5
		var positionx = -7.5;
		var positiony = 7.5;
		for (var x = 0; x < 16; x++) {
			positiony = 7.5;
			for (var y = 0; y < 16; y++) {
				var box = document.createElement('a-box'); 
				box.setAttribute('visible', false);
				box.setAttribute('position', {
					x: positionx,
					y: .70,
					z: positiony
				});
				box.setAttribute('color',"#404589");
				box.setAttribute('collision-filter',"group: yeet; collidesWith: default, yeet");
				box.setAttribute('pick-block', true);
				element.appendChild(box);
				positiony -= 1;
			}
			positionx += 1;
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

	      playerCoordinate.x = x - 7.5;
	      playerCoordinate.y = y - 7.5;

	      // Initialize grid in Firebase
	      initGrid(grid, {x: x, y: y}); //firebase
	      break;
	    }
		}
	}
});

AFRAME.registerComponent('pick-block', {
	init: function() {
		var block = this.el;
		var enemyElement = document.querySelector('#enemies');
		var controller = document.querySelector("#rightHand");

		controller.addEventListener('triggerdown', (event) => {
			var blockPosition = block.object3D.position;

			if(Math.abs(blockPosition.z - playerCoordinate.x) < 0.5 && Math.abs(blockPosition.x - playerCoordinate.y) < 0.5) {
				block.setAttribute('mixin', "cube");
				block.setAttribute('visible', true);

				setInterval(() => {
					var enemyChildren = enemyElement.children;

					for(var i = 0; i < enemyChildren.length; i++) {
						var blockPosition = block.object3D.position;
						var enemyPosition = enemyChildren[i].object3D.position;

						if(Math.abs(enemyPosition.x - blockPosition.x) < 0.75 && Math.abs(enemyPosition.z - blockPosition.z) < 0.75) {
							enemyChildren[i].parentNode.removeChild(enemyChildren[i]);
							block.parentNode.removeChild(block);
						}
					}
				}, 250);
			}
		});
	}
})

AFRAME.registerComponent('move', {
	init: function () {
		var controllerElement = this.el;
		var cameraRigElement = document.querySelector('#camera-rig');
		var cameraElement = document.querySelector('#camera');

		var thumbstickPressed = false;
		var threshold = 0.7;

		// controllerElement.addEventListener('triggerdown', () => {
		// 	var cameraPosition = cameraRigElement.object3D.position;
		// 	console.log(cameraPosition);
		// });

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
					playerCoordinate.x = squarePosition.z + vertical;
					playerCoordinate.y = squarePosition.x + horizontal;

					squarePosition.x += horizontal;
					squarePosition.z += vertical;
					cameraRigPosition.x += horizontal;
					cameraRigPosition.z += vertical;
					stepOn(newCoordinate.x, newCoordinate.y); //firebase

					if(grid[newCoordinate.x][newCoordinate.y].bomb) {
						skyElement.setAttribute('color', "red");
						gameEnded = true;
						died(); //firebase

						var subTextElement = document.querySelector('#sub-text');
						subTextElement.setAttribute('text', {value: "You exploded!"});
					}

					 firebase.database().ref('/grids').once('value').then((snapshot) => {
				  	var state = snapshot.val();
				  	var won = true;
				  	for (x=0; x<16; x++) {
				  		for (y=0; y<16; y++) {
				  			if (state.points[x][y].revealed == false && state.points[x][y].bomb == false)
				  			{
				  				won = false;
				  				break;
				  			}
				  		}
				  	}
				  	if(won == true) {
				  		var subTextElement = document.querySelector('#sub-text');
							subTextElement.setAttribute('text', {value: "You survived!"});

					  	skyElement.setAttribute('color', "green");
					  	gameEnded = true;
							updateWin();
				  	}
					});
				}
			}
			else if(!horizontal && !vertical) {
				thumbstickPressed = false;
			}
		});
	}
});

AFRAME.registerComponent('generate-enemies', {
	init: function() {
		var enemyElement = this.el;

		var side = 2;

		var spawner = setInterval(() => {
			var newEnemy = document.createElement('a-sphere');

			var row = getRandomNumber(16);

    	if(side % 2 == 0) {
    		var position1 = {
    			x: row - 7.5,
    			y: 1,
    			z: -10
    		}

    		var position2 = {
    			x: row - 7.5,
    			y: 1,
    			z: 10
    		}

    		if(side % 4 == 2) {
    			position1.x *= -1;
    			position2.x *= -1;
    		}
    	}
    	else {
    		var position1 = {
    			x: -10,
    			y: 1,
    			z: row - 7.5
    		}

    		var position2 = {
    			x: 10,
    			y: 1,
    			z: row - 7.5
    		}

    		if(side % 4 == 3) {
    			position1.z *= -1;
    			position2.z *= -1;
    		}
    	}

			newEnemy.setAttribute('color', 'gray');
			newEnemy.setAttribute('radius', 0.5);
			newEnemy.setAttribute('position', position1); 
			newEnemy.setAttribute('enemy', true);
			newEnemy.setAttribute('animation', {
				property: "position",
				to: position2,
				dur: 10000,
				easing: "linear"
			});

			enemyElement.appendChild(newEnemy);

			side++;

			setTimeout(() => {
				newEnemy.parentNode.removeChild(newEnemy);
			}, 10000);
		}, 5000);
	}
});

AFRAME.registerComponent('enemy', {
	init: function() {
		var enemyElement = this.el;
		var skyElement = document.querySelector('a-sky');

		var enemyInterval = window.setInterval(() => {
			var enemyPosition = enemyElement.object3D.position;

			if(Math.abs(enemyPosition.z - playerCoordinate.x) < 0.5 && Math.abs(enemyPosition.x - playerCoordinate.y) < 0.5) {
				skyElement.setAttribute('color', "red");
				gameEnded = true;
				died(); //firebase

				var subTextElement = document.querySelector('#sub-text');
				subTextElement.setAttribute('text', {value: "You exploded!"});
			}
		}, 250);

		window.setTimeout(() => {
			clearInterval(enemyInterval);
		}, 10000);
	}
});

AFRAME.registerComponent('clock', {
	tick: function() {
		if(!gameEnded) {
			var textElement = document.querySelector('#title-text');

			var seconds = ((Date.now() - startTime)/1000) % 60;
			seconds = seconds.toFixed(1);
			if(seconds < 10) { 
				seconds = "0" + seconds;
			}

			var minutes = Math.floor((Date.now() - startTime)/60000);

			textElement.setAttribute('text', {
				value: "Time: " + minutes + ":" + seconds
			});
		}
	}
});
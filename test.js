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
		var index = 0;
		for (var x = 0; x < 16; x++) {
			positiony = 7.5;
			for (var y = 0; y < 16; y++) {
				var box = '<a-box visible="false" mixin="cube" position="' + positionx + ' .70 ' + positiony + '" color="#404589" collision-filter="group: yeet; collidesWith: default, yeet" id="yeetbox'+index+'"></a-box>';
				element.innerHTML += box;
				positiony -= 1;
				index++;
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

AFRAME.registerComponent('pick-block', {
	init: function() {
		var block = this.el;
		var controller = document.querySelector("#rightHand");

		controller.addEventListener('triggerdown', () => {
			block.setAttribute('visible', true);
		})
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

		var element = document.querySelector('#redbox');

		console.log(element);

		controllerElement.addEventListener('gripdown', (event) => {
			element.setAttribute('visible', true);
		})

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
				}
			}
			else if(!horizontal && !vertical) {
				thumbstickPressed = false;
			}
		});
	}
});


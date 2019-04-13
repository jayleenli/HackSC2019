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
        horizontal = -vertical;
        vertical = -temp;
      }
      else if (cameraRotation.y < Math.PI / -4 && cameraRotation.y >= Math.PI * -3/4) {
        var temp = horizontal;
        horizontal = vertical;
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
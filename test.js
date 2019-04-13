AFRAME.registerComponent('generate-lines', {
  init: function() {
    var el = this.el;

    var i, count;
    for(i = -8, count = 0; i <= 8; i++, count++) {
      el.setAttribute('line__gridx' + count, {
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

      el.setAttribute('line__gridz' + count, {
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

AFRAME.registerComponent('reset-camera', {
  init: function() {
    var el = this.el;

    el.addEventListener('triggerdown', () => {
      console.log("pushed");
      var cameraElement = document.querySelector('#camera-rig');
      cameraElement.setAttribute('position', {
        x: 0,
        y: 1.6,
        z: 0
      });
    });
  }
});
const firebaseConfig = {
	apiKey: "AIzaSyBrAnW65FVKNAcNns3zVfa0z1MT_I0___c",
  authDomain: "hacksc-538d5.firebaseapp.com",
  databaseURL: "https://hacksc-538d5.firebaseio.com",
  projectId: "hacksc-538d5",
  storageBucket: "hacksc-538d5.appspot.com",
  messagingSenderId: "548745669097"
};

const init = () => {
	firebase.initializeApp(firebaseConfig);
};

const fakeGrid = () => {
	var points = [];
	for (x=0; x<16; x++) {
		points[x] = [];
		for (y=0; y<16; y++) {
			points[x][y] = {
				'bomb': 0,
				'number': 0,
				'revealed': false,
				'flagged': false
			};
		}
	}
	return points;
};

const initGrid = (presetGrid = fakeGrid(), currentPos = {x: 15, y: 0}) => {
	var points = [];
	for (x=0; x<16; x++) {
		points[x] = [];
		for (y=0; y<16; y++) {
			var tile = presetGrid[x][y];
			points[x][y] = {
				'bomb': tile.bomb,
				'number': tile.number,
				'revealed': tile.revealed,
				'flagged': tile.flagged
			};
		}
	}
	firebase.database().ref('grids/').set({
		'points': points,
		'isDead': false,
		'currentPosition': currentPos
	});
	console.log(points);
};

const stepOn = (x, y) => {
	firebase.database().ref('/grids/points/' + x + '/' + y).update({revealed: true});
	firebase.database().ref('/grids/currentPosition').update({x: x, y: y});
};

const flagBomb = (x,y) => {
	firebase.database().ref('/grids/points/' + x + '/' + y).update({flagged: true});
};

const died = (x,y) => {
	firebase.database().ref('/grids').update({isDead: true});
};

const getGridState = () => {
	return firebase.database().ref('/grids').once('value').then((snapshot) => {
		return snapshot.val();
	});
}

const resetGrid = (newGrid) => {
	initGrid(newGrid);
}

init();
var database = firebase.database();
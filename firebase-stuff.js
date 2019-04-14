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

const fakeMaze = () => {
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

const initMaze = (presetMaze = fakeMaze()) => {
	var points = [];
	for (x=0; x<16; x++) {
		points[x] = [];
		for (y=0; y<16; y++) {
			var tile = presetMaze[x][y];
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
		'isDead': false
	});
	console.log(points);
};

const stepOn = (x, y) => {
	firebase.database().ref('/grids/points/' + x + '/' + y).update({revealed: true});
};

const flagBomb = (x,y) => {
	firebase.database().ref('/grids/points/' + x + '/' + y).update({flagged: true});
};

const died = (x,y) => {
	firebase.database().ref('/grids').update({isDead: true});
};

const getGridState = () => {
	return firebase.database().ref('/grids').once('value').then((snapshot) => {
		//console.log(snapshot.val());
		return snapshot.val();
	});
}

init();
var database = firebase.database();
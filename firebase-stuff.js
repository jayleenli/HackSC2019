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

const initGrid = (presetGrid, currentPos) => {
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
	firebase.database().ref('grids/').update({
		'points': points,
		'isDead': false,
		'currentPosition': currentPos,
		'won': false 
	});
	// console.log(points);
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

const checkWin = () => {
	return (async function(){
	  	var state = await getGridState();
	  	var reveledCount = 0;
	  	for (x=0; x<16; x++) {
	  		for (y=0; y<16; y++) {
	  			if (state.points[x][y].revealed == false && state.points[x][y].bomb == false)
	  			{
	  				return false;
	  			}
	  		}
	  	}
	  	return true;
	  })();
}

const updateWin = () => {
	firebase.database().ref('/grids').update({won: true});
}

const resetGrid = (newGrid) => {
	initGrid(newGrid);
}

const setNumBombs = (numBombs) => {
	firebase.database().ref('/grids').update({numBombs: numBombs});
}

init();
var database = firebase.database();
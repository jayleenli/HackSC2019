
var lastCurrTile = null;
var currTile = null;

const firebaseConfig = {
	apiKey: "AIzaSyBrAnW65FVKNAcNns3zVfa0z1MT_I0___c",
    authDomain: "hacksc-538d5.firebaseapp.com",
    databaseURL: "https://hacksc-538d5.firebaseio.com",
    projectId: "hacksc-538d5",
    storageBucket: "hacksc-538d5.appspot.com",
    messagingSenderId: "548745669097"
};

// var database = firebase.database();

const init = () => {
	firebase.initializeApp(firebaseConfig);
	newCurrTile();
};

window.onload = function() {
	initGrid("mine-field", row, column);
	init();
}

const newCurrTile = () => {
	firebase.database().ref('/grids/currentPosition').on('value', (snapshot) => {
		var currGrid = snapshot.val();
		if (currTile) {
			// console.log(currTile);
			lastCurrTile = currTile;
			// console.log(lastCurrTile);
			deHighlightTile(lastCurrTile);
		}
		currTile = document.getElementById("tile-" + currGrid.x + "-" + currGrid.y);
		revealNewTile(currTile, currGrid);
		highlightTile(currTile);
	});
}

const revealNewTile = (tile, currGrid) => {
	firebase.database().ref('/grids/points/' + currGrid.x + '/' + currGrid.y).once('value', (snapshot) => {
			var grid = snapshot.val();
			if (tile && tile.getAttribute("revealed") == "false") {
				revealTile(tile, grid.number);
			}
		});
}


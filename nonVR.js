
var bombCount = 0;
var row = 16;
var column = 16;
var backgroundColor = "#0b0e30";
var plainColor = "#34386d";
var flagColor = "#f93502";
var highlightColor = "#12abd5";
var indicatorColors = {
	0: "98c8ff",
	1: "#7ba3ff",
	2: "#3230c8",
	3: "#581f57",
	4: "#590d20",
	5: "#850000",
	6: "#c40000",
	7: "#ff4400",
	X: "#ff0000"
};


// window.onload = function() {
// 	initGrid("mine-field", row, column);
// }

function initCounter(counterId) {
	getBombCount(bombCount);
	// console.log(getBombCount());
	drawCounter(counterId);
}

function drawCounter(counterId) {
	var counterBar = document.getElementById(counterId);
	// console.log(bombCount);
	// counterBar.innerHTML = "<h1>" + bombCount + "</h1>";
	counterBar.innerText = bombCount;
}

function initGrid(gridId, rowNum, columnNum) {
	var grid = document.getElementById(gridId);
	for (var i = 0; i < rowNum; i++) {
		for (var j = 0; j < columnNum; j++) {
			// grid.innerHTML = "<button id= tile-" + i + "-" + j ">";
			var gridButton = document.createElement("BUTTON");
			gridButton.setAttribute("id", "tile-" + i + "-" + j);
			gridButton.setAttribute("class", "tile");
			gridButton.setAttribute("type", "button");
			gridButton.setAttribute("flagged", "false");
			gridButton.setAttribute("revealed", "false");
			gridButton.setAttribute("x", i);
			gridButton.setAttribute("y", j);
			gridButton.style.borderColor = backgroundColor;
			gridButton.addEventListener('click', function() {
				if (bombCount > 0)
				flagTile(event.currentTarget);
				// revealTile(event.currentTarget, 1);
			});
			// gridButton.setAttribute("background", plainColor);
			// gridButton.setAttribute("width", "100px");
			// gridButton.setAttribute("height", window.innerWidth / row + "px");
			grid.appendChild(gridButton);
		}
	}
	var grids = document.getElementsByClassName("tile");
	// grids.addEventListener('click', flagGrid, event.target);

}

function flagTile(target) {
	// console.log(target);

	var flagStatus = target.getAttribute("flagged") == "false" ? "true" : "false";
	// console.log(flagStatus);
	target.setAttribute("flagged", flagStatus);
	if (target.getAttribute("flagged") == "true") {
		target.style.border = "medium solid " + flagColor;
		target.style.background = backgroundColor;
		if (bombCount > 0) {
			bombCount--;
			flagBomb(target.getAttribute("x"), target.getAttribute("y"));
		}
	}
	else {
		target.style.border = "1px solid " + backgroundColor;
		target.style.background = plainColor;
		bombCount++;
		unflagBomb(target.getAttribute("x"), target.getAttribute("y"));
	}
	drawCounter("title-bar");
}

function revealTile(target, bombIndicator) {
	target.style.background = backgroundColor;
	target.setAttribute("revealed", "true");
	target.innerText = bombIndicator;
	// var textNode = document.createTextNode(bombIndicator);
	// target.appendChild(textNode);
	// target.style.textAlign = "center";
	target.style.color = indicatorColors[bombIndicator];
	// target.style.padding = 0;
	// target.style.margin = 0;
	// target.style.lineHeight = 0;
	// target.style.letterSpacing = 0;

}

function highlightTile(target) {
	target.style.border = "medium solid " + highlightColor;
}

function deHighlightTile(target) {
	target.style.border = "thin solid" + backgroundColor;
}
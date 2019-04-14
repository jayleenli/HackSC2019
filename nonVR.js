
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
			gridButton.style.borderColor = backgroundColor;
			gridButton.addEventListener('click', function() {
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
	target.setAttribute("flagged", flagStatus);
	target.style.border = "medium solid " + flagColor;
	target.style.background = backgroundColor;
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
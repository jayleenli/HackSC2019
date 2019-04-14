
var row = 16;
var column = 16;
var backgroundColor = "#0b0e30";
var plainColor = "#34386d";
var flagColor = "#f93502";

window.onload = function() {
	initGrid("mine-field", row, column);
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
			gridButton.style.borderColor = backgroundColor;
			gridButton.addEventListener('click', function() {
				flagTile(event.currentTarget);
				revealTile(event.currentTarget, 1);
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
	// target.style.color = "white";
	// target.style.padding = 0;
	// target.style.margin = 0;
	// target.style.lineHeight = 0;
	// target.style.letterSpacing = 0;

}
var pos1 = 0, pos2 = 0;

document.getElementById("rightBorder").onmousedown = moveBorder;
document.getElementById("leftBorder").onmousedown = moveBorder;

var leftPanel = document.getElementById('left');
var rightPanel = document.getElementById('right');

var current;

function moveBorder(e) {
    pos2 = e.clientX;

    if (e.target.id == 'leftBorder') {
		current = 0;
	}
	else if (e.target.id == 'rightBorder') {
		current = 1;
	}

	document.onmousemove = elementDrag;
    document.onmouseup = closeDragElement;
}

function elementDrag(e) {
	// left
	if (current) {
		pos1 = pos2 - gl.canvas.offsetLeft;
		pos2 = e.clientX;

		leftPanel.style.width = pos1 + 'px';
		leftPanel.childNodes[1].childNodes[1].innerHTML = Math.round((pos2 - gl.canvas.offsetLeft) * (xPoints/gl.canvas.width));
	}
	else {
		pos1 = document.body.clientWidth - pos2 - gl.canvas.offsetLeft/2;
		pos2 = e.clientX;

		rightPanel.style.width = pos1 + 'px';
		rightPanel.childNodes[1].childNodes[1].innerHTML = Math.round((pos2 - gl.canvas.offsetLeft) * (xPoints/gl.canvas.width));
	}
	//setExtremaFromInterval();
}


/*
function setExtremaFromInterval() {

	for (var i = 0; i < numberOfFunctions; ++i) {
		for (var j = 2 * (i*xPoints) * leftPanel.childNodes[1].childNodes[1].innerHTML; j <= 2 * (i*xPoints) * rightPanel.childNodes[1].childNodes[1].innerHTML; j += 2) { 
			if (origData[j] > maxYFromInterval) { 
				maxYFromInterval = origData[j];
			}
			else if (origData[j] < minYFromInterval) { 
				minYFromInterval = origData[j];
			}
		}
	}

	console.log(maxYFromInterval);
	console.log(minYFromInterval);
}
*/


function closeDragElement(e) {
	document.onmouseup = null;
	document.onmousemove = null;
}
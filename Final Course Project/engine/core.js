$(document).ready(function() {

	timeStart = performance.now();

	var	canvas = document.getElementById("picasso");
	canvas.addEventListener('webglcontextlost',function(event){event.preventDefault();},false);
	canvas.addEventListener('webglcontextrestored',function(){startGame();},false);

	startGame();

});

function startGame() {
	gl = getContext("picasso");

	glAlien = getProgram(vShaderAlien, fShaderAlien);
	glMaze = getProgram(vShaderMaze, fShaderMaze);
	glMazeWall = getProgram(vShaderMazeWall, fShaderMazeWall);

	gl.enable(gl.DEPTH_TEST);

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clearColor(0.8,0.9,1,1);

	lookAtCoords = [0, 6, 8];

	switchProgram(glAlien);
	character = new Alien(0.5, [1, 0.75, 0]);

	switchProgram(glMaze);
	maze = new Maze(10);

	drawFrame();
}

function endGame(){
  $('.end-message-wrapper').addClass('active');

  var timeEnd = performance.now();
  var finalTime = (timeEnd - timeStart) / 1000;

  $('.instructions').addClass('hide');
  $('<p>You passed the game in ' + (finalTime | 0) + ' seconds</p>').insertAfter('.end-message p');
}

function switchProgram(prog) {
	glprog = prog;
	gl.useProgram(glprog);
	getVariables();

	identity();
	lookAt(lookAtCoords,[0,1,0],[0,1,0]);
	perspective(30,gl.canvas.width/gl.canvas.height,1,40000);

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA,gl.SRC_ONE_MINUS_ALPHA);
	gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
}


function drawFrame() {
	
	gl.clear(gl.COLOR_BUFFER_BIT + gl.DEPTH_BUFFER_BIT);

	switchProgram(glMaze);
	maze.draw();

	switchProgram(glAlien);
	gl.depthMask(true);
	gl.uniform1f(uAlpha, 1);
	character.draw();


	requestAnimationID = requestAnimationFrame(drawFrame);
}
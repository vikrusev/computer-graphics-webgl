$(document).ready(function() {

	var	canvas = document.getElementById("picasso");
	canvas.addEventListener('webglcontextlost',function(event){event.preventDefault();},false);
	canvas.addEventListener('webglcontextrestored',function(){init();},false);

	init();
	drawFrame();
});

function init() {
	gl = getContext("picasso");
	glWater = getProgram(vShaderWater,fShader);
	glMountain = getProgram(vShaderMountain, fShader);

	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.8,0.9,1,1);

	createBezierTerrain();

	// водата
	water = new Cuboid([0,0,0],[200,waterHeight,200]);
	water.color = [0,0,0.5];
}

function switchProgram(prog) {
	// правим желатана програма активна
	glprog = prog; 
	gl.useProgram(glprog);
	getVariables();

	// задаваме гледната точка и перспективата
	lookAt([250*cos(time/3),200+100*sin(time/2),450*sin(time/3)],[0,0,0],[0,1,0]);
	identity();
	//lookAt([250,200,450],[0,0,0],[0,1,0]);
	perspective(30,gl.canvas.width/gl.canvas.height,1,40000);

	// магически код за поддръжка на прозрачност на водата
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA,gl.SRC_ONE_MINUS_ALPHA);
	gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
	
	gl.uniform1i(uUseNormalMatrix,false);

	gl.uniform3f(uAmbientColor,0.3,0.3,0.3);
	gl.uniform3f(uDiffuseColor,1,1,1);
	gl.uniform3f(uLightDir,0,0,-1);
}


var time = now();
function now() { return (new Date()).getTime()/1000; }

function drawFrame() {
	time = now();
	gl.clear(gl.COLOR_BUFFER_BIT + gl.DEPTH_BUFFER_BIT);
	
	switchProgram(glMountain);
	gl.depthMask(true);
	gl.uniform1f(uAlpha, 1); // прозрачност
	
	// рисуване на всички сплайн повърхнини
	for (var i = 0; i < (cpX - 3) * dM + 4 * dM; ++i) {
		surf[i].draw();
	}

	// рисуване на водата
	switchProgram(glWater);
	gl.depthMask(false);
	gl.uniform1f(uAlpha,0.6); // прозрачност
	water.draw();

	requestAnimationFrame(drawFrame);
}
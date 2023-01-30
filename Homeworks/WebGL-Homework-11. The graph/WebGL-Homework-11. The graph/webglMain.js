let requestAnimationID;

var xFrom = document.getElementById("xFrom");
var xTo = document.getElementById("xTo");
var dataTop = [];

function switchProgram(prog) {
	glprog = prog;
	gl.useProgram(glprog);
	getVariables();
}

function start() {
	gl = getContext("picasso");
	glTop = getProgram(vShaderTop, fShaderTop);
	glBottom = getProgram(vShaderBottom,fShaderBottom);
	

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clearColor(1,1,1,1);

	dataBottom = origData;
	dataBottom = origData.map((e, k) => k % 2 == 1 ? ((e * 120) / gl.canvas.height - 0.87) : e);

	bufBottom = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufBottom);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dataBottom), gl.STATIC_DRAW);

	bufTop = gl.createBuffer();

	drawFrame();
}


var func = 1;
function drawFrame() {
	gl.clear(gl.COLOR_BUFFER_BIT);



	/// top part
	switchProgram(glTop);

	dataTop = [];
	for (var i = parseInt(xFrom.innerHTML); i <= xTo.innerHTML; ++i) {
		dataTop.push(i);
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, bufTop);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dataTop), gl.DYNAMIC_DRAW);
	
	gl.enableVertexAttribArray(aX);
	gl.vertexAttribPointer(aX,1,gl.FLOAT,false,0,0);

	gl.uniform1f(uXPoints, dataTop.length);
	gl.uniform1f(uFrom, xFrom.innerHTML);

	// sin
	gl.uniform1i(uFunc, 1);
	gl.vertexAttrib3f(aColor, 1, 0, 0);
	gl.drawArrays(gl.LINE_STRIP, 0, dataTop.length);

	// cos
	func = (func%numberOfFunctions) + 1;
	gl.uniform1i(uFunc, 2);
	gl.vertexAttrib3f(aColor, 0, 1, 0);
	gl.drawArrays(gl.LINE_STRIP, 0, dataTop.length);

	// third
	func = (func%numberOfFunctions) + 1;
	gl.uniform1i(uFunc, 3);
	gl.vertexAttrib3f(aColor, 0, 0, 1);
	gl.drawArrays(gl.LINE_STRIP, 0, dataTop.length);

	// fourth
	func = (func%numberOfFunctions) + 1;
	gl.uniform1i(uFunc, 4);
	gl.vertexAttrib3f(aColor, 0, 1, 1);
	gl.drawArrays(gl.LINE_STRIP, 0, dataTop.length);




	// bottom part
	switchProgram(glBottom);
	gl.vertexAttrib3f(aColor, 0, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, bufBottom);
	gl.enableVertexAttribArray(aXY);
	gl.vertexAttribPointer(aXY,2,gl.FLOAT,false,0,0);

	gl.drawArrays(gl.LINE_STRIP, 0, xPoints);
	gl.drawArrays(gl.LINE_STRIP, xPoints, xPoints);
	gl.drawArrays(gl.LINE_STRIP, 2*xPoints, xPoints);
	gl.drawArrays(gl.LINE_STRIP, 3*xPoints, xPoints);

	requestAnimationID = requestAnimationFrame(drawFrame); 	
}
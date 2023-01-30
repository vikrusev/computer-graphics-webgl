AlienCenter = function (center, size) {
	this.center = center;
	this.size = size;
	this.rot = [0, 0, 0];
	this.offset = [0, 0, 0];

	this.circlePoints = 32;

	var color = [255/255, 70/255, 0/255];

	var radius = 0.8;
	// the middle center + outer decoration
	var data = [].concat(0, 0, 0, [color[0], color[1], color[2]]);
	for (var i = 0; i < this.circlePoints; ++i) {
		var a = 5 * (2*i) * Math.PI / this.circlePoints;
		data.push(radius * Math.cos(a), radius * Math.sin(a), 0);
		data.push(color[0], color[1], color[2]);
	}

	radius = 0.71;
	color = [255/255, 232/255, 170/255];

	// the inner transparent part of the circle
	for (var i = 0; i < this.circlePoints; ++i) {
		var a = (2*i) * Math.PI / this.circlePoints;
		data.push(radius*Math.cos(a), radius*Math.sin(a), 0);
		data.push(color[0], color[1], color[2]);
	}

	var buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

	this.buf = buf;
}

AlienCenter.prototype.draw = function () {
	pushMatrix();

		gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);

		gl.enableVertexAttribArray(aXYZ);
		gl.vertexAttribPointer(aXYZ, 3, gl.FLOAT, false, 6*FLOATS, 0*FLOATS);

		gl.enableVertexAttribArray(aColor);
		gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 6*FLOATS, 3*FLOATS);

		gl.disableVertexAttribArray(aNormal);

		translate(this.offset);
		xRotate(90);
		useMatrix();

		gl.uniform3f(uAmbientColor, 1, 1, 1);

		// decoration
		gl.drawArrays(gl.POINTS, 0, 1)
		gl.drawArrays(gl.LINE_LOOP, 1, this.circlePoints);
		
		// inner transparent
		gl.uniform1f(uAlpha, 0.4);
		gl.drawArrays(gl.TRIANGLE_FAN, this.circlePoints + 1, this.circlePoints);

	popMatrix();

	gl.uniform3f(uAmbientColor, 0.3, 0.3, 0.3);
	gl.uniform1f(uAlpha, 1);
}

AlienCenter.prototype.getCoords = function () {
	return this.center;
}
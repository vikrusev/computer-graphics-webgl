Platform = function (center, size) {
	this.size = size;
	this.center = center;

	data = [ 0, 0, 0, 0, 0, 1,
			 size, 0, 0, size/2, 0, 1,
			 size, 0, -size, size/2, size/2, 1,
			 0, 0, -size, size/2, 0, 1];

	var buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

	this.buf = buf;

	gl.uniform1i(uSampler, 0);
	gl.activeTexture(gl.TEXTURE0);

	this.texture = gl.createTexture();
	this.texMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
	this.loadTexture();
}

Platform.prototype.loadTexture = function() {
	var image = new Image();

	var tempTexture = this.texture;
	image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, tempTexture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
		
		gl.generateMipmap(gl.TEXTURE_2D);
		
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	image.src = 'resources/textures/floor.jpg';
	
}

Platform.prototype.draw = function () {
		
	gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);

	gl.enableVertexAttribArray(aXYZ);
	gl.vertexAttribPointer(aXYZ, 3, gl.FLOAT, false, 6*FLOATS, 0*FLOATS);

	if (gl.isTexture(this.texture)) {
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		gl.enableVertexAttribArray(aST);
		gl.vertexAttribPointer(aST,3,gl.FLOAT,false,6*FLOATS,3*FLOATS);
	}
	else { 
		gl.disableVertexAttribArray(aST);
	}

	var m = texIdentity();
	texRotate(m, -45);
	this.texMatrix = m;

	useMatrix();
	
	gl.uniformMatrix3fv(uTexMatrix, false, this.texMatrix);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

}

Platform.prototype.setCenter = function (newCenter) {
	this.center = newCenter;
}

function texIdentity() {
	return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
}

function texRotate(m, a) {
	a = radians(a);
	var s = Math.sin(a);
	var c = Math.cos(a);
	
	a = m[0]*s+m[3]*c;
	m[0]=m[0]*c-m[3]*s;
	m[3]=a;
	
	a = m[1]*s+m[4]*c;
	m[1]=m[1]*c-m[4]*s;
	m[4]=a;
}
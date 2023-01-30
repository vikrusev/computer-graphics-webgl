Wall = function (center, size) {
	this.part = new Box(center, size);
	this.size = size;
	this.center = center;
	this.rot = 0;
}

Wall.prototype.draw = function () {
	pushMatrix();
	
		translate([this.center[0], this.size[1] / 2 + 0.001, this.center[2]]);
		yRotate(this.rot);
		this.part.draw();

	popMatrix();
}

Box = function(center, size)
{	
	var v = [ [+0.5,-0.5,-0.5], [+0.5,+0.5,-0.5],
			  [-0.5,+0.5,-0.5], [-0.5,-0.5,-0.5],
			  [+0.5,-0.5,+0.5], [+0.5,+0.5,+0.5],
			  [-0.5,+0.5,+0.5], [-0.5,-0.5,+0.5] ];

	var data = [].concat(
			  v[0],v[1],v[4],
			  v[4],v[1],v[5],
			  v[6],v[2],v[7],
			  v[7],v[2],v[3],
			  v[5],v[1],v[6],
			  v[6],v[1],v[2],
			  v[4],v[7],v[0],
			  v[0],v[7],v[3],
			  v[4],v[5],v[7],
			  v[7],v[5],v[6],
			  v[0],v[3],v[1],
			  v[1],v[3],v[2] );

	var buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	
	this.buf = buf;
	this.center = center;
	this.size = size;
	this.texture = undefined;

	this.setTexture();
}

Box.prototype.setTexture = function () {
	this.texture = this.texture3D();

	this.loadTexture3D(this.texture, gl.TEXTURE_CUBE_MAP_POSITIVE_X, 'resources/textures/wall.jpg');
	this.loadTexture3D(this.texture, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 'resources/textures/wall.jpg');
	this.loadTexture3D(this.texture, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 'resources/textures/wall.jpg');
	this.loadTexture3D(this.texture, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 'resources/textures/wall.jpg');
	this.loadTexture3D(this.texture, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 'resources/textures/posz.jpg');
	this.loadTexture3D(this.texture, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 'resources/textures/wall.jpg');
}

Box.prototype.texture3D = function () {
	var texture = gl.createTexture();
	texture.count = 6;

	return texture;
}

Box.prototype.loadTexture3D = function (texture, side, url) {
	var image = new Image();

	image.onload = function () {
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
		gl.texImage2D(side, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

		--texture.count;
		if (texture.count == 0) {
			gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

			// why is not this working ?????
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT);
	    	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);

			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		}

		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	};

	image.src = url;
}

Box.prototype.draw = function()
{	
	pushMatrix();

		scale(this.size);
		xRotate(-90);
		useMatrix();
		
		gl.bindBuffer(gl.ARRAY_BUFFER,this.buf);
		gl.enableVertexAttribArray(aXYZ);
		gl.vertexAttribPointer(aXYZ,3,gl.FLOAT,false,3*FLOATS,0*FLOATS);
		
		if (gl.isTexture(this.texture) && !this.texture.count) {
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
		}

		gl.drawArrays(gl.TRIANGLES,0,36);

	popMatrix();
}
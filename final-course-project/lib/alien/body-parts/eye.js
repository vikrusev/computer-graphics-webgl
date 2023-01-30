Eye = function () {
	this.eyetube = new EyeTube();
	this.eyeball = new Sphere([0, 0, 0.3], 0.08);

	this.rot = [0, 0, 0];
	this.offset = [0, 0, 0];
}

Eye.prototype.draw = function () {

	pushMatrix();
		if (this.rot) {
			if (this.rot[0]) zRotate(this.rot[0]);
			if (this.rot[1]) xRotate(this.rot[1]);
			if (this.rot[2]) zRotate(this.rot[2]);
		}

		translate(this.offset);
		xRotate(90);
		useMatrix();

		this.eyetube.draw();
		this.eyeball.draw();
	popMatrix();
}

EyeTube = function () {
	this.height = 0.25;
	this.part = new Cylinder([0, 0, 0], 0.04, this.height);
}

EyeTube.prototype.draw = function () {
	this.part.draw();
}

EyeTube.prototype.getHeight = function () {
	return this.height;
}
Alien = function (size, color) {

	this.size = size;
	this.center = new AlienCenter([0, 0, 0], size);

	this.leftLeg = new Leg(color);
	this.rightLeg = new Leg(color);
	this.body = new Body(color);
	this.leftEye = new Eye(color);
	this.rightEye = new Eye(color);

	this.color = color;
	this.rot = [0, 0, 0];

	this.moving = false;
	this.speed = 0.2;

	this.setDefaultPartRotations();

}

Alien.prototype.draw = function () {
	pushMatrix();
		
		if (this.rot) {
			if (this.rot[0]) zRotate(this.rot[0]);
			if (this.rot[1]) xRotate(this.rot[1]);
			if (this.rot[2]) zRotate(this.rot[2]);
		}

		var centerCoords = this.center.getCoords();
		scale([this.size, this.size, this.size]);
		handleCameraMovementMaze();
		handleCameraMovementCharacter();
		translate([centerCoords[0], 0.1, centerCoords[2]]);

		useMatrix();

		this.leftLeg.draw();
		this.rightLeg.draw();
		this.body.draw();
		this.leftEye.draw();
		this.rightEye.draw();
		this.center.draw();

	popMatrix();
}

Alien.prototype.setDefaultPartRotations = function () {
	this.center.rot = [0, 0, 0];
	this.leftLeg.rot = [15, 0, 0];
	this.rightLeg.rot = [-15, 0, 0];
	this.leftEye.rot = [-10, 0, 0];
	this.rightEye.rot = [10, 0, 0];

	this.center.offset = [0, -this.leftLeg.getHeight() / 2, 0];
	
	this.leftLeg.offset = [-1.3, 0, 0];
	this.rightLeg.offset = [1.3, 0, 0];
	
	this.body.offset = [0, 1, 0];
	
	this.leftEye.offset = [-0.06, 0.6, 0];
	this.rightEye.offset = [0.06, 0.6, 0];
}

// -1 is left leg, 1 is right leg
var leg = -1;

Alien.prototype.animate = function (frame) {
	var offsetX = this.leftLeg.offset[0];
	var offsetY = this.leftLeg.offset[1];
	var offsetZ = this.leftLeg.offset[2];

	if (this.moving) {
		if (frame % 3 == 0) {
			leg *= -1;
		}
		if (leg == -1) {
			this.leftLeg.offset = [offsetX, offsetY, (frame % 3) / 5];
			this.rightLeg.offset = [-offsetX, offsetY, -(frame % 3) / 5];
		}
		if (leg == 1) {
			this.leftLeg.offset = [offsetX, offsetY, -(frame % 3) / 5];
			this.rightLeg.offset = [-offsetX, offsetY, (frame % 3) / 5];	
		}
		
		return;
	}

	if (!this.moving) {
		this.leftLeg.offset = [offsetX, offsetY, 0];
		this.rightLeg.offset = [-offsetX, offsetY, 0];
	}
	
}

Alien.prototype.resize = function () {
	this.size += 0.1;
	this.speed += 0.1;
}
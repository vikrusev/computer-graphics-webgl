Leg = function (color) {
	this.part = new Spheroid([0, 0, 0], 
							[0.15, 0.1, 0.31], 
							color);

	this.offset = [0, 0, 0];
}

Leg.prototype.draw = function () {
	this.part.offset = this.offset;
	this.part.draw();
}

Leg.prototype.getHeight = function () {
	return this.part.size[1];
}
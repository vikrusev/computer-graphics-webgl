Body = function (color) {
	this.part = new Sphere([0, 0, 0], 0.32, color);

	this.offset = [0, 0, 0];
}

Body.prototype.draw = function () {
	this.part.offset = this.offset;
	this.part.draw();
}
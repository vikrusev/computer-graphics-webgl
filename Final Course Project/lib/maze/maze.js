Maze = function (size) {
	this.center = [size/2 - 1 - 0.15/2, 0, -size/2 + character.size];
	this.platform = new Platform([0, 0, 0], size);

	this.size = size;
	this.rot = [0, 0, 0];

	this.walls = [];
	this.bonuses = [];

	this.setWalls();
	this.setBonuses();
}

Maze.prototype.setWalls = function () {
	var shift = this.size / 2;

	var wallWidth = 0.15;
	var wallHeight = 1.5;
	var wallLength = 2;

	var wallDimensions = [wallLength, wallHeight, wallWidth];

	this.walls[0] = new Wall([-shift + (0.5 * wallWidth), 	0,  shift - (0.5 * wallLength)], 					wallDimensions);
	this.walls[1] = new Wall([-shift + (0.5 * wallWidth), 	0,  shift - (1.5 * wallLength)], 					wallDimensions);
	this.walls[2] = new Wall([-shift + (0.5 * wallLength), 	0,  shift - (2.0 * wallLength) - (0.5 * wallWidth)], wallDimensions);
	this.walls[3] = new Wall([-shift + (1.5 * wallLength), 	0,  shift - (2.0 * wallLength) - (0.5 * wallWidth)], wallDimensions);
	this.walls[4] = new Wall([-shift + wallLength + wallWidth / 2, 0,  shift - (0.5 * wallLength)], 		wallDimensions);
	this.walls[5] = new Wall([-shift + (1.5 * wallLength) + wallWidth, 	0,  shift - (0.5 * wallWidth)], wallDimensions);
	this.walls[6] = new Wall([-shift + (2.5 * wallLength) + wallWidth, 	0,  shift - (0.5 * wallWidth)], wallDimensions);
	this.walls[7] = new Wall([-shift + (3.5 * wallLength) + wallWidth, 	0,  shift - (0.5 * wallWidth)], wallDimensions);
	this.walls[8] = new Wall([-shift + (4.5 * wallLength) + wallWidth - 0.1, 	0,  shift - (0.5 * wallWidth)], [wallDimensions[0] - 0.1, wallDimensions[1], wallDimensions[2]]);
	this.walls[9] = new Wall([-shift + (2.5 * wallLength), 	0,  shift - (1.0 * wallLength) + (0.5 * wallWidth)], wallDimensions);
	this.walls[10] = new Wall([-shift + (2.5 * wallLength), 	0,  shift - (2.0 * wallLength) - (0.5 * wallWidth)], wallDimensions);
	this.walls[11] = new Wall([-shift + (3.0 * wallLength) - (0.5 * wallWidth), 	0,  shift - (1.5 * wallLength)], wallDimensions);
	this.walls[12] = new Wall([-shift + (4.0 * wallLength) - (0.5 * wallWidth), 	0,  shift - (0.5 * wallLength) - wallWidth], wallDimensions);
	this.walls[13] = new Wall([-shift + (5.0 * wallLength) - (0.5 * wallWidth), 	0,  shift - (0.5 * wallLength) - wallWidth], wallDimensions);
	this.walls[14] = new Wall([-shift + (5.0 * wallLength) - (0.5 * wallWidth), 	0,  shift - (1.5 * wallLength) - wallWidth], wallDimensions);
	this.walls[15] = new Wall([-shift + (5.0 * wallLength) - (0.5 * wallWidth), 	0,  shift - (2.5 * wallLength) - wallWidth], wallDimensions);
	this.walls[16] = new Wall([-shift + (5.0 * wallLength) - (0.5 * wallWidth), 	0,  shift - (4.5 * wallLength) - wallWidth + 0.11], [wallDimensions[0] - 0.075, wallDimensions[1], wallDimensions[2]]);
	this.walls[17] = new Wall([-shift + (4.0 * wallLength) - (0.5 * wallWidth), 	0,  shift - (2.5 * wallLength) - 0.08], [wallDimensions[0] - 0.15, wallDimensions[1], wallDimensions[2]]);
	this.walls[18] = new Wall([-shift + (2.0 * wallLength) - (0.5 * wallWidth), 	0,  shift - (2.5 * wallLength) - wallWidth], wallDimensions);
	this.walls[19] = new Wall([-shift + (1.0 * wallLength) - (0.5 * wallWidth), 	0,  shift - (2.5 * wallLength) - wallWidth], wallDimensions);
	this.walls[20] = new Wall([-shift + (0.0 * wallLength) + (0.5 * wallWidth), 	0,  shift - (2.5 * wallLength) - wallWidth], wallDimensions);
	this.walls[21] = new Wall([-shift + (0.0 * wallLength) + (0.5 * wallWidth), 	0,  shift - (3.5 * wallLength) - wallWidth + 0.05], [wallDimensions[0] - 0.05, wallDimensions[1], wallDimensions[2]]);
	this.walls[22] = new Wall([-shift + (3.0 * wallLength) - (0.5 * wallWidth), 	0,  shift - (3.5 * wallLength) - wallWidth], wallDimensions);
	this.walls[23] = new Wall([-shift + (2.0 * wallLength) - (0.5 * wallWidth), 	0,  shift - (4.5 * wallLength) - (0.5 * wallWidth)], [wallDimensions[0] - 0.15, wallDimensions[1], wallDimensions[2]]);
	this.walls[24] = new Wall([-shift + (1.0 * wallLength) - (0.5 * wallWidth), 	0,  shift - (4.5 * wallLength) - (0.5 * wallWidth) + 0.05], [wallDimensions[0] - 0.05, wallDimensions[1], wallDimensions[2]]);
	this.walls[25] = new Wall([-shift + (0.5 * wallLength) + (0.5 * wallWidth), 	0,  shift - (4.0 * wallLength) - wallWidth + 0.15], [wallDimensions[0] - 0.15, wallDimensions[1], wallDimensions[2]]);
	this.walls[26] = new Wall([-shift + (1.5 * wallLength) + (0.5 * wallWidth) - 0.15, 	0,  shift - (3.0 * wallLength) - wallWidth - 0.075], [wallDimensions[0] + 0.15, wallDimensions[1], wallDimensions[2]]);
	this.walls[27] = new Wall([-shift + (1.5 * wallLength) + (0.5 * wallWidth) - 0.15, 	0,  shift - (5.0 * wallLength) + (0.5 * wallWidth)], [wallDimensions[0] - 0.15, wallDimensions[1], wallDimensions[2]]);
	this.walls[28] = new Wall([-shift + (2.5 * wallLength) + (0.5 * wallWidth) - 0.15, 	0,  shift - (5.0 * wallLength) + (0.5 * wallWidth)], [wallDimensions[0] - 0.15, wallDimensions[1], wallDimensions[2]]);
	this.walls[29] = new Wall([-shift + (3.5 * wallLength) - 0.15, 	0,  shift - (5.0 * wallLength) + (0.5 * wallWidth)], wallDimensions);
	this.walls[30] = new Wall([-shift + (4.5 * wallLength) - 0.15, 	0,  shift - (5.0 * wallLength) + (0.5 * wallWidth)], wallDimensions);
	this.walls[31] = new Wall([-shift + (3.5 * wallLength) - 0.07, 	0,  shift - (4.0 * wallLength) - (0.5 * wallWidth)], [wallDimensions[0] - 0.15, wallDimensions[1], wallDimensions[2]]);
	this.walls[32] = new Wall([-shift + (3.5 * wallLength) - 0.15, 	0,  shift - (3.0 * wallLength) - (0.5 * wallWidth)], wallDimensions);
	this.walls[33] = new Wall([-shift + (4.5 * wallLength) - 0.15, 	0,  shift - (3.0 * wallLength) - (0.5 * wallWidth)], wallDimensions);
	this.walls[34] = new Wall([-shift + (5.0 * wallLength) - (0.5 * wallWidth), 	0,  shift - (3.5 * wallLength) - (0.5 * wallWidth)], wallDimensions);

	this.setWallYRotates();
}

Maze.prototype.setBonuses = function () {
	var size = 0.1;
	var color = [1, 0, 0];
	var shift = this.size / 2;

	var wallWidth = 0.15;
	var wallHeight = 1.5;
	var wallLength = 2;

	this.bonuses[0] = new Sphere([-shift + wallLength / 2 + wallWidth / 2, 2 * size, shift - wallLength], size, color);
	this.bonuses[1] = new Sphere([-shift + 2.5 * wallLength, 2 * size, shift - 1.5 * wallLength], size, color);
	this.bonuses[2] = new Sphere([-shift + wallLength / 2 + wallWidth / 2, 2 * size, shift - 2.5 * wallLength], size, color);
	this.bonuses[3] = new Sphere([-shift + 1.5 * wallLength, 2 * size, shift - 4.5 * wallLength], size, color);
	this.bonuses[4] = new Sphere([-shift + 3.5 * wallLength, 2 * size, shift - 0.5 * wallLength], size, color);
	this.bonuses[5] = new Sphere([-shift + 3.5 * wallLength, 2 * size, shift - 3.5 * wallLength], size, color);
	this.bonuses[6] = new Sphere([-shift + 4.5 * wallLength, 2 * size, shift - 4.5 * wallLength], size, color);
	this.bonuses[7] = new Sphere([-shift + 4.5 * wallLength, 2 * size, shift - 2.5 * wallLength], size, color);
}

Maze.prototype.setWallYRotates = function () {
	this.walls[0].rot = 90;
	this.walls[1].rot = 90;
	this.walls[4].rot = 90;
	this.walls[11].rot = 90;
	this.walls[12].rot = 90;
	this.walls[13].rot = 90;
	this.walls[14].rot = 90;
	this.walls[15].rot = 90;
	this.walls[16].rot = 90;
	this.walls[17].rot = 90;
	this.walls[18].rot = 90;
	this.walls[19].rot = 90;
	this.walls[20].rot = 90;
	this.walls[21].rot = 90;
	this.walls[22].rot = 90;
	this.walls[23].rot = 90;
	this.walls[24].rot = 90;
	this.walls[34].rot = 90;
}

Maze.prototype.draw = function () {
	pushMatrix();

		if (this.rot) {
			if (this.rot[0]) zRotate(this.rot[0]);
			if (this.rot[1]) xRotate(this.rot[1]);
			if (this.rot[2]) zRotate(this.rot[2]);
		}

		handleCameraMovementMaze();
		translate([this.center[0] - this.size/2, this.center[1], this.center[2] + this.size/2]);
		this.platform.draw();

		switchProgram(glAlien);
			handleCameraMovementMaze();
			translate([this.center[0], this.center[1], this.center[2]]);
			this.bonuses.forEach(function(bonus) {
				bonus.draw();
			});

		switchProgram(glMazeWall);
			handleCameraMovementMaze();
			translate([this.center[0], this.center[1], this.center[2]]);

			this.walls.forEach(function(wall) {
				wall.draw();
			});

	popMatrix();
};

Maze.prototype.move = function (newCenter) {
	this.center = [this.center[0] - newCenter[0],
					this.center[1] - newCenter[1],
					this.center[2] - newCenter[2]];

	this.platform.setCenter(this.center);
}
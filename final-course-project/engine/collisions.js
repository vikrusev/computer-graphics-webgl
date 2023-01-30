function isOutsideMap() {
	if (Math.abs(maze.center[0]) > maze.size / 2 - character.size / 2 || 
		Math.abs(maze.center[2]) > maze.size / 2 - character.size / 2) 
	{
		return true;
	}
}

function isWallCollision() {
	for (var index in maze.walls) {

		var wall = maze.walls[index];
		var wallCoords = [wall.center[0] + maze.center[0],
							wall.center[1] + maze.center[1],
							wall.center[2] + maze.center[2]];

		if (wall.rot == 0 && // only horizontal
			Math.abs(wallCoords[0]) <= wall.size[0] / 2 + character.size / 4 && //those in the Y sector
			Math.sign(wallCoords[2]) * wallCoords[2] < character.size / 2)
		{
			return true;
		}

		if (wall.rot == 90 && // only vertical
			Math.abs(wallCoords[2]) <= wall.size[0] / 2 + character.size / 4 && //those in the X sector
			Math.sign(wallCoords[0]) * wallCoords[0] < character.size / 2)
		{
			return true;
		}

	};

	return false;
}

function isBonusCollision() {
	var size = 0;

	if (maze.bonuses[0] != undefined) {
		size = maze.bonuses[0].size;
	}

	for (var index in maze.bonuses) {

		var bonus = maze.bonuses[index];
		var bonusCoords = [bonus.center[0] + maze.center[0],
							bonus.center[1] + maze.center[1],
							bonus.center[2] + maze.center[2]];

		if (findDistance(bonusCoords) < character.size / 2) {
			character.resize();
			maze.bonuses.splice(index, 1);

			if (maze.bonuses.length == 0) {
				endGame();
			}
		}

	}
}

function findDistance(coords) {
	return Math.sqrt(coords[0] * coords[0] + coords[1] * coords[1] + coords[2] * coords[2]);
}
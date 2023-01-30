$(document).ready(function() {

	var step = 0.2;

	var frame = 0;

	var toForward = 0;
	var toLeft = 1;
	var toRight = 2;
	var toBackward = 3;
	
	document.addEventListener('keydown', function(e) {

		var speed = character.speed;

		switch (e.keyCode) {
			case 87: moveForward(speed); break;
			case 65: moveLeft(speed); break;
			case 83: moveBackward(speed); break;
			case 68: moveRight(speed); break;
			case 38: moveForward(speed); break;
			case 37: moveLeft(speed); break;
			case 40: moveBackward(speed); break;
			case 39: moveRight(speed); break;
			case 32: moveJump(); break;
			default: break;
		}

	});

	document.addEventListener('keyup', function(e) {

		var code = e.keyCode;
		if (code == 87 || code == 65 || code == 83
			 || code == 68 || code == 38 || code == 37
			  || code == 40 || code == 39 || code == 32)
		{
			character.moving = false;
			character.animate();
		}

	});

	function moveForward(speed) {
		character.moving = true;

		yRotateA = toForward;
		maze.move([0, 0, (-1)*step*speed]);
		
		if (!canMove()) {
			maze.move([0, 0, step*speed]);
			return;
		}

		++frame;
		character.animate(frame);
		isBonusCollision();
	}

	function moveLeft(speed) {
		character.moving = true;

		yRotateA = toLeft;
		maze.move([(-1)*step*speed, 0, 0]);
		
		if (!canMove()) {
			maze.move([step*speed, 0, 0]);
			return;
		}

		++frame;
		character.animate(frame);
		isBonusCollision();
	}

	function moveBackward(speed) {
		character.moving = true;

		yRotateA = toBackward;
		maze.move([0, 0, step*speed]);
		
		if (!canMove()) {
			maze.move([0, 0, (-1)*step*speed]);
			return;
		}

		--frame;
		character.animate(frame);
		isBonusCollision();
	}

	function moveRight(speed) {
		character.moving = true;

		yRotateA = toRight;
		maze.move([step*speed, 0, 0]);

		if (!canMove()) {
			maze.move([(-1)*step*speed, 0, 0]);
			return;
		}

		--frame;
		character.animate(frame);
		isBonusCollision();
	}

	function moveJump() {
		/*for (var i = 0; i < 360; ++i) {
			maze.move([0, 0.2 * Math.sin(0.3*i), 0]);
		}*/
	}

	function canMove() {

		if (isOutsideMap()) {
			return false;
		}

		return !isWallCollision();
	}
	
});
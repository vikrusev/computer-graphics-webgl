$('canvas').mousedown(function(e) {
	if (e.which === 3) {
		$(this).addClass('rotate');

		var posXFrom = e.clientX;
		var posYFrom = e.clientY;

		$(this).mousemove(function(e) { 
			var updateX = (e.clientX - posXFrom);
			var updateY = (e.clientY - posYFrom);

			yRotateM += updateX;
			yRotateM = Math.max(Math.min(yRotateM, 45), -45);

			xRotateM -= updateY;
			xRotateM = Math.max(Math.min(xRotateM, 40), -45);

			posXFrom += updateX;
			posYFrom += updateY;
		});
	}
});

$('canvas').contextmenu(function(e) {
	e.preventDefault();

	if (e.which === 3) {
		$('canvas').removeClass('rotate');
		$('canvas').off('mousemove');
	}
});
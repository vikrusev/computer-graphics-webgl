var CONTROL_POINTS = 4;
var p1 = [];
var surf = [];
var waterHeight = 50;
M = 32;
dM = M-3;
cpX = M;


function createBezierTerrain() {
	createControlPointsNet();
	createTerrain();
	createBSplines();
}

// създаване на контролни точки в двумерен масив
function createControlPointsNet() {
	for (var i = 0; i <= M; ++i) { // по височината на лентата
		p1[i] = [];
		for (var j = 0; j <= cpX; ++j) {
			p1[i][j] = [6.5*j-100,waterHeight/2,6.5*i-100];
		}
	}
}

function terrain(x1, y1, x2, y2) {
	var xm = (x1 + x2) / 2;
	var ym = (y1 + y2) / 2;
	
	for (var i = 1; i < 2; ++i) {
		p1[xm][y1][i] = (p1[x1][y1][i] + p1[x2][y1][i]) / 2;
		p1[xm][y2][i] = (p1[x1][y2][i] + p1[x2][y2][i]) / 2;
		p1[x1][ym][i] = (p1[x1][y1][i] + p1[x1][y2][i]) / 2;
		p1[x2][ym][i] = (p1[x2][y1][i] + p1[x2][y2][i]) / 2;
		p1[xm][ym][i] = (p1[xm][y1][i] + p1[xm][y2][i]) / 2;

		var k = (x2 - x1) / ((i == 1) ? 0.4 : 0.7);
		p1[xm][y1][i] += random(-k,k);
		p1[xm][y2][i] += random(-k,k);
		p1[x1][ym][i] += random(-k,k);
		p1[x2][ym][i] += random(-k,k);
		p1[xm][ym][i] += random(-k,k);
	}
}

function createTerrain() {
	var size = M;

	while (size > 1) {
		for (var x = 0; x < M; x += size)
			for (var y = 0; y < M; y += size)
				terrain(x, y, x + size, y + size);
		size /= 2;
	}
}

function setBSplineData(index, y, x0, x1, x2, x3) {

	// четири поредни надлъжни по лентата индекса
	var y0 = y, y1 = y + 1, y2 = y + 2, y3 = y + 3;

	surf[index] = new BSplineSurface();
	surf[index].color = [0.8,0.5,0.2];
	surf[index].set(
		[
			[ p1[y0][x0], p1[y0][x1], p1[y0][x2], p1[y0][x3] ],
			[ p1[y1][x0], p1[y1][x1], p1[y1][x2], p1[y1][x3] ],
			[ p1[y2][x0], p1[y2][x1], p1[y2][x2], p1[y2][x3] ],
			[ p1[y3][x0], p1[y3][x1], p1[y3][x2], p1[y3][x3] ]
		] );
}

function createBSplines() {

	// централен сплайн j=[0,1,2,3]
	for (var x = 0; x < cpX - 3; ++x) {
		for (var y = 0; y < dM; ++y) {

			var splineIndex = y + x * dM;
			
			setBSplineData(splineIndex, y, x, x + 1, x + 2, x + 3);
		}
	}

	// set the inner splines only for the first spline
	for (var y = 0; y < dM; ++y) {
		// xLine - work with the last line
		var xLine = cpX - 3 - 1;

		// x - use the control points of line #0
		var x = 0;

		var splineIndex = y+xLine*dM;

		// сплайн, долепен от вътрешната страна на централния j = [0,0,1,2]
		setBSplineData(splineIndex + dM, y, x, x, x + 1, x + 2);
			
		// най-вътрешен периферен сплайн j = [0,0,0,1]
		setBSplineData(splineIndex + 2*dM, y, x, x, x, x + 1);
	}

	// set the outer splines only for the last spline
	for (var y = 0; y < dM; ++y) {

		var x = cpX-3-1;

		var splineIndex = y+x*dM;

		// сплайн, долепен от външната страна на централния j = [1,2,3,3]
		setBSplineData(splineIndex + 3*dM, y, x + 1, x + 2, x + 3, x + 3);

		// най-външен периферен сплайн j = [2,3,3,3]
		setBSplineData(splineIndex + 4*dM, y, x + 2, x + 3, x + 3, x + 3);
	}	
}




/*p = [];
for (var i = 0; i < CONTROL_POINTS; ++i) {
	p[i] = [];
	for (var j = 0; j < CONTROL_POINTS; ++j) {
		p[i][j] = new Sphere([(200/3)*j-100,0,(200/3)*i-100], 1);
	}
}*/
let origData = [];
let maxY = -999999;
var minY = 999999;
var xPoints = 5000;
var numberOfFunctions = 0;

var sin = function(a) {
	var sin = Math.sin(1/25 * a);

	return Math.pow(sin, 4)/6 + Math.pow(sin, 2)/6 + sin/6 - a/2000;
};

var cos = function(a) {
	var cos = Math.cos(1/25 * a);

	return Math.pow(cos, 4)/6 + Math.pow(cos, 6)/6 + cos/2 + a/2000;
}
	
var third = function (a) {
	var sin = Math.sin(1/25 * a);
	var cos = Math.sin(1/25 * a);

	return Math.pow(sin, 5) + Math.pow(sin, 2) + cos/6 + a/20000;
}

var fourth = function(a) {
	var sin = Math.sin(1/25 * (a + 55));
	
	return Math.pow(sin, 5) + a/200000 - 1.2;
}

function makeFunction(func, num) {
	numberOfFunctions++;

	for (var i = 1; i <= xPoints; ++i) {
		var x = i/xPoints;
		var y = func(i);
		if (y > maxY) {
			maxY = y;
		}
		else if (y < minY) {
			minY = y;
		}

		origData.push(2*x-1);
		origData.push(y);
	}
}


makeFunction(sin, 1);
makeFunction(cos, 2);
makeFunction(third, 3);
makeFunction(fourth, 4);

origData = origData.map((e, k) => k % 2 == 1 ? e / Math.max(Math.abs(maxY), Math.abs(minY)) : e);
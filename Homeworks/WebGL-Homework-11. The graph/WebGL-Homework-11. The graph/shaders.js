var vShaderBottom =
	'attribute vec2 aXY;'+
	'attribute vec3 aColor;'+
	''+
	'varying vec3 vColor;'+
	''+
	'void main ()'+
	'{'+
	'	gl_Position = vec4(aXY, 0, 1);'+
	'	vColor = aColor;'+
	'}';
	
var fShaderBottom =
	'precision mediump float;'+
	''+
	'varying vec3 vColor;'+
	''+
	'void main( )'+
	'{'+
	'	gl_FragColor = vec4(vColor, 1);'+
	'}';


var vShaderTop =
	'attribute float aX;'+
	'attribute vec3 aColor;'+
	''+
	'uniform float uXPoints;'+
	'uniform float uFrom;'+
	'uniform int uFunc;'+
	''+
	'varying vec3 vColor;'+
	''+
	'float findYSin(float x) {'+
	'	float sinX = sin(x / 25.0);'+
	'	return pow(sinX, 4.0) / 6.0 + pow(sinX, 2.0) / 6.0 + sinX / 6.0 - x/2000.0;'+
	'}'+
	''+
	'float findYCos(float x) {'+
	'	float cosX = cos(x / 25.0);'+
	'	return pow(cosX, 4.0) / 6.0 + pow(cosX, 6.0) / 6.0 + cosX / 2.0 + x/2000.0;'+
	'}'+
	''+
	'float findYThird(float x) {'+
	'	float sinX = sin(x / 25.0);'+
	'	float cosX = cos(x / 25.0);'+
	'	return pow(sinX, 5.0) + pow(sinX, 2.0) + cosX / 6.0 + x / 20000.0;'+
	'}'+
	''+
	'float findYFourth(float x) {'+
	'	float sinX = sin((x + 55.0) / 25.0);'+
	''+
	'	return pow(sinX, 5.0) + x / 20000.0 - 1.2;'+
	'}'+
	''+
	'void main ()'+
	'{'+
	'	float x = (aX - uFrom) / uXPoints;'+
	'	float y;'+
	''+
	'	if (uFunc == 1) {'+
	'		y = findYSin(aX);'+
	'	}'+
	'	if (uFunc == 2) {'+
	'		y = findYCos(aX);'+
	'	}'+
	'	if (uFunc == 3) {'+ 
	'		y = findYThird(aX);'+
	'	}'+
	'	if (uFunc == 4) {'+
	'		y = findYFourth(aX);'+
	'	}'+
	''+
	'	gl_Position = vec4(2.0 * x - 1.0, y / 3.27, 0, 1);'+
	'	vColor = aColor;'+
	'}';
	
var fShaderTop =
	'precision mediump float;'+
	''+
	'varying vec3 vColor;'+
	''+
	'void main()'+
	'{'+
	'	gl_FragColor = vec4(vColor, 1);'+
	'}';
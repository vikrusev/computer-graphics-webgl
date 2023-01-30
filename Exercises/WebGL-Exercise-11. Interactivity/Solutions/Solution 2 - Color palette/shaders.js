var vShader =
	'uniform mat4 uProjectionMatrix;'+
	'uniform mat4 uViewMatrix;'+
	'uniform mat4 uModelMatrix;'+
	''+
	'attribute vec3 aXYZ;'+
	'attribute vec3 aColor;'+
	'varying vec3 vColor;'+
	''+
	'void main ()'+
	'{'+
	'	gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aXYZ,1);'+
	'	vColor = aColor;'+
	'}';
	
var fShader =
	'precision mediump float;'+
	'varying vec3 vColor;'+
	''+
	'void main( )'+
	'{'+
	'	gl_FragColor = vec4(vColor,1.0);'+
	'}';

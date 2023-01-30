var vShader =
	'uniform mat4 uProjectionMatrix;'+
	'uniform mat4 uViewMatrix;'+
	'uniform mat4 uModelMatrix;'+
	''+
	'attribute vec3 aXYZ;'+
	'attribute vec3 aColor;'+
	''+
	'varying vec4 vColor;'+
	''+
	'void main ()'+
	'{'+
	'	gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aXYZ,1);'+
	'	vColor = vec4(aColor,1);'+
	'}';
	
var fShader =
	'precision mediump float;'+
	'varying vec4 vColor;'+
	'void main( )'+
	'{'+
	'	gl_FragColor = vColor;'+
	'}';

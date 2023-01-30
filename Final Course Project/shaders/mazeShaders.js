var vShaderMaze =
	'uniform mat4 uProjectionMatrix;'+
	'uniform mat4 uViewMatrix;'+
	'uniform mat4 uModelMatrix;'+
	''+
	'attribute vec3 aXYZ;'+
	'attribute vec3 aST;'+
	''+
	'varying vec3 vST;'+
	''+
	'void main ()'+
	'{'+
	'	mat4 mvMatrix = uViewMatrix * uModelMatrix;'+
	'	gl_Position = uProjectionMatrix * mvMatrix * vec4(aXYZ, 1);'+
	''+
	'	vST = aST;'+
	'}';
	
var fShaderMaze =
	'precision mediump float;'+
	''+
	'uniform sampler2D uSampler;'+
	'uniform mat3 uTexMatrix;'+
	''+
	'varying vec3 vST;'+
	''+
	'void main( )'+
	'{'+
	'	gl_FragColor = texture2D(uSampler, (uTexMatrix * vST).st);'+
	'}';
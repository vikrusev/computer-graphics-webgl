var vShader =
	'uniform mat4 uProjectionMatrix;'+
	'uniform mat4 uViewMatrix;'+
	'uniform mat4 uModelMatrix;'+
	''+
	'attribute vec3 aXYZ;'+
	'varying vec3 vXYZ;'+
	''+
	'void main ()'+
	'{'+
	'	mat4 mvMatrix = uViewMatrix * uModelMatrix;'+
	'	gl_Position = uProjectionMatrix * mvMatrix * vec4(aXYZ,1);'+
	'	vXYZ = aXYZ;'+
	'}';
	
var fShader =
	'precision mediump float;'+
	'uniform samplerCube uTexUnit;'+
	'varying vec3 vXYZ;'+
	''+
	'void main( )'+
	'{'+
	'	gl_FragColor = textureCube(uTexUnit,vXYZ);'+
	'}';

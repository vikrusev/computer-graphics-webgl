var vShaderSky =
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
	
var fShaderSky =
	'precision mediump float;'+
	'uniform samplerCube uTexUnit;'+
	'varying vec3 vXYZ;'+
	''+
	'void main( )'+
	'{'+
	'	gl_FragColor = textureCube(uTexUnit,vXYZ);'+
	'}';




var vShaderSphere =
	'uniform mat4 uProjectionMatrix;'+
	'uniform mat4 uViewMatrix;'+
	'uniform mat4 uModelMatrix;'+
	'uniform mat4 uNormalMatrix;'+
	'uniform bool uUseNormalMatrix;'+
	''+
	'uniform vec3 uAmbientColor;'+
	'uniform vec3 uDiffuseColor;'+
	''+
	'uniform vec3 uLightDir;'+
	''+
	'attribute vec3 aXYZ;'+
	'attribute vec2 aST;'+
	'attribute vec3 aColor;'+
	'attribute vec3 aNormal;'+
	''+
	'varying vec3 vST;'+
	'varying vec3 vColor;'+
	''+
	'void main ()'+
	'{'+
	'	mat4 mvMatrix = uViewMatrix * uModelMatrix;'+
	'	gl_Position = uProjectionMatrix * mvMatrix * vec4(aXYZ,1);'+
	'	mat4 nMatrix = uUseNormalMatrix?uNormalMatrix:mvMatrix;'+
	''+
	'	vST = vec3(aST,1);'+
	'	vColor = uAmbientColor*aColor;'+
	''+
	'	vec3 light = normalize(-uLightDir);'+
	'	vec3 normal = vec3(normalize(nMatrix*vec4(aNormal,0)));'+
	'	vColor += aColor*uDiffuseColor*abs(dot(normal,light));'+
	'}';
	
var fShaderSphere =
	'precision mediump float;'+
	'uniform sampler2D uSampler;'+
	'uniform mat3 uTexMatrix;'+
	''+
	'varying vec3 vST;'+
	'varying vec3 vColor;'+
	'void main( )'+
	'{'+
	'	vec4 texCol = texture2D(uSampler,(uTexMatrix*vST).st);'+
	'	gl_FragColor = texCol*vec4(vColor,1.0)*2.0;'+
	'}';

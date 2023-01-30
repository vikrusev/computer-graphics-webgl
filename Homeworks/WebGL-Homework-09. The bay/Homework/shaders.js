var vShaderWater =
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
	'attribute vec3 aColor;'+
	'attribute vec3 aNormal;'+
	''+
	'varying vec3 vColor;'+
	''+
	'void main ()'+
	'{'+
	'	mat4 mvMatrix = uViewMatrix * uModelMatrix;'+
	'	gl_Position = uProjectionMatrix * mvMatrix * vec4(aXYZ,1);'+
	'	mat4 nMatrix = uUseNormalMatrix?uNormalMatrix:mvMatrix;'+
	''+
	'	vColor = uAmbientColor*aColor;'+
	''+
	'	vec3 light = normalize(-uLightDir);'+
	'	vec3 normal = vec3(normalize(nMatrix*vec4(aNormal,0)));'+
	'	vColor += aColor*uDiffuseColor*max(dot(normal,light),0.0);'+
	'}';

var vShaderMountain =
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
	'attribute vec3 aColor;'+
	'attribute vec3 aNormal;'+
	''+
	'varying vec3 vColor;'+
	'varying vec3 vXYZ;'+
	''+
	'void main ()'+
	'{'+
	'	mat4 mvMatrix = uViewMatrix * uModelMatrix;'+
	'	gl_Position = uProjectionMatrix * mvMatrix * vec4(aXYZ,1);'+
	'	mat4 nMatrix = uUseNormalMatrix?uNormalMatrix:mvMatrix;'+
	''+
	'	vColor = uAmbientColor*aColor;'+
	''+
	'	vec3 light = normalize(-uLightDir);'+
	'	vec3 normal = vec3(normalize(nMatrix*vec4(aNormal,0)));'+
	'	vColor += aColor*uDiffuseColor*max(dot(normal,light),0.0);'+
	'	vXYZ = aXYZ;'+
	'}';

var vShaderWall =
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
	'attribute vec3 aColor;'+
	'attribute vec3 aNormal;'+
	''+
	'varying vec3 vColor;'+
	''+
	'void main ()'+
	'{'+
	'	mat4 mvMatrix = uViewMatrix * uModelMatrix;'+
	'	gl_Position = uProjectionMatrix * mvMatrix * vec4(aXYZ,1);'+
	'	mat4 nMatrix = uUseNormalMatrix?uNormalMatrix:mvMatrix;'+
	''+
	'	vColor = uAmbientColor*aColor;'+
	''+
	'	vec3 light = normalize(-uLightDir);'+
	'	vec3 normal = vec3(normalize(nMatrix*vec4(aNormal,0)));'+
	'	vColor += aColor*uDiffuseColor*max(dot(normal,light),0.0);'+
	'}';
	
var fShaderWater =
	'precision mediump float;'+
	'varying vec3 vColor;'+
	'uniform float uAlpha;'+
	'void main( )'+
	'{'+
	'	gl_FragColor = vec4(vColor,uAlpha);'+
	'}';

var fShaderMountain =
	'precision mediump float;'+
	'varying vec3 vColor;'+
	'varying vec3 vXYZ;'+
	'uniform float uAlpha;'+
	''+
	'vec3 findColor(vec3 y)'+
	'{'+
	'	if(y.y < 25.0) return vec3(0.0,0.0,1.0);'+
	'	if(y.y < 28.0) return vec3(1.0,1.0,0.0);'+
	'	if(y.y < 45.0) return vec3(0.0,1.0,0.0);'+
	'	return vec3(1.0,1.0,1.0);'+
	'}'+
	''+
	'void main( )'+
	'{'+
	'	vec3 color = vColor;'+
	'	color += findColor(vXYZ);'+
	'	gl_FragColor = vec4(color,uAlpha);'+
	'}';
	
var fShaderWall =
	'void main( )'+
	'{'+
	'	gl_FragColor = vec4(0,0,0,1);'+
	'}';
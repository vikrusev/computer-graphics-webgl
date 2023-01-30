var vShader =
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
	'varying vec4 vXYZT;'+
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
	'	vXYZT = uModelMatrix*vec4(aXYZ,1.0);'+
	'}';
	
var fShader =
	'precision mediump float;'+
	'uniform sampler2D uTexUnit;'+
	'uniform sampler2D uNightUnit;'+
	'uniform mat3 uTexMatrix;'+
	'uniform vec4 uClipPlane;'+
	''+
	'varying vec3 vST;'+
	'varying vec3 vColor;'+
	'varying vec4 vXYZT;'+
	'void main( )'+
	'{'+
	'	float k = clamp(0.0,1.0,2.0*dot(vXYZT,uClipPlane))+0.2;'+
	'	k = smoothstep(0.0,1.0,k);'+
	'	vec4 texCol1 = texture2D(uTexUnit,(uTexMatrix*vST).st);'+
	'	vec4 texCol2 = texture2D(uNightUnit,(uTexMatrix*vST).st);'+
	'	vec4 texCol = texCol2*(1.0-k)+k*texCol1;'+
	'	gl_FragColor = texCol*vec4(vColor,1.0);'+
	'}';

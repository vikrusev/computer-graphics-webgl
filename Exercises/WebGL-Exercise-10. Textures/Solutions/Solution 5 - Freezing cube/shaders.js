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
	
var fShader =
	'precision mediump float;'+
	'uniform sampler2D uMossUnit;'+
	'uniform sampler2D uIceUnit;'+
	'uniform sampler2D uTimeUnit;'+
	'uniform mat3 uTexMatrix;'+
	'uniform float uTime;'+
	''+
	'varying vec3 vST;'+
	'varying vec3 vColor;'+
	'void main( )'+
	'{'+
	'	vec4 texCol1 = texture2D(uMossUnit,(uTexMatrix*vST).st);'+
	'	vec4 texCol2 = texture2D(uIceUnit,(uTexMatrix*vST).st);'+
	'	float k = uTime+texture2D(uTimeUnit,(uTexMatrix*vST).st).r;'+
	'	if(k>1.0){k=1.0;}'+
	'	if(k<0.0){k=0.0;}'+
	'	vec4 texCol = texCol1*k+(1.0-k)*texCol2;'+
	'	gl_FragColor = texCol*vec4(vColor,1.0);'+
	'}';

var vShader =
	'uniform mat4 uProjectionMatrix;'+
	'uniform mat4 uViewMatrix;'+
	'uniform mat4 uModelMatrix;'+
	'uniform mat4 uNormalMatrix;'+
	'uniform bool uUseNormalMatrix;'+
	''+
	'uniform vec3 uAmbientColor;'+
	'uniform vec3 uDiffuseColor;'+
	'uniform bool uSelectMode;'+
	'uniform vec3 uLightDir;'+
	''+
	'attribute vec3 aXYZ;'+
	'attribute vec2 aST;'+
	'attribute vec3 aColor;'+
	'attribute vec3 aNormal;'+
	''+
	'varying vec3 vST;'+
	'varying vec3 vColor;'+
	'varying float vW;'+
	''+
	'void main ()'+
	'{'+
	'	mat4 mvMatrix = uViewMatrix * uModelMatrix;'+
	'	gl_Position = uProjectionMatrix * mvMatrix * vec4(aXYZ,1);'+
	'	if (!uSelectMode)'+
	'	{'+
	'		mat4 nMatrix = uUseNormalMatrix?uNormalMatrix:mvMatrix;'+
	''+
	'		vST = vec3(aST,1);'+
	'		vColor = uAmbientColor*aColor;'+
	''+
	'		vec3 light = normalize(-uLightDir);'+
	'		vec3 normal = vec3(normalize(nMatrix*vec4(aNormal,0)));'+
	'		vColor += aColor*uDiffuseColor*abs(dot(normal,light));'+
	'		vW = (uProjectionMatrix * mvMatrix * vec4(aXYZ,1)).w;'+
	'	}'+
	'}';
	
var fShader =
	'precision mediump float;'+
	'uniform sampler2D uTexUnit;'+
	'uniform mat3 uTexMatrix;'+
	'uniform float uDist;'+
	''+
	'uniform bool uSelectMode;'+
	'uniform vec3 uSelectColor;'+
	''+
	'varying vec3 vST;'+
	'varying vec3 vColor;'+
	'varying float vW;'+
	'void main( )'+
	'{'+
	'	if (uSelectMode)'+
	'	{'+
	'		gl_FragColor = vec4(uSelectColor,1.0);'+
	'	}'+
	'	else'+
	'	{'+
	'		vec4 texCol = texture2D(uTexUnit,(uTexMatrix*vST).st);'+
	'		gl_FragColor = vec4(vec3(texCol)*vColor,1.0);'+
	'	}'+
	'}';

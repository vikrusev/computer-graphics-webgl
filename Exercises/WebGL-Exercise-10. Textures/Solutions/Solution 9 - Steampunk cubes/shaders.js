var vShader =
	'uniform mat4 uProjectionMatrix;'+
	'uniform mat4 uViewMatrix;'+
	'uniform mat4 uModelMatrix;'+
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
	'varying vec3 vColor;'+
	'varying vec3 vNormal;'+
	'varying vec3 vST;'+
	'varying vec3 vPos;'+
	''+
	'void main ()'+
	'{'+
	'	mat4 mvMatrix = uViewMatrix * uModelMatrix;'+
	'	vec4 pos = mvMatrix * vec4(aXYZ,1);'+
	'	gl_Position = uProjectionMatrix * pos;'+
	''+
	'	vColor = uAmbientColor*aColor;'+
	''+
	'	vec3 light = normalize(-uLightDir);'+
	'	vec3 normal = vec3(normalize(mvMatrix*vec4(aNormal,0)));'+
	'	vColor += aColor*uDiffuseColor*max(dot(normal,light),0.0);'+
	''+
	'	vPos = pos.xyz/pos.w;'+
	'	vNormal = aNormal;'+
	'	vST = vec3(aST,1);'+
	'}';
	
var fShader =
	'precision mediump float;'+
	''+
	'uniform highp mat4 uViewMatrix;'+
	'uniform highp mat4 uModelMatrix;'+
	''+
	'uniform highp vec3 uLightDir;'+
	'uniform vec3 uSpecularColor;'+
	'uniform float uShininess;'+
	''+
	'uniform sampler2D uGearUnit;'+
	'uniform sampler2D uNormUnit;'+
	'uniform sampler2D uOcclUnit;'+
	'uniform mat3 uTexMatrix;'+
	''+
	'varying vec3 vNormal;'+
	'varying vec3 vColor;'+
	'varying vec3 vPos;'+
	'varying vec3 vST;'+
	''+
	'void main( )'+
	'{'+
	'	vec2 texPos = (uTexMatrix*vST).st;'+
	'	vec3 specularColor = vec3(0);'+
	''+
	'	mat4 mvMatrix = uViewMatrix * uModelMatrix;'+
	'	vec3 normal = 2.0*texture2D(uNormUnit,texPos).rgb-1.0;'+
	'	normal = normal*vec3(3,3,1);'+
	'	if (vNormal.x>+0.5) normal = 0.0*vNormal+vec3(normal.z,-normal.x,normal.y);'+
	'	if (vNormal.x<-0.5) normal = 0.0*vNormal-vec3(normal.z,-normal.x,normal.y);'+
	'	if (vNormal.y>+0.5) normal = 0.0*vNormal+vec3(normal.x,normal.z,-normal.y);'+
	'	if (vNormal.y<-0.5) normal = 0.0*vNormal-vec3(normal.x,normal.z,-normal.y);'+
	'	if (vNormal.z>+0.5) normal = 0.0*vNormal+vec3(normal.x,normal.y,normal.z);'+
	'	if (vNormal.z<-0.5) normal = 0.0*vNormal-vec3(normal.x,normal.y,normal.z);'+
	'	normal = vec3(normalize(mvMatrix*vec4(normal,0)));'+
	
	'	vec3 light = normalize(-uLightDir);'+
	'	vec3 reflectedLight = normalize(reflect(light,normal));'+
	'	vec3 viewDir = normalize(vPos);'+
	''+
	'	float cosa = max(dot(reflectedLight,viewDir),0.0);'+
	'	specularColor = uSpecularColor*pow(cosa,uShininess);'+
	''+
	'	vec4 texCol = texture2D(uGearUnit,texPos);'+
	'	float occlCol = 0.5+0.4*texture2D(uOcclUnit,texPos).r;'+
	'	gl_FragColor = vec4(occlCol*(texCol.stp*vColor+specularColor*0.9),1.0);'+
	'}';

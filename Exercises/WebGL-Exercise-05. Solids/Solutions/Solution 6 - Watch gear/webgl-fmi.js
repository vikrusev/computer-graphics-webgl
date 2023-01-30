// Библиотека WebGL-FMI v0.10.12.2
//
// Работа с контексти и шейдъри
//		getContext(id)
//		getShader(id,type)
//		getProgram(idv,idf)
//
// Математически функции
//		random(a,b)
//		radians(degrees)
//
// Работа с вектори 
//		unitVector(x)
//		vectorProduct(x,y)
//		scalarProduct(x,y)
//		vectorPoints(x,y)
//
// Трансформации с матрици
//		unitMatrix();
//		translateMatrix(v)
//		scaleMatrix(v)
//		xRotateMatrix(a)
//		yRotateMatrix(a)
//		zRotateMatrix(a)
//		rotateMatrix(a,v)
//
// Трансформации със съставни матрици
//		identity()
//		translate(v)
//		scale(v)
//		xRotate(a)
//		yRotate(a)
//		zRotate(a)
//		useMatrix()
//		pushMatrix()
//		popMatrix()
//		cloneMatrix()
//
// Проектиране с матрици
//		viewMatrix (eye, focus, up)
//		orthoMatrix(width, height, near, far)
//		perspMatrix(angle, aspect, near, far)
//		lookAt(eye, focus, up)
//		perspective(angle, aspect, near, far)
//
// Графични обекти (класове)
//		Cube(center,size)
//		Cuboid(center,size)
//		Pyramid(center,size,height,n)
//		Cone(center,size,height)
//		Prism(center,size,height,n)
//		Cylinder(center,size,height)
// Константи
//		CONE_SIDES = 32;
//		CYLINDER_SIDES = 32;


var gl;				// глобален WebGL контекст
var glprog;			// глобална GLSL програма
var glmat;			// глобална матрица на модела
var glmatnew;		// true, ако матрицата е променена, но не е подадена на шейдъра
var glstack = [];	// стек от матрици на модела


// брой байтове в един WebGL FLOAT (трябва да са 4 байта)
var FLOATS = Float32Array.BYTES_PER_ELEMENT;


// връща WebGL контекст, свързан с HTML елемент с даден id
function getContext(id)
{
	var canvas = document.getElementById(id);
	if (!canvas)
	{
		alert("Искаме canvas с id=\""+id+"\", а няма!");
		return null;
	}

	var context = canvas.getContext("webgl");
	if (!context)
	{
		context = canvas.getContext("experimental-webgl");
	}
	
	if (!context)
	{
		alert("Искаме WebGL контекст, а няма!");
	}
	
	return context;
}


// връща компилиран шейдър
function getShader(id,type)
{
	var source = document.getElementById(id).text;
	var shader = gl.createShader(type);

	gl.shaderSource(shader,source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS))
	{
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	
	return shader;
}


// връща готова програма
function getProgram(idv,idf)
{
	var vShader = getShader(idv,gl.VERTEX_SHADER);
	var fShader = getShader(idf,gl.FRAGMENT_SHADER);
			
	if (!vShader || !fShader) {return null;}
	
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram,vShader);
	gl.attachShader(shaderProgram,fShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS))
	{
		alert(gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	gl.useProgram(shaderProgram);
	return shaderProgram;
}


// случайно дробно число в интервал
function random(a,b)
{
	return a+(b-a)*Math.random();
}


// преобразува градуси в радиани
function radians(degrees)
{
	return degrees*Math.PI/180;
}


// създава матрица за ортографска проекция
function orthoMatrix(width, height, near, far)
{
	var matrix = [
		2.0/width, 0, 0, 0,
		0, 2.0/height, 0, 0,
		0, 0, 2.0/(near-far), 0,
		0, 0, (far+near)/(near-far), 1];
	return new Float32Array(matrix);
}


// създава матрица за перспективна проекция
// ъгълът на зрителното поле е в градуси
function perspMatrix(angle, aspect, near, far)
{
	var fov = 1/Math.tan(radians(angle)/2);
	var matrix = [
		fov/aspect, 0, 0, 0,
		0, fov, 0, 0,
		0, 0, (far+near)/(near-far), -1,
		0, 0, 2.0*near*far/(near-far), 0];
	return new Float32Array(matrix);
}


// установява перспективна проекция
function perspective(angle,aspect,near,far)
{
	var proj = perspMatrix(angle,aspect,near,far);
	gl.uniformMatrix4fv(uProjectionMatrix,false,proj);
}


// единичен вектор
function unitVector(x)
{
	var len = 1/Math.sqrt( x[0]*x[0]+x[1]*x[1]+x[2]*x[2] );
	return [ len*x[0], len*x[1], len*x[2] ];
}


// векторно произведение на два вектора
function vectorProduct(x,y)
{
	return [
		x[1]*y[2]-x[2]*y[1],
		x[2]*y[0]-x[0]*y[2],
		x[0]*y[1]-x[1]*y[0] ];
}


// скаларно произведение на два вектора
function scalarProduct(x,y)
{
	return x[0]*y[0] + x[1]*y[1] + x[2]*y[2];
}


// вектор между две точки
function vectorPoints(x,y)
{
	return [ x[0]-y[0], x[1]-y[1], x[2]-y[2] ];
}


// генерира матрица за гледна точка, параметрите са масиви с по 3 елемента
function viewMatrix (eye, focus, up)
{
	// единичен вектор Z' по посоката на гледане
	var z = unitVector(vectorPoints(eye,focus));
	
	// единичен вектор X', перпендикулярен на Z' и на посоката нагоре
	var x = unitVector(vectorProduct(up,z));
	
	// единичен вектор Y', перпендикулярен на X' и Z'
	var y = unitVector(vectorProduct(z,x));
	
	// резултатът е тези три вектора + транслация
	var matrix = [
		x[0], y[0], z[0], 0,
		x[1], y[1], z[1], 0,
		x[2], y[2], z[2], 0,
		-scalarProduct(x,eye),
		-scalarProduct(y,eye),
		-scalarProduct(z,eye), 1 ];
	return new Float32Array(matrix);
};


// установява гледна точка
function lookAt(eye,target,up)
{
	var view = viewMatrix(eye,target,up);
	gl.uniformMatrix4fv(uViewMatrix,false,view);
}


// единична матрица
function unitMatrix()
{
	var matrix = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1];
	return new Float32Array(matrix);
}

// матрица за транслация по вектор V
function translateMatrix(v)
{
	var matrix = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		v[0], v[1], v[2], 1];
	return new Float32Array(matrix);
}


// матрица за мащабиране с вектор V
function scaleMatrix(v)
{
	var matrix = [
		v[0], 0, 0, 0,
		0, v[1], 0, 0,
		0, 0, v[2], 0,
		0, 0, 0, 1];
	return new Float32Array(matrix);
}


// матрица за въртене от X към Y около Z на ъгъл A
function zRotateMatrix(a)
{
	a = radians(a);
	var c = Math.cos(a);
	var s = Math.sin(a);
	var matrix = [
		c, s, 0, 0,
	   -s, c, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1];
	return new Float32Array(matrix);
}


// матрица за въртене от Y към Z около X на ъгъл A
function xRotateMatrix(a)
{
	a = radians(a);
	var c = Math.cos(a);
	var s = Math.sin(a);
	var matrix = [
		1, 0, 0, 0,
		0, c, s, 0,
		0,-s, c, 0,
		0, 0, 0, 1];
	return new Float32Array(matrix);
}


// матрица за въртене от X към Z около Y на ъгъл A
function yRotateMatrix(a)
{
	a = radians(a);
	var c = Math.cos(a);
	var s = Math.sin(a);
	var matrix = [
		c, 0, s, 0,
		0, 1, 0, 0,
	   -s, 0, c, 0,
		0, 0, 0, 1];
	return new Float32Array(matrix);
}


// матрица за въртене около вектор V на ъгъл A
function rotateMatrix(a, v)
{
	a = radians(a);
	v = unitVector(v);
	
	var c = Math.cos(a);
	var s = Math.sin(a);
	
	var xx = v[0]*v[0]*(1-c);
	var xy = v[0]*v[1]*(1-c);
	var xz = v[0]*v[2]*(1-c);
	var yy = v[1]*v[1]*(1-c);
	var yz = v[1]*v[2]*(1-c);
	var zz = v[2]*v[2]*(1-c);
	
	var matrix = [
		xx+c,      xy-v[2]*s, xz+v[1]*s, 0,
		xy+v[2]*s, yy+c,      yz-v[0]*s, 0,
		xz-v[1]*s, yz+v[0]*s, zz+c,      0,
		0, 0, 0, 1];
	return new Float32Array(matrix);
}


// зарежда единичната матрица в матрицата на модела
function identity()
{
	glmatnew = true;
	glmat = new Float32Array( [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1] );
}


// добавя транслация към матрицата на модела
function translate(v)
{
	glmatnew = true;
	glmat[12] += glmat[0]*v[0]+glmat[4]*v[1]+glmat[8]*v[2];
	glmat[13] += glmat[1]*v[0]+glmat[5]*v[1]+glmat[9]*v[2];
	glmat[14] += glmat[2]*v[0]+glmat[6]*v[1]+glmat[10]*v[2];
}


// добавя мащабиране към матрицата на модела
function scale(v)
{
	glmatnew = true;
	glmat[0] *= v[0];
	glmat[1] *= v[0];
	glmat[2] *= v[0];
	
	glmat[4] *= v[1];
	glmat[5] *= v[1];
	glmat[6] *= v[1];
	
	glmat[8] *= v[2];
	glmat[9] *= v[2];
	glmat[10] *= v[2];
}


// ако матрицата на модела е променена, изпраща я към шейдъра
function useMatrix()
{
	if (glmatnew)
	{
		glmatnew = false;
		gl.uniformMatrix4fv(uModelMatrix,false,glmat);
	}
}


// добавя въртене около X към матрицата на модела
function xRotate(a)
{
	glmatnew = true;
	
	a = radians(a);
	var s = Math.sin(a);
	var c = Math.cos(a);
	
	a = glmat[4]*s+glmat[8]*c;
	glmat[4]=glmat[4]*c-glmat[8]*s;
	glmat[8]=a;
	
	a = glmat[5]*s+glmat[9]*c;
	glmat[5]=glmat[5]*c-glmat[9]*s;
	glmat[9]=a;
	
	a = glmat[6]*s+glmat[10]*c;
	glmat[6]=glmat[6]*c-glmat[10]*s;
	glmat[10]=a;
}


// добавя въртене около Y към матрицата на модела
function yRotate(a)
{
	glmatnew = true;

	a = radians(a);
	var s = Math.sin(a);
	var c = Math.cos(a);
	
	a = glmat[0]*s+glmat[8]*c;
	glmat[0]=glmat[0]*c-glmat[8]*s;
	glmat[8]=a;
	
	a = glmat[1]*s+glmat[9]*c;
	glmat[1]=glmat[1]*c-glmat[9]*s;
	glmat[9]=a;
	
	a = glmat[2]*s+glmat[10]*c;
	glmat[2]=glmat[2]*c-glmat[10]*s;
	glmat[10]=a;
}


// добавя въртене около Z към матрицата на модела
function zRotate(a)
{
	glmatnew = true;

	a = radians(a);
	var s = Math.sin(a);
	var c = Math.cos(a);
	
	a = glmat[0]*s+glmat[4]*c;
	glmat[0]=glmat[0]*c-glmat[4]*s;
	glmat[4]=a;
	
	a = glmat[1]*s+glmat[5]*c;
	glmat[1]=glmat[1]*c-glmat[5]*s;
	glmat[5]=a;
	
	a = glmat[2]*s+glmat[6]*c;
	glmat[2]=glmat[2]*c-glmat[6]*s;
	glmat[6]=a;
}


// добавя текущата матрица на модела в стека за матрици
function pushMatrix()
{
	var mat = new Float32Array(glmat.length);
	mat.set(glmat);
	glstack.push(mat);
}


// извлича матрица на модела от стека за матрици
// при празен стек връща единичната матрица
function popMatrix()
{
	glmatnew = true;
	if (glstack.length)
		glmat = glstack.pop();
	else
		identity();
}


// клонира матрица като копира всичките ѝ стойности
function cloneMatrix(a)
{
	var b = new Float32Array(a.length);
	b.set(a);
	return b;
}



// каноничен куб - конструктор
CanonicalCube = function()
{	
	// върхове
	var v = [ [+0.5,-0.5,-0.5], [+0.5,+0.5,-0.5],
			  [-0.5,+0.5,-0.5], [-0.5,-0.5,-0.5],
			  [+0.5,-0.5,+0.5], [+0.5,+0.5,+0.5],
			  [-0.5,+0.5,+0.5], [-0.5,-0.5,+0.5] ];
	// нормални вектори
	var n = [ [1,0,0], [-1,0,0],
			  [0,1,0], [0,-1,0],
			  [0,0,1], [0,0,-1] ];
	// общ списък връх-нормала
	var data = [].concat(
			  v[0],n[0],v[1],n[0],v[4],n[0],
			  v[4],n[0],v[1],n[0],v[5],n[0],
			  v[6],n[1],v[2],n[1],v[7],n[1],
			  v[7],n[1],v[2],n[1],v[3],n[1],
			  v[5],n[2],v[1],n[2],v[6],n[2],
			  v[6],n[2],v[1],n[2],v[2],n[2],
			  v[4],n[3],v[7],n[3],v[0],n[3],
			  v[0],n[3],v[7],n[3],v[3],n[3],
			  v[4],n[4],v[5],n[4],v[7],n[4],
			  v[7],n[4],v[5],n[4],v[6],n[4],
			  v[0],n[5],v[3],n[5],v[1],n[5],
			  v[1],n[5],v[3],n[5],v[2],n[5] );
	// локална променлива за инстанцията с WebGL буфер
	var buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	// запомняме буфера в текущата инстанция
	this.buf = buf;
}

// каноничен куб - метод за рисуване
CanonicalCube.prototype.draw = function()
{	
	// активираме буфера, създаден от конструктора
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buf);
	// казваме къде са координатите
	gl.enableVertexAttribArray(aXYZ);
	gl.vertexAttribPointer(aXYZ,3,gl.FLOAT,false,6*FLOATS,0*FLOATS);
	// казваме къде са нормалите
	gl.enableVertexAttribArray(aNormal);
	gl.vertexAttribPointer(aNormal,3,gl.FLOAT,false,6*FLOATS,3*FLOATS);
	// рисуваме
	gl.drawArrays(gl.TRIANGLES,0,36);
}

var canonicalCube;

// куб - конструктор с параметри център и размер
Cube = function(center,size)
{
	// съхраняваме центъра и размера на куба
	this.center = center;
	this.size = size;
	this.color = [1,0.75,0];
	// създаваме еднократно канонична инстанция
	if (!canonicalCube)
		canonicalCube = new CanonicalCube();
}

// куб - рисуване
Cube.prototype.draw = function()
{
	pushMatrix(); // запомняме матрицата
	gl.vertexAttrib3fv(aColor,this.color); // подаваме цвета
	translate(this.center); // мястото
	scale([this.size,this.size,this.size]); // и размера
	useMatrix();
	canonicalCube.draw(); // самото рисуване
	popMatrix(); // възстановяваме матрицата
}



// кубоид - конструктор с параметри център и размер
Cuboid = function(center,size)
{
	// съхраняваме центъра и размера на куба
	this.center = center;
	this.size = size;
	this.color = [1,0.75,0];
	// създаваме еднократно канонична инстанция
	if (!canonicalCube)
		canonicalCube = new CanonicalCube();
}

// кубоид - рисуване
Cuboid.prototype.draw = function()
{
	pushMatrix(); // запомняме матрицата
	gl.vertexAttrib3fv(aColor,this.color); // подаваме цвета
	translate(this.center); // мястото
	scale(this.size); // и размера
	useMatrix();
	canonicalCube.draw(); // самото рисуване
	popMatrix(); // възстановяваме матрицата
}



// канонична пирамида - конструктор
CanonicalPyramid = function(n)
{	
	// текущ ъгъл и ъглова разлика
	var a = 0, dA = 2*Math.PI/n;

	// генериране на основата като ветрило
	var data = [0,0,0, 0,0,-1];
	for (var i=0; i<=n; i++)
	{ 
		data.push(Math.cos(a),Math.sin(a),0,0,0,-1);
		a += dA;
	}

	// генериране на околните стени
	a = 0;
	var nZ = Math.cos(Math.PI/n); // височина на нормалния вектор
	for (var i=0; i<=n; i++)
	{ 
		// нормален вектор (няма нужда да е единичен, в щейдъра се нормализира)
		var N = [Math.cos(a+dA/2),Math.sin(a+dA/2),0/*nZ*/];
		data.push(0,0,1,N[0],N[1],nZ);
		data.push(Math.cos(a),Math.sin(a),0,N[0],N[1],0);
		data.push(Math.cos(a+dA),Math.sin(a+dA),0,N[0],N[1],0);
		a += dA;
	}
	
	var buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	
	// запомняме n и буфера
	this.n = n;
	this.buf = buf;
}

// канонична пирамида - метод за рисуване
CanonicalPyramid.prototype.draw = function()
{	
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buf);
	// върхове
	gl.enableVertexAttribArray(aXYZ);
	gl.vertexAttribPointer(aXYZ,3,gl.FLOAT,false,6*FLOATS,0*FLOATS);
	// нормали
	gl.enableVertexAttribArray(aNormal);
	gl.vertexAttribPointer(aNormal,3,gl.FLOAT,false,6*FLOATS,3*FLOATS);
	// рисуваме основата
	gl.drawArrays(gl.TRIANGLE_FAN,0,this.n+2);
	// рисуваме околните стени
	gl.drawArrays(gl.TRIANGLES,this.n+2,3*this.n);
}

// масив от канонични пирамиди
var canonicalPyramid = [];

// пирамида - конструктор с параметри център, размер на основата, височина и брой стени
Pyramid = function(center,size,height,n)
{
	this.center = center;
	this.size = size;
	this.height = height;
	this.n = n;
	this.color = [1,0.75,0];
	// създаваме еднократно канонична пирамида
	if (!canonicalPyramid[n])
		canonicalPyramid[n] = new CanonicalPyramid(n);
}

// пирамида - рисуване
Pyramid.prototype.draw = function()
{
	pushMatrix();
	gl.vertexAttrib3fv(aColor,this.color);
	translate(this.center);
	scale([this.size,this.size,this.height]);
	useMatrix();
	canonicalPyramid[this.n].draw();
	popMatrix();
}


// каноничен конус - конструктор
CanonicalCone = function(n)
{	
	// текущ ъгъл и ъглова разлика
	var a = 0, dA = 2*Math.PI/n;

	// генериране на основата като ветрило
	var data = [0,0,0, 0,0,-1];
	for (var i=0; i<=n; i++)
	{ 
		data.push(Math.cos(a),Math.sin(a),0,0,0,-1);
		a += dA;
	}

	// генериране на околните стени
	a = 0;
	//var nZ = Math.cos(Math.PI/n); // височина на нормалния вектор
	for (var i=0; i<=n; i++)
	{ 
		// нормален вектор (няма нужда да е единичен, в щейдъра се нормализира)
		data.push(0,0,1,0,0,1/*N[0],N[1],N[2]*/);
		data.push(Math.cos(a),Math.sin(a),0,Math.cos(a),Math.sin(a),0/*Nz*/);
		a += dA;
		data.push(Math.cos(a),Math.sin(a),0,Math.cos(a),Math.sin(a),0/*Nz*/);
	}
	
	var buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	
	// запомняме n и буфера
	this.n = n;
	this.buf = buf;
}

// канонична пирамида - метод за рисуване
CanonicalCone.prototype.draw = function()
{	
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buf);
	// върхове
	gl.enableVertexAttribArray(aXYZ);
	gl.vertexAttribPointer(aXYZ,3,gl.FLOAT,false,6*FLOATS,0*FLOATS);
	// нормали
	gl.enableVertexAttribArray(aNormal);
	gl.vertexAttribPointer(aNormal,3,gl.FLOAT,false,6*FLOATS,3*FLOATS);
	// рисуваме основата
	gl.drawArrays(gl.TRIANGLE_FAN,0,this.n+2);
	// рисуваме околните стени
	gl.drawArrays(gl.TRIANGLES,this.n+2,3*this.n);
}

// масив от канонични конуси
var canonicalCone = [];

// конус - конструктор с параметри център, размер на основата, височина
var CONE_SIDES = 32;
Cone = function(center,size,height)
{
	this.center = center;
	this.size = size;
	this.height = height;
	this.n = CONE_SIDES;
	this.color = [1,0.75,0];
	// създаваме еднократно канонична пирамида
	if (!canonicalCone[this.n])
		canonicalCone[this.n] = new CanonicalCone(this.n);
}

// конус - рисуване
Cone.prototype.draw = function()
{
	pushMatrix();
	gl.vertexAttrib3fv(aColor,this.color);
	translate(this.center);
	scale([this.size,this.size,this.height]);
	useMatrix();
	canonicalCone[this.n].draw();
	popMatrix();
}



// канонична призма - конструктор
CanonicalPrism = function(n)
{	
	// текущ ъгъл и ъглова разлика
	var a = 0, dA = 2*Math.PI/n;

	// генериране на долната основа като ветрило
	var data = [0,0,0, 0,0,-1];
	for (var i=0; i<=n; i++)
	{ 
		data.push(Math.cos(a),Math.sin(a),0,0,0,-1);
		a += dA;
	}

	// генериране на горната основа като ветрило
	data.push(0,0,1, 0,0,1);
	for (var i=0; i<=n; i++)
	{ 
		data.push(Math.cos(a),Math.sin(a),1,0,0,1);
		a += dA;
	}

	// генериране на околните стени
	a = 0;
	var nZ = Math.cos(Math.PI/n); // височина на нормалния вектор
	for (var i=0; i<=n; i++)
	{ 
		var N = [Math.cos(a+dA/2),Math.sin(a+dA/2)];
		data.push(Math.cos(a),Math.sin(a),1,N[0],N[1],0);
		data.push(Math.cos(a),Math.sin(a),0,N[0],N[1],0);
		data.push(Math.cos(a+dA),Math.sin(a+dA),0,N[0],N[1],0);
		data.push(Math.cos(a+dA),Math.sin(a+dA),1,N[0],N[1],0);
		data.push(Math.cos(a+dA),Math.sin(a+dA),0,N[0],N[1],0);
		data.push(Math.cos(a),Math.sin(a),1,N[0],N[1],0);
		a += dA;
	}
	
	var buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	
	// запомняме n и буфера
	this.n = n;
	this.buf = buf;
}

// канонична призма - метод за рисуване
CanonicalPrism.prototype.draw = function()
{	
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buf);
	// върхове
	gl.enableVertexAttribArray(aXYZ);
	gl.vertexAttribPointer(aXYZ,3,gl.FLOAT,false,6*FLOATS,0*FLOATS);
	// нормали
	gl.enableVertexAttribArray(aNormal);
	gl.vertexAttribPointer(aNormal,3,gl.FLOAT,false,6*FLOATS,3*FLOATS);
	// рисуваме долната и горната основа
	gl.drawArrays(gl.TRIANGLE_FAN,0,this.n+2);
	gl.drawArrays(gl.TRIANGLE_FAN,this.n+2,this.n+2);
	// рисуваме околните стени
	gl.drawArrays(gl.TRIANGLES,2*this.n+4,6*this.n);
}

// масив от канонични призми
var canonicalPrism = [];

// призма - конструктор с параметри център, размер на основата, височина и брой стени
Prism = function(center,size,height,n)
{
	this.center = center;
	this.size = size;
	this.height = height;
	this.n = n;
	this.color = [1,0.75,0];
	// създаваме еднократно канонична призма
	if (!canonicalPrism[n])
		canonicalPrism[n] = new CanonicalPrism(n);
}

// призма - рисуване
Prism.prototype.draw = function()
{
	pushMatrix();
	gl.vertexAttrib3fv(aColor,this.color);
	translate(this.center);
	scale([this.size,this.size,this.height]);
	useMatrix();
	canonicalPrism[this.n].draw();
	popMatrix();
}



// каноничен цилиндър - конструктор
CanonicalCylinder = function(n)
{	
	// текущ ъгъл и ъглова разлика
	var a = 0, dA = 2*Math.PI/n;

	// генериране на долната основа като ветрило
	var data = [0,0,0, 0,0,-1];
	for (var i=0; i<=n; i++)
	{ 
		data.push(Math.cos(a),Math.sin(a),0,0,0,-1);
		a += dA;
	}

	// генериране на горната основа като ветрило
	data.push(0,0,1, 0,0,1);
	for (var i=0; i<=n; i++)
	{ 
		data.push(Math.cos(a),Math.sin(a),1,0,0,1);
		a += dA;
	}

	// генериране на околните стени
	a = 0;
	var nZ = Math.cos(Math.PI/n); // височина на нормалния вектор
	for (var i=0; i<=n; i++)
	{ 
		var N = [Math.cos(a),Math.sin(a)]; // нормала към един отвес
		var M = [Math.cos(a+dA),Math.sin(a+dA)]; // нормала към следващия отвес
		data.push(Math.cos(a),Math.sin(a),1,N[0],N[1],0);
		data.push(Math.cos(a),Math.sin(a),0,N[0],N[1],0);
		data.push(Math.cos(a+dA),Math.sin(a+dA),0,M[0],M[1],0);
		data.push(Math.cos(a+dA),Math.sin(a+dA),1,M[0],M[1],0);
		data.push(Math.cos(a+dA),Math.sin(a+dA),0,M[0],M[1],0);
		data.push(Math.cos(a),Math.sin(a),1,N[0],N[1],0);
		a += dA;
	}
	
	var buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	
	// запомняме n и буфера
	this.n = n;
	this.buf = buf;
}

// каноничен цилиндър - метод за рисуване
CanonicalCylinder.prototype.draw = function()
{	
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buf);
	// върхове
	gl.enableVertexAttribArray(aXYZ);
	gl.vertexAttribPointer(aXYZ,3,gl.FLOAT,false,6*FLOATS,0*FLOATS);
	// нормали
	gl.enableVertexAttribArray(aNormal);
	gl.vertexAttribPointer(aNormal,3,gl.FLOAT,false,6*FLOATS,3*FLOATS);
	// рисуваме долната и горната основа
	gl.drawArrays(gl.TRIANGLE_FAN,0,this.n+2);
	gl.drawArrays(gl.TRIANGLE_FAN,this.n+2,this.n+2);
	// рисуваме околните стени
	gl.drawArrays(gl.TRIANGLES,2*this.n+4,6*this.n);
}

// масив от канонични цилиндри
var canonicalCylinder = [];

// цилиндър - конструктор с параметри център, размер на основата, височина и брой стени
var CYLINDER_SIDES = 32;
Cylinder = function(center,size,height)
{
	this.center = center;
	this.size = size;
	this.height = height;
	this.n = CYLINDER_SIDES;
	this.color = [1,0.75,0];
	// създаваме еднократно канонична призма
	if (!canonicalCylinder[this.n])
		canonicalCylinder[this.n] = new CanonicalCylinder(this.n);
}

// цилиндър - рисуване
Cylinder.prototype.draw = function()
{
	pushMatrix();
	gl.vertexAttrib3fv(aColor,this.color);
	translate(this.center);
	scale([this.size,this.size,this.height]);
	useMatrix();
	canonicalCylinder[this.n].draw();
	popMatrix();
}


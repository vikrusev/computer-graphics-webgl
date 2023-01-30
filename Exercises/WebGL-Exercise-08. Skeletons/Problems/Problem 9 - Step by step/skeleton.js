// става и кост - конструктор
Bone = function(length,body)
{	
	if (typeof body==='undefined')
	{
		this.length = length[2];
		this.body = [custom(new Cuboid([0,0,0],length),{offset:[0,0,0.5]})];
	}
	else
	{
		this.length = length;
		this.body = body;
	}
	this.rot = [0,0,0,0];
}

// става и кост - метод за рисуване
Bone.prototype.draw = function()
{	
	if (this.rot)
	{
		if (this.rot[0]) zRotate(this.rot[0]);	// хоризонтален ъгъл
		if (this.rot[1]) yRotate(this.rot[1]);	// вертикален ъгъл
		if (this.rot[2]) xRotate(this.rot[2]);	// вертикален ъгъл
		if (this.rot[3]) zRotate(this.rot[3]);	// осев ъгъл
	}
	if (this.offset) translate(this.offset); 
	for (var i=0; i<this.body.length; i++)
		this.body[i].draw();
	translate([0,0,this.length]); // преместване в края на костта
}

// скелет - конструктор
Skeleton = function()
{	
	this.rot = undefined;
	this.center = undefined;
	this.offset = undefined;
	
	// торс
	this.tor1 = new Bone([0.5,0.2,0.2]);
	this.tor2 = new Bone([0.6,0.3,0.7]);
	this.tor3 = new Bone([0.7,0.4,0.4]);
	// глава
	this.head = new Bone([0.3,0.5,0.5]);
	this.head.offset = [0,0,0.2];
	
	// крака
	this.legR1 = new Bone([0.3,0.2,1.1]);
	this.legR2 = new Bone([0.2,0.2,0.9]);
	this.legR3 = new Bone([0.3,0.1,0.6]);
	this.legR3.offset = [0,0,-0.2];
	this.legL1 = new Bone([0.3,0.2,1.1]);
	this.legL2 = new Bone([0.2,0.2,0.9]);
	this.legL3 = new Bone([0.3,0.1,0.6]);
	this.legL3.offset = [0,0,-0.2];
	// ръце
	this.armR1 = new Bone([0.2,0.2,0.7]);
	this.armR2 = new Bone([0.2,0.2,0.7]);
	this.armR3 = new Bone([0.3,0.1,0.4]);
	this.armL1 = new Bone([0.3,0.2,0.7]);
	this.armL2 = new Bone([0.2,0.2,0.7]);
	this.armL3 = new Bone([0.3,0.1,0.4]);
	
	this.posL = [0,0,0];
	this.posR = [0,0,0];
}

// скелето - метод за рисуване
Skeleton.prototype.draw = function()
{
	pushMatrix();
		if (this.center) translate(this.center); 
		if (this.rot)
		{
			if (this.rot[0]) zRotate(this.rot[0]);	// хоризонтален ъгъл
			if (this.rot[1]) yRotate(this.rot[1]);	// вертикален ъгъл
			if (this.rot[2]) xRotate(this.rot[2]);	// вертикален ъгъл
			if (this.rot[3]) zRotate(this.rot[3]);	// осев ъгъл
		}
		if (this.offset) translate(this.offset); 

		var mat0 = cloneMatrix(glmat);
		xRotate(180);
		this.tor1.draw();
		var mat = cloneMatrix(glmat);
		
		// ляв крак
		translate([-0.2,0,0]);
		this.legL1.draw();
		this.legL2.draw();
		this.legL3.draw();
		this.posL = [glmat[12],glmat[13],glmat[14]];

		// десен крак
		glmat = cloneMatrix(mat);
		translate([0.2,0,0]);
		this.legR1.draw();
		this.legR2.draw();
		this.legR3.draw();
		this.posR = [glmat[12],glmat[13],glmat[14]];
		
		// торс
		glmat = cloneMatrix(mat0);
		this.tor2.draw();
		this.tor3.draw();

		mat = cloneMatrix(glmat);
		this.head.draw();
		glmat = cloneMatrix(mat);

		xRotate(180);
		zRotate(180);
		mat = cloneMatrix(glmat);
		
		// лява ръка
		translate([0.5,0,0.1]);
		this.armL1.draw();
		this.armL2.draw();
		this.armL3.draw();

		// дясна ръка
		glmat = cloneMatrix(mat);
		translate([-0.5,0,0.1]);
		this.armR1.draw();
		this.armR2.draw();
		this.armR3.draw();
		
	popMatrix();
}

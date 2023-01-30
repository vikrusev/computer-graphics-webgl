// става и кост - конструктор
Bone = function(length,body)
{	
	this.length = length;
	this.rot = [0,0,0,0];
	this.body = body;
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

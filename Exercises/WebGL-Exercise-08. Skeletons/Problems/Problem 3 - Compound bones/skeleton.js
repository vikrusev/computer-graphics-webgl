// става и кост - конструктор
Bone = function(size)
{	
	this.bone = new Cuboid([0,0,0],size);
	this.bone.color = [0.5,0.8,0.5];
	this.bone.offset = [0,0,0.5];
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
	this.bone.draw();
	translate([0,0,this.bone.size[2]]); // преместване в края на костта
}

<?php
?>
var LaVector = function(a, b, c, d) {
	/*
	if(undefined === c) {
		this.array = new Float32Array(a || [0, 0, 0, 1]);
		if(a && (4 != a.length)) { console.warn('Length should be 4.'); }
	} else {
		if(0 === d) {
			this.array = new Float32Array([a, b, c, 0]);
		} else {
			this.array = new Float32Array([a, b, c, d || 1.0]);
		}
	}
	*/
	if(undefined === c) {
		if(a instanceof Array) {
			this.array = [Number(a[0]), Number(a[1]), Number(a[2]), Number(a[3])];
		} else {
			this.array = [0, 0, 0, 1];
		}
		if(a && (4 != a.length)) { console.warn('Length should be 4.'); }
	} else {
		if(0 === d) {
			this.array = [Number(a), Number(b), Number(c), Number(0)];
		} else {
			this.array = [Number(a), Number(b), Number(c), Number(d) || Number(1.0)];
		}
	}
	this.buffer = this.array.buffer;
	return this;
}

LaVector.unitTest = function() {
	var v = new LaVector(1, 2, 3, 1);
	var i = new LaVector(1, 1, 1, 1);
	console.log('v:');
	console.log(v.array);
	console.log('i:');
	console.log(i.array);
	console.log('v.getLength(): OK');
	console.log(3.7416573867739413 == v.getLength());
	console.log('v.getVersor(): OK');
	console.log(v.getVersor().equalTo(new LaVector([0.26726123690605164, 0.5345224738121033, 0.8017837405204773, 1])));
	console.log('v.getAdd(i): OK');
	console.log(v.getAdd(i).equalTo(new LaVector([2, 3, 4, 1])));
	console.log('v.getSub(i): OK');
	console.log(v.getSub(i).equalTo(new LaVector([0, 1, 2, 1])));
	console.log('v.getCross(i): OK');
	console.log(v.getCross(i).equalTo(new LaVector([-1, 2, -1, 1])));
	console.log('v.getDot(i): OK');
	console.log(6 == v.getDot(i));
	console.log('v.getScalarProjection(i): OK');
	console.log(3.464101615137755 == v.getScalarProjection(i));
	console.log('v.getMul(new LaMatrix().loadIdentity()): OK');
	console.log(v.getMul(new LaMatrix([
		1.0, 0.0, 0.0, 0.0,
		0.0, 2.0, 0.0, 0.0,
		0.0, 0.0, 3.0, 0.0,
		0.0, 0.0, 0.0, 4.0
	])).equalTo(new LaVector([1, 4, 9, 4])));
	console.log('v.getScalarMul(5): OK');
	console.log(v.getScalarMul(5).equalTo(new LaVector([5, 10, 15, 1])));
	console.log('v.getScalarDiv(5): OK');
	console.log(v.getScalarDiv(5).equalTo(new LaVector([0.20000000298023224, 0.4000000059604645, 0.6000000238418579, 1])));
	console.log('v.getProjection(i): OK');
	console.log(v.getProjection(i).equalTo(new LaVector([2, 2, 2, 1])));
	return 'LaVector.unitTest() Finish.';
}

LaVector.prototype.equalTo = function(t) {
	var v = this.array;
	if(t instanceof LaVector) {
		t = t.array;
		return ((v[0] == t[0]) && (v[1] == t[1]) && (v[2] == t[2]) && (v[3] == t[3]));
	} else {
		console.error('Testee must be LaVector.');
		return null;
	}
}

LaVector.prototype.concat = function(t) {
	var v = this.array;
	var temp = new LaVector(0, 0, 0);
	if(t instanceof Array) {
		temp.array = v;
		for(var i = 0; i < t.length; ++i) {
			temp = temp.concat(t[i]);
		}
	}else if(t instanceof LaVector) {
		temp.array = new Float32Array(v.length + t.array.length);
		temp.array.set(v);
		temp.array.set(t.array, v.length);
	}else if(t instanceof Float32Array) {
		temp.array = new Float32Array(v.length + t.length);
		temp.array.set(v);
		temp.array.set(t, v.length);
	} else {
		console.error('Argument wrong.');
		return null;
	}
	return temp;
}

LaVector.prototype.appendTo = function(t) {
	var v = this.array;
	var result = null;
	if(t instanceof Float32Array) {
		result = new Float32Array(t.length + v.length);
		result.set(t);
		result.set(v, t.length);
	}else if(t instanceof LaVector) {
		result = new Float32Array(t.array.length + v.length);
		result.set(t.array);
		result.set(v, t.array.length);
	} else {
		console.error('Argument wrong.');
	}
	return result;
}

LaVector.prototype.getLength = function() {
	var v = this.array;
	return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
}

LaVector.prototype.getVersor = function() {
	var v = this.array;
	var inv_length = 1.0/this.getLength();
	return new LaVector(v[0]*inv_length, v[1]*inv_length, v[2]*inv_length);
}

LaVector.prototype.getNormalized = function() {
	var v = this.array;
	var inv_n = 1.0/Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2] + v[3]*v[3]);
	return new LaVector(v[0]*inv_n, v[1]*inv_n, v[2]*inv_n, v[3]*inv_n);
}

LaVector.prototype.getAdd = function(a) {
	var v = this.array;
	if(a instanceof LaVector) {
		a = a.array;
		return new LaVector(v[0] + a[0], v[1] + a[1], v[2] + a[2]);
	} else {
		console.error('Addend must be LaVector.');
		return null;
	}
}

LaVector.prototype.getSub = function(s) {
	var v = this.array;
	if(s instanceof LaVector) {
		s = s.array;
		return new LaVector(v[0] - s[0], v[1] - s[1], v[2] - s[2]);
	} else {
		console.error('Subtrahend must be LaVector.');
		return null;
	}
}

LaVector.prototype.getCross = function(c) {
	var v = this.array;
	if(c instanceof LaVector) {
		c = c.array;
		return new LaVector(v[1]*c[2] - v[2]*c[1], v[2]*c[0] - v[0]*c[2], v[0]*c[1] - v[1]*c[0]);
	} else {
		console.error('Crossed must be LaVector.');
		return null;
	}
}

LaVector.prototype.getDot = function(d) {
	var v = this.array;
	if(d instanceof LaVector) {
		d = d.array;
		return v[0]*d[0] + v[1]*d[1] + v[2]*d[2];
	} else {
		console.error('Dotted must be LaVector.');
		return null;
	}
}

LaVector.prototype.getOuterProduct = function(o) {
	var v = this.array;
	if(o instanceof LaVector) {
		o = o.array;
		return new LaMatrix([
			v[ 0]*o[ 0], v[ 0]*o[ 1], v[ 0]*o[ 2], v[ 0]*o[ 3],
			v[ 1]*o[ 0], v[ 1]*o[ 1], v[ 1]*o[ 2], v[ 1]*o[ 3],
			v[ 2]*o[ 0], v[ 2]*o[ 1], v[ 2]*o[ 2], v[ 2]*o[ 3],
			v[ 3]*o[ 0], v[ 3]*o[ 1], v[ 3]*o[ 2], v[ 3]*o[ 3]
		]);
	} else {
		console.error('Outer produtee must be LaVector.');
		return null;
	}
}

LaVector.prototype.getScalarProjection = function(p) {
	if(p instanceof LaVector) {
		return this.getDot(p)/p.getLength();
	} else {
		console.error('Projected must be LaVector.');
		return null;
	}
}

LaVector.prototype.getMul = function(m) {
	var v = this.array;
	if(m instanceof LaMatrix) {
		m = m.array;
		return new LaVector(
			v[0]*m[ 0] + v[1]*m[ 4] + v[2]*m[ 8] + v[3]*m[12],
			v[0]*m[ 1] + v[1]*m[ 5] + v[2]*m[ 9] + v[3]*m[13],
			v[0]*m[ 2] + v[1]*m[ 6] + v[2]*m[10] + v[3]*m[14],
			v[0]*m[ 3] + v[1]*m[ 7] + v[2]*m[11] + v[3]*m[15]
		);
	} else {
		console.error('Multiplicaten must be a LaMatrix.');
		return null;
	}
}

LaVector.prototype.getScalarMul = function(m) {
	var v = this.array;
	m = Number(m);
	if(!isNaN(m)) {
		return new LaVector(m*v[0], m*v[1], m*v[2]);
	} else {
		console.error('Multiplicaten must be a Number.');
		return null;
	}
}

// Implement from: http://www.cprogramming.com/tutorial/3d/quaternions.html
LaVector.prototype.getQuaternionMul = function(m) {
	var v = this.array;
	if(m instanceof LaVector) {
		m = m.array;
		return new LaVector(
			v[3]*m[0] + v[0]*m[3] + v[1]*m[2] - v[2]*m[1],
			v[3]*m[1] - v[0]*m[2] + v[1]*m[3] + v[2]*m[0],
			v[3]*m[2] + v[0]*m[1] - v[1]*m[0] + v[2]*m[3],
			v[3]*m[3] - v[0]*m[0] - v[1]*m[1] - v[2]*m[2]
		);
	} else {
		console.error('Multiplicaten must be a LaVector.');
		return null;
	}
}

LaVector.prototype.getScalarDiv = function(d) {
	var v = this.array;
	d = Number(d);
	if(isNaN(d)) {
		console.error('Dividend must be a number.');
		return null;
	} else if (0.0 == d) {
		console.error('Dividend is zero.');
		return null;
	} else {
		return this.getScalarMul(1.0/d);
	}
}

LaVector.prototype.getProjection = function(p) {
	var v = this.array;
	if(p instanceof LaVector) {
		return p.getVersor().getScalarMul(this.getScalarProjection(p));
	} else {
		console.error('Projected must be LaVector.');
		return null;
	}
}

LaVector.prototype.getAngleBisector = function(b, c, clockWise) {
	if(!(b instanceof LaVector) || !(c instanceof LaVector)) {
		console.error('Argument error in LaVector.getAngleBisector().');
		return null;
	}
	var clock = clockWise ? -1 : 1;
	var a = this;
	var ab = b.getSub(a), ac = c.getSub(a);
	var m = ab.getLength()/ac.getLength();
	var d = c.getScalarMul(m).getAdd(b).getScalarDiv(m + 1);
	var ad = d.getSub(a);
	var abadCross = ab.getCross(ad);
	return ad.getScalarMul((clockWise ? -1: 1)*abadCross.array[2]).getVersor();
}

LaVector.prototype.getCastRay = function(wvp, canvas) {
	if(!(wvp instanceof LaMatrix) || !(canvas instanceof Element)) {
		console.error('Argument error in LaVector.transformTo2D().');
		return null;
	}
	var wvp_inv = wvp.getInverse();
	var scale = Number(0.5);
	var width = canvas.width, height = canvas.height;
	var trans2d = new LaMatrix([
		scale*width, 0.0, 0.0, 0.0,
		0.0, -scale*height, 0.0, 0.0,
		0.0, 0.0, scale, 0.0,
		scale*width, scale*height, 0.0, scale
	]);
	var trans2d_inv = trans2d.getInverse();
	var a = new LaVector(this.array);
	a.array[2] = scale, a.array[3] = scale;
	a = a.getMul(trans2d_inv);
	var b = new LaVector(a.array);
	b.array[2] = a.array[2] - 0.5;
	a = a.getMul(wvp_inv);
	b = b.getMul(wvp_inv);
	a = a.getScalarDiv(a.array[3]);
	b = b.getScalarDiv(b.array[3]);
	var result = {array: a.getSub(b), point: a};
	return result;
}

LaVector.prototype.getIntersectSurfaceLine = function(surface_point, line_dir, line_point) {
	if(
		!(surface_point instanceof LaVector)
		|| !(line_dir instanceof LaVector)
		|| !(line_point instanceof LaVector)
	) {
		return 'Input should all be LaVector.';
	}
	var sn = this; // Surface Normal
	var t = (sn.getDot(surface_point) - sn.getDot(line_point))/sn.getDot(line_dir);
	var result = line_point.getAdd(line_dir.getScalarMul(t));
	return result;
}

LaVector.prototype.transformTo2D = function(wvp, canvas) {
	if(!(wvp instanceof LaMatrix) || !(canvas instanceof Element)) {
		console.error('Argument error in LaVector.transformTo2D().');
		return null;
	}
	var scale = Number(0.5);
	var width = canvas.width, height = canvas.height;
	var trans2d = new LaMatrix([
		scale*width, 0.0, 0.0, 0.0,
		0.0, -scale*height, 0.0, 0.0,
		0.0, 0.0, scale, 0.0,
		scale*width, scale*height, 0.0, scale
	]);
	var result = this.getMul(wvp);
	return result.getScalarDiv(result.array[3]).getMul(trans2d);
}

LaVector.prototype.insideCube = function(size, point) {
	if(!(size instanceof LaVector) || !(point instanceof LaVector)) {
		console.error('Argument error in LaVector.insideCube().');
		return null;
	}
	var result = false;
	var o = this.array;
	var s = size.array, p = point.array;
	if(
		!(p[0] < o[0]) && !(p[0] > (o[0] + s[0]))
		&& !(p[1] < o[1]) && !(p[1] > (o[1] + s[1]))
		&& !(p[2] < o[2]) && !(p[2] > (o[2] + s[2]))
	) {
		result = true;
	}
	return result;
}

// Implement from: http://www.cprogramming.com/tutorial/3d/quaternions.html
LaVector.prototype.getQuaternionToOrthogonalMatrix = function() {
	var v = this.getNormalized().array;
	var aa = v[3]*v[3], bb = v[0]*v[0], cc = v[1]*v[1], dd = v[2]*v[2];
	var ab = v[3]*v[0], ac = v[3]*v[1], ad = v[3]*v[2];
	var bc = v[1]*v[2], bd = v[1]*v[3], cd = v[2]*v[3];
	return new LaMatrix([
		aa + bb - cc - dd, 2*bc - 2*ad,       2*bd + 2*ac,       0,
		2*bc + 2*ad,       aa - bb + cc - dd, 2*cd - 2*ab,       0,
		2*bd - 2*ac,       2*cd + 2*ab,       aa - bb - cc + dd, 0,
		0, 0, 0, 1
	]);
}

// Implement from: http://www.cprogramming.com/tutorial/3d/quaternions.html
LaVector.prototype.makeQuaternionByAxis = function(x, y, z, w) {
	var axis = null, angle = null;
	if(undefined === w) {
		if(x instanceof LaVector) {
			axis = x;
		} else if(x instanceof Array) {
			axis = new LaVector(x);
		}
		angle = y;
	} else {
		axis = new LaVector(x, y, z);
		angle = w;
	}
	axis = axis.getVersor().array;
	angle = Number(angle);
	var v = this.getNormalized().array;
	return new LaVector([
		axis[0]*Math.sin(0.5*angle),
		axis[1]*Math.sin(0.5*angle),
		axis[2]*Math.sin(0.5*angle),
		Math.cos(0.5*angle)
	]);
}

LaVector.prototype.getPlaneByThreePoints = function(a, b, c) {
	var v1 = a.getSub(b);
	var v2 = a.getSub(c);
	var plane = v1.getCross(v2);
	plane.array[3] = -plane.getDot(a);
	return plane;
}

//* vim: syntax=javascript

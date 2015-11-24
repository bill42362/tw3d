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
var LaMatrix = function(aa, ab, ac, ad, ba, bb, bc, bd, ca, cb, cc, cd, da, db, dc, dd) {
	if(undefined === dd) {
		if(undefined === ad) {
			if(undefined === ad) {
				this.array = new Float32Array(
					aa
					|| [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
				if(aa && (16 != aa.length)) { console.warn('Length should be 16.'); }
			}
		} else {
			this.array = new Float32Array([
				aa[0], aa[1], aa[2], aa[3],
				ab[0], ab[1], ab[2], ab[3],
				ac[0], ac[1], ac[2], ac[3],
				ad[0], ad[1], ad[2], ad[3]
			]);
		}
	} else {
		this.array = new Float32Array([aa, ab, ac, ad, ba, bb, bc, bd, ca, cb, cc, cd, da, db, dc, dd]);
	}
	this.buffer = this.array.buffer;
	return this;
}

LaMatrix.unitTest = function() {
	var i = new LaMatrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
	console.log('i.loadIdentity():');
	console.log(i.loadIdentity().array);

	var m = new LaMatrix(1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 2, 3, 1/3, 1);
	console.log('m.equalTo() OK:');
	console.log(m.equalTo(new LaMatrix(1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 10/5, 9/3, 0.33333334, 1)));
	console.log('m.getTranspose(): OK');
	console.log(m.getTranspose().equalTo(new LaMatrix(1, 0, 0, 2, 0, 0, 1, 3, 0, 1, 0, 0.33333334, 0, 0, 0, 1)));
	console.log('m.getAdd(i): OK');
	console.log(m.getAdd(i).equalTo(new LaMatrix(2, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 2, 3, 0.33333334, 2)));
	console.log('m.getSub(i): OK');
	console.log(m.getSub(i).equalTo(new LaMatrix(0, 0, 0, 0, 0, -1, 1, 0, 0, 1, -1, 0, 2, 3, 0.33333334, 0)));
	console.log('m.getMul(i): OK');
	console.log(m.getMul(i).equalTo(new LaMatrix(1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 2, 3, 0.33333334, 1)));
	console.log('m.getScalarMul(5): OK');
	console.log(m.getScalarMul(5).equalTo(new LaMatrix(5, 0, 0, 0, 0, 0, 5, 0, 0, 5, 0, 0, 10, 15, 1.6666667, 5)));
	console.log('m.getFastInverse(): OK');
	console.log(m.getFastInverse().equalTo(new LaMatrix(1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, -2, -0.33333334, -3, 1)));
	console.log('m.getMul(m.getFastInverse()): OK');
	console.log(m.getMul(m.getFastInverse()).equalTo(new LaMatrix(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)));
	console.log('m.getInverse(): OK');
	console.log(m.getInverse().equalTo(new LaMatrix(1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, -2, -0.33333334, -3, 1)));
	console.log('m.getTurnXYZ(Math.PI, Math.PI, Math.PI): OK');
	console.log(m.getTurnXYZ(Math.PI, Math.PI, Math.PI).equalTo(new LaMatrix(
		1, 1.2246063538223773e-16, 1.2246063538223773e-16, 0,
		-1.2246063538223773e-16, -1.2246063538223773e-16, 1, 0,
		-1.2246063538223773e-16, 1, 1.2246063538223773e-16, 0,
		2, 3, 0.3333333432674408, 1
	)));

	var l = new LaMatrix(7, 3, -1, 2, 3, 8, 1, -4, -1, 1, 4, -1, 2, -4, -1, 6);
	console.log('l.getLUDec(): OK');
	console.log(l.getLUDec().equalTo(new LaMatrix(
		7, 0.4285714328289032, -0.1428571492433548, 0.2857142984867096,
		3, 6.714285850524902, 0.21276596188545227, -0.7234042286872864,
		-1, 1.4285714626312256, 3.5531914234161377, 0.08982036262750626,
		2, -4.857142925262451, 0.3191489279270172, 1.8862274885177612
	)));
	return 'LaMatrix.unitTest() Finish.';
}

LaMatrix.makeTurnPitchMatrix = function(_angle) {
	var angle = Number(_angle);
	var tempMatrix = null;
	if(!isNaN(angle)) {
		tempMatrix = new LaMatrix(
			Math.cos(angle), 0, Math.sin(angle), 0,
			0, 1, 0, 0,
			-Math.sin(angle), 0, Math.cos(angle), 0,
			0, 0, 0, 1
		);
	} else {
		console.error('Angle must be a Number.');
	}
	return tempMatrix;
}

LaMatrix.makeTurnRollMatrix = function(_angle) {
	var angle = Number(_angle);
	var tempMatrix = null;
	if(!isNaN(angle)) {
		tempMatrix = new LaMatrix(
			1, 0, 0, 0,
			0, Math.cos(angle), -Math.sin(angle), 0,
			0, Math.sin(angle), Math.cos(angle), 0,
			0, 0, 0, 1
		);
	} else {
		console.error('Angle must be a Number.');
	}
	return tempMatrix;
}

LaMatrix.makeTurnYawMatrix = function(_angle) {
	var angle = Number(_angle);
	var tempMatrix = null;
	if(!isNaN(angle)) {
		tempMatrix = new LaMatrix(
			Math.cos(angle), -Math.sin(angle), 0, 0,
			Math.sin(angle), Math.cos(angle), 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		);
	} else {
		console.error('Angle must be a Number.');
	}
	return tempMatrix;
}

LaMatrix.prototype.loadIdentity = function() {
	this.array.set([
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	]);
	return this;
}

LaMatrix.prototype.getTranspose = function() {
	var a = this.array;
	return new LaMatrix(
		a[0], a[4], a[ 8], a[12],
		a[1], a[5], a[ 9], a[13],
		a[2], a[6], a[10], a[14],
		a[3], a[7], a[11], a[15]
	);
}

LaMatrix.prototype.equalTo = function(a) {
	var s = this.array;
	if(a instanceof LaMatrix) {
		a = a.array;
		return (
			(s[ 0] == a[ 0]) && (s[ 1] == a[ 1]) && (s[ 2] == a[ 2]) && (s[ 3] == a[ 3]) &&
			(s[ 4] == a[ 4]) && (s[ 5] == a[ 5]) && (s[ 6] == a[ 6]) && (s[ 7] == a[ 7]) &&
			(s[ 8] == a[ 8]) && (s[ 9] == a[ 9]) && (s[10] == a[10]) && (s[11] == a[11]) &&
			(s[12] == a[12]) && (s[13] == a[13]) && (s[14] == a[14]) && (s[15] == a[15])
		);
	} else {
		console.error('Testee must be LaMatrix.');
		return undefined;
	}
}

LaMatrix.prototype.getAdd = function(a) {
	var s = this.array;
	if(a instanceof LaMatrix) {
		a = a.array;
		return new LaMatrix(
			s[ 0]+a[ 0], s[ 1]+a[ 1], s[ 2]+a[ 2], s[ 3]+a[ 3],
			s[ 4]+a[ 4], s[ 5]+a[ 5], s[ 6]+a[ 6], s[ 7]+a[ 7],
			s[ 8]+a[ 8], s[ 9]+a[ 9], s[10]+a[10], s[11]+a[11],
			s[12]+a[12], s[13]+a[13], s[14]+a[14], s[15]+a[15]
		);
	} else {
		console.error('Addend must be LaMatrix.');
		return undefined;
	}
}

LaMatrix.prototype.getSub = function(a) {
	var s = this.array;
	if(a instanceof LaMatrix) {
		a = a.array;
		return new LaMatrix(
			s[ 0]-a[ 0], s[ 1]-a[ 1], s[ 2]-a[ 2], s[ 3]-a[ 3],
			s[ 4]-a[ 4], s[ 5]-a[ 5], s[ 6]-a[ 6], s[ 7]-a[ 7],
			s[ 8]-a[ 8], s[ 9]-a[ 9], s[10]-a[10], s[11]-a[11],
			s[12]-a[12], s[13]-a[13], s[14]-a[14], s[15]-a[15]
		);
	} else {
		console.error('Subtrahend must be LaMatrix.');
		return undefined;
	}
}

LaMatrix.prototype.getMul = function(a) {
	var s = this.array;
	if(a instanceof LaMatrix) {
		a = a.array;
		return new LaMatrix(
			s[ 0]*a[ 0] + s[ 1]*a[ 4] + s[ 2]*a[ 8] + s[ 3]*a[12],
			s[ 0]*a[ 1] + s[ 1]*a[ 5] + s[ 2]*a[ 9] + s[ 3]*a[13],
			s[ 0]*a[ 2] + s[ 1]*a[ 6] + s[ 2]*a[10] + s[ 3]*a[14],
			s[ 0]*a[ 3] + s[ 1]*a[ 7] + s[ 2]*a[11] + s[ 3]*a[15],

			s[ 4]*a[ 0] + s[ 5]*a[ 4] + s[ 6]*a[ 8] + s[ 7]*a[12],
			s[ 4]*a[ 1] + s[ 5]*a[ 5] + s[ 6]*a[ 9] + s[ 7]*a[13],
			s[ 4]*a[ 2] + s[ 5]*a[ 6] + s[ 6]*a[10] + s[ 7]*a[14],
			s[ 4]*a[ 3] + s[ 5]*a[ 7] + s[ 6]*a[11] + s[ 7]*a[15],

			s[ 8]*a[ 0] + s[ 9]*a[ 4] + s[10]*a[ 8] + s[11]*a[12],
			s[ 8]*a[ 1] + s[ 9]*a[ 5] + s[10]*a[ 9] + s[11]*a[13],
			s[ 8]*a[ 2] + s[ 9]*a[ 6] + s[10]*a[10] + s[11]*a[14],
			s[ 8]*a[ 3] + s[ 9]*a[ 7] + s[10]*a[11] + s[11]*a[15],

			s[12]*a[ 0] + s[13]*a[ 4] + s[14]*a[ 8] + s[15]*a[12],
			s[12]*a[ 1] + s[13]*a[ 5] + s[14]*a[ 9] + s[15]*a[13],
			s[12]*a[ 2] + s[13]*a[ 6] + s[14]*a[10] + s[15]*a[14],
			s[12]*a[ 3] + s[13]*a[ 7] + s[14]*a[11] + s[15]*a[15]
		);
	} else if(a instanceof LaVector) {
		a = a.array;
		return new LaVector(
			s[ 0]*a[0] + s[ 1]*a[1] + s[ 2]*a[2] + s[ 3]*a[3],
			s[ 4]*a[0] + s[ 5]*a[1] + s[ 6]*a[2] + s[ 7]*a[3],
			s[ 8]*a[0] + s[ 9]*a[1] + s[10]*a[2] + s[11]*a[3],
			s[12]*a[0] + s[13]*a[1] + s[14]*a[2] + s[15]*a[3]
		);
	} else {
		console.error('Multiplicaten must be LaMatrix or LaVector.');
		return null;
	}
}

LaMatrix.prototype.getScalarMul = function(a) {
	var s = this.array;
	a = Number(a);
	if(!isNaN(a)) {
		return new LaMatrix(
			a*s[ 0], a*s[ 1], a*s[ 2], a*s[ 3],
			a*s[ 4], a*s[ 5], a*s[ 6], a*s[ 7],
			a*s[ 8], a*s[ 9], a*s[10], a*s[11],
			a*s[12], a*s[13], a*s[14], a*s[15]
		);
	} else {
		console.error('Multiplicaten must be a Number.');
		return null;
	}
}

LaMatrix.prototype.getFastInverse = function() {
	var s = this.array;
	return new LaMatrix(
		s[ 0], s[ 4], s[ 8], 0.0,
		s[ 1], s[ 5], s[ 9], 0.0,
		s[ 2], s[ 6], s[10], 0.0,
		-(s[12]*s[ 0] + s[13]*s[ 1] + s[14]*s[ 2]),
		-(s[12]*s[ 4] + s[13]*s[ 5] + s[14]*s[ 6]),
		-(s[12]*s[ 8] + s[13]*s[ 9] + s[14]*s[10]),
		1.0
	);
}

LaMatrix.prototype.getInverse = function() {
	var m = this.array;
	var iv = new Array(16);

	iv[0] = m[5]  * m[10] * m[15] - 
			m[5]  * m[11] * m[14] - 
			m[9]  * m[6]  * m[15] + 
			m[9]  * m[7]  * m[14] +
			m[13] * m[6]  * m[11] - 
			m[13] * m[7]  * m[10];

	iv[4] = -m[4]  * m[10] * m[15] + 
			m[4]  * m[11] * m[14] + 
			m[8]  * m[6]  * m[15] - 
			m[8]  * m[7]  * m[14] - 
			m[12] * m[6]  * m[11] + 
			m[12] * m[7]  * m[10];

	iv[8] = m[4]  * m[9] * m[15] - 
			m[4]  * m[11] * m[13] - 
			m[8]  * m[5] * m[15] + 
			m[8]  * m[7] * m[13] + 
			m[12] * m[5] * m[11] - 
			m[12] * m[7] * m[9];

	iv[12] = -m[4]  * m[9] * m[14] + 
			m[4]  * m[10] * m[13] +
			m[8]  * m[5] * m[14] - 
			m[8]  * m[6] * m[13] - 
			m[12] * m[5] * m[10] + 
			m[12] * m[6] * m[9];

	iv[1] = -m[1]  * m[10] * m[15] + 
			m[1]  * m[11] * m[14] + 
			m[9]  * m[2] * m[15] - 
			m[9]  * m[3] * m[14] - 
			m[13] * m[2] * m[11] + 
			m[13] * m[3] * m[10];

	iv[5] = m[0]  * m[10] * m[15] - 
			m[0]  * m[11] * m[14] - 
			m[8]  * m[2] * m[15] + 
			m[8]  * m[3] * m[14] + 
			m[12] * m[2] * m[11] - 
			m[12] * m[3] * m[10];

	iv[9] = -m[0]  * m[9] * m[15] + 
			m[0]  * m[11] * m[13] + 
			m[8]  * m[1] * m[15] - 
			m[8]  * m[3] * m[13] - 
			m[12] * m[1] * m[11] + 
			m[12] * m[3] * m[9];

	iv[13] = m[0]  * m[9] * m[14] - 
			m[0]  * m[10] * m[13] - 
			m[8]  * m[1] * m[14] + 
			m[8]  * m[2] * m[13] + 
			m[12] * m[1] * m[10] - 
			m[12] * m[2] * m[9];

	iv[2] = m[1]  * m[6] * m[15] - 
			m[1]  * m[7] * m[14] - 
			m[5]  * m[2] * m[15] + 
			m[5]  * m[3] * m[14] + 
			m[13] * m[2] * m[7] - 
			m[13] * m[3] * m[6];

	iv[6] = -m[0]  * m[6] * m[15] + 
			m[0]  * m[7] * m[14] + 
			m[4]  * m[2] * m[15] - 
			m[4]  * m[3] * m[14] - 
			m[12] * m[2] * m[7] + 
			m[12] * m[3] * m[6];

	iv[10] = m[0]  * m[5] * m[15] - 
			m[0]  * m[7] * m[13] - 
			m[4]  * m[1] * m[15] + 
			m[4]  * m[3] * m[13] + 
			m[12] * m[1] * m[7] - 
			m[12] * m[3] * m[5];

	iv[14] = -m[0]  * m[5] * m[14] + 
			m[0]  * m[6] * m[13] + 
			m[4]  * m[1] * m[14] - 
			m[4]  * m[2] * m[13] - 
			m[12] * m[1] * m[6] + 
			m[12] * m[2] * m[5];

	iv[3] = -m[1] * m[6] * m[11] + 
			m[1] * m[7] * m[10] + 
			m[5] * m[2] * m[11] - 
			m[5] * m[3] * m[10] - 
			m[9] * m[2] * m[7] + 
			m[9] * m[3] * m[6];

	iv[7] = m[0] * m[6] * m[11] - 
			m[0] * m[7] * m[10] - 
			m[4] * m[2] * m[11] + 
			m[4] * m[3] * m[10] + 
			m[8] * m[2] * m[7] - 
			m[8] * m[3] * m[6];

	iv[11] = -m[0] * m[5] * m[11] + 
			m[0] * m[7] * m[9] + 
			m[4] * m[1] * m[11] - 
			m[4] * m[3] * m[9] - 
			m[8] * m[1] * m[7] + 
			m[8] * m[3] * m[5];

	iv[15] = m[0] * m[5] * m[10] - 
			m[0] * m[6] * m[9] - 
			m[4] * m[1] * m[10] + 
			m[4] * m[2] * m[9] + 
			m[8] * m[1] * m[6] - 
			m[8] * m[2] * m[5];

	var det = m[0]*iv[0] + m[1]*iv[4] + m[2]*iv[8] + m[3]*iv[12];

	if(det != 0) {
		det = 1.0/det;
		return new LaMatrix(iv).getScalarMul(det);
	} else {
		console.warn('Cannot be inversed.' + ' Because det == 0.');
		return null;
	}
}

LaMatrix.prototype.getLUDec = function() {
	var n = undefined;
	var m = this.array;

	if(undefined != this.lu) {
		n = this.lu;
	} else {
		n = new Array(16);
		n[ 0] = m[ 0];
		if(0 == n[ 0]) {
			console.warn('Cannot be LU decomposited.' + ' Because n[ 0] == 0.');
			n = undefined;
		} else {
			n[ 4] = m[ 4];
			n[ 1] = m[ 1]/n[ 0];
			n[ 5] = m[ 5]-(n[ 4]*n[ 1]);
		
			if(0 == n[ 5]) {
				console.warn('Cannot be LU decomposited.' + ' Because n[ 5] == 0.');
				n = undefined;
			} else {
				n[ 8] = m[ 8];
				n[ 2] = m[ 2]/n[ 0];
				n[ 9] = m[ 9]-(n[ 8]*n[ 1]);
				n[ 6] = (m[ 6]-(n[ 4]*n[ 2]))/n[ 5];

				n[10] = m[10]-(n[ 8]*n[ 2])-(n[ 9]*n[ 6]);
				
				if(0 == n[10]) {
					console.warn('Cannot be LU decomposited.' + ' Because n[10] == 0.');
					n = undefined;
				} else {
					n[12] = m[12];
					
					n[ 3] = m[ 3]/n[ 0];
					
					n[13] = m[13]-(n[12]*n[ 1]);
					
					n[ 7] = (m[ 7]-(n[ 4]*n[ 3]))/n[ 5];
					
					n[14] = m[14]-(n[12]*n[ 2])-(n[13]*n[ 6]);
					n[11] = (m[11]-n[ 8]*n[ 3]-n[ 9]*n[ 7])/n[10];
					n[15] = m[15]-(n[12]*n[ 3])-(n[13]*n[ 7])-(n[14]*n[11]);

					if(0 == n[15]) {
						console.warn('Cannot be LU decomposited.' + ' Because n[15] == 0.');
						n = undefined;
					} else {
						n = new LaMatrix(n);
					}
				}
			}
		}
		this.lu = n;
	}
	return n;
}

LaMatrix.prototype.getLULowerTri = function() {
	this.getLUDec();
	var v = this.lu.array;
	return new LaMatrix(
		v[ 0], 0.0, 0.0, 0.0,
		v[ 4], v[ 5], 0.0, 0.0,
		v[ 8], v[ 9], v[10], 0.0,
		v[12], v[13], v[14], v[15]
	);
}

LaMatrix.prototype.getLUUpperTri = function() {
	this.getLUDec();
	var v = this.lu.array;
	return new LaMatrix(
		1.0, v[ 1], v[ 2], v[ 3],
		0.0, 1.0, v[ 6], v[ 7],
		0.0, 0.0, 1.0, v[11],
		0.0, 0.0, 0.0, 1.0
	);
}

LaMatrix.prototype.getForwardIterate = function(v) {
	var n = [];
	var m = null;
	if(v instanceof LaVector) {
		v = v.array;
		m = this.getLULowerTri().array;
		n[0] = v[0]/m[ 0];
		n[1] = (v[1] - n[0]*m[ 4])/m[ 5];
		n[2] = (v[2] - n[0]*m[ 8] - n[1]*m[ 9])/m[10];
		n[3] = (v[3] - n[0]*m[12] - n[1]*m[13] - n[2]*m[14])/m[15];
		return new LaVector(n);
	} else if(v instanceof LaMatrix) {
		v = v.array;
		console.error('LaMatrix vs LaMatrix forward iterate have not been implement yet.');
		return null;
	} else {
		console.error('Iterated must be LaVector or LaMatrix.');
		return null;
	}
}

LaMatrix.prototype.getBackwardIterate = function(v) {
	var n = [];
	var m = null;
	if(v instanceof LaVector) {
		v = v.array;
		m = this.getLUUpperTri().array;
		n[3] = v[3]/m[15];
		n[2] = (v[2] - n[3]*m[11])/m[10];
		n[1] = (v[1] - n[3]*m[ 7] - n[2]*m[ 6])/m[ 5];
		n[0] = (v[0] - n[3]*m[ 3] - n[2]*m[ 2] - n[1]*m[ 1])/m[ 0];
		return new LaVector(n);
	} else if(v instanceof LaMatrix) {
		v = v.array;
		console.error('LaMatrix vs LaMatrix backward iterate have not been implement yet.');
		return null;
	} else {
		console.error('Iterated must be LaVector or LaMatrix.');
		return null;
	}
}

LaMatrix.prototype.getLUEvaluate = function(v) {
	var n = [];
	var y = null;
	if(v instanceof LaVector) {
		y = this.getForwardIterate(v);
		return this.getBackwardIterate(y);
	} else {
		console.error('Evaluated must be LaVector.');
		return null;
	}
}

LaMatrix.prototype.getMoveScreenXYZ = function(_x, _y, _z, _eye, _lookAt, _up) {
	var tempMatrix = null;
	var eye = _eye || new LaVector(120.45758, 23.47669, 4.5, 0.0);
	var lookAt = _lookAt || new LaVector(120.45758, 23.47669, 0.0, 0.0);
	var up = _up || new LaVector(0.0, 1.0, 0.0, 0.0);
	var x = Number(_x), y = Number(_y), z = Number(_z);
	if(!isNaN(x) && !isNaN(y) && !isNaN(z)) {
		var viewport_axis_z = lookAt.getSub(eye).getVersor();
		var viewport_axis_x = viewport_axis_z.getCross(up).getVersor();

		var moveVector = viewport_axis_x.getScalarMul(-x)
			.getAdd(up.getScalarMul(-y));

		eye = eye.getAdd(moveVector).getAdd(viewport_axis_z.getScalarMul(z));
		lookAt = lookAt.getAdd(moveVector);
		tempMatrix = new LaMatrix().makeViewMatrix(eye, lookAt, up);
	} else {
		console.error('Directions must be Numbers.');
	}
	return {view: tempMatrix, eye: eye, lookAt: lookAt, up: up};
}

LaMatrix.prototype.getTurnedViewByScreenXY = function(_x, _y, _eye, _lookAt, _up) {
	var tempMatrix = null;
	var eye = _eye || new LaVector(120.45758, 23.47669, 4.5, 0.0);
	var lookAt = _lookAt || new LaVector(120.45758, 23.47669, 0.0, 0.0);
	var up = _up || new LaVector(0.0, 1.0, 0.0, 0.0);
	var x = Number(_x), y = Number(_y);
	if(!isNaN(x) && !isNaN(y)) {
		var viewport_axis_x = lookAt.getSub(eye).getCross(up).getVersor();

		// Turn X actully means turn along 'Y axis', and so on turn Y.
		var turnVector = viewport_axis_x.getScalarMul(-y).getAdd(up.getScalarMul(x));

		turnMatrix = new LaMatrix();
		turnMatrix.loadIdentity();
		var ta = turnVector.array;
		turnMatrix = turnMatrix.getTurnXYZ(ta[0], ta[1], ta[2]);

		eye = eye.getSub(lookAt).getMul(turnMatrix).getAdd(lookAt);
		up = up.getMul(turnMatrix);
		tempMatrix = new LaMatrix().makeViewMatrix(eye, lookAt, up);
	} else {
		console.error('Directions must be Numbers.');
	}
	return {view: tempMatrix, eye: eye, lookAt: lookAt, up: up};
}

LaMatrix.prototype.getTurnXYZ = function(_x, _y, _z) {
	var x = Number(_x), y = Number(_y), z = Number(_z);
	var tempMatrix = undefined;
	if(!isNaN(x) && !isNaN(y) && !isNaN(z)) {
		tempMatrix = this.getMul(LaMatrix.makeTurnRollMatrix(x))
					.getMul(LaMatrix.makeTurnPitchMatrix(y))
					.getMul(LaMatrix.makeTurnYawMatrix(z));
	} else {
		console.error('Angles must be Numbers.');
	}
	return tempMatrix;
}

LaMatrix.prototype.makeViewMatrix = function(eye, lookat, up) {
	if(
		!(eye instanceof LaVector)
		|| !(lookat instanceof LaVector)
		|| !(up instanceof LaVector)
	) {
		console.error('Eye, lookat and up all must be a LaVector.');
		return null;
	}
	var zaxis = eye.getSub(lookat).getVersor();
	var xaxis = up.getVersor().getCross(zaxis).getVersor();
	var yaxis = zaxis.getVersor().getCross(xaxis).getVersor(); 
	return new LaMatrix(
		xaxis.array[0], xaxis.array[1], xaxis.array[2], 0,
		yaxis.array[0], yaxis.array[1], yaxis.array[2], 0,
		zaxis.array[0], zaxis.array[1], zaxis.array[2], 0,
		eye.array[0], eye.array[1], eye.array[2], 1
	).getFastInverse();
}

LaMatrix.prototype.makeProjectionMatrix = function(field_of_view, aspect, z_near, z_far) {
	var fov = Number(field_of_view);
	var asp = Number(aspect);
	var zn = Number(z_near);
	var zf = Number(z_far);
	if(isNaN(fov) || isNaN(asp) || isNaN(zn) || isNaN(zf)) {
		console.error('Some arg of makeProjectionMatrix() is NaN.');
		return null;
	}
	return new LaMatrix(
		(1/Math.tan(fov*0.5))*asp, 0, 0, 0,
		0, (1/Math.tan(fov*0.5)), 0, 0,
		0, 0, (zf + zn)/(zn - zf), -1,
		0, 0, (2*zf*zn)/(zn - zf), 0
	);
}

// Implement from: http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
LaMatrix.prototype.getQuaternionFromOrthogonal = function() {
	var a = this.array;
	var diag_xx = 1.0 + a[0] - a[5] - a[10];
	var diag_yy = 1.0 - a[0] + a[5] - a[10];
	var diag_zz = 1.0 - a[0] - a[5] + a[10];
	var diag_ww = 1.0 + a[0] + a[5] + a[10];
	var max_diag = Math.max(diag_xx, diag_yy, diag_zz, diag_ww);
	var x = null, y = null, z = null, w = null;
	switch(max_diag) {
		case diag_xx:
			x = 0.5*Math.sqrt(diag_xx);
			y = (a[4] + a[1])/(4*x);
			z = (a[2] + a[8])/(4*x);
			w = (a[9] - a[6])/(4*x);
			break;
		case diag_yy:
			y = 0.5*Math.sqrt(diag_yy);
			x = (a[4] + a[1])/(4*y);
			z = (a[9] + a[6])/(4*y);
			w = (a[2] - a[8])/(4*y);
			break;
		case diag_zz:
			z = 0.5*Math.sqrt(diag_zz);
			x = (a[2] + a[8])/(4*z);
			y = (a[9] + a[6])/(4*z);
			w = (a[4] - a[1])/(4*z);
			break;
		default:
			w = 0.5*Math.sqrt(diag_ww);
			x = (a[9] - a[6])/(4*w);
			y = (a[2] - a[8])/(4*w);
			z = (a[4] - a[1])/(4*w);
			break;
	}
	return new LaVector(x, y, z, w);
}

//* vim: syntax=javascript
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.XMLReq = function() {
	var self = this;
	return this;
}
Gis3d.XMLReq.prototype.createReq = function(site, target, parms, opt_method) {
	var req = null;
	var url = null;
	var method = opt_method || 'GET';
	var parm_string = '';
	if(parms && parms.length) {
		for(var i = 0; i < parms.length; ++i) {
			parm_string += parms[i].parmeter + '=' + parms[i].value + '&';
		}
	}
	switch(site) {
		case 'youtube':
			url = 'https://gdata.youtube.com/feeds/api/' + target + '?' + parm_string + 'v=2';
			break;
		case 'local':
			url = window.location.href + 'api/' + target + '.php?' + parm_string;
			break;
		default:
	}
	if(window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		req = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		// code for IE6, IE5
		req = new ActiveXObject("Microsoft.XMLHTTP");
	} else {
		alert('Please use browsers later than IE5.0 ' + 
			'to enable reference-preview function.'); 
	}
	if(req && url) {
		req.open(method, url, true);
		if('post' === method) {
			req.setRequestHeader('Content-type', 'application/json');
		}
	}
	return req;
}

//* vim: syntax=javascript
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.Event = function(type, _target) {
	var self = this;
	this.type = type;
	this.target = _target;
	this.currentTarget = this.target;
	return this;
}

//* vim: syntax=javascript
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.EventCenter = function() {
	this.logsEvents = false;
	return this;
}

Gis3d.EventCenter.prototype.registListenable = function(listenable, type) {
	// [type][{listener, callOnce}]
	var la = listenable;
	if(undefined === la.listenTable_) {
		la.listenTable_ = {};
	}
	if(undefined === la.listenTable_[type]) {
		la.listenTable_[type] = [];
	}
	return this;
}

Gis3d.EventCenter.prototype.registListener = function(listenable, type, listener, opt_thisObject, opt_callOnce) {
	var la = listenable;
	var callOnce = opt_callOnce || false;

	this.registListenable(listenable, type);

	var listeners = la.listenTable_[type];
	var repeatedAndCallOnceSetted = function(e) {
		var is_repeat = false;
		if((e.listener === this) && (e.thisObject === opt_thisObject)) {
			e.callOnce = callOnce;
			is_repeat = true;
		}
		return is_repeat;
	}
	if(!listeners.filter(repeatedAndCallOnceSetted, listener)[0]) {
		listeners.push({listener: listener, callOnce: callOnce, thisObject: opt_thisObject || window});
	}
	return this;
}

Gis3d.EventCenter.prototype.registOnceListener = function(listenable, type, listener, opt_thisObject) {
	return this.registListener(listenable, type, listener, opt_thisObject, true);
}

//Gis3d.EventCenter.prototype.removeListenable = function(listenable, type) {
//	return this;
//}

Gis3d.EventCenter.prototype.removeListener = function(listenable, type, listener) {
	var la = listenable;
	var notTheSameListener = function(e) { return !(e.listener === listener); }
	if((undefined != la.listenTable_) && la.listenTable_[type]) {
		la.listenTable_[type] = la.listenTable_[type].filter(notTheSameListener);
	}
	return this;
}

Gis3d.EventCenter.prototype.castEvent = function(listenable, type, data) {
	var la = listenable;

	this.registListenable(listenable, type);

	var listeners = la.listenTable_[type];
	var event = new Gis3d.Event(type, la);
	var notCallOnce = function(e) { return !e.callOnce; }

	event.data = data;
	for(var i = 0; i < listeners.length; ++i) {
		listeners[i].thisObject.ltn_ = listeners[i].listener;
		listeners[i].thisObject.ltn_(event);
		listeners[i].thisObject.ltn_ = undefined;
	}
	if(this.logsEvents) { console.log(listenable + ' cast ' + type); }
	la.listenTable_[type] = listeners.filter(notCallOnce);
	return this;
}

//* vim: syntax=javascript
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.KeyTable = function() {
	this.pressedKeys = [];
	return this;
}

Gis3d.KeyTable.prototype.removeOutdated = function() {
	var oneSecAgo = Date.now() - 1000;
	var pks = this.pressedKeys;
	for(var i = pks.length - 1; i > -1; --i) {
		if(oneSecAgo > pks[i].timestamp) {
			pks.splice(i, 1);
		}
	}
	return this;
}

Gis3d.KeyTable.prototype.remove = function(key) {
	var index = this.indexOf(key);
	if(-1 != index) {
		this.pressedKeys.splice(index, 1);
	}
	return this;
}

Gis3d.KeyTable.prototype.add = function(key) {
	if(-1 === this.indexOf(key)) {
		this.pressedKeys.push({key: key, timestamp: Date.now()});
	}
	return this;
}

Gis3d.KeyTable.prototype.indexOf = function(key) {
	var pks = this.pressedKeys;
	var exist = false, pin = 0;
	while((pin < pks.length) && (false === exist)) {
		if(key === pks[pin].key) {
			exist = true;
		}
		++pin;
	}
	return exist ? (pin - 1) : -1;
}

//* vim: syntax=javascript
//* vim: dictionary=~/.vim/dict/javascript.dict
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.ElementPlugin = function(target) {
	this.target = target;
	return this;
}

Gis3d.ElementPlugin.KeyboardTracker = function() {
	this.keyboardTracker = this;
	this.pressedKeys = new Gis3d.KeyTable();
	return this;
}

Gis3d.ElementPlugin.MouseTracker = function() {
	if('onwheel' in document) {
		this.wheelEventName = 'wheel';
	} else {
		this.wheelEventName = 'mousewheel';
	}
	this.state = {
		prev: null,
		axis: {x: 0, y: 0},
		move: {x: 0, y: 0},
		wheel: null,
		key: {left: 0, middle: 0, right: 0}
	};
	return this;
}
Gis3d.ElementPlugin.MouseTracker.prototype.scrollingEnabled = true;

Gis3d.ElementPlugin.KeyboardTracker.prototype.bindListeners = function(target) {
	this.target = target;
	this.target.keyboardTracker = this;
	target.addEventListener('keydown', this.replyKeydown, false);
	target.addEventListener('keypress', this.replyKeypress, false);
	target.addEventListener('keyup', this.replyKeyup, false);
	return this;
}

Gis3d.ElementPlugin.KeyboardTracker.prototype.unbindListeners = function() {
	this.target.keyboardTracker = undefined;
	this.target = null;
	target.removeEventListener('keydown', this.replyKeydown, false);
	target.removeEventListener('keypress', this.replyKeypress, false);
	target.removeEventListener('keyup', this.replyKeyup, false);
	return this;
}

Gis3d.ElementPlugin.KeyboardTracker.prototype.replyKeydown = function(e) {
	var self = this.keyboardTracker; // Can only saddly use 'this'...
	var pks = self.pressedKeys;
	var key = null;
	if('key' in e) {
		key = e.key;
	} else if('keyIdentifier' in e) {
		key = e.keyIdentifier;
		key = ('U+001B' === key) ? 'Escape' : key;
		if('U+003A' === key) { // ';'
			if(-1 != pks.indexOf('Shift')) {
				key = ':';
			}
		}
	}
	pks.add(key);
	pks.removeOutdated();
	Gis3d.eventCenter.castEvent(self, 'keydown', self.pressedKeys);
	return this;
}

Gis3d.ElementPlugin.KeyboardTracker.prototype.replyKeypress = function(e) {
	var self = this.keyboardTracker; // Can only saddly use 'this'...
	self.replyKeydown(e);
	return this;
}

Gis3d.ElementPlugin.KeyboardTracker.prototype.replyKeyup = function(e) {
	var self = this.keyboardTracker; // Can only saddly use 'this'...
	var pks = self.pressedKeys;
	var key = null;
	if('key' in e) {
		key = e.key;
	} else if('keyIdentifier' in e) {
		key = e.keyIdentifier;
		key = ('U+001B' === key) ? 'Escape' : key;
		if('U+003A' === key) { // ';'
			if(-1 != pks.indexOf('Shift')) {
				key = ':';
			}
		}
	}
	pks.remove(key);
	pks.removeOutdated();
	return this;
}

Gis3d.ElementPlugin.MouseTracker.prototype.bindListeners = function(target) {
	this.target = target;
	this.target.mouseTracker = this;
	this.target.draggable = true;
	target.addEventListener('contextmenu', this.replyContextMenu, false);
	target.addEventListener('mousedown', this.replyMouseDown, false);
	target.addEventListener('mouseup', this.replyMouseUp, false);
	target.addEventListener(this.wheelEventName, this.replyMouseWheel, false);
	target.addEventListener('mousemove', this.replyMouseMove, false);
	target.addEventListener('dragstart', this.replyDragStart, false);
	return this;
}

Gis3d.ElementPlugin.MouseTracker.prototype.unbindListeners = function() {
	this.target.draggable = false;
	this.target.mouseTracker = undefined;
	this.target = null;
	target.removeEventListener('contextmenu', this.replyContextMenu, false);
	target.removeEventListener('mousedown', this.replyMouseDown, false);
	target.removeEventListener('mouseup', this.replyMouseUp, false);
	target.removeEventListener(this.wheelEventName, this.replyMouseWheel, false);
	target.removeEventListener('mousemove', this.replyMouseMove, false);
	target.removeEventListener('dragstart', this.replyDragStart, false);
	return this;
}

Gis3d.ElementPlugin.MouseTracker.prototype.replyMouseDown = function(e) {
	var self = e.target.mouseTracker;
	if(!(self instanceof Gis3d.ElementPlugin.MouseTracker)) {
		return self;
	}
	switch(e.button) {
		case 0: self.state.key.left = 1; break;
		case 1: self.state.key.middle = 1; break;
		case 2: self.state.key.right = 1; break;
		default: break;
	}
	Gis3d.eventCenter.castEvent(self, 'mousedown', self.state);
	self.pushPrevState();
	return self;
}

Gis3d.ElementPlugin.MouseTracker.prototype.replyContextMenu = function(e) {
	var self = e.target.mouseTracker;
	if(!(self instanceof Gis3d.ElementPlugin.MouseTracker)) {
		return self;
	}
	e.preventDefault();
	return false;
}

Gis3d.ElementPlugin.MouseTracker.prototype.replyMouseUp = function(e) {
	var self = e.target.mouseTracker;
	if(!(self instanceof Gis3d.ElementPlugin.MouseTracker)) {
		return self;
	}
	switch(e.button) {
		case 0: self.state.key.left = 0; break;
		case 1: self.state.key.middle = 0; break;
		case 2: self.state.key.right = 0; break;
		default: break;
	}
	Gis3d.eventCenter.castEvent(self, 'mouseup', self.state);
	self.pushPrevState();
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	return self;
}

Gis3d.ElementPlugin.MouseTracker.prototype.replyMouseWheel = function(e) {
	var self = e.target.mouseTracker;
	if(!(self instanceof Gis3d.ElementPlugin.MouseTracker)) {
		return self;
	}
	var deltaY = e.deltaY || e.wheelDeltaY || e.wheelDelta;
	if(0 < deltaY) {
		self.state.wheel = -1;
	} else {
		self.state.wheel = 1;
	}
	Gis3d.eventCenter.castEvent(self, 'mousewheel', self.state);
	self.pushPrevState();
	if(!self.scrollingEnabled) { e.preventDefault(); }
	return self;
}

Gis3d.ElementPlugin.MouseTracker.prototype.replyMouseMove = function(e) {
	var self = e.target.mouseTracker;
	if(!(self instanceof Gis3d.ElementPlugin.MouseTracker)) {
		return self;
	}
	var startX = 0, startY = 0;
	for(
		var parentElement = e.target;
		parentElement;
		parentElement = parentElement.offsetParent
	) {
		startX += parentElement.offsetLeft;
		startX += parentElement.offsetTop;
	}
	self.state.axis.x = e.clientX - startX;
	self.state.axis.y = e.clientY - startY;
	if(self.state.prev) {
		self.state.move.x = e.clientX - self.state.prev.axis.x;
		self.state.move.y = e.clientY - self.state.prev.axis.y;
	}
	Gis3d.eventCenter.castEvent(self, 'mousemove', self.state);
	if(self.state.key.left || self.state.key.middle || self.state.key.right) {
		Gis3d.eventCenter.castEvent(self, 'mousedrag', self.state);
	}
	self.pushPrevState();
	return self;
}

Gis3d.ElementPlugin.MouseTracker.prototype.replyDragStart = function(e) {
	e.preventDefault();
	return self;
}

Gis3d.ElementPlugin.MouseTracker.prototype.pushPrevState = function() {
	var s = this.state;
	this.state.prev = {
		axis: {x: s.axis.x, y: s.axis.y},
		move: {x: s.move.x, y: s.move.y},
		wheel: s.wheel,
		key: {left: s.key.left, middle: s.key.middle, right: s.key.right}
	};
	return this.state;
}

//* vim: syntax=javascript
//* vim: dictionary=~/.vim/dict/javascript.dict
if(undefined === Gis3d) { var Gis3d = function() {}; };
if(undefined === Gis3d.ShaderProgram) { Gis3d.ShaderProgram = function() {}; };
Gis3d.ShaderProgram.BlendColor = function(ctx) {
	if(!ctx || !(ctx instanceof WebGLRenderingContext)) {
		console.warn('No WebGL context, no shader program.');
		return null;
	}
	var vert_shader = null;
	var frag_shader = null;
	this.wglContext = ctx;
	this.programUsing = false;

	// Initial vertex shader.
	vert_shader = ctx.createShader(ctx.VERTEX_SHADER);
	ctx.shaderSource(vert_shader, this.vertexSource);
	ctx.compileShader(vert_shader);
	if(!ctx.getShaderParameter(vert_shader, ctx.COMPILE_STATUS))
		console.error(ctx.getShaderInfoLog(vert_shader));

	// Initial fragement shader.
	frag_shader = ctx.createShader(ctx.FRAGMENT_SHADER);
	ctx.shaderSource(frag_shader, this.fregmentSource);
	ctx.compileShader(frag_shader);
	if(!ctx.getShaderParameter(frag_shader, ctx.COMPILE_STATUS))
		console.error(ctx.getShaderInfoLog(frag_shader));

	// Create shader program.
	this.program = ctx.createProgram();
	ctx.attachShader(this.program, vert_shader);
	ctx.attachShader(this.program, frag_shader);
	ctx.linkProgram(this.program);
	if(!ctx.getProgramParameter(this.program, ctx.LINK_STATUS))
		console.error("Create shader program fail!");

	// Enable data locations.
	this.dataLocation = {
		uniform: {w: null, v:null, p: null},
		attrib: {pos: null, color: null}
	};
	this.dataLocation.uniform.w = ctx.getUniformLocation(this.program, "w_uni");
	this.dataLocation.uniform.v = ctx.getUniformLocation(this.program, "v_uni");
	this.dataLocation.uniform.p = ctx.getUniformLocation(this.program, "p_uni");
	this.dataLocation.attrib.pos = ctx.getAttribLocation(this.program, "pos_att");
	ctx.enableVertexAttribArray(this.dataLocation.attrib.pos);
	this.dataLocation.attrib.color = ctx.getAttribLocation(this.program, "color_att");
	ctx.enableVertexAttribArray(this.dataLocation.attrib.color);

	this.buffer = {pos: null, color: null, index: null};

	this.unitedModel = null;
	return this;
}

Gis3d.ShaderProgram.BlendColor.prototype.vertexSource = ""
	+ "uniform mat4 w_uni;"
	+ "uniform mat4 v_uni;"
	+ "uniform mat4 p_uni;"
	+ "attribute vec4 pos_att;"
	+ "attribute vec4 color_att;"
	+ "varying vec4 color_vary;"
	+ "void main(void) {"
	+ "	gl_Position = pos_att * w_uni * v_uni * p_uni;"
	+ "	color_vary = color_att;"
	+ "}";

Gis3d.ShaderProgram.BlendColor.prototype.fregmentSource = ""
	+ "precision mediump float;"
	+ "varying vec4 color_vary;"
	+ "void main(void) {"
	+ "	gl_FragColor = color_vary;"
	+ "}";

Gis3d.ShaderProgram.BlendColor.prototype.useProgram = function() {
	this.wglContext.useProgram(this.program);
	return this;
}

Gis3d.ShaderProgram.BlendColor.prototype.setWorld = function(opt_w) {
	var w = null;
	this.useProgram();
	if(opt_w instanceof LaMatrix) {
		w = opt_w;
	} else {
		w = new LaMatrix();
		console.warn('Wrong world matrix arg, use Identity.');
	}
	this.wglContext.uniformMatrix4fv(
		this.dataLocation.uniform.w,
		false,
		w.getTranspose().array
	);
	return this;
}

Gis3d.ShaderProgram.BlendColor.prototype.setView = function(opt_v) {
	var v = null;
	this.useProgram();
	if(opt_v instanceof LaMatrix) {
		v = opt_v;
	} else {
		v = new LaMatrix();
		console.warn('Wrong view matrix arg, use Identity.');
	}
	this.wglContext.uniformMatrix4fv(
		this.dataLocation.uniform.v,
		false,
		v.getTranspose().array
	);
	return this;
}

Gis3d.ShaderProgram.BlendColor.prototype.setProjection = function(opt_p) {
	var p = null;
	this.useProgram();
	if(opt_p instanceof LaMatrix) {
		p = opt_p;
	} else {
		p = new LaMatrix();
		console.warn('Wrong projection matrix arg, use Identity.');
	}
	this.wglContext.uniformMatrix4fv(
		this.dataLocation.uniform.p,
		false,
		p.getTranspose().array
	);
	return this;
}

Gis3d.ShaderProgram.BlendColor.prototype.setVertex = function(v) {
	var vertices = null;
	var ctx = this.wglContext;
	if(v instanceof Float32Array) {
		vertices = v;
		if(null == this.buffer.pos) {
			this.buffer.pos = ctx.createBuffer()
			this.buffer.pos.itemSize = 4;
		}
		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.pos);
		ctx.bufferData(ctx.ARRAY_BUFFER, vertices, ctx.DYNAMIC_DRAW);
		this.buffer.pos.numItems = vertices.length/this.buffer.pos.itemSize;
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.pos,
			this.buffer.pos.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);
	} else {
		console.error('Vertex is not a Float32Array.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendColor.prototype.setColor = function(c) {
	var colors = null;
	var ctx = this.wglContext;
	if(c instanceof Float32Array) {
		colors = c;
		if(null == this.buffer.color) {
			this.buffer.color = ctx.createBuffer()
			this.buffer.color.itemSize = 4;
		}
		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.color);
		ctx.bufferData(ctx.ARRAY_BUFFER, colors, ctx.DYNAMIC_DRAW);
		this.buffer.color.numItems = colors.length/this.buffer.color.itemSize;
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.color,
			this.buffer.color.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);
	} else {
		console.error('Color is not an Float32Array.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendColor.prototype.setIndex = function(i) {
	var indexes = null;
	var ctx = this.wglContext;
	if(i instanceof Uint16Array) {
		indexes = i;
		if(null == this.buffer.index) {
			this.buffer.index = ctx.createBuffer()
			this.buffer.index.itemSize = 1;
		}
		ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.buffer.index);
		ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, indexes, ctx.DYNAMIC_DRAW);
		this.buffer.index.numItems = indexes.length;
	} else {
		console.error('Index is not an Uint16Array.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendColor.prototype.setModel = function(m) {
	var model = null;
	if(
		(m.vertex instanceof Float32Array)
		&& (m.color instanceof Float32Array)
		&& (m.vertex.length == m.color.length)
		&& (m.index instanceof Uint16Array)
	) {
		model = m;
		this.setVertex(model.vertex);
		this.setColor(model.color);
		this.setIndex(model.index);
		this.unitedModel = null;
	} else {
		console.error('Wrong model object structure.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendColor.prototype.setUnitedModel = function(u) {
	var validated = true;
	if(Array.isArray(u) && (0 != u.length)) {
		for(var i = 0, len = u.indexes.length; i < len; ++i) {
			if(
				!(u.vertexes[i] instanceof Float32Array)
				&& !(u.colors[i] instanceof Float32Array)
				&& !(u.vertexes[i].length === m.colors[i].length)
				&& !(u.indexes[i] instanceof Uint16Array)
			) {
				validated = false;
			}
		}
	}
	if(true === validated) {
		this.unitedModel = u;
	} else {
		console.error('Wrong united model object structure.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendColor.prototype.assignBuffers = function() {
	var ctx = this.wglContext;
	var buffer = this.buffer;
	if(buffer.pos && buffer.color && buffer.index) {
		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.pos);
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.pos,
			this.buffer.pos.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);
		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.color);
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.color,
			this.buffer.color.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);
		ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.buffer.index);
	}
	return this;
}

Gis3d.ShaderProgram.BlendColor.prototype.draw = function() {
	var ctx = this.wglContext;
	var buffer = this.buffer;
	this.useProgram();
	this.assignBuffers();
	var u = this.unitedModel;
	if((null != this.unitedModel) && u.vertexes && (0 != u.vertexes.length)) {
		ctx.enable(ctx.BLEND);
		ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
		ctx.depthMask(false);
		for(var i = 0, len = u.vertexes.length; i < len; ++i) {
			this.setVertex(u.vertexes[i]);
			this.setColor(u.colors[i]);
			this.setIndex(u.indexes[i]);
			ctx.drawElements(ctx.TRIANGLES, buffer.index.numItems, ctx.UNSIGNED_SHORT, 0);
		}
		ctx.depthMask(true);
		ctx.disable(ctx.BLEND);
	} else if(buffer.pos && buffer.color && buffer.index) {
		ctx.enable(ctx.BLEND);
		ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
		ctx.depthMask(false);
		ctx.drawElements(ctx.TRIANGLES, buffer.index.numItems, ctx.UNSIGNED_SHORT, 0);
		ctx.depthMask(true);
		ctx.disable(ctx.BLEND);
	} else {
		console.error('Incomplete buffer datas.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendColor.prototype.deleteBuffer = function() {
	var ctx = this.wglContext;
	if(this.buffer.pos && this.buffer.color && this.buffer.index) {
		ctx.deleteBuffer(this.buffer.pos);
		ctx.deleteBuffer(this.buffer.color);
		ctx.deleteBuffer(this.buffer.index);
		this.buffer = {pos: null, color: null, index: null};
	} else {
		console.error('Incomplete buffer datas.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendColor.prototype.drawOnce = function(m, opt_w, opt_v, opt_p) {
	if(this.wglContext instanceof WebGLRenderingContext) {
		this.setWorld(opt_w);
		this.setView(opt_v);
		this.setProjection(opt_p);
		this.setModel(m);
		this.draw();
		this.deleteBuffer();
	}
	return this;
}

//* vim: syntax=javascript
if(undefined === Gis3d) { var Gis3d = function() {}; };
if(undefined === Gis3d.ShaderProgram) { Gis3d.ShaderProgram = function() {}; };
Gis3d.ShaderProgram.BlendLight = function(ctx) {
	if(!ctx || !(ctx instanceof WebGLRenderingContext)) {
		console.warn('No WebGL context, no shader program.');
		return null;
	}
	var vert_shader = null;
	var frag_shader = null;
	this.wglContext = ctx;
	this.programUsing = false;

	// Initial vertex shader.
	vert_shader = ctx.createShader(ctx.VERTEX_SHADER);
	ctx.shaderSource(vert_shader, this.vertexSource);
	ctx.compileShader(vert_shader);
	if(!ctx.getShaderParameter(vert_shader, ctx.COMPILE_STATUS))
		console.error(ctx.getShaderInfoLog(vert_shader));

	// Initial fragement shader.
	frag_shader = ctx.createShader(ctx.FRAGMENT_SHADER);
	ctx.shaderSource(frag_shader, this.fregmentSource);
	ctx.compileShader(frag_shader);
	if(!ctx.getShaderParameter(frag_shader, ctx.COMPILE_STATUS))
		console.error(ctx.getShaderInfoLog(frag_shader));

	// Create shader program.
	this.program = ctx.createProgram();
	ctx.attachShader(this.program, vert_shader);
	ctx.attachShader(this.program, frag_shader);
	ctx.linkProgram(this.program);
	if(!ctx.getProgramParameter(this.program, ctx.LINK_STATUS))
		console.error("Create shader program fail!");

	// Enable data locations.
	this.dataLocation = {
		uniform: {wv: null, p: null, n: null},
		attrib: {pos: null, color: null, normal: null}
	};
	this.dataLocation.uniform.wv = ctx.getUniformLocation(this.program, "wv_uni");
	this.dataLocation.uniform.p = ctx.getUniformLocation(this.program, "p_uni");
	this.dataLocation.uniform.n = ctx.getUniformLocation(this.program, "n_uni");
	this.dataLocation.attrib.pos = ctx.getAttribLocation(this.program, "pos_att");
	ctx.enableVertexAttribArray(this.dataLocation.attrib.pos);
	this.dataLocation.attrib.color = ctx.getAttribLocation(this.program, "color_att");
	ctx.enableVertexAttribArray(this.dataLocation.attrib.color);
	this.dataLocation.attrib.normal = ctx.getAttribLocation(this.program, "normal_att");
	ctx.enableVertexAttribArray(this.dataLocation.attrib.normal);

	this.buffer = {pos: null, color: null, index: null, normal: null};

	this.unitedModel = null;
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.vertexSource = ""
	+ "uniform mat4 wv_uni;"
	+ "uniform mat4 p_uni;"
	+ "uniform mat4 n_uni;"
	+ "attribute vec4 pos_att;"
	+ "attribute vec4 color_att;"
	+ "attribute vec4 normal_att;"
	+ "varying vec4 color_vary;"
	+ "varying vec4 view_pos_vary;"
	+ "varying vec4 n_normal_vary;"
	+ "void main(void) {"
	+ "	view_pos_vary = pos_att * wv_uni;"
	+ "	gl_Position = view_pos_vary * p_uni;"
	+ "	color_vary = color_att;"
	+ "	n_normal_vary = normal_att * n_uni;"
	+ "}";

Gis3d.ShaderProgram.BlendLight.prototype.fregmentSource = ""
	+ "precision mediump float;"
	+ "varying vec4 color_vary;"
	+ "varying vec4 view_pos_vary;"
	+ "varying vec4 n_normal_vary;"
	+ "void main(void) {"
	+ "	vec3 n_normal = n_normal_vary.xyz;"
	+ "	vec3 light_pos = vec3(0.5, 0.5, 0.5);"
	+ "	vec3 light_dir = normalize(light_pos - view_pos_vary.xyz);"
	+ "	vec3 light = vec3(0.5, 0.5, 0.5) * min(max(dot(light_dir, n_normal), 0.0), 1.0);"
	+ "	gl_FragColor.rgb = color_vary.xyz + light;"
	+ "	gl_FragColor.a = 0.5;"
	+ "}";

Gis3d.ShaderProgram.BlendLight.prototype.useProgram = function() {
	this.wglContext.useProgram(this.program);
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.setWorld = function(opt_w) {
	var w = null;
	this.useProgram();
	if(opt_w instanceof LaMatrix) {
		w = opt_w;
	} else {
		w = new LaMatrix();
		console.warn('Wrong world matrix arg, use Identity.');
	}

	var v = this.viewMatrix || new LaMatrix().loadIdentity();
	var wv = w.getMul(v);
	this.wglContext.uniformMatrix4fv(
		this.dataLocation.uniform.wv,
		false,
		wv.getTranspose().array
	);

	var n = wv.getFastInverse().getTranspose();
	this.wglContext.uniformMatrix4fv(
		this.dataLocation.uniform.n,
		false,
		n.getTranspose().array
	);
	this.worldMatrix = w;
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.setView = function(opt_v) {
	var v = null;
	this.useProgram();
	if(opt_v instanceof LaMatrix) {
		v = opt_v;
	} else {
		v = new LaMatrix();
		console.warn('Wrong view matrix arg, use Identity.');
	}

	var w = this.worldMatrix || new LaMatrix().loadIdentity();
	var wv = w.getMul(v);
	this.wglContext.uniformMatrix4fv(
		this.dataLocation.uniform.wv,
		false,
		wv.getTranspose().array
	);

	var n = wv.getFastInverse().getTranspose();
	this.wglContext.uniformMatrix4fv(
		this.dataLocation.uniform.n,
		false,
		n.getTranspose().array
	);
	this.viewMatrix = v;
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.setProjection = function(opt_p) {
	var p = null;
	this.useProgram();
	if(opt_p instanceof LaMatrix) {
		p = opt_p;
	} else {
		p = new LaMatrix();
		console.warn('Wrong projection matrix arg, use Identity.');
	}
	this.wglContext.uniformMatrix4fv(
		this.dataLocation.uniform.p,
		false,
		p.getTranspose().array
	);
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.setVertex = function(v) {
	var vertices = null;
	var ctx = this.wglContext;
	if(v instanceof Float32Array) {
		vertices = v;
		if(null == this.buffer.pos) {
			this.buffer.pos = ctx.createBuffer()
			this.buffer.pos.itemSize = 4;
		}
		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.pos);
		ctx.bufferData(ctx.ARRAY_BUFFER, vertices, ctx.DYNAMIC_DRAW);
		this.buffer.pos.numItems = vertices.length/this.buffer.pos.itemSize;
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.pos,
			this.buffer.pos.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);
	} else {
		console.error('Vertex is not a Float32Array.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.setColor = function(c) {
	var colors = null;
	var ctx = this.wglContext;
	if(c instanceof Float32Array) {
		colors = c;
		if(null == this.buffer.color) {
			this.buffer.color = ctx.createBuffer()
			this.buffer.color.itemSize = 4;
		}
		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.color);
		ctx.bufferData(ctx.ARRAY_BUFFER, colors, ctx.DYNAMIC_DRAW);
		this.buffer.color.numItems = colors.length/this.buffer.color.itemSize;
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.color,
			this.buffer.color.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);
	} else {
		console.error('Color is not an Float32Array.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.setIndex = function(i) {
	var indexes = null;
	var ctx = this.wglContext;
	if(i instanceof Uint16Array) {
		indexes = i;
		if(null == this.buffer.index) {
			this.buffer.index = ctx.createBuffer()
			this.buffer.index.itemSize = 1;
		}
		ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.buffer.index);
		ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, indexes, ctx.DYNAMIC_DRAW);
		this.buffer.index.numItems = indexes.length;
	} else {
		console.error('Index is not an Uint16Array.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.setNormal = function(n) {
	var normal = null;
	var ctx = this.wglContext;
	if(n instanceof Float32Array) {
		normal = n;
		if(null == this.buffer.normal) {
			this.buffer.normal = ctx.createBuffer()
			this.buffer.normal.itemSize = 4;
		}
		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.normal);
		ctx.bufferData(ctx.ARRAY_BUFFER, normal, ctx.DYNAMIC_DRAW);
		this.buffer.normal.numItems = normal.length/this.buffer.normal.itemSize;
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.normal,
			this.buffer.normal.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);
	} else {
		console.error('Normal is not an Float32Array.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.setModel = function(m) {
	var model = null;
	if(
		(m.vertex instanceof Float32Array)
		&& (m.color instanceof Float32Array)
		&& (m.vertex.length == m.color.length)
		&& (m.index instanceof Uint16Array)
		&& (m.normal instanceof Float32Array)
	) {
		model = m;
		this.setVertex(model.vertex);
		this.setColor(model.color);
		this.setIndex(model.index);
		this.setNormal(model.normal);
		this.unitedModel = null;
	} else {
		console.error('Wrong model object structure.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.setUnitedModel = function(u) {
	var validated = true;
	if(Array.isArray(u) && (0 != u.length)) {
		for(var i = 0, len = u.indexes.length; i < len; ++i) {
			if(
				!(u.vertexes[i] instanceof Float32Array)
				&& !(u.colors[i] instanceof Float32Array)
				&& !(u.vertexes[i].length === m.colors[i].length)
				&& !(u.indexes[i] instanceof Uint16Array)
				&& !(u.normals[i] instanceof Float32Array)
			) {
				validated = false;
			}
		}
	}
	if(true === validated) {
		this.unitedModel = u;
	} else {
		console.error('Wrong united model object structure.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.assignBuffers = function() {
	var ctx = this.wglContext;
	var buffer = this.buffer;
	if(buffer.pos && buffer.color && buffer.index && buffer.normal) {
		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.pos);
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.pos,
			this.buffer.pos.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);

		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.color);
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.color,
			this.buffer.color.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);

		ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.buffer.index);

		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.normal);
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.normal,
			this.buffer.normal.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);
	}
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.draw = function() {
	var ctx = this.wglContext;
	var buffer = this.buffer;
	this.useProgram();
	this.assignBuffers();
	var u = this.unitedModel;
	if((null != this.unitedModel) && u.vertexes && (0 != u.vertexes.length)) {
		ctx.enable(ctx.BLEND);
		ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
		ctx.depthMask(false);
		for(var i = 0, len = u.vertexes.length; i < len; ++i) {
			this.setVertex(u.vertexes[i]);
			this.setColor(u.colors[i]);
			this.setIndex(u.indexes[i]);
			this.setNormal(u.normals[i]);
			ctx.drawElements(ctx.TRIANGLES, buffer.index.numItems, ctx.UNSIGNED_SHORT, 0);
		}
		ctx.depthMask(true);
		ctx.disable(ctx.BLEND);
	} else if(buffer.pos && buffer.color && buffer.index) {
		ctx.enable(ctx.BLEND);
		ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
		ctx.depthMask(false);
		ctx.drawElements(ctx.TRIANGLES, buffer.index.numItems, ctx.UNSIGNED_SHORT, 0);
		ctx.depthMask(true);
		ctx.disable(ctx.BLEND);
	} else {
		console.error('Incomplete buffer datas.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.deleteBuffer = function() {
	var ctx = this.wglContext;
	if(this.buffer.pos && this.buffer.color && this.buffer.index && this.buffer.normal) {
		ctx.deleteBuffer(this.buffer.pos);
		ctx.deleteBuffer(this.buffer.color);
		ctx.deleteBuffer(this.buffer.index);
		ctx.deleteBuffer(this.buffer.normal);
		this.buffer = {pos: null, color: null, index: null, normal: null};
	} else {
		console.error('Incomplete buffer datas.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.drawOnce = function(m, opt_w, opt_v, opt_p) {
	if(this.wglContext instanceof WebGLRenderingContext) {
		this.setWorld(opt_w);
		this.setView(opt_v);
		this.setProjection(opt_p);
		this.setModel(m);
		this.draw();
		this.deleteBuffer();
	}
	return this;
}

//* vim: syntax=javascript
if(undefined === Gis3d) { var Gis3d = function() {}; };
if(undefined === Gis3d.ShaderProgram) { Gis3d.ShaderProgram = function() {}; };
Gis3d.ShaderProgram.LinesColor = function(ctx) {
	if(!ctx || !(ctx instanceof WebGLRenderingContext)) {
		console.warn('No WebGL context, no shader program.');
		return null;
	}
	var vert_shader = null;
	var frag_shader = null;
	this.wglContext = ctx;
	this.programUsing = false;

	// Initial vertex shader.
	vert_shader = ctx.createShader(ctx.VERTEX_SHADER);
	ctx.shaderSource(vert_shader, this.vertexSource);
	ctx.compileShader(vert_shader);
	if(!ctx.getShaderParameter(vert_shader, ctx.COMPILE_STATUS))
		console.error(ctx.getShaderInfoLog(vert_shader));

	// Initial fragement shader.
	frag_shader = ctx.createShader(ctx.FRAGMENT_SHADER);
	ctx.shaderSource(frag_shader, this.fregmentSource);
	ctx.compileShader(frag_shader);
	if(!ctx.getShaderParameter(frag_shader, ctx.COMPILE_STATUS))
		console.error(ctx.getShaderInfoLog(frag_shader));

	// Create shader program.
	this.program = ctx.createProgram();
	ctx.attachShader(this.program, vert_shader);
	ctx.attachShader(this.program, frag_shader);
	ctx.linkProgram(this.program);
	if(!ctx.getProgramParameter(this.program, ctx.LINK_STATUS))
		console.error("Create shader program fail!");

	// Enable data locations.
	this.dataLocation = {
		uniform: {w: null, v:null, p: null},
		attrib: {pos: null, color: null}
	};
	this.dataLocation.uniform.w = ctx.getUniformLocation(this.program, "w_uni");
	this.dataLocation.uniform.v = ctx.getUniformLocation(this.program, "v_uni");
	this.dataLocation.uniform.p = ctx.getUniformLocation(this.program, "p_uni");
	this.dataLocation.attrib.pos = ctx.getAttribLocation(this.program, "pos_att");
	ctx.enableVertexAttribArray(this.dataLocation.attrib.pos);
	this.dataLocation.attrib.color = ctx.getAttribLocation(this.program, "color_att");
	ctx.enableVertexAttribArray(this.dataLocation.attrib.color);

	this.buffer = {pos: null, color: null, index: null};
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.vertexSource = ""
	+ "uniform mat4 w_uni;"
	+ "uniform mat4 v_uni;"
	+ "uniform mat4 p_uni;"
	+ "attribute vec4 pos_att;"
	+ "attribute vec4 color_att;"
	+ "varying vec4 color_vary;"
	+ "void main(void) {"
	+ "	gl_Position = pos_att * w_uni * v_uni * p_uni;"
	+ "	color_vary = color_att;"
	+ "}";

Gis3d.ShaderProgram.LinesColor.prototype.fregmentSource = ""
	+ "precision mediump float;"
	+ "varying vec4 color_vary;"
	+ "void main(void) {"
	+ "	gl_FragColor = color_vary;"
	+ "}";

Gis3d.ShaderProgram.LinesColor.prototype.useProgram = function() {
	this.wglContext.useProgram(this.program);
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.setWorld = function(opt_w) {
	var w = null;
	this.useProgram();
	if(opt_w instanceof LaMatrix) {
		w = opt_w;
	} else {
		w = new LaMatrix();
		console.warn('Wrong world matrix arg, use Identity.');
	}
	this.wglContext.uniformMatrix4fv(
		this.dataLocation.uniform.w,
		false,
		w.getTranspose().array
	);
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.setView = function(opt_v) {
	var v = null;
	this.useProgram();
	if(opt_v instanceof LaMatrix) {
		v = opt_v;
	} else {
		v = new LaMatrix();
		console.warn('Wrong view matrix arg, use Identity.');
	}
	this.wglContext.uniformMatrix4fv(
		this.dataLocation.uniform.v,
		false,
		v.getTranspose().array
	);
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.setProjection = function(opt_p) {
	var p = null;
	this.useProgram();
	if(opt_p instanceof LaMatrix) {
		p = opt_p;
	} else {
		p = new LaMatrix();
		console.warn('Wrong projection matrix arg, use Identity.');
	}
	this.wglContext.uniformMatrix4fv(
		this.dataLocation.uniform.p,
		false,
		p.getTranspose().array
	);
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.setVertex = function(v) {
	var vertices = null;
	var ctx = this.wglContext;
	if(v instanceof Float32Array) {
		vertices = v;
		if(null == this.buffer.pos) {
			this.buffer.pos = ctx.createBuffer()
			this.buffer.pos.itemSize = 4;
		}
		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.pos);
		ctx.bufferData(ctx.ARRAY_BUFFER, vertices, ctx.DYNAMIC_DRAW);
		this.buffer.pos.numItems = vertices.length/this.buffer.pos.itemSize;
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.pos,
			this.buffer.pos.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);
	} else {
		console.error('Vertex is not a Float32Array.');
	}
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.setColor = function(c) {
	var colors = null;
	var ctx = this.wglContext;
	if(c instanceof Float32Array) {
		colors = c;
		if(null == this.buffer.color) {
			this.buffer.color = ctx.createBuffer()
			this.buffer.color.itemSize = 4;
		}
		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.color);
		ctx.bufferData(ctx.ARRAY_BUFFER, colors, ctx.DYNAMIC_DRAW);
		this.buffer.color.numItems = colors.length/this.buffer.color.itemSize;
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.color,
			this.buffer.color.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);
	} else {
		console.error('Color is not an Float32Array.');
	}
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.setIndex = function(i) {
	var indexes = null;
	var ctx = this.wglContext;
	if(i instanceof Uint16Array) {
		indexes = i;
		if(null == this.buffer.index) {
			this.buffer.index = ctx.createBuffer()
			this.buffer.index.itemSize = 1;
		}
		ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.buffer.index);
		ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, indexes, ctx.DYNAMIC_DRAW);
		this.buffer.index.numItems = indexes.length;
	} else {
		console.error('Index is not an Uint16Array.');
	}
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.setModel = function(m) {
	var model = null;
	if(
		(m.vertex instanceof Float32Array)
		&& (m.color instanceof Float32Array)
		&& (m.vertex.length == m.color.length)
		&& (m.index instanceof Uint16Array)
	) {
		model = m;
		this.setVertex(model.vertex);
		this.setColor(model.color);
		this.setIndex(model.index);
	} else {
		console.error('Wrong model object structure.', m);
	}
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.assignBuffers = function() {
	var ctx = this.wglContext;
	var buffer = this.buffer;
	if(buffer.pos && buffer.color && buffer.index) {
		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.pos);
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.pos,
			this.buffer.pos.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);
		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.color);
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.color,
			this.buffer.color.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);
		ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.buffer.index);
	}
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.draw = function() {
	var ctx = this.wglContext;
	var buffer = this.buffer;
	this.useProgram();
	if(buffer.pos && buffer.color && buffer.index) {
		this.assignBuffers();
		ctx.enable(ctx.BLEND);
		ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
		ctx.depthMask(false);
		ctx.drawElements(ctx.LINES, buffer.index.numItems, ctx.UNSIGNED_SHORT, 0);
		ctx.depthMask(true);
		ctx.disable(ctx.BLEND);
	} else {
		console.error('Incomplete buffer datas.');
	}
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.deleteBuffer = function() {
	var ctx = this.wglContext;
	if(this.buffer.pos && this.buffer.color && this.buffer.index) {
		ctx.deleteBuffer(this.buffer.pos);
		ctx.deleteBuffer(this.buffer.color);
		ctx.deleteBuffer(this.buffer.index);
		this.buffer = {pos: null, color: null, index: null};
	} else {
		console.error('Incomplete buffer datas.');
	}
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.drawOnce = function(m, opt_w, opt_v, opt_p) {
	if(this.wglContext instanceof WebGLRenderingContext) {
		this.setWorld(opt_w);
		this.setView(opt_v);
		this.setProjection(opt_p);
		this.setModel(m);
		this.draw();
		this.deleteBuffer();
	}
	return this;
}

//* vim: syntax=javascript
if(undefined === Gis3d) { var Gis3d = function() {}; };
if(undefined === Gis3d.ShaderProgram) { Gis3d.ShaderProgram = function() {}; };

//* vim: syntax=javascript
// pnltri.js / raw.github.com/jahting/pnltri.js/master/LICENSE
/**
 * @author jahting / http://www.ameco.tv/
 *
 *	(Simple) Polygon Near-Linear Triangulation
 *	  with fast ear-clipping for polygons without holes
 *
 */
 
var PNLTRI = { REVISION: '2.1.1' };

//	#####  Global Constants  #####


//	#####  Global Variables  #####


/**
 * @author jahting / http://www.ameco.tv/
 */

PNLTRI.Math = {

	random: Math.random,		// function to use for random number generation

	// generate random ordering in place:
	//	Fisher-Yates shuffle
	array_shuffle: function( inoutArray ) {
		for (var i = inoutArray.length - 1; i > 0; i-- ) {
			var j = Math.floor( PNLTRI.Math.random() * (i+1) );
			var tmp = inoutArray[i];
			inoutArray[i] = inoutArray[j];
			inoutArray[j] = tmp;
		}
		return	inoutArray;
	},


	//	like compare (<=>)
	//		yA > yB resp. xA > xB: 1, equal: 0, otherwise: -1
	compare_pts_yx: function ( inPtA, inPtB ) {
		var deltaY = inPtA.y - inPtB.y;
		if ( deltaY < PNLTRI.Math.EPSILON_N ) {
			return -1;
		} else if ( deltaY > PNLTRI.Math.EPSILON_P ) {
			return 1;
		} else {
			var deltaX = inPtA.x - inPtB.x;
			if ( deltaX < PNLTRI.Math.EPSILON_N ) {
				return -1;
			} else if ( deltaX > PNLTRI.Math.EPSILON_P ) {
				return  1;
			} else {
				return  0;
			}
		}
	},


	ptsCrossProd: function ( inPtVertex, inPtFrom, inPtTo ) {
		// two vectors: ( v0: inPtVertex -> inPtFrom ), ( v1: inPtVertex -> inPtTo )
		// CROSS_SINE: sin(theta) * len(v0) * len(v1)
		return	( inPtFrom.x - inPtVertex.x ) * ( inPtTo.y - inPtVertex.y ) -
				( inPtFrom.y - inPtVertex.y ) * ( inPtTo.x - inPtVertex.x );
		// <=> crossProd( inPtFrom-inPtVertex, inPtTo-inPtVertex )
		// == 0: colinear (angle == 0 or 180 deg == PI rad)
		// > 0:  v1 lies left of v0, CCW angle from v0 to v1 is convex ( < 180 deg )
		// < 0:  v1 lies right of v0, CW angle from v0 to v1 is convex ( < 180 deg )
	},

};

// precision of floating point arithmetic
//	PNLTRI.Math.EPSILON_P = Math.pow(2,-32);	// ~ 0.0000000001
	PNLTRI.Math.EPSILON_P = Math.pow(2,-43);	// ~ 0.0000000000001
	PNLTRI.Math.EPSILON_N = -PNLTRI.Math.EPSILON_P;

//	Problem with EPSILON-compares:
//	- especially when there is a x-coordinate ordering on equal y-coordinates
//		=> either NO EPSILON-compares on y-coordinates, since almost equal y
//			can have very different x - so they are not nearly close
//		or EPSILON must be bigger: Solution so far.
/**
 * @author jahting / http://www.ameco.tv/
 */

/** @constructor */
PNLTRI.PolygonData = function ( inPolygonChainList ) {

	// list of polygon vertices
	//	.x, .y: coordinates
	this.vertices = [];

	// list of polygon segments, original polygons ane holes
	//	and additional ones added during the subdivision into
	//	uni-y-monotone polygons (s. this.monoSubPolyChains)
	//	doubly linked by: snext, sprev
	this.segments = [];
	this.diagonals = [];

	// for the ORIGINAL polygon chains
	this.idNextPolyChain = 0;
	//	for each original chain: lies the polygon inside to the left?
	//	"true": winding order is CCW for a contour or CW for a hole
	//	"false": winding order is CW for a contour or CCW for a hole
	this.PolyLeftArr = [];

	// indices into this.segments: at least one for each monoton chain for the polygon
	//  these subdivide the polygon into uni-y-monotone polygons, that is
	//  polygons that have only one segment between ymax and ymin on one side
	//  and the other side has monotone increasing y from ymin to ymax
	// the monoSubPolyChains are doubly linked by: mnext, mprev
	this.monoSubPolyChains = [];

	// list of triangles: each 3 indices into this.vertices
	this.triangles = [];

	// initialize optional polygon chains
	if ( inPolygonChainList ) {
		for (var i=0, j=inPolygonChainList.length; i<j; i++) {
			this.addPolygonChain( inPolygonChainList[i] );
		}
	}

};


PNLTRI.PolygonData.prototype = {

	constructor: PNLTRI.PolygonData,


	/*	Accessors  */

	nbVertices: function () {
		return	this.vertices.length;
	},
	getSegments: function () {
		return	this.segments;
	},
	getFirstSegment: function () {
		return	this.segments[0];
	},
	getMonoSubPolys: function () {
		return	this.monoSubPolyChains;
	},
	getTriangles: function () {
		return	this.triangles.concat();
	},

	nbPolyChains: function () {
		return	this.idNextPolyChain;
	},

	// for the polygon data AFTER triangulation
	//	returns an Array of flags, one flag for each polygon chain:
	//		lies the inside of the polygon to the left?
	//		"true" implies CCW for contours and CW for holes
	get_PolyLeftArr: function () {
		return	this.PolyLeftArr.concat();
	},
	set_PolyLeft_wrong: function ( inChainId ) {
		this.PolyLeftArr[inChainId] = false;
	},


	/*	Helper  */

	// checks winding order by calculating the area of the polygon
	isClockWise: function ( inStartSeg ) {
		var cursor = inStartSeg, doubleArea = 0;
		do {
			doubleArea += ( cursor.vFrom.x - cursor.vTo.x ) * ( cursor.vFrom.y + cursor.vTo.y );
			cursor = cursor.snext;
		} while ( cursor != inStartSeg );
		return	( doubleArea < 0 );
	},


	/*	Operations  */

	appendVertexEntry: function ( inVertexX, inVertexY ) {			// private
		var vertex = {
				id: this.vertices.length,	// vertex id, representing input sequence
				x: inVertexX,				// coordinates
				y: inVertexY,
			};
		this.vertices.push( vertex );
		return	vertex;
	},


	createSegmentEntry: function ( inVertexFrom, inVertexTo ) {			// private
		return	{
			chainId: this.idNextPolyChain,
			// end points of segment
			vFrom: inVertexFrom,	// -> start point entry in vertices
			vTo: inVertexTo,		// -> end point entry in vertices
			// upward segment? (i.e. vTo > vFrom) !!! only valid for sprev,snext NOT for mprev,mnext !!!
			upward: ( PNLTRI.Math.compare_pts_yx(inVertexTo, inVertexFrom) == 1 ),
			// doubly linked list of original polygon chains (not the monoChains !)
			sprev: null,			// previous segment
			snext: null,			// next segment
			//
			//	for performance reasons:
			//	 initialization of all fields added later
			//
			// for trapezoids
			rootFrom: null,			// root of partial tree where vFrom is located
			rootTo: null,			// root of partial tree where vTo is located
			is_inserted: false,		// already inserted into QueryStructure ?
			// for assigning depth: trapezoids
			trLeft: null,			// one trapezoid bordering on the left of this segment
			trRight: null,			// one trapezoid bordering on the right of this segment
			// for monochains
			mprev: null,			// doubly linked list for monotone chains (sub-polygons)
			mnext: null,
			marked: false,			// already visited during unique monoChain identification ?
		};
	},

	appendSegmentEntry: function ( inSegment ) {				// private
		this.segments.push( inSegment );
		return	inSegment;
	},


	appendDiagonalsEntry: function ( inDiagonal ) {				// <<<<<	public
		this.diagonals.push( inDiagonal );
		return	inDiagonal;
	},


	addVertexChain: function ( inRawPointList ) {			// private

		function verts_equal( inVert1, inVert2 ) {
			return ( ( Math.abs(inVert1.x - inVert2.x) < PNLTRI.Math.EPSILON_P ) &&
					 ( Math.abs(inVert1.y - inVert2.y) < PNLTRI.Math.EPSILON_P ) );
		}

		function verts_colinear_chain( inVert1, inVert2, inVert3 ) {
			if ( Math.abs( PNLTRI.Math.ptsCrossProd( inVert2, inVert1, inVert3 ) ) > PNLTRI.Math.EPSILON_P )	return false;
			// only real sequences, not direction reversals
			var low, middle, high;
			if ( Math.abs( inVert1.y - inVert2.y ) < PNLTRI.Math.EPSILON_P ) {
				// horizontal line
				middle = inVert2.x;
				if ( inVert1.x < inVert3.x ) {
					low = inVert1.x;
					high = inVert3.x;
				} else {
					low = inVert3.x;
					high = inVert1.x;
				}
			} else {
				middle = inVert2.y;
				if ( inVert1.y < inVert3.y ) {
					low = inVert1.y;
					high = inVert3.y;
				} else {
					low = inVert3.y;
					high = inVert1.y;
				}
			}
			return	( ( ( low - middle ) < PNLTRI.Math.EPSILON_P ) && ( ( middle - high ) < PNLTRI.Math.EPSILON_P ) );
		}

		var newVertices = [];
		var newVertex, acceptVertex, lastIdx;
		for ( var i=0; i < inRawPointList.length; i++ ) {
			newVertex = this.appendVertexEntry( inRawPointList[i].x, inRawPointList[i].y );
			// suppresses zero-length segments
			acceptVertex = true;
			lastIdx = newVertices.length-1;
			if ( lastIdx >= 0 ) {
				if ( verts_equal( newVertex, newVertices[lastIdx] ) ) {
					acceptVertex = false;
				} else if ( lastIdx > 0 ) {
					if ( verts_colinear_chain( newVertices[lastIdx-1], newVertices[lastIdx], newVertex ) ) {
						newVertices.pop();
					}
				}
			}
			if ( acceptVertex )	newVertices.push( newVertex );
		}
		// compare last vertices to first: suppresses zero-length and co-linear segments
		lastIdx = newVertices.length - 1;
		if ( ( lastIdx > 0 ) &&
			 verts_equal( newVertices[lastIdx], newVertices[0] ) ) {
			newVertices.pop();
			lastIdx--;
		}
		if ( lastIdx > 1 ) {
			if ( verts_colinear_chain( newVertices[lastIdx-1], newVertices[lastIdx], newVertices[0] ) ) {
				newVertices.pop();
				lastIdx--;
			}
			if ( ( lastIdx > 1 ) &&
				 verts_colinear_chain( newVertices[lastIdx], newVertices[0], newVertices[1] ) ) {
				newVertices.shift();
			}
		}

		return	newVertices;
	},


	addPolygonChain: function ( inRawPointList ) {			// <<<<<< public

		// vertices
		var newVertices = this.addVertexChain( inRawPointList );
		if ( newVertices.length < 3 ) {
			console.log( "Polygon has < 3 vertices!", newVertices );
			return	0;
		}

		// segments
		var	saveSegListLength = this.segments.length;
		//
		var	segment, firstSeg, prevSeg;
		for ( var i=0; i < newVertices.length-1; i++ ) {
			segment = this.createSegmentEntry( newVertices[i], newVertices[i+1] );
			if (prevSeg) {
				segment.sprev = prevSeg;
				prevSeg.snext = segment;
			} else {
				firstSeg = segment;
			}
			prevSeg = segment;
			this.appendSegmentEntry( segment );
		}
		// close polygon
		segment = this.createSegmentEntry( newVertices[newVertices.length-1], newVertices[0] );
		segment.sprev = prevSeg;
		prevSeg.snext = segment;
		this.appendSegmentEntry( segment );
		firstSeg.sprev = segment;
		segment.snext = firstSeg;

		this.PolyLeftArr[this.idNextPolyChain++] = true;
		return	this.segments.length - saveSegListLength;
	},


	/* Monotone Polygon Chains */

	// Generate the uni-y-monotone sub-polygons from
	//	the trapezoidation of the polygon.

	create_mono_chains: function () {						// <<<<<< public
		var newMono, newMonoTo, toFirstOutSeg, fromRevSeg;
		for ( var i = 0, j = this.segments.length; i < j; i++) {
			newMono = this.segments[i];
			if ( this.PolyLeftArr[newMono.chainId] ) {
				// preserve winding order
				newMonoTo = newMono.vTo;			// target of segment
				newMono.mprev = newMono.sprev;		// doubly linked list for monotone chains (sub-polygons)
				newMono.mnext = newMono.snext;
			} else {
				// reverse winding order
				newMonoTo = newMono.vFrom;
				newMono = newMono.snext;
				newMono.mprev = newMono.snext;
				newMono.mnext = newMono.sprev;
			}
			if ( fromRevSeg = newMono.vFrom.lastInDiag ) {		// assignment !
				fromRevSeg.mnext = newMono;
				newMono.mprev = fromRevSeg;
				newMono.vFrom.lastInDiag = null;		// cleanup
			}
			if ( toFirstOutSeg = newMonoTo.firstOutDiag ) {		// assignment !
				toFirstOutSeg.mprev = newMono;
				newMono.mnext = toFirstOutSeg;
				newMonoTo.firstOutDiag = null;			// cleanup
			}
		}
	},

	// For each monotone polygon, find the ymax (to determine the two
	// y-monotone chains) and skip duplicate monotone polygons

	unique_monotone_chains_max: function () {			// <<<<<< public

		function find_monotone_chain_max( frontMono ) {
			var frontPt, firstPt, ymaxPt;

			var monoPosmax = frontMono;
			firstPt = ymaxPt = frontMono.vFrom;

			frontMono.marked = true;
			frontMono = frontMono.mnext;
			while ( frontPt = frontMono.vFrom ) {				// assignment !
				if (frontMono.marked) {
					if ( frontPt == firstPt )	break;	// mono chain completed
					console.log("ERR unique_monotone: segment in two chains", firstPt, frontMono );
					return	null;
				} else {
/*					if ( frontPt == firstPt ) {			// check for robustness
						console.log("ERR unique_monotone: point double", firstPt, frontMono );
					}		*/
					frontMono.marked = true;
				}
				if ( PNLTRI.Math.compare_pts_yx( frontPt, ymaxPt ) == 1 ) {
					ymaxPt = frontPt;
					monoPosmax = frontMono;
				}
				frontMono = frontMono.mnext;
			}
			return	monoPosmax;
		}

		var frontMono, monoPosmax;

		// assumes attribute "marked" is NOT yet "true" for any mono chain segment
		this.monoSubPolyChains = [];
		// loop through all original segments
		for ( var i = 0, j = this.segments.length; i < j; i++ ) {
			frontMono = this.segments[i];
			if ( frontMono.marked )		continue;		// already in a processed mono chain
			monoPosmax = find_monotone_chain_max( frontMono );
			if ( monoPosmax )	this.monoSubPolyChains.push( monoPosmax );
		}
		// loop through all additional segments (diagonals)			// TODO: Testcase for mono chain without original segments !!!
/*		for ( var i = 0, j = this.diagonals.length; i < j; i++ ) {
			frontMono = this.diagonals[i];
			if ( frontMono.marked )		continue;		// already in a processed mono chain
			monoPosmax = find_monotone_chain_max( frontMono );
			if ( monoPosmax )	this.monoSubPolyChains.push( monoPosmax );
		}	*/
		return	this.monoSubPolyChains;
	},


	/* Triangles */

	clearTriangles: function () {
		this.triangles = [];
	},

	addTriangle: function ( inVert1, inVert2, inVert3 ) {
		this.triangles.push( [ inVert1.id, inVert2.id, inVert3.id ] );
	},

};

/**
 * Simple Polygon Triangulation by Ear Clipping
 *
 * description of technique employed:
 *	http://www.siggraph.org/education/materials/HyperGraph/scanline/outprims/polygon1.htm
 *
 * This code is a quick port of code written in C++ which was submitted to
 *	flipcode.com by John W. Ratcliff  // July 22, 2000
 * See original code and more information here:
 *	http://www.flipcode.com/archives/Efficient_Polygon_Triangulation.shtml
 *
 * ported to actionscript by Zevan Rosser
 *	http://actionsnippet.com/?p=1462
 *
 * ported to javascript by Joshua Koo
 *	http://www.lab4games.net/zz85/blog
 *
 * adapted to doubly linked list by Juergen Ahting
 *	http://www.ameco.tv
 *
 */

/** @constructor */
PNLTRI.EarClipTriangulator = function ( inPolygonData ) {

	this.polyData	= inPolygonData;

};


PNLTRI.EarClipTriangulator.prototype = {

	constructor: PNLTRI.EarClipTriangulator,


	// triangulates first doubly linked segment list in this.polyData
	//	algorithm uses ear-clipping and runs in O(n^2) time

	triangulate_polygon_no_holes: function () {

		function isEarAt( vertex ) {

			var prevX = vertex.mprev.vFrom.x;
			var prevY = vertex.mprev.vFrom.y;

			var vertX = vertex.vFrom.x;
			var vertY = vertex.vFrom.y;

			var nextX = vertex.mnext.vFrom.x;
			var nextY = vertex.mnext.vFrom.y;

			var vnX = nextX - vertX,  vnY = nextY - vertY;
			var npX = prevX - nextX,  npY = prevY - nextY;
			var pvX = vertX - prevX,  pvY = vertY - prevY;

			// concave angle at vertex -> not an ear to cut off
			if ( PNLTRI.Math.EPSILON_P > ( ( pvX * vnY ) - ( vnX * pvY ) ) ) return false;

			// check whether any other point lieas within the triangle abc
			var vStop	= vertex.mprev.mprev;
			var vOther	= vertex.mnext;
			while ( vOther != vStop ) {
				vOther = vOther.mnext;
				var otherX = vOther.vFrom.x;
				var otherY = vOther.vFrom.y;

				var poX = otherX - prevX,  poY = otherY - prevY;
					// just in case there are several vertices with the same coordinate
					if ( ( poX === 0 ) && ( poY === 0 ) )		continue;	// vOther == vertex.mprev
				var voX = otherX - vertX,  voY = otherY - vertY;
					if ( ( voX === 0 ) && ( voY === 0 ) )		continue;	// vOther == vertex
				var noX = otherX - nextX,  noY = otherY - nextY;
					if ( ( noX === 0 ) && ( noY === 0 ) )		continue;	// vOther == vertex.mnext

				// if vOther is inside triangle abc -> not an ear to cut off
				if ( ( ( vnX * voY - vnY * voX ) >= PNLTRI.Math.EPSILON_N ) &&
					 ( ( pvX * poY - pvY * poX ) >= PNLTRI.Math.EPSILON_N ) &&
					 ( ( npX * noY - npY * noX ) >= PNLTRI.Math.EPSILON_N ) ) return false;
			}
			return true;

		}

		var myPolyData = this.polyData;
		var startSeg = myPolyData.getFirstSegment();

		// create a counter-clockwise ordered doubly linked list (monoChain links)

		var cursor = startSeg;
		if ( myPolyData.isClockWise( startSeg ) ) {
			do {	// reverses chain order
				cursor.mprev = cursor.snext;
				cursor.mnext = cursor.sprev;
				cursor = cursor.sprev;
			} while ( cursor != startSeg );
			myPolyData.set_PolyLeft_wrong(0);
		} else {
			do {
				cursor.mprev = cursor.sprev;
				cursor.mnext = cursor.snext;
				cursor = cursor.snext;
			} while ( cursor != startSeg );
		}

		//  remove all vertices except 2, creating 1 triangle every time

		var vertex = startSeg;
		var fullLoop = vertex;   // prevent infinite loop on "defective" polygons

		while ( vertex.mnext != vertex.mprev ) {
			if ( isEarAt( vertex ) ) {
				// found a triangle ear to cut off
				this.polyData.addTriangle( vertex.mprev.vFrom, vertex.vFrom, vertex.mnext.vFrom );
				// remove vertex from the remaining chain
				vertex.mprev.mnext = vertex.mnext;
				vertex.mnext.mprev = vertex.mprev;
				vertex = vertex.mnext;
				fullLoop = vertex;			// reset error detection
			} else {
				vertex = vertex.mnext;
				// loop?: probably non-simple polygon -> stop with error
				if ( vertex == fullLoop )	return false;
			}
		}

		return true;

	},

/*	// takes one element of a double linked segment list
	//	works on array of vertices

	triangulate_polygon_no_holes: function () {
		var startSeg = this.polyData.getFirstSegment();

		function vertList( inStartSeg ) {
			var verts = [];
			// we want a counter-clockwise polygon in verts
			var doubleArea = 0.0;
			var cursor = inStartSeg;
			var p,q;
			var idx = 0;
			do {
				p = cursor.sprev.vFrom;
				q = cursor.vFrom;
				doubleArea += p.x * q.y - q.x * p.y;
				verts[idx++] = q;
				cursor = cursor.snext;
			} while ( cursor != inStartSeg );
			if ( doubleArea < 0.0 ) {
				verts = verts.reverse();
				var tmp = verts.pop();
				verts.unshift( tmp );
			}
			return	verts;
		}

		function snip( verts, u, v, w, n ) {

			var ax = verts[ u ].x;
			var ay = verts[ u ].y;

			var bx = verts[ v ].x;
			var by = verts[ v ].y;

			var cx = verts[ w ].x;
			var cy = verts[ w ].y;

			if ( PNLTRI.Math.EPSILON_P > ( ( bx - ax ) * ( cy - ay ) - ( by - ay ) * ( cx - ax ) ) ) return false;

			var aX, aY, bX, bY, cX, cY;

			aX = cx - bx;  aY = cy - by;
			bX = ax - cx;  bY = ay - cy;
			cX = bx - ax;  cY = by - ay;

			var p, px, py;

			var apx, apy, bpx, bpy, cpx, cpy;
			var cCROSSap, bCROSScp, aCROSSbp;

			for ( p = 0; p < n; p ++ ) {

				px = verts[ p ].x
				py = verts[ p ].y

				apx = px - ax;  apy = py - ay;
					if ( ( apx == 0 ) && ( apy == 0 ) )		continue;
				bpx = px - bx;  bpy = py - by;
					if ( ( bpx == 0 ) && ( bpy == 0 ) )		continue;
				cpx = px - cx;  cpy = py - cy;
					if ( ( cpx == 0 ) && ( cpy == 0 ) )		continue;

				// see if p is inside triangle abc

				aCROSSbp = aX * bpy - aY * bpx;
				cCROSSap = cX * apy - cY * apx;
				bCROSScp = bX * cpy - bY * cpx;

				if ( ( aCROSSbp >= PNLTRI.Math.EPSILON_N ) &&
					 ( bCROSScp >= PNLTRI.Math.EPSILON_N ) &&
					 ( cCROSSap >= PNLTRI.Math.EPSILON_N ) ) return false;

			}

			return true;

		};

		var result = [];

		var	verts = vertList( startSeg );

		var n = verts.length;
		var nv = n;

		var u, v, w;

		//  remove nv - 2 vertices, creating 1 triangle every time

		var count = 2 * nv;   // error detection

		for ( v = nv - 1; nv > 2; ) {

			// if we loop, it is probably a non-simple polygon

			if ( ( count -- ) <= 0 )	return false;

			// three consecutive vertices in current polygon, <u,v,w>

			u = v; 	 	if ( nv <= u ) u = 0;     // previous
			v = u + 1;  if ( nv <= v ) v = 0;     // new v
			w = v + 1;  if ( nv <= w ) w = 0;     // next

			if ( snip( verts, u, v, w, nv ) ) {

				// output Triangle

				this.polyData.addTriangle( verts[ u ], verts[ v ], verts[ w ] );

				// remove v from the remaining polygon

				var s, t;

				for ( s = v, t = v + 1; t < nv; s++, t++ ) {

					verts[ s ] = verts[ t ];

				}

				nv --;

				v --;
				if ( v < 0 )	v = nv-1;

				// reset error detection counter

				count = 2 * nv;

			}

		}

		return true;

	},		*/

};

/**
 * @author jahting / http://www.ameco.tv/
 *
 *	Algorithm to create the trapezoidation of a polygon with holes
 *	 according to Seidel's algorithm [Sei91]
 */

/** @constructor */
PNLTRI.Trapezoid = function ( inHigh, inLow, inLeft, inRight ) {

	this.vHigh = inHigh ? inHigh : { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY };
	this.vLow  = inLow  ? inLow  : { x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY };

	this.lseg = inLeft;
	this.rseg = inRight;

//	this.uL = null;				// -> Trapezoid: upper left neighbor
//	this.uR = null;				// -> Trapezoid: upper right neighbor
//	this.dL = null;				// -> Trapezoid: lower left neighbor
//	this.dR = null;				// -> Trapezoid: lower right neighbor

//	this.sink = null;			// link to corresponding SINK-Node in QueryStructure

//	this.usave = null;			// temp: uL/uR, preserved for next step
//	this.uleft = null;			// temp: from uL? (true) or uR (false)

	this.depth = -1;			// no depth assigned yet

	this.monoDone = false;		// monotonization: done with trying to split this trapezoid ?

};

PNLTRI.Trapezoid.prototype = {

	constructor: PNLTRI.Trapezoid,

	clone: function () {
		var newTrap = new PNLTRI.Trapezoid( this.vHigh, this.vLow, this.lseg, this.rseg );

		newTrap.uL = this.uL;
		newTrap.uR = this.uR;

		newTrap.dL = this.dL;
		newTrap.dR = this.dR;

		newTrap.sink = this.sink;

		return	newTrap;
	},


	splitOffLower: function ( inSplitPt ) {
		var trLower = this.clone();				// new lower trapezoid

		this.vLow = trLower.vHigh = inSplitPt;

		// L/R unknown, anyway changed later
		this.dL = trLower;		// setBelow
		trLower.uL = this;		// setAbove
		this.dR = trLower.uR = null;

		// setAbove
		if ( trLower.dL )	trLower.dL.uL = trLower;	// dL always connects to uL
		if ( trLower.dR )	trLower.dR.uR = trLower;	// dR always connects to uR

		return	trLower;
	},

};


/*==============================================================================
 *
 *============================================================================*/

// PNLTRI.qsCounter = 0;

/** @constructor */
PNLTRI.QsNode = function ( inTrapezoid ) {
//	this.qsId = PNLTRI.qsCounter++;				// Debug only
	// Only SINK-nodes are created directly.
	// The others originate from splitting trapezoids
	// - by a horizontal line: SINK-Node -> Y-Node
	// - by a segment: SINK-Node -> X-Node
	this.trap = inTrapezoid;
	inTrapezoid.sink = this;
};

PNLTRI.QsNode.prototype = {

	constructor: PNLTRI.QsNode,

};

/*==============================================================================
 *
 *============================================================================*/

/** @constructor */
PNLTRI.QueryStructure = function ( inPolygonData ) {
	// initialise the query structure and trapezoid list
	var initialTrap = new PNLTRI.Trapezoid( null, null, null, null );
	this.trapArray = [];
	this.appendTrapEntry( initialTrap );

//	PNLTRI.qsCounter = 0;
	this.root = new PNLTRI.QsNode( initialTrap );

	if ( inPolygonData ) {
		/*
		 * adds and initializes specific attributes for all segments
		 *	// -> QueryStructure: roots of partial tree where vertex is located
		 *	rootFrom, rootTo:	for vFrom, vTo
		 *	// marker
		 *	is_inserted:	already inserted into QueryStructure ?
		 */
		var segListArray = inPolygonData.getSegments();
		for ( var i = 0; i < segListArray.length; i++ ) {
			segListArray[i].rootFrom = segListArray[i].rootTo = this.root;
			segListArray[i].is_inserted = false;
		}
	}
};

PNLTRI.QueryStructure.prototype = {

	constructor: PNLTRI.QueryStructure,

	getRoot: function () {
		return this.root;
	},


	appendTrapEntry: function ( inTrapezoid ) {
		inTrapezoid.trapID = this.trapArray.length;			// for Debug
		this.trapArray.push( inTrapezoid );
	},
	cloneTrap: function ( inTrapezoid ) {
		var trap = inTrapezoid.clone();
		this.appendTrapEntry( trap );
		return	trap;
	},


	splitNodeAtPoint: function ( inNode, inPoint, inReturnUpper ) {
		// inNode: SINK-Node with trapezoid containing inPoint
		var trUpper = inNode.trap;							// trUpper: trapezoid includes the point
		if (trUpper.vHigh == inPoint)	return	inNode;				// (ERROR) inPoint is already inserted
		if (trUpper.vLow == inPoint)	return	inNode;				// (ERROR) inPoint is already inserted
		var trLower = trUpper.splitOffLower( inPoint );		// trLower: new lower trapezoid
		this.appendTrapEntry( trLower );

		// SINK-Node -> Y-Node
		inNode.yval = inPoint;
		inNode.trap = null;

		inNode.right = new PNLTRI.QsNode( trUpper );		// Upper trapezoid sink
		inNode.left = new PNLTRI.QsNode( trLower );			// Lower trapezoid sink

		return	inReturnUpper ? trUpper.sink : trLower.sink;
	},


	/*
	 * Mathematics & Geometry helper methods
	 */

	fpEqual: function ( inNum0, inNum1 ) {
		 return		Math.abs( inNum0 - inNum1 ) < PNLTRI.Math.EPSILON_P;
	},


	// Checks, whether the vertex inPt is to the left of line segment inSeg.
	//	Returns:
	//		>0: inPt is left of inSeg,
	//		<0: inPt is right of inSeg,
	//		=0: inPt is co-linear with inSeg
	//
	//	ATTENTION: always viewed from -y, not as if moving along the segment chain !!

	is_left_of: function ( inSeg, inPt, inBetweenY ) {
		var retVal;
		var dXfrom = inSeg.vFrom.x - inPt.x;
		var dXto = inSeg.vTo.x - inPt.x;
		var dYfromZero = this.fpEqual( inSeg.vFrom.y, inPt.y );
		if ( this.fpEqual( inSeg.vTo.y, inPt.y ) ) {
			if ( dYfromZero )	return 0;		// all points on a horizontal line
			retVal = dXto;
		} else if ( dYfromZero ) {
			retVal = dXfrom;
/*		} else if ( inBetweenY && ( dXfrom * dXto > 0 ) ) {
			// both x-coordinates of inSeg are on the same side of inPt
			if ( Math.abs( dXto ) >= PNLTRI.Math.EPSILON_P )	return	dXto;
			retVal = dXfrom;	*/
		} else {
			if ( inSeg.upward ) {
				return	PNLTRI.Math.ptsCrossProd( inSeg.vFrom, inSeg.vTo, inPt );
			} else {
				return	PNLTRI.Math.ptsCrossProd( inSeg.vTo, inSeg.vFrom, inPt );
			}
		}
		if ( Math.abs( retVal ) < PNLTRI.Math.EPSILON_P )		return	0;
		return	retVal;
	},


	/*
	 * Query structure main methods
	 */

	//	This method finds the Nodes in the QueryStructure corresponding
	//   to the trapezoids that contain the endpoints of inSegment,
	//	 starting from Nodes rootFrom/rootTo and replacing them with the results.

	segNodes: function ( inSegment ) {
		this.ptNode( inSegment, true );
		this.ptNode( inSegment, false );
	},

	// TODO: may need to prevent infinite loop in case of messed up
	//	trapezoid structure (s. test_add_segment_special_6)

	ptNode: function ( inSegment, inUseFrom ) {
		var ptMain, ptOther, qsNode;
		if ( inUseFrom ) {
			ptMain = inSegment.vFrom;
			ptOther = inSegment.vTo;		// used if ptMain is not sufficient
			qsNode = inSegment.rootFrom;
		} else {
			ptMain = inSegment.vTo;
			ptOther = inSegment.vFrom;
			qsNode = inSegment.rootTo;
		}
		var compPt, compRes;
		var isInSegmentShorter;

		while ( qsNode ) {
			if ( qsNode.yval ) {			// Y-Node: horizontal line
											// 4 times as often as X-Node
				qsNode = ( PNLTRI.Math.compare_pts_yx( ( ( ptMain == qsNode.yval ) ?	// is the point already inserted ?
									ptOther : ptMain ), qsNode.yval ) == -1 ) ?
									qsNode.left : qsNode.right;						// below : above
			} else if ( qsNode.seg ) {		// X-Node: segment (~vertical line)
											// 0.8 to 1.5 times as often as SINK-Node
				if ( ( ptMain == qsNode.seg.vFrom ) ||
					 ( ptMain == qsNode.seg.vTo ) ) {
					// the point is already inserted
					if ( this.fpEqual( ptMain.y, ptOther.y ) ) {
						// horizontal segment
						if ( !this.fpEqual( qsNode.seg.vFrom.y, qsNode.seg.vTo.y ) ) {
							qsNode = ( ptOther.x < ptMain.x ) ? qsNode.left : qsNode.right;		// left : right
						} else {	// co-linear horizontal reversal: test_add_segment_special_7
							if ( ptMain == qsNode.seg.vFrom ) {
								// connected at qsNode.seg.vFrom
//								console.log("ptNode: co-linear horizontal reversal, connected at qsNode.seg.vFrom", inUseFrom, inSegment, qsNode )
								isInSegmentShorter = inSegment.upward ?
										( ptOther.x >= qsNode.seg.vTo.x ) :
										( ptOther.x <  qsNode.seg.vTo.x );
								qsNode = ( isInSegmentShorter ?
												inSegment.sprev.upward :
												qsNode.seg.snext.upward ) ? qsNode.right : qsNode.left;		// above : below
							} else {
								// connected at qsNode.seg.vTo
//								console.log("ptNode: co-linear horizontal reversal, connected at qsNode.seg.vTo", inUseFrom, inSegment, qsNode );
								isInSegmentShorter = inSegment.upward ?
										( ptOther.x <  qsNode.seg.vFrom.x ) :
										( ptOther.x >= qsNode.seg.vFrom.x );
								qsNode = ( isInSegmentShorter ?
												inSegment.snext.upward :
												qsNode.seg.sprev.upward ) ? qsNode.left : qsNode.right;		// below : above
							}
						}
						continue;
					} else {
						compRes = this.is_left_of( qsNode.seg, ptOther, false );
						if ( compRes === 0 ) {
							// co-linear reversal (not horizontal)
							//	a co-linear continuation would not reach this point
							//  since the previous Y-node comparison would have led to a sink instead
//							console.log("ptNode: co-linear, going back on previous segment", ptMain, ptOther, qsNode );
							// now as we have two consecutive co-linear segments we have to avoid a cross-over
							//	for this we need the far point on the "next" segment to the SHORTER of our two
							//	segments to avoid that "next" segment to cross the longer of our two segments
							if ( ptMain == qsNode.seg.vFrom ) {
								// connected at qsNode.seg.vFrom
//								console.log("ptNode: co-linear, going back on previous segment, connected at qsNode.seg.vFrom", ptMain, ptOther, qsNode );
								isInSegmentShorter = inSegment.upward ?
										( ptOther.y >= qsNode.seg.vTo.y ) :
										( ptOther.y <  qsNode.seg.vTo.y );
								compRes = isInSegmentShorter ?
										this.is_left_of( qsNode.seg, inSegment.sprev.vFrom, false ) :
										-this.is_left_of( qsNode.seg, qsNode.seg.snext.vTo, false );
							} else {
								// connected at qsNode.seg.vTo
//								console.log("ptNode: co-linear, going back on previous segment, connected at qsNode.seg.vTo", ptMain, ptOther, qsNode );
								isInSegmentShorter = inSegment.upward ?
										( ptOther.y <  qsNode.seg.vFrom.y ) :
										( ptOther.y >= qsNode.seg.vFrom.y );
								compRes = isInSegmentShorter ?
										this.is_left_of( qsNode.seg, inSegment.snext.vTo, false ) :
										-this.is_left_of( qsNode.seg, qsNode.seg.sprev.vFrom, false );
							}
						}
					}
				} else {
/*					if ( ( PNLTRI.Math.compare_pts_yx( ptMain, qsNode.seg.vFrom ) *			// TODO: Testcase
							PNLTRI.Math.compare_pts_yx( ptMain, qsNode.seg.vTo )
						   ) == 0 ) {
						console.log("ptNode: Pts too close together#2: ", ptMain, qsNode.seg );
					}		*/
					compRes = this.is_left_of( qsNode.seg, ptMain, true );
					if ( compRes === 0 ) {
						// touching: ptMain lies on qsNode.seg but is none of its endpoints
						//	should happen quite seldom
						compRes = this.is_left_of( qsNode.seg, ptOther, false );
						if ( compRes === 0 ) {
							// co-linear: inSegment and qsNode.seg
							//	includes case with ptOther connected to qsNode.seg
							var tmpPtOther = inUseFrom ? inSegment.sprev.vFrom : inSegment.snext.vTo;
							compRes = this.is_left_of( qsNode.seg, tmpPtOther, false );
						}
					}
				}
				if ( compRes > 0 ) {
					qsNode = qsNode.left;
				} else if ( compRes < 0 ) {
					qsNode = qsNode.right;
				} else {
					// ???	TODO - not reached with current tests
					//				possible at all ?
					return qsNode;
					// qsNode = qsNode.left;		// left
					// qsNode = qsNode.right;		// right
				}
			} else {		// SINK-Node: trapezoid area
							// least often
				if ( !qsNode.trap )	{ console.log("ptNode: unknown type", qsNode); }
				if ( inUseFrom )	{ inSegment.rootFrom = qsNode; }
				else				{ inSegment.rootTo = qsNode; }
				return qsNode;
			}
		}	// end while - should not exit here
	},


 	// Add a new segment into the trapezoidation and update QueryStructure and Trapezoids
	// 1) locates the two endpoints of the segment in the QueryStructure and inserts them
	// 2) goes from the high-end trapezoid down to the low-end trapezoid
	//		changing all the trapezoids in between.
	// Except for the high-end and low-end no new trapezoids are created.
	// For all in between either:
	// - the existing trapezoid is restricted to the left of the new segment
	//		and on the right side the trapezoid from above is extended downwards
	// - or the other way round:
	//	 the existing trapezoid is restricted to the right of the new segment
	//		and on the left side the trapezoid from above is extended downwards

	add_segment: function ( inSegment ) {
		var scope = this;

		// functions handling the relationship to the upper neighbors (uL, uR)
		//	of trNewLeft and trNewRight

		function fresh_seg_or_upward_cusp() {
			// trCurrent has at most 1 upper neighbor
			//	and should also have at least 1, since the high-point trapezoid
			//	has been split off another one, which is now above
			var trUpper = trCurrent.uL || trCurrent.uR;

			// trNewLeft and trNewRight CANNOT have been extended from above
			if ( trUpper.dL && trUpper.dR ) {
				// upward cusp: top forms a triangle

				// ATTENTION: the decision whether trNewLeft or trNewRight is the
				//	triangle trapezoid formed by the two segments has already been taken
				//	when selecting trCurrent as the left or right lower neighbor to trUpper !!

				if ( trCurrent == trUpper.dL ) {
					//	*** Case: FUC_UC_LEFT; prev: ----
					// console.log( "fresh_seg_or_upward_cusp: upward cusp, new seg to the left!" );
					//		  upper
					//   -------*-------
					//		   + \
					//	  NL  +   \
					//		 +	NR \
					//		+		\
					trNewRight.uL	= null;			// setAbove; trNewRight.uR, trNewLeft unchanged
					trUpper.dL		= trNewLeft;	// setBelow; dR: unchanged, NEVER null
				} else {
					//	*** Case: FUC_UC_RIGHT; prev: ----
					// console.log( "fresh_seg_or_upward_cusp: upward cusp, new seg from the right!" );
					//		  upper
					//   -------*-------
					//		   / +
					//		  /   +	 NR
					//		 /	NL +
					//		/		+
					trNewLeft.uR	= null;			// setAbove; trNewLeft.uL, trNewRight unchanged
					trUpper.dR		= trNewRight;	// setBelow; dL: unchanged, NEVER null
				}
			} else {
				//	*** Case: FUC_FS; prev: "splitOffLower"
				// console.log( "fresh_seg_or_upward_cusp: fresh segment, high adjacent segment still missing" );
				//		  upper
				//   -------*-------
				//		   +
				//	  NL  +
				//		 +	NR
				//		+
				trNewRight.uL = null;			// setAbove; trNewLeft unchanged, set by "splitOffLower"
				trNewRight.uR = trUpper;
				trUpper.dR = trNewRight;		// setBelow; trUpper.dL unchanged, set by "splitOffLower"
			}
 		}

		function continue_chain_from_above() {
			// trCurrent has at least 2 upper neighbors
			if ( trCurrent.usave ) {
				// 3 upper neighbors (part II)
				if ( trCurrent.uleft ) {
					//	*** Case: CC_3UN_LEFT; prev: 1B_3UN_LEFT
					// console.log( "continue_chain_from_above: 3 upper neighbors (part II): u0a, u0b, uR(usave)" );
					// => left gets one, right gets two of the upper neighbors
					// !! trNewRight cannot have been extended from above
					//		and trNewLeft must have been !!
					//		   +		/
					//	  C.uL  + C.uR / C.usave
					//    - - - -+----*----------
					//		NL	  +		NR
					trNewRight.uL = trCurrent.uR;		// setAbove
					trNewRight.uR = trCurrent.usave;
					trNewRight.uL.dL = trNewRight;		// setBelow; trNewRight.uL.dR == null, unchanged
					trNewRight.uR.dR = trNewRight;		// setBelow; trNewRight.uR.dL == null, unchanged
				} else {
					//	*** Case: CC_3UN_RIGHT; prev: 1B_3UN_RIGHT
					// console.log( "continue_chain_from_above: 3 upper neighbors (part II): uL(usave), u1a, u1b" );
					// => left gets two, right gets one of the upper neighbors
					// !! trNewLeft cannot have been extended from above
					//		and trNewRight must have been !!
					//			\		 +
					//	 C.usave \ C.uL + C.uR
					//   ---------*----+- - - -
					//			NL    +   NR
					trNewLeft.uR = trCurrent.uL;		// setAbove; first uR !!!
					trNewLeft.uL = trCurrent.usave;
					trNewLeft.uL.dL = trNewLeft;		// setBelow; dR == null, unchanged
					trNewLeft.uR.dR = trNewLeft;		// setBelow; dL == null, unchanged
				}
				trNewLeft.usave = trNewRight.usave = null;
			} else if ( trCurrent.vHigh == trFirst.vHigh ) {		// && meetsHighAdjSeg ??? TODO
				//	*** Case: CC_2UN_CONN; prev: ----
				// console.log( "continue_chain_from_above: 2 upper neighbors, fresh seg, continues high adjacent seg" );
				// !! trNewLeft and trNewRight cannot have been extended from above !!
				//	  C.uL	 /  C.uR
				//   -------*---------
				//	   NL  +	NR
				trNewRight.uR.dR = trNewRight;			// setBelow; dL == null, unchanged
				trNewLeft.uR = trNewRight.uL = null;	// setAbove; trNewLeft.uL, trNewRight.uR unchanged
			} else {
				//	*** Case: CC_2UN; prev: 1B_1UN_CONT, 2B_NOCON_RIGHT/LEFT, 2B_TOUCH_RIGHT/LEFT, 2B_COLIN_RIGHT/LEFT
				// console.log( "continue_chain_from_above: simple case, 2 upper neighbors (no usave, not fresh seg)" );
				// !! trNewLeft XOR trNewRight will have been extended from above !!
				//	  C.uL	 +  C.uR
				//   -------+---------
				//	   NL  +	NR
				if ( trNewRight == trCurrent ) {		// trNewLeft has been extended from above
					// setAbove
					trNewRight.uL = trNewRight.uR;
					trNewRight.uR = null;
					// setBelow; dR: unchanged, is NOT always null (prev: 2B_NOCON_LEFT, 2B_TOUCH_LEFT, 2B_COLIN_LEFT)
					trNewRight.uL.dL = trNewRight;
				} else {								// trNewRight has been extended from above
					trNewLeft.uR = trNewLeft.uL;	// setAbove; first uR !!!
					trNewLeft.uL = null;
				}
			}
		}

		// functions handling the relationship to the lower neighbors (dL, dR)
		//	of trNewLeft and trNewRight
		// trNewLeft or trNewRight MIGHT have been extended from above
		//  !! in that case dL and dR are different from trCurrent and MUST be set here !!

		function only_one_trap_below( inTrNext ) {

			if ( trCurrent.vLow == trLast.vLow ) {
				// final part of segment

				if ( meetsLowAdjSeg ) {
					// downward cusp: bottom forms a triangle

					// ATTENTION: the decision whether trNewLeft and trNewRight are to the
					//	left or right of the already inserted segment the new one meets here
					//	has already been taken when selecting trLast to the left or right
					//	of that already inserted segment !!

					if ( trCurrent.dL ) {
						//	*** Case: 1B_DC_LEFT; next: ----
						// console.log( "only_one_trap_below: downward cusp, new seg from the left!" );
						//		+		/
						//		 +  NR /
						//	  NL  +	  /
						//		   + /
						//   -------*-------
						//	   C.dL = next

						// setAbove
						inTrNext.uL = trNewLeft;	// uR: unchanged, NEVER null
						// setBelow part 1
						trNewLeft.dL = inTrNext;
						trNewRight.dR = null;
					} else {
						//	*** Case: 1B_DC_RIGHT; next: ----
						// console.log( "only_one_trap_below: downward cusp, new seg to the right!" );
						//		\		+
						//		 \  NL +
						//		  \	  +  NR
						//		   \ +
						//   -------*-------
						//	   C.dR = next

						// setAbove
						inTrNext.uR = trNewRight;	// uL: unchanged, NEVER null
						// setBelow part 1
						trNewLeft.dL = null;
						trNewRight.dR = inTrNext;
					}
				} else {
					//	*** Case: 1B_1UN_END; next: ----
					// console.log( "only_one_trap_below: simple case, new seg ends here, low adjacent seg still missing" );
					//			  +
					//		NL	 +  NR
					//			+
					//   ------*-------
					//		  next

					// setAbove
					inTrNext.uL = trNewLeft;									// trNewLeft must
					inTrNext.uR = trNewRight;		// must
					// setBelow part 1
					trNewLeft.dL = trNewRight.dR = inTrNext;					// Error
//					trNewRight.dR = inTrNext;
				}
				// setBelow part 2
				trNewLeft.dR = trNewRight.dL = null;
			} else {
				// NOT final part of segment

				if ( inTrNext.uL && inTrNext.uR ) {
					// inTrNext has two upper neighbors
					// => a segment ends on the upper Y-line of inTrNext
					// => inTrNext has temporarily 3 upper neighbors
					// => marks whether the new segment cuts through
					//		uL or uR of inTrNext and saves the other in .usave
					if ( inTrNext.uL == trCurrent ) {
						//	*** Case: 1B_3UN_LEFT; next: CC_3UN_LEFT
						// console.log( "only_one_trap_below: inTrNext has 3 upper neighbors (part I): u0a, u0b, uR(usave)" );
						//		 +		  /
						//	  NL  +	 NR	 /
						//		   +	/
						//   - - - -+--*----
						//			 +
						//		  next
//						if ( inTrNext.uR != trNewRight ) {		// for robustness	TODO: prevent
							inTrNext.usave = inTrNext.uR;
							inTrNext.uleft = true;
							// trNewLeft: L/R undefined, will be extended down and changed anyway
						// } else {
							// ERROR: should not happen
							// console.log( "ERR add_segment: Trapezoid Loop right", inTrNext, trCurrent, trNewLeft, trNewRight, inSegment, this );
//						}
					} else {
						//	*** Case: 1B_3UN_RIGHT; next: CC_3UN_RIGHT
						// console.log( "only_one_trap_below: inTrNext has 3 upper neighbors (part I): uL(usave), u1a, u1b" );
						//	 \		   +
						//	  \	  NL  +  NR
						//	   \	 +
						//   ---*---+- - - -
						//		   +
						//		  next
//						if ( inTrNext.uL != trNewLeft ) {		// for robustness	TODO: prevent
							inTrNext.usave = inTrNext.uL;
							inTrNext.uleft = false;
							// trNewRight: L/R undefined, will be extended down and changed anyway
						// } else {
							// ERROR: should not happen
							// console.log( "ERR add_segment: Trapezoid Loop left", inTrNext, trCurrent, trNewLeft, trNewRight, inSegment, this );
//						}
					}
				//} else {
					//	*** Case: 1B_1UN_CONT; next: CC_2UN
					// console.log( "only_one_trap_below: simple case, new seg continues down" );
					//			  +
					//		NL	 +  NR
					//			+
					//   ------+-------
					//	 	  +
					//		next

					// L/R for one side undefined, which one is not fixed
					//	but that one will be extended down and changed anyway
					// for the other side, vLow must lie at the opposite end
					//	thus both are set accordingly
				}
				// setAbove
				inTrNext.uL = trNewLeft;
				inTrNext.uR = trNewRight;
				// setBelow
				trNewLeft.dR = trNewRight.dL = inTrNext;
				trNewLeft.dL = trNewRight.dR = null;
			}
		}

		function two_trap_below() {
			// Find out which one (dL,dR) is intersected by this segment and
			//	continue down that one
			var trNext;
			if ( ( trCurrent.vLow == trLast.vLow ) && meetsLowAdjSeg ) {	// meetsLowAdjSeg necessary? TODO
				//	*** Case: 2B_CON_END; next: ----
				// console.log( "two_trap_below: finished, meets low adjacent segment" );
				//			  +
				//		NL	 +  NR
				//			+
				//   ------*-------
				//	 		\  C.dR
				//	  C.dL	 \

				// setAbove
				trCurrent.dL.uL = trNewLeft;
				trCurrent.dR.uR = trNewRight;
				// setBelow; sequence of assignments essential, just in case: trCurrent == trNewLeft
				trNewLeft.dL = trCurrent.dL;
				trNewRight.dR = trCurrent.dR;
				trNewLeft.dR = trNewRight.dL = null;

				trNext = null;	      	// segment finished
			} else {
				// setAbove part 1
				trCurrent.dL.uL = trNewLeft;
				trCurrent.dR.uR = trNewRight;

				var goDownRight;
				// passes left or right of an already inserted NOT connected segment
				//	trCurrent.vLow: high-end of existing segment
				var compRes = scope.is_left_of( inSegment, trCurrent.vLow, true );
				if ( compRes > 0 ) {				// trCurrent.vLow is left of inSegment
					//	*** Case: 2B_NOCON_RIGHT; next: CC_2UN
					// console.log( "two_trap_below: (intersecting dR)" );
					//		 +
					//	  NL  +  NR
					//		   +
					//   ---*---+- - - -
					//		 \	 +
					//	 C.dL \	C.dR
					goDownRight = true;
				} else if ( compRes < 0 ) {			// trCurrent.vLow is right of inSegment
					//	*** Case: 2B_NOCON_LEFT; next: CC_2UN
					// console.log( "two_trap_below: (intersecting dL)" );
					//			  +
					//		NL	 +  NR
					//			+
					//    - - -+---*-------
					//	 	  +		\  C.dR
					//	 	 C.dL	 \
					goDownRight = false;
				} else {							// trCurrent.vLow lies ON inSegment
					var vLowSeg = trCurrent.dL.rseg;
					var directionIsUp = vLowSeg.upward;
					var otherPt = directionIsUp ? vLowSeg.vFrom : vLowSeg.vTo;
					compRes = scope.is_left_of( inSegment, otherPt, false );
					if ( compRes > 0 ) {				// otherPt is left of inSegment
						//	*** Case: 2B_TOUCH_RIGHT; next: CC_2UN
						// console.log( "two_trap_below: vLow ON new segment, touching from right" );
						//		 +
						//	  NL  +  NR
						//		   +
						//   -------*- - - -
						//		   / +
						//	 C.dL /	C.dR
						goDownRight = true;		// like intersecting dR
					} else if ( compRes < 0 ) {			// otherPt is right of inSegment
						//	*** Case: 2B_TOUCH_LEFT; next: CC_2UN
						// console.log( "two_trap_below: vLow ON new segment, touching from left" );
						//			  +
						//		NL	 +  NR
						//			+
						//    - - -*-------
						//	 	  +	\  C.dR
						//	  C.dL	 \
						goDownRight = false;	// like intersecting dL
					} else {							// otherPt lies ON inSegment
						vLowSeg = directionIsUp ? vLowSeg.snext : vLowSeg.sprev;		// other segment with trCurrent.vLow
						otherPt = directionIsUp ? vLowSeg.vTo : vLowSeg.vFrom;
						compRes = scope.is_left_of( inSegment, otherPt, false );
						if ( compRes > 0 ) {				// otherPt is left of inSegment
							//	*** Case: 2B_COLIN_RIGHT; next: CC_2UN
							// console.log( "two_trap_below: vLow ON new segment, touching from right" );
							//		  +
							//	  NL   +  NR
							//   -------*- - - -
							//	  C.dL 	\+  C.dR
							//			 \+
							goDownRight = true;		// like intersecting dR
					//	} else if ( compRes == 0 ) {		//	NOT POSSIBLE, since 3 points on a line is prevented during input of polychains
					//		goDownRight = true;		// like intersecting dR
						} else {							// otherPt is right of inSegment
							//	*** Case: 2B_COLIN_LEFT; next: CC_2UN
							// console.log( "two_trap_below: vLow ON new segment, touching from left" );
							//			   +
							//		NL	  +  NR
							//    - - - -*-------
							//	  C.dL	+/  C.dR
							//		   +/
							goDownRight = false;		// TODO: for test_add_segment_special_4 -> like intersecting dL
						}
					}
				}
				if ( goDownRight ) {
					trNext = trCurrent.dR;
					// setAbove part 2
					trCurrent.dR.uL = trNewLeft;
					// setBelow part 1
					trNewLeft.dL = trCurrent.dL;
					trNewRight.dR = null;	// L/R undefined, will be extended down and changed anyway
				} else {
					trNext = trCurrent.dL;
					// setAbove part 2
					trCurrent.dL.uR = trNewRight;
					// setBelow part 1
					trNewRight.dR = trCurrent.dR;
					trNewLeft.dL = null;	// L/R undefined, will be extended down and changed anyway
				}
				// setBelow part 2
				trNewLeft.dR = trNewRight.dL = trNext;
			}

 			return	trNext;
		}

		//
		//	main function body
		//

/*		if ( ( inSegment.sprev.vTo != inSegment.vFrom ) || ( inSegment.vTo != inSegment.snext.vFrom ) ) {
			console.log( "add_segment: inconsistent point order of adjacent segments: ",
						 inSegment.sprev.vTo, inSegment.vFrom, inSegment.vTo, inSegment.snext.vFrom );
			return;
		}		*/

		//	Find the top-most and bottom-most intersecting trapezoids -> rootXXX
		this.segNodes( inSegment );

		var segLowVert , segLowNode, meetsLowAdjSeg;		// y-min vertex
		var segHighVert, segHighNode, meetsHighAdjSeg;		// y-max vertex

		if ( inSegment.upward ) {
			segLowVert	= inSegment.vFrom;
			segHighVert	= inSegment.vTo;
			segLowNode		= inSegment.rootFrom;
			segHighNode		= inSegment.rootTo;
			// was lower point already inserted earlier? => segments meet at their ends
			meetsLowAdjSeg	= inSegment.sprev.is_inserted;
			// was higher point already inserted earlier? => segments meet at their ends
			meetsHighAdjSeg	= inSegment.snext.is_inserted;
		} else {
			segLowVert	= inSegment.vTo;
			segHighVert	= inSegment.vFrom;
			segLowNode		= inSegment.rootTo;
			segHighNode		= inSegment.rootFrom;
			meetsLowAdjSeg	= inSegment.snext.is_inserted;
			meetsHighAdjSeg	= inSegment.sprev.is_inserted;
		}

		//	insert higher vertex into QueryStructure
		if ( !meetsHighAdjSeg ) {
			// higher vertex not yet inserted => split trapezoid horizontally
			var tmpNode = this.splitNodeAtPoint( segHighNode, segHighVert, false );
			// move segLowNode to new (lower) trapezoid, if it was the one which was just split
			if ( segHighNode == segLowNode )	segLowNode = tmpNode;
			segHighNode = tmpNode;
		}
		var trFirst = segHighNode.trap;		// top-most trapezoid for this segment

		// check for robustness		// TODO: prevent
		if ( !trFirst.uL && !trFirst.uR ) {
			console.log("ERR add_segment: missing trFirst.uX: ", trFirst );
			return;
		}
		if ( trFirst.vHigh != segHighVert ) {
			console.log("ERR add_segment: trFirstHigh != segHigh: ", trFirst );
			return;
		}

		//	insert lower vertex into QueryStructure
		if ( !meetsLowAdjSeg ) {
			// lower vertex not yet inserted => split trapezoid horizontally
			segLowNode = this.splitNodeAtPoint( segLowNode, segLowVert, true );
		}
		var trLast = segLowNode.trap;			// bottom-most trapezoid for this segment

		//
		// Thread the segment into the query "tree" from top to bottom.
		// All the trapezoids which are intersected by inSegment are "split" into two.
		// For each the SINK-QsNode is converted into an X-Node and
		//  new sinks for the new partial trapezoids are added.
		// In fact a real split only happens at the top and/or bottom end of the segment
		//	since at every y-line seperating two trapezoids is traverses it
		//	cuts off the "beam" from the y-vertex on one side, so that at that side
		//	the trapezoid from above can be extended down.
		//

		var trCurrent = trFirst;

		var trNewLeft, trNewRight, trPrevLeft, trPrevRight;

		var counter = this.trapArray.length + 2;		// just to prevent infinite loop
		var trNext;
		while ( trCurrent ) {
			if ( --counter < 0 ) {
				console.log( "ERR add_segment: infinite loop", trCurrent, inSegment, this );
				return;
			}
			if ( !trCurrent.dL && !trCurrent.dR ) {
				// ERROR: no successors, cannot arise if data is correct
				console.log( "ERR add_segment: missing successors", trCurrent, inSegment, this );
				return;
			}

			var qs_trCurrent = trCurrent.sink;
			// SINK-Node -> X-Node
			qs_trCurrent.seg = inSegment;
			qs_trCurrent.trap = null;
			//
			// successive trapezoids bordered by the same segments are merged
			//  by extending the trPrevRight or trPrevLeft down
			//  and redirecting the parent X-Node to the extended sink
			// !!! destroys tree structure since several nodes now point to the same SINK-Node !!!
			// TODO: maybe it's not a problem;
			//  merging of X-Nodes is no option, since they are used as "rootFrom/rootTo" !
			//
			if ( trPrevRight && ( trPrevRight.rseg == trCurrent.rseg ) ) {
				// console.log( "add_segment: extending right predecessor down!", trPrevRight );
				trNewLeft = trCurrent;
				trNewRight = trPrevRight;
				trNewRight.vLow = trCurrent.vLow;
				// redirect parent X-Node to extended sink
				qs_trCurrent.left = new PNLTRI.QsNode( trNewLeft );			// trCurrent -> left SINK-Node
				qs_trCurrent.right = trPrevRight.sink;						// deforms tree by multiple links to trPrevRight.sink
			} else if ( trPrevLeft && ( trPrevLeft.lseg == trCurrent.lseg ) ) {
				// console.log( "add_segment: extending left predecessor down!", trPrevLeft );
				trNewRight = trCurrent;
				trNewLeft = trPrevLeft;
				trNewLeft.vLow = trCurrent.vLow;
				// redirect parent X-Node to extended sink
				qs_trCurrent.left = trPrevLeft.sink;						// deforms tree by multiple links to trPrevLeft.sink
				qs_trCurrent.right = new PNLTRI.QsNode( trNewRight );		// trCurrent -> right SINK-Node
			} else {
				trNewLeft = trCurrent;
				trNewRight = this.cloneTrap(trCurrent);
				qs_trCurrent.left = new PNLTRI.QsNode( trNewLeft );			// trCurrent -> left SINK-Node
				qs_trCurrent.right = new PNLTRI.QsNode( trNewRight );		// new clone -> right SINK-Node
			}

			// handle neighbors above
			if ( trCurrent.uL && trCurrent.uR )	{
				continue_chain_from_above();
			} else {
				fresh_seg_or_upward_cusp();
			}

			// handle neighbors below
			if ( trCurrent.dL && trCurrent.dR ) {
				trNext = two_trap_below();
			} else {
				if ( trCurrent.dL ) {
					// console.log( "add_segment: only_one_trap_below! (dL)" );
					trNext = trCurrent.dL;
				} else {
					// console.log( "add_segment: only_one_trap_below! (dR)" );
					trNext = trCurrent.dR;
				}
				only_one_trap_below( trNext );
			}

			if ( trNewLeft.rseg )	trNewLeft.rseg.trLeft = trNewRight;
			if ( trNewRight.lseg )	trNewRight.lseg.trRight = trNewLeft;
			trNewLeft.rseg = trNewRight.lseg  = inSegment;
			inSegment.trLeft = trNewLeft;
			inSegment.trRight = trNewRight;

			// further loop-step down ?
			if ( trCurrent.vLow != trLast.vLow ) {
				trPrevLeft = trNewLeft;
				trPrevRight = trNewRight;

				trCurrent = trNext;
			} else {
				trCurrent = null;
			}
		}	// end while

		inSegment.is_inserted = true;
		// console.log( "add_segment: ###### DONE ######" );
	},

	// Assigns a depth to all trapezoids;
	//	0: outside, 1: main polygon, 2: holes, 3:polygons in holes, ...
	// Checks segment orientation and marks those polygon chains for reversal
	//	where the polygon inside lies to their right (contour in CW, holes in CCW)
	assignDepths: function ( inPolyData ) {
		var thisDepth = [ this.trapArray[0] ];
		var nextDepth = [];

		var thisTrap, borderSeg, curDepth = 0;
		do {
			// rseg should exactely go upward on trapezoids inside the polygon (odd depth)
			var expectedRsegUpward = ( ( curDepth % 2 ) == 1 );
			while ( thisTrap = thisDepth.pop() ) {			// assignment !
				if ( thisTrap.depth != -1 )	continue;
				thisTrap.depth = curDepth;
				//
				if ( thisTrap.uL )	thisDepth.push( thisTrap.uL );
				if ( thisTrap.uR )	thisDepth.push( thisTrap.uR );
				if ( thisTrap.dL )	thisDepth.push( thisTrap.dL );
				if ( thisTrap.dR )	thisDepth.push( thisTrap.dR );
				//
				if ( ( borderSeg = thisTrap.lseg ) && ( borderSeg.trLeft.depth == -1 ) )	// assignment !
					nextDepth.push( borderSeg.trLeft );
				if ( borderSeg = thisTrap.rseg ) {											// assignment !
					if ( borderSeg.trRight.depth == -1 )
						nextDepth.push( borderSeg.trRight );
					if ( borderSeg.upward != expectedRsegUpward )
						inPolyData.set_PolyLeft_wrong( borderSeg.chainId );
				}
			}
			thisDepth = nextDepth; nextDepth = [];
			curDepth++;
		} while ( thisDepth.length > 0 );
	},

	// creates the visibility map:
	//	for each vertex the list of all vertices in CW order which are directly
	//	visible through neighboring trapezoids and thus can be connected by a diagonal

	create_visibility_map: function ( inPolygonData ) {
		// positional slots for neighboring trapezoid-diagonals
		var DIAG_UL = 0, DIAG_UM = 1, DIAG_ULR = 2, DIAG_UR = 3;
		var DIAG_DR = 4, DIAG_DM = 5, DIAG_DLR = 6, DIAG_DL = 7;

		var i, j;
		var nbVertices = inPolygonData.nbVertices();

		// initialize arrays for neighboring trapezoid-diagonals and vertices
		var myVisibleDiagonals	= new Array(nbVertices);
		for ( i = 0; i < nbVertices; i++ ) {
			myVisibleDiagonals[i] = new Array(DIAG_DL+1);
		}
		// create the list of neighboring trapezoid-diagonals
		//	put into their positional slots
		var myExternalNeighbors = new Array(nbVertices);
		for ( i = 0, j = this.trapArray.length; i < j; i++ ) {
			var curTrap = this.trapArray[i];
			var highPos = curTrap.uL ?
						( curTrap.uR ? DIAG_DM : DIAG_DL ) :
						( curTrap.uR ? DIAG_DR : DIAG_DLR );
			var lowPos = curTrap.dL ?
						( curTrap.dR ? DIAG_UM : DIAG_UL ) :
						( curTrap.dR ? DIAG_UR : DIAG_ULR );

			if ( ( curTrap.depth % 2 ) == 1 ) {		// inside ?
				if ( ( highPos == DIAG_DM ) || ( lowPos == DIAG_UM ) ||
					 ( ( highPos == DIAG_DL ) && ( lowPos == DIAG_UR ) ) ||
					 ( ( highPos == DIAG_DR ) && ( lowPos == DIAG_UL ) ) ) {
					var lhDiag = inPolygonData.appendDiagonalsEntry( {
									vFrom: curTrap.vLow, vTo: curTrap.vHigh,
									mprev: null, mnext: null, marked: false } );
					var hlDiag = inPolygonData.appendDiagonalsEntry( {
									vFrom: curTrap.vHigh, vTo: curTrap.vLow, revDiag: lhDiag,
									mprev: null, mnext: null, marked: false } );
					lhDiag.revDiag = hlDiag;
					myVisibleDiagonals[ curTrap.vLow.id][ lowPos] = lhDiag;
					myVisibleDiagonals[curTrap.vHigh.id][highPos] = hlDiag;
				}
			} else {		// outside, hole
				if ( curTrap.vHigh.id !== null )	myExternalNeighbors[curTrap.vHigh.id] = highPos;
				if ( curTrap.vLow.id  !== null )	myExternalNeighbors[ curTrap.vLow.id] = lowPos;
			}
		}
		// create the list of outgoing diagonals in the right order (CW)
		//	from the ordered list of neighboring trapezoid-diagonals
		//	- starting from an external one
		// and connect those incoming to
		var curDiag, curDiags, firstElem, fromVertex, lastIncoming;
		for ( i = 0; i < nbVertices; i++ ) {
			curDiags  = myVisibleDiagonals[i];
			firstElem = myExternalNeighbors[i];
			if ( firstElem == null )	continue;		// eg. skipped vertices (zero length, co-linear		// NOT: === !
			j = firstElem;
			lastIncoming = null;
			do {
				if ( j++ > DIAG_DL )			j = DIAG_UL;	// circular positional list
				if ( curDiag = curDiags[j] ) {
					if ( lastIncoming ) {
						curDiag.mprev = lastIncoming;
						lastIncoming.mnext = curDiag;
					} else {
						fromVertex = curDiag.vFrom;
						fromVertex.firstOutDiag = curDiag;
					}
					lastIncoming = curDiag.revDiag;
				}
			} while ( j != firstElem );
			if ( lastIncoming )		fromVertex.lastInDiag = lastIncoming;
		}
	},


};


/*==============================================================================
 *
 *============================================================================*/

/** @constructor */
PNLTRI.Trapezoider = function ( inPolygonData ) {

	this.polyData		= inPolygonData;
	this.queryStructure	= new PNLTRI.QueryStructure( this.polyData );

};

PNLTRI.Trapezoider.prototype = {

	constructor: PNLTRI.Trapezoider,


	/*
	 * Mathematics helper methods
	 */

	optimise_randomlist: function ( inOutSegListArray ) {
		// makes sure that the first N segments are one from each of the N polygon chains
		var mainIdx = 0;
		var helpIdx = this.polyData.nbPolyChains();
		if ( helpIdx == 1 )		return;
		var chainMarker = new Array(helpIdx);
		var oldSegListArray = inOutSegListArray.concat();
		for (var i=0; i<oldSegListArray.length; i++) {
			var chainId = oldSegListArray[i].chainId;
			if ( chainMarker[chainId] ) {
				inOutSegListArray[helpIdx++] = oldSegListArray[i];
			} else {
				inOutSegListArray[mainIdx++] = oldSegListArray[i];
				chainMarker[chainId] = true;
			}
		}
	},


	/*
	 * main methods
	 */

	// Creates the trapezoidation of the polygon
	//  and assigns a depth to all trapezoids (odd: inside, even: outside).

	trapezoide_polygon: function () {							// <<<< public
		var randSegListArray = this.polyData.getSegments().concat();
//		console.log( "Polygon Chains: ", dumpSegmentList( randSegListArray ) );
		PNLTRI.Math.array_shuffle( randSegListArray );
		this.optimise_randomlist( randSegListArray );
//		console.log( "Random Segment Sequence: ", dumpRandomSequence( randSegListArray ) );

		var nbSegs = randSegListArray.length;
		var myQs = this.queryStructure;

		var i, current = 0, logstar = nbSegs;
		while ( current < nbSegs ) {
			// The CENTRAL mechanism for the near-linear performance:
			//	stratefies the loop through all segments into log* parts
			//	and computes new root-Nodes for the remaining segments in each
			//	partition.
			logstar = Math.log(logstar)/Math.LN2;		// == log2(logstar)
			var partEnd = ( logstar > 1 ) ? Math.floor( nbSegs / logstar ) : nbSegs;

			// Core: adds next partition of the segments
			for (; current < partEnd; current++ ) { myQs.add_segment( randSegListArray[current] ); }
//			console.log( nbSegs, current );

			// To speed up the segment insertion into the trapezoidation
			//	the endponts of those segments not yet inserted
			//	are repeatedly pre-located,
			// thus their final location-query can start at the top of the
			//	appropriate sub-tree instead of the root of the whole
			//	query structure.
			//
			for (i = current; i < nbSegs; i++) { this.queryStructure.segNodes( randSegListArray[i] ); }
		}

		myQs.assignDepths( this.polyData );
		// cleanup to support garbage collection
		for (i = 0; i < nbSegs; i++) { randSegListArray[i].trLeft = randSegListArray[i].trRight = null; }
	},

	// Creates a visibility map:
	//	for each vertex the list of all vertices in CW order which are directly
	//	visible through neighboring trapezoids and thus can be connected by a diagonal

	create_visibility_map: function () {
		return	this.queryStructure.create_visibility_map( this.polyData );
	},

};

/**
 * @author jahting / http://www.ameco.tv/
 *
 *	Algorithm to split a polygon into uni-y-monotone sub-polygons
 *
 *	1) creates a trapezoidation of the main polygon according to Seidel's
 *	   algorithm [Sei91]
 *	2) uses diagonals of the trapezoids as additional segments
 *		to split the main polygon into uni-y-monotone sub-polygons
 */

/** @constructor */
PNLTRI.MonoSplitter = function ( inPolygonData ) {

	this.polyData = inPolygonData;

	this.trapezoider = null;

};


PNLTRI.MonoSplitter.prototype = {

	constructor: PNLTRI.MonoSplitter,


	monotonate_trapezoids: function () {					// <<<<<<<<<< public
		// Trapezoidation
		this.trapezoider = new PNLTRI.Trapezoider( this.polyData );
		//	=> one triangular trapezoid which lies inside the polygon
		this.trapezoider.trapezoide_polygon();

		// create segments for diagonals
		this.trapezoider.create_visibility_map();
		// create mono chains by inserting diagonals
		this.polyData.create_mono_chains();

		// create UNIQUE monotone sub-polygons
		this.polyData.unique_monotone_chains_max();
	},

};

/**
 * @author jahting / http://www.ameco.tv/
 *
 *	Algorithm to triangulate uni-y-monotone polygons [FoM84]
 *
 *	expects list of doubly linked monoChains, with Y-max as first vertex
 */


/** @constructor */
PNLTRI.MonoTriangulator = function ( inPolygonData ) {

	this.polyData	= inPolygonData;

};


PNLTRI.MonoTriangulator.prototype = {

	constructor: PNLTRI.MonoTriangulator,


	// Pass each uni-y-monotone polygon with start at Y-max for greedy triangulation.

	triangulate_all_polygons: function () {					// <<<<<<<<<< public
		var	normedMonoChains = this.polyData.getMonoSubPolys();
		this.polyData.clearTriangles();
		for ( var i=0; i<normedMonoChains.length; i++ ) {
			// loop through uni-y-monotone chains
			// => monoPosmin is next to monoPosmax (left or right)
			var monoPosmax = normedMonoChains[i];
			var prevMono = monoPosmax.mprev;
			var nextMono = monoPosmax.mnext;

			if ( nextMono.mnext == prevMono ) {		// already a triangle
				this.polyData.addTriangle( monoPosmax.vFrom, nextMono.vFrom, prevMono.vFrom );
			} else {								// triangulate the polygon
				this.triangulate_monotone_polygon( monoPosmax );
			}
		}
	},

	//	algorithm to triangulate an uni-y-monotone polygon in O(n) time.[FoM84]

	triangulate_monotone_polygon: function ( monoPosmax ) {			// private
		var scope = this;

		function error_cleanup() {
			// Error in algorithm OR polygon is not uni-y-monotone
			console.log( "ERR uni-y-monotone: only concave angles left", vertBackLog );
			// push all "wrong" triangles => loop ends
			while (vertBackLogIdx > 1) {
				vertBackLogIdx--;
				scope.polyData.addTriangle(	vertBackLog[vertBackLogIdx-1],
											vertBackLog[vertBackLogIdx],
											vertBackLog[vertBackLogIdx+1] );
			}
		}

		//
		// Decisive for this algorithm to work correctly is to make sure
		//  the polygon stays uni-y-monotone when cutting off ears, i.e.
		//  to make sure the top-most and bottom-most vertices are removed last
		// Usually this is done by handling the LHS-case ("LeftHandSide is a single segment")
		//	and the RHS-case ("RightHandSide segment is a single segment")
		//	differently by starting at the bottom for LHS and at the top for RHS.
		// This is not necessary. It can be seen easily, that starting
		//	from the vertex next to top handles both cases correctly.
		//

		var frontMono = monoPosmax.mnext;		// == LHS: YminPoint; RHS: YmaxPoint.mnext
		var endVert = monoPosmax.vFrom;

		var vertBackLog = [ frontMono.vFrom ];
		var vertBackLogIdx = 0;

		frontMono = frontMono.mnext;
		var frontVert = frontMono.vFrom;

		// check for robustness		// TODO
		if (frontVert == endVert)	return;		// Error: only 2 vertices

		while ( (frontVert != endVert) || (vertBackLogIdx > 1) ) {
			if ( vertBackLogIdx > 0 ) {
				// vertBackLog is not empty
				var insideAngleCCW = PNLTRI.Math.ptsCrossProd( vertBackLog[vertBackLogIdx], frontVert, vertBackLog[vertBackLogIdx-1] );
				if ( Math.abs(insideAngleCCW) <= PNLTRI.Math.EPSILON_P ) {
					// co-linear
					if ( (frontVert == endVert) ||		// all remaining triangles are co-linear (180 degree)
						 ( PNLTRI.Math.compare_pts_yx( vertBackLog[vertBackLogIdx], frontVert ) ==				// co-linear-reversal
						   PNLTRI.Math.compare_pts_yx( vertBackLog[vertBackLogIdx], vertBackLog[vertBackLogIdx-1] ) ) ) {
						insideAngleCCW = 1;		// => create triangle
					}
				}
				if ( insideAngleCCW > 0 ) {
					// convex corner: cut if off
					this.polyData.addTriangle( vertBackLog[vertBackLogIdx-1], vertBackLog[vertBackLogIdx], frontVert );
					vertBackLogIdx--;
				} else {
					// non-convex: add frontVert to the vertBackLog
					vertBackLog[++vertBackLogIdx] = frontVert;
					if (frontVert == endVert)	error_cleanup();	// should never happen !!
					else {
						frontMono = frontMono.mnext;
						frontVert = frontMono.vFrom;
					}
				}
			} else {
				// vertBackLog contains only start vertex:
				//	add frontVert to the vertBackLog and advance frontVert
				vertBackLog[++vertBackLogIdx] = frontVert;
				frontMono = frontMono.mnext;
				frontVert = frontMono.vFrom;
			}
		}
		// reached the last vertex. Add in the triangle formed
		this.polyData.addTriangle( vertBackLog[vertBackLogIdx - 1], vertBackLog[vertBackLogIdx], frontVert );
	},

};

/**
 * @author jahting / http://www.ameco.tv/
 */

/*******************************************************************************
 *
 *	Triangulator for Simple Polygons with Holes
 *
 *  polygon with holes:
 *	- one closed contour polygon chain
 *  - zero or more closed hole polygon chains
 *
 *	polygon chain (closed):
 *	- Array of vertex Objects with attributes "x" and "y"
 *		- representing the sequence of line segments
 *		- closing line segment (last->first vertex) is implied
 *		- line segments are non-zero length and non-crossing
 *
 *	"global vertex index":
 *	- vertex number resulting from concatenation all polygon chains (starts with 0)
 *
 *
 *	Parameters (will not be changed):
 *		inPolygonChains:
 *		- Array of polygon chains
 *
 *	Results (are a fresh copy):
 *		triangulate_polygon:
 *		- Array of Triangles ( Array of 3 "global vertex index" values )
 *
 ******************************************************************************/

/** @constructor */
PNLTRI.Triangulator = function () {

	this.lastPolyData = null;		// for Debug purposes only

};


PNLTRI.Triangulator.prototype = {

	constructor: PNLTRI.Triangulator,


	clear_lastData: function () {	// save memory after Debug
		this.lastPolyData = null;
	},

	// for the polygon data AFTER triangulation
	//	returns an Array of flags, one flag for each polygon chain:
	//		lies the inside of the polygon to the left?
	//		"true" implies CCW for contours and CW for holes
	get_PolyLeftArr: function () {
		if ( this.lastPolyData )	return this.lastPolyData.get_PolyLeftArr();
		return	null;
	},


	triangulate_polygon: function ( inPolygonChains, inForceTrapezoidation ) {

		// collected conditions for selecting EarClipTriangulator over Seidel's algorithm
		function is_basic_polygon() {
			if (inForceTrapezoidation)	return	false;
			return	( myPolygonData.nbPolyChains() == 1 );
		}


		this.clear_lastData();
		if ( ( !inPolygonChains ) || ( inPolygonChains.length === 0 ) )		return	[];
		//
		// initializes general polygon data structure
		//
		var myPolygonData = new PNLTRI.PolygonData( inPolygonChains );
		//
		var basicPolygon = is_basic_polygon();
		var	myTriangulator;
		if ( basicPolygon ) {
			//
			// triangulates single polygon without holes
			//
			myTriangulator = new PNLTRI.EarClipTriangulator( myPolygonData );
			basicPolygon = myTriangulator.triangulate_polygon_no_holes();
		}
		if ( !basicPolygon ) {
			//
			// splits polygon into uni-y-monotone sub-polygons
			//
			var	myMonoSplitter = new PNLTRI.MonoSplitter( myPolygonData );
			myMonoSplitter.monotonate_trapezoids();
			//
			// triangulates all uni-y-monotone sub-polygons
			//
			myTriangulator = new PNLTRI.MonoTriangulator( myPolygonData );
			myTriangulator.triangulate_all_polygons();
		}
		//
		this.lastPolyData = myPolygonData;
		return	myPolygonData.getTriangles();	// copy of triangle list
	}


};

if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.Shape = function() {
	return this;
}
Gis3d.Shape.triangulator = new PNLTRI.Triangulator();
Gis3d.Shape.unitTest = function() {
	return 'Gis3d.Shape unitTest finish.';
}
Gis3d.Shape.transformArrayModelToTypedArrayModel = function(model) {
	var typedVertex = new Float32Array(model.vertex.length);
	typedVertex.set(model.vertex);
	model.vertex = typedVertex;
	var typedColor = new Float32Array(model.color.length);
	typedColor.set(model.color);
	model.color = typedColor;
	var typedNormal = new Float32Array(model.normal.length);
	typedNormal.set(model.normal);
	model.normal = typedNormal;
	var typedIndex = new Uint16Array(model.index.length);
	typedIndex.set(model.index);
	model.index = typedIndex;
	return model;
}
Gis3d.Shape.lightUp = function(target) {
	if(undefined === target.brightColor) {
		target.normalColor = target.color;
		var color = Array.prototype.slice.call(target.color);
		var idx = 0;
		for(var i = 0, len = 0.25*color.length; i < len; ++i) {
			idx = Number(4)*i;
			color[idx] += 0.1;
			color[idx + 1] += 0.1;
			color[idx + 2] += 0.1;
		}
		target.color = new Float32Array(color.length);
		target.color.set(color);
		target.brightColor = target.color;
	} else {
		target.color = target.brightColor;
	}
	return target;
}
Gis3d.Shape.lightNormal = function(target) {
	if(undefined != target.normalColor) {
		target.color = target.normalColor;
	}
	return target;
}
Gis3d.Shape.setHeight = function(target, opt_height) {
	var height = Number(opt_height) || Number(target.height);
	if(isNaN(height) || (undefined === target.vertex)) {
		console.error('Gis3d.Shape.setHeight(): Wrong input.');
		return target;
	}
	if(target.height === height) {
		return this;
	}
	target.height = height;

	if(undefined != target.highVertex) { // Target is cyllinder.
		var highVertex = target.highVertex;
		for(var i = 0, len = highVertex.length; i < len; i += 4) {
			highVertex[i + 2] = height;
		}
		target.vertex.set(highVertex, highVertex.length);
		var topHeight = height + target.topOffset;
		var topVertex = target.topVertex;
		for(var i = 0, len = topVertex.length; i < len; i += 4) {
			topVertex[i + 2] = topHeight;
		}
		target.vertex.set(topVertex, 2*topVertex.length);

		var red = (0 > height)?0.5:0, alpha = 0.8;
		var green = 2*height*67.8/256, blue = 2*(1-height)*70.2/256;
		var color = new Array(target.color.length);
		for(var i = 0, len = target.color.length; i < len; i += 4) {
			color[i] = red;
			color[i + 1] = green;
			color[i + 2] = blue;
			color[i + 3] = alpha;
		}
		target.color.set(color);
	} else {
		var vertex = target.vertex;
		for(var i = 0, len = vertex.length; i < len; i += 4) {
			vertex[i + 2] = height;
		}
	}
	return this;
}
Gis3d.Shape.proceedHeight = function(target, opt_height) {
	var height = 0;
	if(!isNaN(Number(opt_height))) {
		height = Number(opt_height);
	} else if(!isNaN(Number(target.targetHeight))) {
		height = Number(target.targetHeight);
	} else if(!isNaN(Number(target.height))) {
		height = Number(target.height);
	} else {
		height = Number(0);
	}
	if(isNaN(height) || (undefined === target.vertex)) {
		console.error('Gis3d.Shape.proceedHeight(): Wrong input.');
		return target;
	}
	target.targetHeight = height;

	var current_height = target.height || target.vertex[2];
	var offset_height = height - current_height;
	if(!offset_height) { // Test 0, NaN, undefined at same time.
		return target;
	}
	var delta_height = Math.min(0.1, Math.abs(0.5*(offset_height)));
	var proceed_height = (0 < offset_height)?delta_height:-delta_height;
	var result_height = height;
	if(0.0001 < Math.abs(proceed_height)) {
		result_height = current_height + proceed_height;
	}
	Gis3d.Shape.setHeight(target, result_height);
	return target;
}
Gis3d.Shape.concatShapes = function(s1, s2) {
	var result = {vertex: null, color: null, index: null, normal: null};
	result.vertex = new Float32Array(s1.vertex.length + s2.vertex.length);
	result.vertex.set(s1.vertex);
	result.vertex.set(s2.vertex, s1.vertex.length);

	result.color = new Float32Array(s1.color.length + s2.color.length);
	result.color.set(s1.color);
	result.color.set(s2.color, s1.color.length);

	if((undefined != s1.normal) && (undefined != s2.normal)) {
		result.normal = new Float32Array(s1.normal.length + s2.normal.length);
		result.normal.set(s1.normal);
		result.normal.set(s2.normal, s1.normal.length);
	}

	var s2Index = s2.index;
	result.index = new Uint16Array(s1.index.length + s2Index.length);
	result.index.set(s1.index);
	result.index.set(s2Index, s1.index.length);
	var v1Length = Math.round(0.25*s1.vertex.length);
	var resultIndex = result.index;
	var s1IndexLength = s1.index.length;
	for(var i = 0, len = s2Index.length; i < len; ++i) {
		resultIndex[s1IndexLength + i] += v1Length;
	}
	return result;
}

Gis3d.Shape.XYAxisMesh = function(opt_x, opt_y) {
	this.position = new LaVector(0, 0, 0);
	var x = opt_x || 180;
	var y = opt_y || 90;
	var vertex = [];
	for(var i = 0; i < x; ++i) {
		vertex = vertex.concat([i, y, 0, 1]);
		vertex = vertex.concat([i, -y, 0, 1]);
		vertex = vertex.concat([-i, y, 0, 1]);
		vertex = vertex.concat([-i, -y, 0, 1]);
	}
	for(var i = 0; i < y; ++i) {
		vertex = vertex.concat([x, i, 0, 1]);
		vertex = vertex.concat([-x, i, 0, 1]);
		vertex = vertex.concat([x, -i, 0, 1]);
		vertex = vertex.concat([-x, -i, 0, 1]);
	}
	this.vertex = new Float32Array(vertex.length);
	this.vertex.set(vertex);

	var color = [];
	for(var i = 0, len = 0.25*vertex.length; i < len; ++i) {
		color = color.concat([0.4, 0.6, 0.8, 1.0]);
	}
	this.color = new Float32Array(color.length);
	this.color.set(color);

	var index = [];
	for(var i = 0, len = 0.25*vertex.length; i < len; ++i) {
		index = index.concat([i]);
	}
	this.index = new Uint16Array(index.length);
	this.index.set(index);
	return this;
}
Gis3d.Shape.XYAxisMesh.prototype.shaderName = 'LineColor';

Gis3d.Shape.Pointer = function(point, array) {
	this.position = new LaVector(0, 0, 0);
	if(!(point instanceof LaVector) || !(array instanceof LaVector)) {
		return 'Gis3d.Shape.Pointer(): input need to be LaVector.';
	}
	var p = point.array;
	var vertex = [];
	vertex = vertex.concat([
		p[0] - this.length, p[1], p[2], Number(1.0),
		p[0] + this.length, p[1], p[2], Number(1.0),
		p[0], p[1] - this.length, p[2], Number(1.0),
		p[0], p[1] + this.length, p[2], Number(1.0)
	]);
	this.vertex = new Float32Array(vertex.length);
	this.vertex.set(vertex);
	var color = [];
	for(var i = 0, len = 0.25*vertex.length; i < len; ++i) {
		color = color.concat([1.0, 1.0, 0.0, 1.0]);
	}
	this.color = new Float32Array(color.length);
	this.color.set(color);
	this.index = new Uint16Array(4);
	this.index.set([0, 1, 2, 3]);
	return this;
}
Gis3d.Shape.Pointer.prototype.shaderName = 'LineColor';
Gis3d.Shape.Pointer.prototype.length = Number(0.05);

Gis3d.Shape.Cube = function(opt_x, opt_y, opt_z) {
	this.position = new LaVector(opt_x || 0, opt_y || 0, opt_z || 0);
	return this;
}
Gis3d.Shape.Cube.prototype.shaderName = 'BlendColor';
Gis3d.Shape.Cube.prototype.vertex = new Float32Array([
	0, 0, 0, 1, 1, 0, 0, 1,
	1, 1, 0, 1, 0, 1, 0, 1,
	0, 0, 1, 1, 1, 0, 1, 1,
	1, 1, 1, 1, 0, 1, 1, 1
]);
Gis3d.Shape.Cube.prototype.color = new Float32Array([
	0.945, 0.465, 0.477, 0.5, 0.945, 0.465, 0.477, 0.5,
	0.945, 0.465, 0.477, 0.5, 0.945, 0.465, 0.477, 0.5,
	0.6, 0.8, 0.6, 0.5, 0.6, 0.8, 0.6, 0.5,
	0.6, 0.8, 0.6, 0.5, 0.6, 0.8, 0.6, 0.5
]);
Gis3d.Shape.Cube.prototype.index = new Uint16Array([
	0, 1, 2, 0, 2, 3,
	1, 5, 6, 1, 6, 2,
	5, 4, 7, 5, 7, 6,
	4, 0, 3, 4, 3, 7,
	4, 5, 1, 4, 1, 0,
	3, 2, 6, 3, 6, 7
]);
Gis3d.Shape.Cube.prototype.moveTo = function(opt_x, opt_y, opt_z) {
	this.position = new LaVector(opt_x || 0, opt_y || 0, opt_z || 0);
	return this;
}

Gis3d.Shape.InvFunnel = function(panner, opt_resolution) {
	this.position = new LaVector(0, 0, 0);
	this.resol = Number(opt_resolution) || Number(10);
	this.height = Number(1);
	this.vertex_numbers = Number(1 + this.resol*this.resol);

	this.vertex = new Float32Array(4*this.vertex_numbers);
	this.color = new Float32Array(4*this.vertex_numbers);
	this.index = new Uint16Array(2*3*this.resol*this.resol - 3*this.resol);

	this.vertex.set([
		this.position.array[0],
		this.position.array[1] + this.height,
		this.position.array[2],
		this.position.array[3]
	]);
	for(var h = 0; h < this.resol; ++h) {
		var y = this.height - (h + 1)*this.height/this.resol;
		var r = this.inverseFormula(y);
		var v = new LaVector(r, y, 0);
		var turnMatrix = new LaMatrix().getTurnXYZ(0, 2*Math.PI/this.resol, 0);
		var offset = h*this.resol + 1;
		for(var i = 0; i < this.resol; ++i) {
			this.vertex.set(v.array, 4*(offset + i));
			v = turnMatrix.getMul(v);
		}
	}
	for(var i = 0; i < this.vertex_numbers; ++i) {
		this.color.set([0.945, 0.465, 0.477, 1.0 - i/this.vertex_numbers], 4*i);
	}

	for(var i = 0; i < this.resol; ++i) {
		this.index.set([0, i + 1, i + 2], 3*i);
	}
	for(var h = 1; h < this.resol; ++h) {
		var offset = Number(h*2*3*this.resol - 3*this.resol);
		var top = [], btm = [];
		for(var i = 0; i < this.resol; ++i) {
			top[i] = this.resol*(h - 1) + i + 1;
			btm[i] = this.resol*h + i + 1;
		}
		top[this.resol] = this.resol*(h - 1) + 1;
		btm[this.resol] = this.resol*h + 1;
		for(var i = 0; i < this.resol; ++i) {
			var array = [
				top[i], btm[i], btm[i + 1],
				top[i], btm[i + 1], top[i + 1]
			];
			this.index.set(array, offset + 6*i);
		}
	}
	return this;
}
Gis3d.Shape.InvFunnel.prototype.inverseFormula = function(y) {
	var refDistance = 0.1;
	var rolloffFactor = 0.2;
	if(0 == y) { y = 0.0000001; }
	return Math.min(refDistance*(1/(rolloffFactor*y) - 1/rolloffFactor + 1), 10);
}
Gis3d.Shape.InvFunnel.prototype.moveTo = function(opt_x, opt_y, opt_z) {
	this.position = new LaVector(opt_x || 0, opt_y || 0, opt_z || 0);
	return this;
}

Gis3d.Shape.NormalFur = function(cyllinder) {
	var n =  Array.prototype.slice.call(cyllinder.normal);
	var v =  Array.prototype.slice.call(cyllinder.vertex);
	var vertex = [];
	for(var i = 0, len = 0.25*n.length; i < len; ++i) {
		var v1 = [v[4*i], v[4*i + 1], v[4*i + 2], 1];
		var n1 = [n[4*i] + v1[0], n[4*i + 1] + v1[1], n[4*i + 2] + v1[2], 1];
		vertex = vertex.concat(v1);
		vertex = vertex.concat(n1);
	}
	var color = [];
	for(var i = 0, len = 0.25*n.length; i < len; ++i) {
		color = color.concat([
			1.0, 1.0, 0.0, 1.0, 0.5, 0.5, 0.0, 1.0
		]);
	}
	var index = Array(0.25*vertex.length);
	for(var i = 0, len = index.length; i < len; ++i) {
		index[i] = i;
	}
	this.vertex = new Float32Array(vertex.length);
	this.vertex.set(vertex);
	this.color = new Float32Array(color.length);
	this.color.set(color);
	this.index = new Uint16Array(index.length);
	this.index.set(index);
	return this;
}
Gis3d.Shape.NormalFur.prototype.shaderName = 'LineColor';

Gis3d.Shape.Polygon = function(polygon) {
	var triangulator = Gis3d.Shape.triangulator;
	polygon = [polygon[0]]; // Skip sub polygons.

	for(var j = 0, jlen = polygon.length; j < jlen; ++j) {
		for(var i = 0, len = polygon[j].length; i < len; ++i) {
			if(3 === polygon[j][i].length) {
				polygon[j][i].push(1.0);
			}
			if(2 === polygon[j][i].length) {
				polygon[j][i] = polygon[j][i].concat([0.0, 1.0]);
			}
		}
	}
	var jointed_vertex = JSON.parse('[' + polygon.join() + ']');

	var point_amount = 0.25*jointed_vertex.length;
	this.position = new LaVector(0, 0, 0);

	this.vertex = new Float32Array(4*point_amount);
	this.color = new Float32Array(4*point_amount);

	this.vertex.set(jointed_vertex);

	for(var i = 0; i < point_amount; ++i) {
		this.color.set([1.0, i/point_amount, 0.0, 0.3], 4*i);
	}

	polygon = polygon[0];
	var formated_vertexes = polygon.map(function(point) {
		return {x: Number(point[0]), y: Number(point[1])}
	});
	var tried_indexes = triangulator.triangulate_polygon([formated_vertexes]);

	tried_indexes = JSON.parse('[' + tried_indexes.join() + ']');
	this.index = new Uint16Array(tried_indexes.length);
	this.index.set(tried_indexes);

	var hNormal = [];
	for(var i = 0, len = polygon.length; i < len; ++i) {
		var prevP = null, postP = null;
		if(0 != i) {
			prevP = polygon[i - 1];
		} else {
			prevP = polygon[len - 2];
		}
		if((len - 1) != i) {
			postP = polygon[i + 1];
		} else {
			postP = polygon[1];
		}
		var a = new LaVector(polygon[i][0], polygon[i][1], 0, 1);
		var b = new LaVector(prevP[0], prevP[1], 0, 1);
		var c = new LaVector(postP[0], postP[1], 0, 1);
		hNormal = hNormal.concat(a.getAngleBisector(b, c, true).array);
	}
	this.horizontalNormal = hNormal;
}
Gis3d.Shape.Polygon.prototype.shaderName = 'BlendLight';

Gis3d.Shape.PolygonCyllinder = function(polygon, opt_height) {
	var tempMP = {vertexes: [], colors: [], indexes: [], horizontalNormals: []};
	tempMP.vertexes.push(polygon.vertex);
	tempMP.colors.push(polygon.color);
	tempMP.indexes.push(polygon.index);
	tempMP.horizontalNormals.push(polygon.horizontalNormal);
	return new Gis3d.Shape.MultiPolygonCyllinder(tempMP, opt_height);
}
Gis3d.Shape.PolygonCyllinder.prototype.shaderName = 'BlendLight';

Gis3d.Shape.MultiPolygon = function(multiPolygon) {
	this.vertexes = [];
	this.colors = [];
	this.indexes = [];
	this.horizontalNormals = [];

	var polygon = null;;
	for(var i = 0, len = multiPolygon.length; i < len; ++i) {
		polygon = new Gis3d.Shape.Polygon(multiPolygon[i]);
		this.vertexes.push(polygon.vertex);
		this.colors.push(polygon.color);
		this.indexes.push(polygon.index);
		this.horizontalNormals.push(polygon.horizontalNormal);
	}
	return this;
}
Gis3d.Shape.MultiPolygon.prototype.shaderName = 'BlendLight';


Gis3d.Shape.MultiPolygonCyllinderBackup = function(multiPolygon, opt_height) {
	this.height = Number(opt_height) || 0.0001;
	var h = this.height;
	var concated = {
		vertex: new Float32Array(),
		color: new Float32Array(),
		index: new Uint16Array(),
		normal: new Float32Array()
	};
	for(var i = 0, len = multiPolygon.vertexes.length; i < len; ++i) {
		var tempP = {vertex: null, color: null, index: null, horizontalNormal: null};
		tempP.vertex = multiPolygon.vertexes[i];
		tempP.color = multiPolygon.colors[i];
		tempP.index = multiPolygon.indexes[i];
		tempP.horizontalNormal = multiPolygon.horizontalNormals[i];
		tempP = new Gis3d.Shape.PolygonCyllinder(tempP, h);
		concated = Gis3d.Shape.concatShapes(concated, tempP);
	}
	this.vertex = concated.vertex;
	this.color = concated.color;
	this.index = concated.index;
	this.normal = concated.normal;
	return this;
}

Gis3d.Shape.MultiPolygonCyllinder = function(multiPolygon, opt_height) {
	this.height = Number(opt_height) || 0.0001;
	var h = this.height;

	var ns = multiPolygon.horizontalNormals;
	var totalNormalsLength = 0;
	for(var i = 0, len = ns.length; i < len; ++i) {
		totalNormalsLength += ns[i].length;
	}
	var highNormal = new Float32Array(totalNormalsLength);
	var concatedNormalsLength = 0;
	for(var i = 0, len = ns.length; i < len; ++i) {
		highNormal.set(ns[i], concatedNormalsLength);
		concatedNormalsLength += ns[i].length;
	}
	var btmNormal = highNormal.subarray(0, highNormal.length);
	var invertedSqrtTwo = 1/Math.sqrt(2);
	for(var i = 0, len = btmNormal.length; i < len; i += 4) {
		btmNormal[i] *= invertedSqrtTwo;
		btmNormal[i + 1] *= invertedSqrtTwo;
		btmNormal[i + 2] = -invertedSqrtTwo;
	}
	var topNormal = new Float32Array(totalNormalsLength);
	for(var i = 0, len = topNormal.length; i < len; i += 4) {
		topNormal[i + 2] = 1.0;
		topNormal[i + 3] = 1.0;
	}
	this.normal = new Float32Array(3*totalNormalsLength);
	this.normal.set(btmNormal);
	this.normal.set(highNormal, totalNormalsLength);
	this.normal.set(topNormal, 2*totalNormalsLength);

	var vs = multiPolygon.vertexes;
	var totalVertexesLength = 0;
	for(var i = 0, len = vs.length; i < len; ++i) {
		totalVertexesLength += vs[i].length;
	}
	var btmVertex = new Float32Array(totalVertexesLength);
	var concatedVertexesLength = 0;
	for(var i = 0, len = vs.length; i < len; ++i) {
		btmVertex.set(vs[i], concatedVertexesLength);
		concatedVertexesLength += vs[i].length;
	}

	var minX = Infinity, maxX = -Infinity;
	for(var i = 0, len = btmVertex.length; i < len; i += 4) {
		minX = Math.min(minX, btmVertex[i]);
		maxX = Math.max(maxX, btmVertex[i]);
	}
	var sizeX = maxX - minX;
	var minY = Infinity, maxY = -Infinity;
	for(var i = 0, len = btmVertex.length; i < len; i += 4) {
		minY = Math.min(minY, btmVertex[i + 1]);
		maxY = Math.max(maxY, btmVertex[i + 1]);
	}
	var sizeY = maxY - minY;
	var minSize = Math.min(sizeX, sizeY);
	var topOffset = 0.01*minSize;
	this.topOffset = topOffset;

	var highVertex = Array.prototype.slice.call(btmVertex);
	for(var i = 0, len = highVertex.length; i < len; i += 4) {
		highVertex[i + 2] = h;
	}
	this.highVertex = highVertex;
	var topVertex = highVertex.concat();
	var topAdjust = -topOffset*Math.sqrt(2);
	for(var i = 0, len = topVertex.length; i < len; i += 4) {
		topVertex[i] += btmNormal[i]*topAdjust;
		topVertex[i + 1] += btmNormal[i + 1]*topAdjust;
		topVertex[i + 2] = h + topOffset;
	}
	this.topVertex = topVertex;
	this.vertex = new Float32Array(3*totalVertexesLength);
	this.vertex.set(btmVertex);
	this.vertex.set(highVertex, totalVertexesLength);
	this.vertex.set(topVertex, 2*totalVertexesLength);

	var color = new Array(3*totalVertexesLength);
	var red = Number(0), green = Number(h*67.8/256);
	var blue = Number((1 - h)*70.2/256), alpha = Number(0.8);
	for(var i = 0, len = color.length; i < len; i += 4) {
		color[i] = red;
		color[i + 1] = green;
		color[i + 2] = blue;
		color[i + 3] = alpha;
	}
	this.color = new Float32Array(color.length);
	this.color.set(color);

	var idxs = multiPolygon.indexes;
	var totalIndexesLength = 0;
	for(var i = 0, len = idxs.length; i < len; ++i) {
		totalIndexesLength += idxs[i].length;
	}
	var btmIndex = new Uint16Array(totalIndexesLength);
	var concatedIndexesLength = 0;
	var concatedPointsLength = 0;
	for(var i = 0, len = idxs.length; i < len; ++i) {
		var idx = Array.prototype.slice.call(idxs[i]);
		for(var pIdx = 0, pLen = idx.length; pIdx < pLen; ++pIdx) {
			idx[pIdx] += concatedPointsLength;
		}
		btmIndex.set(idx, concatedIndexesLength);
		concatedIndexesLength += idx.length;
		concatedPointsLength += 0.25*vs[i].length;
	}
	var topIndex = btmIndex.subarray(0, btmIndex.length);
	var topPointsStart = 2*0.25*btmVertex.length;
	for(var i = 0, len = topIndex.length; i < len; ++i) {
		topIndex[i] += topPointsStart;
	}
	var lowSideIndex = [];
	var highPointsStart = 0.25*btmVertex.length;
	var concatedPointsLength = 0;
	for(var i = 0, len = idxs.length; i < len; ++i) {
		var polygonPointLength = 0.25*vs[i].length;
		var sIdx = this.makeSideIndex(polygonPointLength, highPointsStart);
		for(var pSIdx = 0, pSLen = sIdx.length; pSIdx < pSLen; ++pSIdx) {
			sIdx[pSIdx] += concatedPointsLength;
		}
		lowSideIndex = lowSideIndex.concat(sIdx);
		concatedPointsLength += polygonPointLength;
	}
	var highSideIndex = lowSideIndex.concat();
	for(var i = 0, len = highSideIndex.length; i < len; ++i) {
		highSideIndex[i] += highPointsStart;
	}
	this.index = new Uint16Array(2*(btmIndex.length + lowSideIndex.length));
	this.index.set(btmIndex);
	this.index.set(lowSideIndex, btmIndex.length);
	this.index.set(topIndex, btmIndex.length + lowSideIndex.length);
	this.index.set(
		highSideIndex, btmIndex.length + lowSideIndex.length + topIndex.length
	);

	return this;
}
Gis3d.Shape.MultiPolygonCyllinder.prototype.shaderName = 'BlendLight';
Gis3d.Shape.MultiPolygonCyllinder.prototype.topOffset = Number(0.005);
Gis3d.Shape.MultiPolygonCyllinder.prototype.makeSideIndex = function(point_amount, high_points_start) {
	var index = [];
	for(var i = 0, len = point_amount - 1; i < len; ++i) {
		index = index.concat([
			i, i + 1, high_points_start + i,
			i + 1, high_points_start + i, high_points_start + i + 1
		]);
	}
	return index;
}

Gis3d.Shape.UnitedShape = function() {
	this.position = new LaVector(0, 0, 0);
	this.modelAmount = 1;
	this.modelMax = Infinity;
	this.LENGTH_LIMIT = 65536;
	this.vertexes = [new Float32Array()];
	this.colors = [new Float32Array()];
	this.indexes = [new Uint16Array()];
	this.normals = [new Float32Array()];
	return this;
}
Gis3d.Shape.UnitedShape.prototype.shaderName = 'BlendLight';
Gis3d.Shape.UnitedShape.prototype.add = function(p) {
	if(undefined != p.indexes) {
		var temp_poly = null;
		for(var i = 0, len = p.indexes.length; i < len; ++i) {
			temp_poly = {vertex: p.vertexes[i], color: p.colors[i], index: p.indexes[i]};
			this.add(temp_poly);
		}
		return this;
	}
	var lastVertex = this.vertexes[this.vertexes.length - 1];
	if(this.LENGTH_LIMIT >= (p.vertex.length + lastVertex.length)) {
		var tempP = {vertex: null, color: null, index: null, normal: null};
		tempP.vertex = this.vertexes[this.vertexes.length - 1];
		tempP.color = this.colors[this.colors.length - 1];
		tempP.index = this.indexes[this.indexes.length - 1];
		tempP.normal = this.normals[this.normals.length - 1];

		var c = Gis3d.Shape.concatShapes(tempP, p);

		this.vertexes[this.vertexes.length - 1] = c.vertex;
		this.colors[this.colors.length - 1] = c.color;
		this.indexes[this.indexes.length - 1] = c.index;
		this.normals[this.normals.length - 1] = c.normal;
	} else {
		this.vertexes.push(p.vertex);
		this.colors.push(p.color);
		this.indexes.push(p.index);
		this.normals.push(p.normal);
		++this.modelAmount;
	}
	return this;
}

//* vim: syntax=javascript
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dIDB = function() {
	window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

	indexedDB.db = null;
	// Hook up the errors to the console so we could see it.
	// In the future, we need to push these messages to the user.
	indexedDB.onerror = function(e) {
		console.log(e);
	};
	this.eventCenter = Gis3d.eventCenter;
	this.dataBaseInfo = {name: 'gis', version: 1};
	this.database = this.requestIDB();
	this.tableNames = [];
	this.tableStructs = [];

	this.databaseNotAvaliable = false;
	return this;
}
Gis3d.G3dIDB.unitTest = function() {
	var gicidb = new Gis3d.G3dIDB();
	window.gicidb = gicidb;
	return true;
}

Gis3d.G3dIDB.prototype.reset = function() {
	if(this.database instanceof IDBDatabase) {
		this.database.close(); // Will error while deleteDatabase() if didn't close().
	}
	this.database = undefined;
	this.databaseNotAvaliable = false;
	var req = window.indexedDB.deleteDatabase(this.dataBaseInfo.name);
	return this;
}

Gis3d.G3dIDB.prototype.addTable = function(name, struct) {
	if(!(typeof name === 'string') && !(name instanceof String)) {
		console.error('Gis3d.G3dIDB.addTable(): Wrong input.');
		return false;
	}
	if(!(this.database instanceof IDBDatabase)) {
		this.requestIDB()
		return this;
	}
	if(-1 === this.tableNames.indexOf(name)) {
		this.tableNames.push(name);
		this.tableStructs[this.tableNames.indexOf(name)] = struct;
	}
	var storeNames = this.database.objectStoreNames;
	if(!storeNames.contains(name)) {
		this.reset();
	}
	return this;
}

Gis3d.G3dIDB.prototype.requestIDB = function() {
	if(
		!(this.database instanceof IDBDatabase)
		&& !this.requestingDatabase
		&& !this.databaseNotAvaliable
	) {
		this.requestingDatabase = true;
		var dbRequest = indexedDB.open(this.dataBaseInfo.name, this.dataBaseInfo.version);
		dbRequest.holder = this;
		dbRequest.addEventListener('upgradeneeded', this.doDBUpgradeneeded, false);
		dbRequest.addEventListener('success', this.doDBReqSuccess, false);
		dbRequest.addEventListener('error', this.doDBReqError, false);
		dbRequest.addEventListener('blocked', this.doDBReqError, false);
		console.log('Send requestIDB.');
	}
	return this.database;
}

Gis3d.G3dIDB.prototype.doDBReqSuccess = function(e) {
	var holder = e.target.holder;
	holder.database = e.target.result;
	holder.requestingDatabase = false;
	console.log('Request gis3d.database success. database:', e.target.result);
	return this;
}

Gis3d.G3dIDB.prototype.doDBReqError = function(e) {
	var holder = e.target.holder;
	holder.requestingDatabase = false;
	holder.databaseNotAvaliable = true;
	holder.doDBError(e);
	return this;
}

Gis3d.G3dIDB.prototype.doDBError = function(e) {
	console.log('Gis3d.G3dIDB.doDBError(): e.target.errorCode:', e.target.errorCode);
	return this;
}

Gis3d.G3dIDB.prototype.doDBUpgradeneeded = function(e) {
	var db = e.target.result;
	var holder = e.target.holder;
	var store = holder.createTables(db);
	if(store instanceof IDBObjectStore) {
		console.log('G3dIDB.doDBUpgradeneeded(): success. store:', store);
	} else {
		console.warn('G3dIDB.doDBUpgradeneeded(): fail. database:', db);
	}
	return holder;
}

Gis3d.G3dIDB.prototype.createTables = function(db) {
	if(!(db instanceof IDBDatabase)) {
		console.error('G3dIDB.createTable(): Wrong argument.');
		return null;
	}
	for(var i = 0; i < this.tableNames.length; ++i) {
		if(db.objectStoreNames.contains(this.tableNames[i])) {
			db.deleteObjectStore(this.tableNames[i]);
		}
		var store = db.createObjectStore(this.tableNames[i], { keyPath: "id" });
		store.createIndex("center_x", "center_x", {unique: false});
		store.createIndex("center_y", "center_y", {unique: false});
		store.createIndex("origin", "origin", {unique: false});
		store.createIndex("size", "size", {unique: false});
		store.createIndex("centroid", "centroid", {unique: false});
	}
	console.log('G3dIDB.createTable(): success. store:', store);
	return store;
}

//* vim: syntax=javascript
//* vim: dictionary=~/.vim/dict/javascript.dict
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dServer = function() {
	this.eventCenter = Gis3d.eventCenter;
	this.requestingCentroids = false;
	this.requestingModels = [];
	return this;
}

Gis3d.G3dServer.unitTest = function() {
	var giserver = new Gis3d.G3dServer();
	window.giserver = giserver;
	return true;
}

Gis3d.G3dServer.prototype.apiName = 'county';
Gis3d.G3dServer.prototype.ajaxRequestMaker = new Gis3d.XMLReq();
Gis3d.G3dServer.prototype.modelMakerWorker = new Worker('js/G3dModelMaker.js.php');
Gis3d.G3dServer.prototype.fineness = 256;

Gis3d.G3dServer.prototype.reqCentroids = function() {
	if(true === this.requestingCentroids) {
		return this;
	}
	this.requestingCentroids = true;
	var reqMaker = this.ajaxRequestMaker;
	var req = reqMaker.createReq('local', this.apiName);
	req.holder = this;
	req.addEventListener('loadend', this.doCentroidGot, false);
	req.send();
	return this;
}

Gis3d.G3dServer.prototype.doCentroidGot = function(e) {
	var holder = e.target.holder;
	if(200 === e.target.status) {
		var json = JSON.parse(e.target.response);
		var centroids = json.data[0];
		for(var i = 0, len = centroids.length; i < len; ++i) {
			var c = centroids[i];
			c.origin = new LaVector(c.minx, c.miny, 0);
			c.size = new LaVector(c.width, c.height, 0);
			var p = centroids[i].centroid;
			p = p.slice(p.indexOf('(') + 1, p.indexOf(')')).split(' ');
			c.center_x = Number(p[0]);
			c.center_y = Number(p[1]);
		}
		var centroid_names = [];
		for(var i = 0, len = centroids.length; i < len; ++i) {
			centroid_names.push(centroids[i].name);
		}
		console.log('Gis3d.G3dServer.doCentroidGot(): Centroids got.', centroid_names);
		holder.eventCenter.castEvent(holder, 'centroidsgot', centroids);
	} else {
		console.warn('Gis3d.G3dServer.doCentroidGot(): Centroids fail.', e.target.status);
		holder.eventCenter.castEvent(holder, 'centroidsfail', e.target.status);
	}
	holder.requestingCentroids = false;
	return holder;
}

Gis3d.G3dServer.prototype.reqModelById = function(id) {
	if (!(typeof id === 'string') && !(id instanceof String)) {
		console.error('Gis3d.G3dServer.reqModelById(): Wrong input.');
		return this;
	}
	if(true === this.requestingModels[id]) {
		return this;
	}
	this.requestingModels[id] = true;
	var reqMaker = this.ajaxRequestMaker;
	var req = reqMaker.createReq('local', this.apiName, [
		{parmeter: 'id', value: id},
		{parmeter: 'fineness', value: Number(this.fineness)}
	], 'GET');
	req.holder = this;
	req.id = id;
	req.addEventListener('loadend', this.doGeomGot, false);
	req.send();
	return this;
}

Gis3d.G3dServer.prototype.doGeomGot = function(e) {
	var holder = e.target.holder;
	if(200 === e.target.status) {
		var json = JSON.parse(e.target.response);
		var data = json.data[0][0];
		if(undefined != data) {
			if(undefined != data.geom) {
				data.geom = JSON.parse(data.geom);
				holder.requestModelFromWorker(data);
			} else if(undefined != data.model) {
				var model = JSON.parse(data.model);
				model = Gis3d.Shape.transformArrayModelToTypedArrayModel(model);
				holder.eventCenter.castEvent(
					holder, 'modelgot', {model: model, id: data.id, name: data.name}
				);
			} else {
				holder.requestingModels[e.target.id] = false;
				holder.eventCenter.castEvent(holder, 'modelfail', e.target.response);
				console.warn('Gis3d.G3dServer.doGeomGot(): No geom avalible.', e.target.response);
			}
		}
	} else {
		holder.requestingModels[e.target.id] = false;
		holder.eventCenter.castEvent(holder, 'modelfail', e.target.status);
		console.warn('Gis3d.G3dServer.doGeomGot(): Request geom fail.', e.target.status);
	}
	return true;
}

Gis3d.G3dServer.prototype.requestModelFromWorker = function(_data) {
	var data = {geom: _data.geom, id: _data.id, name: _data.name};
	this.modelMakerWorker.holder = this;
	this.modelMakerWorker.addEventListener('message', this.doModelGotFromWorker, false);
	this.modelMakerWorker.postMessage(data);
	return true;
}

Gis3d.G3dServer.prototype.doModelGotFromWorker = function(e) {
	var holder = e.target.holder;
	var data = e.data;
	if(undefined != data.model) {
		console.log(
			'G3dServer.doModelGotFromWorker(): id:', data.id,
			', name:', data.name, ', fineness:', data.fineness,
			', points:', 0.5*0.25*data.model.vertex.length,
			', takes', data.processTime, 'secs.'
		);
		holder.eventCenter.castEvent(
			holder,
			'modelgot',
			{model: data.model, id: data.id, name: data.name}
		);
		holder.replyModelById(data);
	} else {
		console.warn('No model made from worker.', e.target.response);
		holder.eventCenter.castEvent(holder, 'modelfail', data);
	}
	holder.requestingModels[data.id] = false;
	return true;
}

Gis3d.G3dServer.prototype.replyModelById = function(_data) {
	if(undefined === _data.model) { return this; }
	var reqMaker = this.ajaxRequestMaker;
	var req = reqMaker.createReq('local', this.apiName, [
		{parmeter: 'set', value: true},
		{parmeter: 'id', value: _data.id},
		{parmeter: 'fineness', value: Number(this.fineness)}
	], 'post');
	req.send(JSON.stringify(_data));
	return this;
}

//* vim: syntax=javascript
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dRegionIDB = function(factory) {
	if(!(factory instanceof Gis3d.G3dIDB)) {
		console.error('Gis3d.G3dRegionIDB: Wrong argument.');
		return null;
	}
	this.dbFactory = factory;
	factory.addTable(this.regionName, null);
	this.eventCenter = Gis3d.eventCenter;
	this.tempCentroids = [];
	this.requestingModels = [];

	this.escapeCentroids = [];
	this.escapeModels = [];
	return this;
}
Gis3d.G3dRegionIDB.unitTest = function() {
	var gicidb = new Gis3d.G3dRegionIDB();
	window.gicidb = gicidb;
	return true;
}

Gis3d.G3dRegionIDB.prototype.regionName = 'county';

Gis3d.G3dRegionIDB.prototype.reset = function() {
	this.dbFactory.reset();
	this.tempCentroids = [];
	this.requestingModels = [];
	this.escapeCentroids = [];
	this.escapeModels = [];
	return this;
}

Gis3d.G3dRegionIDB.prototype.reqCentroids = function() {
	if(true === this.dbFactory.databaseNotAvaliable) {
		console.log('Gis3d.G3dRegionIDB.reqCentroids(): IDB not avaliable, req from escape instead...');
		this.reqCentroidsFromEscape();
		return this;
	}
	if(true === this.requestingCentroids) {
		return this;
	}
	if(-1 === this.dbFactory.tableNames.indexOf(this.regionName)) {
		this.dbFactory.addTable(this.regionName, null);
		return this;
	}
	var database = this.dbFactory.requestIDB();
	if(!(database instanceof IDBDatabase)) {
		return this;
	}
	this.requestingCentroids = true;
	console.log('Gis3d.G3dRegionIDB.reqCentroids(): Request centroids from IDB. regionName:', this.regionName);
	var trans = database.transaction(this.regionName, 'readonly');
	var objStore = trans.objectStore(this.regionName);
	var cursor = objStore.openCursor();
	cursor.holder = this;
	if('village' === this.regionName) {
		// Need this logging to append holder to cursor.
		console.log('Gis3d.G3dRegionIDB.reqCentroids(): cursor:', cursor);
	}
	cursor.addEventListener('success', this.doCentroidsGot, false);
	cursor.addEventListener('error', this.doCentroidsIDBError, false);
	return this;
}

Gis3d.G3dRegionIDB.prototype.reqCentroidsFromEscape = function() {
	if(0 != this.escapeCentroids.length) {
		this.eventCenter.castEvent(this, 'centroidsgot', this.escapeCentroids);
		console.log('Gis3d.G3dRegionIDB.reqCentroidsFromEscape(): centroids:', this.escapeCentroids);
	} else {
		this.eventCenter.castEvent(this, 'centroidsfail', this.escapeCentroids);
		console.warn('Gis3d.G3dRegionIDB.reqCentroidsFromEscape(): Request centroids fail.');
	}
	return this;
}

Gis3d.G3dRegionIDB.prototype.doDBError = function(e) {
	console.log('Gis3d.G3dRegionIDB.doDBError(): e.target.errorCode:', e.target.errorCode);
	return this;
}

Gis3d.G3dRegionIDB.prototype.doCentroidsIDBError = function(e) {
	var holder = e.target.holder;
	holder.requestingCentroids = false;
	holder.doDBError(e);
	return this;
}

Gis3d.G3dRegionIDB.prototype.doCentroidsGot = function(e) {
	var holder = e.target.holder;
	var cursor = e.target.result;
	if(cursor) {
		cursor.value.model = undefined;
		holder.tempCentroids.push(cursor.value);
		cursor.continue();
	} else {
		if(0 != holder.tempCentroids.length) {
			holder.eventCenter.castEvent(holder, 'centroidsgot', holder.tempCentroids);
			console.log('Gis3d.G3dRegionIDB.doCentroidsGot(): centroids:', holder.tempCentroids);
			holder.tempCentroids = [];
		} else {
			holder.eventCenter.castEvent(holder, 'centroidsfail', holder.tempCentroids);
			console.warn('Gis3d.G3dRegionIDB.doCentroidsGot(): Request centroids fail.');
		}
		holder.requestingCentroids = false;
	}
	return null;
}

Gis3d.G3dRegionIDB.prototype.updateCentroids = function(centroids) {
	if(true === this.dbFactory.databaseNotAvaliable) {
		this.updateCentroidsToEscape(centroids);
		return this;
	}
	if(-1 === this.dbFactory.tableNames.indexOf(this.regionName)) {
		this.dbFactory.addTable(this.regionName, null);
		return this;
	}
	var database = this.dbFactory.requestIDB();
	if(!(database instanceof IDBDatabase)) {
		return this;
	}
	var trans = database.transaction(this.regionName, 'readwrite');
	var store = trans.objectStore(this.regionName);
	for(var i = 0, len = centroids.length; i < len; ++i) {
		store.put(centroids[i]).addEventListener('error', this.doDBError, false);
	}
	this.eventCenter.castEvent(this, 'centroidsupdated', 'updated');
	return this;
}

Gis3d.G3dRegionIDB.prototype.updateCentroidsToEscape = function(centroids) {
	this.escapeCentroids = centroids;
	this.eventCenter.castEvent(this, 'centroidsupdatedtoescape', 'updated');
	return this;
}

Gis3d.G3dRegionIDB.prototype.reqModelById = function(id) {
	if (!(typeof id === 'string') && !(id instanceof String)) {
		console.error('Gis3d.G3dRegionIDB.reqModelById(): Wrong input.');
		return this;
	}
	if(true === this.dbFactory.databaseNotAvaliable) {
		this.reqModelByIdFromEscape(id);
		return this;
	}
	if(true === this.requestingModels[id]) {
		return this;
	}
	if(-1 === this.dbFactory.tableNames.indexOf(this.regionName)) {
		this.dbFactory.addTable(this.regionName, null);
		return this;
	}
	var database = this.dbFactory.requestIDB();
	if(!(database instanceof IDBDatabase)) {
		return this;
	}
	this.requestingModels[id] = true;
	var trans = database.transaction(this.regionName, 'readonly');
	var objStore = trans.objectStore(this.regionName);
	var req = objStore.get(id);
	req.holder = this;
	req.id = id;
	req.addEventListener('success', this.doModelGotFromIDB, false);
	req.addEventListener('error', this.doModelIDBError, false);
	return this;
}

Gis3d.G3dRegionIDB.prototype.reqModelByIdFromEscape = function(id) {
	var model = this.escapeModels[id];
	if(undefined != model) {
		this.eventCenter.castEvent(this, 'modelgot', {id: id, model: model});
	} else {
		this.eventCenter.castEvent(this, 'modelfail', {id: id});
	}
	return this;
}

Gis3d.G3dRegionIDB.prototype.doModelIDBError = function(e) {
	var holder = e.target.holder;
	holder.requestingModels[e.target.id] = false;
	holder.doDBError(e);
	return this;
}

Gis3d.G3dRegionIDB.prototype.doModelGotFromIDB = function(e) {
	var holder = e.target.holder;
	var id = e.target.id;
	var result = e.target.result;
	if((undefined != result) && (undefined != result.model)) {
		holder.eventCenter.castEvent(holder, 'modelgot', {id: id, model: result.model});
	} else {
		holder.eventCenter.castEvent(holder, 'modelfail', {id: id});
	}
	holder.requestingModels[id] = false;
	return this;
}

Gis3d.G3dRegionIDB.prototype.updateModelById = function(id, model) {
	if (!(typeof id === 'string') && !(id instanceof String)) {
		console.error('Gis3d.G3dRegionIDB.updateModelById(): Wrong input.');
		return this;
	}
	if(true === this.dbFactory.databaseNotAvaliable) {
		this.updateModelByIdToEscape(id, model);
		return this;
	}
	if(-1 === this.dbFactory.tableNames.indexOf(this.regionName)) {
		this.dbFactory.addTable(this.regionName, null);
		return this;
	}
	var database = this.dbFactory.requestIDB();
	if(!(database instanceof IDBDatabase)) {
		return this;
	}
	var trans = database.transaction(this.regionName, 'readwrite');
	var store = trans.objectStore(this.regionName);
	var req = store.get(id);
	req.model = model;
	req.holder = this;
	req.addEventListener('error', this.doDBError, false);
	req.addEventListener('success', this.doUpdateModel, false);
	return true;
}

Gis3d.G3dRegionIDB.prototype.updateModelByIdToEscape = function(id, model) {
	this.escapeModels[id] = model;
	this.eventCenter.castEvent(this, 'modelupdatedtoescape', {id: id});
	return this;
}

Gis3d.G3dRegionIDB.prototype.doUpdateModel = function(e) {
	var holder = e.target.holder;
	var data = e.target.result;
	if(undefined != data) {
		var store = e.target.source;
		var model = e.target.model;
		data.model = model;
		var req = store.put(data);
		req.addEventListener('error', holder.doDBError, false);
		req.addEventListener('success', function(e) {
			console.log('G3dRegionIDB.doUpdateModel(): ', e.target.result);
		}, false);
	}
	return this;
}

//* vim: syntax=javascript
//* vim: dictionary=~/.vim/dict/javascript.dict
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dRegion = function(factory) {
	if(!(factory instanceof Gis3d.G3dIDB)) {
		console.error('Gis3d.G3dRegion: Wrong argument.');
		return null;
	}
	this.eventCenter = Gis3d.eventCenter;
	this.server = new Gis3d.G3dServer();
	this.idb = new Gis3d.G3dRegionIDB(factory);
	this.centroids = [];
	this.models = [];
	this.modelDatas = [];
	this.unitedModel = null;
	this.lastUnitedModelTime = -Infinity;
	this.lastShuffleTime = -Infinity;
	return this;
}
Gis3d.G3dRegion.unitTest = function() {
	var gicidb = new Gis3d.G3dRegion();
	window.gicidb = gicidb;
	return true;
}

Gis3d.G3dRegion.prototype.regionName = 'county';
Gis3d.G3dRegion.prototype.SHUFFLE_TIME = 2000; // Set to 0 for cancel shuffling.
Gis3d.G3dRegion.prototype.UNITED_MODEL_LIFETIME = Number(70);

Gis3d.G3dRegion.prototype.reset = function() {
	this.centroids = [];
	this.models = [];
	this.unitedModel = null;
	this.lastUnitedModelTime = -Infinity;
	this.lastShuffleTime = -Infinity;
	this.idb.reset();
	return this;
}

Gis3d.G3dRegion.prototype.setRegionName = function(name) {
	if(!(typeof name === 'string') && !(name instanceof String)) {
		console.error('Gis3d.G3dRegion.setRegionName(): Wrong input.');
		return this;
	}
	this.regionName = name;
	this.server.apiName = name;
	this.idb.regionName = name;
	return this;
}

Gis3d.G3dRegion.prototype.setFineness = function(fineness) {
	if(isNaN(Number(fineness))) {
		console.error('Gis3d.G3dRegion.setFineness(): Wrong input.');
		return this;
	}
	this.server.fineness = Number(fineness);
	return this;
}

Gis3d.G3dRegion.prototype.setRegionSelectedById = function(id) {
	var models = this.models;
	var centroids = this.centroids;
	for(var i = 0; i < centroids.length; ++i) {
		var model = models[centroids[i].id];
		if(model) {
			Gis3d.Shape.lightNormal(model);
		}
	}
	if(undefined != models[id]) {
		Gis3d.Shape.lightUp(models[id]);
	}
	return this;
}

Gis3d.G3dRegion.prototype.applyRegionDatas = function(datas) {
	this.modelDatas = datas;
	this.setAllRegionHeight(0.0001);
	for(var i = 0, len = datas.length; i < len; ++i) {
		this.setRegionHeightById(datas[i].id, datas[i].data);
	}
	return this;
}

Gis3d.G3dRegion.prototype.setAllRegionHeight = function(_height) {
	var height = Number(_height);
	if(isNaN(height)) {
		console.error('Gis3d.G3dRegion.setAllRegionHeight(): Wrong input.');
		return this;
	}
	var models = this.models;
	var centroids = this.getCentroids();
	var model = undefined;
	for(var i = 0; i < centroids.length; ++i) {
		model = models[centroids[i].id];
		if(undefined != model) { model.targetHeight = height; }
	}
	return this;
}

Gis3d.G3dRegion.prototype.setRegionHeight = function(input, _height) {
	var height = Number(_height);
	if(isNaN(height)) {
		console.error('Gis3d.G3dRegion.setRegionHeight(): Wrong input.');
		return this;
	}
	var centroids = this.centroids;
	var id = undefined;
	var idx = 0;
	while((undefined === id) && (idx < centroids.length)) {
		if((input === centroids[idx].name) || (Number(input) === Number(centroids[idx].id))) {
			id = centroids[idx].id;
		}
		++idx;
	}
	if(undefined != id) {
		this.setRegionHeightById(id, height);
	}
	return this;
}

Gis3d.G3dRegion.prototype.setRegionHeightById = function(id, _height) {
	var height = Number(_height);
	if(isNaN(height) || (!(typeof id === 'string') && !(id instanceof String))) {
		console.error('Gis3d.G3dRegion.setRegionHeightById(): Wrong input.');
		return this;
	}
	var models = this.models;
	if(undefined != models[id]) {
		models[id].targetHeight = height;
	}
	return this;
}

Gis3d.G3dRegion.prototype.getCentroidById = function(id) {
	if (!(typeof id === 'string') && !(id instanceof String)) {
		console.error('Gis3d.G3dRegion.getCentroidById(): Wrong input.');
		return false;
	}
	var centroids = this.getCentroids();
	var centroid = undefined;
	for(var i = 0; i < centroids.length; ++i) {
		if(id === centroids[i].id) { centroid = centroids[i]; }
	}
	return centroid;
}

Gis3d.G3dRegion.prototype.getCentroids = function() {
	if(0 === this.centroids.length) {
		this.eventCenter.registListener(
			this.idb, 'centroidsgot',
			this.doCentroidsGotFromIDB,
			this
		);
		this.eventCenter.registListener(
			this.idb, 'centroidsfail',
			this.doCentroidsFailFromIDB,
			this
		);
		this.idb.reqCentroids();
	}
	return this.centroids;
}

Gis3d.G3dRegion.prototype.doCentroidsFailFromIDB = function(e) {
	console.log('Gid3d.G3dRegion.doCentroidsFailFromIDB(): Req from server instead.');
	this.eventCenter.registListener(
		this.server, 'centroidsgot', this.doCentroidsGotFromServer, this
	);
	this.server.reqCentroids();
	return this;
}

Gis3d.G3dRegion.prototype.doCentroidsGotFromServer = function(e) {
	var centroids = e.data;
	if(Array.isArray(centroids) && (0 != centroids.length)) {
		this.centroids = centroids;
		this.eventCenter.registListener(
			this.idb, 'centroidsupdated',
			this.doCentroidsUpdatedToIDB,
			this
		);
		this.idb.updateCentroids(centroids);
		this.eventCenter.castEvent(this, 'centroidsgot', centroids);
		var centroid_names = [];
		for(var i = 0, len = centroids.length; i < len; ++i) {
			centroid_names.push(centroids[i].name);
		}
		console.log('Gid3d.G3dRegion.doCentroidsGotFromServer(): centroids:', centroid_names);
	} else {
		this.eventCenter.castEvent(this, 'centroidsfail', e.data);
		console.warn('Gid3d.G3dRegion.doCentroidsGotFromServer(): Request centroids fail.');
	}
	return this;
}

Gis3d.G3dRegion.prototype.doCentroidsUpdatedToIDB = function(e) {
	console.log('Gid3d.G3dRegion.doCentroidsUpdatedToIDB(): success. regionName:', this.regionName);
	return this;
}

Gis3d.G3dRegion.prototype.doCentroidsGotFromIDB = function(e) {
	var centroids = e.data;
	if(Array.isArray(centroids) && (0 != centroids.length)) {
		this.centroids = centroids;
		this.eventCenter.castEvent(this, 'centroidsgot', centroids);

		var centroid_names = [];
		for(var i = 0, len = centroids.length; i < len; ++i) {
			centroid_names.push(centroids[i].name);
		}
		console.log('Gid3d.G3dRegion.doCentroidsGotFromIDB(): centroids:', centroid_names);
	} else {
		this.eventCenter.castEvent(this, 'centroidsfail', e);
		console.warn('Gis3d.G3dRegion.doCentroidsGotFromIDB(): Request centroids fail.');
	}
	return this;
}

Gis3d.G3dRegion.prototype.getModelById = function(id) {
	if (!(typeof id === 'string') && !(id instanceof String)) {
		console.error('Gis3d.G3dRegion.getModelById(): Wrong input.');
		return false;
	}
	if(undefined === this.models[id]) {
		this.eventCenter.registListener(
			this.idb, 'modelgot', this.doModelGotFromIDB, this
		);
		this.eventCenter.registListener(
			this.idb, 'modelfail', this.doModelFailFromIDB, this
		);
		this.idb.reqModelById(id);
	}
	return this.models[id];
}

Gis3d.G3dRegion.prototype.doModelFailFromIDB = function(e) {
	console.log('Gid3d.G3dRegion.doModelFailFromIDB(): Req from server instead.');
	this.eventCenter.registListener(
		this.server, 'modelgot', this.doModelGotFromServer, this
	);
	this.server.reqModelById(e.data.id);
	return this;
}

Gis3d.G3dRegion.prototype.doModelGotFromServer = function(e) {
	var model = e.data.model;
	var id = e.data.id;
	if(undefined != id) {
		this.applyDatasToModelById(id, model, this.modelDatas);
		this.models[id] = model;
		this.idb.updateModelById(id, model);
		this.eventCenter.castEvent(this, 'modelgot', {id: id, model: model});
		console.log(
			'Gid3d.G3dRegion.doModelGotFromServer():', 
			' id:', id, ', name:', e.data.name
		);
	} else {
		this.eventCenter.castEvent(this, 'modelfail', {id: id});
		console.warn('Gid3d.G3dRegion.doModelGotFromServer(): model fail.');
	}
	return this;
}

Gis3d.G3dRegion.prototype.doModelGotFromIDB = function(e) {
	var model = e.data.model;
	var id = e.data.id;
	if(undefined != id) {
		this.applyDatasToModelById(id, model, this.modelDatas);
		this.models[id] = model;
		this.eventCenter.castEvent(this, 'modelgot', {id: id, model: model});
	} else {
		this.eventCenter.castEvent(this, 'modelfail', {id: id});
		console.warn('Gid3d.G3dRegion.doModelGotFromIDB(): model fail.');
	}
	return this;
}

Gis3d.G3dRegion.prototype.applyDatasToModelById = function(id, model, datas) {
	if(!(typeof id === 'string') && !(id instanceof String)) {
		console.error('Gis3d.G3dRegion.applyDatasToModelById(): Wrong input.');
		return this;
	}
	for(var i = 0, len = datas.length; i < len; ++i) {
		if(id = datas[i].id) {
			model.targetHeight = Number(datas[i].data);
		}
	}
	return this;
}

Gis3d.G3dRegion.prototype.getUnitedModel = function() {
	if(this.UNITED_MODEL_LIFETIME > (Date.now() - this.lastUnitedModelTime)) {
		return this.unitedModel;
	}
	if((0 != this.SHUFFLE_TIME) && (this.SHUFFLE_TIME < (Date.now() - this.lastShuffleTime))) {
		this.shuffleHeights();
		this.lastShuffleTime = Date.now();
	}
	var model = new Gis3d.Shape.UnitedShape();
	var centroids = this.getCentroids();
	var ids = [];
	for(var i = 0, len = centroids.length; i < len; ++i) {
		ids[i] = centroids[i].id;
	}
	for(var i = 0, len = ids.length; i < len; ++i) {
		var m = this.getModelById(ids[i]);
		if(undefined != m) {
			Gis3d.Shape.proceedHeight(m);
			model.add(m);
		}
	}

	this.unitedModel = model;
	this.lastUnitedModelTime = Date.now();
	return model;
}

Gis3d.G3dRegion.prototype.shuffleHeights = function() {
	for(var i = 0; i < this.centroids.length; ++i) {
		this.setRegionHeightById(this.centroids[i].id, Math.random());
	}
	return this;
}

Gis3d.G3dRegion.prototype.getPointedIdByPoint = function(point) {
	if(!(point instanceof LaVector)) {
		console.error('Gis3d.G3dRegion.getPointed(): Wrong input.');
		return '';
	}
	if(0 == this.centroids.length) {
		this.getCentroids();
		return this;
	}
	var cs = this.centroids;
	var pointeds = [];
	for(var i = 0, len = cs.length; i < len; ++i) {
		var ori = new LaVector(cs[i].origin.array);
		cs[i].origin = ori;
		var size = new LaVector(cs[i].size.array);
		cs[i].size = size;
		if(true === ori.insideCube(size, point)) {
			pointeds.push(cs[i]);
		}
	}
	if(1 < pointeds.length) {
		var minL = Infinity;
		var minOne = null;
		for(var i = 0; i < pointeds.length; ++i) {
			var p = pointeds[i];
			var center = new LaVector(p.center_x, p.center_y, 0, 1);
			var length = center.getSub(point).getLength();;
			if(length < minL) {
				minL = length;
				minOne = p;
			}
		}
		pointeds = [minOne];
	}
	var id = '';
	if(undefined != pointeds[0]) {
		id = pointeds[0].id;
	}
	return id;
}

//* vim: syntax=javascript
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dDataServer = function() {
	this.eventCenter = Gis3d.eventCenter;
	this.requestingWraps = false;
	this.requestingDatas = [];
	return this;
}

Gis3d.G3dDataServer.unitTest = function() {
	var giserver = new Gis3d.G3dDataServer();
	window.giserver = giserver;
	return true;
}

Gis3d.G3dDataServer.prototype.ajaxRequestMaker = new Gis3d.XMLReq();

Gis3d.G3dDataServer.prototype.reqDataById = function(wrapId, lastTime) {
	if (!(typeof wrapId === 'string') && !(wrapId instanceof String)) {
		console.error('Gis3d.G3dDataServer.reqDataById(): Wrong input.');
		return false;
	}
	if(true === this.requestingDatas[wrapId]) {
		return this;
	}
	this.requestingDatas[wrapId] = true;
	var reqMaker = this.ajaxRequestMaker;
	var req = reqMaker.createReq('local', 'data', undefined, 'post');
	req.holder = this;
	req.wrapId = wrapId;
	req.addEventListener('loadend', this.doDataGot, false);
	req.send(JSON.stringify({
		order: 'get',
		wrapId: wrapId,
		lastTime: lastTime
	}));
	return this;
}

Gis3d.G3dDataServer.prototype.doDataGot = function(e) {
	var holder = e.target.holder;
	if(200 === e.target.status) {
		var json = JSON.parse(e.target.response);
		var noChange = false;
		if(json.noChange && json.noChange[0]) {
			noChange = json.noChange[0];
		}
		if(noChange) {
			holder.eventCenter.castEvent(holder, 'datanochange', list);
		} else {
			var list = json.list[0];
			var wrap_id = list.wrapId;
			console.log('Gis3d.G3dDataServer.doDataGot(): Data got.', wrap_id);
			holder.eventCenter.castEvent(holder, 'datagot', list);
		}
	} else {
		console.warn('Gis3d.G3dDataServer.doDataGot(): Data fail.', e.target.status);
		holder.eventCenter.castEvent(holder, 'datafail', e.target.status);
	}
	holder.requestingDatas[e.target.wrapId] = false;
	return holder;
}

//* vim: syntax=javascript
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dData = function() {
	this.eventCenter = Gis3d.eventCenter;
	this.server = new Gis3d.G3dDataServer();
	this.uniaryOperations = [
		{op: this.duplicateDataById, pattern: /^\s*\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\s*$/i, nSubs: 1},
		{op: this.doNothingData, pattern: /^\s*\((.*)\s*\)\s*$/i, nSubs: 1},
		{op: this.sqrtData, pattern: /^\s*sqrt\(\s*(.*)\s*\)\s*$/i, nSubs: 1},
		{op: this.logData, pattern: /^\s*log\(\s*(.*)\s*\)\s*$/i, nSubs: 1},
		{op: this.normalizeData, pattern: /^\s*normal[ize]*\(\s*(.*)\s*\)\s*$/i, nSubs: 1}
	];
	this.binaryOperations = [
		{op: this.divData, pattern: /^\s*(.*)\s+\/\s+(.*)\s*$/i, nSubs: 2},
		{op: this.multipleData, pattern: /^\s*(.*)\s+\*\s+(.*)\s*$/i, nSubs: 2},
		{op: this.sumData, pattern: /^\s*(.*)\s+\+\s+(.*)\s*$/i, nSubs: 2},
		{op: this.minusData, pattern: /^\s*(.*)\s+\-\s+(.*)\s*$/i, nSubs: 2}
	];

	this.usingDataIds = [''];
	this.datas = [];
	this.dataFormula = '',
	this.data = {county: [], town: [], legirea: [], village: []};

	this.lastRegionDataTimes = [];
	this.lastRegionDataReqTimes = [];
	return this;
}
Gis3d.G3dData.unitTest = function() {
	var data = new Gis3d.G3dData();
	var formulas = [
		' normalize( sqrt(  89a6f5d2-5df0-4d29-9553-cb139a8d3bd5  / e17bbd54-4d82-49cc-a8bf-7c95ed08dd7d  )  )',
		' normalize( sqrt(  89a6f5d2-5df0-4d29-9553-cb139a8d3bd5  ) / sqrt( e17bbd54-4d82-49cc-a8bf-7c95ed08dd7d  )  )',
		' sqrt(  normalize( e17bbd54-4d82-49cc-a8bf-7c95ed08dd7d  )  )',
		'  e17bbd54-4d82-49cc-a8bf-7c95ed08dd7d  ',
		'(758644aa-a637-4865-bf22-8a11fccdba27 - 682f41aa-03e7-4190-b229-49509021ec67) / 3b54fda0-1dd1-4a66-9191-7b1394f30247'
	];
	var uuidReg = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/ig;
	for(var i = 0; i < formulas.length; ++i) {
		var usingIds = [];
		var ids = null;
		while(ids = uuidReg.exec(formulas[i])) {
			usingIds.push(ids[0]);
		}
		console.log('formula:', formulas[i]);
		console.log(usingIds);
		console.log('ops:', data.readFormula(formulas[i]));
	}
	return true;
}

Gis3d.G3dData.prototype.SHUFFLE_TIME = 0; // Set to 0 for cancel shuffling.
Gis3d.G3dData.prototype.REGION_DATA_REQ_PERIOD = Number(5000);

Gis3d.G3dData.prototype.reset = function() {
	this.datas = [];
	this.data = {county: [], town: [], legirea: [], village: []};
	this.usingDataIds = ['7273834f-6f3c-4620-8853-d6cf770d1a88'];
	this.dataFormula = ' sqrt(  normalize( 7273834f-6f3c-4620-8853-d6cf770d1a88  )  )',
	this.lastRegionDataTimes = [];
	this.lastRegionDataReqTimes = [];
	return this;
}

Gis3d.G3dData.prototype.setFormula = function(formula) {
	if (!(typeof formula === 'string') && !(formula instanceof String)) {
		console.error('Gis3d.G3dData.setFormula(): Wrong input.');
		return false;
	}
	this.dataFormula = formula;
	var uuidReg = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/ig;
	var usingIds = [];
	var ids = null;
	while(ids = uuidReg.exec(formula[i])) {
		usingIds.push(ids[0]);
	}
	this.usingDataIds = usingIds;
	for(var i = 0, len = usingIds.length; i < len; ++i) {
		this.reqDataById(usingIds[i]);
	}
	this.makeData();
	return this;
}

Gis3d.G3dData.prototype.getData = function() {
	for(var i = 0, len = this.usingDataIds.length; i < len; ++i) {
		this.reqDataById(this.usingDataIds[i]);
	}
	return this.data;
}

Gis3d.G3dData.prototype.reqDataById = function(id) {
	if (!(typeof id === 'string') && !(id instanceof String)) {
		console.error('Gis3d.G3dData.reqDataById(): Wrong input.');
		return false;
	}
	if(this.REGION_DATA_REQ_PERIOD > (Date.now() - this.lastRegionDataReqTimes[id])) {
		return this.datas[id];
	}
	this.lastRegionDataReqTimes[id] = Date.now();

	this.eventCenter.registListener(
		this.server, 'datanochange',
		this.doDataNoChange,
		this
	);
	this.eventCenter.registListener(
		this.server, 'datagot',
		this.doDataGot,
		this
	);
	this.server.reqDataById(id, this.lastRegionDataTimes[id]);
	return this.datas[id];
}

Gis3d.G3dData.prototype.doDataNoChange = function(e) {
	console.log('Gis3d.G3dData.doDataNoChange(): No change.');
	return this;
}

Gis3d.G3dData.prototype.doDataGot = function(e) {
	var id = e.data.wrapId;
	this.lastRegionDataTimes[id] = Date.now();
	this.datas[id] = e.data;
	this.makeData();
	return this;
}

Gis3d.G3dData.prototype.readFormula = function(formula) {
	if (!(typeof formula === 'string') && !(formula instanceof String)) {
		console.error('Gis3d.G3dData.readFormula(): Wrong input.');
		return false;
	}
	formula = formula.trim();
	var ops = [];
	var uos = this.uniaryOperations;
	var results = [];
	var remainds = '';
	for(var i = 0, len = uos.length; i < len; ++i) {
		if(uos[i].pattern.test(formula)) {
			ops.push(uos[i]);
			var r = uos[i].pattern.exec(formula)[1];
			if(undefined === r) {
				results.push({ops: [formula], remainds: ''});
			} else {
				results.push(this.readFormula(r));
			}
		}
	}
	if(results[0] && (/^[^\(]*\)/i.test(results[0].remainds))) {
		ops = [];
		results = [];
	}
	var bos = this.binaryOperations;
	if(0 === results.length) {
		for(var i = 0, len = bos.length; i < len; ++i) {
			if(bos[i].pattern.test(formula)) {
				var r1 = bos[i].pattern.exec(formula)[1];
				var r2 = bos[i].pattern.exec(formula)[2];
				var rf1 = this.readFormula(r1);
				var rf2 = this.readFormula(r2);
				if((0 != rf1.ops.length) && ( 0 != rf2.ops.length)) {
					ops.push(bos[i]);
					results.push(rf1);
					results.push(rf2);
				}
			}
		}
	}
	if(0 != results.length) {
		for(var i = 0, len = results.length; i < len; ++i) {
			ops = ops.concat(results[i].ops);
			remainds = remainds.concat(results[i].remainds);
		}
	} else {
		remainds = formula;
	}
	return {ops: ops, remainds: remainds.trim()};
}

Gis3d.G3dData.prototype.makeData = function(opt_formula) {
	var formula = opt_formula || this.dataFormula;
	if (!(typeof formula === 'string') && !(formula instanceof String)) {
		console.error('Gis3d.G3dData.makeData(): Wrong input.');
		return false;
	}
	this.usingDataIds = [];
	var ops = this.readFormula(formula).ops;
	var buffer = [];
	while(0 != ops.length) {
		var data = ops.pop();
		if(undefined != data.op) {
			this.op_ = data.op;
			if(1 === data.nSubs) {
				buffer.push(this.op_(buffer.pop()));
			} else if(2 === data.nSubs) {
				buffer.push(this.op_(buffer.pop(), buffer.pop()));
			}
			this.op_ = undefined;
		} else {
			var wrapId = data;
			this.usingDataIds.push(wrapId);
			buffer.push(wrapId);
		}
	}
	this.data = buffer.pop();
	return this;
}

Gis3d.G3dData.prototype.duplicateDataById = function(id) {
	if (!(typeof id === 'string') && !(id instanceof String)) {
		console.error('Gis3d.G3dData.duplicateDataById(): Wrong input.');
		return false;
	}
	var duper = function(from, to) {
		for(var i = 0, len = from.length; i < len; ++i) {
			var d = {id: null, data: null};
			var id = from[i].id;
			d.id = id;
			d.numId = Number(id.replace(/\D/g, '')) || Math.random()*1e17;
			d.data = Number(from[i].data);
			to.push(d);
		}
		return to;
	};
	var source = this.reqDataById(id);
	var data = {
		county: [], town: [], legirea: [], village: [],
		wrapId: ''
	};
	if(undefined != source) {
		data.wrapId = source.wrapId;
		duper(source.county, data.county);
		duper(source.town, data.town);
		duper(source.legirea, data.legirea);
		duper(source.village, data.village);
	}
	return data;
}

Gis3d.G3dData.prototype.indexData = function(data) {
	var indexed = [];
	for(var i = 0, len = data.length; i < len; ++i) {
		indexed[data[i].id] = Number(data[i].data);
	}
	return indexed;
}

Gis3d.G3dData.prototype.doNothingData = function(data) {
	return data;
}

Gis3d.G3dData.prototype.sumData = function(data1, data2) {
	var sorter = function(a, b) { return a.numId - b.numId; };
	var merger = function(r1, r2) {
		r1.sort(sorter), r2.sort(sorter);
		var id1 = 0, i2 = 0, dataBuffer = [];
		for(var i = 0, len = r1.length; i < len; ++i) {
			id1 = r1[i].numId;
			while((i2 < r2.length) && (r2[i2].numId < id1)) {
				dataBuffer.push(r2[i2]);
				++i2;
			}
			if((i2 < r2.length) && (r2[i2].numId === id1)) {
				r1[i].data = Number(r1[i].data) + Number(r2[i2].data);
				++i2;
			}
		}
		return r1.concat(dataBuffer);
	};
	var county = merger(data1.county, data2.county);
	var town = merger(data1.town, data2.town);
	var legirea = merger(data1.legirea, data2.legirea);
	var village = merger(data1.village, data2.village);
	return {county: county, town: town, legirea: legirea, village: village, wrapId: 'computed'};
}

Gis3d.G3dData.prototype.minusData = function(data1, data2) {
	var sorter = function(a, b) { return a.numId - b.numId; };
	var merger = function(r1, r2) {
		r1.sort(sorter), r2.sort(sorter);
		var id1 = 0, i2 = 0, dataBuffer = [];
		for(var i = 0, len = r1.length; i < len; ++i) {
			id1 = r1[i].numId;
			while((i2 < r2.length) && (r2[i2].numId < id1)) {
				dataBuffer.push({id: r2[i2].id, numId: r2[i2].numId, data: -Number(r2[i2].data)});
				++i2;
			}
			if((i2 < r2.length) && (r2[i2].numId === id1)) {
				r1[i].data = Number(r1[i].data) - Number(r2[i2].data);
				++i2;
			}
		}
		return r1.concat(dataBuffer);
	};
	var county = merger(data1.county, data2.county);
	var town = merger(data1.town, data2.town);
	var legirea = merger(data1.legirea, data2.legirea);
	var village = merger(data1.village, data2.village);
	return {county: county, town: town, legirea: legirea, village: village, wrapId: 'computed'};
}

Gis3d.G3dData.prototype.multipleData = function(data1, data2) {
	var sorter = function(a, b) { return a.numId - b.numId; };
	var merger = function(r1, r2) {
		r1.sort(sorter), r2.sort(sorter);
		var id1 = 0, i2 = 0, dataBuffer = [];
		for(var i = 0, len = r1.length; i < len; ++i) {
			id1 = r1[i].numId;
			// Only I2 has.
			while((i2 < r2.length) && (r2[i2].numId < id1)) {
				dataBuffer.push({id: r2[i2].id, numId: r2[i2].numId, data: Number(0)});
				++i2;
			}
			// Both I2 and I1 has.
			if((i2 < r2.length) && (r2[i2].numId === id1)) {
				r1[i].data = Number(r1[i].data) * Number(r2[i2].data);
				++i2;
			} else { // Only I1 has.
				r1[i].data = Number(0);
			}
		}
		return r1.concat(dataBuffer);
	};
	var county = merger(data1.county, data2.county);
	var town = merger(data1.town, data2.town);
	var legirea = merger(data1.legirea, data2.legirea);
	var village = merger(data1.village, data2.village);
	return {county: county, town: town, legirea: legirea, village: village, wrapId: 'computed'};
}

Gis3d.G3dData.prototype.divData = function(data1, data2) {
	var sorter = function(a, b) { return a.numId - b.numId; };
	var merger = function(r1, r2) {
		r1.sort(sorter), r2.sort(sorter);
		var id1 = 0, i2 = 0, dataBuffer = [];
		for(var i = 0, len = r1.length; i < len; ++i) {
			id1 = r1[i].numId;
			// Only I2 has.
			while((i2 < r2.length) && (r2[i2].numId < id1)) {
				console.log('Zero 2');
				dataBuffer.push({id: r2[i2].id, numId: r2[i2].numId, data: Number(0)});
				++i2;
			}
			// Both I2 and I1 has.
			if((i2 < r2.length) && (r2[i2].numId === id1)) {
				r1[i].data = Number(r1[i].data) / (Number(r2[i2].data) || Infinity);
				++i2;
			} else { // Only I1 has.
				console.log('Zero 1');
				r1[i].data = Number(0);
			}
		}
		return r1.concat(dataBuffer);
	};
	var county = merger(data1.county, data2.county);
	var town = merger(data1.town, data2.town);
	var legirea = merger(data1.legirea, data2.legirea);
	var village = merger(data1.village, data2.village);
	return {county: county, town: town, legirea: legirea, village: village, wrapId: 'computed'};
}

Gis3d.G3dData.prototype.logData = function(data) {
	var county = data.county;
	var town = data.town;
	var legirea = data.legirea;
	var village = data.village;
	for(var i = 0, len = county.length; i < len; ++i) {
		county[i].data = Math.log(Number(county[i].data) || 1);
	}
	for(var i = 0, len = town.length; i < len; ++i) {
		town[i].data = Math.log(Number(town[i].data) || 1);
	}
	for(var i = 0, len = legirea.length; i < len; ++i) {
		legirea[i].data = Math.log(Number(legirea[i].data) || 1);
	}
	for(var i = 0, len = village.length; i < len; ++i) {
		village[i].data = Math.log(Number(village[i].data) || 1);
	}
	return data;
}

Gis3d.G3dData.prototype.sqrtData = function(data) {
	var county = data.county;
	var town = data.town;
	var legirea = data.legirea;
	var village = data.village;
	for(var i = 0, len = county.length; i < len; ++i) {
		county[i].data =
			Math.sqrt(Number(county[i].data))
			|| -Math.sqrt(-Number(county[i].data));
	}
	for(var i = 0, len = town.length; i < len; ++i) {
		town[i].data =
			Math.sqrt(Number(town[i].data))
			|| -Math.sqrt(-Number(town[i].data));
	}
	for(var i = 0, len = legirea.length; i < len; ++i) {
		legirea[i].data =
			Math.sqrt(Number(legirea[i].data))
			|| -Math.sqrt(-Number(legirea[i].data));
	}
	for(var i = 0, len = village.length; i < len; ++i) {
		village[i].data =
			Math.sqrt(Number(village[i].data))
			|| -Math.sqrt(-Number(village[i].data));
	}
	return data;
}

Gis3d.G3dData.prototype.normalizeData = function(data) {
	var county = data.county;
	var town = data.town;
	var legirea = data.legirea;
	var village = data.village;
	var global_max = 1;
	for(var i = 0, len = county.length; i < len; ++i) {
		county[i].data = Number(county[i].data);
	}
	county = county.sort(function(a, b) {
		return b.data - a.data;
	});
	if(county && county[0] && county[0].data) {
		global_max = county[0].data*2;
		for(var i = 0, len = county.length; i < len; ++i) {
			county[i].data = county[i].data/global_max;
		}
	}
	for(var i = 0, len  = town.length; i < len; ++i) {
		town[i].data = Number(town[i].data)/global_max;
	}
	for(var i = 0, len  = legirea.length; i < len; ++i) {
		legirea[i].data = Number(legirea[i].data)/global_max;
	}
	for(var i = 0, len  = village.length; i < len; ++i) {
		village[i].data = Number(village[i].data)/global_max;
	}
	return data;
}

//* vim: syntax=javascript
//* vim: dictionary=~/.vim/dict/javascript.dict
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dWrapServer = function() {
	this.eventCenter = Gis3d.eventCenter;
	this.wraps = [];
	this.requestingWraps = false;
	return this;
}
Gis3d.G3dWrapServer.unitTest = function() {
	var gicidb = new Gis3d.G3dWrapServer();
	window.gicidb = gicidb;
	return true;
}

Gis3d.G3dWrapServer.prototype.ajaxRequestMaker = new Gis3d.XMLReq();
Gis3d.G3dWrapServer.prototype.usingWrapId = '7273834f-6f3c-4620-8853-d6cf770d1a88';

Gis3d.G3dWrapServer.prototype.reset = function() {
	this.wraps = [];
	this.usingWrapId = '7273834f-6f3c-4620-8853-d6cf770d1a88';
	this.requestingWraps = false;
	return this;
}

Gis3d.G3dWrapServer.prototype.reqWraps = function() {
	if(true === this.requestingWraps) {
		return this.wraps;
	}
	this.requestingWraps = true;
	var reqMaker = this.ajaxRequestMaker;
	var req = reqMaker.createReq('local', 'wrap', undefined, 'post');
	req.holder = this;
	req.addEventListener('loadend', this.doWrapsGot, false);
	req.send(JSON.stringify({order: 'get'}));
	return this.wraps;
}

Gis3d.G3dWrapServer.prototype.doWrapsGot = function(e) {
	var holder = e.target.holder;
	if(200 === e.target.status) {
		var json = JSON.parse(e.target.response);
		var wraps = json.wraps[0];
		var wrap_titles = [];
		for(var i = 0, len = wraps.length; i < len; ++i) {
			wrap_titles.push(wraps[i].title);
		}
		holder.wraps = wraps;
		console.log('Gis3d.G3dWrapServer.doWrapsGot(): Wraps got.', wraps);
		holder.eventCenter.castEvent(holder, 'wrapsgot', wraps);
	} else {
		console.warn('Gis3d.G3dWrapServer.doWrapsGot(): Wraps fail.', e.target.status);
		holder.eventCenter.castEvent(holder, 'wrapsfail', e.target.status);
	}
	holder.requestingWraps = false;
	return holder;
}

//* vim: syntax=javascript
//* vim: dictionary=~/.vim/dict/javascript.dict
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dModel = function() {
	this.eventCenter = Gis3d.eventCenter;
	this.dbFactory = new Gis3d.G3dIDB();
	this.data = new Gis3d.G3dData();

	this.county = new Gis3d.G3dRegion(this.dbFactory);
	this.county.setRegionName('county');
	this.county.setFineness(512);
	this.town = new Gis3d.G3dRegion(this.dbFactory);
	this.town.setRegionName('town');
	this.town.setFineness(256);
	this.legirea = new Gis3d.G3dRegion(this.dbFactory);
	this.legirea.setRegionName('legirea');
	this.legirea.setFineness(256);
	this.village = new Gis3d.G3dRegion(this.dbFactory);
	this.village.setRegionName('village');
	this.village.setFineness(32);
	this.regionL2 = undefined;

	this.countyCentroids = [];
	this.townCentroids = [];
	this.legireaCentroids = [];
	this.villageCentroids = [];
	this.regionL2Centroids = [];

	this.treedRegionL2Centroids = [];
	this.treedRegionL3Centroids = [];

	this.selectedCountyId = '';
	this.selectedTownId = '';
	this.selectedLegireaId = '';
	this.selectedVillageId = '';
	this.selectedRegionL2Id = '';
	this.filterMode = 'except';
	this.whiteIdsList = [];
	this.blackIdsList = [];

	this.wrapServer = new Gis3d.G3dWrapServer()
	this.wraps = [];

	this.stackedDatas = [];
	this.unitedModel = null;
	this.normalizeData = true;
	this.logData = false;
	this.sqrtData = true;
	this.lastUnitedModelTime = -Infinity;
	this.lastWrapsTime = -Infinity;
	this.lastShuffleTime = -Infinity;
	return this;
}
Gis3d.G3dModel.unitTest = function() {
	var gicidb = gis.model || new Gis3d.G3dModel();
	window.gicidb = gicidb;
	var sampleData = [
		{path: ['臺北市'], value: 0.2},
		{path: ['屏東縣', '屏東市', '新興里'], value: 0.5},
		{path: ['新北市', '板橋區'], value: 0.8}
	];
	for(var i = 0; i < sampleData.length; ++i) {
		gicidb.setDataByPath(sampleData[i].path, sampleData[i].value);
	}
	console.table(sampleData);
	console.table(gicidb.data.data);
	return true;
}

Gis3d.G3dModel.prototype.SHUFFLE_TIME = 0; // Set to 0 for cancel shuffling.
Gis3d.G3dModel.prototype.UNITED_MODEL_LIFETIME = Number(70);
Gis3d.G3dModel.prototype.WRAPS_LIFETIME = Number(60000);
Gis3d.G3dModel.prototype.usingWrapId = '';
Gis3d.G3dModel.prototype.regionMode = 'town';

Gis3d.G3dModel.prototype.reset = function() {
	this.unitedModel = null;
	this.lastUnitedModelTime = -Infinity;
	this.lastShuffleTime = -Infinity;
	this.lastWrapsTime = -Infinity;
	this.countyCentroids = [];
	this.townCentroids = [];
	this.legireaCentroids = [];
	this.villageCentroids = [];
	this.regionL2Centroids = [];
	this.treedRegionL2Centroids = [];
	this.treedRegionL3Centroids = [];
	this.filterMode = 'except';
	this.blackIdsList = [];
	this.whiteIdsList = [];
	this.county.reset();
	this.town.reset();
	this.village.reset();
	this.selectedCountyId = '';
	this.selectedTownId = '';
	this.selectedLegireaId = '';
	this.selectedVillageId = '';
	this.selectedRegionL2Id = '';
	this.usingWrapId = '7273834f-6f3c-4620-8853-d6cf770d1a88';
	this.regionMode = 'town';
	return this;
}

Gis3d.G3dModel.prototype.setRegionsSelectedById = function(id) {
	if (!(typeof id === 'string') && !(id instanceof String)) {
		console.error('Gis3d.G3dModel.setRegionsSelectedById(): Wrong input.');
		return false;
	}
	var cc = this.countyCentroids;
	for(var i = 0, len = cc.length; i < len; ++i) {
		if(cc[i].id === id) {
			this.selectedCountyId = id;
		}
	}
	// TODO: town selecting.
	// TODO: village selecting.
	return this;
}

Gis3d.G3dModel.prototype.setRegionsSelectedByPoint = function(point) {
	if(!(point instanceof LaVector)) {
		console.error('Gis3d.G3dModel.setRegionsSelectedByPoint(): Wrong input.');
	}
	var oldCountyId = this.selectedCountyId;
	var oldTownId = this.selectedTownId;
	var oldLegireaId = this.selectedLegireaId;
	var oldVillageId = this.selectedVillageId;
	var newCountyId = this.county.getPointedIdByPoint(point);
	var newTownId = this.town.getPointedIdByPoint(point);
	var newLegireaId = this.legirea.getPointedIdByPoint(point);
	var newVillageId = this.village.getPointedIdByPoint(point);
	if((oldVillageId != newVillageId)) {
		this.selectedCountyId = newCountyId;
		this.selectedTownId = newTownId;
		this.selectedLegireaId = newLegireaId;
		this.selectedVillageId = newVillageId;
		if(('' != newVillageId)) {
			if('legirea' === this.regionMode) {
				this.selectedRegionL2Id = this.selectedLegireaId;
			} else {
				this.selectedRegionL2Id = this.selectedTownId;
			}
			this.eventCenter.castEvent(this, 'selectionchanged', this.getSelectedRegionDatas());
		} else { // If no village selected, cancel all selection.
			this.selectedCountyId = '';
			this.selectedTownId = '';
			this.selectedLegireaId = '';
		}
	}
	return this;
}

Gis3d.G3dModel.prototype.applyStackedDatas = function() {
	var datas = this.stackedDatas.concat();
	this.stackedDatas.length = 0;
	for(var i = 0; i < datas.length; ++i) {
		console.log("Gis3d.G3dModel.applyStackedDatas() length:", datas.length);
		this.setDataByPath(datas[i].path, datas[i].value);
	}
	return this.stackedDatas;
}

Gis3d.G3dModel.prototype.setDataByPath = function(path, value) {
	if(!Array.isArray(path) || (0 === path.length) || !Number(value)) {
		console.error('Gis3d.G3dModel.setDataByPath(): Wrong input.');
		return null;
	}
	this.reqCentroids();
	var data = this.data;
	var dataColumn = undefined;
	var id = undefined;
	switch(path.length) {
		case 1:
			var centroids = this.countyCentroids;
			for(var i = 0; i < centroids.length; ++i) {
				if(path[0] == centroids[i].name) { id = centroids[i].id; }
			}
			if(undefined != id) { dataColumn = data.data.county; }
			break;
		case 2:
			var centroids = this.townCentroids;
			for(var i = 0; i < centroids.length; ++i) {
				if(
					(path[0] === centroids[i].county_name)
					&& (path[1] === centroids[i].name)
				) {
					id = centroids[i].id;
				}
			}
			if(undefined != id) { dataColumn = data.data.town; }
			if(undefined === id) {
				var centroids = this.legireaCentroids;
				for(var i = 0; i < centroids.length; ++i) {
					if(
						(path[0] === centroids[i].county_name)
						&& (path[1] === centroids[i].name)
					) {
						id = centroids[i].id;
					}
				}
				if(undefined != id) { dataColumn = data.data.legirea; }
			}
			break;
		case 3:
			var centroids = this.villageCentroids;
			for(var i = 0; i < centroids.length; ++i) {
				if(
					(path[0] == centroids[i].county_name)
					&& (
						(path[1] == centroids[i].town_name)
						|| (path[1] === centroids[i].legirea_name)
					)
					&& (path[2] == centroids[i].name)
				) {
					id = centroids[i].id;
				}
			}
			if(undefined != id) { dataColumn = data.data.village; }
			break;
		default: break;
	}
	if(undefined != id) { dataColumn.push({id: id, data: value}); }
	else { this.stackedDatas.push({path: path, value: value}); }
	return data;
}


Gis3d.G3dModel.prototype.setFormula = function(formula) {
	if(!(typeof formula === 'string') && !(formula instanceof String)) {
		console.error('Gis3d.G3dModel.setFormula(): Wrong input.');
		return false;
	}
	this.data.setFormula(formula);
	return this;
}

Gis3d.G3dModel.prototype.setRegionMode = function(mode) {
	if(!(typeof mode === 'string') && !(mode instanceof String)) {
		console.error('Gis3d.G3dModel.setRegionMode(): Wrong input.');
		return false;
	}
	if(('town' != mode) && ('legirea' != mode)) {
		console.error('Gis3d.G3dModel.setRegionMode(): Wrong input.');
		return false;
	}
	this.regionMode = mode;
	if('legirea' === this.regionMode) {
		this.regionL2Centroids = this.legireaCentroids;
		this.regionL2 = this.legirea;
	} else {
		this.regionL2Centroids = this.townCentroids;
		this.regionL2 = this.town;
	}
	this.treedRegionL2Centroids = [];
	this.treedRegionL3Centroids = [];
	return this;
}

Gis3d.G3dModel.prototype.getSelectedRegionDatas = function() {
	var searcher = function(centroids, id) {
		var centroid = null, pin = 0, len = centroids.length;
		while((null === centroid) && (pin < len)) {
			if(id === centroids[pin].id) {
				centroid = centroids[pin];
			}
			++pin;
		}
		return centroid;
	};
	var getData = function(datas, id) {
		var data = null, pin = 0, len = datas.length;
		while((null === data) && (pin < len)) {
			if(id === datas[pin].id) {
				data = datas[pin].data;
			}
			++pin;
		}
		return data;
	};
	var datas = {county: null, regionL2: null, village: null};
	var allData = this.data.getData();

	datas.county = searcher(this.countyCentroids, this.selectedCountyId);
	datas.regionL2 = searcher(this.regionL2Centroids, this.selectedRegionL2Id);
	datas.village = searcher(this.villageCentroids, this.selectedVillageId);

	datas.county.data = getData(allData.county, this.selectedCountyId);
	datas.regionL2.data = getData(allData[this.regionMode], this.selectedRegionL2Id);
	datas.village.data = getData(allData.village, this.selectedVillageId);
	return datas;
}

Gis3d.G3dModel.prototype.searchIds = function(input) {
	if (!(typeof input === 'string') && !(input instanceof String)) {
		console.error('Gis3d.G3dModel.searchIds(): Wrong input.');
		return false;
	}
	var ids = [];
	var searcher = function(centroids, input) {
		var ids = [];
		for(var i = 0, len = centroids.length; i < len; ++i) {
			var id = centroids[i].id;
			if((input === id) || (input === centroids[i].name)) {
				ids.push(id);
			}
		}
		return ids;
	};
	var getAllIds = function(centroids) {
		var ids = [];
		for(var i = 0, len = centroids.length; i < len; ++i) {
			ids.push(centroids[i].id);
		}
		return ids;
	}

	this.reqTreedCentroids();

	// Push ids for counties.
	ids = ids.concat(searcher(this.countyCentroids, input));
	// Push sub-ids by county ids.
	for(var i = 0, len = ids.length; i < len; ++i) {
		var cs = this.treedRegionL2Centroids[ids[i]] || [];
		var id = getAllIds(cs);
		ids = ids.concat(getAllIds(cs));
	}

	// Push ids for L2.
	ids = ids.concat(searcher(this.regionL2Centroids, input));
	// Push sub-ids by L2 ids.
	for(var i = 0, len = ids.length; i < len; ++i) {
		var cs = this.treedRegionL3Centroids[ids[i]] || [];
		ids = ids.concat(getAllIds(cs));
	}

	// Push ids for village ids.
	ids = ids.concat(searcher(this.villageCentroids, input));

	return ids;
}

Gis3d.G3dModel.prototype.addRegion = function(input) {
	this.modifyList(input, 'add', 'white');
	this.modifyList(input, 'remove', 'black');
	return this;
}

Gis3d.G3dModel.prototype.removeRegion = function(input) {
	this.modifyList(input, 'remove', 'white');
	this.modifyList(input, 'add', 'black');
	return this;
}

Gis3d.G3dModel.prototype.onlyRegion = function(input) {
	this.modifyList(input, 'only');
	return this;
}

Gis3d.G3dModel.prototype.exceptRegion = function(input) {
	this.modifyList(input, 'except');
	return this;
}

Gis3d.G3dModel.prototype.modifyList = function(input, opt_operation, opt_list) {
	var ids = this.searchIds(input);
	if('only' === opt_operation) {
		this.filterMode = 'only';
		this.whiteIdsList = [];
		operation = 'add';
		list = 'white';
	} else if('except' === opt_operation) {
		this.filterMode = 'except';
		this.blackIdsList = [];
		operation = 'add';
		list = 'black';
	} else {
		operation = opt_operation;
		list = opt_list;
	}
	for(var i = 0, len = ids.length; i < len; ++i) {
		this.modifyListById(ids[i], operation, list);
	}
	this.data.makeData();
	return this;
}

Gis3d.G3dModel.prototype.modifyListById = function(id, opt_operation, opt_list) {
	if (!(typeof id === 'string') && !(id instanceof String)) {
		console.error('Gis3d.G3dModel.addBlackListById(): Wrong input.');
		return false;
	}
	var list = ('white' === opt_list) ? this.whiteIdsList : this.blackIdsList;
	if('remove' === opt_operation) {
		var index = list.indexOf(id);
		if(-1 != index) { list.splice(index, 1); }
	} else {
		if(-1 === list.indexOf(id)) { list.push(id); }
	}
	return this;
}

Gis3d.G3dModel.prototype.reqCentroids = function() {
	if(0 === this.countyCentroids.length) {
		this.countyCentroids = this.county.getCentroids();
	}
	if(0 === this.townCentroids.length) {
		this.town.getCentroids(); // Vital to enable Fx get centroids.
		this.townCentroids = this.town.getCentroids();
		this.setRegionMode(this.regionMode);
	}
	if(0 === this.legireaCentroids.length) {
		this.legirea.getCentroids(); // Vital to enable Fx get centroids.
		this.legireaCentroids = this.legirea.getCentroids();
		this.setRegionMode(this.regionMode);
	}
	if(0 === this.villageCentroids.length) {
		this.villageCentroids = this.village.getCentroids();
	}
	return this;
}

Gis3d.G3dModel.prototype.reqTreedCentroids = function() {
	var treeRegion = function(region, by) {
		var treeded = [];
		for(var i = 0, len = region.length; i < len; ++i) {
			if(undefined === treeded[region[i][by]]) {
				treeded[region[i][by]] = [];
			}
			treeded[region[i][by]].push(region[i]);
		}
		return treeded;
	}
	this.reqCentroids();
	if(0 === this.treedRegionL2Centroids.length) {
		this.treedRegionL2Centroids = treeRegion(this.regionL2Centroids, 'county_id');
	}
	if(0 === this.treedRegionL3Centroids.length) {
		this.treedRegionL3Centroids
			= treeRegion(this.villageCentroids, this.regionMode + '_id');
	}
	return this;
}

Gis3d.G3dModel.prototype.getUsingCentroids = function() {
	this.reqCentroids();
	this.reqTreedCentroids();
	var unselectedCounties = [];
	for(var i = 0, len = this.countyCentroids.length; i < len; ++i) {
		if(this.selectedCountyId != this.countyCentroids[i].id) {
			unselectedCounties.push(this.countyCentroids[i]);
		}
	}

	var unseletedRegionL2 = [];
	var usingRegionL2 = this.treedRegionL2Centroids[this.selectedCountyId] || [];
	for(var i = 0, len = usingRegionL2.length; i < len; ++i) {
		if(this.selectedRegionL2Id != usingRegionL2[i].id) {
			unseletedRegionL2.push(usingRegionL2[i]);
		}
	}

	var result = unselectedCounties;
	if(0 != unseletedRegionL2.length) {
		result = result.concat(unseletedRegionL2);
	}
	if(undefined != this.treedRegionL3Centroids[this.selectedRegionL2Id]) {
		result = result.concat(this.treedRegionL3Centroids[this.selectedRegionL2Id]);
	}
	return result;
}

Gis3d.G3dModel.prototype.getModelById = function(id) {
	if (!(typeof id === 'string') && !(id instanceof String)) {
		console.error('Gis3d.G3dModel.getModelById(): Wrong input.');
		return false;
	}
	var isCounty = false;
	for(var i = 0, len = this.countyCentroids.length; i < len; ++i) {
		if(id === this.countyCentroids[i].id) {
			isCounty = true;
		}
	}
	if(!isCounty) {
		var isTown = false;
		for(var i = 0, len = this.townCentroids.length; i < len; ++i) {
			if(id === this.townCentroids[i].id) {
				isTown = true;
			}
		}
	}
	if(!isLegirea) {
		var isLegirea = false;
		for(var i = 0, len = this.legireaCentroids.length; i < len; ++i) {
			if(id === this.legireaCentroids[i].id) {
				isLegirea = true;
			}
		}
	}
	var model = null;
	if(isCounty) {
		model = this.county.getModelById(id);
	} else if(isTown) {
		model = this.town.getModelById(id);
	} else if(isLegirea) {
		model = this.legirea.getModelById(id);
	} else {
		model = this.village.getModelById(id);
	}
	return model;
}

Gis3d.G3dModel.prototype.applyRegionData = function() {
	var data = this.data.getData();
	var county = data.county;
	var town = data.town;
	var legirea = data.legirea;
	var village = data.village;

	this.applyStackedDatas();

	this.filterDatas(county);
	this.filterDatas(town);
	this.filterDatas(legirea);
	this.filterDatas(village);

	this.county.applyRegionDatas(county);
	this.town.applyRegionDatas(town);
	this.legirea.applyRegionDatas(legirea);
	this.village.applyRegionDatas(village);
	return this;
}

Gis3d.G3dModel.prototype.filterDatas = function(datas) {
	if('only' != this.filterMode) {
		for(var i = 0, len = datas.length; i < len; ++i) {
			if(-1 != this.blackIdsList.indexOf(datas[i].id)) {
				datas[i].data = 0;
			}
		}
	} else {
		for(var i = 0, len = datas.length; i < len; ++i) {
			if(-1 === this.whiteIdsList.indexOf(datas[i].id)) {
				datas[i].data = 0;
			}
		}
	}
	return datas;
}

Gis3d.G3dModel.prototype.updateWraps = function() {
	if(this.WRAPS_LIFETIME > (Date.now() - this.lastWrapsTime)) {
		return this;
	}
	this.eventCenter.registListener(
		this.wrapServer, 'wrapsgot',
		this.doWrapsGot,
		this
	);
	this.wrapServer.reqWraps();
	return this;
}

Gis3d.G3dModel.prototype.doWrapsGot = function(e) {
	this.lastWrapsTime = Date.now();
	this.wraps = e.data;
	this.eventCenter.castEvent(this, 'wrapsgot', this.wraps);
	return this;
}

Gis3d.G3dModel.prototype.getUnitedModel = function() {
	if(this.UNITED_MODEL_LIFETIME > (Date.now() - this.lastUnitedModelTime)) {
		return this.unitedModel;
	}
	if((0 != this.SHUFFLE_TIME) && (this.SHUFFLE_TIME < (Date.now() - this.lastShuffleTime))) {
		this.county.shuffleHeights();
		this.lastShuffleTime = Date.now();
	}
	this.updateWraps();
	this.applyRegionData();
	var model = new Gis3d.Shape.UnitedShape();
	var centroids = this.getUsingCentroids();
	var ids = [];
	for(var i = 0, len = centroids.length; i < len; ++i) {
		ids[i] = centroids[i].id;
	}
	for(var i = 0, len = ids.length; i < len; ++i) {
		var m = this.getModelById(ids[i]);
		if(undefined != m) {
			Gis3d.Shape.proceedHeight(m);
			model.add(m);
		}
	}

	this.unitedModel = model;
	this.lastUnitedModelTime = Date.now();
	return model;
}

//* vim: syntax=javascript
//* vim: dictionary=~/.vim/dict/javascript.dict
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dFPSComputer = function() {
	this.times = [];
	this.last_query_time = 0;
	this.last_fps = 0;
	return this;
}

Gis3d.G3dFPSComputer.prototype.getFPS = function() {
	var times = this.times;
	var fps = 0;
	if(1000 < (Date.now() - this.last_query_time)) {
		if(
			(1 < times.length)
			&& ('pause' != times[0])
			&& ('pause' != times[times.length - 1])
		) {
			fps = 1000*times.length/(times[times.length - 1] - times[0]);
			this.last_fps = fps;
		}
		this.last_query_time = Date.now();
	} else {
		fps = this.last_fps;
	}
	return fps.toPrecision(4);
}

Gis3d.G3dFPSComputer.prototype.addTime = function() {
	var times = this.times;
	times.push(Date.now());
	if(10 < times.length) { times.shift(); }
	return times;
}

Gis3d.G3dFPSComputer.prototype.addPause = function() {
	var times = this.times;
	times.push('pause');
	if(10 < times.length) { times.shift(); }
	return times;
}

Gis3d.G3dFPSComputer.prototype.getDt = function() {
	var times = this.times;
	var dt = 0;
	if('pause' != times[times.length - 1]) {
		dt = 0.001*(Date.now() - times[times.length - 1]);
	}
	return dt;
}

//* vim: syntax=javascript
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dFPSViewer = function() {
	this.frame = document.createElement('div');
	this.frame.className = 'fps';
	return this;
}

Gis3d.G3dFPSViewer.prototype.bindTo = function(elem) {
	elem.appendChild(this.frame);
	return this;
}

Gis3d.G3dFPSViewer.prototype.setTime = function(time) {
	this.frame.textContent = 'FPS: ' + time;
	return this;
}

//* vim: syntax=javascript
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dDataViewer = function() {
	this.frame = document.createElement('div');
	this.frame.className = 'dataviewer';

	this.county = document.createElement('div');
	this.county.className = 'dataviewer-county';
	this.regionL2 = document.createElement('div');
	this.regionL2.className = 'dataviewer-regionl2';
	this.village = document.createElement('div');
	this.village.className = 'dataviewer-village';
	this.frame.appendChild(this.county);
	this.frame.appendChild(this.regionL2);
	this.frame.appendChild(this.village);
	return this;
}

Gis3d.G3dDataViewer.prototype.bindTo = function(elem) {
	elem.appendChild(this.frame);
	return this;
}

Gis3d.G3dDataViewer.prototype.setDatas = function(datas) {
	this.county.textContent = datas.county.name + ' ' + (datas.county.data || 0).toFixed(3);
	this.regionL2.textContent = datas.regionL2.name + ' ' + (datas.regionL2.data || 0).toFixed(3);
	this.village.textContent = datas.village.name + ' ' + (datas.village.data || 0 ).toFixed(3);
	return this;
}

//* vim: syntax=javascript
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.object = function() {
	this.model = new Gis3d.G3dModel();
	Gis3d.eventCenter.registListener(
		this.model, 'selectionchanged', this.doSelectionChanged, this
	);

	this.frame = document.createElement('div');
	this.frame.className = 'gis3d';
	this.canvas2d = document.createElement('canvas');
	this.canvas2d.className = 'canvas2d';
	this.canvas3d = document.createElement('canvas');
	this.canvas3d.className = 'canvas3d';
	this.canvas3d.textContent = "Sorry but your browser don't support WebGL. :(";
	this.ui = document.createElement('div');
	this.ui.className = 'ui';
	this.ui.holder = this;
	this.frame.appendChild(this.canvas3d);
	this.frame.appendChild(this.canvas2d);
	this.frame.appendChild(this.ui);

	this.fpsComputer = new Gis3d.G3dFPSComputer();
	this.fps = new Gis3d.G3dFPSViewer();
	this.fps.bindTo(this.ui);
	this.dataViewer = new Gis3d.G3dDataViewer();
	this.dataViewer.bindTo(this.ui);

	this.keyboardTracker = new Gis3d.ElementPlugin.KeyboardTracker();
	this.keyboardTracker.bindListeners(document);

	this.mouseTracker = new Gis3d.ElementPlugin.MouseTracker();
	this.mouseTracker.scrollingEnabled = false;
	this.mouseTracker.bindListeners(this.ui);
	Gis3d.eventCenter.registListener(
		this.mouseTracker, 'mousemove', this.doMouseMove, this
	);
	Gis3d.eventCenter.registListener(
		this.mouseTracker, 'mousedrag', this.doMouseDrag, this
	);
	Gis3d.eventCenter.registListener(
		this.mouseTracker, 'mousewheel', this.doMouseWheel, this
	);
	return this;
}; Gis3d.object.prototype = Gis3d.prototype;

Gis3d.eventCenter = new Gis3d.EventCenter();
Gis3d.baseMatrix = new LaMatrix();

Gis3d.unitTest = function() {
	var gis3d = new Gis3d();
	gis3d.bindTo(document.getElementById('trunk'));
	gis3d.ui.addEventListener('click', gis3d.showFrame, false);
	window.gis = gis3d;
	return true;
}

Gis3d.prototype.ajaxRequestMaker = new Gis3d.XMLReq();
Gis3d.prototype.data2D = {
	center: {x: 120.59, y: 23.58},
	max: {x: 1.92, y: 3.4},
	axisStep: null,
	model: {centroids: []}
};
Gis3d.prototype.data3D = {
	world: new LaMatrix(),
	eye: new LaVector(120.45758, 23.47669, 4.5, 1.0),
	lookAt: new LaVector(120.45758, 23.47669, 0.0, 1.0),
	up: new LaVector(0.0, 1.0, 0.0, 1.0),
	view: new LaMatrix(),
	fieldOfView: 45.0,
	aspect: 9/16,
	zNear: 0.001,
	zFar: 100.0,
	projection: new LaMatrix()
};
Gis3d.prototype.xzAxisMesh = new Gis3d.Shape.XYAxisMesh();

Gis3d.prototype.bindTo = function(elem) {
	elem.appendChild(this.frame);
	return this;
}

Gis3d.prototype.setDataByPath = function(path, value) {
	if(!Array.isArray(path) || (0 === path.length) || !Number(value)) {
		console.error('Gis3d.setDataByPath(): Wrong input.');
		return null;
	}
	this.model.setDataByPath(path, value);
	return this;
}

Gis3d.prototype.addRegion = function(input) {
	this.model.addRegion(input);
	return this;
}

Gis3d.prototype.removeRegion = function(input) {
	this.model.removeRegion(input);
	return this;
}

Gis3d.prototype.onlyRegion = function(input) {
	this.model.onlyRegion(input);
	return this;
}

Gis3d.prototype.exceptRegion = function(input) {
	this.model.exceptRegion(input);
	return this;
}

Gis3d.prototype.setRegionMode = function(_mode) {
	var mode = ('legirea' === _mode) ? 'legirea' : 'town';
	this.model.setRegionMode(mode);
	return this;
}

Gis3d.prototype.getCountyNames = function() {
	var cIDB = this.model;
	var centroids = cIDB.getUsingCentroids();
	if(0 != centroids.length) {
		this.data2D.model.centroids = centroids;
	}
	return centroids;
}

Gis3d.prototype.getCountyModels = function() {
	var cIDB = this.model;
	var model = cIDB.getUnitedModel();
	this.data3D.countyModel = model;
	return model;
}

Gis3d.prototype.setupCanvas2D = function() {
	var ctx = this.canvas2d.getContext('2d');
	ctx.canvas.width = ctx.canvas.clientWidth;
	ctx.canvas.height = ctx.canvas.clientHeight;
	return this;
}

Gis3d.prototype.draw2DMesh = function() {
	var ctx = this.canvas2d.getContext('2d');
	var width = ctx.canvas.clientWidth;
	var height = ctx.canvas.clientHeight;

	ctx.strokeStyle = "rgba(154, 128, 102, 128)";
	ctx.lineWidth = 2.0;
	ctx.beginPath();
	for(var i = 0; i < width; i += 100) {
		ctx.moveTo(i, 0);
		ctx.lineTo(i, height);
	}
	for(var i = 0; i < height; i += 100) {
		ctx.moveTo(0, i);
		ctx.lineTo(width, i);
	}
	ctx.stroke();

	ctx.fillStyle = "rgba(154, 128, 102, 128)";
	for(var i = 0; i < width; i += 100) {
		ctx.fillText(i, i + 2, 15);
		ctx.fillText(i, i + 2, height);
	}
	for(var i = 0; i < height; i += 100) {
		ctx.fillText(i, 1, i - 2);
		ctx.fillText(i, width - 50, i - 2);
	}
	return this;
}

Gis3d.prototype.draw2DPositions = function() {
	var ctx = this.canvas2d.getContext('2d');
	ctx.strokeStyle = 'red';

	var data3D = this.data3D;
	var wvp = data3D.world.getMul(data3D.view).getMul(data3D.projection);

	this.getCountyNames();
	var centroids = this.data2D.model.centroids;
	var x = 0, y = 0, vName = 'Hi', pos = null;
	var crossSize = Number(3.0);
	ctx.beginPath();
	for(var i = 0, len = centroids.length; i < len; ++i) {
		var c = centroids[i];
		if(null != c.id) {
			pos = new LaVector(c.center_x, c.center_y, 0, 1);
			pos = pos.transformTo2D(wvp, ctx.canvas);
			ctx.moveTo(pos.array[0] - crossSize, pos.array[1]);
			ctx.lineTo(pos.array[0] + crossSize, pos.array[1]);
			ctx.moveTo(pos.array[0], pos.array[1] - crossSize);
			ctx.lineTo(pos.array[0], pos.array[1] + crossSize);
		}
	}
	ctx.stroke();
	return this;
}

Gis3d.prototype.draw2DTexts = function() {
	var makeFontSize = function(name, opt_width, opt_height) {
		var max_font_size = Number(13);
		var width = Number(opt_width) || 3*max_font_size;
		var height = Number(opt_height) || max_font_size;
		var font_x = width / name.length;
		return Math.min(font_x, height).toFixed();
	};

	var ctx = this.canvas2d.getContext('2d');
	ctx.canvas.width = ctx.canvas.clientWidth;
	var max_font_size = '13';
	var min_font_size = 10;
	var font_str = '_FONT_SIZE_px Arial, "文泉驛正黑", "WenQuanYi Zen Hei",'
				+ '"儷黑 Pro", "LiHei Pro", "微軟正黑體", '
				+ '"Microsoft JhengHei", "標楷體", DFKai-SB, sans-serif';
	ctx.fillStyle = 'rgba(154, 58, 5, 128)';

	var data3D = this.data3D;
	var wvp = data3D.world.getMul(data3D.view).getMul(data3D.projection);
	var left = new LaVector(this.data3D.lookAt.array);
	var right = new LaVector(left.array);
	var invSqrtTwo = Math.sqrt(0.5);
	left.array[0] -= invSqrtTwo; left.array[1] -= invSqrtTwo;
	right.array[0] += invSqrtTwo; right.array[1] += invSqrtTwo;
	left = left.transformTo2D(wvp, ctx.canvas);
	right = right.transformTo2D(wvp, ctx.canvas);
	var scale = right.getSub(left).getLength();

	this.getCountyNames();
	var centroids = this.data2D.model.centroids;
	var vName = 'Hi', size = max_font_size, pos = null;
	var halfNameWidth = 0, halfNameHeight = 0;
	for(var i = 0, len = centroids.length; i < len; ++i) {
		var c = centroids[i];
		if(null != c.id) {
			pos = new LaVector(c.center_x, c.center_y, 0, 1);
			pos = pos.transformTo2D(wvp, ctx.canvas);
			vName = c.name;
			size = Math.min(makeFontSize(vName, scale*c.width, scale*c.height), max_font_size);
			if(!(min_font_size > size)) {
				ctx.font = font_str.replace(/_FONT_SIZE_/, size);
				halfNameWidth = 0.5*size*vName.length;
				halfNameHeight = 0.5*size;
				ctx.fillText(vName, pos.array[0] - halfNameWidth, pos.array[1] + halfNameHeight);
			}
		}
	}
	return this;
}

Gis3d.prototype.draw3DShapes = function() {
	var ctx = this.ctx3d;
	if(undefined === ctx) {
		return this;
	}
	ctx.canvas.width = ctx.canvas.clientWidth;
	ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
	this.linesColorShader.setView(this.data3D.view);
	this.linesColorShader.setModel(this.xzAxisMesh);
	this.linesColorShader.draw();

	this.blendLightShader.setView(this.data3D.view);
	this.blendLightShader.setWorld(new LaMatrix());
	this.getCountyModels();
	this.blendLightShader.setUnitedModel(this.data3D.countyModel);
	this.blendLightShader.draw();

	if(undefined != this.data3D.pointer) {
		this.linesColorShader.setModel(this.data3D.pointer);
		this.linesColorShader.draw();
	}
	return this;
}

Gis3d.prototype.showFrame = function(e) {
	var self = null;
	if((undefined != e) && (e.target.holder instanceof Gis3d)) {
		self = e.target.holder;
	} else if (this instanceof Gis3d) {
		self = this;
	}
	if(null === self) {
		return this;
	}
	// Set canvas size with the real size from CSS.
	self.ctx2d = self.canvas2d.getContext('2d');
	self.ctx2d.canvas.width = self.ctx2d.canvas.clientWidth;
	self.ctx2d.canvas.height = self.ctx2d.canvas.clientHeight;

	self.canvas3d.width = self.canvas3d.clientWidth;
	self.canvas3d.height = self.canvas3d.clientHeight;
	self.ctx3d = self.canvas3d.getContext('webgl') || self.canvas3d.getContext('experimental-webgl');
	self.ctx3d.canvas.width = self.ctx3d.canvas.clientWidth;
	self.ctx3d.canvas.height = self.ctx3d.canvas.clientHeight;

	self.data3D.view = Gis3d.baseMatrix.makeViewMatrix(
		self.data3D.eye, self.data3D.lookAt, self.data3D.up
	);
	self.data3D.projection = Gis3d.baseMatrix.makeProjectionMatrix(
		self.data3D.fieldOfView, self.data3D.aspect, self.data3D.zNear, self.data3D.zFar
	);

	self.blendLightShader = new Gis3d.ShaderProgram.BlendLight(self.ctx3d);
	self.blendLightShader.setView(self.data3D.view);
	self.blendLightShader.setProjection(self.data3D.projection);

	self.linesColorShader = new Gis3d.ShaderProgram.LinesColor(self.ctx3d);
	self.linesColorShader.setWorld(new LaMatrix());
	self.linesColorShader.setView(self.data3D.view);
	self.linesColorShader.setProjection(self.data3D.projection);
	self.linesColorShader.setModel(self.xzAxisMesh);

	self.startRender();
	return self;
}

Gis3d.prototype.startRender = function() {
	var self = this;
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame
		|| window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	var render = function(timestamp) {
		if(self.rendering) {
			requestAnimationFrame(render);
			if(self.ctx2d) {
				self.draw2DTexts();
			}
			if(self.ctx3d) { self.draw3DShapes(timestamp); }
			self.fpsComputer.addTime();
		} else {
			self.fpsComputer.addPause();
		}
		self.fps.setTime(self.fpsComputer.getFPS());
	}
	if(!self.renderID) {
		self.renderID = requestAnimationFrame(render);
		self.rendering = true;
	}
	return this;
}

Gis3d.prototype.stopRender = function() {
	var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame
		|| window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
	if(this.renderID && this.rendering) {
		cancelAnimationFrame(this.renderID);
		this.renderID = undefined;
		this.rendering = false;
		this.fpsComputer.addPause();
	}
	return this;
}

Gis3d.prototype.getPointed = function(objs, point) {
	var pointeds = [];
	for(var i = 0, len = objs.length; i < len; ++i) {
		var ori = new LaVector(objs[i].origin.array);
		objs[i].origin = ori;
		var size = new LaVector(objs[i].size.array);
		objs[i].size = size;
		if(true === ori.insideCube(size, point)) {
			pointeds.push(objs[i]);
		}
	}
	if(1 < pointeds.length) {
		var minL = Infinity;
		var minOne = null;
		for(var i = 0; i < pointeds.length; ++i) {
			var p = pointeds[i];
			var center = new LaVector(p.center_x, p.center_y, 0, 1);
			var length = center.getSub(point).getLength();;
			if(length < minL) {
				minL = length;
				minOne = p;
			}
		}
		pointeds = [minOne];
	}
	return pointeds[0];
}

Gis3d.prototype.doSelectionChanged = function(e) {
	this.dataViewer.setDatas(e.data);
	return this;
}

Gis3d.prototype.doMouseMove = function(e) {
	var pos = new LaVector(e.data.axis.x, e.data.axis.y, 1, 1);
	var data = this.data3D;
	var wvp = data.world.getMul(data.view).getMul(data.projection);
	var line = pos.getCastRay(wvp, this.canvas2d);
	var surfaceNormal = new LaVector(0, 0, 1, 0);
	var point = surfaceNormal.getIntersectSurfaceLine(
		new LaVector(0, 0, 0, 1), line.array, line.point
	);
	this.data3D.pointer = new Gis3d.Shape.Pointer(point, line.array);

	this.model.setRegionsSelectedByPoint(point);
	this.draw3DShapes();
	return this;
}

Gis3d.prototype.doMouseDrag = function(e) {
	var move = e.data.move;
	this.draw2DTexts();

	var key_table = this.keyboardTracker.pressedKeys;
	var altPressed = (-1 != key_table.indexOf('Alt'));
	var result = null;
	if(e.data.key.left && !altPressed) {
		var eye = this.data3D.eye;
		var lookAt = this.data3D.lookAt;
		var move_factor = 2*eye.getSub(lookAt).getLength()/this.canvas3d.width;
		var result = this.data3D.view.getMoveScreenXYZ(
			move_factor*move.x, -move_factor*move.y, 0.0,
			this.data3D.eye,
			this.data3D.lookAt,
			this.data3D.up
		);
	} else if(e.data.key.right || altPressed) {
		var result = this.data3D.view.getTurnedViewByScreenXY(
			0.01*move.x, -0.01*move.y,
			this.data3D.eye,
			this.data3D.lookAt,
			this.data3D.up
		);
	}
	this.data3D.view = result.view;
	this.data3D.eye = result.eye;
	this.data3D.lookAt = result.lookAt;
	this.data3D.up = result.up;
	this.draw3DShapes();
	return this;
}

Gis3d.prototype.doMouseWheel = function(e) {
	var wheel = e.data.wheel;
	var eye = this.data3D.eye;
	var lookAt = this.data3D.lookAt;
	var view_length = eye.getSub(lookAt).getLength();
	var deltaZ = 0.04*wheel*view_length;
	if(this.data3D.zNear > (view_length - deltaZ)) {
		deltaZ = 0;
	}
	var result = this.data3D.view.getMoveScreenXYZ(
		0, 0, deltaZ,
		this.data3D.eye,
		this.data3D.lookAt,
		this.data3D.up
	);
	this.data3D.view = result.view;
	this.data3D.eye = result.eye;
	this.data3D.lookAt = result.lookAt;
	this.data3D.up = result.up;
	this.draw3DShapes();
	return this;
}

//* vim: syntax=javascript
//* vim: dictionary=~/.vim/dict/javascript.dict

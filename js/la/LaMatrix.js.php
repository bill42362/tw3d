<?php
?>
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

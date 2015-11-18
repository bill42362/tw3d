<?php
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.Geometry = function() {
	var self = this;
	return this;
}

Gis3d.Geometry.unitTest = function() {
	var g = new Gis3d.Geometry();
	return this;
}

Gis3d.Geometry.prototype.makeNormalVector2D = function(a, b) {
	var result = null;
	if((a instanceof Array) && (b instanceof Array)) {
		var direct = [(b[0] - a[0]), (b[1] - a[1])];
		result = [-direct[1], direct[0], direct[1]*a[0] - direct[0]*a[1]];
	} else {
		console.error('Geometry.makeNormalVector2D(): arguments need to be Array.');
	}
	return result;
}

Gis3d.Geometry.prototype.testHalfPlane2D = function(p, v) {
	var result = null;
	if((p instanceof Array) && ((v instanceof Array) && (3 === v.length))) {
		result = p[0]*v[0] + p[1]*v[1] + v[2];
	} else {
		console.error('Geometry.testHalfPlane2D(): arguments need to be Array and v need 3 element.');
	}
	return result;
}

Gis3d.Geometry.prototype.testConcavePolygon2D = function(vertices, dim) {
	var result = {concave: false, indexes: []};
	var loopV = vertices.concat(vertices.slice(0, 3*dim));
	var a = null, b = null, c = null, d = null;
	var normal = null, h1 = null, h2 = null;
	console.log('loopV: '+loopV+', dim: '+dim);
	for(var i = 0, len = vertices.length/dim; i < len; ++i) {
		a = loopV.slice(i*dim, i*dim + dim);
		b = loopV.slice((i + 1)*dim, (i + 1)*dim + dim);
		c = loopV.slice((i + 2)*dim, (i + 2)*dim + dim);
		d = loopV.slice((i + 3)*dim, (i + 3)*dim + dim);
		normal = this.makeNormalVector2D(a, c);
		h1 = this.testHalfPlane2D(b, normal);
		h2 = this.testHalfPlane2D(d, normal);
		console.log('a: '+a+', b: '+b+', c: '+c+', d: '+d+', h1: '+h1+', h2: '+h2);
		if(0 < h1*h2) {
			result.concave = true;
			result.indexes.push(i + 1);
			if(result.indexes.length == 2) {
				break;
			}
		}
	}
	return result;
}

//* vim: syntax=javascript

<?php
include_once(__DIR__.'/'.'la/LinearAlgebra.js.php');
include_once('pnltri.js');
?>
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

<?php
include_once('la/LinearAlgebra.js.php');
include_once('EventCenter.js.php');
include_once('Shape.js.php');
include_once('G3dServer.js.php');
include_once('G3dIDB.js.php');
include_once('G3dRegionIDB.js.php');
?>
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
	for(var i = 0, len = datas.length; i < len; ++i) {
		this.setRegionHeightById(datas[i].id, datas[i].data);
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

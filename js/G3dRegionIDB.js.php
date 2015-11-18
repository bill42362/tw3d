<?php
include_once('la/LinearAlgebra.js.php');
include_once('EventCenter.js.php');
include_once('G3dIDB.js.php');
?>
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

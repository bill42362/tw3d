<?php
include_once('la/LinearAlgebra.js.php');
include_once('Shape.js.php');
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dServer = function() {
	this.eventCenter = Gis3d.eventCenter;
	this.requestingCentroids = false;
	this.requestingModels = [];
	return this;
}

<?php
include_once('XMLReq.js.php');
include_once('EventCenter.js.php');
?>
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

<?php
include_once('la/LinearAlgebra.js.php');
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dDataServer = function() {
	this.eventCenter = Gis3d.eventCenter;
	this.requestingWraps = false;
	this.requestingDatas = [];
	return this;
}

<?php
include_once('XMLReq.js.php');
include_once('EventCenter.js.php');
?>
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

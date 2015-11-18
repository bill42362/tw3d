<?php
include_once('la/LinearAlgebra.js.php');
include_once('EventCenter.js.php');
include_once('XMLReq.js.php');
?>
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

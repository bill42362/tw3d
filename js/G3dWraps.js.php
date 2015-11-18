<?php
include_once('la/LinearAlgebra.js.php');
include_once('EventCenter.js.php');
include_once('G3dWrap.js.php');
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dWraps = function() {
	this.list = [];
	this.eventCenter = Gis3d.eventCenter;

	this.frame = document.createElement('nav');
	this.frame.className = 'wraps';

	this.titleH2 = document.createElement('h2');
	this.titleH2.className = 'title';
	this.titleH2.textContent = 'Wraps';
	this.listUl = document.createElement('ul');
	this.listUl.className = 'wraplist';
	this.frame.appendChild(this.titleH2);
	this.frame.appendChild(this.listUl);
	return this;
}
Gis3d.G3dWraps.unitTest = function() {
	return true;
}

Gis3d.G3dWraps.prototype.bindTo = function(elem) {
	elem.appendChild(this.frame);
	return this;
}

Gis3d.G3dWraps.prototype.reset = function() {
	return this;
}

Gis3d.G3dWraps.prototype.setWraps = function(wraps) {
	var list = this.list;
	var listUl = this.listUl;
	if(list.length < wraps.length) {
		for(var i = list.length, len = wraps.length; i < len; ++i) {
			var newWrap = new Gis3d.G3dWrap();
			list.push(newWrap);
			newWrap.bindTo(listUl);
			this.eventCenter.registListener(
				newWrap, 'wrapclicked', this.doWrapClicked, this
			);
		}
	}
	for(var i = 0, len = wraps.length; i < len; ++i) {
		list[i].setWrap(wraps[i]);
	}
	return this;
}

Gis3d.G3dWraps.prototype.doWrapClicked = function(e) {
	this.eventCenter.castEvent(this, 'wrapselected', e.data);
	return this;
}

//* vim: syntax=javascript
//* vim: dictionary=~/.vim/dict/javascript.dict

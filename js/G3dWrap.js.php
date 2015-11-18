<?php
include_once('la/LinearAlgebra.js.php');
include_once('EventCenter.js.php');
include_once('ElementPlugin.js.php');
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dWrap = function() {
	this.wrapId = '';
	this.eventCenter = Gis3d.eventCenter;

	this.frame = document.createElement('li');
	this.frame.className = 'wrap';

	this.titleH3 = document.createElement('h3');
	this.titleH3.className = 'title';
	this.descriptionDiv = document.createElement('div');
	this.descriptionDiv.className = 'description';
	this.idDiv = document.createElement('div');
	this.idDiv.className = 'id';
	this.formulaDiv = document.createElement('div');
	this.formulaDiv.className = 'formula';
	this.frame.appendChild(this.titleH3);
	this.frame.appendChild(this.descriptionDiv);
	this.frame.appendChild(this.idDiv);
	this.frame.appendChild(this.formulaDiv);

	this.mouse = new Gis3d.ElementPlugin.MouseTracker();
	this.mouse.bindListeners(this.frame);
	this.mouse.bindListeners(this.titleH3);
	this.mouse.bindListeners(this.descriptionDiv);
	this.mouse.bindListeners(this.idDiv);
	this.mouse.bindListeners(this.formulaDiv);
	this.eventCenter.registListener(
		this.mouse, 'mouseup', this.doMouseUp, this
	);

	return this;
}
Gis3d.G3dWrap.unitTest = function() {
	return true;
}

Gis3d.G3dWrap.prototype.bindTo = function(elem) {
	elem.appendChild(this.frame);
	return this;
}

Gis3d.G3dWrap.prototype.reset = function() {
	this.wrap = [];
	return this;
}

Gis3d.G3dWrap.prototype.setWrap = function(wrap) {
	this.wrapId = wrap.wrap_id;
	this.formula = wrap.formula;
	this.titleH3.textContent = wrap.title;
	this.descriptionDiv.textContent = wrap.description;
	this.idDiv.textContent = wrap.wrap_id;
	this.formulaDiv.textContent = wrap.formula;
	return this;
}

Gis3d.G3dWrap.prototype.doMouseUp = function(e) {
	this.eventCenter.castEvent(this, 'wrapclicked', this.formula || this.wrapId);
	return this;
}

//* vim: syntax=javascript
//* vim: dictionary=~/.vim/dict/javascript.dict

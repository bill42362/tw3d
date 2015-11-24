<?php
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dDataViewer = function() {
	this.frame = document.createElement('div');
	this.frame.className = 'dataviewer';

	this.county = document.createElement('div');
	this.county.className = 'dataviewer-county';
	this.regionL2 = document.createElement('div');
	this.regionL2.className = 'dataviewer-regionl2';
	this.village = document.createElement('div');
	this.village.className = 'dataviewer-village';
	this.frame.appendChild(this.county);
	this.frame.appendChild(this.regionL2);
	this.frame.appendChild(this.village);
	return this;
}

Gis3d.G3dDataViewer.prototype.bindTo = function(elem) {
	elem.appendChild(this.frame);
	return this;
}

Gis3d.G3dDataViewer.prototype.setDatas = function(datas) {
	this.county.textContent = datas.county.name + ' ' + (datas.county.data || 0).toFixed(3);
	this.regionL2.textContent = datas.regionL2.name + ' ' + (datas.regionL2.data || 0).toFixed(3);
	this.village.textContent = datas.village.name + ' ' + (datas.village.data || 0 ).toFixed(3);
	return this;
}

//* vim: syntax=javascript

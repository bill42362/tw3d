<?php
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dFPSViewer = function() {
	this.frame = document.createElement('div');
	this.frame.className = 'fps';
	return this;
}

Gis3d.G3dFPSViewer.prototype.bindTo = function(elem) {
	elem.appendChild(this.frame);
	return this;
}

Gis3d.G3dFPSViewer.prototype.setTime = function(time) {
	this.frame.textContent = 'FPS: ' + time;
	return this;
}

//* vim: syntax=javascript

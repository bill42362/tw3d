<?php
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.Event = function(type, _target) {
	var self = this;
	this.type = type;
	this.target = _target;
	this.currentTarget = this.target;
	return this;
}

//* vim: syntax=javascript

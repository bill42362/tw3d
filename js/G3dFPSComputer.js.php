<?php
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dFPSComputer = function() {
	this.times = [];
	this.last_query_time = 0;
	this.last_fps = 0;
	return this;
}

Gis3d.G3dFPSComputer.prototype.getFPS = function() {
	var times = this.times;
	var fps = 0;
	if(1000 < (Date.now() - this.last_query_time)) {
		if(
			(1 < times.length)
			&& ('pause' != times[0])
			&& ('pause' != times[times.length - 1])
		) {
			fps = 1000*times.length/(times[times.length - 1] - times[0]);
			this.last_fps = fps;
		}
		this.last_query_time = Date.now();
	} else {
		fps = this.last_fps;
	}
	return fps.toPrecision(4);
}

Gis3d.G3dFPSComputer.prototype.addTime = function() {
	var times = this.times;
	times.push(Date.now());
	if(10 < times.length) { times.shift(); }
	return times;
}

Gis3d.G3dFPSComputer.prototype.addPause = function() {
	var times = this.times;
	times.push('pause');
	if(10 < times.length) { times.shift(); }
	return times;
}

Gis3d.G3dFPSComputer.prototype.getDt = function() {
	var times = this.times;
	var dt = 0;
	if('pause' != times[times.length - 1]) {
		dt = 0.001*(Date.now() - times[times.length - 1]);
	}
	return dt;
}

//* vim: syntax=javascript

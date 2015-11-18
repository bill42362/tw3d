<?php
header('Content-Type: text/javascript; charset=utf-8');
include_once('pnltri.js');
include_once('la/LinearAlgebra.js.php');
include_once('Shape.js.php');
?>

onmessage = function(e) {
	var pre_time = Date.now();
	var data = {
		model: undefined, processTime: undefined,
		id: e.data.id, name: e.data.name
	};
	var geom = e.data.geom;
	var model = undefined;
	if('Polygon' === geom.type) {
		model = new Gis3d.Shape.Polygon(geom.coordinates);
		model = new Gis3d.Shape.PolygonCyllinder(model);
	} else if('MultiPolygon' === geom.type) {
		model = undefined;
		model = new Gis3d.Shape.MultiPolygon(geom.coordinates);
		model = new Gis3d.Shape.MultiPolygonCyllinder(model);
	}
	data.model = model;
	var process_time = 0.001*(Date.now() - pre_time);
	data.processTime = process_time;
	postMessage(data);
}

//* vim: syntax=javascript

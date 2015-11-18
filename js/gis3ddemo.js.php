<?php
header('Content-Type: text/javascript; charset=utf-8');
include_once('gis3d.js.php');
?>
var runOnreadyFunctions = function(e) {
	if('complete' == e.target.readyState) {
		var gis3d = new Gis3d.object();
		gis3d.bindTo(document.getElementById('trunk'));
		gis3d.showFrame();
	}
	return this;
}
document.addEventListener("readystatechange", runOnreadyFunctions, false);

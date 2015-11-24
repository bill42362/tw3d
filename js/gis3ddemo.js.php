<?php
header('Content-Type: text/javascript; charset=utf-8');
?>
var runOnreadyFunctions = function(e) {
	if('complete' == e.target.readyState) {
		var gis3d = new Gis3d.object();
		gis3d.bindTo(document.getElementById('trunk'));
		gis3d.showFrame();
		var sampleData = [
			{path: ['臺北市'], value: 0.2},
			{path: ['屏東縣', '屏東市', '新興里'], value: 0.5},
			{path: ['新北市', '板橋區'], value: 0.8}
		];
		for(var i = 0; i < sampleData.length; ++i) {
			gis3d.setDataByPath(sampleData[i].path, sampleData[i].value);
		}
	}
	return this;
}
document.addEventListener("readystatechange", runOnreadyFunctions, false);

//* vim: syntax=javascript
//* vim: dictionary=~/.vim/dict/javascript.dict

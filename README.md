# tw3d
Usage:
1. Include js/gis3d.js
	<script src="js/gis3d.js" type="text/javascript"></script>
2. Include css/gis3d.less
	<link rel="stylesheet/less" type="text/css" href="css/gis3d.less"></link>
	<script src="js/less.js" type="text/javascript"></script>
3. Use library as follow:
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

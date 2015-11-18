<?php
include_once('la/LinearAlgebra.js.php');
include_once('EventCenter.js.php');
include_once('Shape.js.php');
include_once('G3dIDB.js.php');
include_once('G3dRegion.js.php');
include_once('G3dData.js.php');
include_once('G3dWrapServer.js.php');
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dModel = function() {
	this.eventCenter = Gis3d.eventCenter;
	this.dbFactory = new Gis3d.G3dIDB();
	this.data = new Gis3d.G3dData();

	this.county = new Gis3d.G3dRegion(this.dbFactory);
	this.county.setRegionName('county');
	this.county.setFineness(512);
	this.town = new Gis3d.G3dRegion(this.dbFactory);
	this.town.setRegionName('town');
	this.town.setFineness(256);
	this.legirea = new Gis3d.G3dRegion(this.dbFactory);
	this.legirea.setRegionName('legirea');
	this.legirea.setFineness(256);
	this.village = new Gis3d.G3dRegion(this.dbFactory);
	this.village.setRegionName('village');
	this.village.setFineness(32);

	this.countyCentroids = [];
	this.townCentroids = [];
	this.legireaCentroids = [];
	this.villageCentroids = [];
	this.regionL2Centroids = [];

	this.treedRegionL2Centroids = [];
	this.treedRegionL3Centroids = [];

	this.selectedCountyId = '';
	this.selectedTownId = '';
	this.selectedLegireaId = '';
	this.selectedVillageId = '';
	this.selectedRegionL2Id = '';
	this.filterMode = 'except';
	this.whiteIdsList = [];
	this.blackIdsList = [];

	this.wrapServer = new Gis3d.G3dWrapServer()
	this.wraps = [];

	this.unitedModel = null;
	this.normalizeData = true;
	this.logData = false;
	this.sqrtData = true;
	this.lastUnitedModelTime = -Infinity;
	this.lastWrapsTime = -Infinity;
	this.lastShuffleTime = -Infinity;
	return this;
}
Gis3d.G3dModel.unitTest = function() {
	var gicidb = new Gis3d.G3dModel();
	window.gicidb = gicidb;
	return true;
}

Gis3d.G3dModel.prototype.SHUFFLE_TIME = 0; // Set to 0 for cancel shuffling.
Gis3d.G3dModel.prototype.UNITED_MODEL_LIFETIME = Number(70);
Gis3d.G3dModel.prototype.WRAPS_LIFETIME = Number(60000);
Gis3d.G3dModel.prototype.usingWrapId = '7273834f-6f3c-4620-8853-d6cf770d1a88';
Gis3d.G3dModel.prototype.regionMode = 'town';

Gis3d.G3dModel.prototype.reset = function() {
	this.unitedModel = null;
	this.lastUnitedModelTime = -Infinity;
	this.lastShuffleTime = -Infinity;
	this.lastWrapsTime = -Infinity;
	this.countyCentroids = [];
	this.townCentroids = [];
	this.legireaCentroids = [];
	this.villageCentroids = [];
	this.regionL2Centroids = [];
	this.treedRegionL2Centroids = [];
	this.treedRegionL3Centroids = [];
	this.filterMode = 'except';
	this.blackIdsList = [];
	this.whiteIdsList = [];
	this.county.reset();
	this.town.reset();
	this.village.reset();
	this.selectedCountyId = '';
	this.selectedTownId = '';
	this.selectedLegireaId = '';
	this.selectedVillageId = '';
	this.selectedRegionL2Id = '';
	this.usingWrapId = '7273834f-6f3c-4620-8853-d6cf770d1a88';
	this.regionMode = 'town';
	return this;
}

Gis3d.G3dModel.prototype.setRegionsSelectedById = function(id) {
	if (!(typeof id === 'string') && !(id instanceof String)) {
		console.error('Gis3d.G3dModel.setRegionsSelectedById(): Wrong input.');
		return false;
	}
	var cc = this.countyCentroids;
	for(var i = 0, len = cc.length; i < len; ++i) {
		if(cc[i].id === id) {
			this.selectedCountyId = id;
		}
	}
	// TODO: town selecting.
	// TODO: village selecting.
	return this;
}

Gis3d.G3dModel.prototype.setRegionsSelectedByPoint = function(point) {
	if(!(point instanceof LaVector)) {
		console.error('Gis3d.G3dModel.setRegionsSelectedByPoint(): Wrong input.');
	}
	var oldCountyId = this.selectedCountyId;
	var oldTownId = this.selectedTownId;
	var oldLegireaId = this.selectedLegireaId;
	var oldVillageId = this.selectedVillageId;
	var newCountyId = this.county.getPointedIdByPoint(point);
	var newTownId = this.town.getPointedIdByPoint(point);
	var newLegireaId = this.legirea.getPointedIdByPoint(point);
	var newVillageId = this.village.getPointedIdByPoint(point);
	if((oldVillageId != newVillageId)) {
		this.selectedCountyId = newCountyId;
		this.selectedTownId = newTownId;
		this.selectedLegireaId = newLegireaId;
		this.selectedVillageId = newVillageId;
		if(('' != newVillageId)) {
			if('legirea' === this.regionMode) {
				this.selectedRegionL2Id = this.selectedLegireaId;
			} else {
				this.selectedRegionL2Id = this.selectedTownId;
			}
			this.eventCenter.castEvent(this, 'selectionchanged', this.getSelectedRegionDatas());
		} else { // If no village selected, cancel all selection.
			this.selectedCountyId = '';
			this.selectedTownId = '';
			this.selectedLegireaId = '';
		}
	}
	return this;
}

Gis3d.G3dModel.prototype.setFormula = function(formula) {
	if(!(typeof formula === 'string') && !(formula instanceof String)) {
		console.error('Gis3d.G3dModel.setFormula(): Wrong input.');
		return false;
	}
	this.data.setFormula(formula);
	return this;
}

Gis3d.G3dModel.prototype.setRegionMode = function(mode) {
	if(!(typeof mode === 'string') && !(mode instanceof String)) {
		console.error('Gis3d.G3dModel.setRegionMode(): Wrong input.');
		return false;
	}
	if(('town' != mode) && ('legirea' != mode)) {
		console.error('Gis3d.G3dModel.setRegionMode(): Wrong input.');
		return false;
	}
	this.regionMode = mode;
	if('legirea' === this.regionMode) {
		this.regionL2Centroids = this.legireaCentroids;
	} else {
		this.regionL2Centroids = this.townCentroids;
	}
	this.treedRegionL2Centroids = [];
	this.treedRegionL3Centroids = [];
	return this;
}

Gis3d.G3dModel.prototype.getSelectedRegionDatas = function() {
	var searcher = function(centroids, id) {
		var centroid = null, pin = 0, len = centroids.length;
		while((null === centroid) && (pin < len)) {
			if(id === centroids[pin].id) {
				centroid = centroids[pin];
			}
			++pin;
		}
		return centroid;
	};
	var getData = function(datas, id) {
		var data = null, pin = 0, len = datas.length;
		while((null === data) && (pin < len)) {
			if(id === datas[pin].id) {
				data = datas[pin].data;
			}
			++pin;
		}
		return data;
	};
	var datas = {county: null, regionL2: null, village: null};
	var allData = this.data.getData();

	datas.county = searcher(this.countyCentroids, this.selectedCountyId);
	datas.regionL2 = searcher(this.regionL2Centroids, this.selectedRegionL2Id);
	datas.village = searcher(this.villageCentroids, this.selectedVillageId);

	datas.county.data = getData(allData.county, this.selectedCountyId);
	datas.regionL2.data = getData(allData[this.regionMode], this.selectedRegionL2Id);
	datas.village.data = getData(allData.village, this.selectedVillageId);
	return datas;
}

Gis3d.G3dModel.prototype.searchIds = function(input) {
	if (!(typeof input === 'string') && !(input instanceof String)) {
		console.error('Gis3d.G3dModel.searchIds(): Wrong input.');
		return false;
	}
	var ids = [];
	var searcher = function(centroids, input) {
		var ids = [];
		for(var i = 0, len = centroids.length; i < len; ++i) {
			var id = centroids[i].id;
			if((input === id) || (input === centroids[i].name)) {
				ids.push(id);
			}
		}
		return ids;
	};
	var getAllIds = function(centroids) {
		var ids = [];
		for(var i = 0, len = centroids.length; i < len; ++i) {
			ids.push(centroids[i].id);
		}
		return ids;
	}

	this.reqTreedCentroids();

	// Push ids for counties.
	ids = ids.concat(searcher(this.countyCentroids, input));
	// Push sub-ids by county ids.
	for(var i = 0, len = ids.length; i < len; ++i) {
		var cs = this.treedRegionL2Centroids[ids[i]] || [];
		var id = getAllIds(cs);
		ids = ids.concat(getAllIds(cs));
	}

	// Push ids for L2.
	ids = ids.concat(searcher(this.regionL2Centroids, input));
	// Push sub-ids by L2 ids.
	for(var i = 0, len = ids.length; i < len; ++i) {
		var cs = this.treedRegionL3Centroids[ids[i]] || [];
		ids = ids.concat(getAllIds(cs));
	}

	// Push ids for village ids.
	ids = ids.concat(searcher(this.villageCentroids, input));

	return ids;
}

Gis3d.G3dModel.prototype.addRegion = function(input) {
	this.modifyList(input, 'add', 'white');
	this.modifyList(input, 'remove', 'black');
	return this;
}

Gis3d.G3dModel.prototype.removeRegion = function(input) {
	this.modifyList(input, 'remove', 'white');
	this.modifyList(input, 'add', 'black');
	return this;
}

Gis3d.G3dModel.prototype.onlyRegion = function(input) {
	this.modifyList(input, 'only');
	return this;
}

Gis3d.G3dModel.prototype.exceptRegion = function(input) {
	this.modifyList(input, 'except');
	return this;
}

Gis3d.G3dModel.prototype.modifyList = function(input, opt_operation, opt_list) {
	var ids = this.searchIds(input);
	if('only' === opt_operation) {
		this.filterMode = 'only';
		this.whiteIdsList = [];
		operation = 'add';
		list = 'white';
	} else if('except' === opt_operation) {
		this.filterMode = 'except';
		this.blackIdsList = [];
		operation = 'add';
		list = 'black';
	} else {
		operation = opt_operation;
		list = opt_list;
	}
	for(var i = 0, len = ids.length; i < len; ++i) {
		this.modifyListById(ids[i], operation, list);
	}
	this.data.makeData();
	return this;
}

Gis3d.G3dModel.prototype.modifyListById = function(id, opt_operation, opt_list) {
	if (!(typeof id === 'string') && !(id instanceof String)) {
		console.error('Gis3d.G3dModel.addBlackListById(): Wrong input.');
		return false;
	}
	var list = ('white' === opt_list) ? this.whiteIdsList : this.blackIdsList;
	if('remove' === opt_operation) {
		var index = list.indexOf(id);
		if(-1 != index) { list.splice(index, 1); }
	} else {
		if(-1 === list.indexOf(id)) { list.push(id); }
	}
	return this;
}

Gis3d.G3dModel.prototype.reqCentroids = function() {
	if(0 === this.countyCentroids.length) {
		this.countyCentroids = this.county.getCentroids();
	}
	if(0 === this.townCentroids.length) {
		this.town.getCentroids(); // Vital to enable Fx get centroids.
		this.townCentroids = this.town.getCentroids();
		this.setRegionMode(this.regionMode);
	}
	if(0 === this.legireaCentroids.length) {
		this.legirea.getCentroids(); // Vital to enable Fx get centroids.
		this.legireaCentroids = this.legirea.getCentroids();
		this.setRegionMode(this.regionMode);
	}
	if(0 === this.villageCentroids.length) {
		this.villageCentroids = this.village.getCentroids();
	}
	return this;
}

Gis3d.G3dModel.prototype.reqTreedCentroids = function() {
	var treeRegion = function(region, by) {
		var treeded = [];
		for(var i = 0, len = region.length; i < len; ++i) {
			if(undefined === treeded[region[i][by]]) {
				treeded[region[i][by]] = [];
			}
			treeded[region[i][by]].push(region[i]);
		}
		return treeded;
	}
	this.reqCentroids();
	if(0 === this.treedRegionL2Centroids.length) {
		this.treedRegionL2Centroids = treeRegion(this.regionL2Centroids, 'county_id');
	}
	if(0 === this.treedRegionL3Centroids.length) {
		this.treedRegionL3Centroids
			= treeRegion(this.villageCentroids, this.regionMode + '_id');
	}
	return this;
}

Gis3d.G3dModel.prototype.getUsingCentroids = function() {
	this.reqCentroids();
	this.reqTreedCentroids();
	var unselectedCounties = [];
	for(var i = 0, len = this.countyCentroids.length; i < len; ++i) {
		if(this.selectedCountyId != this.countyCentroids[i].id) {
			unselectedCounties.push(this.countyCentroids[i]);
		}
	}

	var unseletedRegionL2 = [];
	var usingRegionL2 = this.treedRegionL2Centroids[this.selectedCountyId] || [];
	for(var i = 0, len = usingRegionL2.length; i < len; ++i) {
		if(this.selectedRegionL2Id != usingRegionL2[i].id) {
			unseletedRegionL2.push(usingRegionL2[i]);
		}
	}

	var result = unselectedCounties;
	if(0 != unseletedRegionL2.length) {
		result = result.concat(unseletedRegionL2);
	}
	if(undefined != this.treedRegionL3Centroids[this.selectedRegionL2Id]) {
		result = result.concat(this.treedRegionL3Centroids[this.selectedRegionL2Id]);
	}
	return result;
}

Gis3d.G3dModel.prototype.getModelById = function(id) {
	if (!(typeof id === 'string') && !(id instanceof String)) {
		console.error('Gis3d.G3dModel.getModelById(): Wrong input.');
		return false;
	}
	var isCounty = false;
	for(var i = 0, len = this.countyCentroids.length; i < len; ++i) {
		if(id === this.countyCentroids[i].id) {
			isCounty = true;
		}
	}
	if(!isCounty) {
		var isTown = false;
		for(var i = 0, len = this.townCentroids.length; i < len; ++i) {
			if(id === this.townCentroids[i].id) {
				isTown = true;
			}
		}
	}
	if(!isLegirea) {
		var isLegirea = false;
		for(var i = 0, len = this.legireaCentroids.length; i < len; ++i) {
			if(id === this.legireaCentroids[i].id) {
				isLegirea = true;
			}
		}
	}
	var model = null;
	if(isCounty) {
		model = this.county.getModelById(id);
	} else if(isTown) {
		model = this.town.getModelById(id);
	} else if(isLegirea) {
		model = this.legirea.getModelById(id);
	} else {
		model = this.village.getModelById(id);
	}
	return model;
}

Gis3d.G3dModel.prototype.applyRegionData = function() {
	var data = this.data.getData();
	var county = data.county;
	var town = data.town;
	var legirea = data.legirea;
	var village = data.village;

	this.filterDatas(county);
	this.filterDatas(town);
	this.filterDatas(legirea);
	this.filterDatas(village);

	this.county.applyRegionDatas(county);
	this.town.applyRegionDatas(town);
	this.legirea.applyRegionDatas(legirea);
	this.village.applyRegionDatas(village);
	return this;
}

Gis3d.G3dModel.prototype.filterDatas = function(datas) {
	if('only' != this.filterMode) {
		for(var i = 0, len = datas.length; i < len; ++i) {
			if(-1 != this.blackIdsList.indexOf(datas[i].id)) {
				datas[i].data = 0;
			}
		}
	} else {
		for(var i = 0, len = datas.length; i < len; ++i) {
			if(-1 === this.whiteIdsList.indexOf(datas[i].id)) {
				datas[i].data = 0;
			}
		}
	}
	return datas;
}

Gis3d.G3dModel.prototype.updateWraps = function() {
	if(this.WRAPS_LIFETIME > (Date.now() - this.lastWrapsTime)) {
		return this;
	}
	this.eventCenter.registListener(
		this.wrapServer, 'wrapsgot',
		this.doWrapsGot,
		this
	);
	this.wrapServer.reqWraps();
	return this;
}

Gis3d.G3dModel.prototype.doWrapsGot = function(e) {
	this.lastWrapsTime = Date.now();
	this.wraps = e.data;
	this.eventCenter.castEvent(this, 'wrapsgot', this.wraps);
	return this;
}

Gis3d.G3dModel.prototype.getUnitedModel = function() {
	if(this.UNITED_MODEL_LIFETIME > (Date.now() - this.lastUnitedModelTime)) {
		return this.unitedModel;
	}
	if((0 != this.SHUFFLE_TIME) && (this.SHUFFLE_TIME < (Date.now() - this.lastShuffleTime))) {
		this.county.shuffleHeights();
		this.lastShuffleTime = Date.now();
	}
	this.updateWraps();
	this.applyRegionData();
	var model = new Gis3d.Shape.UnitedShape();
	var centroids = this.getUsingCentroids();
	var ids = [];
	for(var i = 0, len = centroids.length; i < len; ++i) {
		ids[i] = centroids[i].id;
	}
	for(var i = 0, len = ids.length; i < len; ++i) {
		var m = this.getModelById(ids[i]);
		if(undefined != m) {
			Gis3d.Shape.proceedHeight(m);
			model.add(m);
		}
	}

	this.unitedModel = model;
	this.lastUnitedModelTime = Date.now();
	return model;
}

//* vim: syntax=javascript
//* vim: dictionary=~/.vim/dict/javascript.dict

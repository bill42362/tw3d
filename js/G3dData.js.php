<?php
include_once('la/LinearAlgebra.js.php');
include_once('EventCenter.js.php');
include_once('G3dDataServer.js.php');
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dData = function() {
	this.eventCenter = Gis3d.eventCenter;
	this.server = new Gis3d.G3dDataServer();
	this.uniaryOperations = [
		{op: this.duplicateDataById, pattern: /^\s*\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\s*$/i, nSubs: 1},
		{op: this.doNothingData, pattern: /^\s*\((.*)\s*\)\s*$/i, nSubs: 1},
		{op: this.sqrtData, pattern: /^\s*sqrt\(\s*(.*)\s*\)\s*$/i, nSubs: 1},
		{op: this.logData, pattern: /^\s*log\(\s*(.*)\s*\)\s*$/i, nSubs: 1},
		{op: this.normalizeData, pattern: /^\s*normal[ize]*\(\s*(.*)\s*\)\s*$/i, nSubs: 1}
	];
	this.binaryOperations = [
		{op: this.divData, pattern: /^\s*(.*)\s+\/\s+(.*)\s*$/i, nSubs: 2},
		{op: this.multipleData, pattern: /^\s*(.*)\s+\*\s+(.*)\s*$/i, nSubs: 2},
		{op: this.sumData, pattern: /^\s*(.*)\s+\+\s+(.*)\s*$/i, nSubs: 2},
		{op: this.minusData, pattern: /^\s*(.*)\s+\-\s+(.*)\s*$/i, nSubs: 2}
	];

	this.usingDataIds = ['7273834f-6f3c-4620-8853-d6cf770d1a88'];
	this.datas = [];
	this.dataFormula = ' sqrt(  normalize( 7273834f-6f3c-4620-8853-d6cf770d1a88  )  )',
	this.data = {county: [], town: [], legirea: [], village: []};

	this.lastRegionDataTimes = [];
	this.lastRegionDataReqTimes = [];
	return this;
}
Gis3d.G3dData.unitTest = function() {
	var data = new Gis3d.G3dData();
	var formulas = [
		' normalize( sqrt(  89a6f5d2-5df0-4d29-9553-cb139a8d3bd5  / e17bbd54-4d82-49cc-a8bf-7c95ed08dd7d  )  )',
		' normalize( sqrt(  89a6f5d2-5df0-4d29-9553-cb139a8d3bd5  ) / sqrt( e17bbd54-4d82-49cc-a8bf-7c95ed08dd7d  )  )',
		' sqrt(  normalize( e17bbd54-4d82-49cc-a8bf-7c95ed08dd7d  )  )',
		'  e17bbd54-4d82-49cc-a8bf-7c95ed08dd7d  ',
		'(758644aa-a637-4865-bf22-8a11fccdba27 - 682f41aa-03e7-4190-b229-49509021ec67) / 3b54fda0-1dd1-4a66-9191-7b1394f30247'
	];
	var uuidReg = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/ig;
	for(var i = 0; i < formulas.length; ++i) {
		var usingIds = [];
		var ids = null;
		while(ids = uuidReg.exec(formulas[i])) {
			usingIds.push(ids[0]);
		}
		console.log('formula:', formulas[i]);
		console.log(usingIds);
		console.log('ops:', data.readFormula(formulas[i]));
	}
	return true;
}

Gis3d.G3dData.prototype.SHUFFLE_TIME = 0; // Set to 0 for cancel shuffling.
Gis3d.G3dData.prototype.REGION_DATA_REQ_PERIOD = Number(5000);

Gis3d.G3dData.prototype.reset = function() {
	this.datas = [];
	this.data = {county: [], town: [], legirea: [], village: []};
	this.usingDataIds = ['7273834f-6f3c-4620-8853-d6cf770d1a88'];
	this.dataFormula = ' sqrt(  normalize( 7273834f-6f3c-4620-8853-d6cf770d1a88  )  )',
	this.lastRegionDataTimes = [];
	this.lastRegionDataReqTimes = [];
	return this;
}

Gis3d.G3dData.prototype.setFormula = function(formula) {
	if (!(typeof formula === 'string') && !(formula instanceof String)) {
		console.error('Gis3d.G3dData.setFormula(): Wrong input.');
		return false;
	}
	this.dataFormula = formula;
	var uuidReg = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/ig;
	var usingIds = [];
	var ids = null;
	while(ids = uuidReg.exec(formula[i])) {
		usingIds.push(ids[0]);
	}
	this.usingDataIds = usingIds;
	for(var i = 0, len = usingIds.length; i < len; ++i) {
		this.reqDataById(usingIds[i]);
	}
	this.makeData();
	return this;
}

Gis3d.G3dData.prototype.getData = function() {
	for(var i = 0, len = this.usingDataIds.length; i < len; ++i) {
		this.reqDataById(this.usingDataIds[i]);
	}
	return this.data;
}

Gis3d.G3dData.prototype.reqDataById = function(id) {
	if (!(typeof id === 'string') && !(id instanceof String)) {
		console.error('Gis3d.G3dData.reqDataById(): Wrong input.');
		return false;
	}
	if(this.REGION_DATA_REQ_PERIOD > (Date.now() - this.lastRegionDataReqTimes[id])) {
		return this.datas[id];
	}
	this.lastRegionDataReqTimes[id] = Date.now();

	this.eventCenter.registListener(
		this.server, 'datanochange',
		this.doDataNoChange,
		this
	);
	this.eventCenter.registListener(
		this.server, 'datagot',
		this.doDataGot,
		this
	);
	this.server.reqDataById(id, this.lastRegionDataTimes[id]);
	return this.datas[id];
}

Gis3d.G3dData.prototype.doDataNoChange = function(e) {
	console.log('Gis3d.G3dData.doDataNoChange(): No change.');
	return this;
}

Gis3d.G3dData.prototype.doDataGot = function(e) {
	var id = e.data.wrapId;
	this.lastRegionDataTimes[id] = Date.now();
	this.datas[id] = e.data;
	this.makeData();
	return this;
}

Gis3d.G3dData.prototype.readFormula = function(formula) {
	if (!(typeof formula === 'string') && !(formula instanceof String)) {
		console.error('Gis3d.G3dData.readFormula(): Wrong input.');
		return false;
	}
	formula = formula.trim();
	var ops = [];
	var uos = this.uniaryOperations;
	var results = [];
	var remainds = '';
	for(var i = 0, len = uos.length; i < len; ++i) {
		if(uos[i].pattern.test(formula)) {
			ops.push(uos[i]);
			var r = uos[i].pattern.exec(formula)[1];
			if(undefined === r) {
				results.push({ops: [formula], remainds: ''});
			} else {
				results.push(this.readFormula(r));
			}
		}
	}
	if(results[0] && (/^[^\(]*\)/i.test(results[0].remainds))) {
		ops = [];
		results = [];
	}
	var bos = this.binaryOperations;
	if(0 === results.length) {
		for(var i = 0, len = bos.length; i < len; ++i) {
			if(bos[i].pattern.test(formula)) {
				var r1 = bos[i].pattern.exec(formula)[1];
				var r2 = bos[i].pattern.exec(formula)[2];
				var rf1 = this.readFormula(r1);
				var rf2 = this.readFormula(r2);
				if((0 != rf1.ops.length) && ( 0 != rf2.ops.length)) {
					ops.push(bos[i]);
					results.push(rf1);
					results.push(rf2);
				}
			}
		}
	}
	if(0 != results.length) {
		for(var i = 0, len = results.length; i < len; ++i) {
			ops = ops.concat(results[i].ops);
			remainds = remainds.concat(results[i].remainds);
		}
	} else {
		remainds = formula;
	}
	return {ops: ops, remainds: remainds.trim()};
}

Gis3d.G3dData.prototype.makeData = function(opt_formula) {
	var formula = opt_formula || this.dataFormula;
	if (!(typeof formula === 'string') && !(formula instanceof String)) {
		console.error('Gis3d.G3dData.makeData(): Wrong input.');
		return false;
	}
	this.usingDataIds = [];
	var ops = this.readFormula(formula).ops;
	var buffer = [];
	while(0 != ops.length) {
		var data = ops.pop();
		if(undefined != data.op) {
			this.op_ = data.op;
			if(1 === data.nSubs) {
				buffer.push(this.op_(buffer.pop()));
			} else if(2 === data.nSubs) {
				buffer.push(this.op_(buffer.pop(), buffer.pop()));
			}
			this.op_ = undefined;
		} else {
			var wrapId = data;
			this.usingDataIds.push(wrapId);
			buffer.push(wrapId);
		}
	}
	this.data = buffer.pop();
	return this;
}

Gis3d.G3dData.prototype.duplicateDataById = function(id) {
	if (!(typeof id === 'string') && !(id instanceof String)) {
		console.error('Gis3d.G3dData.duplicateDataById(): Wrong input.');
		return false;
	}
	var duper = function(from, to) {
		for(var i = 0, len = from.length; i < len; ++i) {
			var d = {id: null, data: null};
			var id = from[i].id;
			d.id = id;
			d.numId = Number(id.replace(/\D/g, '')) || Math.random()*1e17;
			d.data = Number(from[i].data);
			to.push(d);
		}
		return to;
	};
	var source = this.reqDataById(id);
	var data = {
		county: [], town: [], legirea: [], village: [],
		wrapId: ''
	};
	if(undefined != source) {
		data.wrapId = source.wrapId;
		duper(source.county, data.county);
		duper(source.town, data.town);
		duper(source.legirea, data.legirea);
		duper(source.village, data.village);
	}
	return data;
}

Gis3d.G3dData.prototype.indexData = function(data) {
	var indexed = [];
	for(var i = 0, len = data.length; i < len; ++i) {
		indexed[data[i].id] = Number(data[i].data);
	}
	return indexed;
}

Gis3d.G3dData.prototype.doNothingData = function(data) {
	return data;
}

Gis3d.G3dData.prototype.sumData = function(data1, data2) {
	var sorter = function(a, b) { return a.numId - b.numId; };
	var merger = function(r1, r2) {
		r1.sort(sorter), r2.sort(sorter);
		var id1 = 0, i2 = 0, dataBuffer = [];
		for(var i = 0, len = r1.length; i < len; ++i) {
			id1 = r1[i].numId;
			while((i2 < r2.length) && (r2[i2].numId < id1)) {
				dataBuffer.push(r2[i2]);
				++i2;
			}
			if((i2 < r2.length) && (r2[i2].numId === id1)) {
				r1[i].data = Number(r1[i].data) + Number(r2[i2].data);
				++i2;
			}
		}
		return r1.concat(dataBuffer);
	};
	var county = merger(data1.county, data2.county);
	var town = merger(data1.town, data2.town);
	var legirea = merger(data1.legirea, data2.legirea);
	var village = merger(data1.village, data2.village);
	return {county: county, town: town, legirea: legirea, village: village, wrapId: 'computed'};
}

Gis3d.G3dData.prototype.minusData = function(data1, data2) {
	var sorter = function(a, b) { return a.numId - b.numId; };
	var merger = function(r1, r2) {
		r1.sort(sorter), r2.sort(sorter);
		var id1 = 0, i2 = 0, dataBuffer = [];
		for(var i = 0, len = r1.length; i < len; ++i) {
			id1 = r1[i].numId;
			while((i2 < r2.length) && (r2[i2].numId < id1)) {
				dataBuffer.push({id: r2[i2].id, numId: r2[i2].numId, data: -Number(r2[i2].data)});
				++i2;
			}
			if((i2 < r2.length) && (r2[i2].numId === id1)) {
				r1[i].data = Number(r1[i].data) - Number(r2[i2].data);
				++i2;
			}
		}
		return r1.concat(dataBuffer);
	};
	var county = merger(data1.county, data2.county);
	var town = merger(data1.town, data2.town);
	var legirea = merger(data1.legirea, data2.legirea);
	var village = merger(data1.village, data2.village);
	return {county: county, town: town, legirea: legirea, village: village, wrapId: 'computed'};
}

Gis3d.G3dData.prototype.multipleData = function(data1, data2) {
	var sorter = function(a, b) { return a.numId - b.numId; };
	var merger = function(r1, r2) {
		r1.sort(sorter), r2.sort(sorter);
		var id1 = 0, i2 = 0, dataBuffer = [];
		for(var i = 0, len = r1.length; i < len; ++i) {
			id1 = r1[i].numId;
			// Only I2 has.
			while((i2 < r2.length) && (r2[i2].numId < id1)) {
				dataBuffer.push({id: r2[i2].id, numId: r2[i2].numId, data: Number(0)});
				++i2;
			}
			// Both I2 and I1 has.
			if((i2 < r2.length) && (r2[i2].numId === id1)) {
				r1[i].data = Number(r1[i].data) * Number(r2[i2].data);
				++i2;
			} else { // Only I1 has.
				r1[i].data = Number(0);
			}
		}
		return r1.concat(dataBuffer);
	};
	var county = merger(data1.county, data2.county);
	var town = merger(data1.town, data2.town);
	var legirea = merger(data1.legirea, data2.legirea);
	var village = merger(data1.village, data2.village);
	return {county: county, town: town, legirea: legirea, village: village, wrapId: 'computed'};
}

Gis3d.G3dData.prototype.divData = function(data1, data2) {
	var sorter = function(a, b) { return a.numId - b.numId; };
	var merger = function(r1, r2) {
		r1.sort(sorter), r2.sort(sorter);
		var id1 = 0, i2 = 0, dataBuffer = [];
		for(var i = 0, len = r1.length; i < len; ++i) {
			id1 = r1[i].numId;
			// Only I2 has.
			while((i2 < r2.length) && (r2[i2].numId < id1)) {
				console.log('Zero 2');
				dataBuffer.push({id: r2[i2].id, numId: r2[i2].numId, data: Number(0)});
				++i2;
			}
			// Both I2 and I1 has.
			if((i2 < r2.length) && (r2[i2].numId === id1)) {
				r1[i].data = Number(r1[i].data) / (Number(r2[i2].data) || Infinity);
				++i2;
			} else { // Only I1 has.
				console.log('Zero 1');
				r1[i].data = Number(0);
			}
		}
		return r1.concat(dataBuffer);
	};
	var county = merger(data1.county, data2.county);
	var town = merger(data1.town, data2.town);
	var legirea = merger(data1.legirea, data2.legirea);
	var village = merger(data1.village, data2.village);
	return {county: county, town: town, legirea: legirea, village: village, wrapId: 'computed'};
}

Gis3d.G3dData.prototype.logData = function(data) {
	var county = data.county;
	var town = data.town;
	var legirea = data.legirea;
	var village = data.village;
	for(var i = 0, len = county.length; i < len; ++i) {
		county[i].data = Math.log(Number(county[i].data) || 1);
	}
	for(var i = 0, len = town.length; i < len; ++i) {
		town[i].data = Math.log(Number(town[i].data) || 1);
	}
	for(var i = 0, len = legirea.length; i < len; ++i) {
		legirea[i].data = Math.log(Number(legirea[i].data) || 1);
	}
	for(var i = 0, len = village.length; i < len; ++i) {
		village[i].data = Math.log(Number(village[i].data) || 1);
	}
	return data;
}

Gis3d.G3dData.prototype.sqrtData = function(data) {
	var county = data.county;
	var town = data.town;
	var legirea = data.legirea;
	var village = data.village;
	for(var i = 0, len = county.length; i < len; ++i) {
		county[i].data =
			Math.sqrt(Number(county[i].data))
			|| -Math.sqrt(-Number(county[i].data));
	}
	for(var i = 0, len = town.length; i < len; ++i) {
		town[i].data =
			Math.sqrt(Number(town[i].data))
			|| -Math.sqrt(-Number(town[i].data));
	}
	for(var i = 0, len = legirea.length; i < len; ++i) {
		legirea[i].data =
			Math.sqrt(Number(legirea[i].data))
			|| -Math.sqrt(-Number(legirea[i].data));
	}
	for(var i = 0, len = village.length; i < len; ++i) {
		village[i].data =
			Math.sqrt(Number(village[i].data))
			|| -Math.sqrt(-Number(village[i].data));
	}
	return data;
}

Gis3d.G3dData.prototype.normalizeData = function(data) {
	var county = data.county;
	var town = data.town;
	var legirea = data.legirea;
	var village = data.village;
	var global_max = 1;
	for(var i = 0, len = county.length; i < len; ++i) {
		county[i].data = Number(county[i].data);
	}
	county = county.sort(function(a, b) {
		return b.data - a.data;
	});
	if(county && county[0] && county[0].data) {
		global_max = county[0].data*2;
		for(var i = 0, len = county.length; i < len; ++i) {
			county[i].data = county[i].data/global_max;
		}
	}
	for(var i = 0, len  = town.length; i < len; ++i) {
		town[i].data = Number(town[i].data)/global_max;
	}
	for(var i = 0, len  = legirea.length; i < len; ++i) {
		legirea[i].data = Number(legirea[i].data)/global_max;
	}
	for(var i = 0, len  = village.length; i < len; ++i) {
		village[i].data = Number(village[i].data)/global_max;
	}
	return data;
}

//* vim: syntax=javascript
//* vim: dictionary=~/.vim/dict/javascript.dict

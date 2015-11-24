<?php
header('Content-Type: text/javascript; charset=utf-8');
include_once('la/LinearAlgebra.js.php');
include_once('XMLReq.js.php');
include_once('EventCenter.js.php');
include_once('ElementPlugin.js.php');
include_once('ShaderProgram.js.php');
include_once('Shape.js.php');
include_once('G3dModel.js.php');
include_once('G3dWraps.js.php');
include_once('CommandHistory.js.php');
include_once('CommandListener.js.php');
include_once('G3dFPSComputer.js.php');
include_once('G3dFPSViewer.js.php');
include_once('G3dDataViewer.js.php');
include_once('G3dWrapMaker.js.php');
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.object = function() {
	this.model = new Gis3d.G3dModel();
	Gis3d.eventCenter.registListener(
		this.model, 'selectionchanged', this.doSelectionChanged, this
	);

	this.frame = document.createElement('div');
	this.frame.className = 'gis3d';
	this.canvas2d = document.createElement('canvas');
	this.canvas2d.className = 'canvas2d';
	this.canvas3d = document.createElement('canvas');
	this.canvas3d.className = 'canvas3d';
	this.canvas3d.textContent = "Sorry but your browser don't support WebGL. :(";
	this.ui = document.createElement('div');
	this.ui.className = 'ui';
	this.ui.holder = this;
	this.frame.appendChild(this.canvas3d);
	this.frame.appendChild(this.canvas2d);
	this.frame.appendChild(this.ui);

	this.fpsComputer = new Gis3d.G3dFPSComputer();
	this.fps = new Gis3d.G3dFPSViewer();
	this.fps.bindTo(this.ui);
	this.dataViewer = new Gis3d.G3dDataViewer();
	this.dataViewer.bindTo(this.ui);

	this.keyboardTracker = new Gis3d.ElementPlugin.KeyboardTracker();
	this.keyboardTracker.bindListeners(document);

	this.mouseTracker = new Gis3d.ElementPlugin.MouseTracker();
	this.mouseTracker.scrollingEnabled = false;
	this.mouseTracker.bindListeners(this.ui);
	Gis3d.eventCenter.registListener(
		this.mouseTracker, 'mousemove', this.doMouseMove, this
	);
	Gis3d.eventCenter.registListener(
		this.mouseTracker, 'mousedrag', this.doMouseDrag, this
	);
	Gis3d.eventCenter.registListener(
		this.mouseTracker, 'mousewheel', this.doMouseWheel, this
	);
	return this;
}; Gis3d.object.prototype = Gis3d.prototype;

Gis3d.eventCenter = new Gis3d.EventCenter();
Gis3d.history = new Gis3d.CommandHistory();
Gis3d.baseMatrix = new LaMatrix();

Gis3d.unitTest = function() {
	var gis3d = new Gis3d();
	gis3d.bindTo(document.getElementById('trunk'));
	gis3d.ui.addEventListener('click', gis3d.showFrame, false);
	window.gis = gis3d;
	return true;
}

Gis3d.prototype.ajaxRequestMaker = new Gis3d.XMLReq();
Gis3d.prototype.data2D = {
	center: {x: 120.59, y: 23.58},
	max: {x: 1.92, y: 3.4},
	axisStep: null,
	model: {centroids: []}
};
Gis3d.prototype.data3D = {
	world: new LaMatrix(),
	eye: new LaVector(120.45758, 23.47669, 4.5, 1.0),
	lookAt: new LaVector(120.45758, 23.47669, 0.0, 1.0),
	up: new LaVector(0.0, 1.0, 0.0, 1.0),
	view: new LaMatrix(),
	fieldOfView: 45.0,
	aspect: 9/16,
	zNear: 0.001,
	zFar: 100.0,
	projection: new LaMatrix()
};
Gis3d.prototype.xzAxisMesh = new Gis3d.Shape.XYAxisMesh();

Gis3d.prototype.bindTo = function(elem) {
	elem.appendChild(this.frame);
	return this;
}

Gis3d.prototype.addRegion = function(input) {
	this.model.addRegion(input);
	return this;
}

Gis3d.prototype.removeRegion = function(input) {
	this.model.removeRegion(input);
	return this;
}

Gis3d.prototype.onlyRegion = function(input) {
	this.model.onlyRegion(input);
	return this;
}

Gis3d.prototype.exceptRegion = function(input) {
	this.model.exceptRegion(input);
	return this;
}

Gis3d.prototype.setRegionMode = function(_mode) {
	var mode = ('legirea' === _mode) ? 'legirea' : 'town';
	this.model.setRegionMode(mode);
	return this;
}

Gis3d.prototype.getCountyNames = function() {
	var cIDB = this.model;
	var centroids = cIDB.getUsingCentroids();
	if(0 != centroids.length) {
		this.data2D.model.centroids = centroids;
	}
	return centroids;
}

Gis3d.prototype.getCountyModels = function() {
	var cIDB = this.model;
	var model = cIDB.getUnitedModel();
	this.data3D.countyModel = model;
	return model;
}

Gis3d.prototype.setupCanvas2D = function() {
	var ctx = this.canvas2d.getContext('2d');
	ctx.canvas.width = ctx.canvas.clientWidth;
	ctx.canvas.height = ctx.canvas.clientHeight;
	return this;
}

Gis3d.prototype.draw2DMesh = function() {
	var ctx = this.canvas2d.getContext('2d');
	var width = ctx.canvas.clientWidth;
	var height = ctx.canvas.clientHeight;

	ctx.strokeStyle = "rgba(154, 128, 102, 128)";
	ctx.lineWidth = 2.0;
	ctx.beginPath();
	for(var i = 0; i < width; i += 100) {
		ctx.moveTo(i, 0);
		ctx.lineTo(i, height);
	}
	for(var i = 0; i < height; i += 100) {
		ctx.moveTo(0, i);
		ctx.lineTo(width, i);
	}
	ctx.stroke();

	ctx.fillStyle = "rgba(154, 128, 102, 128)";
	for(var i = 0; i < width; i += 100) {
		ctx.fillText(i, i + 2, 15);
		ctx.fillText(i, i + 2, height);
	}
	for(var i = 0; i < height; i += 100) {
		ctx.fillText(i, 1, i - 2);
		ctx.fillText(i, width - 50, i - 2);
	}
	return this;
}

Gis3d.prototype.draw2DPositions = function() {
	var ctx = this.canvas2d.getContext('2d');
	ctx.strokeStyle = 'red';

	var data3D = this.data3D;
	var wvp = data3D.world.getMul(data3D.view).getMul(data3D.projection);

	this.getCountyNames();
	var centroids = this.data2D.model.centroids;
	var x = 0, y = 0, vName = 'Hi', pos = null;
	var crossSize = Number(3.0);
	ctx.beginPath();
	for(var i = 0, len = centroids.length; i < len; ++i) {
		var c = centroids[i];
		if(null != c.id) {
			pos = new LaVector(c.center_x, c.center_y, 0, 1);
			pos = pos.transformTo2D(wvp, ctx.canvas);
			ctx.moveTo(pos.array[0] - crossSize, pos.array[1]);
			ctx.lineTo(pos.array[0] + crossSize, pos.array[1]);
			ctx.moveTo(pos.array[0], pos.array[1] - crossSize);
			ctx.lineTo(pos.array[0], pos.array[1] + crossSize);
		}
	}
	ctx.stroke();
	return this;
}

Gis3d.prototype.draw2DTexts = function() {
	var makeFontSize = function(name, opt_width, opt_height) {
		var max_font_size = Number(13);
		var width = Number(opt_width) || 3*max_font_size;
		var height = Number(opt_height) || max_font_size;
		var font_x = width / name.length;
		return Math.min(font_x, height).toFixed();
	};

	var ctx = this.canvas2d.getContext('2d');
	ctx.canvas.width = ctx.canvas.clientWidth;
	var max_font_size = '13';
	var min_font_size = 10;
	var font_str = '_FONT_SIZE_px Arial, "文泉驛正黑", "WenQuanYi Zen Hei",'
				+ '"儷黑 Pro", "LiHei Pro", "微軟正黑體", '
				+ '"Microsoft JhengHei", "標楷體", DFKai-SB, sans-serif';
	ctx.fillStyle = 'rgba(154, 58, 5, 128)';

	var data3D = this.data3D;
	var wvp = data3D.world.getMul(data3D.view).getMul(data3D.projection);
	var left = new LaVector(this.data3D.lookAt.array);
	var right = new LaVector(left.array);
	var invSqrtTwo = Math.sqrt(0.5);
	left.array[0] -= invSqrtTwo; left.array[1] -= invSqrtTwo;
	right.array[0] += invSqrtTwo; right.array[1] += invSqrtTwo;
	left = left.transformTo2D(wvp, ctx.canvas);
	right = right.transformTo2D(wvp, ctx.canvas);
	var scale = right.getSub(left).getLength();

	this.getCountyNames();
	var centroids = this.data2D.model.centroids;
	var vName = 'Hi', size = max_font_size, pos = null;
	var halfNameWidth = 0, halfNameHeight = 0;
	for(var i = 0, len = centroids.length; i < len; ++i) {
		var c = centroids[i];
		if(null != c.id) {
			pos = new LaVector(c.center_x, c.center_y, 0, 1);
			pos = pos.transformTo2D(wvp, ctx.canvas);
			vName = c.name;
			size = Math.min(makeFontSize(vName, scale*c.width, scale*c.height), max_font_size);
			if(!(min_font_size > size)) {
				ctx.font = font_str.replace(/_FONT_SIZE_/, size);
				halfNameWidth = 0.5*size*vName.length;
				halfNameHeight = 0.5*size;
				ctx.fillText(vName, pos.array[0] - halfNameWidth, pos.array[1] + halfNameHeight);
			}
		}
	}
	return this;
}

Gis3d.prototype.draw3DShapes = function() {
	var ctx = this.ctx3d;
	if(undefined === ctx) {
		return this;
	}
	ctx.canvas.width = ctx.canvas.clientWidth;
	ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
	this.linesColorShader.setView(this.data3D.view);
	this.linesColorShader.setModel(this.xzAxisMesh);
	this.linesColorShader.draw();

	this.blendLightShader.setView(this.data3D.view);
	this.blendLightShader.setWorld(new LaMatrix());
	this.getCountyModels();
	this.blendLightShader.setUnitedModel(this.data3D.countyModel);
	this.blendLightShader.draw();

	if(undefined != this.data3D.pointer) {
		this.linesColorShader.setModel(this.data3D.pointer);
		this.linesColorShader.draw();
	}
	return this;
}

Gis3d.prototype.showFrame = function(e) {
	var self = null;
	if((undefined != e) && (e.target.holder instanceof Gis3d)) {
		self = e.target.holder;
	} else if (this instanceof Gis3d) {
		self = this;
	}
	if(null === self) {
		return this;
	}
	// Set canvas size with the real size from CSS.
	self.ctx2d = self.canvas2d.getContext('2d');
	self.ctx2d.canvas.width = self.ctx2d.canvas.clientWidth;
	self.ctx2d.canvas.height = self.ctx2d.canvas.clientHeight;

	self.canvas3d.width = self.canvas3d.clientWidth;
	self.canvas3d.height = self.canvas3d.clientHeight;
	self.ctx3d = self.canvas3d.getContext('webgl') || self.canvas3d.getContext('experimental-webgl');
	self.ctx3d.canvas.width = self.ctx3d.canvas.clientWidth;
	self.ctx3d.canvas.height = self.ctx3d.canvas.clientHeight;

	self.data3D.view = Gis3d.baseMatrix.makeViewMatrix(
		self.data3D.eye, self.data3D.lookAt, self.data3D.up
	);
	self.data3D.projection = Gis3d.baseMatrix.makeProjectionMatrix(
		self.data3D.fieldOfView, self.data3D.aspect, self.data3D.zNear, self.data3D.zFar
	);

	self.blendLightShader = new Gis3d.ShaderProgram.BlendLight(self.ctx3d);
	self.blendLightShader.setView(self.data3D.view);
	self.blendLightShader.setProjection(self.data3D.projection);

	self.linesColorShader = new Gis3d.ShaderProgram.LinesColor(self.ctx3d);
	self.linesColorShader.setWorld(new LaMatrix());
	self.linesColorShader.setView(self.data3D.view);
	self.linesColorShader.setProjection(self.data3D.projection);
	self.linesColorShader.setModel(self.xzAxisMesh);

	self.startRender();
	return self;
}

Gis3d.prototype.startRender = function() {
	var self = this;
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame
		|| window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	var render = function(timestamp) {
		if(self.rendering) {
			requestAnimationFrame(render);
			if(self.ctx2d) {
				self.draw2DTexts();
			}
			if(self.ctx3d) { self.draw3DShapes(timestamp); }
			self.fpsComputer.addTime();
		} else {
			self.fpsComputer.addPause();
		}
		self.fps.setTime(self.fpsComputer.getFPS());
	}
	if(!self.renderID) {
		self.renderID = requestAnimationFrame(render);
		self.rendering = true;
	}
	return this;
}

Gis3d.prototype.stopRender = function() {
	var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame
		|| window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
	if(this.renderID && this.rendering) {
		cancelAnimationFrame(this.renderID);
		this.renderID = undefined;
		this.rendering = false;
		this.fpsComputer.addPause();
	}
	return this;
}

Gis3d.prototype.getPointed = function(objs, point) {
	var pointeds = [];
	for(var i = 0, len = objs.length; i < len; ++i) {
		var ori = new LaVector(objs[i].origin.array);
		objs[i].origin = ori;
		var size = new LaVector(objs[i].size.array);
		objs[i].size = size;
		if(true === ori.insideCube(size, point)) {
			pointeds.push(objs[i]);
		}
	}
	if(1 < pointeds.length) {
		var minL = Infinity;
		var minOne = null;
		for(var i = 0; i < pointeds.length; ++i) {
			var p = pointeds[i];
			var center = new LaVector(p.center_x, p.center_y, 0, 1);
			var length = center.getSub(point).getLength();;
			if(length < minL) {
				minL = length;
				minOne = p;
			}
		}
		pointeds = [minOne];
	}
	return pointeds[0];
}

Gis3d.prototype.doSelectionChanged = function(e) {
	this.dataViewer.setDatas(e.data);
	return this;
}

Gis3d.prototype.doMouseMove = function(e) {
	var pos = new LaVector(e.data.axis.x, e.data.axis.y, 1, 1);
	var data = this.data3D;
	var wvp = data.world.getMul(data.view).getMul(data.projection);
	var line = pos.getCastRay(wvp, this.canvas2d);
	var surfaceNormal = new LaVector(0, 0, 1, 0);
	var point = surfaceNormal.getIntersectSurfaceLine(
		new LaVector(0, 0, 0, 1), line.array, line.point
	);
	this.data3D.pointer = new Gis3d.Shape.Pointer(point, line.array);

	this.model.setRegionsSelectedByPoint(point);
	this.draw3DShapes();
	return this;
}

Gis3d.prototype.doMouseDrag = function(e) {
	var move = e.data.move;
	this.draw2DTexts();

	var key_table = this.keyboardTracker.pressedKeys;
	var altPressed = (-1 != key_table.indexOf('Alt'));
	var result = null;
	if(e.data.key.left && !altPressed) {
		var eye = this.data3D.eye;
		var lookAt = this.data3D.lookAt;
		var move_factor = 2*eye.getSub(lookAt).getLength()/this.canvas3d.width;
		var result = this.data3D.view.getMoveScreenXYZ(
			move_factor*move.x, -move_factor*move.y, 0.0,
			this.data3D.eye,
			this.data3D.lookAt,
			this.data3D.up
		);
	} else if(e.data.key.right || altPressed) {
		var result = this.data3D.view.getTurnedViewByScreenXY(
			0.01*move.x, -0.01*move.y,
			this.data3D.eye,
			this.data3D.lookAt,
			this.data3D.up
		);
	}
	this.data3D.view = result.view;
	this.data3D.eye = result.eye;
	this.data3D.lookAt = result.lookAt;
	this.data3D.up = result.up;
	this.draw3DShapes();
	return this;
}

Gis3d.prototype.doMouseWheel = function(e) {
	var wheel = e.data.wheel;
	var eye = this.data3D.eye;
	var lookAt = this.data3D.lookAt;
	var view_length = eye.getSub(lookAt).getLength();
	var deltaZ = 0.04*wheel*view_length;
	if(this.data3D.zNear > (view_length - deltaZ)) {
		deltaZ = 0;
	}
	var result = this.data3D.view.getMoveScreenXYZ(
		0, 0, deltaZ,
		this.data3D.eye,
		this.data3D.lookAt,
		this.data3D.up
	);
	this.data3D.view = result.view;
	this.data3D.eye = result.eye;
	this.data3D.lookAt = result.lookAt;
	this.data3D.up = result.up;
	this.draw3DShapes();
	return this;
}

//* vim: syntax=javascript
//* vim: dictionary=~/.vim/dict/javascript.dict

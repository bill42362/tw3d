<?php
include_once('EventCenter.js.php');
include_once('KeyTable.js.php');
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.ElementPlugin = function(target) {
	this.target = target;
	return this;
}

Gis3d.ElementPlugin.KeyboardTracker = function() {
	this.keyboardTracker = this;
	this.pressedKeys = new Gis3d.KeyTable();
	return this;
}

Gis3d.ElementPlugin.MouseTracker = function() {
	if('onwheel' in document) {
		this.wheelEventName = 'wheel';
	} else {
		this.wheelEventName = 'mousewheel';
	}
	this.state = {
		prev: null,
		axis: {x: 0, y: 0},
		move: {x: 0, y: 0},
		wheel: null,
		key: {left: 0, middle: 0, right: 0}
	};
	return this;
}

Gis3d.ElementPlugin.KeyboardTracker.prototype.bindListeners = function(target) {
	this.target = target;
	this.target.keyboardTracker = this;
	target.addEventListener('keydown', this.replyKeydown, false);
	target.addEventListener('keypress', this.replyKeypress, false);
	target.addEventListener('keyup', this.replyKeyup, false);
	return this;
}

Gis3d.ElementPlugin.KeyboardTracker.prototype.unbindListeners = function() {
	this.target.keyboardTracker = undefined;
	this.target = null;
	target.removeEventListener('keydown', this.replyKeydown, false);
	target.removeEventListener('keypress', this.replyKeypress, false);
	target.removeEventListener('keyup', this.replyKeyup, false);
	return this;
}

Gis3d.ElementPlugin.KeyboardTracker.prototype.replyKeydown = function(e) {
	var self = this.keyboardTracker; // Can only saddly use 'this'...
	var pks = self.pressedKeys;
	var key = null;
	if('key' in e) {
		key = e.key;
	} else if('keyIdentifier' in e) {
		key = e.keyIdentifier;
		key = ('U+001B' === key) ? 'Escape' : key;
		if('U+003A' === key) { // ';'
			if(-1 != pks.indexOf('Shift')) {
				key = ':';
			}
		}
	}
	pks.add(key);
	pks.removeOutdated();
	Gis3d.eventCenter.castEvent(self, 'keydown', self.pressedKeys);
	return this;
}

Gis3d.ElementPlugin.KeyboardTracker.prototype.replyKeypress = function(e) {
	var self = this.keyboardTracker; // Can only saddly use 'this'...
	self.replyKeydown(e);
	return this;
}

Gis3d.ElementPlugin.KeyboardTracker.prototype.replyKeyup = function(e) {
	var self = this.keyboardTracker; // Can only saddly use 'this'...
	var pks = self.pressedKeys;
	var key = null;
	if('key' in e) {
		key = e.key;
	} else if('keyIdentifier' in e) {
		key = e.keyIdentifier;
		key = ('U+001B' === key) ? 'Escape' : key;
		if('U+003A' === key) { // ';'
			if(-1 != pks.indexOf('Shift')) {
				key = ':';
			}
		}
	}
	pks.remove(key);
	pks.removeOutdated();
	return this;
}

Gis3d.ElementPlugin.MouseTracker.prototype.bindListeners = function(target) {
	this.target = target;
	this.target.mouseTracker = this;
	this.target.draggable = true;
	target.addEventListener('contextmenu', this.replyContextMenu, false);
	target.addEventListener('mousedown', this.replyMouseDown, false);
	target.addEventListener('mouseup', this.replyMouseUp, false);
	target.addEventListener(this.wheelEventName, this.replyMouseWheel, false);
	target.addEventListener('mousemove', this.replyMouseMove, false);
	target.addEventListener('dragstart', this.replyDragStart, false);
	return this;
}

Gis3d.ElementPlugin.MouseTracker.prototype.unbindListeners = function() {
	this.target.draggable = false;
	this.target.mouseTracker = undefined;
	this.target = null;
	target.removeEventListener('contextmenu', this.replyContextMenu, false);
	target.removeEventListener('mousedown', this.replyMouseDown, false);
	target.removeEventListener('mouseup', this.replyMouseUp, false);
	target.removeEventListener(this.wheelEventName, this.replyMouseWheel, false);
	target.removeEventListener('mousemove', this.replyMouseMove, false);
	target.removeEventListener('dragstart', this.replyDragStart, false);
	return this;
}

Gis3d.ElementPlugin.MouseTracker.prototype.replyMouseDown = function(e) {
	var self = e.target.mouseTracker;
	if(!(self instanceof Gis3d.ElementPlugin.MouseTracker)) {
		return self;
	}
	switch(e.button) {
		case 0: self.state.key.left = 1; break;
		case 1: self.state.key.middle = 1; break;
		case 2: self.state.key.right = 1; break;
		default: break;
	}
	Gis3d.eventCenter.castEvent(self, 'mousedown', self.state);
	self.pushPrevState();
	return self;
}

Gis3d.ElementPlugin.MouseTracker.prototype.replyContextMenu = function(e) {
	var self = e.target.mouseTracker;
	if(!(self instanceof Gis3d.ElementPlugin.MouseTracker)) {
		return self;
	}
	e.preventDefault();
	return false;
}

Gis3d.ElementPlugin.MouseTracker.prototype.replyMouseUp = function(e) {
	var self = e.target.mouseTracker;
	if(!(self instanceof Gis3d.ElementPlugin.MouseTracker)) {
		return self;
	}
	switch(e.button) {
		case 0: self.state.key.left = 0; break;
		case 1: self.state.key.middle = 0; break;
		case 2: self.state.key.right = 0; break;
		default: break;
	}
	Gis3d.eventCenter.castEvent(self, 'mouseup', self.state);
	self.pushPrevState();
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	return self;
}

Gis3d.ElementPlugin.MouseTracker.prototype.replyMouseWheel = function(e) {
	var self = e.target.mouseTracker;
	if(!(self instanceof Gis3d.ElementPlugin.MouseTracker)) {
		return self;
	}
	var deltaY = e.deltaY || e.wheelDeltaY || e.wheelDelta;
	if(0 < deltaY) {
		self.state.wheel = -1;
	} else {
		self.state.wheel = 1;
	}
	Gis3d.eventCenter.castEvent(self, 'mousewheel', self.state);
	self.pushPrevState();
	return self;
}

Gis3d.ElementPlugin.MouseTracker.prototype.replyMouseMove = function(e) {
	var self = e.target.mouseTracker;
	if(!(self instanceof Gis3d.ElementPlugin.MouseTracker)) {
		return self;
	}
	var startX = 0, startY = 0;
	for(
		var parentElement = e.target;
		parentElement;
		parentElement = parentElement.offsetParent
	) {
		startX += parentElement.offsetLeft;
		startX += parentElement.offsetTop;
	}
	self.state.axis.x = e.clientX - startX;
	self.state.axis.y = e.clientY - startY;
	if(self.state.prev) {
		self.state.move.x = e.clientX - self.state.prev.axis.x;
		self.state.move.y = e.clientY - self.state.prev.axis.y;
	}
	Gis3d.eventCenter.castEvent(self, 'mousemove', self.state);
	if(self.state.key.left || self.state.key.middle || self.state.key.right) {
		Gis3d.eventCenter.castEvent(self, 'mousedrag', self.state);
	}
	self.pushPrevState();
	return self;
}

Gis3d.ElementPlugin.MouseTracker.prototype.replyDragStart = function(e) {
	e.preventDefault();
	return self;
}

Gis3d.ElementPlugin.MouseTracker.prototype.pushPrevState = function() {
	var s = this.state;
	this.state.prev = {
		axis: {x: s.axis.x, y: s.axis.y},
		move: {x: s.move.x, y: s.move.y},
		wheel: s.wheel,
		key: {left: s.key.left, middle: s.key.middle, right: s.key.right}
	};
	return this.state;
}

//* vim: syntax=javascript
//* vim: dictionary=~/.vim/dict/javascript.dict

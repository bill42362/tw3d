<?php
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.CommandHistory = function() {
	this.frame = document.createElement('pre');
	this.frame.className = 'history';
	this.frame.identifier = 'gis3didentifier';
	return this;
}
Gis3d.CommandHistory.unitTest = function() {
	return true;
}

Gis3d.CommandHistory.prototype.bindTo = function(elem) {
	elem.appendChild(this.frame);
	return this;
}

Gis3d.CommandHistory.prototype.add = function(command) {
	if (!(typeof command === 'string') && !(command instanceof String)) {
		console.error('Gis3d.CommandHistory.add(): Wrong input.');
		return false;
	}
	this.frame.textContent += command + '\n';
	window.setTimeout(this.transit, 3000);
	window.setTimeout(this.hide, 4000);
	var show = /\ show/g;
	var transition = /\ transition/g;
	var hidden = /\ hidden/g;
	var className = this.frame.className;
	this.frame.className
		= className
		.replace(show, '').replace(transition, '').replace(hidden, '')
		+ ' show';
	return this;
}

Gis3d.CommandHistory.prototype.transit = function() {
	var historys = document.getElementsByClassName('history');
	var history = null;
	for(var i = 0; i < historys.length; ++i) {
		if('gis3didentifier' == historys[i].identifier) {
			history = historys[i];
		}
	}
	var show = /\ show/g;
	var transition = /\ transition/g;
	var hidden = /\ hidden/g;
	var className = history.className;
	history.className
		= className
		.replace(show, '').replace(transition, '').replace(hidden, '')
		+ ' transition';
	return this;
}

Gis3d.CommandHistory.prototype.hide = function() {
	var historys = document.getElementsByClassName('history');
	var history = null;
	for(var i = 0; i < historys.length; ++i) {
		if('gis3didentifier' == historys[i].identifier) {
			history = historys[i];
		}
	}
	var show = /\ show/g;
	var transition = /\ transition/g;
	var hidden = /\ hidden/g;
	var className = history.className;
	history.className
		= className
		.replace(show, '').replace(transition, '').replace(hidden, '')
		+ ' hidden';
	return this;
}

//* vim: syntax=javascript

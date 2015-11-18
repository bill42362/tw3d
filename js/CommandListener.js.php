<?php
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.CommandListener = function() {
	this.frame = document.createElement('div');
	this.frame.className = 'input';
	this.frame.contentEditable = true;
	this.frame.holder = this;
	this.frame.addEventListener('input', this.replyInput, false);

	this.history = Gis3d.history;

	return this;
}
Gis3d.CommandListener.unitTest = function() {
	return true;
}

Gis3d.CommandListener.prototype.bindTo = function(elem) {
	elem.appendChild(this.frame);
	return this;
}

Gis3d.CommandListener.prototype.replyInput = function(e) {
	e.target.holder.startListen();
	var lineFeed = /[\n]|<br>.*<br/gi;
	var html = e.target.innerHTML;
	if(lineFeed.test(html)) {
		e.target.holder.sendCommand();
	}
	return this;
}

Gis3d.CommandListener.prototype.startListen = function() {
	if(true === this.isListeningCommand) {
		return this;
	}
	this.isListeningCommand = true;
	this.frame.focus();
	return this;
}

Gis3d.CommandListener.prototype.cancelListenCommand = function() {
	if(!this.isListeningCommand) {
		return this;
	}
	this.isListeningCommand = false;
	this.frame.blur();
	this.frame.textContent = '';
	return this;
}

Gis3d.CommandListener.prototype.sendCommand = function() {
	if(!this.isListeningCommand) {
		return this;
	}
	this.isListeningCommand = false;

	var Gis3d = this.holder;
	var commandList = {
		reset: Gis3d.reset,
		start: Gis3d.startRender,
		stop: Gis3d.stopRender,
		no: Gis3d.removeRegion,
		show: Gis3d.addRegion,
		only: Gis3d.onlyRegion,
		except: Gis3d.exceptRegion,
		formula: Gis3d.setFormula,
		mode: Gis3d.setRegionMode,
		new: Gis3d.makeWrap,
		set: 'set'
	};

	this.history.add(this.frame.textContent);

	var input_filter = /^:(\S*)\s*(.*)/i;
	var input = input_filter.exec(this.frame.textContent);
	var command = input[1];
	var argument = input[2];
	this.frame.blur();
	this.frame.textContent = '';

	this.holder.cmd_ = commandList[command];
	this.holder.cmd_(argument);
	this.holder.cmd_ = undefined;
	return this;
}

//* vim: syntax=javascript

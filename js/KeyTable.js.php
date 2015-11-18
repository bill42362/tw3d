<?php
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.KeyTable = function() {
	this.pressedKeys = [];
	return this;
}

Gis3d.KeyTable.prototype.removeOutdated = function() {
	var oneSecAgo = Date.now() - 1000;
	var pks = this.pressedKeys;
	for(var i = pks.length - 1; i > -1; --i) {
		if(oneSecAgo > pks[i].timestamp) {
			pks.splice(i, 1);
		}
	}
	return this;
}

Gis3d.KeyTable.prototype.remove = function(key) {
	var index = this.indexOf(key);
	if(-1 != index) {
		this.pressedKeys.splice(index, 1);
	}
	return this;
}

Gis3d.KeyTable.prototype.add = function(key) {
	if(-1 === this.indexOf(key)) {
		this.pressedKeys.push({key: key, timestamp: Date.now()});
	}
	return this;
}

Gis3d.KeyTable.prototype.indexOf = function(key) {
	var pks = this.pressedKeys;
	var exist = false, pin = 0;
	while((pin < pks.length) && (false === exist)) {
		if(key === pks[pin].key) {
			exist = true;
		}
		++pin;
	}
	return exist ? (pin - 1) : -1;
}

//* vim: syntax=javascript
//* vim: dictionary=~/.vim/dict/javascript.dict

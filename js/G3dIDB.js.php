<?php
include_once('la/LinearAlgebra.js.php');
include_once('EventCenter.js.php');
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dIDB = function() {
	window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

	indexedDB.db = null;
	// Hook up the errors to the console so we could see it.
	// In the future, we need to push these messages to the user.
	indexedDB.onerror = function(e) {
		console.log(e);
	};
	this.eventCenter = Gis3d.eventCenter;
	this.dataBaseInfo = {name: 'gis', version: 1};
	this.database = this.requestIDB();
	this.tableNames = [];
	this.tableStructs = [];

	this.databaseNotAvaliable = false;
	return this;
}
Gis3d.G3dIDB.unitTest = function() {
	var gicidb = new Gis3d.G3dIDB();
	window.gicidb = gicidb;
	return true;
}

Gis3d.G3dIDB.prototype.reset = function() {
	if(this.database instanceof IDBDatabase) {
		this.database.close(); // Will error while deleteDatabase() if didn't close().
	}
	this.database = undefined;
	this.databaseNotAvaliable = false;
	var req = window.indexedDB.deleteDatabase(this.dataBaseInfo.name);
	return this;
}

Gis3d.G3dIDB.prototype.addTable = function(name, struct) {
	if(!(typeof name === 'string') && !(name instanceof String)) {
		console.error('Gis3d.G3dIDB.addTable(): Wrong input.');
		return false;
	}
	if(!(this.database instanceof IDBDatabase)) {
		this.requestIDB()
		return this;
	}
	if(-1 === this.tableNames.indexOf(name)) {
		this.tableNames.push(name);
		this.tableStructs[this.tableNames.indexOf(name)] = struct;
	}
	var storeNames = this.database.objectStoreNames;
	if(!storeNames.contains(name)) {
		this.reset();
	}
	return this;
}

Gis3d.G3dIDB.prototype.requestIDB = function() {
	if(
		!(this.database instanceof IDBDatabase)
		&& !this.requestingDatabase
		&& !this.databaseNotAvaliable
	) {
		this.requestingDatabase = true;
		var dbRequest = indexedDB.open(this.dataBaseInfo.name, this.dataBaseInfo.version);
		dbRequest.holder = this;
		dbRequest.addEventListener('upgradeneeded', this.doDBUpgradeneeded, false);
		dbRequest.addEventListener('success', this.doDBReqSuccess, false);
		dbRequest.addEventListener('error', this.doDBReqError, false);
		dbRequest.addEventListener('blocked', this.doDBReqError, false);
		console.log('Send requestIDB.');
	}
	return this.database;
}

Gis3d.G3dIDB.prototype.doDBReqSuccess = function(e) {
	var holder = e.target.holder;
	holder.database = e.target.result;
	holder.requestingDatabase = false;
	console.log('Request gis3d.database success. database:', e.target.result);
	return this;
}

Gis3d.G3dIDB.prototype.doDBReqError = function(e) {
	var holder = e.target.holder;
	holder.requestingDatabase = false;
	holder.databaseNotAvaliable = true;
	holder.doDBError(e);
	return this;
}

Gis3d.G3dIDB.prototype.doDBError = function(e) {
	console.log('Gis3d.G3dIDB.doDBError(): e.target.errorCode:', e.target.errorCode);
	return this;
}

Gis3d.G3dIDB.prototype.doDBUpgradeneeded = function(e) {
	var db = e.target.result;
	var holder = e.target.holder;
	var store = holder.createTables(db);
	if(store instanceof IDBObjectStore) {
		console.log('G3dIDB.doDBUpgradeneeded(): success. store:', store);
	} else {
		console.warn('G3dIDB.doDBUpgradeneeded(): fail. database:', db);
	}
	return holder;
}

Gis3d.G3dIDB.prototype.createTables = function(db) {
	if(!(db instanceof IDBDatabase)) {
		console.error('G3dIDB.createTable(): Wrong argument.');
		return null;
	}
	for(var i = 0; i < this.tableNames.length; ++i) {
		if(db.objectStoreNames.contains(this.tableNames[i])) {
			db.deleteObjectStore(this.tableNames[i]);
		}
		var store = db.createObjectStore(this.tableNames[i], { keyPath: "id" });
		store.createIndex("center_x", "center_x", {unique: false});
		store.createIndex("center_y", "center_y", {unique: false});
		store.createIndex("origin", "origin", {unique: false});
		store.createIndex("size", "size", {unique: false});
		store.createIndex("centroid", "centroid", {unique: false});
	}
	console.log('G3dIDB.createTable(): success. store:', store);
	return store;
}

//* vim: syntax=javascript
//* vim: dictionary=~/.vim/dict/javascript.dict

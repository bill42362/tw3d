<?php
include_once('la/LinearAlgebra.js.php');
include_once('XMLReq.js.php');
include_once('EventCenter.js.php');
include_once('ElementPlugin.js.php');
include_once('G3dData.js.php');
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.G3dWrapMaker = function() {
	this.frame = document.createElement('div');
	this.frame.className = 'wrapmaker hidden';

	this.log = document.createElement('div');
	this.log.className = 'wrapmakerlog';
	this.input = document.createElement('div');
	this.input.className = 'wraptextinput';
	this.input.contentEditable = true;
	this.input.holder = this;
	this.input.addEventListener('input', this.replyInput, false);
	this.frame.appendChild(this.log);
	this.frame.appendChild(this.input);

	this.eventCenter = Gis3d.eventCenter;
	this.isListening = false;
	this.keyboardTracker = new Gis3d.ElementPlugin.KeyboardTracker();
	this.keyboardTracker.bindListeners(this.frame);
	this.eventCenter.registListener(
		this.keyboardTracker, 'keydown', this.doKeydown, this
	);

	return this;
}
Gis3d.G3dWrapMaker.unitTest = function() {
	var templete = ':e "bill42362@gmail.com"; :t "2012LegislatorDPPWinRatio"; :d "2012立委選舉，(綠營票數 - 藍營票數)/總票數。"; :f "( 758644aa-a637-4865-bf22-8a11fccdba27 - 682f41aa-03e7-4190-b229-49509021ec67) / 3b54fda0-1dd1-4a66-9191-7b1394f30247"; done ';
	var templete_no_formula = ':e "bill42362@gmail.com"; :t "2012LegislatorDPPWinRatio"; :d "2012立委選舉，(綠營票數 - 藍營票數)/總票數。"; done ';
	var wrapMaker = new Gis3d.G3dWrapMaker();
	var data = new Gis3d.G3dData();
	return true;
}

Gis3d.G3dWrapMaker.prototype.ajaxRequestMaker = new Gis3d.XMLReq();

Gis3d.G3dWrapMaker.prototype.bindTo = function(elem) {
	elem.appendChild(this.frame);
	return this;
}

Gis3d.G3dWrapMaker.prototype.analyzeInput = function(input) {
	if (!(typeof input === 'string') && !(input instanceof String)) {
		console.error('Gis3d.G3dWrapMaker.analyzeInput(): Wrong input.');
		return false;
	}
	var logError = function(logFrame, message) {
		var log = document.createElement('div');
		log.className = 'wrapmakererror';
		log.textContent = message;
		if(undefined != logFrame) {
			logFrame.appendChild(log);
		}
		console.log(message);
		return this;
	};
	var extractItem = function(input, statExp, ruleExp, logFrame, errMsg) {
		var statExpObj = new RegExp(statExp);
		var ruleExpObj = new RegExp(ruleExp);
		var stat = (statExpObj.exec(input) || ["", ""])[1];
		var pass = ruleExpObj.exec(stat);
		if(!pass) {
			logError(logFrame, errMsg);
			if("" === stat) {
				stat = null;
			} else {
				stat = 'fail';
			}
		}
		return stat;
	}
	var email = extractItem(
		input, ':[eE][^"]*"([^"]*)";',
		"^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*"
			+ "@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}$",
		this.log, 'Email format should be \':email "Your Email";\''
	);
	if(('fail' === email) || (null === email)) { return false; }

	var title = extractItem(
		input, ':[tT][^"]*"([^"]*)";', ".*",
		this.log, 'Title format should be \':title "Title";\''
	);
	if(('fail' === title) || (null === title)) { return false; }

	var description = extractItem(
		input, ':[dD][^"]*"([^"]*)";', ".*",
		this.log, 'Description format should be \':description "Description";\''
	);
	if(('fail' === description) || (null === description)) { return false; }

	var formula = extractItem(
		input, ':[fF][^"]*"([^"]*)";', "\\w{8}-\\w{4}-\\w{4}-\\w{4}-\\w{12}",
		this.log, 'Formula format should be \':formula "Formula composited by wrapId (uuid).";\''
	);
	if(('fail' != formula) && (null != formula)) {
		var dataParser = new Gis3d.G3dData();
		var ops = dataParser.readFormula(formula);
		if("" != ops.remainds) {
			logError(this.log, 'Can\'t pharse formula: ' + formula);
			formula = "fail";
		}
	}
	if(('fail' === formula)) { return false; }

	var wrap = {email: email, title: title, description: description, formula: formula};
	this.sendWrap(wrap);
	return wrap;
}

Gis3d.G3dWrapMaker.prototype.sendWrap = function(wrap) {
	if(!wrap.email || !wrap.title || !wrap.description) {
		console.error('Gis3d.G3dWrapMaker.sendWrap(): Wrong input.');
		return false;
	}
	var reqMaker = this.ajaxRequestMaker;
	var req = reqMaker.createReq('local', 'wrap', undefined, 'post');
	req.holder = this;
	req.addEventListener('loadend', this.doWrapsSent, false);
	wrap.order = 'create';
	req.send(JSON.stringify(wrap));
	return this;
}

Gis3d.G3dWrapMaker.prototype.replyInput = function(e) {
	var self = e.target.holder;
	var lineFeed = /done.*([\n]|<br>.*<br)/gi;
	var html = e.target.innerHTML;
	if(lineFeed.test(html)) {
		self.log.innerHTML = null;
		self.analyzeInput(e.target.textContent);
		e.target.innerHTML = null;
	}
	return this;
}

Gis3d.G3dWrapMaker.prototype.startListen = function() {
	if(true === this.isListening) {
		return this;
	}
	var hidden = /\ hidden/ig;
	var className = this.frame.className;
	this.frame.className = className.replace(hidden, '');
	this.isListening = true;
	this.input.focus();
	return this;
}

Gis3d.G3dWrapMaker.prototype.cancelListen = function() {
	if(!this.isListening) {
		return this;
	}
	this.frame.className += ' hidden';
	this.isListening = false;
	this.input.blur();
	return this;
}

Gis3d.G3dWrapMaker.prototype.doKeydown = function(e) {
	var key_table = e.data;
	if(1 === key_table.pressedKeys.length) {
		switch(key_table.pressedKeys[0].key) {
			case 'Escape':
				this.cancelListen();
				break;
			default: break;
		}
	}
	return this;
}

//* vim: syntax=javascript
//* vim: dictionary=~/.vim/dict/javascript.dict

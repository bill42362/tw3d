<?php
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
Gis3d.XMLReq = function() {
	var self = this;
	return this;
}
Gis3d.XMLReq.prototype.createReq = function(site, target, parms, opt_method) {
	var req = null;
	var url = null;
	var method = opt_method || 'GET';
	var parm_string = '';
	if(parms && parms.length) {
		for(var i = 0; i < parms.length; ++i) {
			parm_string += parms[i].parmeter + '=' + parms[i].value + '&';
		}
	}
	switch(site) {
		case 'youtube':
			url = 'https://gdata.youtube.com/feeds/api/' + target + '?' + parm_string + 'v=2';
			break;
		case 'local':
			url = window.location.href + 'api/' + target + '.php?' + parm_string;
			break;
		default:
	}
	if(window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		req = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		// code for IE6, IE5
		req = new ActiveXObject("Microsoft.XMLHTTP");
	} else {
		alert('Please use browsers later than IE5.0 ' + 
			'to enable reference-preview function.'); 
	}
	if(req && url) {
		req.open(method, url, true);
		if('post' === method) {
			req.setRequestHeader('Content-type', 'application/json');
		}
	}
	return req;
}

//* vim: syntax=javascript

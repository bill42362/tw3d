<?php
include_once(__DIR__.'/'.'../la/LaVector.js.php');
include_once(__DIR__.'/'.'../la/LaMatrix.js.php');
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
if(undefined === Gis3d.ShaderProgram) { Gis3d.ShaderProgram = function() {}; };
Gis3d.ShaderProgram.BlendLight = function(ctx) {
	if(!ctx || !(ctx instanceof WebGLRenderingContext)) {
		console.warn('No WebGL context, no shader program.');
		return null;
	}
	var vert_shader = null;
	var frag_shader = null;
	this.wglContext = ctx;
	this.programUsing = false;

	// Initial vertex shader.
	vert_shader = ctx.createShader(ctx.VERTEX_SHADER);
	ctx.shaderSource(vert_shader, this.vertexSource);
	ctx.compileShader(vert_shader);
	if(!ctx.getShaderParameter(vert_shader, ctx.COMPILE_STATUS))
		console.error(ctx.getShaderInfoLog(vert_shader));

	// Initial fragement shader.
	frag_shader = ctx.createShader(ctx.FRAGMENT_SHADER);
	ctx.shaderSource(frag_shader, this.fregmentSource);
	ctx.compileShader(frag_shader);
	if(!ctx.getShaderParameter(frag_shader, ctx.COMPILE_STATUS))
		console.error(ctx.getShaderInfoLog(frag_shader));

	// Create shader program.
	this.program = ctx.createProgram();
	ctx.attachShader(this.program, vert_shader);
	ctx.attachShader(this.program, frag_shader);
	ctx.linkProgram(this.program);
	if(!ctx.getProgramParameter(this.program, ctx.LINK_STATUS))
		console.error("Create shader program fail!");

	// Enable data locations.
	this.dataLocation = {
		uniform: {wv: null, p: null, n: null},
		attrib: {pos: null, color: null, normal: null}
	};
	this.dataLocation.uniform.wv = ctx.getUniformLocation(this.program, "wv_uni");
	this.dataLocation.uniform.p = ctx.getUniformLocation(this.program, "p_uni");
	this.dataLocation.uniform.n = ctx.getUniformLocation(this.program, "n_uni");
	this.dataLocation.attrib.pos = ctx.getAttribLocation(this.program, "pos_att");
	ctx.enableVertexAttribArray(this.dataLocation.attrib.pos);
	this.dataLocation.attrib.color = ctx.getAttribLocation(this.program, "color_att");
	ctx.enableVertexAttribArray(this.dataLocation.attrib.color);
	this.dataLocation.attrib.normal = ctx.getAttribLocation(this.program, "normal_att");
	ctx.enableVertexAttribArray(this.dataLocation.attrib.normal);

	this.buffer = {pos: null, color: null, index: null, normal: null};

	this.unitedModel = null;
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.vertexSource = ""
	+ "uniform mat4 wv_uni;"
	+ "uniform mat4 p_uni;"
	+ "uniform mat4 n_uni;"
	+ "attribute vec4 pos_att;"
	+ "attribute vec4 color_att;"
	+ "attribute vec4 normal_att;"
	+ "varying vec4 color_vary;"
	+ "varying vec4 view_pos_vary;"
	+ "varying vec4 n_normal_vary;"
	+ "void main(void) {"
	+ "	view_pos_vary = pos_att * wv_uni;"
	+ "	gl_Position = view_pos_vary * p_uni;"
	+ "	color_vary = color_att;"
	+ "	n_normal_vary = normal_att * n_uni;"
	+ "}";

Gis3d.ShaderProgram.BlendLight.prototype.fregmentSource = ""
	+ "precision mediump float;"
	+ "varying vec4 color_vary;"
	+ "varying vec4 view_pos_vary;"
	+ "varying vec4 n_normal_vary;"
	+ "void main(void) {"
	+ "	vec3 n_normal = n_normal_vary.xyz;"
	+ "	vec3 light_pos = vec3(0.5, 0.5, 0.5);"
	+ "	vec3 light_dir = normalize(light_pos - view_pos_vary.xyz);"
	+ "	vec3 light = vec3(0.5, 0.5, 0.5) * min(max(dot(light_dir, n_normal), 0.0), 1.0);"
	+ "	gl_FragColor.rgb = color_vary.xyz + light;"
	+ "	gl_FragColor.a = 0.5;"
	+ "}";

Gis3d.ShaderProgram.BlendLight.prototype.useProgram = function() {
	this.wglContext.useProgram(this.program);
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.setWorld = function(opt_w) {
	var w = null;
	this.useProgram();
	if(opt_w instanceof LaMatrix) {
		w = opt_w;
	} else {
		w = new LaMatrix();
		console.warn('Wrong world matrix arg, use Identity.');
	}

	var v = this.viewMatrix || new LaMatrix().loadIdentity();
	var wv = w.getMul(v);
	this.wglContext.uniformMatrix4fv(
		this.dataLocation.uniform.wv,
		false,
		wv.getTranspose().array
	);

	var n = wv.getFastInverse().getTranspose();
	this.wglContext.uniformMatrix4fv(
		this.dataLocation.uniform.n,
		false,
		n.getTranspose().array
	);
	this.worldMatrix = w;
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.setView = function(opt_v) {
	var v = null;
	this.useProgram();
	if(opt_v instanceof LaMatrix) {
		v = opt_v;
	} else {
		v = new LaMatrix();
		console.warn('Wrong view matrix arg, use Identity.');
	}

	var w = this.worldMatrix || new LaMatrix().loadIdentity();
	var wv = w.getMul(v);
	this.wglContext.uniformMatrix4fv(
		this.dataLocation.uniform.wv,
		false,
		wv.getTranspose().array
	);

	var n = wv.getFastInverse().getTranspose();
	this.wglContext.uniformMatrix4fv(
		this.dataLocation.uniform.n,
		false,
		n.getTranspose().array
	);
	this.viewMatrix = v;
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.setProjection = function(opt_p) {
	var p = null;
	this.useProgram();
	if(opt_p instanceof LaMatrix) {
		p = opt_p;
	} else {
		p = new LaMatrix();
		console.warn('Wrong projection matrix arg, use Identity.');
	}
	this.wglContext.uniformMatrix4fv(
		this.dataLocation.uniform.p,
		false,
		p.getTranspose().array
	);
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.setVertex = function(v) {
	var vertices = null;
	var ctx = this.wglContext;
	if(v instanceof Float32Array) {
		vertices = v;
		if(null == this.buffer.pos) {
			this.buffer.pos = ctx.createBuffer()
			this.buffer.pos.itemSize = 4;
		}
		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.pos);
		ctx.bufferData(ctx.ARRAY_BUFFER, vertices, ctx.DYNAMIC_DRAW);
		this.buffer.pos.numItems = vertices.length/this.buffer.pos.itemSize;
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.pos,
			this.buffer.pos.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);
	} else {
		console.error('Vertex is not a Float32Array.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.setColor = function(c) {
	var colors = null;
	var ctx = this.wglContext;
	if(c instanceof Float32Array) {
		colors = c;
		if(null == this.buffer.color) {
			this.buffer.color = ctx.createBuffer()
			this.buffer.color.itemSize = 4;
		}
		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.color);
		ctx.bufferData(ctx.ARRAY_BUFFER, colors, ctx.DYNAMIC_DRAW);
		this.buffer.color.numItems = colors.length/this.buffer.color.itemSize;
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.color,
			this.buffer.color.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);
	} else {
		console.error('Color is not an Float32Array.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.setIndex = function(i) {
	var indexes = null;
	var ctx = this.wglContext;
	if(i instanceof Uint16Array) {
		indexes = i;
		if(null == this.buffer.index) {
			this.buffer.index = ctx.createBuffer()
			this.buffer.index.itemSize = 1;
		}
		ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.buffer.index);
		ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, indexes, ctx.DYNAMIC_DRAW);
		this.buffer.index.numItems = indexes.length;
	} else {
		console.error('Index is not an Uint16Array.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.setNormal = function(n) {
	var normal = null;
	var ctx = this.wglContext;
	if(n instanceof Float32Array) {
		normal = n;
		if(null == this.buffer.normal) {
			this.buffer.normal = ctx.createBuffer()
			this.buffer.normal.itemSize = 4;
		}
		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.normal);
		ctx.bufferData(ctx.ARRAY_BUFFER, normal, ctx.DYNAMIC_DRAW);
		this.buffer.normal.numItems = normal.length/this.buffer.normal.itemSize;
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.normal,
			this.buffer.normal.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);
	} else {
		console.error('Normal is not an Float32Array.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.setModel = function(m) {
	var model = null;
	if(
		(m.vertex instanceof Float32Array)
		&& (m.color instanceof Float32Array)
		&& (m.vertex.length == m.color.length)
		&& (m.index instanceof Uint16Array)
		&& (m.normal instanceof Float32Array)
	) {
		model = m;
		this.setVertex(model.vertex);
		this.setColor(model.color);
		this.setIndex(model.index);
		this.setNormal(model.normal);
		this.unitedModel = null;
	} else {
		console.error('Wrong model object structure.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.setUnitedModel = function(u) {
	var validated = true;
	if(Array.isArray(u) && (0 != u.length)) {
		for(var i = 0, len = u.indexes.length; i < len; ++i) {
			if(
				!(u.vertexes[i] instanceof Float32Array)
				&& !(u.colors[i] instanceof Float32Array)
				&& !(u.vertexes[i].length === m.colors[i].length)
				&& !(u.indexes[i] instanceof Uint16Array)
				&& !(u.normals[i] instanceof Float32Array)
			) {
				validated = false;
			}
		}
	}
	if(true === validated) {
		this.unitedModel = u;
	} else {
		console.error('Wrong united model object structure.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.assignBuffers = function() {
	var ctx = this.wglContext;
	var buffer = this.buffer;
	if(buffer.pos && buffer.color && buffer.index && buffer.normal) {
		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.pos);
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.pos,
			this.buffer.pos.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);

		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.color);
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.color,
			this.buffer.color.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);

		ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.buffer.index);

		ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer.normal);
		ctx.vertexAttribPointer(
			this.dataLocation.attrib.normal,
			this.buffer.normal.itemSize,
			ctx.FLOAT,
			false, 0, 0
		);
	}
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.draw = function() {
	var ctx = this.wglContext;
	var buffer = this.buffer;
	this.useProgram();
	this.assignBuffers();
	var u = this.unitedModel;
	if((null != this.unitedModel) && u.vertexes && (0 != u.vertexes.length)) {
		ctx.enable(ctx.BLEND);
		ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
		ctx.depthMask(false);
		for(var i = 0, len = u.vertexes.length; i < len; ++i) {
			this.setVertex(u.vertexes[i]);
			this.setColor(u.colors[i]);
			this.setIndex(u.indexes[i]);
			this.setNormal(u.normals[i]);
			ctx.drawElements(ctx.TRIANGLES, buffer.index.numItems, ctx.UNSIGNED_SHORT, 0);
		}
		ctx.depthMask(true);
		ctx.disable(ctx.BLEND);
	} else if(buffer.pos && buffer.color && buffer.index) {
		ctx.enable(ctx.BLEND);
		ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
		ctx.depthMask(false);
		ctx.drawElements(ctx.TRIANGLES, buffer.index.numItems, ctx.UNSIGNED_SHORT, 0);
		ctx.depthMask(true);
		ctx.disable(ctx.BLEND);
	} else {
		console.error('Incomplete buffer datas.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.deleteBuffer = function() {
	var ctx = this.wglContext;
	if(this.buffer.pos && this.buffer.color && this.buffer.index && this.buffer.normal) {
		ctx.deleteBuffer(this.buffer.pos);
		ctx.deleteBuffer(this.buffer.color);
		ctx.deleteBuffer(this.buffer.index);
		ctx.deleteBuffer(this.buffer.normal);
		this.buffer = {pos: null, color: null, index: null, normal: null};
	} else {
		console.error('Incomplete buffer datas.');
	}
	return this;
}

Gis3d.ShaderProgram.BlendLight.prototype.drawOnce = function(m, opt_w, opt_v, opt_p) {
	if(this.wglContext instanceof WebGLRenderingContext) {
		this.setWorld(opt_w);
		this.setView(opt_v);
		this.setProjection(opt_p);
		this.setModel(m);
		this.draw();
		this.deleteBuffer();
	}
	return this;
}

//* vim: syntax=javascript

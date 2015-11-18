<?php
include_once(__DIR__.'/'.'../la/LaVector.js.php');
include_once(__DIR__.'/'.'../la/LaMatrix.js.php');
?>
if(undefined === Gis3d) { var Gis3d = function() {}; };
if(undefined === Gis3d.ShaderProgram) { Gis3d.ShaderProgram = function() {}; };
Gis3d.ShaderProgram.LinesColor = function(ctx) {
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
		uniform: {w: null, v:null, p: null},
		attrib: {pos: null, color: null}
	};
	this.dataLocation.uniform.w = ctx.getUniformLocation(this.program, "w_uni");
	this.dataLocation.uniform.v = ctx.getUniformLocation(this.program, "v_uni");
	this.dataLocation.uniform.p = ctx.getUniformLocation(this.program, "p_uni");
	this.dataLocation.attrib.pos = ctx.getAttribLocation(this.program, "pos_att");
	ctx.enableVertexAttribArray(this.dataLocation.attrib.pos);
	this.dataLocation.attrib.color = ctx.getAttribLocation(this.program, "color_att");
	ctx.enableVertexAttribArray(this.dataLocation.attrib.color);

	this.buffer = {pos: null, color: null, index: null};
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.vertexSource = ""
	+ "uniform mat4 w_uni;"
	+ "uniform mat4 v_uni;"
	+ "uniform mat4 p_uni;"
	+ "attribute vec4 pos_att;"
	+ "attribute vec4 color_att;"
	+ "varying vec4 color_vary;"
	+ "void main(void) {"
	+ "	gl_Position = pos_att * w_uni * v_uni * p_uni;"
	+ "	color_vary = color_att;"
	+ "}";

Gis3d.ShaderProgram.LinesColor.prototype.fregmentSource = ""
	+ "precision mediump float;"
	+ "varying vec4 color_vary;"
	+ "void main(void) {"
	+ "	gl_FragColor = color_vary;"
	+ "}";

Gis3d.ShaderProgram.LinesColor.prototype.useProgram = function() {
	this.wglContext.useProgram(this.program);
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.setWorld = function(opt_w) {
	var w = null;
	this.useProgram();
	if(opt_w instanceof LaMatrix) {
		w = opt_w;
	} else {
		w = new LaMatrix();
		console.warn('Wrong world matrix arg, use Identity.');
	}
	this.wglContext.uniformMatrix4fv(
		this.dataLocation.uniform.w,
		false,
		w.getTranspose().array
	);
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.setView = function(opt_v) {
	var v = null;
	this.useProgram();
	if(opt_v instanceof LaMatrix) {
		v = opt_v;
	} else {
		v = new LaMatrix();
		console.warn('Wrong view matrix arg, use Identity.');
	}
	this.wglContext.uniformMatrix4fv(
		this.dataLocation.uniform.v,
		false,
		v.getTranspose().array
	);
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.setProjection = function(opt_p) {
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

Gis3d.ShaderProgram.LinesColor.prototype.setVertex = function(v) {
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

Gis3d.ShaderProgram.LinesColor.prototype.setColor = function(c) {
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

Gis3d.ShaderProgram.LinesColor.prototype.setIndex = function(i) {
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

Gis3d.ShaderProgram.LinesColor.prototype.setModel = function(m) {
	var model = null;
	if(
		(m.vertex instanceof Float32Array)
		&& (m.color instanceof Float32Array)
		&& (m.vertex.length == m.color.length)
		&& (m.index instanceof Uint16Array)
	) {
		model = m;
		this.setVertex(model.vertex);
		this.setColor(model.color);
		this.setIndex(model.index);
	} else {
		console.error('Wrong model object structure.', m);
	}
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.assignBuffers = function() {
	var ctx = this.wglContext;
	var buffer = this.buffer;
	if(buffer.pos && buffer.color && buffer.index) {
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
	}
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.draw = function() {
	var ctx = this.wglContext;
	var buffer = this.buffer;
	this.useProgram();
	if(buffer.pos && buffer.color && buffer.index) {
		this.assignBuffers();
		ctx.enable(ctx.BLEND);
		ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
		ctx.depthMask(false);
		ctx.drawElements(ctx.LINES, buffer.index.numItems, ctx.UNSIGNED_SHORT, 0);
		ctx.depthMask(true);
		ctx.disable(ctx.BLEND);
	} else {
		console.error('Incomplete buffer datas.');
	}
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.deleteBuffer = function() {
	var ctx = this.wglContext;
	if(this.buffer.pos && this.buffer.color && this.buffer.index) {
		ctx.deleteBuffer(this.buffer.pos);
		ctx.deleteBuffer(this.buffer.color);
		ctx.deleteBuffer(this.buffer.index);
		this.buffer = {pos: null, color: null, index: null};
	} else {
		console.error('Incomplete buffer datas.');
	}
	return this;
}

Gis3d.ShaderProgram.LinesColor.prototype.drawOnce = function(m, opt_w, opt_v, opt_p) {
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

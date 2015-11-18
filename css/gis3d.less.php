@USING_THEME: 'TomorrowNight';
.roundedCorners (@radius: 8px) {
	border-radius: @radius;
	-webkit-border-radius: @radius;
	-moz-border-radius: @radius;
	-ms-border-radius: @radius;
	-o-border-radius: @radius;
}
.boxShadow(@style, @c) when (iscolor(@c)) {
	box-shadow:         @style @c;
	-webkit-box-shadow: @style @c;
	-moz-box-shadow:    @style @c;
	-ms-box-shadow: @style @c;
	-o-box-shadow:    @style @c;
}
.boxShadow(@style: 0 0 5px, @alpha: 50%) when (isnumber(@alpha)) {
	.boxShadow(@style, rgba(0, 0, 0, @alpha));
}
.transparent(@opacity: 0.5) {
	-ms-filter: %( // IE
		'progid:DXImageTransform.Microsoft.Alpha(Opacity=%d)',
		@opacity*100
	);
	filter: %('alpha(opacity=%d)', @opacity*100); // IE 5-7
	-moz-opacity: @opacity; // Netscape */
	-khtml-opacity: @opacity; // Safari 1.x
	opacity: @opacity; // Good browsers
}
.animation(@name, @duration: 3s, @delay: 0s, @ease: ease-out) {
	-webkit-animation: @name @duration @ease @delay;
	-moz-animation:    @name @duration @ease @delay;
	-ms-animation:     @name @duration @ease @delay;
	-o-animation:     @name @duration @ease @delay;
	animation:     @name @duration @ease @delay;
}
.transition(@name, @duration: 1s, @delay: 0s, @ease: ease-out) {
	-webkit-transition: @name @duration @ease @delay;
	-moz-transition:    @name @duration @ease @delay;
	-ms-transition:     @name @duration @ease @delay;
	-o-transition:     @name @duration @ease @delay;
	transition:     @name @duration @ease @delay;
}
.keyframes (@name, @rules) {
	@-webkit-keyframes ~'@{name}' { @rules(); }
	@-moz-keyframes ~'@{name}' { @rules(); }
	@-ms-keyframes ~'@{name}' { @rules(); }
	@-o-keyframes ~'@{name}' { @rules(); }
	@keyframes ~'@{name}' { @rules(); }
}
span#trunk {
	position: relative;
	display: inline-block;
	width: 40em;
	height: 30em;
}
div.gis3d {
	background-color: @background;
	width: 100%;
	font-family: monospace;
	canvas {
		position: absolute;
		top: 0%; left: 0%;
		width: 100%;
		height: 100%;
		color: @foreground;
	}
	canvas.canvas3d { background-color: @background; }
	div.ui {
		position: absolute;
		top: 0%; left: 0%;
		width: 100%;
		height: 100%;
		div.dataviewer {
			position: absolute;
			bottom: 0%;
			right: 0%;
			width: 7em;
			background-color: @currentLine;
			color: @foreground;
			.transparent(0.4);
			&:hover { .transparent(0.8); }
		}
		div.fps {
			position: absolute;
			top: 0%; right: 0%;
			color: @foreground;
			font-size: 1em;
		}
	}
	// For Safari support.
	input, textarea, [contenteditable] {
	    -webkit-user-select: text;
		user-select: text;
	}
}

.keyframes(fadout, {
	0% { color: @foreground; }
	70% { color: @foreground; }
	100% { color: @selection; }
});

@TomorrowNight-background: #2d2d2d;
@TomorrowNight-currentLine: #393939;
@TomorrowNight-selection: #515151;
@TomorrowNight-foreground: #cccccc;
@TomorrowNight-comment: #999999;
@TomorrowNight-red: #f2777a;
@TomorrowNight-orange: #f99157;
@TomorrowNight-yellow: #ffcc66;
@TomorrowNight-green: #99cc99;
@TomorrowNight-aqua: #66cccc;
@TomorrowNight-blue: #6699cc;
@TomorrowNight-purple: #cc99cc;

@BACKGROUND: "@{USING_THEME}-background";
@CURRENT_LINE: "@{USING_THEME}-currentLine";
@SELECTION: "@{USING_THEME}-selection";
@FOREGROUND: "@{USING_THEME}-foreground";
@COMMENT: "@{USING_THEME}-comment";
@RED: "@{USING_THEME}-red";
@ORANGE: "@{USING_THEME}-orange";
@YELLOW: "@{USING_THEME}-yellow";
@GREEN: "@{USING_THEME}-green";
@AQUA: "@{USING_THEME}-aqua";
@BLUE: "@{USING_THEME}-blue";
@PURPLE: "@{USING_THEME}-purple";

@background: @@BACKGROUND;
@currentLine: @@CURRENT_LINE;
@selection: @@SELECTION;
@foreground: @@FOREGROUND;
@comment: @@COMMENT;
@red: @@RED;
@orange: @@ORANGE;
@yellow: @@YELLOW;
@green: @@GREEN;
@aqua: @@AQUA;
@blue: @@BLUE;
@purple: @@PURPLE;

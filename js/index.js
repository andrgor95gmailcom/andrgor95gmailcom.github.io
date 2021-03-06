var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}} // Idea based on "flowers" by Gerard Ferrandez: https://codepen.io/ge1doot/pen/dKaZoZ

var particles = [];
var _e = void 0;
var last = void 0;
var grad = void 0;

function setup() {
	onResize();
}

function onResize() {
	var center = Vector.center();
	grad = createRadialGradient(
	center.x, center.y, 0,
	center.x, center.y, hypot(width, height) * 0.4);

	grad.addColorStop(0.0, hsl(340, 100, 50));
	grad.addColorStop(0.3, hsl(310, 100, 50));
	grad.addColorStop(0.7, hsl(240, 100, 50));
	grad.addColorStop(1.0, hsl(210, 100, 50));
}

function draw(e) {
	_e = e;
	var center = Vector.center();
	var time = e * 0.001;
	var sTime = sin(time * 0.8);
	// push();
	// // filter(`blur(${map(sTime, -1, 1, 10, 2)}px)`);
	// filter(`blur(1px)`);
	// drawImage(canvas, 0, 0, width, height);
	// pop();
	background(hsl(0, 0, 8, map(sTime, -1, 1, 0.05, 0.2)));
	if (mouseIn) {
		last = null;
		var v = mousePos.copy().sub(mousePosPrev);
		if (v.mag() > 2) {
			var vel_ = v.limit(80);
			for (var i = 0; i < 10; i++) {
				var pos = lerp(mousePosPrev, mousePos, random());
				var vel = vel_.copy().mult(random(0.05, 0.3));
				var p = new Particle(pos, vel, e);
				particles.push(p);
			}
		}
	} else
	{
		var mn = min(width_half, height_half) * 0.45;
		var count = 4;
		var timeC = time * 3.75;
		var timeS = time * 2.5;
		for (var _i = 0; _i < count; _i++) {
			var t = _i / count * EIGHTH_PI;
			var _pos = createVector(
			cos(timeC + t),
			sin(timeS + t)).
			mult(mn).add(center);
			if (last) {
				var _vel = _pos.copy().sub(last);
				var _p = new Particle(_pos, _vel, e);
				particles.push(_p);
			}
			last = _pos.copy();
		}
	}
	particles = particles.filter(function (p) {return p.e + p.life > e;});
	beginPath();
	particles.forEach(function (p) {
		var life = (e - p.e) / p.life;
		var r = (1 - life) * 10;
		// circle(p.pos.x, p.pos.y, r);
		push();
		translate(p.pos);
		var v = p.pos.copy().sub(p.lastPos);
		var heading = v.heading();
		var mag = v.mag();
		rotate(heading);
		moveTo(0, r);
		arc(0, 0, r, HALF_PI, -HALF_PI);
		arc(mag, 0, r, -HALF_PI, HALF_PI);
		closePath();
		pop();
		p.update();
	});
	fill(grad);
}var

Particle = function () {
	function Particle(pos, vel, e) {_classCallCheck(this, Particle);
		this.pos = pos.copy();
		this.lastPos = this.pos.copy();
		this.vel = vel.copy();
		this.e = e;
		this.life = random(200, 600);
	}_createClass(Particle, [{ key: "update", value: function update()
		{
			var dir = floor(this.life + _e * 0.003) % 2 ? 1 : -1;
			var rot = dir * this.life * 0.0003;
			this.lastPos = this.pos.copy();
			this.pos.add(this.vel.mult(0.95).rotate(rot));
		} }]);return Particle;}();
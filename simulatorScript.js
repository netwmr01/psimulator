goog.require('goog.structs.PriorityQueue');
var balls = [];
var i = 0; //number of balls
var running = false; // simulation not running yet
var repeater = null; // Holds the interval object.
var hz = 0.5;
var mspf = 50/3; //milliseconds per frame
var pq;
var qCreated = false;
var t = 0;
var event1, event2, event3;
function start() {
	if(!running) {
		//repeater = setInterval(function(){stepForward()}, mspf);
		running = true;
		if(!qCreated) { 
			pq = new goog.structs.PriorityQueue();
			qCreated = true;
		}
		mainLoop();
	}
}
function mainLoop() {
	var evt = new Event(0, null, null);
	pq.enqueue(evt.time, evt);
	while (!pq.isEmpty() && running) {
		alert('inloop');
		var e = pq.dequeue();
		if (!e.isValid()) continue;
		var a = e.a;
		var b = e.b;

		for (j=0;j<balls.length;j++) {
			balls[j].moveIt(e.time-t);
		}
		t = e.time;
		
		if		(a != null && b != null) a.collide(b);
		else if (a != null && b == null) a.collideWithVerticalWall();
		else if (a == null && b != null) b.collideWithHorizontalWall();
		else if (a == null && b == null) redraw();

		predict(a);
		predict(b);
	}
}
function generateBall() {
    balls[i] = new Ball();
    // Note: ball number counts from 0. i.e., first ball created is #0.
	balls[i].drawIt();
	if(!qCreated) { 
			pq = new goog.structs.PriorityQueue();
			qCreated = true;
	}
	predict(balls[i]);
	i++;
}
function generateBalls(amount) {
	if(!qCreated) { 
			pq = new goog.structs.PriorityQueue();
			qCreated = true;
	}
	for(i;i<amount;i++) {
		balls[i] = new Ball();
		balls[i].drawIt();
	}
	predictAll();
	start();
}
function predictAll() {
	for(j=0;j<i;j++) {
		if (balls.length > 1 ) {
			for(k=(j+1);k<i;k++) {
				event3 = new Event(balls[j].timeToHitParticle(balls[k]), balls[j], balls[k]);
				if (event3.isValid()) pq.enqueue(event3.time, event3);
			}
		}
		event1 = new Event(balls[j].timeToHitVerticalWall(), balls[j], null);
		event2 = new Event(balls[j].timeToHitHorizontalWall(), null, balls[j]);
		pq.enqueue(event1.time, event1);
		pq.enqueue(event2.time, event2);
	}
}
function predict(a) {
	if (a==null) return;
	for(j=0;j<(balls.length-1);j++) {
		event3 = new Event(a.timeToHitParticle(balls[j])+t, a, balls[j]);
		if (event3.isValid()) pq.enqueue(event3.time, event3);
	}
	event1 = new Event(a.timeToHitVerticalWall()+t, a, null);
	event2 = new Event(a.timeToHitHorizontalWall()+t, null, a);
	pq.enqueue(event1.time, event1);
	pq.enqueue(event2.time, event2);
}
function stop() {
  //clearInterval(repeater);
  running = false;
}
function redraw() {
	ctx.clearRect(0,0,750,750);
	for (j = 0; j < balls.length; j++) {
		balls[j].drawIt();
	}
	var e = new Event(t + 1.0/hz, null, null);
	pq.enqueue(e.time, e);
}
function Ball(px, py, vx, vy, radius, mass, color) {
	this.px = px;
	if (typeof px == 'undefined' || px <= 0) {
		this.px = Math.round(Math.random()*740)+5;
	}
	this.py = py;
	if (typeof py == 'undefined' || py <= 0) {
		this.py = Math.round(Math.random()*740)+5;
	}
	this.vx = vx;
	if (typeof vx == 'undefined' /*|| Math.abs(vx) <= .1*/) {
		this.vx = Math.ceil(Math.random()*8 -4);
        if(this.vx==0) this.vx=1;
	}
	this.vy = vy;
	if (typeof vy == 'undefined' /*|| Math.abs(vy) <= .1*/) {
		this.vy = Math.ceil(Math.random()*8 -4);
        if(this.vy==0) this.vy=1;
	}
	this.radius = radius;
	if (typeof radius == 'undefined' || radius < 1) {
		this.radius = 10;
	}
	this.mass = mass;
	if (typeof mass == 'undefined' || mass <= 0) {
		this.mass = 1;
	}
	this.color = color;
	if (typeof color == 'undefined') {
		this.color = "rgb("+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+")";
	}
	this.count = 0;

	this.moveIt = function(dt) {
		this.px += this.vx * dt;
		this.py += this.vy * dt;
	};
	this.drawIt = function() {
		ctx.beginPath();
		ctx.arc(this.px,this.py,this.radius,0,2*Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
	};
	this.collide = function(that) {
		var dx = that.px - this.px;
		var dy = that.py - this.py;
		var dvx = that.vx - this.vx;
		var dvy = that.vy - this.vy;
		var dvdp = dx*dvx + dy*dvy; //dv dot dp
		var dist = this.radius + that.radius; //distance between particle centers at collision
		
		//normal force F, and x and y components
		var F = 2 * this.mass * that.mass * dvdp / ((this.mass + that.mass) * dist);
		var Fx = F * dx / dist;
		var Fy = F * dy / dist;

		//update velocities after applying normal force
		this.vx += Fx / this.mass;
		this.vy += Fy / this.mass;
		that.vx -= Fx / that.mass;
		that.vy -= Fx / that.mass;

		this.count++;
		that.count++;
	};
	this.collideWithVerticalWall = function() {
		this.vx = -this.vx;
		this.count++;
	};
	this.collideWithHorizontalWall = function() {
		this.vy = -this.vy;
		this.count++;
	};
	this.timeToHitVerticalWall = function() {
		if		(this.vx>0) return (c.width - this.px - this.radius) / this.vx;
		else if (this.vx<0) return (this.radius - this.px) / this.vx;
		else 				return Number.POSITIVE_INFINITY;
	};
	this.timeToHitHorizontalWall = function() {
		if		(this.vy>0) return (c.width - this.py - this.radius) / this.vy;
		else if (this.vy<0) return (this.radius - this.py) / this.vy;
		else 				return Number.POSITIVE_INFINITY;
	};
	this.timeToHitParticle = function(b) {
		var a = this;
		if (a == b) return Number.POSITIVE_INFINITY;
		if (a.vx == b.vx && a.vy == b.vy) return Number.POSITIVE_INFINITY;
		var dx = b.px - a.px;
		var dy = b.py - a.py;
		var dvx = b.vx - a.vx;
		var dvy = b.vy - a.vy;
		var dvdp = dx*dvx + dy*dvy; //dv dot dp
		if (dvdp>0) return Number.POSITIVE_INFINITY;
		var dvdv = dvx*dvx + dvy*dvy; //dv dot dv
		var dpdp = dx*dx + dy*dy; //dp dot dp
		var sigma = a.radius + b.radius;
		var d = (dvdp*dvdp) - dvdv * (dpdp - sigma*sigma);
		if (d<0) return Number.POSITIVE_INFINITY;
		return -(dvdp + Math.sqrt(d)) / dvdv;
	};
}
function Event(time, a, b) {
	this.time = time;
	this.a = a;
	this.b = b;
	this.countA;
    this.countB;
	if (a != null) this.countA = a.count;
	else		   this.countA = -1;
	if (b != null) this.countB = b.count;
	else		   this.countB = -1;
	
	this.isValid = function() {
		if (a != null && a.count != this.countA) return false;
		if (b != null && b.count != this.countB) return false;
		return true;
	};
}
function calculateEnergy() {
	var energy = 0;
	for(j=0;j<i;j++) {
		energy += 0.5 * balls[j].mass * (Math.pow(balls[j].vx, 2) + Math.pow(balls[j].vy, 2));
	}
	return energy;
}

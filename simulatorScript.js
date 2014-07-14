var balls = [];
var i = 0; //number of balls
var running = false; // simulation not running yet
var repeater = null; // Holds the interval object.
var dt = 1;
var mspf = 50/3; //milliseconds per frame
function start() {
    balls[i] = new Ball();
    // Note: ball number counts from 0. i.e., first ball created is #0.
	balls[i].drawIt();
	if(!running){
		repeater = setInterval(function(){stepForward()}, mspf);
		running = true;
	}
	i++;
}

function stop() {
  clearInterval(repeater);
  running = false;
}


function stepForward(){
	ctx.clearRect(0,0,750,750);
	for(j=0;j<i;j++) {
		balls[j].moveIt();
		balls[j].drawIt();
		if (balls.length > 1 ) {
			for(k=(j+1);k<i;k++) {
				if (Math.sqrt(Math.pow(balls[j].px-balls[k].px, 2)+Math.pow(balls[j].py-balls[k].py, 2)) <= (balls[j].radius+balls[k].radius)) {
					balls[j].collide(balls[k]);
				}
			}
		}
	}
}
function Ball(px, py, vx, vy, radius, mass) {
	this.px = px;
	if (typeof px == 'undefined' || px <= 0) {
		this.px = Math.round(Math.random()*740)+5;
	}
	this.py = py;
	if (typeof py == 'undefined' || py <= 0) {
		this.py = Math.round(Math.random()*740)+5;
	}
	this.vx = vx;
	if (typeof vx == 'undefined' || Math.abs(vx) <= .1) {
		this.vx = Math.ceil(Math.random()*8 -4);
        if(this.vx==0) this.vx=1;
	}
	this.vy = vy;
	if (typeof vy == 'undefined' || Math.abs(vy) <= .1) {
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
	this.moveIt = function() {
		if ((this.px+this.radius) >= c.width || (this.px-this.radius) <= 0) this.vx = -this.vx; // Check if ball is at a wall
		if ((this.py+this.radius) >= c.height || (this.py-this.radius) <= 0) this.vy = -this.vy;// and change direction if true
		this.px += this.vx*dt;
		this.py += this.vy*dt;
	};
	this.drawIt = function() {
		ctx.beginPath();
		ctx.arc(this.px,this.py,this.radius,0,2*Math.PI);
		ctx.fill();
	};
	this.collide = function(that) {
		var dx = that.px - this.px;
		var dy = that.py - this.py;
		var dvx = that.vx - this.vx;
		var dvy = that.vy - this.vy;
		var dvdr = dx*dvx + dy*dvy; //dv dot dr
		var dist = this.radius + that.radius; //distance between particle centers at collision
		
		//normal force F, and x and y components
		var F = 2 * this.mass * that.mass * dvdr / ((this.mass + that.mass) * dist);
		var Fx = F * dx / dist;
		var Fy = F * dy / dist;

		//update velocities after applying normal force
		this.vx += Fx / this.mass;
		this.vy += Fy / this.mass;
		that.vx -= Fx / that.mass;
		that.vy -= Fx / that.mass;
	}
}

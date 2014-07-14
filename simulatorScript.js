var balls = [];
var i = 0; //number of balls
var running = false; // simulation not running yet
var repeater = null; // Holds the interval object.
var dt = 5;
function start() {
    balls[i] = new Ball();
    // Note: ball number counts from 0. i.e., first ball created is #0.
	balls[i].drawIt();
	if(!running){
		repeater = setInterval(function(){stepForward()}, 50/3);
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
	}
}
function Ball(px, py, vx, vy, radius) {
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
		this.vx = Math.ceil(Math.random()*4 -2);
        if(this.vx==0) this.vx=1;
	}
	this.vy = vy;
	if (typeof vy == 'undefined' || Math.abs(vy) <= .1) {
		this.vy = Math.ceil(Math.random()*4 -2);
        if(this.vy==0) this.vy=1;
	}
	this.radius = radius;
	if (typeof radius == 'undefined' || radius < 1) {
		this.radius = 3;
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
}

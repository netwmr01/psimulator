var ball = [];
var i = 0; //number of balls
var running = false; // simulation not running yet

function start() {
	ball[i] = new Ball();
    // Note: ball number counts from 0. i.e., first ball created is #0.
	ball[i].drawIt();
	if(!running){
		setInterval(function(){stepForward()}, (50/3));
		running = true;
	}
	i++;
}
function stepForward(){
	ctx.clearRect(0,0,750,750);
	for(j=0;j<i;j++) {
		ball[j].moveIt();
		ball[j].drawIt();
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
		this.vx = Math.ceil(Math.random()*4);
	}
	this.vy = vy;
	if (typeof vy == 'undefined' || Math.abs(vy) <= .1) {
		this.vy = Math.ceil(Math.random()*4);
	}
	this.radius = radius;
	if (typeof radius == 'undefined' || radius < 1) {
		this.radius = 3;
	}
	this.moveIt = function() {
		if ((px+radius) >= c.width || (px-radius) <= 0) vx = -vx; // Check if ball is at a wall
		if ((py+radius) >= c.height || (py-radius) <= 0) vy = -vy;// and change direction if true
		px += vx;
		py += vy;
	};
	this.drawIt = function() {
		ctx.beginPath();
		ctx.arc(px,py,radius,0,2*Math.PI);
		ctx.fill();
	};
}

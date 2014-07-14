var ball = [];
var i = 0; //number of balls
var running = false; // simulation not running yet

function start() {
	ball[i] = new Ball(Math.round(Math.random()*750), Math.round(Math.random()*750), Math.ceil(Math.random()*8)-4, Math.ceil(Math.random()*8)-4, 3);
    // Note: ball number counts from 0. i.e., first ball created is #0.
	ball[i].draw();
	if(!running){
		setInterval(function(){stepForward()}, (100/6));
		running = true;
	}
	i++;
}
function stepForward(){
	ctx.clearRect(0,0,750,750);
	for(n=0;n<=i;n++) {
		ball[n].move();
		ball[n].draw();
	}
}
function Ball(px, py, vx, vy, radius) {
	this.px = px;
	this.py = py;
	this.vx = vx;
	this.vy = vy;
	this.radius = radius;
	this.move = function() {
		if ((px+radius) >= c.width || (px-radius) <= 0) vx = -vx; // Check if ball is at a wall
		if ((py+radius) >= c.height || (py-radius) <= 0) vy = -vy;// and change direction if true
		px += vx;
		py += vy;
	};
	this.draw = function() {
		ctx.beginPath();
		ctx.arc(px,py,radius,0,2*Math.PI);
		ctx.fill();
	};
}

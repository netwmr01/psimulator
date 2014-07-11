var qwerty;
function start() {
	var ball1 = new Ball(50, 50, 1, 1);
	ball1.move();
}
function Ball(px, py, vx, vy) {
	this.px = px;
	this.py = py;
	this.vx = vx;
	this.vy = vy;
	var move = function() {
		alert("move");
	};
}

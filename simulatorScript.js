<<<<<<< HEAD
/*Copyright (c) 2014, Michael Pennington, William Harrington
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/

goog.require('goog.structs.PriorityQueue'); //import google priority queue
var balls = []; //array of balls
=======
var balls = [];
>>>>>>> master
var i = 0; //number of balls
var running = false; // simulation not running yet
var repeater = null; // Holds the interval object.
var step = 1; //redraws per clock tick (basically)
var pq = null;  //priority queue variable
var qCreated = false; // has the priority queue been created?
var t = 0; //total time
var debug=true;
var logflag=false;
var myVar=0;
var event1, event2, event3; //events to go into the pq (evt1: balltoball collision, evt2+3 balltowall collision
function start() {
<<<<<<< HEAD

    debuglog('entering function start()');
          
	if(!running) {
=======
	balls[i] = new Ball();
    // Note: ball number counts from 0. i.e., first ball created is #0.
	balls[i].drawIt();
	if(!running){
		setInterval(function(){stepForward()}, (50/3));
>>>>>>> master
		running = true;
		if(!qCreated) { 
			pq = new goog.structs.PriorityQueue();
			qCreated = true;
		}
        debuglog('about to call mainLoop');

		myVar=setInterval(function(){mainLoop();},20);
	}
}
<<<<<<< HEAD


function mainLoop() { //simulation
      
     debuglog('start of mainLoop()');
     

	 
     
        do {
        debuglog('in while loop');
		
        
		var e = pq.peek();
        debuglog("event valid? "+e.isValid());
          
		if (!e.isValid()) { pq.dequeue();continue;}
		var a = e.a;
		var b = e.b;

        debuglog("balls.length "+balls.length);
		
		
		var dt = e.time -t;
        debuglog("event time: "+e.time);
        debuglog("number of redraw: "+dt);
        debuglog("step is: "+step);

        //move all the points and redraw them if there are more than one step from now till event
        if (Math.floor(dt) > step)
        {
            t=t+step; //move time forward by step
            moveAll(step); //move points
            redraw();      //redraw
 
        }
        //no need to step, handle the actual event
        else 
        {
            moveAll(dt);
            redraw();
            pq.dequeue;  //actually remove the event, as we handled it already
		    t = e.time;  //move to actual event time
            if	(a != null && b != null) {debuglog("collided");debuglog(a); debuglog(b);a.collide(b);}
		    else if (a != null && b == null) a.collideWithVerticalWall();
		    else if (a == null && b != null) b.collideWithHorizontalWall();

		    predict(a);
		    predict(b);
            debuglog(pq);
            debuglog(pq.getCount());
                
		    document.getElementById("energy").value = calculateEnergy();
        
        }
		
        debuglog(e);
		
        
		
	} while (!pq.isEmpty() && running && !debug)
=======
function stepForward(){
	ctx.clearRect(0,0,750,750);
	for(j=0;j<i;j++) {
		balls[j].moveIt();
		balls[j].drawIt();
	}
>>>>>>> master
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
    debuglog("Ball #" + i + " created.");
	i++;
}

function generateBalls(amount) {
	if(!qCreated) { 
		pq = new goog.structs.PriorityQueue();
		qCreated = true;
	}

    var newI = i + amount; // Updated number of balls.
	for(i;i<newI;i++) {
		balls[i] = new Ball();
		balls[i].drawIt();
	}
	predictAll();
}

function predictAll() {
	for(j=0;j<i;j++) { // Step through all the balls
		if (balls.length > 1 ) {
			for(k=(j+1);k<i;k++) {
				event3 = new Event(balls[j].timeToHitParticle(balls[k]), balls[j], balls[k]);
				if (event3.isValid() && (event3.time != Number.POSITIVE_INFINITY)) 
                     pq.enqueue(event3.time, event3);
			}
		}
		event1 = new Event(balls[j].timeToHitVerticalWall(), balls[j], null);
		event2 = new Event(balls[j].timeToHitHorizontalWall(), null, balls[j]);
		if (event1.time != Number.POSITIVE_INFINITY) pq.enqueue(event1.time, event1);
		if (event2.time != Number.POSITIVE_INFINITY) pq.enqueue(event2.time, event2);
	}
}

function predict(a) {
    
        debuglog("predicting");
        debuglog("before adding new event to pq size: "+pq.getCount());
	if (a==null) return;
	for(j=0;j<balls.length;j++) {
                if(balls[j]!=a) 
                {   
                    event3 = new Event(a.timeToHitParticle(balls[j])+t, a, balls[j]);
		    if(event3.time!= Number.POSITIVE_INFINITY) pq.enqueue(event3.time, event3);
                }
	}
	event1 = new Event(a.timeToHitVerticalWall()+t, a, null);
	event2 = new Event(a.timeToHitHorizontalWall()+t, null, a);
	if (event1.time != Number.POSITIVE_INFINITY) pq.enqueue(event1.time, event1);
	if (event2.time != Number.POSITIVE_INFINITY) pq.enqueue(event2.time, event2);
        debuglog("after adding new event to pq size: "+pq.getCount());
}

function stop() {
  running = false;
  clearInterval(myVar);
}

function redraw() {
	ctx.clearRect(0,0,750,750);
	var j;
	for (j = 0; j < (balls.length); j++) {
		balls[j].drawIt();
	}	

	setTimeout(function() {}, 10);
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

function debuglog(object)
{
    if(logflag==true) console.log(object);
}

function moveAll(dt)
{
     for(var index in balls) { debuglog(balls[index]);balls[index].moveIt(dt); }
}
function calculateEnergy() {
	var energy = 0;
    var t1;
    var t2;
    var t3; // Temporary variables
    var j;

	for(j=0;j<i;j++) {
		//energy += 0.5 * balls[j].mass * (Math.pow(balls[j].vx, 2) + Math.pow(balls[j].vy, 2));

        t1 = balls[j].vx * balls[j].vx;
        t2 = balls[j].vy * balls[j].vy;
        t3 = 0.5 * balls[j].mass * (t1 + t2);
        debuglog("ball #" + j + ": energy = " + t3);
        energy += t3;
	}
	return energy;
}

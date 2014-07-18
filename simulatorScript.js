goog.require('goog.structs.PriorityQueue'); //import google priority queue
var balls = []; //array of balls
var i = 0; //number of balls
var running = false; // simulation not running yet
var repeater = null; // Holds the interval object.
var step = 1; //redraws per clock tick (basically)
var pq = null;  //priority queue variable
var qCreated = false; // has the priority queue been created?
var t = 0; //total time
var debug=true;
var myVar=0;
var event1, event2, event3; //events to go into the pq (evt1: balltoball collision, evt2+3 balltowall collision
function start() {

    console.log('entering function start()');
          
	if(!running) {
		running = true;
		if(!qCreated) { 
			pq = new goog.structs.PriorityQueue();
			qCreated = true;
		}
        console.log('about to call mainLoop');
   
		myVar=setInterval(function(){mainLoop();},20);
	}
}


function mainLoop() { //simulation
      
     console.log('start of mainLoop()');
     

	 
     
        do {
        console.log('in while loop');
		
        
		var e = pq.dequeue();
        console.log("event valid? "+e.isValid());
          
		if (!e.isValid()) continue;
		var a = e.a;
		var b = e.b;

        console.log("balls.length "+balls.length);
		
		
		var dt = e.time -t;
        console.log("event time: "+e.time);
        console.log("number of redraw: "+dt);
        console.log("step is: "+step);
	/*	for(j=0;j<Math.floor(redrawcounter);j=j+step)
		{
            console.log("Redraw loop, this is J: "+j);
            moveAll(step);
			setTimeout(function() {redraw();}, 10);
		}
		moveAll(redrawcounter-Math.floor(redrawcounter));
        console.log(e);*/
                moveAll(dt);
                redraw();
		t = e.time;
		
        
		if	(a != null && b != null) {console.log("collided");console.log(a); console.log(b);a.collide(b);}
		else if (a != null && b == null) a.collideWithVerticalWall();
		else if (a == null && b != null) b.collideWithHorizontalWall();

		predict(a);
		predict(b);
                console.log(pq);
                console.log(pq.getCount());
                
		document.getElementById("energy").value = calculateEnergy();
	} while (!pq.isEmpty() && running && !debug)
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
    console.log("Ball #" + i + " created.");
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
    
        console.log("predicting");
        console.log("before adding new event to pq size: "+pq.getCount());
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
        console.log("after adding new event to pq size: "+pq.getCount());
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

function moveAll(dt)
{
     for(var index in balls) { console.log(balls[index]);balls[index].moveIt(dt); }
}
function calculateEnergy() {
	var energy = 0;
	for(j=0;j<i;j++) {
		energy += 0.5 * balls[j].mass * (Math.pow(balls[j].vx, 2) + Math.pow(balls[j].vy, 2));
	}
	return energy;
}

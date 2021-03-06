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
                if(this.px > 740) this.px= 740;
                if(this.px < 0) this.px=0;
		this.py += this.vy * dt;
                if(this.py > 740) this.py= 740;
                if(this.py < 0) this.py=0;
	};
	this.drawIt = function() {
		ctx.beginPath();
		ctx.arc(this.px,this.py,this.radius,0,2*Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
	};
	this.collide = function(that) {
        
        var ene=0;
        ene += 0.5 * this.mass * ((this.vx *this.vx) + (this.vy*this.vy));
        ene += 0.5 * that.mass * ((that.vx *that.vx) + (that.vy*that.vy));

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
		that.vy -= Fy / that.mass;
                var afterene=0.5 * this.mass * ((this.vx *this.vx) + (this.vy*this.vy))+
                             0.5 * that.mass * ((that.vx *that.vx) + (that.vy*that.vy));

                if( Math.abs(afterene
                     - ene) >0.5) 
                     {debuglog("energy changed"); debuglog("before: "+ene+" after:"+afterene+" dvdp: "+dvdp+" dist: "+dist);
                      debuglog(this);debuglog(that); debuglog("dvx: "+dvx+" dvy: "+dvy); alert("energy changed");}

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
		if		(this.vx>0) return ((c.width) - this.px - this.radius) / this.vx;
		else if (this.vx<0) return (this.radius - this.px) / this.vx;
		else 				return Number.POSITIVE_INFINITY;
	};
        
	this.timeToHitHorizontalWall = function() {
		if		(this.vy>0) return ((c.width) - this.py - this.radius) / this.vy;
		else if (this.vy<0) return (this.radius - this.py) / this.vy;
		else 				return Number.POSITIVE_INFINITY;
	};
	this.timeToHitParticle = function(b) {
		var a = this;
		if (a == b) return Number.POSITIVE_INFINITY;
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
                if (dpdp < sigma*sigma) 
                {
                    debuglog("<overlapping particles>");
                    debuglog(a);
                    debuglog(b);
                    debuglog("<overlapping particles>");
		}
                if (d<0) return Number.POSITIVE_INFINITY;
                var returnValue=-(dvdp + Math.sqrt(d)) / dvdv;
                if(isNaN(returnValue)) 
                {
                    debuglog ("dvdv:"+dvdv+" dvdp:"+dvdp+" d:"+d);
                    debuglog("time to Hit = NaN");
                    returnValue=Number.POSITIVE_INFINITY;
                }
		return returnValue;
	};
}

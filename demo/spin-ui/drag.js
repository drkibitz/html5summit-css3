var events
if ('ontouchend' in document) {
     events = {
         down : 'touchstart',
         move : 'touchmove',
         up   : 'touchend'
     }
 }
 else {
     events = {
         down : 'mousedown',
         move : 'mousemove',
         up   : 'mouseup'
     }
 }

function Box(inElement)
{
	var self = this, nodes;


	this.element = inElement;
	this.boxes = (function () {
		var boxes = [];
		for (var i = 0; i < inElement.childNodes.length; ++i) {
			if (3 !== inElement.childNodes[i].nodeType) {
				boxes.push(inElement.childNodes[i]);
			}
		}
		return boxes;
	})();

	this.rotation = [-40,-20,0,20,40];
	this.element.addEventListener(events.down, this, false);
}

Box.prototype = 

{	

	get rotation()
	{
		return this._rotation;
	},
	
	set rotation(rotArray)
	{
		for(var i=0; i<this.boxes.length; i++)
		{
			this.boxes[i].style.webkitTransform = 'rotateY(' + rotArray[i] + 'deg) translateZ(170px)';
		} 
		
		this._rotation = rotArray
	},
	
	

	get x()
	{
		return parseInt(this._position.split(',')[0],10);
	},
	 
	set x(inX)
	{
		var comps = this._position.split(',');
		comps[0] = inX;
		this.position = comps.join(',');
	},
	 

	
	onmousedown: function(e)
	{
		this.startX = 'ontouchend' in document ? e.touches[0].clientX : e.clientX;
		for (var i=0; i<this.boxes.length; ++i)
		{
			this.boxes[i].style.webkitTransition = '';
		}
		window.addEventListener(events.move, this, false);
		window.addEventListener(events.up, this, false);
	},
	
	onmousemove: function(e)
	{	
		var leftDelta = 'ontouchend' in document ? e.touches[0].clientX - this.startX : e.clientX - this.startX;
/* 		var leftDelta = e.clientX - this.startX; */
		
		var rots = this._rotation;
		
		//Iterate through all elements and rotate them by leftdelta (to be converted later)
		if(this._rotation[0] > 8)
		{
			this.rotation = [9,29,49,69,89];
		}
		
		else if(this._rotation[0] < -88)
		{
			this.rotation = [-89,-69,-49,-29,-9];
		}
		else{
			
			var newrots = [];
			for (var i=0; i<this._rotation.length; ++i)
			{
				newrots[i] = this._rotation[i]+leftDelta*0.35;
			}
			this.rotation = newrots;
		}
		
		/*
		var newLeft = (this.x) + leftDelta;
		if (newLeft < minLeft){ newLeft = minLeft; }
		if (newLeft > maxLeft){ newLeft = maxLeft; }
		this.position = newLeft + ',0';
		*/

		this.startX = 'ontouchend' in document ? e.touches[0].clientX : e.clientX;
/* 		document.getElementById('show').innerHTML = leftDelta; */
	},
	
	onmouseup: function(e)
	{
	//go through all elements
	//if an element rotation is between -40 and 40. that's the center
	//then calculate how many degrees it's required to move this to 0
	
		var deltaSnapRotation = 0;
		for(var i=0; i<this._rotation.length; ++i)
		{
			var rot = this._rotation[i];
			if (rot > -10 && rot < 10) {
				deltaSnapRotation = -rot;
				break;
			}
		}
		
		for (var i=0; i<this.boxes.length; ++i)
		{
			this.boxes[i].style.webkitTransition = '-webkit-transform .1s ease-in-out';
		}
		
		var newrots = []
		
		for(var i=0; i<this._rotation.length; ++i)
		{
			newrots[i] = this._rotation[i]+deltaSnapRotation;
		}
		
		this.rotation = newrots;

		
		window.removeEventListener(events.move, this, false);
		window.removeEventListener(events.up, this, false);
	},
	
	handleEvent: function(e) {
		e.preventDefault();
		switch(e.type){
			case events.down : this.onmousedown(e); break;
			case events.move : this.onmousemove(e); break;
			case events.up : this.onmouseup(e); break;
		}
	}

}

function loaded()
{
    new Box(document.getElementById('drag-area'));
    new Box(document.getElementById('drag-area2'));
    new Box(document.getElementById('drag-area3'));
    new Box(document.getElementById('drag-area4'));
    new Box(document.getElementById('drag-area5'));
    new Box(document.getElementById('drag-area6'));
}

window.addEventListener('load', loaded, true);
document.ontouchmove = function(e){
	e.preventDefault();
}
/*

easings:

linear      output = input
ease        cubic-bezier(0.25, 0.1, 0.25, 1.0)
ease-in     cubic-bezier(0.42, 0, 1.0, 1.0)
ease-out    cubic-bezier(0, 0, 0.58, 1.0)
ease-in-out cubic-bezier(0.42, 0, 0.58, 1.0)

// define P1 and P2 where P0 == (0,0) and P3 == (1,1)
cubic-bezier(x1, y1, x2, y2)

// friction
cubic-bezier(0.2, 0.4, 0.4, 0.8)

  y
1 |                  P3
  |      x2,y2
  |
  |
  |
  |  x1,y1
  |
  |
  |
0 | P0
  ---------------------x
  0                   1

*/
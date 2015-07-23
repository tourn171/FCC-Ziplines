var canvas = document.getElementById('clockFace').getContext('2d'),
	W = canvas.canvas.width,
	H = canvas.canvas.height,
	audio = new Audio("resources/clock/3beeps.mp3"),
	PI = Math.PI, // PI constant
	// variables for display construction	
	padding = 5,
	digitWidth = 40,
	green = "#39FF14",
	gray = "#212121",
	// array storage for digits
	mainDigits = [],
	breakDigits = [],
	// event flags
	breakTime = false,
	running = false,
	// timing related global variables
	counter = 0,
	breakLength,
	tomatoLength,
	count;



//////////////////////////
// Animation loop logic //
//////////////////////////

// render function renders display units
// loops through digit arrays and calls draw function
// draws dot dependant on state

function render() {
	for (var i = 0; i < mainDigits.length; i++) {
		mainDigits[i].draw();
	}
	for (var i = 0; i < breakDigits.length; i++) {
		breakDigits[i].draw();
	};
	if (dot.state) {
		dot.draw(green);
	} else {
		dot.draw(gray);
	}
}

// update function logic controlling the update of the display
// state dependant update for which display will be running

function update() {

	if (dot.state) {
		dot.state = false;
	} else {
		dot.state = true;
	}

	if (count.sec + 1 > 60) {
		count.min++;
	} else {
		count.sec++;
	}


	if (breakTime) {
		updateTime(count, breakLength, breakDigits, false);
	} else {
		updateTime(count, tomatoLength, mainDigits, true);
	}
	breakLength.setString(breakLength.min, breakLength.sec);
	tomatoLength.setString(tomatoLength.min, tomatoLength.sec);
	setTime(breakLength.string, breakDigits);
	setTime(tomatoLength.string, mainDigits);
}

// main animation loop

function updateTime(obj1, obj2, set, state) {
	var reset = false;
	if (obj1.compare(obj2)) {
/*		obj2.sec--;*/
		breakTime = state;
		reset = true;
		audio.play();
	} else {
		if (obj2.sec == 0) {
			obj2.sec = 59;
			obj2.min--;
		} else {
			obj2.sec--;
		}

	}

	if (reset) {
		obj1.reset();
		obj2.reset();
	}
}


function animate() {

	canvas.clearRect(0, 0, W, H);
	render();

	if (running) {
		update();
	}

	//	console.log("rendered");

	setTimeout(animate, 1000);

}

/////////////
// Objects // 
/////////////

// digit object constructor
// @params {number} x starting x position of segment a
//         {number} y starting y position of segment a
//         {number} width width in pixels of segment
//         {number} height height in pixels of segment
//         {number} space number of pixels between segment peices

function digit(x, y, width, height, space) {
	this.startx = x;
	this.starty = y;
	this.width = width;
	this.height = height;
	this.digitSpace = space;
	this.on = green;
	this.off = gray;
	this.position = {
		"a": {
			"color": this.on,
			"startx": this.startx,
			"starty": this.starty,
			"angle": 0
		},
		"b": {
			"color": this.on,
			"startx": this.startx,
			"starty": this.starty + this.width + this.digitSpace,
			"angle": 90
		},
		"c": {
			"color": this.on,
			"startx": this.startx,
			"starty": this.starty + this.width + this.digitSpace,
			"angle": 270
		},
		"d": {
			"color": this.on,
			"startx": this.startx,
			"starty": this.starty + this.width * 2 + this.digitSpace * 2,
			"angle": 0
		},
		"e": {
			"color": this.on,
			"startx": this.startx - this.width - this.digitSpace,
			"starty": this.starty + this.width + this.digitSpace,
			"angle": 270
		},
		"f": {
			"color": this.on,
			"startx": this.startx - this.width - this.digitSpace,
			"starty": this.starty + this.width + this.digitSpace,
			"angle": 90
		},
		"g": {
			"color": this.on,
			"startx": this.startx,
			"starty": this.starty + this.width + this.digitSpace,
			"angle": 0
		},

	};

}

// digit draw function calls createSegment with segment information

digit.prototype.draw = function () {
	for (var prop in this.position) {
		var current = this.position[prop];
		createSegment(current.startx, current.starty, this.width, this.height, current.color, current.angle);
	}
}

// function sets digits number turns correct segments "on" and "off" dependant of input
// @params {number} n number to set digit to

digit.prototype.setNumber = function (n) {

	var pos = this.position;
	for (var prop in pos) {
		var current = pos[prop];
		current.color = this.on;
	}

	switch (n) {
		case 0:
			pos.g.color = this.off;
			break;

		case 1:
			pos.a.color = this.off;
			pos.d.color = this.off;
			pos.e.color = this.off;
			pos.f.color = this.off;
			pos.g.color = this.off;
			break;
		case 2:
			pos.c.color = this.off;
			pos.f.color = this.off;
			break;
		case 3:
			pos.e.color = this.off;
			pos.f.color = this.off;
			break;
		case 4:
			pos.a.color = this.off;
			pos.d.color = this.off;
			pos.e.color = this.off;
			break;
		case 5:
			pos.b.color = this.off;
			pos.e.color = this.off;
			break;
		case 6:
			pos.b.color = this.off;
			break;
		case 7:
			pos.d.color = this.off;
			pos.e.color = this.off;
			pos.f.color = this.off;
			pos.g.color = this.off;
			break;
		case 8:
			break;
		case 9:
			pos.e.color = this.off;
			break;
	}

}

// Object litteral representation of the colon on the clock

var dot = {
	state: "on",

	// draw function for the object
	// @params {string} string representation of the color to draw the colon

	draw: function (color) {

		canvas.beginPath()
		canvas.fillStyle = color;
		canvas.arc(W / 2, H / 2 - 10, 5, 0, PI * 2);
		canvas.fill();
		canvas.closePath();
		canvas.beginPath();
		canvas.arc(W / 2, H / 2 + 10, 5, 0, PI * 2);
		canvas.fill();
		canvas.closePath();
	}
}

function timeObject(min, sec) {
	this.startMin = min;
	this.startSec = sec;
	this.min = min;
	this.sec = sec;
	this.string = pad(min, 2) + pad(sec, 2);
}

timeObject.prototype.compare = function (obj) {
	if (obj.hasOwnProperty("min") && obj.hasOwnProperty("sec")) {
		if (obj.startMin == this.min && obj.startSec < this.sec) {
			return true;
		} else {
			return false;
		}
	} else {
		throw "Object property not defined";
	}
}

timeObject.prototype.setString = function (min, sec) {
	this.string = pad(min, 2) + pad(sec, 2);
}

timeObject.prototype.reset = function () {
	this.min = this.startMin;
	this.sec = this.startSec;
	this.setString(this.min, this.sec);
}


//////////////////////
// Helper functions //
//////////////////////


//function createSegment places path to correct position draws and fills digit segment
// @params {number} startx starting x position of segment
//         {number} starty starting y position of segment
//         {number} width width of segment piece (on rotation this affects y axis)
//         {number} height height of segment piece (on rotation this affects x axis)
//         {string} color string representation of color code for fill style
//         {number} angle number in degrees to rotate segment

function createSegment(startx, starty, width, height, color, angle) {
	canvas.save();
	if (angle > 0) {
		canvas.translate(startx, starty);
		canvas.rotate(angle * (PI / 180));
		startx = 0;
		starty = 0;
	}
	canvas.beginPath();
	canvas.lineJoin = "round";
	canvas.moveTo(startx, starty);
	canvas.lineTo(startx - 5, starty - height / 2);
	canvas.lineTo(startx - width, starty - height / 2);
	canvas.lineTo(startx - width - 5, starty);
	canvas.lineTo(startx - width, starty + height / 2);
	canvas.lineTo(startx - 5, starty + height / 2);
	canvas.lineTo(startx, starty);
	canvas.fillStyle = color;
	canvas.closePath();
	canvas.fill();
	canvas.restore();
}


// function init initializes digit arrays fills object data

function init() {
	mainDigits.push(new digit(W / 2 - digitWidth - padding * 2, H / 2 - 25, 20, 5, 5));
	mainDigits.push(new digit(W / 2 - padding * 2, H / 2 - 25, 20, 5, 5));
	mainDigits.push(new digit(W / 2 + digitWidth, H / 2 - 25, 20, 5, 5));
	mainDigits.push(new digit(W / 2 + digitWidth * 2 + padding, H / 2 - 25, 20, 5, 5));

	breakDigits.push(new digit(W / 2 - digitWidth - padding * 2, H / 2 + digitWidth, 5, 1, 5));
	breakDigits.push(new digit(W / 2 - padding * 2, H / 2 + digitWidth, 5, 1, 5));
	breakDigits.push(new digit(W / 2 + digitWidth, H / 2 + digitWidth, 5, 1, 5));
	breakDigits.push(new digit(W / 2 + digitWidth * 2 + padding, H / 2 + digitWidth, 5, 1, 5));

	initTime();
}

// function initTime initializes timers sets main and break timer to respective values

function initTime() {

	tomatoLength = new timeObject(0, 0);
	breakLength = new timeObject(0, 0);
	count = new timeObject(0, 0);

	setTime(tomatoLength.string, mainDigits);

	setTime(breakLength.string, breakDigits);

}

function setTime(str, set) {

	str.split("").forEach(function (current, index) {
		set[index].setNumber(Number(current));
	});
}

function pad(n, to) {
	var zeroFill = "00000";
	n = Math.abs(n);
	return (zeroFill + n).slice(-to);
}


$(document).ready(function () {

	init();
	animate();


	$("#runToggle").click(function () {
		if (running == false) {
			running = true;
		} else {
			running = false;
		}
	});

	$("#breakMinus").click(function () {
		breakLength.startMin--;
		breakLength.min = breakLength.startMin;
		breakLength.setString(breakLength.startMin, breakLength.sec);
		setTime(breakLength.string, breakDigits);
		render()
	});
	$("#breakPlus").click(function () {
		breakLength.startMin++;
		breakLength.min = breakLength.startMin;
		breakLength.setString(breakLength.startMin, breakLength.sec);
		setTime(breakLength.string, breakDigits);
		render();
	});
	$("#sessionMinus").click(function () {
		tomatoLength.startMin--;
		tomatoLength.min = tomatoLength.startMin;
		tomatoLength.setString(tomatoLength.startMin, tomatoLength.sec);
		setTime(tomatoLength.string, mainDigits);
		render();
	});
	$("#sessionPlus").click(function () {
		tomatoLength.startMin++;
		tomatoLength.min = tomatoLength.startMin;
		tomatoLength.setString(tomatoLength.startMin, tomatoLength.sec);
		setTime(tomatoLength.string, mainDigits);
		render();
	});

	$("#reset").click(function () {
		tomatoLength.reset();
		breakLength.reset();
		count.reset();
		setTime(breakLength.string, breakDigits);
		setTime(tomatoLength.string, mainDigits);
		render();
	});


});

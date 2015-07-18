var quotes = {
				"MC Hammer": "Can't Touch This",
				"Vanilla Ice": "If there was a problem, yo I'll Solve it check out the hook while my dj revoves it",
				"C&C Music Factory": "Everybody Dance Now",
				"Britney Spears": "I must confess, my loneliness is killing me now don't you know I still belive, that you will be here just give me a sign Hit me baby one more time",
				"Alanis Morrissette": "It's like rain on your wedding day, It's a free ride when your already late, it's the good advice that you just can't take, and who would've though it figures",
				"Gwen Stefani": "Oh, I'm Just a girl, guess I'm some kind of freak 'Cause they all sit and stare with their eyes",
				"Beck": "In the time of chimpanzees I was a monkey butane in my veins so I'm out to cut the junkie. with the plastic eyballs spray paint the vegetables dog food stalls with the beefcake pantyhose kill the headlights and put it in neutral stock car flamin' with a loser and the cruise control baby's in Reno with the vitamin D got a couple of couches sleep on the love seat...",
				"Green Day": "I went to a shrink to analyze my dreams she says it's lack of sex that's bringing me down I went to a whore he said my life's a bore so quit my whining cause it's bringing her down",
				"Chumbawamba": "I get knocked down but I get up again No you're never gonna keep me down",
				"Barenaked Ladies": "Chickity China the Chinese chicken You have a drumstick and your brain stops tickin' Watchin X-Files with no lights on, We're dans la maison I hope the Smoking Man's in this one Like Harrison Ford I'm getting Frantic Like Sting I'm Tantric Like Snickers, guaranteed to satisfy Like Kurosawa I make mad films Okay I don't make films But if I did they'd have a samurai Gonna get a set of better clubs Gonna find the kind with tiny nubs Just so my irons aren't always flying off the back swing Gotta get in tune with Sailor Moon Cause that cartoon has got the boom anime babes That make me think the wrong thing",
				"Steve Buchemi, Con-Air": "'Define irony'. A bunch of idiots dancing on a plane to a song made famous by a band that died in a plan crash.",
				"Dante, Clerks": "I'm not even supposed to be here today",
				"Tom Hanks, Forest Gump": "My momma always said life is like a box of chocolates, you never know what you're gonna get",
				"Yoda, Star Wars The Phantom Menace": "Fear leads to anger, anger leads to hate, hate leads to suffering",
				"Samuel L Jackson, Pulp Fiction": "English, motherf%$# do you speak it?",
				"Adam Sandler, Happy Gilmore": "The price is wrong, b%$&@",
				"Bill Murray, Groundhog Day": "Well, What if there is no tomorrow? There wasn't one today",
				"Chris Tucker, Rush Hour": "Do you understand the words that are coming out of my mouth?",
				"Bill Clinton": "I did not have sexual relations with that woman",
				"Johnny Cochran": "If the gloves don't fit you must acquit",
				"soup Nazi": "No soup for you!",
				"Kyle": "Oh my god they killed Kenny",
				"Ms Frizzle": "Take chances, make mistakes, and get messy",
				"Jennifer Aniston, Friends": "It's not that common, it doesn't happen to every guy and it is a big deal",
				"ME": "Quote(why is it so hard to find good 90's quotes I have been looking for hours and this is seriously all I came up with WTF",
		},
		button = document.getElementById('button'),
		quoteBox = document.querySelector(".quote");

function getRand(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
}

button.addEventListener("click", function() {
		var rand = getRand(0, 25);

		var quote = getQuote(rand);
		setQuote(quote);
})

function setQuote(quote) {
		quoteBox.innerHTML = quote;
}

function getQuote(num) {

		var keys = [];

		for (key in quotes) {
				keys.push(key);
		}

		var key = keys[num];

		//setTwitter(quotes[key]);

		return quotes[key] + " :<br /><b><em>" + key + "<em><b>";

}

var mouse = {},
		particles = [];

document.addEventListener("mousemove", function(e) {
		mouse.x = e.pageX;
		mouse.y = e.pageY;
});

function getRandColor() {
		var r = getRand(0, 255);
		var g = getRand(0, 255);
		var b = getRand(0, 255);

		return "rgb(" + r + "," + g + "," + b + ")";
}

var mouse = {},
    particles = [];

function animate() {
	

			for (var i = 0; i < particles.length; i++) {
				particles[i].move();
			}
			setTimeout(animate, 1000/60);
		
}

document.onmousemove = function(e) {
		mouse.x = e.pageX - 10;
		mouse.y = e.pageY - 10;

		if (particles.length < 100) {
				createDiv();
		}
}

particle = function(obj) {

		this.obj = obj;
		this.vx = getRand(-10, 10);
		this.vy = getRand(-10, 10);
		this.life = 100;
}

particle.prototype.move = function() {

		if (this.life > 0 && parseInt(this.obj.style.top) > 1) {
				this.obj.style.left = (parseInt(this.obj.style.left) + this.vx) + "px";
				this.obj.style.top = (parseInt(this.obj.style.top) + this.vy) + "px";;
				this.life -= 10;
		} else {
				this.obj.style.left = mouse.x + "px";
				this.obj.style.top = mouse.y + "px";
				this.life = 100;
			  this.obj.style.background = getRandColor();
		}

}

function createDiv() {
		var newDiv = document.createElement('div');
		newDiv.className = "particle";
		newDiv.style.left = mouse.x + "px";
		newDiv.style.top = mouse.y + "px";
		newDiv.style.background = getRandColor();
		newDiv.style.zIndex = "900";
		newDiv.onclick = function(e) {
				e.preventDefault();
		}
		document.body.appendChild(newDiv);

		var divs = document.querySelectorAll(".particle");

		var current = divs[divs.length - 1];

		particles.push(new particle(current));

}

var counter = [
		getRand(1, 5),
		getRand(1, 9),
		getRand(1, 9),
		getRand(1, 9),
		getRand(1, 9),
		getRand(1, 9),
		getRand(1, 9),
		getRand(1, 9),
		getRand(1, 9),
];

var countBox = document.getElementById("counter");

function setCounter(ctr) {
		for (var i = 0; i < ctr.length; i++) {
				var newDiv = document.createElement('div');
				newDiv.className = "number";
				newDiv.innerHTML = ctr[i];
				countBox.appendChild(newDiv);
		}
}


(function() {
		var rand = getRand(0, 25)
		var quote = getQuote(rand);
		setQuote(quote);
		setCounter(counter);
		animate();

}());


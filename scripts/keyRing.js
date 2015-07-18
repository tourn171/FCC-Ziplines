  //////////////////////////////////////////////////////
 // Script to load API data from JSON file on server //
//////////////////////////////////////////////////////

/*
*
*/

// base url http://tourn171.github.io/FCC-Ziplines/

function Keys(){
	
	Mediator.call(this);
	
	this.data;
	this.loaded = false;
	this.url = "keys.json";
	
}

Keys.prototype = Object.create(Mediator.prototype);

Keys.prototype.constructor = Keys;

Keys.prototype.loadKeys = function(){
	
	
	console.log(this.url);

	var obj = this;
	
	$.getJSON(this.url, function(data){
		obj.data = data;

		obj.loaded = true;
		obj.trigger("loadkeys");
		
	}).error(function(data){console.error(data)});
}



var keyRing = new Keys();



//keyRing.loadKeys();



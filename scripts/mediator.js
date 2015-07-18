  ///////////////////////////////////////
 // Mediator object for custom Events //
///////////////////////////////////////


/**
* Represents a mediator object handleing events - to be super of other objects
* @constructor
*/

function Mediator() {

	this._events = {};

}


Mediator.prototype = {

	/*
	* Subscriber function
	* @param {string} event - string containing the event name
	* @param {requestCallback} cb - event handler callback
	*/
	
	on: function(event, callback){
		

		

		if(typeof this._events[event] === 'undefined'){
			

			this._events[event] = [];
		}
		
		this._events[event].push(callback);

	},
	
	/*
	* Fire event for the subscriber
	* @param {string} event - string containing the event name
	* @param {*} data - data to pass to the callback
	*/
	
	trigger: function(event, data){
		

		if(typeof this._events[event] !== undefined){
			var length = this._events[event].length;
			for(var i = 0; i < length; i++){
				

				this._events[event][i](data);
			}
		}
	},
	
	/*
	* Removes all of an event type
	* @param {string} event - string containing the event name
	*/
	
	off: function(event){
		if(typeof this._events[event] !== undefined){
			this._events[event] = [];
		}
	}
}
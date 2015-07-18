var toggle = document.getElementById("toggle"),
	scale = "F",
	weather,
	tabClick = "false",
	geo;

  /////////////////////////////////
 // Logic for F to C conversion //
/////////////////////////////////


function convertFToC(scale, temp){
	if(scale == "C"){
		return (temp - 32) * (5/9);
	}
	else if(scale == "F"){
		return temp * (9/5) + 32;
	}
}

toggle.onclick = function(){
	var currentTemp = Number($("#temp").html());
	if(scale == "F"){
		scale = "C";
	}
	else if(scale == "C"){
		scale = "F";
	}
	var newTemp = convertFToC(scale,currentTemp);
	$("#temp").html(newTemp.toFixed(1));
	$("#grad").html(scale);
};


  /////////////////////////////////
 // Logic for the options tray //
////////////////////////////////

$(".tab").click(function(){
	
	if(!tabClick){
	
		$(this).animate({bottom: "0"},600);
		tabClick = true;
	}
	else{
		$(this).animate({bottom: "10%"},600);
		tabClick = false;
	}
	$(".options").slideToggle("slow");
});



  ////////////////////////////////////////////////////////
 // Logic for the actual weather and geocode API calls //
////////////////////////////////////////////////////////


function setData(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(posCallback, geo.errorHandler);
	}
	else{
		alert("Geolocation is not supported in this browser");
	}
}


function posCallback(pos){
	var lat = pos.coords.latitude.toFixed(4);
	var long = pos.coords.longitude.toFixed(4);

	geo.setCity(lat,long);
	weather = new ForcastIO(lat,long);

	weather.on('load',(function(obj){
		return function(){
			obj.loadWeather(obj);
		}
	}(weather)));
	
	
	weather.requestData();	
}


  ////////////////////////////////////////////////////
 // Helper functions for the API calls to set data //
////////////////////////////////////////////////////
	
	
function getTime(sunrise, sunset){
	var dt = new Date();
	if(dt.getHours() >= sunset || dt.getHours() <= sunrise){
		return true;
	}
	else{
		return false;
	}
}


function ForcastIO(lat, long){
	
	Mediator.call(this);

	this.lat = lat;
	this.long = long;
	this.key = keyRing.data.forecast;
	this.url = "https://api.forecast.io/forecast/";
	this.status;
	this.fullUrl =  this.url+this.key+"/"+this.lat+","+this.long+"?callback=?";
	this.data;
	this.loaded = false;
	this.current;
	this.alert;
	this.daily;
	this.sunrise;
	this.sunset;
	this.iconDef ="http://tourn171.github.io/FCC-Ziplines/resources/weather/icons/weather-none-available.png";
	this.bgDef = "http://tourn171.github.io/FCC-Ziplines/resources/weather/backgrounds/clear_day.jpg";
	this.icons ={
			'clear-day': "http://tourn171.github.io/FCC-Ziplines/resources/weather/icons/weather-clear.png",
			'rain': "http://tourn171.github.io/FCC-Ziplines/resources/weather/icons/weather-showers-day.png",
			'snow': "http://tourn171.github.io/FCC-Ziplines/resources/weather/icons/weather-snow.png",
			'sleet':"http://tourn171.github.io/FCC-Ziplines/resources/weather/icons/weather-freezing-rain.png",
			'wind': "http://tourn171.github.io/FCC-Ziplines/resources/weather/icons/weather-clear.png",
			'fog':"http://tourn171.github.io/FCC-Ziplines/resources/weather/icons/weather-mist.png",
			'cloudy':"http://tourn171.github.io/FCC-Ziplines/resources/weather/icons/weather-clouds.png",
			'partly-cloudy-day':"http://tourn171.github.io/FCC-Ziplines/resources/weather/icons/weather-few-clouds.png",
			'hail':"http://tourn171.github.io/FCC-Ziplines/resources/weather/icons/weather-hail.png",
			'thunderstorm':"http://tourn171.github.io/FCC-Ziplines/resources/weather/icons/weather-storm-day.png",
			'tornado':"http://tourn171.github.io/FCC-Ziplines/resources/weather/icons/weather-storm.png",
			'clear-night': "http://tourn171.github.io/FCC-Ziplines/resources/weather/icons/weather-clear.png",
			'partly-cloudy-night':"http://tourn171.github.io/FCC-Ziplines/resources/weather/icons/weather-few-clouds-night.png"

		};
	
	this.bg = {
		'clear-day': 'http://tourn171.github.io/FCC-Ziplines/resources/weather/backgrounds/clear_day.jpg',
		'rain': 'http://tourn171.github.io/FCC-Ziplines/resources/weather/backgrounds/rain-night.jpg',
		'snow': 'http://tourn171.github.io/FCC-Ziplines/resources/weather/backgrounds/snow-day.jpg',
		'sleet':'http://tourn171.github.io/FCC-Ziplines/resources/weather/backgrounds/Sleet.jpg',
		'wind':'http://tourn171.github.io/FCC-Ziplines/resources/weather/backgrounds/windy.jpg',
		'fog':'http://tourn171.github.io/FCC-Ziplines/resources/weather/backgrounds/Fog.jpg',
		'cloudy':'http://tourn171.github.io/FCC-Ziplines/resources/weather/backgrounds/cloudy-day.jpg',
		'partly-cloudy-day':'http://tourn171.github.io/FCC-Ziplines/resources/weather/backgrounds/partly-cloudy-day.jpg',
		'hail':'http://tourn171.github.io/FCC-Ziplines/resources/weather/backgrounds/Hail.jpg',
		'clear-night': 'http://tourn171.github.io/FCC-Ziplines/resources/weather/backgrounds/clear-night.jpg',
		'partly-cloudy-night':'http://tourn171.github.io/FCC-Ziplines/resources/weather/backgrounds/partly-cloudy-night.jpg'
	}
	
	};


ForcastIO.prototype = Object.create(Mediator.prototype);

ForcastIO.prototype.constructor = ForcastIO;
	
ForcastIO.prototype.requestData = function(){
		var obj = this;


		$.getJSON(this.fullUrl, function(Json){

			obj.data = Json;
			obj.loaded = true;
			obj.trigger('load');
		});
	};


ForcastIO.prototype.loadWeather= function(self){
	
		
		self.current = self.data.currently;
		self.daily  = self.data.daily;
		self.alerts = self.data.alerts || [];

		
		if(self.alerts.length > 0){
			self.alerts.forEach(function(obj,index){

				var expiresUnix = new Date(obj.expires);
				var expires = timeConverter(expiresUnix);
						
				setAlert(obj.title+" in effect until: "+ expires,index);
				
			});
		}
		
		var today = self.daily.data[0];
		this.sunrise = unixTime(today.sunriseTime);
		this.sunset = unixTime(today.sunsetTime);
		
	
		$("#temp").html(self.current.temperature.toFixed(1));
		var percent = today.precipProbability;
	
		if(percent > 0){
			
			var percent = percent * 100;
			$('#chance').html(percent+"% chance of " + today.precipType);
		}
		else{
			$('#chance').html("No percipitation expected");
		}
		
		$("#wind").html(self.current.windSpeed);
		$("#bearing").html(self.current.windBearing+" ");
		$("#clouds").html(Number(self.current.cloudCover.toFixed(1)) * 100+"%");
		$("#phase").html(today.moonPhase);
		$("#humid").html(self.current.humidity * 100);
		$("#vis").html(self.current.visibility+" ");
		$("#hi").html(today.temperatureMax);
		$("#low").html(today.temperatureMin);
		$("#hiTime").html(unixTime(today.temperatureMaxTime));
		$("#lowTime").html(unixTime(today.temperatureMinTime));
		$("#sunrise").html(sunrise);
	  $("#sunset").html(sunset);
	  $("#sunset").html(sunset);
	

		for(var i = 1; i < 5; i++){
			
			var current = self.daily.data[i];

			$('.extended').append(this.appendDays(current));
		}
		$('.day').filter(':first').addClass('col-md-offset-2');
	

		$('.weatherIcon img').attr('src', self.getIcon(today.icon));
	
		$('.content').css({'background-image': 'url('+self.getBackground(self.data.currently.icon)+')'});
		
		// wind bearing clouds phase humid vis hi hiTime sunrise sunset lowTime low
	};

ForcastIO.prototype.getIcon = function(icon){

	return this.icons[icon];
	
		
}

ForcastIO.prototype.getBackground = function(icon){

	return this.bg[icon];
		
}

ForcastIO.prototype.appendDays = function(data){
	var html = '<div class="day col-md-2 col-lg-2 pull-left">					<div class="calander"><span class="date">'+unixDay(data.time)+'</span></div><div class="smlWeatherIcon"><img class="img-responsive img-circle" src="'+this.getIcon(data.icon)+'"></div><div class="smlTemp">High: <span id="smlHi">'+data.temperatureMax+'</span>&deg</div><div class="smlTemp">Low: <span id="smlHi">'+data.temperatureMin+'</span>&deg</div><div class="smlWind">Wind: <span id="smlWind">'+data.windSpeed+'</span>MPH <span id="smlbearing">'+data.windBearing+'</span></div><div class="smlChance">'+checkRain(data)+'</div></div>'
	
	return html;
}

function mapsObject(){
	
	
	this.apiKey = keyRing.data.google;
	
	
	this.setCity= function(lat, long){
		var geocoder = new google.maps.Geocoder();
		var latlng = new google.maps.LatLng(lat, long);
		geocoder.geocode({"location": latlng}, function(results, status){
			if(status = google.maps.GeocoderStatus.OK){
				var result = results.filter(function(obj){
					return obj.types[0] == "street_address";
				})[0];
			
				var city = result.address_components.filter(function(obj){
					return obj.types[0] === "locality";
				})[0].long_name;
			
				var state = result.address_components.filter(function(obj){
					return obj.types[0] === "administrative_area_level_1";
				})[0].long_name; 
				if(city){
					$(".location").html(city+", "+ state);
				}
				else{
					window.alert("Could not find City name");
				}
			}
			else{
				window.alert("Geocoder failed due to: "+status);
			}
		});
	};

	
	this.errorHandler = function(error) {

		switch(error.code){
			case error.PERMISSION_DENIED:
				setErrors("User Denied the request for location services");
				break;
			case error.POSITION_UNAVAILABLE:
				setErrors("Location not available");
				break;
			case error.TIMEOUT:
				setErrors("The request has timed out<");
				break;
			case error.UNKNOWN_ERROR:
				setErrors("The request has timed out<");
				break;
		}
	};
	
}


function setErrors(error){

	$(".errorMe").css("display", "block");
	$(".errorMe ul").append("<li>"+error+"</li>");
}

function setAlert(alert, index){
	$(".errorMe").css("display", "block");
	$(".errorMe ul").append("<li>"+alert+" <button class='more' data-index= "+index+">More</button></li>");	
	$(".more").on('click',function(e){
		var index = e.target.dataset.index;
		var obj = weather.alerts[index];
	
		$('.box').css({'display':'block'});
		$('.info div').html(buildInfoBlock(obj));
	});

	
}

function buildInfoBlock(obj){
  var html = '<div class="center-block bg-danger info-block"><h3 class="text-danger">'+obj.title+'</h3><p>'+obj.description+'</p></div>';
		
	return html;
}



function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours() > 10 ? a.getHours() : "0"+a.getHours();
  var min = a.getMinutes() > 10 ? a.getMinutes() : "0"+a.getMinutes();
  var sec = a.getSeconds() > 10 ? a.getSeconds() : "0"+a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

function unixTime(timestamp){
	var a = new Date(timestamp * 1000);
	var hour = a.getHours() > 12 ? "0"+(a.getHours() - 12) : "0"+a.getHours();
	var min = a.getMinutes() < 10 ? "0"+a.getMinutes() : a.getMinutes();
	var dayNight = a.getHours() > 12 ? "PM" : "AM";
	return hour+":"+min+" "+dayNight;
}

function unixDay(timestamp){
	var a = new Date(timestamp * 1000);
	var days = ["Sunday", "Monday", "Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var day = days[a.getDay()];
	var date = a.getDate();
	var month = a.getMonth();
	return day+" "+month+"/"+date;
}




function checkRain(data){
	var percent = data.precipProbability;
	if(percent > 0){
		return (percent*100)+"% chance of "+data.precipType;
	}
	else{
		return "No chance of percipitation";
	}
}



  /////////////////////////
 // Main function calls //	
/////////////////////////	
	

function startWeather(){
	geo = new mapsObject();
	$("#grad").html(scale);
	console.log("running");
	setData();
}


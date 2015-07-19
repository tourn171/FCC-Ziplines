angular.module('twitchApp', []);

angular.module('twitchApp')
	.controller('twitchCtrl', function ($scope, $http) {

		$scope.streams = [];
		$scope.authors = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "comster404", "brunofin", "thomasballinger", "noobs2ninjas", "beohoff"];
		$scope.filters = "All";


		$scope.authors.forEach(function (author) {
			$http.jsonp("https://api.twitch.tv/kraken/channels/" + author + ".json?callback=JSON_CALLBACK")
				.success(function (data) {
					$scope.streams.push(data);


				}).error(function (data, status) {
					console.log("error");
					console.log(status);
					console.log(data);
				});
		});

		$('.tab').on('click', function () {
			$('.tab').removeClass('selected');
			$(this).addClass('selected');

		});


		$scope.getIcon = function (stream) {

			if (stream.status === null) {
				return "fa fa-exclamation red";
			} else {
				return "fa fa-check green";
			}
		};

		$scope.getLogo = function (stream) {
			if (stream.logo === null) {
				return "resources/twitch/person.png";
			} else {
				return stream.logo;
			}
		};

		$scope.getStatus = function (stream) {

			var status = stream.status;


			if (status === null) {
				return "";
			} else if (status.length > 26) {
				return status.substring(0, 26);
			} else {
				return status;
			}
		};


	});


angular.module("twitchApp")
	.filter("streamsFilter", function () {

		return function (input, filter, text) {

			console.log(text);
			var out = [];

			if (filter === "All") {
				out = input;
			} else if (filter == "Online") {
				angular.forEach(input, function (obj) {
					if (obj.status !== null) {
						out.push(obj);
					}
				});
			} else if (filter == "Offline") {
				angular.forEach(input, function (obj) {
					if (obj.status === null) {
						out.push(obj);
					}
				});
			}


			if (text !== undefined && text.length > 0) {

				var stringChecked = [];
				angular.forEach(out, function (obj) {
					if (obj.name.indexOf(text) !== -1) {
						stringChecked.push(obj);
					}
				});
				out = stringChecked;
			}


			return out;
		}

	});

angular.module('camperApp', [])
	.controller('campCtrl', function ($scope, $http) {

		$scope.stories = [];
		/*  $http.jsonp("https://api.twitch.tv/kraken/channels/"      ".json?callback=JSON_CALLBACK")*/
		$http.get('http://www.freecodecamp.com/stories/hotStories')
			.success(function (data) {
				/*				angular.forEach(data, function (item) {
									$scope.stories.push(item);
								});*/
				$scope.stories = data;
			})
			.error(function (data, status) {
				console.error(status);
				console.error(data);
			});

		$scope.getImage = function (story) {

			if (story.image !== undefined && story.image !== "" && story.image !== null) {
				return story.image;
			} else {
				return "resources/camper/missing.png";
			}
		}
	})

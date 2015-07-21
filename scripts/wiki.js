angular.module('wikiApp', []);

angular.module('wikiApp').controller('wikiCtrl', function ($scope, $http, $sce) {

	$scope.searchText = "";
	$scope.request = false;
	$scope.wikiList;
	$scope.baseUrl = "https://en.wikipedia.org/w/api.php?action=query&prop=info&inprop=displaytitle&titles=";
	$scope.opensearch;
	$scope.encodedTitle;


	$scope.search = function () {

		if ($scope.searchText === "") {

			$http.jsonp("https://en.wikipedia.org/w/api.php?action=query&list=random&rnlimit=1&format=json&callback=JSON_CALLBACK&prop=revisions&revsection=0" + $scope.searchText).
			success(function (data) {
				console.log(data);
				$scope.wikiList = data.query.random;
				$scope.request = true;
			}).
			error(function (data, status) {
				console.log(data);
				console.log("Status: " + status);
			});

		} else {

			$http.jsonp("https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&callback=JSON_CALLBACK&prop=revisions&revsection=0&srsearch=" + $scope.searchText).
			success(function (data) {
				console.log(data);
				$scope.wikiList = data.query.search;
				$scope.request = true;
			}).
			error(function (data, status) {
				console.log(data);
				console.log("Status: " + status);
			});
		}
	};

	$scope.keyHandler = function (event) {
		var code = event.keyCode;
		if (code == 13) {
			$scope.search();
		} else if (code !== 37 && code !== 38 && code !== 39 && code !== 40) {
			$http.jsonp("https://en.wikipedia.org/w/api.php?action=opensearch&format=json&callback=JSON_CALLBACK&limit=10&search=" + $scope.searchText).
			success(function (data) {
				$scope.opensearch = data[1];
			}).
			error(function (data, status) {
				console.log(data);
				console.log(status);
			});
		}
	}

	$scope.setTrusted = function (html) {
		return $sce.trustAsHtml(html);
	}

});

angular.module('wikiApp').filter('encode', function () {
	return function (input) {
		return window.encodeURIComponent(input);
	}

});

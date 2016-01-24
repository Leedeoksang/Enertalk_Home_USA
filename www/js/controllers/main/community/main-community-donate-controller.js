angular.module('enertalkHomeUSA.controllers')

.controller('CommDonateCtrl', function ($scope, $window) {

	$scope.openUrl = function (url) {
		$window.open(url, '_system');
	};
});
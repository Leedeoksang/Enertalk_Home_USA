angular.module('enertalkHomeUSA.controllers')
	.controller('InfoSettingCtrl', function ($scope, Util, $timeout, $ionicPopup) {
		
		function init () {
			var tempPeriodList = [],
				houseInfo = Util.localStorage.getObject('houseInfo'),
				popup = $ionicPopup.show({
					title: 'For better neighbor comparison, please share a little bit about your home.',
					buttons: [{
						text: 'ok',
						type: 'button-positive'
					}]
				});

			$scope.houseInfo = houseInfo;

		}

		$scope.changeInfo = function () {
			var houseInfo = $scope.houseInfo,
				loadingPopup = Util.loadingPopup.show();

			Util.localStorage.setObject('houseInfo', houseInfo);
			$timeout(function () {
				loadingPopup.close();
				Util.loadingPopup.success();
			}, 2000);
		};

		init ();

	});
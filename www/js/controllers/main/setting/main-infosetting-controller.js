angular.module('enertalkHomeUSA.controllers')
	.controller('InfoSettingCtrl', function ($scope) {
		
		function init () {
			var tempPeriodList = []
			$scope.stateList = [{
				id: 1,
				label: 'state 1'
			},{
				id: 2,
				label: 'state 2'
			}, {
				id: 3,
				label: 'state 3'
			}];
			$scope.cityList = [{
				id: 1,
				label: 'city 1'
			}, {
				id: 2,
				label: 'city 2'
			}, {
				id: 3,
				label: 'city 3'
			}];
			$scope.periodStartList = [];
			$scope.ratePlanList = [];

			for (var i = 1; i <= 28; i += 1) {
				tempPeriodList.push({
					id: i,
					label: i + 'day'
				});
			}
			$scope.periodStartList = tempPeriodList;

			$scope.stateSelected = $scope.stateList[0];
			$scope.citySelected = $scope.cityList[0];
			$scope.periodSelected = $scope.periodStartList[0];
		}	

		init ();
	});
angular.module('enertalkHomeUSA.controllers')

	.controller('GoalSettingCtrl', function ($scope, User, Util, $filter, $state, $ionicPopup) {

		function init () {
			$scope.conversionList = [];
			$scope.plan = {
				name: 'plan',
				value: User.dailyPlan / 1000000 || 0
			};
			
			makeConversionList();
			
		}

		function makeConversionList () {
			if (!Util.bill.getBill(100)) {
				$ionicPopup.show({
					title: 'Need detail setting',
					buttons: [{
						text: 'go to setting',
						onTap: function () {
							$state.go('main.billing-setting');
						}
					}]
				});
			} else {
				$scope.conversionList = [{
					label: 'Target electric bill per month',
					value: $filter('setDecimal')(Util.bill.getBill($scope.plan.value * 30), 2)
				},{
					label: 'Target usage per day',
					value: $filter('setDecimal')($scope.plan.value, 2) || 0
				},{
					label: 'CO2 emitted per day',
					value: $filter('setDecimal')(Util.conversion.co2($scope.plan.value, 'k'), 2) || 0
				},{
					label: 'Pine trees needed per day',
					value: $filter('setDecimal')(Util.conversion.tree($scope.plan.value, 'k'), 2) || 0
				}];
			}
		}

		$scope.changeUsage = function (value) {
			if ($scope.conversionList.length) {
				$scope.conversionList[0].value = $filter('setDecimal')(Util.bill.getBill($scope.plan.value * 30), 2);
				$scope.conversionList[1].value = $filter('setDecimal')($scope.plan.value, 2);
				$scope.conversionList[2].value = $filter('setDecimal')(Util.conversion.co2($scope.plan.value, 'k'), 2);
				$scope.conversionList[3].value = $filter('setDecimal')(Util.conversion.tree($scope.plan.value, 'k'), 2);
			}
		}


		$scope.changePlan = function () {
			var loadingPopup = Util.loadingPopup.show(),
			userInfo = {
				maxLimitUsage: $scope.plan.value * 30 * 1000000
			};

			if ($scope.conversionList.length) {
				User.setUserInfo(userInfo).then(function (response) {
					loadingPopup.close();
					if (response === 'success') {
						Util.loadingPopup.success();
						User.resetProfile();
					} else {
						Util.loadingPopup.fail();
					}
				});
			}
		};

		init();
	});
angular.module('enertalkHomeUSA.controllers')

	.controller('BillEstimatorCtrl', function($scope, BillEstimatorModel, Util, User, $ionicPopup, $state, $timeout) {

		function init () {
			var meteringday = User.profile.meteringday,
				now = new Date(),
				start,
				end,
				period;

			if (now.getDate() >= meteringday) {
				start = new Date(now.getFullYear(), now.getMonth(), meteringday);
				end = new Date(now.getFullYear(), now.getMonth() + 1, meteringday);
			} else {
				start = new Date(now.getFullYear(), now.getMonth() - 1, meteringday);
				end = new Date(now.getFullYear(), now.getMonth(), meteringday);
			}
			period = {
				start: start.getTime(),
				end: end.getTime()
			};
			$scope.billingCycle = (start.getMonth() + 1) + '/' + (start.getDate())
									+ ' ~ '
									+ (end.getMonth() + 1) + '/' + (end.getDate());

			$scope.billingRate = '';
			$scope.currentBill = 0;
			$scope.forecastBill = 0;

			BillEstimatorModel.getModel(period).then(function (response) {
				if (!Util.bill.getBill(response.currentMonth.totalUsage / 1000000)) {
					needDetailSetting();
				} else {
					$scope.currentBill = Util.bill.getBill(response.currentMonth.totalUsage / 1000000);
					$scope.forecastBill = Util.bill.getBill(response.forecastUsage / 1000000);
					$scope.billingRate = Util.bill.getBillRate(response.currentMonth.totalUsage / 1000000);
					$scope.previousMonths = response.previousMonths.reverse();
				}
			});
		}

		function needDetailSetting () {
			var popup = $ionicPopup.show({
				title: 'Need detail setting',
				buttons: [{
					text: 'go to setting',
					onTap: function () {
						$timeout(function () {
							$state.go('main.billing-setting');
						}, 300);
						$state.go('main.setting');
					}
				}]
			});
		}

		$scope.dayLabel = function (timestamp1, timestamp2) {
			// var date = new Date(timestamp);
			// return date.getFullYear() + '/' + (date.getMonth() + 1);
			var start = new Date(timestamp1),
				end = new Date(timestamp2);

			return /*start.getFullYear() + '/' + */(start.getMonth() + 1) + '/' + start.getDate() + ' ~ ' + /*end.getFullYear() + '/' + */(end.getMonth() + 1) + '/' + end.getDate();
		}
		$scope.kWhLabel = function (totalUsage) {
			return (totalUsage / 1000000).toFixed(2);
		}
		$scope.billLabel = function (totalUsage) {
			return Util.bill.getBill(totalUsage / 1000000);
		};

		init();
	});
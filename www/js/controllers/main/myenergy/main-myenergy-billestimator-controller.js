angular.module('enertalkHomeUSA.controllers')

	.controller('BillEstimatorCtrl', function($scope, BillEstimatorModel) {

		function init () {
			var now = new Date(),
				start = new Date(now.getFullYear(), now.getMonth(), 1),
				end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

			$scope.billingCycle = (start.getMonth() + 1) + '/' + (start.getDate())
									+ ' ~ '
									+ (end.getMonth() + 1) + '/' + (end.getDate());

			$scope.billingRate = '';
			$scope.currentBill = 0;
			$scope.forecastBill = 0;

			BillEstimatorModel.getModel().then(function (response) {
				$scope.currentBill = testBillCalculation(response.totalUsage / 1000000);
				$scope.forecastBill = testBillCalculation(response.forecastUsage / 1000000);
				$scope.billingRate = 'Tier ' + testBillingRate(response.totalUsage / 1000000);
			});
		}

		function testBillCalculation (kWh) {
			var bill = 0;

			if (kWh >= 0 && kWh < 700) {
				bill = (kWh * 0.14799).toFixed(2);
			} else if (kWh >= 700 && kWh < 2100) {
				bill = (700 * 14799 + (kWh - 700) * 0.176).toFixed(2);
			} else {
				bill = 0;
			}

			return bill;
		}

		function testBillingRate (kWh) {
			var rate;

			if (kWh >= 0 && kWh < 700) {
				rate = 1;
			} else if (kWh >= 700 && kWh < 2100) {
				rate = 2;
			} else {
				rate = 3;
			}

			return rate;
		}

		init();
	});
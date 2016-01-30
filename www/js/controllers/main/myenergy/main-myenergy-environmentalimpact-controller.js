angular.module('enertalkHomeUSA.controllers')

	.controller('EnvironmentalImpactCtrl', function($scope, MyenergyModel, Util) {

		function init () {
			$scope.data = {};
			MyenergyModel.getModel().then(function (response) {
				var co2kg = response.co2Emitted;

				$scope.data = response;
				$scope.data.co2Conversion = {
					mile: Util.conversion.mile(co2kg),
					waste: Util.conversion.waste(co2kg),
					coal: Util.conversion.coal(co2kg)
				};
			});
		}


		init();
	});
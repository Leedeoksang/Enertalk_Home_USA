angular.module('enertalkHomeUSA.controllers')

  	.controller('MainCtrl', function($scope, $cordovaDeviceMotion, $ionicModal, Util, UIHub) {

  		var options = {
  				frequency: 500,
  				deviation: 25
  			};

  		$scope.measurement = {};
  		$scope.previousMeasurement = {};

  		$ionicModal.fromTemplateUrl('./templates/main/realtime-usage-modal.html', {
  			scope: $scope,
  			animation: 'slide-in-up'
  		}).then(function (modal) {
  			$scope.modal = modal;
  		});

  		document.addEventListener("deviceready", function () {
  			var watch;
		    watch = $cordovaDeviceMotion.watchAcceleration(options);

		    watch.then(
	      	null,
	      	function(error) {
	      		console.log(error);
	      	},
	      	function(result) {
	      		var measurementChanges = {};

	        	if (!$scope.previousMeasurement) {
	        		$scope.previousMeasurement = {
		        		x: result.x,
		        		y: result.y,
		        		z: result.z,
		        		timestamp: result.timestamp
		        	};	
	        	} else {
	        		$scope.previousMeasurement = $scope.measurement;
	        		$scope.measurement = {
		        		x: result.x,
		        		y: result.y,
		        		z: result.z,
		        		timestamp: result.timestamp
		        	};
	        		measurementChanges.x = Math.abs($scope.measurement.x - $scope.previousMeasurement.x);
	        		measurementChanges.y = Math.abs($scope.measurement.y - $scope.previousMeasurement.y);
	        		measurementChanges.z = Math.abs($scope.measurement.z - $scope.previousMeasurement.z);

	        		if (measurementChanges.x + measurementChanges.y + measurementChanges.z > options.deviation) {
	        			$scope.modal.show();
	        			$scope.loading = true;
	        			renderRealtimeCard();
	        		}
	        	}
		    });
		}, false);  
		
		function renderRealtimeCard () {
			var card = {
        		id: 'ui:h:realtime:v2',
        		params: {
          			lang: 'en',
          			useDemoLabel: 1,
          			displayUnit: 'watt'
        		}
      		},
      		target = document.querySelector('#card');

      		UIHub.renderCard([card], target, function (error) {
      			if (error) {

      			} else {

      			}
      			$scope.loading = false;
      		});
		}

		$scope.closeModal = function () {
			if ($scope.modal) {
				$scope.modal.hide();
			}
		};

  	});
angular.module('enertalkHomeUSA.controllers')

	.controller('RealtimeUsageCtrl', function($scope, UIHub) {

		function init () {
			// document.addEventListener('deviceready', function () {
			// 	$cordovaProgress.showSimple(true);
			// });
			$scope.renderRealtimeCard();
		}

		$scope.renderRealtimeCard = function () {
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
					// document.addEventListener('deviceready', function () {
					// 	$cordovaProgress.hide();
					// });
				}
			});
		};

		init();
	});
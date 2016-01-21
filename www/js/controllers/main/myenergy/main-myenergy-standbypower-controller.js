angular.module('enertalkHomeUSA.controllers')

  	.controller('StandbyPowerCtrl', function($scope, UIHub) {

  		function init () {
  			$scope.renderStandbyPowerCard();
  		}

  		$scope.renderStandbyPowerCard = function () {
  			var card = {
        		id: 'ui:h:standbychart:v1',
        		params: {
          			lang: 'en',
          			useDemoLabel: 1
        		}
      		},
  			target = document.querySelector('#card');

  			UIHub.renderCard([card], target, function (error) {
          if (error) {

          } else {
            
          }
        });
  		};

  		init();
  	});
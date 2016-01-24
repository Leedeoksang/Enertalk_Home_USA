angular.module('enertalkHomeUSA.controllers')

	.controller('MyhomeDietCtrl', function($scope, MyhomeDietModel) {
  		
  		function init () {
  			MyhomeDietModel.getModel().then(function (response) {
  				console.log(response);
  				$scope.data = response;
  			});
  		}

  		init ();
	});
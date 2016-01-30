angular.module('enertalkHomeUSA')
  	.directive('myenergyLine', function () {
    	return {
    		templateUrl: 'templates/directive/main-myenergy-line.html',
	    	restrict: 'EA',
	      	scope: {
	      		label: '@',
	      		type: '@',
            figure: '@'
	      	},
      		link: function (scope, element) {
        		
      		}
    	};
  	});

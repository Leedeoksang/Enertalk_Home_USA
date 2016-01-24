angular.module('enertalkHomeUSA.controllers')

	.controller('KwhUsageCtrl', function($scope, User, KwhUsageModel, $window) {
		
		$scope.dailyPlan = (User.dailyPlan / 1000000).toFixed(2);

		function init () {

			KwhUsageModel.getDayData()
			.then(function (response) {
				var totalUsage = 0;
				angular.forEach(response, function (data) {
					totalUsage += data.y;
				});
				
				$scope.dataList = response;
				$scope.todayUsage = (totalUsage / 1000000).toFixed(2);
				$scope.remaining = ($scope.dailyPlan - $scope.todayUsage).toFixed(2);
				$scope.overage = ($scope.todayUsage - $scope.dailyPlan).toFixed(2);
				getGuideSentence();
				renderChart();
			});
		}

		function renderChart () {
			var barOptions = {
				chart: {
		            type: 'column',
		            polar: true,
		            renderTo: 'chart'
		        },
		        title: {
		            text: ''
		        },
		        pane: {
		        	size: '90%'
		        },
		        xAxis: {
		            title: {
		                text: null
		            },
		            type: 'datetime',
		            labels: {
	            		enabled: true
		            },
		            tickWidth: 1
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: ''
		            },
		            labels: {
		            	enabled: false
		            },
		            gridLineWidth: 0,
		            endOnTick: false
		            // plotLines: [{
	             //        value: User.dailyPlan / 24,
	             //        color: '#999999',
	             //        width: 2,
	             //        label: {
	             //        	enabled: false
	             //            // text: 'daily plan'
	             //        }
              //   	}]
		        },
		        tooltip: {
		       			enabled: false
		        },
		        plotOptions: {
		        	// area: {
		        	// 	lineWidth: 0,
		        	// 	marker: {
		        	// 		enabled: false
		        	// 	}
		        	// }
		            // bar: {
		            //     dataLabels: {
		            //         enabled: false
		            //     }
		            // }
		            series: {
		            	pointPlacement: 'on'
		            }
		        },
		        legend: {
		            enabled: false
		        },
		        credits: {
		            enabled: false
		        },
		        series: [{
		        	name: '',
		        	data: $scope.dataList,
		        	color: '#2D71E7'
		        }]
			};

			Highcharts.setOptions({
				global: {
					useUTC: false
				}
			});

			$scope.chart = new Highcharts.chart(barOptions)
		}

		function getGuideSentence () {
			
		}
		
		// $scope.test = function (e) {
		// 	var target = document.getElementById('chart'),
		// 		x = e.gesture.deltaX,
		// 		pageX = e.gesture.center.pageX;

		// 		target.style.transform = 'translateX(' + (pageX + x) + 'px)';
		// 	// }
		// };

		init();
	});
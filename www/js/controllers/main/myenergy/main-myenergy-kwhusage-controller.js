angular.module('enertalkHomeUSA.controllers')

	.controller('KwhUsageCtrl', function($scope, User, KwhUsageModel, $window) {
		
		$scope.dailyPlan = (User.dailyPlan / 1000000).toFixed(2);

		function init () {
			var now = new Date();
			$scope.xAxis = {};
			$scope.xAxis.min = (new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0)).getTime();
			$scope.xAxis.max = (new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0)).getTime();
			$scope.guideTexts = [
				['Under Target. Doing great!', 'On Target. Doing OK', 'Sligthly Over Target. Watch your usage', 'Rapidly using your energy! Reduce your usage'],
				['Getting close to your daily limit!', 'Exceeded your daily limit']
			];

			KwhUsageModel.getDayData().then(function (response) {
				var totalUsage = 0;
				
				angular.forEach(response, function (data) {
					totalUsage += data.y;
				});
				$scope.dataList = response;
				$scope.todayUsage = (totalUsage / 1000000).toFixed(2);
				$scope.remaining = ($scope.dailyPlan - $scope.todayUsage) > 0 ? ($scope.dailyPlan - $scope.todayUsage).toFixed(2) : 0;
				$scope.overage = ($scope.todayUsage - $scope.dailyPlan) > 0 ? ($scope.todayUsage - $scope.dailyPlan).toFixed(2) : 0;
				$scope.guideline = $scope.dataList.length * $scope.dailyPlan / 96;
				getGuideSentence();
				renderChart();
			});
		}

		function getGuideSentence () {
			var goalPercent = $scope.todayUsage / $scope.dailyPlan,
				guidelinePercent = $scope.todayUsage / $scope.guideline;

			if (goalPercent >= 0.95) {
				if (goalPercent < 1) {
					$scope.guide = $scope.guideTexts[1][0];
				} else {
					$scope.guide = $scope.guideTexts[1][1];
				}
			} else if (goalPercent < 0.95) {
				if (guidelinePercent < 0.9) {
					$scope.guide = $scope.guideTexts[0][0];
				} else if (guidelinePercent < 1) {
					$scope.guide = $scope.guideTexts[0][1];
				} else if (guidelinePercent < 1.1) {
					$scope.guide = $scope.guideTexts[0][2];
				} else if (guidelinePercent >= 1.1) {
					$scope.guide = $scope.guideTexts[0][3];
				}
			}
		}

		function renderChart () {
			var barOptions = {
				chart: {
		            polar: true,
		            renderTo: 'chart'
		        },
		        title: {
		            text: ''
		        },
		        pane: {
		        	size: '80%'
		        },
		        xAxis: {
		        	min: $scope.xAxis.min,
		        	max: $scope.xAxis.max,
		            title: {
		                text: null
		            },
		            type: 'datetime',
		            labels: {
	            		enabled: true
		            },
		            tickWidth: 1,
		            tickInterval: 3600 * 1000 * 6
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
		        },
		        tooltip: {
		       			enabled: false
		        },
		        plotOptions: {
		            series: {
		            	pointPlacement: 'on'
		            },
		            line: {
		            	marker: {
		            		enabled: false
		            	}
		            }
		        },
		        legend: {
		            enabled: false
		        },
		        credits: {
		            enabled: false
		        },
		        series: [{
		        	name: 'today',
		        	type: 'column',
		        	data: $scope.dataList,
		        	color: '#2D71E7'
		        }]
			};

			Highcharts.setOptions({
				global: {
					useUTC: false
				}
			});

			$scope.chart = new Highcharts.chart(barOptions);
		}

		init();
	});
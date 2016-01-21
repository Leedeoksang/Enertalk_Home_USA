angular.module('enertalkHomeUSA.controllers')

	.controller('KwhUsageCtrl', function($scope, User, KwhUsageModel) {
		
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
				$scope.remaining = $scope.dailyPlan - $scope.todayUsage;

				renderChart();
			});
		}

		function renderFirstChart () {
			var target = document.getElementById('usage-percent-chart'),
			svg,
			offsetWidth,
			offsetHeight,
			trackLine,
			tintLine,
			lineFunction = d3.svg.line()
				.x(function (d) { return d.x; })
				.y(function (d) { return d.y; })
				.interpolate('linear');
			
			svg = d3.select(target)
				.append('svg')
				.attr({
					'width': '100%',
					'height': '100%'
				});

			offsetWidth = svg[0][0].offsetWidth;
			offsetHeight = svg[0][0].offsetHeight;

			trackLine = [{
				x: 10,
				y: offsetHeight / 2
			}, {
				x: offsetWidth - 10,
				y: offsetHeight / 2
			}];
			tintLine = [{
				x: 10,
				y: offsetHeight / 2
			}, {
				x: offsetWidth * 0.7 - 10,
				y: offsetHeight / 2
			}];

			svg.append('path')
				.attr({
					'd': lineFunction(trackLine),
					'stroke': '#878787',
					'stroke-width': 20,
					'stroke-linecap': 'round'
				});

			svg.append('path')
				.attr({
					'd': lineFunction(tintLine),
					'stroke': '#93E7CD',
					'stroke-width': 20,
					'stroke-linecap': 'round'
				})
		}
		function renderChart () {
			var barOptions = {
				chart: {
		            type: 'column',
		            renderTo: 'chart'
		        },
		        title: {
		            text: ''
		        },
		        
		        xAxis: {
		            title: {
		                text: null
		            },
		            type: 'datetime',
		            labels: {
		            		enabled: false
		            },
		            lineWidth: 0,
		            tickWidth: 0,
		            formatter: function () {
		            	console.log(this.x);
		            }
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
		            plotLines: [{
	                    value: User.dailyPlan / 24,
	                    color: '#999999',
	                    width: 2,
	                    label: {
	                    	enabled: false
	                        // text: 'daily plan'
	                    }
                	}]
		        },
		        tooltip: {
		       			enabled: false
		        },
		        plotOptions: {
		            bar: {
		                dataLabels: {
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
		        	name: '',
		        	data: $scope.dataList,
		        	color: '#2D71E7'
		        }]
			};

			$scope.chart = new Highcharts.chart(barOptions)
		}

		init();
	});
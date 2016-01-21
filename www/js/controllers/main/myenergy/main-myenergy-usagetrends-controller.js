angular.module('enertalkHomeUSA.controllers')

	.controller('UsageTrendsCtrl', function($scope, UsageTrendsModel, User, $timeout) {
		console.log(User);
		$scope.tabs = [{
			label: 'day',
			dataList: [],
			plan: User.dailyPlan / 24,
			model: UsageTrendsModel.getDayData
		},{
			label: 'week',
			dataList: [],
			plan: User.dailyPlan,
			model: UsageTrendsModel.getWeekData
		},{
			label: 'month',
			dataList: [],
			plan: User.dailyPlan,
			model: UsageTrendsModel.getMonthData
		},{
			label: 'year',
			dataList: [],
			plan: User.profile.maxLimitUsage,
			model: UsageTrendsModel.getYearData
		}];
		$scope.dailyPlan = User.dailyPlan;
		$scope.currentTab = $scope.tabs[0];

		$scope.clickTab = function (index) {
			$scope.currentTab = $scope.tabs[index];
			if (!$scope.currentTab.dataList.length) {
				$scope.currentTab.model()
				.then(function (response) {
					$scope.currentTab.dataList = response;
					drawChart();
				})
			} else {
				drawChart();
			}
		};

		function init () {
			UsageTrendsModel.getDayData()
			.then(function (response) {
				$scope.currentTab.dataList = response;
				drawChart();
			});
			$scope.detailDataList = User.monthData.reverse();
			// console.log($scope.detailDataList);
			// UsageTrendsModel.getMonthData()
			// .then(function (response) {
			// 	console.log($scope.detailDataList);
			// 	console.log(response);
			// })
		}

		function drawChart () {
			var target = document.getElementById('chart'),
				// width = target.style.width,
				// height = target.style.height,
				barOptions = {
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
		            tickInterval: (function () {
		          		var type = $scope.currentTab.label;

		          		if (type === 'day') {
		          			return 3600 * 1000;
		          		} else if (type === 'week') {
		          			return 3600 * 1000 * 24;
		          		} else if (type === 'month') {
		          			return 3600 * 1000 * 24;
		          		}
		            })(),
		            labels: {
	            		enabled: true,
	            		align: 'center',
	            		rotation: 0,
	            		style: {
	            			whiteSpace: 'nowrap',
	            			textOverflow: 'none'
	            		},
	            		formatter: function () {
	            			var type = $scope.currentTab.label,
	            				date = new Date(this.value);

	            			if (type === 'day') {
	            				if (date.getHours() === 0) {
	            					return '12 a.m.';
	            				} else if (date.getHours() === 12) {
	            					return '12 p.m.';
	            				} else if (date.getHours() === 23) {
	            					return '12 a.m.';
	            				} else {
	            					return '';
	            				}
	            			} else if (type === 'week') {
	            				var day = ['S', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
	            				console.log(date.getDay());
	            				return day[date.getDay()];
	            			} else if (type === 'month') {
	            				if (date.getDate() === 1) {
	            					return '1th';
	            				} else if (date.getDate() === 15) {
	            					return '15th';
	            				}
	            			} else if (type === 'year') {

	            			}
	            		}
		            },
		            lineWidth: 0,
		            tickWidth: 0
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: ''
		            },
		            labels: {
		            	enabled: true,
		            	formatter: function () {
		            		return (this.value / 1000000).toFixed(1);
		            	}
		           	},
		            gridLineWidth: 0,
		            plotLines: [{
	                    value: $scope.currentTab.plan,
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
		        	data: $scope.currentTab.dataList,
		        	color: '#2D71E7'
		        }]
			};

			$scope.chart = new Highcharts.chart(barOptions);			
		}

		$scope.label = {
			getDayLabel: function (timestamp) {
				var date = new Date(timestamp),
					now = new Date(),
					dayLabel;
				
				if (now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate()) {
					dayLabel = 'Today';
				} else {
					dayLabel = (date.getMonth() + 1) + '/' + date.getDate();
				}

				return dayLabel;
			},
			getkWhLabel: function (usage) {
				return (usage / 1000000).toFixed(2);
			},
			getPlanLabel: function (usage) {
				var dailyPlan = $scope.dailyPlan,
					diff = (((usage - dailyPlan) / dailyPlan) * 100).toFixed(1);

				if (diff >= 0) {
					return '+' + diff;
				} else {
					return '-' + Math.abs(diff);
				}
			}
		};

		$scope.removeZero = function (item) {
			return item.unitPeriodUsage > 0;
		};
		init ();
	});
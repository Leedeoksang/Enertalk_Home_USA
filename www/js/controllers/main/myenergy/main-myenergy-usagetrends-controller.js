angular.module('enertalkHomeUSA.controllers')

	.controller('UsageTrendsCtrl', function($scope, UsageTrendsModel, User, $filter, $q, Util, $timeout) {

		function init () {
			var now = new Date(),
				currentTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0);

			$scope.tabs = [{
				label: 'day',
				dataList: [],
				plan: User.dailyPlan / 24,
				model: UsageTrendsModel.getDayData,
				index: 0
			},{
				label: 'week',
				dataList: [],
				plan: User.dailyPlan,
				model: UsageTrendsModel.getWeekData,
				index: 1
			},{
				label: 'month',
				dataList: [],
				plan: User.dailyPlan,
				model: UsageTrendsModel.getMonthData,
				index: 2
			},{
				label: 'year',
				dataList: [],
				plan: User.profile.maxLimitUsage,
				model: UsageTrendsModel.getYearData,
				index: 3
			}];

			$scope.dailyPlan = User.dailyPlan;
			$scope.currentTab = $scope.tabs[0];
			$scope.currentTimestamp = currentTime.getTime();
			
			$q.all([
				UsageTrendsModel.getDayData($scope.currentTimestamp),
				UsageTrendsModel.getDetailContents()
			]).then(function (responses) {
				$scope.currentTab.dataList = responses[0];
				$scope.detailDataList = responses[1];
				$scope.detailDataList.reverse();
				drawChart();
			});
		}

		$scope.clickTab = function (index) {
			$scope.currentTab = $scope.tabs[index];
			$scope.currentTab.model($scope.currentTimestamp).then(function (response) {
				$scope.currentTab.dataList = response;
				drawChart();
			})
		};

		function drawChart () {
			var target = document.getElementById('chart'),
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
		          		} else if (type === 'year') {
		          			return 3600 * 1000 * 24 * 30;
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
	            					return '12am';
	            				} else if (date.getHours() === 12) {
	            					return '12pm';
	            				} else if (date.getHours() === 23) {
	            					return '12am';
	            				} else {
	            					return '';
	            				}
	            			} else if (type === 'week') {
	            				var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	            				return day[date.getDay()];
	            			} else if (type === 'month') {
	            				if (date.getDate() === 1) {
	            					return '1st';
	            				} else if (date.getDate() === 15) {
	            					return '15th';
	            				} else if (this.isLast) {
	            					return date.getDate() + 'th';
	            				}
	            			} else if (type === 'year') {
	            				var month = date.getMonth();
	            				if (month === 0) {
	            					month = 12;
	            				}
	            				return Util.getMonthName(month).substr(0,3);
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
	       			enabled: true,
	       			// footerFormat: false,
	       			formatter: function () {
	       				var type = $scope.currentTab.label,
	       					date = new Date(this.x),
	       					xTooltip;
	       				if (type === 'day') {
	       					xTooltip = date.getHours() + ':00';
	       				} else if (type === 'week' || type === 'month') {
	       					xTooltip = (date.getMonth() + 1) + '.' + date.getDate();
	       				} else if (type === 'year') {
	       					xTooltip = '';/*Util.getMonthName(date.getMonth() + 1);*/
	       				}
	       				return xTooltip + '<br/>' + 'usage ' + $filter('setDecimal')(this.y / 1000000, 2) + 'kWh';
	       			},
	       			followPointer: true,
	       			useHTML: true
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

			Highcharts.setOptions({
				global: {
					useUTC: false
				}
			});

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

		$scope.changeDay = function (timestamp) {
			$scope.currentTimestamp = timestamp;
			$scope.clickTab($scope.currentTab.index);
		};

		init ();
	});
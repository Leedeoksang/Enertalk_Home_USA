angular.module('enertalkHomeUSA.controllers')
	
	.controller('EnergyCalendarCtrl', function($scope, EnergyCalendarModel, Util, $ionicScrollDelegate, $ionicPopup) {
		var currentYear,
			currentMonth;

		function init () {
			var currentDate = new Date();
			$scope.calendarType = 'goal';

			$scope.unitSelected = '15min';
			// for popup when clicking calendar elem

			currentYear = currentDate.getFullYear();
			currentMonth = currentDate.getMonth() + 1;

			EnergyCalendarModel.getModel(currentDate.getTime(), $scope.calendarType).then(function (response) {
				$scope.dataList = response.dataList;
				$scope.totalUsage = (response.totalUsage / 1000000).toFixed(2);
				$scope.forecastUsage = (response.forecastUsage / 1000000).toFixed(2);
				$scope.dayUsage = ($scope.totalUsage / $scope.dataList.length).toFixed(2);
				$scope.underTarget = response.underTarget;
				$scope.oftenType = response.oftenType;
				$scope.activeZoneFrequency = response.activeZoneFrequency;
				makeCalendarHeader(currentYear, currentMonth);
				makeCalendar(currentYear, currentMonth);
			});

		}

		function makeCalendarHeader (year, month) {
			$scope.dayOfWeekList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			$scope.calendarTitle = Util.getMonthName(month) + ' ' + year;
		}
		function makeCalendar (year, month) {
			var start = new Date(year, month - 1, 1),
			end = new Date(start.getFullYear(), start.getMonth() + 1, 0),
			dateList = [];

			for (var i = 0; i < 42; i += 1) {
				if (i < start.getDay()) {
					dateList.push({
						timestamp: undefined,
						excessPlan: undefined
					});
				} else {
					dateList.push($scope.dataList[i - start.getDay()]);
				}
			}

			$scope.dateList = dateList;
		}

		$scope.dayLabel = function (timestamp) {
			var date = new Date(timestamp);

			return date.getDate() ? date.getDate() : '.';
		};

		$scope.button = {
			clickLeft: function () {
				var date = new Date(currentYear, (currentMonth - 1) - 1, 1);
				currentYear = date.getFullYear();
				currentMonth = date.getMonth() + 1;

				EnergyCalendarModel.getModel(date.getTime(), $scope.calendarType).then(function (response) {
					$scope.dataList = response.dataList;
					$scope.totalUsage = (response.totalUsage / 1000000).toFixed(2);
					$scope.forecastUsage = (response.forecastUsage / 1000000).toFixed(2);
					$scope.dayUsage = ($scope.totalUsage / $scope.dataList.length).toFixed(2);
					$scope.underTarget = response.underTarget;
					$scope.oftenType = response.oftenType;
				$scope.activeZoneFrequency = response.activeZoneFrequency;
					makeCalendarHeader(currentYear, currentMonth);
					makeCalendar(currentYear, currentMonth);
					$ionicScrollDelegate.resize();
				});

			},
			clickRight: function () {
				var date = new Date(currentYear, (currentMonth - 1) + 1, 1);
				currentYear = date.getFullYear();
				currentMonth = date.getMonth() + 1;

				EnergyCalendarModel.getModel(date.getTime(), $scope.calendarType).then(function (response) {
					$scope.dataList = response.dataList;
					$scope.totalUsage = (response.totalUsage / 1000000).toFixed(2);
					$scope.forecastUsage = (response.forecastUsage / 1000000).toFixed(2);
					$scope.dayUsage = ($scope.totalUsage / $scope.dataList.length).toFixed(2);
					$scope.underTarget = response.underTarget;
					$scope.oftenType = response.oftenType;
				$scope.activeZoneFrequency = response.activeZoneFrequency;
					makeCalendarHeader(currentYear, currentMonth);
					makeCalendar(currentYear, currentMonth);
					$ionicScrollDelegate.resize();
				});
			}
		};

		$scope.changeCalendar = function (e) {
			console.log(e);
		};

		$scope.beyondCurrent = function () {
			var now = new Date();
			if (currentYear === now.getFullYear() && currentMonth > now.getMonth()) {
				return false;
			} else {
				return true;
			}
		};
		$scope.nowCurrent = function () {
			var now = new Date();
			
			if (currentYear === now.getFullYear() && currentMonth === (now.getMonth() + 1)) {
				return true;
			} else {
				return false;
			}
		};
		$scope.showTheDay = function (timestamp, unit) {
			if (timestamp) {
				$scope.currentElemTimestamp = timestamp;
				
				if (!$scope.popup) {
					$scope.popup = $ionicPopup.show({
						cssClass: 'custom-popup',
						templateUrl: './templates/main/day-usage.html',
						scope: $scope
					});
				}
				EnergyCalendarModel.getDayData($scope.currentElemTimestamp, unit).then(function (response) {
					drawCircleChart(response.dataList);
					$scope.dayTotalUsage = response.totalUsage / 1000000;
				});
			}
		};

		function drawCircleChart (dataList) {
			var currentTime = new Date($scope.currentElemTimestamp),
				barOptions = {
				chart: {
		            polar: true,
		            renderTo: 'day-usage-chart'
		        },
		        title: {
		            text: ''
		        },
		        pane: {
		        	size: '70%'
		        },
		        xAxis: {
		        	min: currentTime.getTime(),
		        	max: (new Date(currentTime.getFullYear() , currentTime.getMonth(), currentTime.getDate() + 1)).getTime(),
		       //      min: 0,
	        // max: 24 * 36e5,
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
		        series: [
		        {
		        	name: 'today',
		        	type: 'column',
		        	data: dataList,
		        	color: '#2D71E7'
		        }]
			};

			Highcharts.setOptions({
				global: {
					useUTC: false
				}
			});

			$scope.dayCircleChart = new Highcharts.chart(barOptions);
		}

		$scope.closePopup = function () {
			$scope.popup.close();
			$scope.popup = undefined;
		};

		init();
	});
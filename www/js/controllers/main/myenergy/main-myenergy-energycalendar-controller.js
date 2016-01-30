angular.module('enertalkHomeUSA.controllers')
	
	.controller('EnergyCalendarCtrl', function($scope, EnergyCalendarModel, Util, $ionicScrollDelegate) {
		var currentYear,
			currentMonth;

		function init () {
			var currentDate = new Date();
			$scope.calendarType = 'goal';

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
		init();
	});
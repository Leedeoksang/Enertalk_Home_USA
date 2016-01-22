angular.module('enertalkHomeUSA.services')

	.service('EnergyCalendarModel', function ($q, Api, User, Util) {

		this.getModel = function (timestamp, type) {
			var deferred = $q.defer(),
				date = timestamp ? new Date(timestamp) : new Date(),
				calendarType = type || 'goal',
				period = {},
				start = new Date(date.getFullYear(), date.getMonth(), 1),
				end = new Date(date.getFullYear(), date.getMonth() + 1, 0),
				data = {};

			if (type === 'goal') {
				period.unit = 'daily';
			} else if (type === 'time') {
				period.unit = 'hourly';
			}

			period.start = start.getTime();
			period.end = end.getTime();

				$q.all([
					Api.getPeriodicUsage(User.accesstoken, User.uuid, period),
					Api.getForecastUsage(User.accesstoken, User.uuid)
				]).then(function (responses) {
					var tempData;

						if (responses[0].status === 200) {
							if (type === 'time') {
								responses[0].data = Util.refineMonthData(responses[0].data);
								tempData = refineDataForTime(responses[0].data);
								data.dataList = responses[0].data;
							} else {
								tempData = refineDataForPlan(responses[0].data);
								data.dataList = tempData.dataList;
							}
							data.totalUsage = tempData.totalUsage;
						}	
						if (responses[1].status === 200) {
							data.forecastUsage = responses[1].data.meteringUsage;
						}
						deferred.resolve(data);
				}).catch(function (error) {
					console.log(error);
					deferred.reject(data);
				});

			return deferred.promise;
		};

		function refineDataForPlan (dataList) {
			var plan = User.dailyPlan,
				totalUsage = 0;

			angular.forEach(dataList, function (data) {
				if (data.unitPeriodUsage > plan) {
					data.excessPlan = true;
				} else {
					data.excessPlan = false;
				}
				totalUsage += data.unitPeriodUsage;
			});

			return {
				dataList: dataList,
				totalUsage: totalUsage
			};
		}

		function refineDataForTime (dataList) {
			var totalUsage = 0;
			angular.forEach(dataList, function (data) {
				totalUsage += data.unitPeriodUsage;
			});
			return {
				totalUsage: totalUsage
			};
		}

	});
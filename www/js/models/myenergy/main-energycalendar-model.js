angular.module('enertalkHomeUSA.services')

	.service('EnergyCalendarModel', function ($q, Api, User, Util) {

		this.getModel = function (timestamp, type) {
			var deferred = $q.defer(),
				date = timestamp ? new Date(timestamp) : new Date(),
				calendarType = type || 'goal',
				period = {
					unit: 'hourly'
				},
				start = new Date(date.getFullYear(), date.getMonth(), 1),
				end = new Date(date.getFullYear(), date.getMonth() + 1, 1);

			period.start = start.getTime();
			period.end = end.getTime();

				$q.all([
					Api.getPeriodicUsage(User.accesstoken, User.uuid, period),
					Api.getForecastUsage(User.accesstoken, User.uuid)
				]).then(function (responses) {
						if (responses[0].status === 200) {
							
							var test = 0;
							angular.forEach(responses[0].data, function (data) {
								test += data.unitPeriodUsage;
							});

							responses[0].data = Util.refineMonthData(responses[0].data);
							data = refineData(responses[0].data);
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

		function getMostActiveTime (dataList) {
			var oftenType = '',
			max = 0,
			index = 0;

			angular.forEach(dataList, function (data, i) {
				if (data > max) {
					max = data;
					index = i;
				}
			});

			if (index === 0) {
				oftenType = 'night';
			} else if (index === 1) {
				oftenType = 'morning';
			} else if (index === 2) {
				oftenType = 'afternoon';
			} else if (index === 3) {
				oftenType = 'evening';
			}

			return oftenType;
		}

		function refineData (dataList) {
			var plan = User.dailyPlan,
				totalUsage = 0,
				underTarget = 0,
				activeZoneFrequency = [0, 0, 0, 0],
				index,
				mostActiveTime,
				max = 0;

			angular.forEach(dataList, function (data) {
				if (data.unitPeriodUsage > plan) {
					data.excessPlan = true;
				} else {
					data.excessPlan = false;
					underTarget += 1;
				}

				if (data.activeTime === 'night') {
					index = 0;
				} else if (data.activeTime === 'morning') {
					index = 1;
				} else if (data.activeTime === 'afternoon') {
					index = 2;
				} else if (data.activeTime === 'evening') {
					index = 3;
				}

				activeZoneFrequency[index] += 1;
				totalUsage += data.unitPeriodUsage;
			});

			return {
				dataList: dataList,
				totalUsage: totalUsage,
				underTarget: underTarget,
				activeZoneFrequency: activeZoneFrequency,
				oftenType: getMostActiveTime(activeZoneFrequency)
			};
		}

		this.getDayData = function (timestamp, unit) {
			var deferred = $q.defer(),
				date = new Date(timestamp),
				start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0),
				end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0),
				period = {
					unit: unit || '15min',
					start: start.getTime(),
					end: end.getTime()
				};

			Api.getPeriodicUsage(User.accesstoken, User.uuid, period).then(function (response) {
				if (response.status === 200) {
					deferred.resolve(refineDayData(response.data, period.unit));
				} else {
					deferred.reject('error');
				}
			}).catch(function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};

		function refineDayData (dataList, unit) {
			var returnData = {
					totalUsage: 0,
					dataList: []
				},
				date,
				LENGTH = (unit === '15min' ? 96 : 24);

			if (dataList.length) {
				angular.forEach(dataList, function (data) {
					returnData.dataList.push({
						x: data.timestamp,
						y: data.unitPeriodUsage
					});
					returnData.totalUsage += data.unitPeriodUsage;
				});
			}
			return returnData;
		}
	});
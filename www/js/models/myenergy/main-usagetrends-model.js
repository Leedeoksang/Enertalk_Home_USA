angular.module('enertalkHomeUSA.services')

	.service('UsageTrendsModel', function ($q, Api, User, Util) {

		this.getDetailContents = function () {
			var deferred = $q.defer(),
				now = new Date(),
				start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 60),
				end = new Date(now.getFullYear(), now.getMonth() + 1, 1),
				period = {
					unit: 'hourly',
					start: start.getTime(),
					end: now.getTime()
				};

			Api.getPeriodicUsage(User.accesstoken, User.uuid, period).then(function (response) {
				if (response.status === 200) {
					var returnData;
					returnData = Util.refineMonthData(response.data);
					deferred.resolve(returnData);
				} else {
					deferred.reject('error');
				}
			}).catch(function (error) {
				deferred.reject(error);
			});

			return deferred.promise;
		};

		this.getDayData = function (timestamp) {
			var deferred = $q.defer(),
			period = {
				unit: 'hourly'
			},
			start = new Date(timestamp),
			end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1, 0);

			period.start = start.getTime();
			period.end = end.getTime();

			Api.getPeriodicUsage(User.accesstoken, User.uuid, period)
			.then(function (response) {
				if (response.status === 200) {
					var dataList = refineData(response.data, 'day');
					deferred.resolve(dataList);
				} else {
					deferred.reject('');
				}
			})

			.catch(function (error) {
				deferred.reject(error);
			});

			return deferred.promise;
		};

		this.getWeekData = function (timestamp) {
			var deferred = $q.defer(),
			period = {
				unit: 'daily'
			},
			date = new Date(timestamp),
			nowDayOfWeek = date.getDay(),
			start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - nowDayOfWeek, 0);
			end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7, 0);

			period.start = start.getTime();
			period.end = end.getTime();

			Api.getPeriodicUsage(User.accesstoken, User.uuid, period)
			.then(function (response) {
				if (response.status === 200) {
					var dataList = refineData(response.data, 'week');
					deferred.resolve(dataList);
				} else {
					deferred.reject('');
				}
			})

			.catch(function (error) {
				deferred.reject(error);
			});

			return deferred.promise;
		};	

		this.getMonthData = function (timestamp) {
			var deferred = $q.defer(),
			period = {
				unit: 'daily'
			},
			date = new Date(timestamp),
			start = new Date(date.getFullYear(), date.getMonth(), 1),
			end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

			period.start = start.getTime();
			period.end = end.getTime();

			Api.getPeriodicUsage(User.accesstoken, User.uuid, period)
			.then(function (response) {
				if (response.status === 200) {
					var dataList = refineData(response.data, 'month');
					deferred.resolve(dataList);
				} else {
					deferred.reject('');
				}
			})
			.catch(function (error) {
				deferred.reject(error);
			});

			return deferred.promise;
		};

		this.getYearData = function () {
			var deferred = $q.defer(),
			period = {
				unit: 'monthly'
			},
			now = new Date(),
			start = new Date(now.getFullYear(), now.getMonth() - 12, 1);

			period.start = start.getTime();
			period.end = now.getTime();

			Api.getPeriodicUsage(User.accesstoken, User.uuid, period)
			.then(function (response) {
				if (response.status === 200) {
					var dataList = refineData(response.data, 'year');
					deferred.resolve(dataList);
				} else {
					deferred.reject('');
				}
			})
			.catch(function (error) {	
				deferred.reject(error);
			});

			return deferred.promise;
		};

		function refineData (dataList, type) {
			var returnData = [],
				now = new Date(),
				tempDate;

			if (type === 'day') {
				angular.forEach(dataList, function (data) {
					returnData.push({
						x: data.timestamp,
						y: data.unitPeriodUsage
					});
				});
				if (returnData.length) {
					tempDate = new Date(returnData[returnData.length - 1].x);
					tempDate.setHours(tempDate.getHours() + 1);
					while(tempDate.getHours() !== 0) {
						returnData.push({
							x: tempDate.getTime(),
							y: 0
						});
						tempDate.setHours(tempDate.getHours() + 1);
						
					}
				}
			} else if (type === 'week') {
				angular.forEach(dataList, function (data) {
					returnData.push({
						x: data.timestamp,
						y: data.unitPeriodUsage
					});
				});
				if (returnData.length) {
					tempDate = new Date(returnData[returnData.length - 1].x);
					tempDate.setDate(tempDate.getDate() + 1);
					while(tempDate.getDay() !== 0) {
						returnData.push({
							x: tempDate.getTime(),
							y: 0
						});
						tempDate.setDate(tempDate.getDate() + 1);
					}
				}
			} else if (type === 'month') {
				angular.forEach(dataList, function (data) {
					returnData.push({
						x: data.timestamp,
						y: data.unitPeriodUsage
					});
				});
				if (returnData.length) {
					tempDate = new Date(returnData[returnData.length - 1].x);
					tempDate.setDate(tempDate.getDate() + 1);
					while(tempDate.getDate() !== 1) {
						returnData.push({
							x: tempDate.getTime(),
							y: 0
						});
						tempDate.setDate(tempDate.getDate() + 1);
					}
				}
			} else if (type === 'year') {
				angular.forEach(dataList, function (data) {
					returnData.push({
						x: data.timestamp,
						y: data.unitPeriodUsage
					});
				});
			}

			return returnData;
		}

	});
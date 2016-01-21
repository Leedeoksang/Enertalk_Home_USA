angular.module('enertalkHomeUSA.services')

	.service('UsageTrendsModel', function ($q, Api, User) {

		this.getDayData = function () {
			var deferred = $q.defer(),
			period = {
				unit: 'hourly'
			},
			now = new Date(),
			start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0);

			period.start = start.getTime();
			period.end = now.getTime();

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

		this.getWeekData = function () {
			var deferred = $q.defer(),
			period = {
				unit: 'daily'
			},
			now = new Date(),
			nowDayOfWeek = now.getDay(),
			start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - nowDayOfWeek);
		
			period.start = start.getTime();
			period.end = now.getTime();

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

		this.getMonthData = function () {
			var deferred = $q.defer(),
			period = {
				unit: 'daily'
			},
			now = new Date(),
			start = new Date(now.getFullYear(), now.getMonth(), 1);

			period.start = start.getTime();
			period.end = now.getTime();

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
			start = new Date(now.getFullYear(), 1, 1);

			period.start = start.getTime();
			period.end = now.getTime();

			Api.getPeriodicUsage(User.accesstoken, User.uuid, period)
			.then(function (response) {
				if (response.status === 200) {
					var dataList = refineData(response.data);
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
			}

			if (type === 'week') {
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
			}

			if (type === 'month') {
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
			}

			return returnData;
		}

	});
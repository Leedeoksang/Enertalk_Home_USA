angular.module('enertalkHomeUSA.services')

	.service('KwhUsageModel', function ($q, Api, User) {

		this.getDayData = function () {
			var deferred = $q.defer(),
			period = {
				unit: '15min'
			},
			now = new Date(),
			start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0);

			period.start = start.getTime();
			period.end = now.getTime();

			Api.getPeriodicUsage(User.accesstoken, User.uuid, period)
			.then(function (response) {
				if (response.status === 200) {
					var dataList = refineData2(response.data);
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

		function refineData (dataList) {
			var returnData = [],
				now = new Date(),
				tempDate;

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
		
			return returnData;
		}

		function refineData2 (dataList) {
			var returnData = [],
				date;

			angular.forEach(dataList, function (data) {
				returnData.push({
					x: data.timestamp,
					y: data.unitPeriodUsage
				});
			});
			if (returnData.length) {
				date = new Date(returnData[returnData.length - 1].x);
				date.setMinutes(date.getMinutes() + 15);
				while(date.getHours() !== 0) {
					returnData.push({
						x: date.getTime(),
						y: 0
					});
					date.setMinutes(date.getMinutes() + 15);
				}
			}
			return returnData;
		}

	});
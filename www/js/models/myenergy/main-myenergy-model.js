angular.module('enertalkHomeUSA.services')

	.service('MyenergyModel', function ($q, Api, User) {

		this.getModel = function () {
			var deferred = $q.defer(),
				now = new Date(),
				period = {
					unit: '15min'
				},
				start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0);

			period.start = start.getTime();
			period.end = now.getTime();
			Api.getPeriodicUsage(User.accesstoken, User.uuid, period)
			.then(function (response) {
				var returnData = {};
				if (response.status == 200) {
					returnData = refineData(response.data);
					deferred.resolve(returnData);
				} else {
					deferred.reject('status not 200');
				}
			})
			.catch(function (error) {
				deferred.reject(error);
			});

			return deferred.promise;
		};

		function refineData (dataList) {
			var returnData = {},
				totalUsage = 0;

			angular.forEach(dataList, function (data) {
				totalUsage += data.unitPeriodUsage;
			});

			returnData.todayUsage = (totalUsage / 1000000).toFixed(2);
			returnData.co2Emitted = (returnData.todayUsage * 0.474).toFixed(2);
			returnData.treeNeeded = (returnData.todayUsage * 0.12).toFixed(2);
			returnData.calories = (returnData.todayUsage * 860.421).toFixed(0);
			returnData.hambugers = (returnData.calories / 279).toFixed(1);
			return returnData;
		}
	});
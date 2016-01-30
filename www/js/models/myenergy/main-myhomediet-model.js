angular.module('enertalkHomeUSA.services')

	.service('MyhomeDietModel', function ($q, Api, User) {

		this.getModel = function () {
			var deferred = $q.defer(),
				now = new Date(),
				start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0),
				period = {
					unit: '15min'
				};

			period.start = start.getTime();
			period.end = now.getTime();

			Api.getPeriodicUsage(User.accesstoken, User.uuid, period)
			.then(function (response) {
				var returnData;
				if (response.status === 200) {
					returnData = refineData(response.data);
					deferred.resolve(returnData);
				} else {
					deferred.reject('error');
				}
			})
			.catch(function (error) {
				deferred.reject(error);
			});
			
			return deferred.promise;
		};

		function refineData (dataList) {
			var returnData = {};

			returnData.totalUsage = 0;
			angular.forEach(dataList, function (data) {
				returnData.totalUsage += data.unitPeriodUsage;
			});

			returnData.kWh = returnData.totalUsage / 1000000;
			returnData.kcal = returnData.kWh * 860.421;
			returnData.hamburgers = returnData.kcal / 279;
			returnData.pizzas = returnData.kcal / 2269;
			returnData.sodas = returnData.kcal / 140;
			returnData.personsLivingADay = returnData.kcal / 2000;
			
			return returnData;
		}
	});
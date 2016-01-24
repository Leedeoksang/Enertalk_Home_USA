angular.module('enertalkHomeUSA.services')

	.service('BillEstimatorModel', function ($q, Api, User) {

		this.getModel = function () {
			var now = new Date(),
				start = new Date(now.getFullYear(), now.getMonth(), 1),
				period = {
					unit: 'daily'
				},
				deferred = $q.defer();

			period.start = start.getTime();
			period.end = now.getTime();

			$q.all([
				Api.getPeriodicUsage(User.accesstoken, User.uuid, period),
				Api.getForecastUsage(User.accesstoken, User.uuid)
				]).then(function (responses) {
					var returnData = {};

					if (responses[0].status === 200 && responses[1].status === 200) {
						returnData = refineData(responses[0].data, responses[1].data);
						deferred.resolve(returnData);
					} else {
						deferred.reject(returnData);
					}
			})
			.catch(function (error) {
				console.log(error);
				deferred.reject(error);
			});
			
			return deferred.promise;
		};

		function refineData (periodicDataList, forecastData) {
			var totalUsage = 0,
				forecastUsage = 0;

			angular.forEach(periodicDataList, function (periodData) {
				totalUsage += periodData.unitPeriodUsage;
			});

			forecastUsage = forecastData.meteringUsage;

			return {
				totalUsage: totalUsage,
				forecastUsage: forecastUsage
			};
		}
	});
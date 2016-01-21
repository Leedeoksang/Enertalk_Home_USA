angular.module('enertalkHomeUSA.services')

	.service('EnergyCalendarModel', function ($q, Api, User) {

		this.getModel = function () {
			var deferred = $q.defer(),
				now = new Date(),
				period = {
					unit: 'daily'
				},
				start = new Date(now.getFullYear(), now.getMonth(), 1);

			period.start = start.getTime();
			period.end = now.getTime();

			$q.all([
				Api.getPeriodicUsage(User.accesstoken, User.uuid, period),
				Api.getForecastUsage(User.accesstoken, User.uuid)
				])

			.then(function (responses) {
				var data = {},
					tempData;

				if (responses[0].status === 200) {
					tempData = refineData(responses[0].data);
					data.totalUsage = tempData.totalUsage;
					data.dataList = tempData.dataList;
				}	
				if (responses[1].status === 200) {
					data.forecastUsage = responses[1].data.meteringUsage;
				}
				deferred.resolve(data);
			})

			.catch(function (error) {
				deferred.reject(data);
			});

			// Api.getPeriodicUsage(User.accesstoken, User.uuid, period)
			// .then(function (response) {
			// 	if (response.status == 200) {
			// 		var data = refineData(response.data);
			// 		deferred.resolve(data);
			// 	} else {
			// 		deferred.reject('status not 200');
			// 	}
			// })
			// .catch(function (error) {
			// 	deferred.reject(error);
			// });

			return deferred.promise;
		};

		function refineData (dataList) {
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

		this.getModel2 = function () {
			var deferred = $q.defer(),
				now = new Date(),
				period = {
					unit: 'hourly'
				},
				start = new Date(now.getFullYear(), now.getMonth(), 1);

			period.start = start.getTime();
			period.end = now.getTime();
			
			Api.getPeriodicUsage(User.accesstoken, User.uuid, period)
			.then(function (response) {
				
			});
		};
	});
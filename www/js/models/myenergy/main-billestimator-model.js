angular.module('enertalkHomeUSA.services')

	.service('BillEstimatorModel', function ($q, Api, User) {

		this.getModel = function (period) {
			var now = new Date(),
				deferred = $q.defer(),
				period1 = {},
				period2 = {},
				start1 = new Date(period.start),
				end1 = new Date(period.end),
				start2,
				end2;

			period1 = period;
			period1.unit = 'hourly';

			period2.period = 'monthly';
			start2 = new Date(start1.getFullYear(), start1.getMonth() - 4, start1.getDate());
			end2 = new Date(start1.getFullYear(), start1.getMonth(), start1.getDate());
			period2.start = start2.getTime();
			period2.end = end2.getTime();

			$q.all([
				// Api.getPeriodicUsage(User.accesstoken, User.uuid, period1),
				Api.getMeteringUsage(User.accesstoken, User.uuid),
				Api.getMeteringUsages(User.accesstoken, User.uuid, period2),
				Api.getForecastUsage(User.accesstoken, User.uuid)
				]).then(function (responses) {
					var returnData = {};

					if (responses[0].status === 200 && responses[1].status === 200) {
						returnData = refineData(responses[0].data, responses[1].data, responses[2].data);
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

		function refineData (currentMonthData, previousMonthData, forecastData) {
			var currentMonth = {
					totalUsage: currentMonthData.meteringPeriodUsage
				},
				currentUsage = 0,
				forecastUsage = forecastData.meteringUsage,
				previousMonths = previousMonthData.usages;

			// angular.forEach(currentMonthDataList, function (currentMonthData) {
			// 	currentMonth.totalUsage += currentMonthData.unitPeriodUsage;
			// });

			return {
				currentMonth: currentMonth,
				previousMonths: previousMonths,
				forecastUsage: forecastUsage
			};
		}

		// function refineData (periodicDataList, forecastData) {
		// 	var totalUsage = 0,
		// 		forecastUsage = 0,
		// 		monthDataList = [],
		// 		monthData = {},
		// 		currentDate,
		// 		previousMonth;

		// 	if (periodicDataList.length) {

		// 		angular.forEach(periodicDataList, function (periodicData, index) {
				
		// 			if (index === 0) {
		// 				currentDate = new Date(periodicData.timestamp);
		// 				previousMonth = currentDate.getMonth();
		// 				monthData.timestamp = periodicData.timestamp;
		// 				monthData.totalUsage = periodicData.unitPeriodUsage;
		// 			} else if (index === periodicDataList.length - 1) {
		// 				monthData.totalUsage += periodicData.unitPeriodUsage;
		// 				monthDataList.push(monthData);
		// 			} else {
		// 				currentDate = new Date(periodicData.timestamp);
		// 				if (currentDate.getMonth() !== previousMonth) {
		// 					monthDataList.push(monthData);
		// 					monthData = {
		// 						timestamp: periodicData.timestamp,
		// 						totalUsage: periodicData.unitPeriodUsage
		// 					};
		// 				} else {
		// 					monthData.totalUsage += periodicData.unitPeriodUsage;
		// 				}
		// 				previousMonth = currentDate.getMonth();
		// 			}
		// 		});

		// 		forecastUsage = forecastData.meteringUsage;
		// 	}

		// 	return {
		// 		currentMonth: monthDataList.pop(),
		// 		previousMonths: monthDataList,
		// 		forecastUsage: forecastUsage
		// 	};
		// }
	});
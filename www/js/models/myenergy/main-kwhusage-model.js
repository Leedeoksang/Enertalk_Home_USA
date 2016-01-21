angular.module('enertalkHomeUSA.services')

	.service('KwhUsageModel', function ($q, Api, User) {

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
					console.log(response);
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

	});
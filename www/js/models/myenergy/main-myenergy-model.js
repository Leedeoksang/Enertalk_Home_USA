angular.module('enertalkHomeUSA.services')

	.service('MyenergyModel', function ($q, Api, User, Util) {

		this.getModel = function () {
			var deferred = $q.defer(),
				now = new Date(),
				period1 = {
					unit: '15min'
				},
				period2 = {
					unit: 'daily'
				},
				start1 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0),
				start2 = new Date(now.getFullYear(), now.getMonth(), 1);

			period1.start = start1.getTime();
			period1.end = now.getTime();
			period2.start = start2.getTime();
			period2.end = now.getTime();

			$q.all([
				Api.getPeriodicUsage(User.accesstoken, User.uuid, period1),
				Api.getPeriodicUsage(User.accesstoken, User.uuid, period2)
			]).then(function (responses) {
				var returnData;
				if (responses[0].status === 200 && responses[1].status === 200) {
					returnData = refineData(responses[0].data);
					returnData.monthBill = refineForBill(responses[1].data);
					deferred.resolve(returnData);
				} else {
					deferred.reject('error');
				}
			}).catch(function (error) {
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

			returnData.todayUsage = totalUsage / 1000000;
			returnData.todayBill = Util.bill.getBill(returnData.todayUsage);
			returnData.co2Emitted = Util.conversion.co2(returnData.todayUsage, 'k');
			returnData.treeNeeded = Util.conversion.tree(returnData.todayUsage, 'k');
			return returnData;
		}

		function refineForBill (dataList) {
			var totalUsage = 0,
				bill;
			angular.forEach(dataList, function (data) {
				totalUsage += data.unitPeriodUsage;
			});
			bill = Util.bill.getBill(totalUsage / 1000000);
			return bill ? bill : 0;
		}
	});
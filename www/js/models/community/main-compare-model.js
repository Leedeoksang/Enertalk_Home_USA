angular.module('enertalkHomeUSA.services')

	.service('CompareModel', function ($q, Api, User) {

		this.getModel = function () {
			var deferred = $q.defer(),
				now = new Date(),
				start1 = new Date(now.getFullYear(), now.getMonth(), 1),
				start2 = new Date(now.getFullYear(), now.getMonth() - 1, 1),
				end2 = new Date(now.getFullYear(), now.getMonth(), 1), // end2 is same as start1 (for seeing easily)
				period1 = {
					unit: 'monthly',
					start: start1.getTime(),
					end: now.getTime()
				},
				period2 = {
					unit: 'monthly',
					start: start2.getTime(),
					end: end2.getTime()
				},
				state1 = 'current',
				state2 = 'last';

			$q.all([
				Api.getUsageRanking(User.accesstoken, User.uuid, period1, state1),
				Api.getUsageRanking(User.accesstoken, User.uuid, period2, state2)
				]).then(function (responses) {
					var returnData = [];

					if (responses[0].status === 200 && responses[1].status === 200) {
						returnData[0] = responses[0].data.user;
						returnData[1] = responses[1].data.user;
						deferred.resolve(returnData);
					} else {
						deferred.reject('error');
					}
				}).catch(function (error) {
					deferred.reject(error);
				});

			return deferred.promise;
		};

	});
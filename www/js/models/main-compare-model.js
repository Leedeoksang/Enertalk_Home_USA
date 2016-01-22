angular.module('enertalkHomeUSA.services')

	.service('CompareModel', function ($q, Api, User) {

	    this.getYearData = function () {
	        var deferred = $q.defer(),
			period = {
			    unit: 'monthly'  //ideally monthly
			},
			now = new Date(),
			start = new Date(now.getFullYear(), 0, 1); // month is zero indexed, so 0 -> January

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

	    function refineData(dataList, type) {
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
	            tempDate.setDate(tempDate.getDate() + 1);
	            while (tempDate.getDate() !== 1) {
	                returnData.push({
	                    x: tempDate.getTime(),
	                    y: 0
	                });
	                tempDate.setDate(tempDate.getDate() + 1);
	            }
	        }

	        return returnData;
	    }



	});
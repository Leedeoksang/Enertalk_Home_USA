angular.module('enertalkHomeUSA.controllers')

	.controller('BillingSettingCtrl', function ($scope, Util, User) {

		function init () {
			var billingInfo = Util.localStorage.getObject('billingInfo'),
				meteringday = {
					id: User.profile.meteringday
				};

			$scope.stateList = [{
				id: 1,
				label: 'CA',
				cityList: [{id: 1, label: 'Los Angeles'}, {id: 2, label: 'Bay Area'}, {id: 3, label: 'Seal Beach'}]
			},{
				id: 2,
				label: 'MA',
				cityList: [{id: 1, label: 'Boston'}]
			}];

			$scope.cityList = [{id: 1, label: 'Boston'}];
			billingInfo.city = {id: 1, label: 'Boston'};
			// for requirement of cho

			$scope.meteringdayList = [];
			$scope.ratePlanList = [];
			$scope.meteringdayList = getMeteringdayList();
			$scope.billingInfo = billingInfo;
			
			$scope.billingInfo = {
				state: billingInfo.state,
				city: billingInfo.city,
				meteringday: meteringday
			};
		}

		$scope.changeInfo = function () {
			var billingInfo = $scope.billingInfo,
				loadingPopup = Util.loadingPopup.show(),
				userInfo = {
					meteringDay: billingInfo.meteringday.id
				};

			Util.localStorage.setObject('billingInfo', billingInfo);
			User.setUserInfo(userInfo).then(function (response) {
				loadingPopup.close();
				if (response === 'success') {
					Util.loadingPopup.success();
					User.resetProfile();
				} else {
					Util.loadingPopup.fail();
				}
			});
		}

		function getMeteringdayList () {
			var returnData = [];

			for (var i = 1; i <= 28; i += 1) {
				returnData.push({
					id: i,
					label: (function () {
						if (i === 1) {
							return '1st';
						} else if (i === 2) {
							return '2nd';
						} else if (i === 3) {
							return '3rd';
						} else if (i === 21) {
							return '21st';
						} else if (i === 22) {
							return '22nd';
						} else if (i === 23) {
							return '23rd';
						} else {
							return i + 'th';
						}
					})(),
					day: i
				});
			}
			return returnData;
		}

		init ();
	});
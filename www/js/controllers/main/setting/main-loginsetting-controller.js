angular.module('enertalkHomeUSA.controllers')

	.controller('LoginSettingCtrl', function ($scope, Util, User, $state, $ionicPopup) {

		function init () {
			var setting = Util.localStorage.getObject('setting'),
				settingKeyList = Object.keys(setting);
			
			$scope.setting = setting;
			
			if (settingKeyList.indexOf('enableAutoLogin') < 0) {
				$scope.setting.enableAutoLogin = false;
				Util.localStorage.setObject('setting', $scope.setting);
			}
		}

		$scope.changeSetting = function () {
			var setting = $scope.setting;
			Util.localStorage.setObject('setting', setting);
		};

		$scope.logout = function () {
			$ionicPopup.show({
				title: 'Want to logout?',
				buttons: [{
					text: 'Cancel',
					onTap: function () {

					}
				},{
					text: 'OK',
					onTap: function () {
						$scope.setting.enableAutoLogin = false;
						Util.localStorage.setObject('setting', $scope.setting);
						$state.go('intro.login');
					}
				}]
			});
			User.logout();
		};

		init ();
	});
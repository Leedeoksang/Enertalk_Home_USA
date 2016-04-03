angular.module('enertalkHomeUSA.controllers')

	.controller('IntroLoginCtrl', function ($scope, $state, User, Util, $interval, $timeout, $cordovaNetwork, $ionicPopup, UIHub) {

		$scope.credentials = {
			id: undefined,
			password: undefined
		};
		
		function init () {
			var credentials,
				setting = Util.localStorage.getObject('setting');

				if (setting.enableAutoLogin) {
					credentials = Util.localStorage.getObject('loginData');
					// auto login
					if (credentials.id && credentials.password) {
						$scope.credentials = credentials;
						$scope.login();
					}
				}

			// for network check

			// document.addEventListener("deviceready", function () {
			// 	var isOnline = $cordovaNetwork.isOnline();
			// 	if (!isOnline) {
			// 		$ionicPopup.show({
			// 			title: 'network is not connected',
			// 			buttons: [{
			// 				text: 'OK'
			// 			}]
			// 		});
			// 	} else {
			// 		var credentials,
			// 			setting = Util.localStorage.getObject('setting');

			// 		if (setting.enableAutoLogin) {
			// 			credentials = Util.localStorage.getObject('loginData');
			// 			// auto login
			// 			if (credentials.id && credentials.password) {
			// 				$scope.credentials = credentials;
			// 				$scope.login();
			// 			}
			// 		}
			// 	}
			// }, false);
		}

		$scope.login = function () {
			var credentials = {};

			$scope.isError = false;
			$scope.hasNoId = false;
			$scope.hasNoPassword = false;

			$scope.loading = true;
			if ($scope.credentials.id && $scope.credentials.password) {

				if ($scope.credentials.id.indexOf('@') > -1) {
					credentials.email = $scope.credentials.id;
				} else {
					credentials.phone = $scope.credentials.id;
				}

				credentials.password = $scope.credentials.password;
				credentials.app_version = 'web';

				User.login(credentials, function (error, response) {
					if (error) {
						if (error.data.error_description === 'User not found') {
							$scope.isError = true;
						}
						// id and password error
					} else {
						Util.localStorage.setObject('loginData', $scope.credentials);
						UIHub.init();
						$state.go('main.myenergy');
					}
					$scope.loading = false;

				});
			} else if (!$scope.credentials.id) {
				$scope.hasNoId = true;
				$scope.loading = false;
				console.log('noId');
				// id input command
			} else if (!$scope.credentials.password) {
				$scope.hasNoPassword = true;
				$scope.loading = false;
				console.log('noPassword');
				// password input commanad
			}
		};

		$scope.logout = function () {

		};

		$scope.passwordRecovery = function () {

		};

		$scope.signup = function () {

		};

		init();
	});

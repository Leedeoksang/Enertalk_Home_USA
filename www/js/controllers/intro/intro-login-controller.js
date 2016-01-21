angular.module('enertalkHomeUSA.controllers')

	.controller('IntroLoginCtrl', function ($scope, $state, User, Util, $timeout) {
		
		$scope.credentials = {
			id: undefined,
			password: undefined
		};

		function init () {
			var credentials,
				setting = Util.localStorage.getObject('setting');

			// if (setting.enableAutoLogin) {
			// 	credentials = Util.localStorage.getObject('loginData');
			// 	// auto login
			// 	if (credentials.id && credentials.password) {
			// 		$scope.credentials = credentials;
			// 		$scope.login();
			// 	}
			// }
		}

		$scope.login = function () {
			var credentials = {};

			if ($scope.credentials.id && $scope.credentials.password) {
				$scope.loading = true;

				if ($scope.credentials.id.indexOf('@') > -1) {
					credentials.email = $scope.credentials.id;
				} else {
					credentials.phone = $scope.credentials.id;
				}
				
				credentials.password = $scope.credentials.password;
				credentials.app_version = 'web';

				User.login(credentials, function (error, response) {
					if (error) {
						// id and password error
					} else {
						Util.localStorage.setObject('loginData', $scope.credentials);
						$state.go('main.myenergy');
					}
					$scope.loading = false;

				});
			} else if (!$scope.credentials.id) {

				// id input command
			} else if (!$scope.credentials.password) {

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
angular.module('enertalkHomeUSA.controllers')

	.controller('MainSettingCtrl', function($scope, User, Util, $cordovaCamera, $log, $window, $state, $rootScope) {
		function init () {
			var setting = Util.localStorage.getObject('setting'),
				profileImage = Util.localStorage.get('profileImageURI'),
				settingKeyList = Object.keys(setting),
				imageTarget = document.getElementById('profile-image');

			$scope.profile = User.profile;
			$scope.setting = setting;
			$scope.plan = (User.dailyPlan / 1000000).toFixed(2);

			if (profileImage) {
				imageTarget.src = "data:image/jpeg;base64," + profileImage;
			} else {
				imageTarget.src = './img/user.png';
			}
			
			if (settingKeyList.indexOf('enableAutoLogin') < 0) {
				$scope.setting.enableAutoLogin = true;
				Util.localStorage.setObject('setting', setting);
			}
			if (settingKeyList.indexOf('enableRealtimePopup') < 0) {
				$scope.setting.enableRealtimePopup = true;
				Util.localStorage.setObject('setting', setting);
			}
		}

		$scope.changeSetting = function () {
			var setting = $scope.setting;
			Util.localStorage.setObject('setting', setting);
		};

		$scope.changeProfileImage = function () {
			document.addEventListener("deviceready", function () {
			    var options = {
			      	destinationType: Camera.DestinationType.DATA_URL,
			      	sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			      	allowEdit: true,
			      	encodingType: Camera.EncodingType.JPEG
			    };

			    $cordovaCamera.getPicture(options).then(function(imageData) {
			    	var image = document.getElementById('profile-image');
				  	
				  	image.src = "data:image/jpeg;base64," + imageData;
			      	Util.localStorage.set('profileImageURI', imageData);    	
			    }, function(err) {
			     	$log.info(err);
			    });
			});
		};

		$scope.editHomeInfo = function () {
		    if (typeof $rootScope.home == 'undefined') {
		        $rootScope.home = {};
		    }
		    $state.go('main.compare-edit')
		}

		init ();
	});
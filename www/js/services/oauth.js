angular.module('enertalkHomeUSA.services')

	.service('Oauth', function ($http, OAUTHURL, Util, $log) {
		
		this.getAccesstoken = function (credentials) {
			return $http({
				method: 'POST',
				url: OAUTHURL.tokenUrl,
				headers: {
					'Authorization': Util.encodeAuthHeader.basic(OAUTHURL.clientId, OAUTHURL.clientSecret)
				},
				data: {
					grant_type: 'password',
					credentials: credentials
				}
			});
		};



		this.verifyToken = function (accesstoken) {
			return $http({
				method: 'GET',
				url: OAUTHURL.verifyUrl,
				headers: {
					'Authorization': Util.encodeAuthHeader.bearer(accesstoken)
				}
			});
		};

		this.refreshToken = function (refreshtoken, next) {
			return $http({
        		method: 'POST',
        		url: OAUTHURL.tokenUrl,
        		headers: {
          			'Authorization': Util.encodeAuthHeader.basic(OAUTHURL.clientId, OAUTHURL.clientSecret)
        		},
        		data: {
          			grant_type: 'refresh_token',
          			refresh_token: refreshToken
        		}
      		});
		};

		this.getUUID = function (accesstoken) {
			return $http({
				method: 'GET',
				url: OAUTHURL.uuidUrl,
				headers: {
					'Authorization': Util.encodeAuthHeader.bearer(accesstoken)
				}
			});
		};
	});
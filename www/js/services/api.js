angular.module('enertalkHomeUSA.services')

	.service('Api', function (APIURL, $http, Util) {
		
		this.getProfile = function (accesstoken) {
			return $http({
				method: 'GET',
				url: APIURL.profileUrl,
				headers: {
					'Authorization': Util.encodeAuthHeader.bearer(accesstoken)
				},
				params: {
					app_version: '0.0.10'
				}
			});
		};
		this.getPeriodicUsage = function (accesstoken, uuid, period) {
			return $http({
				method: 'GET',
				url: APIURL.periodicUsage(uuid),
				headers: {
					'Authorization': Util.encodeAuthHeader.bearer(accesstoken)
				},
				params: {
					period: period.unit,
					start: period.start,
					end: period.end
				}
			});
		};
		this.getMeteringUsage = function (accesstoken, uuid) {
			return $http({
				method: 'GET',
				url: APIURL.merteringUsage(uuid),
				headers: {
					'Authorization': Util.encodeAuthHeader.bearer(accesstoken)
				}
			});
		};// for single usage
		this.getMeteringUsages = function (accesstoken, uuid, period) {
			return $http({
				method: 'GET',
				url: APIURL.meteringUsages(uuid),
				headers: {
					'Authorization': Util.encodeAuthHeader.bearer(accesstoken)
				},
				params: period
			});
		};// for mutiple usage
		this.getForecastUsage = function (accesstoken, uuid) {
			return $http({
				method: 'GET',
				url: APIURL.forecastUsage(uuid),
				headers: {
					'Authorization': Util.encodeAuthHeader.bearer(accesstoken)
				}
			});
		};
		this.getUsageRanking = function (accesstoken, uuid, period, state) {
		    return $http({
		        method: 'GET',
		        url: APIURL.usageRanking(uuid),
		        headers: {
		            'Authorization': Util.encodeAuthHeader.bearer(accesstoken)
		        },
		        params: {
		            period: period.unit,
		            start: period.start,
		            end: period.end,
                    state: state
		        }
		    });
		};
		this.setUserInfo = function (accesstoken, userInfo) {
			
			return $http({
				method: 'PUT',
				url: APIURL.userInfo(),
				headers: {
					'Authorization': Util.encodeAuthHeader.bearer(accesstoken)
				},
				data: userInfo
			});
		};
	});
angular.module('enertalkHomeUSA.services')
	
	.service('User', function (Oauth, Api, $log, $q, Util) {
		
		var _this = this;

		this.init = function () {
			_this.accesstoken = undefined;
			_this.refreshtoken = undefined;
			_this.uuid = undefined;
			_this.profile = {};
			_this.dailyPlan = 0;
			_this.hourlyPlan = 0;
			_this.monthData = undefined;

			var savedUser = Util.localStorage.getObject('User');

			if (savedUser) {
				_this.accesstoken = savedUser.accesstoken;
				_this.refreshtoken = savedUser.refreshtoken;
				_this.uuid = savedUser.uuid;
				_this.dailyPlan = savedUser.dailyPlan;
				_this.hourlyPlan = savedUser.monthlyPlan;
				_this.monthData = savedUser.monthData;
			}
		};

		this.login = function (credentials, next) {
			Oauth.getAccesstoken(credentials)

			.then(function (response) {
				if (response.status === 200 && response.data.access_token) {
					_this.accesstoken = response.data.access_token;
					_this.refreshtoken = response.data.refresh_token;
					return Oauth.getUUID(_this.accesstoken);
				} else {
					return $q.reject();
				}
			})

			.then(function (response) {
				if (response.status === 200 && response.data.uuid) {
					_this.uuid = response.data.uuid;
					return Api.getProfile(_this.accesstoken);	
				} else {
					return $q.reject();
				}
			})

			.then(function (response) {
				if (response.status === 200 && response.data) {
					_this.profile = response.data;
					_this.setDailyPlan(_this.profile.maxLimitUsage);
					_this.hourlyPlan = _this.dailyPlan / 24;
					next(null, 'success');
					_this.getMonthData();
					
					Util.localStorage.setObject('User', {
						accesstoken: _this.accesstoken,
						refreshtoken: _this.refreshtoken,
						uuid: _this.uuid,
						profile: _this.proflie,
						dailyPlan: _this.dailyPlan,
						hourlyPlan: _this.hourlyPlan,
						monthData: _this.monthData
					});

				} else {
					return $q.reject();
				}
			})

			.catch(function (error) {
				$log.info(error);
				next(error, 'error');
			});
		};

		this.logout = function () {

		};

		this.setDailyPlan = function (monthlyPlan) {
			var now = new Date(),
				start = new Date(now.getFullYear(), now.getMonth(), 1),
				end = new Date(now.getFullYear(), now.getMonth() + 1, 0),
				lengthOfThisMonth = end.getDate() - start.getDate() + 1;

			_this.dailyPlan = monthlyPlan / lengthOfThisMonth;
		};

		this.getMonthData = function () {
			var period = {},
				now = new Date(),
				start = new Date(now.getFullYear(), now.getMonth(), 1);

				period.unit = 'hourly';
				period.start = start.getTime();
				period.end = now.getTime();

				Api.getPeriodicUsage(_this.accesstoken, _this.uuid, period)
				.then(function (response) {
					if (response.status === 200) {
						_this.monthData = Util.refineMonthData(response.data);
					}
				});
		};

		_this.init();
	});
angular.module('enertalkHomeUSA')
	.constant('DEMO_ACCOUNT', {
		'email': 'home.demo@encoredtech.com',
	    'password': 'dlszhdjem0419'
	})

	.constant('MODE', 'production')

  .constant('CONVERSION', {
    co2: 0.5222489,
    tree: 0.1,
    mile: 2.4,
    waste: 0.4,
    coal: 1.1
  })

	.constant('APIURL', (function (isDevelopment) {
		var domain = isDevelopment ? 'http://api-staging.encoredtech.com' : 'https://api.encoredtech.com:8082';
		return {
      		'signUpUrl': domain + '/1.1/users/basicinfo/signup',
      		'nickNameCheckUrl': domain + '/1.1/users/basicinfo/signup/nickName',
      		'nickNameChangeUrl': domain + '/1.1/users/basicinfo/nickName',
      		'phoneNumberCheckUrl': domain + '/1.1/users/basicinfo/signup/phone',
      		'phoneNumberChangeUrl': domain + '/1.1/users/basicinfo/phone',
      		'emailCheckUrl': domain + '/1.1/users/basicinfo/signup/email',
      		'emailChangeUrl': domain + '/1.1/users/basicinfo/email',
      		'passwordChangeUrl': domain + '/1.1/users/basicinfo/password',
      		'passwordResetUrl': domain + '/1.1/users/basicinfo/password/reset',
      		'deviceRegisterUrl': domain + '/admin/1.2/devices/register',
      		'deviceStatusUrl': function (uuid) {
        		return domain + '/1.2/devices/' + uuid + '/status';
      		},
      		'questionSendUrl': domain + '/1.1/cs/question/email',
      		'phoneSendUrl': domain + '/1.1/users/basicinfo/signup/sms',
      		'emailSendUrl': domain + '/1.1/users/basicinfo/auth/code',
      		'profileUrl': domain + '/1.1/users/basicinfo',
      		'siteInfoUrl': function (uuid) {
        		return domain + '/1.2/sites/' + uuid;
      		},
      		'pushUrl': function (uuid) {
        		return domain + '/1.2/devices/' + uuid + '/events/push';
      		},
      		'langUrl': domain + '/1.1/users/basicinfo/language',
      		'csUrl': domain + '/1.2/cs/contact',
          userInfo: function (userId) {
            return domain + '/1.2/' + (userId || 'me');
          },

          deviceInfo: function (deviceHash) {
            return domain + '/1.2/devices/' + deviceHash;
          },

          appliances: function (siteHash) {
            return domain + '/1.2/sites/' + siteHash + '/appliances';
          },

          nilmAppliancesBySite: function (siteHash) {
            return domain + '/1.2/sites/' + siteHash + '/nilm/appliances';
          },

          nilmApplianceUsageBySite: function (siteHash, periodUnit) {
            return domain + '/1.2/sites/' + siteHash + '/nilm/appliances/' + periodUnit + '/usages';
          },

          nilmAppliances: function (deviceHash) {
            return domain + '/1.2/devices/' + deviceHash + '/nilm/appliances';
          },

          nilmApplianceUsage: function (deviceHash, periodUnit) {
            return domain + '/1.2/devices/' + deviceHash + '/nilm/appliances/' + periodUnit + '/usages';
          },

          forecastUsage: function (deviceHash) {
            return domain + '/1.2/devices/' + deviceHash + '/forecastUsage';
          },

          forecastUsages: function (siteHash) {
            return domain + '/1.2/sites/' + siteHash + '/appliances/hourly/forecastusages';
          },

          realtimeUsage: function (deviceHash) {
            return domain + '/1.2/devices/' + deviceHash + '/realtimeUsage';
          },

          meteringUsage: function (deviceHash) {
            return domain + '/1.2/devices/' + deviceHash + '/meteringUsage';
          },

          meteringUsages: function (deviceHash) {
            return domain + '/1.2/devices/' + deviceHash + '/meteringUsages';
          },

          periodicUsage: function (deviceHash) {
            return domain + '/1.2/devices/' + deviceHash + '/usages';
          },

          standbyUsage: function (deviceHash) {
            return domain + '/1.2/devices/' + deviceHash + '/standbyPower';
          },

          usageRanking: function (siteHash) {
            return domain + '/1.2/ranking/usages/' + (siteHash || '');
          },

          periodicEvents: function (siteHash) {
            return domain + '/1.2/sites/' + siteHash + '/events';
          },

          monthlyUsage: function (siteHash) {
            return domain + '/1.2/sites/' + siteHash + '/monthly/usages';
          },

          billByUsage: function (deviceHash) {
            return domain + '/1.2/devices/' + deviceHash + '/bill/meteringUsage';
          },
          usageByBill: function (deviceHash) {
            return domain + '/1.2/devices/' + deviceHash + '/bill/expectedUsage';
          },
          billByTimestamp: function (deviceHash) {
            return domain + '/1.2/devices/' + deviceHash + '/bill/home';
          }
    	}
	})())

	.constant('OAUTHURL', (function (isDevelopment) {
		var domain = 'https://enertalk-auth.encoredtech.com',
      		clientId,
      		clientSecret;

      	if (isDevelopment) {
      		clientId = 'RU5DT1JFRF9FTkVSVEFMS19IT01F';
	      	clientSecret = 'oc16745q3cf6cg4239y83mm61a15w9g27dq30a0';
      	} else {
      		clientId = 'RU5DT1JFRF9FTkVSVEFMS19IT01FX1BST0Q=';
	      	clientSecret = 'ek1uf46h30w9x48y06dg4i824x6bn9nc3pe6nv1';
      	}

      	return {
      		'authorizationUrl' : domain + '/authorization',
      		'tokenUrl'         : domain + '/token',
      		'verifyUrl'        : domain + '/verify',
      		'uuidUrl'          : domain + '/uuid',

      		'clientId'         : clientId,
      		'clientSecret'     : clientSecret
    	};
	})())
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('enertalkHomeUSA', ['ionic', 'ngCordova', 'enertalkHomeUSA.controllers', 'enertalkHomeUSA.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  
  });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      // intro views
      .state('intro', {
          url: '/intro',
          abstract: true,
          templateUrl: 'templates/intro/intro.html',
          controller: 'IntroCtrl'
      })

      .state('intro.login', {
          url: '/login',
          views: {
              'introContent': {
                  templateUrl: 'templates/intro/intro-login.html',
                  controller: 'IntroLoginCtrl'
              }
          }
      })
      // ------------------------------------------

      // tab view
      .state('main', {
          url: '/main',
          cache: false,
          abstract: true,
          templateUrl: 'templates/main/main.html',
          controller: 'MainCtrl'
      })
      // --------------------------------------------

      // myenergy views
      .state('main.myenergy', {
          url: '/myenergy',
          cache: false,
          views: {
              'MyenergyContent': {
                  templateUrl: 'templates/main/myenergy/myenergy.html',
                  controller: 'MainMyenergyCtrl'
              }
          }
      })

      .state('main.kwh-usage', {
          url: '/kwh-usage',
          views: {
              'MyenergyContent': {
                  templateUrl: 'templates/main/myenergy/kwh-usage.html',
                  controller: 'KwhUsageCtrl'
              }
          }
      })

      .state('main.usage-trends', {
          url: '/usage-trends',
          views: {
              'MyenergyContent': {
                  templateUrl: 'templates/main/myenergy/usage-trends.html',
                  controller: 'UsageTrendsCtrl'
              }
          }
      })

      .state('main.energy-calendar', {
          url: '/energy-calendar',
          views: {
              'MyenergyContent': {
                  templateUrl: 'templates/main/myenergy/energy-calendar.html',
                  controller: 'EnergyCalendarCtrl'
              }
          }
      })

      .state('main.realtime-usage', {
        url: '/realtime-usage',
        views: {
          'MyenergyContent': {
            templateUrl: 'templates/main/myenergy/realtime-usage.html',
            controller: 'RealtimeUsageCtrl'
          }
        }
      })

      .state('main.standby-power', {
        url: '/standby-power',
        views: {
          'MyenergyContent': {
            templateUrl: 'templates/main/myenergy/standby-power.html',
            controller: 'StandbyPowerCtrl'
          }
        }
      })

      .state('main.bill-estimator', {
        url: '/bill-estimator',
        views: {
          'MyenergyContent': {
            templateUrl: 'templates/main/myenergy/bill-estimator.html',
            controller: 'BillEstimatorCtrl'
          }
        }
      })

      .state('main.myhome-diet', {
        url: '/myhome-diet',
        views: {
          'MyenergyContent': {
            templateUrl: 'templates/main/myenergy/myhome-diet.html',
            controller: 'MyhomeDietCtrl'
          }
        }
      })

      .state('main.environmental-impact', {
        url: '/environmental-impact',
        views: {
          'MyenergyContent': {
            templateUrl: 'templates/main/myenergy/environmental-impact.html',
            controller: 'EnvironmentalImpactCtrl'
          }
        }
      })
      // ------------------------------------------


      // community views
      .state('main.community', {
          url: '/community',
          views: {
              'CommunityContent': {
                  templateUrl: 'templates/main/community/community.html',
                  controller: 'MainCommunityCtrl'
              }
          }
      })


      .state('main.compete', {
          url: '/compete',
          views: {
              'CommunityContent': {
                  templateUrl: 'templates/main/community/compete.html',
                  controller: 'CommCompeteCtrl'
              }
          }
      })

    .state('main.compare', {
            url: '/compare',
            views: {
                'CommunityContent': {
                    templateUrl: 'templates/main/community/compare.html',
                    controller: 'CommCompareCtrl'  
                }
            }
    })

    .state('main.compare-edit', {
        url: '/compare-edit',
        views: {
            'CommunityContent': {
                templateUrl: 'templates/main/community/compare-edit-unified.html',
                controller: 'CommCompareEditCtrl'
            }
        }
    })

    .state('main.compare-edit-intro', {
        url: '/edit-intro',
        views: {
            'CommunityContent': {
                templateUrl: 'templates/main/community/compare-edit-intro.html',
                controller: 'CommCompareEditCtrl'
            }
        }
    })

    .state('main.compare-edit-size', {
        url: '/edit-size',
        views: {
            'CommunityContent': {
                templateUrl: 'templates/main/community/compare-edit-size.html',
                controller: 'CommCompareEditCtrl'
            }
        }
    })

    .state('main.compare-edit-rooms', {
        url: '/edit-rooms',
        views: {
            'CommunityContent': {
                templateUrl: 'templates/main/community/compare-edit-rooms.html',
                controller: 'CommCompareEditCtrl'
            }
        }
    })

    .state('main.compare-edit-features', {
        url: '/edit-features',
        views: {
            'CommunityContent': {
                templateUrl: 'templates/main/community/compare-edit-features.html',
                controller: 'CommCompareEditCtrl'
            }
        }
    })

    .state('main.compare-edit-family', {
        url: '/edit-family',
        views: {
            'CommunityContent': {
                templateUrl: 'templates/main/community/compare-edit-family.html',
                controller: 'CommCompareEditCtrl'
            }
        }
    })

        .state('main.forum', {
            url: '/forum',
            views: {
                'CommunityContent': {
                    templateUrl: 'templates/main/community/forum.html',
                    controller: 'CommForumCtrl'
                }
            }
        })

        .state('main.donate', {
            url: '/donate',
            views: {
                'CommunityContent': {
                    templateUrl: 'templates/main/community/donate.html',
                    controller: 'CommDonateCtrl'
                }
            }
        })

        .state('main.home-dr', {
            url: '/home-dr',
            views: {
                'CommunityContent': {
                    templateUrl: 'templates/main/community/home-dr.html',
                    controller: 'CommDonateCtrl'
                }
            }
        })

        .state('main.compete-groups',{
            url: '/groups',
            views:{
                'CommunityContent': {
                    templateUrl: 'templates/main/community/compete-groups.html',
                    controller: 'CommCompeteCtrl'
                }
            }
        })
    

        .state('main.compete-in-group',{
            url: '/mygroup',
            views:{
                'CommunityContent': {
                    templateUrl: 'templates/main/community/compete-in-group.html',
                    controller: 'CommCompeteCtrl'
                }
            }
        })
    // --------------------------------------


    // setting views
    .state('main.setting', {
      url: '/setting',
      views: {
        'SettingContent': {
          templateUrl: 'templates/main/setting/setting.html',
          controller: 'MainSettingCtrl'
        }
      }
    })

    .state('main.goal-setting', {
      url: '/goal-setting',
      views: {
        'SettingContent': {
          templateUrl: 'templates/main/setting/goal-setting.html',
          controller: 'GoalSettingCtrl'
        }
      }
    })

    .state('main.info-setting', {
      url: '/info-setting',
      views: {
        'SettingContent': {
          templateUrl: 'templates/main/setting/info-setting.html',
          controller: 'InfoSettingCtrl'
        }
      }
    })
    
    .state('main.login-setting', {
      url: '/login-setting',
      views: {
        'SettingContent': {
          templateUrl: 'templates/main/setting/login-setting.html',
          controller: 'LoginSettingCtrl'
        }
      }
    })

    .state('main.billing-setting', {
      url: '/billing-setting',
      views: {
        'SettingContent': {
          templateUrl: 'templates/main/setting/billing-setting.html',
          controller: 'BillingSettingCtrl'
        }
      }
    });
    
    // --------------------------------------

  $urlRouterProvider.otherwise('/intro/login');
})

.filter('setDecimal', function ($filter) {
    return function (input, places) {
        if (isNaN(input)) {
          return input;
        }
        var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
        return Math.round(input * factor) / factor;
    };
});

angular.module('enertalkHomeUSA.controllers', []);
angular.module('enertalkHomeUSA.services', []);


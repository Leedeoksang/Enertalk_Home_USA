angular.module('enertalkHomeUSA.services')

  .service('Util', function ($window, $ionicPopup, CONVERSION) {
    var _this = this;

    this.querystring = {
      stringify: function (obj) {
        var str = '',
          k = Object.keys(obj);
        for (var i = 0; i <k.length; i += 1) {
          if (i) {
            str += '&';
          }
          str += k[i] + '=' + obj[k[i]];
        }
        return str;
      },
      parse: function (url) {

        var qs = url.split('?')[1],
          arr = qs.split('&'),
          obj = {},
          s, key, value;

        for (var i = 0, len = arr.length; i < len; i += 1) {
          s = arr[i].split('=');
          key = s[0];
          value = s[1];
          if (key && value) {
            obj[key] = value;
          }
        }

        return obj;
      }
    };

    this.encodeAuthHeader = {
      basic: function (clientId, clientSecret) {
        return 'Basic ' + window.btoa(clientId + ':' + clientSecret);
      },
      bearer: function (accessToken) {
        return 'Bearer ' + accessToken;
      }
    };

    this.localStorage = {
      set: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key) {
        return JSON.parse($window.localStorage[key] || '{}');
      },
      remove: function(key) {
        delete $window.localStorage[key];
      }
    };

    this.bill = {
      getBill: function (kWh) {
        // var bill = 0,
        //   state = _this.localStorage.getObject('billingInfo').state;
        
        // if (!state) {
        //   return undefined;
        // } else if (state.label === 'CA') {
        //   bill = _this.bill.billCalculation1(kWh);
        // } else if (state.label == 'MA') {
        //   bill = _this.bill.billCalculation2(kWh);
        // }         
        // return bill;

        return 6.43 + (0.06681 + 0.00227 + 0.02526 + 0.00250 + 0.00050) * kWh;
      },
      getBillRate: function (kWh) {
        var rate = '',
          state = _this.localStorage.getObject('billingInfo').state;

          if (!state) {
            return undefined;
          } else if (state.label === 'CA') {
            rate = _this.bill.billRate1(kWh);
          } else if (state.label === 'MA') {
            rate = _this.bill.billRate2()
          }

        return rate;
      },
      billCalculation1: function (kWh) {
        var bill = 0;
        if (kWh < 0) {
          kWh = 0;
        }
        if (kWh >= 0 && kWh < 700) {
          bill = kWh * 0.14799;
        } else if (kWh >= 700 && kWh < 2100) {
          bill = (700 * 0.14799 + (kWh - 700) * 0.176);
        } else {
          bill = 0;
        }
        return bill;
      },
      billCalculation2: function (kWh) {
        var bill = 0;
        if (kWh < 0) {
          kWh = 0;
        }
        return kWh * 0.1873;
      },
      billRate1: function (kWh) {
        var Tier = 1;
        if (kWh < 0) {
          kWh = 0;
        }
        if (kWh >= 0 && kWh < 700) {
          Tier = 1;
        } else if (kWh >= 700 && kWh < 2100) {
          Tier = 2;
        } else {
          Tier = 3;
        }
        return 'Tier' + Tier;
      },
      billRate2: function () {
        return 'Flat Rate';
      }
    };

    this.loadingPopup = {
      show: function () {
        var popup = $ionicPopup.show({
          template: '<ion-spinner></ion-spinner>'
        });

        return popup;
      },
      success: function () {
        $ionicPopup.show({
          title: 'Finished',
          buttons: [{
            text: 'OK'
          }]
        });
      },
      fail: function () {
        $ionicPopup.show({
          title: 'Cancled',
          buttons: [{
            text: 'OK'
          }]
        });
      }
    };

    this.conversion = {
      co2: function (figure, type) {
        if (type === 'k' || !type) { 
          return figure * CONVERSION.co2;
        } else {
          return (figure * CONVERSION.co2) / 1000000;
        }
      },
      tree: function (figure, type) {
        if (type === 'k' || !type) {
          return figure * CONVERSION.tree;
        } else {
          return (figure * CONVERSION.tree) / 1000000;
        }
      },
      mile: function (co2kg) {
        // be careful! Unit is 'kg'
        return co2kg * CONVERSION.mile;
      },
      waste: function (co2kg) {
        // be careful! Unit is 'kg'
        return co2kg * CONVERSION.waste;
      },
      coal: function (co2kg) {
        // be careful! Unit is 'kg'
        return co2kg * CONVERSION.coal;
      }
    };

    this.getMonthName = function (month) {
      var monthName = '',
        monthList = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      if (typeof month === 'number') {
        month = month + '';
      }
      return monthList[month - 1];
    };

    this.refineMonthData = function (dataList) {
      var refineData = [],
        refineObject = {
          timestamp: 0,
          unitPeriodUsage: 0,
          activeTime: ''
        },
        currentDate,
        previousDate,
        timeData = [0, 0, 0, 0];

      angular.forEach(dataList, function (data, index) {
        if (index === 0) {
          refineObject.timestamp = data.timestamp;
          refineObject.unitPeriodUsage = data.unitPeriodUsage;
          currentDate = new Date(data.timestamp);
          previousDate = new Date(data.timestamp);
          timeData[defineActiveTime(data.timestamp)] += data.unitPeriodUsage;
        } else if (index === dataList.length - 1) {
          refineObject.unitPeriodUsage += data.unitPeriodUsage;
          refineObject.activeTime = getActiveTime(timeData);
          refineData.push(refineObject);
        } else {
          currentDate = new Date(data.timestamp);
          if (currentDate.getDate() !== previousDate.getDate()) {
            refineObject.activeTime = getActiveTime(timeData);
            refineData.push(refineObject);
            refineObject = {
              timestamp: data.timestamp,
              unitPeriodUsage: data.unitPeriodUsage,
              activeTime: ''
            };
            timeData = [0, 0, 0, 0];
          } else {
            refineObject.unitPeriodUsage += data.unitPeriodUsage;
            timeData[defineActiveTime(data.timestamp)] += data.unitPeriodUsage;
          }
          previousDate = new Date(data.timestamp);
        }
      });

      function defineActiveTime (timestamp) {
        var date = new Date(timestamp),
          hour = date.getHours(),
          index = 0;

        if (hour >= 0 && hour < 6) {
          index = 0;
          // night
        } else if (hour >= 6 && hour < 12) {
          index = 1;
          // morning
        } else if (hour >= 12 && hour < 18) {
          index = 2;
          // afternoon
        } else if (hour >= 18 && hour < 24) {
          index = 3;
          //evening
        }
        return index;
      }

      function getActiveTime (dataFromTime) {
        var max = 0,
          maxIndex = 0;
        angular.forEach(dataFromTime, function (data, index) {
          if (data > max) {
            max = data;
            maxIndex = index;
          }
        });

        if (maxIndex === 0) {
          return 'night';
        } else if (maxIndex === 1) {
          return 'morning';
        } else if (maxIndex === 2) {
          return 'afternoon';
        } else if (maxIndex === 3) {
          return 'evening';
        }
      }

      return refineData;
    };
    
    // this.checkOnline = function () {
    //   return $http.get(API.onlineUrl);
    // };

  });

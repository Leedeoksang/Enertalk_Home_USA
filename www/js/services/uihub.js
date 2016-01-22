angular.module('enertalkHomeUSA.services')

  .service('UIHub', function ($window, User) {

    if (!$window.Encored) {
      return;
    }
    
    this.init = function () {
      var _this = this;

      if (_this.UI) {
        return;
      }

      _this.UI = new $window.Encored.UI({
        env: 'production',
        category: 'home',
        iframe: true
      });
    };

    this.renderCard = function (cards, target, next) {
      this.UI.renderCard({
        cards: cards,
        target: target,
        accessToken: User.accesstoken
      }, function (error) {
        if (error) {
          next(error);
        } else {
          next('success');
        }
      });
    };

    
  });

angular.module('enertalkHomeUSA.controllers')

  .controller('MainCommunityCtrl', function ($scope,$state,$rootScope) {
      $scope.compete = function () {
          $state.go('main.compete');
      };

      $scope.compare = function () {
          if (typeof $rootScope.home == 'undefined') {
              $rootScope.home = {};
          }
          if (typeof $rootScope.home.done == 'undefined') { //if info hasn't been filled, send to comparison edit page
              $state.go('main.compare-edit-intro');
          }
          else {                        //otherwise, send the user to the comparison page
              $state.go('main.compare');
          }
      };

      //Stub for when the app has a built in forum feature instead of a Facebook link
      //$scope.forum = function () {
          //$state.go('main.forum');
      //};

      $scope.donate = function () {
          $state.go('main.donate');
      };

      $scope.homeDR = function () {
          $state.go('main.home-dr')
      };

  });
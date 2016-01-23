angular.module('enertalkHomeUSA.controllers')

.controller('CommCompeteCtrl', function ($scope, $state) {
    $scope.groups = function(){
        $state.go('main.compete-groups');
    }

    $scope.mygroup = function () {
        $state.go('main.compete-in-group');
    }

});
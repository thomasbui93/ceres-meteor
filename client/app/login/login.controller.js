/**
 * Created by Bui Dang Khoa on 7/28/2015.
 */
'use strict';
angular.module('ceres').controller('loginController', [
    '$scope','$meteor','$rootScope','MSG','LogService',
    function ($scope, $meteor, $rootScope, MSG, logService) {
        $scope.input = {
            userName: '',
            password: ''
        };
        $scope.logIn = function () {
           logService.logIn($scope.input.userName, $scope.input.password);
        };
    }
]);

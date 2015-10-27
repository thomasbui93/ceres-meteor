/**
 * Created by Bui Dang Khoa on 7/2/2015.
 */
'use strict';
angular.module('ceres').controller('dashboardController', [
    '$scope','LogService','$rootScope',
    function ($scope, LogService, $rootScope) {
        $scope.isProvider = LogService.isProvider();
        console.log($scope.isProvider);

        /*
         * visibility
         */
        $scope.visibility = {
            isProvider: LogService.isProvider()
        };
        $scope.currentUser = $rootScope.currentUser
    }
]);

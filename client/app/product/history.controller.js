/**
 * Created by Bui Dang Khoa on 7/26/2015.
 */
'use strict';
angular.module('ceres').controller('commentHistoryController', [
    '$scope','commentInformation','$modalInstance',
    function ($scope, commentInformation, $modalInstance) {
        $scope.commentInformation = commentInformation;
        $scope.close = function () {
            $modalInstance.close();
        };

    }
]);

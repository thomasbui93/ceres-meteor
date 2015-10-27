/**
 * Created by Bui Dang Khoa on 7/1/2015.
 */
'use strict';
angular.module('ceres').controller('bargainController', [
    '$scope','$meteor',
    function ($scope, $meteor) {
        $meteor.subscribe('allAuctions').then( function () {
            $scope.auctions = $meteor.collection(function () {
                return Products.find(
                    {
                        setAuction: true
                    }
                );
            }, false);
        });
    }
]);

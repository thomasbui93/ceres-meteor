/**
 * Created by Bui Dang Khoa on 7/27/2015.
 */
'use strict';
angular.module('ceres').controller('dashboardProductAuctionController', [
    '$scope','$meteor','$rootScope',
    function ($scope, $meteor, $rootScope) {
        $meteor.subscribe('individualAuctions').then(function () {
            $scope.auctions = $meteor.collection(function () {
                return Products.find(
                    {
                        owner: $rootScope.currentUser._id,
                        setAuction: true
                    }
                );
            }, true);
        });
        $scope.removeAuction = function (auction) {
            console.log(auction._id);
            $meteor.call('removeAuction',auction._id).then( function () {
                $rootScope.$emit('addToast', 'The product has been remove from auction');
            }, function (error) {
                $rootScope.$emit('addToast', 'Oops, something has gone wrong.')
            })
        }
    }
]);

/**
 * Created by Bui Dang Khoa on 7/2/2015.
 */
'use strict';
angular.module('ceres').controller('dashboardHomeController', [
    '$scope', '$rootScope',
    function ($scope, $rootScope) {

        Tracker.autorun(function () {
            var notifications = {
                payment: 0,
                bargain: 0
            };
            if($rootScope.currentUser.profile.status.client){
                notifications.payment = Payments.find({
                    archive: false,
                    'notification.buyerSeen': false
                }).count();
            }else{
                notifications.payment = Payments.find({
                    archive: false,
                    'notification.ownerSeen': false
                }).count();
            }

            $scope.notifications = notifications;
        })
    }
]);

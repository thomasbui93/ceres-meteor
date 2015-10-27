/**
 * Created by Bui Dang Khoa on 7/18/2015.
 */
'use strict';
angular.module('ceres').controller('dashboardBillController', [
    '$scope', '$rootScope',
    function ($scope, $rootScope) {
        $scope.bills = Payments.find({
            'notification.ownerSeen':false,
            'status.done': false
        }).fetch();

        Payments.find({
            'notification.ownerSeen':false,
            'status.done': false
        }).observeChanges({
            added: function () {
                $scope.bills = Payments.find({
                    'notification.ownerSeen':false,
                    'status.done': false
                }).fetch();
            },
            removed: function () {
                $scope.bills = Payments.find({
                    'notification.ownerSeen':false,
                    'status.done': false
                }).fetch();
            }
        });

        $scope.saveBill = function(payment){
            Payments.update(payment._id, {
                $set: {
                    status: payment.status
                }
            })
        };

        $scope.cancel = function (payment) {
            Meteor.call('removePayment', payment, function (error, data) {
                if(error){
                    console.log(error);
                    $rootScope.$emit('addToast', MSG.payment.removeFailed)
                }else{
                    $rootScope.$emit('addToast', MSG.payment.removeSuccess)
                }
            });
        }
    }
]);

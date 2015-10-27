/**
 * Created by Bui Dang Khoa on 7/8/2015.
 */
'use strict';
angular.module('ceres').controller('dashboardPaymentController', [
    '$scope','$rootScope', 'MSG',
    function ($scope, $rootScope, MSG) {
        $scope.payments = Payments.find({
            'notification.buyerSeen':false
        }).fetch();

        Payments.find({
            'notification.buyerSeen':false
        }).observeChanges({
            added: function () {
                $scope.payments = Payments.find({
                    'notification.buyerSeen':false
                }).fetch();
            },
            removed: function () {
                $scope.payments = Payments.find({
                    'notification.buyerSeen':false
                }).fetch();
            }
        });

        $scope.archive=function(payment){
            Payments.update(payment._id, {
                $set: {
                    'notification.buyerSeen': true
                }
            }, function (error, data) {
                console.log(data, error);
                if(error){

                }else{
                    console.log(Payments.findOne(payment._id));
                    $rootScope.$emit('addToast', MSG.payment.archive);
                    $rootScope.$apply();
                }
            });

        };
        $scope.unArchive=function(payment){
            Payments.update(payment._id, {
                $set: {
                    'notification.buyerSeen': false
                }
            }, function (error, data) {
                console.log(data);
            });
        };
        $scope.cancel = function (payment) {
            Meteor.call('removePayment', payment, function (error, data) {
                if(error){
                    console.log(error);
                    $rootScope.$emit('addToast', MSG.payment.removeFailed);
                    $rootScope.$apply();
                }else{
                    $scope.payments = Payments.find({
                        'notification.buyerSeen':false
                    }).fetch();
                    $rootScope.$emit('addToast', MSG.payment.removeSuccess);
                    $rootScope.$apply();
                }
            });
        };

        $scope.archivePayments = Payments.find({
            'notification.buyerSeen':true
        }).fetch();

        Payments.find({
            'notification.buyerSeen':true
        }).observeChanges({
            added: function () {
                $scope.archivePayments = Payments.find({
                    'notification.buyerSeen':true
                }).fetch();
            },
            removed: function () {
                $scope.archivePayments = Payments.find({
                    'notification.buyerSeen':true
                }).fetch();
            }
        });
    }
]);

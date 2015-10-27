/**
 * Created by Bui Dang Khoa on 6/27/2015.
 */
'use strict';
angular.module('ceres').controller('mainController', [
    '$scope','$rootScope','$state','STATE','$meteor','LogService','$timeout','$location',
    function ($scope, $rootScope, $state, STATE, $meteor, LogService, $timeout,$location) {
        /*
         * menu visibility
         */
         $scope.$state = $state;
         $scope.logout = LogService.logOut;
         $scope.alert= {
             msg: '',
             type: '',
             show: false
         };


        /*
         * watch
         */

        $scope.addAlert = function (textOb) {
            if(!$scope.alert.show){
                $scope.alert = {
                    msg: textOb.msg,
                    type: textOb.type,
                    show: true
                };
            }else{
                $scope.alert.show =false;
                $timeout(function () {
                    $scope.alert = {
                        msg: textOb.msg,
                        type: textOb.type,
                        show: true
                    };
                }, 500)
            }
            $timeout(function () {
                $scope.alert.show=false;
                $scope.alert= {
                    msg: '',
                    type: '',
                    show: false
                };
            }, 4000);
        };

        $rootScope.$on('logInSuccessfully', function(){
            if($rootScope.currentUser.profile.companyName){
                $scope.addAlert({
                    tye: 'success',
                    msg: 'Welcome back '+$rootScope.currentUser.profile.companyName
                });
            }else{
                $scope.addAlert({
                    tye: 'success',
                    msg: 'Welcome back '+$rootScope.currentUser.profile.firstName+' '+$rootScope.currentUser.profile.lastName
                });
            }
        });
        $rootScope.$on('logOutSuccessfully', function(){
            STATE.authenticated.forEach(function(state){
                if($state.includes(state)){
                    $state.transitionTo('home');
                }
            });

            $scope.addAlert({
                tye: 'success',
                msg: 'You have logged out successfully'
            });
        });
        $rootScope.$on('addToast', function (event, data) {
            $scope.addAlert({
                type: 'notification',
                msg: data
            })
        });

        /*
         * alert fadeOut
         */
        if($rootScope.currentUser ===undefined){
            $rootScope.currentUser = Session.get('currentUser');
        }

        $scope.notifications = Payments.find({
            'notification.buyerSeen': false
        }).count();


        Payments.find({
            'notification.buyerSeen': false,
            'status.done': false
        }).observeChanges({
            added: function () {
                $scope.notifications = Payments.find({
                    'notification.buyerSeen': false,
                    'status.done': false
                }).count();
            },
            removed: function () {
                $scope.notifications = Payments.find({
                    'notification.buyerSeen': false,
                    'status.done': false
                }).count();
            }
        });
        $scope.menu ={
           opened: false,
           toggleOpen : function () {
               $scope.menu.opened = !$scope.menu.opened;
           },
           dismiss: function ($event) {
               $scope.menu.opened = false;
           }
        };


    }
]);
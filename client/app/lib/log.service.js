/**
 * Created by Bui Dang Khoa on 7/5/2015.
 */
'use strict';
angular.module('ceres').factory('LogService', [
   '$meteor', '$rootScope', '$state',
    function($meteor, $rootScope, $state){

        var logService = {
            logIn: function(user, password){
                $meteor.loginWithPassword(user, password)
                    .then(function (data) {
                        Session.set('currentUser', Meteor.user());
                        $rootScope.$emit('logInSuccessfully');
                        $state.transitionTo('home');
                    }, function (error) {
                        $rootScope.$emit('logInFailed');
                    });
            },
            logOut: function(){
                $meteor.logout();
                Session.set('currentUser', undefined);
                $rootScope.$emit('logOutSuccessfully');
            },
            isProvider: function(){
                return !$rootScope.currentUser.profile.status.client;
            },
            logInAdmin: function (user, password) {
                Meteor.call('isAdmin', user, password, function (data) {
                    if(data === true){
                        $meteor.loginWithPassword(user, password)
                            .then(function (data) {
                                $rootScope.$emit('logInSuccessfully');
                                $state.transitionTo('admin.block');
                            }, function (error) {
                                $rootScope.$emit('logInFailed');
                            });
                    }else{
                        $rootScope.$emit('logInFailed');
                    }
                });
            }
        }
        return logService;
    }
]);
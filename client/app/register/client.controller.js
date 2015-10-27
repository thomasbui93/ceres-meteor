/**
 * Created by Bui Dang Khoa on 7/1/2015.
 */
'use strict';
angular.module('ceres').controller('registerClientController', [
    '$scope','$meteor','$rootScope','$state',
    function ($scope, $meteor, $rootScope, $state) {
        $scope.datepicker ={
            dateOptions: {
                class: 'datepicker'
            }
        };
        $scope.user = {
            firstName: '',
            lastName: '',
            email: '',
            company: '',
            password: '',
            repwd: '',
            address: {
                main: '',
                zip: '',
                country: ''
            },
            birthday: null,
            interests: '',
            status: {
                client: true,
                verify: false
            }
        }
        $scope.signUp = function(){
            if($scope.clientForm.$valid){
                $meteor.createUser({
                    user: $scope.user.email,
                    email: $scope.user.email,
                    password: $scope.user.password,
                    profile:{
                        firstName: $scope.user.firstName,
                        lastName: $scope.user.lastName,
                        address: $scope.user.address,
                        birthday: $scope.user.birthday,
                        interests: $scope.user.interests,
                        status: $scope.user.status
                    }
                }).then(function(){
                    $meteor.subscribe('currentUser').then(function () {
                        $rootScope.currentUser = Meteor.user();
                        $state.transitionTo('home');
                    });
                }, function(err){
                    console.log('Login error - ', err);
                });
            }
        };
    }
]);

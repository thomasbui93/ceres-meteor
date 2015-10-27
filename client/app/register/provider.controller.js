/**
 * Created by Bui Dang Khoa on 7/1/2015.
 */
'use strict';
angular.module('ceres').controller('registerProviderController', [
    '$scope', '$meteor',
    function ($scope, $meteor) {
        /*
         * data default
         */
        $scope.datepicker ={
            dateOptions: {
                class: 'datepicker'
            }
        };
        $scope.types = [
            {
                short: 'LBG',
                description: 'Private company limited by guarantee'
            },
            {
                short: 'LTD',
                description: 'Private company limited by shares'
            },
            {
                short: 'LTD with share capital',
                description: 'company limited by guarantee with a share capital'
            },
            {
                short: 'L.L.C',
                description:'Limited-liability company'
            },
            {
                short: 'Unlimited Company',
                description: 'Unlimited company with or without a share capital'
            }];
        $scope.user = {
            companyName: '',
            type: null,
            email: '',
            category: '',
            password: '',
            repwd: '',
            address: {
                main: '',
                zip: '',
                country: ''
            },
            birthday: null,
            status: {
                client: false,
                verify: false
            }
        };
        $scope.signUp = function () {
            console.log($scope.user);
            if($scope.providerForm.$valid){
                $meteor.createUser({
                    user: $scope.user.email,
                    email: $scope.user.email,
                    password: $scope.user.password,
                    profile:{
                        companyName: $scope.user.companyName,
                        type: angular.toJson($scope.user.type),
                        address: $scope.user.address,
                        birthday: $scope.user.birthday,
                        category: $scope.user.category,
                        status: $scope.user.status,
                        bioShort: '',
                        avatar: null,
                        cover: null
                    }
                }).then(function(){
                    console.log('Login success');
                }, function(err){
                    console.log('Login error - ', err);
                });
            }
        };
    }
]);

/**
 * Created by Bui Dang Khoa on 7/8/2015.
 */
'use strict';

angular.module('ceres').controller('dashboardAccountController', [
    '$scope','$rootScope','$meteor','MSG','$state',
    function ($scope, $rootScope, $meteor, MSG, $state) {
        $scope.currentUser = $rootScope.currentUser;

        /*
         * error
         */
        $scope.error={
            wrongPass: false
        }
        $scope.datepicker ={
            dateOptions: {
                class: 'datepicker'
            }
        };
        /*
         * account appearance setting
         */
        $scope.images = Avatar.find().fetch();
        $scope.uploadAvatar = function(event){
            console.log('call upload');
            var files = event.target.files;
            for (var i = 0, ln = files.length; i < ln; i++) {
                Avatar.insert(files[i], function (err, fileObj) {
                    // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP;
                    if(err){
                        console.log(err);
                    }else{
                        var baseUrl = '/cfs/files/avatar/'
                        var newImages = baseUrl+fileObj._id;
                        Tracker.autorun(function (computation) {
                            if (Avatar.findOne({_id: fileObj._id}).uploadProgress() === 100) {
                                Meteor.users.update($rootScope.currentUser._id,
                                    {$set: {'profile.avatar': newImages}}
                                , function (error, data) {
                                        $scope.currentUser = Meteor.user();
                                        $scope.$apply();
                                        $rootScope.$emit('addToast', MSG.dashboard.updateSuccess);
                                        $rootScope.$apply();
                                        computation.stop();
                                    });
                            }
                        })
                    }
                });
            }
        }
        $scope.changeName = function () {
            if($scope.nameForm.$valid){
                Meteor.users.update($rootScope.currentUser._id,
                    {$set:
                        {
                            'profile.firstName': $scope.currentUser.profile.firstName,
                            'profile.lastName': $scope.currentUser.profile.lastName
                        }
                    },
                    function () {
                        $rootScope.$emit('addToast', MSG.dashboard.updateSuccess);
                        $state.transitionTo('dashboard.account.home');
                    });

            }

        };
        /*
         * change password
         */
        $scope.changePassword = function(){
            $meteor.changePassword($scope.input.oldPassword, $scope.input.newPassword)
                .then(function () {
                    $scope.error.wrongPass = false;
                    $rootScope.$emit('addToast', MSG.dashboard.updateSuccess);
                    $state.transitionTo('dashboard.account.home');
                }, function (error) {
                    $scope.error.wrongPass=true;
                })
        }
        /*
         * change contact
         */
        $scope.changeContact = function () {
            if($scope.contactForm.$valid){
                Meteor.users.update($rootScope.currentUser._id,
                    {$set:
                    {
                        'profile.address.main': $scope.currentUser.profile.address.main,
                        'profile.address.zip': $scope.currentUser.profile.address.zip,
                        'profile.address.country': $scope.currentUser.profile.address.country
                    }
                    },
                    function () {
                        $rootScope.$emit('addToast', MSG.dashboard.updateSuccess);
                        $state.transitionTo('dashboard.account.home');
                    });

            }
        }

    }
]);

/**
 * Created by Bui Dang Khoa on 7/19/2015.
 */
'use strict';
angular.module('ceres').controller('dashboardProfileController', [
    '$scope', '$rootScope','MSG',
    function ($scope, $rootScope,MSG) {
        $scope.currentUser = $rootScope.currentUser;
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
        $scope.changeAppearance = function () {
            Meteor.users.update($rootScope.currentUser._id, {
                $set: {
                    'profile.companyName': $scope.currentUser.profile.companyName,
                    'profile.bioShort': $scope.currentUser.profile.bioShort,
                    'profile.type': angular.toJson($scope.currentUser.profile.type),
                    'profile.birthday': $scope.currentUser.profile.birthday,
                    'profile.category': $scope.currentUser.profile.category
                }
            }, function (error, data) {
                console.log(error);
                if(error){
                    $rootScope.$emit('addToast', MSG.dashboard.updateFailed);
                }else{
                    $rootScope.$emit('addToast', MSG.dashboard.updateSuccess);
                }
            });
        };
        $scope.uploadAvatar = function(event){
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
    }
]);

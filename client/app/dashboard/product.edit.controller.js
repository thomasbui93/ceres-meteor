/**
 * Created by Bui Dang Khoa on 7/16/2015.
 */
'use strict';
angular.module('ceres').controller('dashboardProductEditController', [
    '$scope','$state','$stateParams','PRODUCT','$rootScope','MSG','$timeout',
    function ($scope, $state, $stateParams, PRODUCT, $rootScope, MSG, $timeout) {
        /*
         * initial variables
         */
        $scope.product = Products.findOne({_id: $stateParams.id});
        $scope.categories = PRODUCT.categories;
        $scope.upload = {
            show: false
        }

        /*
         * watch change
         */

        $scope.rollback = function(){
            $scope.product = Products.findOne({_id: $stateParams.id});
        };


        $scope.saveProduct = function () {
            if($scope.productForm.$valid){
                $scope.product.detail.category = angular.toJson($scope.product.detail.category);
                Meteor.call('updateProduct', $stateParams.id, $scope.product, function (error, data) {
                    $scope.upload.show = true;
                    $rootScope.$emit('addToast', MSG.dashboard.updateSuccess);
                    $scope.$apply();
                });
            }
        }

        $scope.uploadImage = function (event) {
            var files = event.target.files;
            for (var i = 0, ln = files.length; i < ln; i++) {
                ProductImages.insert(files[i], function (err, fileObj) {
                    // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP;
                    if(err){
                        console.log(err);
                    }else{
                        var img = ProductImages.findOne({_id: fileObj._id});
                        var link = '/cfs/files/productImages/'+fileObj._id;
                        var replaceIndex = null;
                        if($scope.imgs.selectedIndexes.length ===1){
                            replaceIndex = $scope.imgs.selectedIndexes[0]
                        }else{
                            replaceIndex = null;
                        }

                        Meteor.call('updateProductImage', $stateParams.id, link,replaceIndex,
                            function (error,data) {
                                Tracker.autorun(function (computation) {
                                    if (ProductImages.findOne(
                                            {_id: fileObj._id}).uploadProgress() === 100 && ProductImages.findOne(
                                            {_id: fileObj._id}).isUploaded()) {
                                        $rootScope.$emit('addToast', MSG.dashboard.productSuccess);
                                        $rootScope.$apply();
                                        $timeout(function () {
                                            $scope.product = Products.findOne({_id: $stateParams.id});
                                            $scope.$apply();
                                            computation.stop();
                                        }, 5000)

                                    }
                                });
                            });

                    }
                });
            }
        };
        $scope.removeImages = function () {
            if($scope.imgs.selectedIndexes.length >0){
                var linkArray = []
                $scope.imgs.selectedIndexes.forEach(function (index) {
                    linkArray.push($scope.product.image[index]);
                });
                Meteor.call('removeProductImages', linkArray, $scope.product, function (error, data) {
                    if(!error){
                        $scope.deletedImages = [];
                        $scope.$apply();
                        $rootScope.$emit('addToast', MSG.dashboard.imageSuccess);
                        $rootScope.$apply();
                    }else{
                        $rootScope.$emit('addToast', MSG.dashboard.imageFailed);
                        $rootScope.$apply();
                    }
                });
            }
        };

        $scope.imgs ={
            selectedIndexes: [],
            clickImage: function (img) {
                var index = $scope.product.image.indexOf(img);
                if($scope.imgs.selectedIndexes.indexOf(index)===-1){
                    $scope.imgs.selectedIndexes.push(index);
                }else{
                    $scope.imgs.selectedIndexes.splice($scope.imgs.selectedIndexes.indexOf(index),1);
                }
                $scope.imgs.changeView(index);
            },
            view: 0,
            changeView: function (index) {
                $scope.imgs.view = index;
            }
        };
        $scope.swapImages = function () {
            if($scope.imgs.selectedIndexes.length === 2){
                $scope.product.image.swapArray($scope.imgs.selectedIndexes[0], $scope.imgs.selectedIndexes[1]);
                $scope.saveProduct();
            }
        };

        Tracker.autorun(function () {
            $scope.product = Products.findOne({_id: $stateParams.id});
        })
    }
]);

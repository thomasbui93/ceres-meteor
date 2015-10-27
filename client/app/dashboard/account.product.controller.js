/**
 * Created by Bui Dang Khoa on 7/13/2015.
 */
'use strict';
angular.module('ceres').controller('dashboardProductController', [
    '$scope','$meteor','$rootScope','MSG','PRODUCT',
    function ($scope, $meteor, $rootScope,MSG, PRODUCT) {
        /*
         * create new products
         */
        $scope.upload={
            show : false,
            done: false
        };
        $scope.disableSubmit = false;

        $scope.categories = PRODUCT.categories;
        $scope.product = {
            name: '',
            detail: {
                description:'',
                origin: '',
                category: null
            },
            price: {
                main: 0,
                currency:'$',
                unit: ''
            },
            shipping: {
                free: false,
                available: ''
            },
            stock:{
                available: 0,
                sold: 0,
                infinite: false
            },
            image: [],
            owner: $rootScope.currentUser._id,
            createdTime: new Date(),
            setAuction: false
        };
        var nextWeek = new Date();
        $scope.auctionOption= {
            startDate: null,
            endDate: nextWeek.setDate(nextWeek.getDate()+7),
            initialPrice: 0,
            leading: null
        }
        $scope.datepicker = {
            maxDate: nextWeek.setDate(nextWeek.getDate()+7),
            minDate: new Date()
        };
        /*
         * product creating method
         */
        $scope.uploadImage = function (event) {
            var files = event.target.files;
            for (var i = 0, ln = files.length; i < ln; i++) {
                ProductImages.insert(files[i], function (err, fileObj) {
                    // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP;
                    if(err){
                        console.log(err);
                    }else{
                        var img = ProductImages.find({_id: fileObj._id}).fetch();
                        var link = '/cfs/files/productImages/'+fileObj._id;
                        Meteor.call('updateProductImage', $scope._id, link,
                            function (error,data) {
                                Tracker.autorun(function (computation) {
                                    console.log(ProductImages.findOne(
                                        {_id: fileObj._id}).isUploaded());
                                    if (ProductImages.findOne(
                                            {_id: fileObj._id}).uploadProgress() === 100 && ProductImages.findOne(
                                            {_id: fileObj._id}).isUploaded()) {
                                        $scope.product.image.push(link);
                                        $scope.$apply();
                                        $rootScope.$emit('addToast', MSG.dashboard.productSuccess);
                                        $rootScope.$apply();
                                        computation.stop();
                                    }
                                });
                            });
                    }
                });
            }
        };

        $scope.createProduct = function () {
            if($scope.productForm.$valid){
                $scope.disableSubmit = true;
                $scope.product.detail.category = angular.toJson($scope.product.detail.category);
                if($scope.product.setAuction){
                    $scope.product.auctionConfig= $scope.auctionOption;
                    $scope.product.auctionConfig.startDate = new Date();
                }
                Meteor.call('createProduct', $scope.product, function (error,data) {
                    if(error){
                        $rootScope.$emit('addToast', MSG.dashboard.createProductFail);
                        $rootScope.$apply();
                    }else{
                        $rootScope.$emit('addToast', MSG.dashboard.createProductSuccess);
                        $rootScope.$apply();
                        $scope.upload.show = true;
                        $scope._id = data;
                        $scope.disableSubmit = true;
                        $scope.$apply();
                    }
                });
            }
        };


    }
]);

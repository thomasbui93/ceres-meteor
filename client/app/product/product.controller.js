/**
 * Created by Bui Dang Khoa on 6/30/2015.
 */
'use strict';
angular.module('ceres').controller('productController', [
    '$scope','$stateParams','$rootScope','MSG','voteService','$meteor','$modal','KEYBOARD',
    function($scope, $stateParams, $rootScope, MSG, voteService, $meteor, $modal, KEYBOARD){
        $scope.input ={
            purchase: 1
        };
        $meteor.subscribe('productVote', $stateParams.id).then(function () {

            $scope.product = $meteor.object(Products, {_id: $stateParams.id});
            $scope.category = angular.fromJson($scope.product.detail.category).name;

            $scope.img={
                view: 0,
                changeView: function (index) {
                    $scope.img.view = index;
                },
                swipeLeft: function () {
                    if($scope.img.view < $scope.product.image.length-1){
                        $scope.img.view++;
                    }
                },
                swipeRight: function () {
                    if($scope.img.view > 0){
                        $scope.img.view--;
                    }
                }

            };
            // $scope.companyType = angular.fromJson($scope.product.producer.profile.type);
            if($rootScope.currentUser === null || $rootScope.currentUser === undefined){
                $scope.disablePurchase = true;
            }else{
                $scope.disablePurchase = ($scope.product.owner=== $rootScope.currentUser._id);
            }
            Tracker.autorun(function () {
                if($rootScope.currentUser !== null){
                    if(Votes.findOne({
                            productId: $scope.product._id,
                            owner: $rootScope.currentUser._id
                        })){
                        $scope.product.vote = Votes.findOne({
                            productId: $scope.product._id,
                            owner: $rootScope.currentUser._id
                        }).vote;
                    }else{
                        $scope.product.vote=0;
                    }
                }else{
                    $scope.product.vote=0;
                }



                $scope.product.votes.up =  Votes.find({
                    productId: $scope.product._id,
                    vote: 1
                }).count();
                $scope.product.votes.down = Votes.find({
                    productId: $scope.product._id,
                    vote: -1
                }).count();
            });
        });



        $scope.purchaseProduct = function () {
            console.log(MSG.payment.init);
            $rootScope.$emit('addToast', MSG.payment.init);
            var payment = {
                buyerId: $rootScope.currentUser._id,
                ownerId: $scope.product.owner,
                unit: $scope.input.purchase,
                productId: $scope.product._id
            };
            Meteor.call('createPayment', payment, function (error, data) {
                if(!error){
                    $rootScope.$emit('addToast', MSG.payment.created);
                    $rootScope.$apply();
                }else{
                    $rootScope.$emit('addToast', MSG.payment.createdFail);
                    $rootScope.$apply();
                }

            });
        };
        $scope.toggleUpVote = function () {
            if($scope.product.vote === 1){
                voteService.vote($scope.product._id, 0);
            }else{
                voteService.vote($scope.product._id, 1);
            }

        }
        $scope.toggleDownVote = function () {
            if($scope.product.vote === -11){
                voteService.vote($scope.product._id, 0);
            }else{
                voteService.vote($scope.product._id, -1);
            }
        };

        /*
         * comments
         */
        $scope.currentUser = $rootScope.currentUser;
        $scope.input= {
            msg: ''
        };
        $scope.createComment = function () {
            if($scope.input.msg.length !==0){
                Comments.insert({
                    userId: $rootScope.currentUser._id,
                    productId: $scope.product._id,
                    history: [{
                        msg: $scope.input.msg,
                        createdTime: new Date()
                    }]
                }, function (error, data) {
                    if(error){
                        $rootScope.$emit('addToast', MSG.comment.failed);
                        console.log(error);
                    }else{
                        $rootScope.$emit('addToast', MSG.comment.success);
                        $scope.input.msg='';
                    }
                });
            }
        };
        $meteor.subscribe('productComments', $stateParams.id).then(function () {
           $scope.comments = $meteor.collection(function(){
               return Comments.find({productId: $stateParams.id});
           }, false);
        });
        $scope.removeComment = function (comment) {
           $scope.comments.remove(comment._id).then(function () {
               $rootScope.$emit('addToast', MSG.comment.deleteSuccess);
           }, function (error) {
               console.log(error);
               $rootScope.$emit('addToast', MSG.comment.failed);
           })
        };
        $scope.edit = function (comment) {
            comment.editable = true;
            console.log(comment.editable);
        };
        $scope.cancel = function (comment) {
            comment.history.msg = Comments.findOne({_id: comment._id}).history;
            comment.editable = false;
        };
        $scope.update = function (comment) {
            var oldCmts = Comments.findOne({_id: comment._id}).history;
            if(oldCmts[oldCmts.length-1] !== comment.history[comment.history.length-1].msg){
                Comments.update({_id: comment._id},{
                    $push: {
                        history: {
                            msg: comment.history[comment.history.length-1].msg,
                            createdTime: new Date()
                        }
                    }
                });
            }
            comment.editable = false;
        }
        $scope.showHistory = function (comment) {
            var modalInstance = $modal.open({
                animation: false,
                templateUrl: 'client/app/product/history.ng.html',
                controller: 'commentHistoryController',
                size: 'small',
                resolve: {
                    commentInformation: function () {
                        return comment;
                    }
                }
            });
        };
        $scope.captureKey = function ($event) {
            if($event.keyCode === KEYBOARD.ENTER){
                $scope.createComment();
            }
        }
        
    }
]);
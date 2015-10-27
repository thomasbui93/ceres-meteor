/**
 * Created by Bui Dang Khoa on 7/28/2015.
 */
'use strict';
angular.module('ceres').controller('auctionController', [
    '$scope','$meteor','$stateParams','$rootScope','BID','$interval',
    function ($scope, $meteor, $stateParams, $rootScope, BID, $interval) {
        $scope.currentUser = $rootScope.currentUser;
        $scope.input= {
            bid: ''
        };
        $scope.highestBid = null;
        Session.set($stateParams.id, {
            userLeading: false
        })
        $meteor.subscribe('singleAuction', $stateParams.id).then(function () {
           $scope.product = $meteor.object(Products ,$stateParams.id, true);
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
            $scope.enableBidding = ($scope.product.auctionConfig.endDate > new Date()) && ($rootScope.currentUser !== null && $rootScope.currentUser !==undefined) ;

        });
        $meteor.subscribe('productBids', $stateParams.id).then(function () {
            $scope.bids = $meteor.collection(function () {
                return Bids.find({
                    productId: $stateParams.id
                });
            }, true);
        });
        $scope.createBid = function () {
            var price = parseFloat($scope.input.bid);
            if(price > 0 && !isNaN(price)){
                Bids.insert({
                    productId: $stateParams.id,
                    ownerId: $scope.currentUser._id,
                    price: parseFloat($scope.input.bid),
                    createdTime: new Date()
                }, function (error, data) {
                    if(error){
                        console.log(error);
                        $rootScope.$emit('addToast', BID.fail);
                        $rootScope.$apply();
                    }else{
                        if($scope.checkHighest()){
                            $rootScope.$emit('addToast', BID.first);
                            $rootScope.$apply();
                        }else{
                            $rootScope.$emit('addToast', BID.success);
                            $rootScope.$apply();
                        }

                        $scope.input.bid='';
                    }
                });
            }else{
                $rootScope.$emit('addToast', 'Invalid bid. Your bid should only a number');
            }
        };
        $scope.checkHighest = function(){
            var highestBid = Bids.find({productId: $stateParams.id},{
                limit: 1,
                sort: {
                    price: -1
                }
            }).fetch();
            $scope.highestBid = highestBid[0];
            if($rootScope.currentUser === null || $rootScope.currentUser === undefined){
                return true;
            }else{
                return $scope.highestBid.ownerId === $rootScope.currentUser._id;
            }
        };
        Bids.find({
            productId: $stateParams.id
        }).observeChanges({
            added: function () {
                $scope.checkHighest();
                if($rootScope.currentUser !== null && $rootScope.currentUser !== undefined){
                    if($scope.highestBid.ownerId === $rootScope.currentUser._id && !Session.get($stateParams.id).userLeading){
                        $rootScope.$emit('addToast', BID.first);
                        Session.set($stateParams.id, {
                            userLeading: true
                        });
                    }
                    if($scope.highestBid.ownerId !== $rootScope.currentUser._id && Session.get($stateParams.id).userLeading)
                    {
                        Session.set($stateParams.id, {
                            userLeading: false
                        });
                        $rootScope.$emit('addToast', BID.drop);
                    }
                }
            },
            remove: function () {
                Meteor.call('setHighestBid', $stateParams.id);
            }
        });
        Bids.find({productId: $stateParams.id}, {sort: {
            price: -1,
            createdTime: 1
        }},{
            limit: 1
        }).observeChanges({
            addedBefore: function () {
                Meteor.call('setHighestBid', $stateParams.id);
            }
        })
    }
]);

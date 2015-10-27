/**
 * Created by Bui Dang Khoa on 7/14/2015.
 */
'use strict';
angular.module('ceres').controller('dashboardProductManageController', [
    '$scope','$meteor','$rootScope','$modal','$state','MSG',
    function ($scope, $meteor, $rootScope, $modal, $state, MSG) {

            $meteor.subscribe('individualProducts').then(function () {
                $scope.products = $scope.$meteorCollection(function () {
                    return Products.find(
                        {
                            owner: $rootScope.currentUser._id,
                            setAuction: false
                        }, {
                            limit: 10,
                            sort: {date: -1},
                            skip: 0
                        });
                }, true);

                $scope.nav = {
                    page: 1,
                    total: Number.parseInt($scope.products.length / Products.find().count()),
                    next: function () {
                        if($scope.nav.total > $scope.nav.page){
                            $scope.nav.page++;
                        }
                    },
                    back: function () {
                        if(1 < $scope.nav.page){
                            $scope.nav.page--;
                        }
                    }
                };
                if($scope.products.length ===0){
                    $scope.nav.total =0;
                }
                $scope.$watch(function () {
                    return $scope.nav.page;
                }, function (newVal, oldVal) {
                    $scope.products = Products.find(
                        {
                            owner: $rootScope.currentUser._id,
                            setAuction: false
                        },
                        {
                            limit: 10,
                            sort: {date: -1},
                            skip: 10*(newVal-1)
                        }).fetch();
                });
            });


        $scope.invokeDelete = function (productId) {
            var modalInstance = $modal.open({
                animation: false,
                templateUrl: 'client/app/dashboard/delete.modal.ng.html',
                controller: 'deleteModalController',
                size: 'small',
                resolve: {
                    item: function(){
                        return productId;
                    }
                }
            });

            modalInstance.result.then(function (data) {
                if(data.success){
                    $scope.product = Products.find({owner: $rootScope.currentUser._id}).fetch();
                    $rootScope.$emit('addToast', MSG.dashboard.deleteProductSuccess)
                }else{
                    $rootScope.$emit('addToast', MSG.dashboard.deleteProductFail)
                }
            }, function (error) {

            });
        };
        $scope.toEdit = function (productId) {
            $state.transitionTo('dashboard.product.edit', {id: productId});
        }


        Products.find(
            {
                owner: $rootScope.currentUser._id,
                setAuction: false
            }).observeChanges({
                added: function () {
                    $scope.products = $scope.$meteorCollection(function () {
                        return Products.find(
                            {
                                owner: $rootScope.currentUser._id,
                                setAuction: false
                            }, {
                                limit: 10,
                                sort: {date: -1},
                                skip: 0
                            });
                    }, true);
                },
                removed: function () {
                    $scope.products = $scope.$meteorCollection(function () {
                        return Products.find(
                            {
                                owner: $rootScope.currentUser._id,
                                setAuction: false
                            }, {
                                limit: 10,
                                sort: {date: -1},
                                skip: 0
                            });
                    }, true);
                }
        });

        $scope.toggleAuction = function (product) {
            var nextWeek = new Date();

            product.auctionConfig = {
                startDate: new Date(),
                endDate: nextWeek.setDate(nextWeek.getDate()+7),
                initialPrice: 0,
                leading: null
            };
            Products.update(product._id, {
                $set: {
                    setAuction: true,
                    auctionConfig:{
                        startDate: new Date(),
                        endDate: nextWeek.setDate(nextWeek.getDate()+7),
                        initialPrice: 0,
                        leading: null
                    },
                    updatedTime: new Date()
                }
            }, function (error, data) {
                if(error){
                    console.log(error);
                    $scope.$emit('addToast', 'Oops, something has gone wrong.')
                    $rootScope.$apply();
                }else{
                    $rootScope.$emit('addToast', 'The product has been moved to auctions.');
                    $rootScope.$apply();
                }
            });
        }
    }
]).controller('deleteModalController', [
    '$scope', '$modalInstance','item',
    function ($scope, $modalInstance, item) {
        $scope.ok = function () {
            Meteor.call('removeProduct', item, function (error, data) {
                if(!error){
                    $modalInstance.close(data);
                }else{
                    $modalInstance.close(error);
                }
            });
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
}]);

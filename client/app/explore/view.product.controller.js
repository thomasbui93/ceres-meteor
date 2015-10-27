/**
 * Created by Bui Dang Khoa on 7/18/2015.
 */
'use strict';
angular.module('ceres').controller('viewProductController', [
    '$scope','product','$rootScope','MSG','$modalInstance',
    function ($scope, product, $rootScope, MSG, $modalInstance) {
        $scope.product = product;
        $scope.category = angular.fromJson(product.detail.category).name;
        $scope.input={
            purchase: 1
        }
        if($rootScope.currentUser === null || $rootScope.currentUser === undefined){
            $scope.disablePurchase = true;
        }else{
            $scope.disablePurchase = (product.owner=== $rootScope.currentUser._id);
        }

        
        $scope.purchaseProduct = function () {
            var payment = {
                    buyerId: $rootScope.currentUser._id,
                    ownerId: product.owner,
                    unit: $scope.input.purchase,
                    productId: product._id
                };
            Meteor.call('createPayment', payment, function (error, data) {
                $modalInstance.close();
            });
        }
    }
]);

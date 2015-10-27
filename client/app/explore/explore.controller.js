/**
 * Created by Bui Dang Khoa on 6/29/2015.
 */
'use strict';
angular.module('ceres').controller('exploreController', [
    '$scope','$meteor','products','$modal','MSG','$rootScope','$state','voteService',
    function($scope, $meteor, products, $modal, MSG, $rootScope, $state, voteService){
        $scope.input = {
            search: '',
            options: {
                product: true,
                provider: false,
                categories: false,
                price: false,
                newest: true,
                popular: true
            }
        }
        $meteor.subscribe('allProduct').then(function(){
            $scope.products = $meteor.collection(function () {
                return Products.find();
            }, true);
        });

        $scope.searchProducts= function(){
            $scope.products = Products.search($scope.input.search, $scope.input.options);
        };

        $scope.viewProduct = function (product) {
            $state.transitionTo('product', {
                id: product._id
            });
        };
        $scope.toggleUp = function (product) {
            if(product.vote!==1){
                voteService.vote(product._id, 1);
                product.vote=1;
                product.votes.up++;
            }else{
                voteService.vote(product._id, 0);
                product.vote=0;
                product.votes.up --;
            }
        }
    }
]);
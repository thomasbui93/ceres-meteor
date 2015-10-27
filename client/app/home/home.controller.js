/**
 * Created by Bui Dang Khoa on 6/27/2015.
 */
'use strict';
angular.module('ceres').controller('homeController', [
    '$scope','anchorSmoothScroll',
    function ($scope, anchorSmoothScroll) {
        $scope.navigation= {
            toAbout: function () {
                anchorSmoothScroll.scrollTo('about');
            }
        }
        /*
         * slider controller
         */
        $scope.carousel = {
            slider: 0,
            moveRight: function(){
                $scope.carousel.slider++;
                if($scope.carousel.slider ==4){
                    $scope.carousel.slider = 0;
                }
            },
            moveLeft: function(){
                $scope.carousel.slider--;
                if($scope.carousel.slider ==-1){
                    $scope.carousel.slider = 3;
                }
            }
        }
    }
]);
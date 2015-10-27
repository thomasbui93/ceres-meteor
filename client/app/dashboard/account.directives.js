/**
 * Created by Bui Dang Khoa on 7/15/2015.
 */
'use strict';
angular.module('ceres').directive('reloadImage', [
    '$interval', function ($interval) {
        return {
            link: function(scope, iElement, iAttrs){
                var interval ;
                iElement.bind('error', function() {
                    interval = $interval(function () {
                        console.log('ticking interval');
                        angular.element(this).attr("src", iAttrs.reloadImage);
                    }, 1000);
                });
                iElement.bind('onload', function() {
                    $interval.cancel(interval);
                });
            }
        }
    }
]);

/**
 * Created by Bui Dang Khoa on 7/5/2015.
 */
'use strict';
angular.module('ceres').directive('brokenReload', [
    '$timeout',
    function ($timeout) {
        return {
            restrict: 'EA',
            link: function (scope, iElement, iAttrs) {
                    iElement.bind('error', function (event) {
                        angular.element(this).attr("src", iAttrs.ngSrc);
                    });
            }
        }
    }
]);
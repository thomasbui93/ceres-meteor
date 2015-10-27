/**
 * Created by Bui Dang Khoa on 7/28/2015.
 */
'use strict';
angular.module('ceres').directive('countdownUi', [
    '$parse','$interval',
    function ($parse, $interval) {
        return{
            restrict: 'EA',
            replace: true,
            templateUrl: 'client/app/auction/countdown.tpl.ng.html',
            scope: '=countdown',
            link : function (scope, element, attrs, controler) {
                 scope.countdown= {};
                 var rawDate = new Date($parse(attrs.countdownUi)(scope));

                $interval(function () {
                    var lapse = rawDate.getTime() - new Date().getTime();

                    var ONE_SECOND = 1000;
                    var ONE_MINUTE = 60* ONE_SECOND;
                    var ONE_HOUR = 60*ONE_MINUTE;
                    var ONE_DATE = 24*ONE_HOUR;

                    var days = Math.floor(lapse/ONE_DATE);
                    var hours = Math.floor(lapse/ONE_HOUR);
                    var minutes = Math.floor(lapse/ONE_MINUTE);
                    var seconds = Math.floor(lapse/ONE_SECOND);

                    scope.countdown = {
                        days : days,
                        hours: hours - days*24,
                        minutes: minutes-hours*60,
                        seconds: seconds- minutes*60
                    };

                }, 1000);
            }
        }
    }
]);

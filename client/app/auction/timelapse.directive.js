/**
 * Created by Bui Dang Khoa on 7/28/2015.
 */
'use strict';
angular.module('ceres').directive('timeLapse', [
    '$parse','$interval','$filter',
    function ($parse, $interval, $filter) {
        return {
            restrict: 'AE',
            require: '^ngModel',
            link: function (scope, element, attrs, controler) {
                var updatedTime = function () {
                    var ONE_SECOND = 1000;
                    var ONE_MINUTE = 60* ONE_SECOND;
                    var ONE_HOUR = 60*ONE_MINUTE;
                    var ONE_DATE = 24*ONE_HOUR;

                    var now = new Date();
                    var time = $parse(attrs.ngModel)(scope);
                    var lapse = now.getTime()-time.getTime();

                    var dateLapse = Math.round(lapse/ONE_DATE);
                    var hourLapse = Math.round(lapse/ONE_HOUR);
                    var minuteLapse = Math.round(lapse/ONE_MINUTE);
                    var secondLapse = Math.round(lapse/ONE_SECOND);
                    var presentLapse = '';
                    if(dateLapse > 2){
                        presentLapse = $filter('date')(time, 'MMM dd, yyyy')+' at '+$filter('date')(time, 'hh: mm');
                    }else if(dateLapse ===2){
                        presentLapse = 'Yesterday, '+ $filter('date')(time, 'hh: mm');
                    }else if(hourLapse >= 2){
                        presentLapse = hourLapse + ' hrs ago'
                    }else if(hourLapse>= 1){
                        if(minuteLapse-hourLapse*60 <= 1){
                            presentLapse = hourLapse +'h ' + (minuteLapse-hourLapse*60)+ 'mins ago';
                        }else{
                            presentLapse = hourLapse +'h ' + (minuteLapse-hourLapse*60)+ 'mins ago';
                        }
                    }else if(minuteLapse >= 1){
                        presentLapse = minuteLapse + ' mins ago';
                    }else if(secondLapse > 1 ){
                        presentLapse = secondLapse +' second agos'
                    }else if(secondLapse>=0){
                        presentLapse = 'Just now'
                    }else{
                        presentLapse = 'invalid lapse';
                    }
                    return {
                        presentLapse: presentLapse,
                        date: dateLapse,
                        hour: hourLapse,
                        minute: minuteLapse,
                        second: secondLapse
                    };
                };

                element.html(updatedTime().presentLapse);

                if(updatedTime().date > 1){// update is not necessary in this case

                    element.html(updatedTime().presentLapse);
                }else if(updatedTime().hour > 1){//once an hour
                    $interval(function () {
                        element.html(updatedTime().presentLapse);
                    }, 60*60*1000);

                }else if(updatedTime().minute >1){
                    $interval(function () {
                        element.html(updatedTime().presentLapse);
                    }, 60*1000);
                }else{
                    $interval(function () {
                        element.html(updatedTime().presentLapse);
                    }, 1000);
                }
            }
        }
    }
]);

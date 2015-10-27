/**
 * Created by Bui Dang Khoa on 6/28/2015.
 */
'use strict';
angular.module('ceres').directive('scrollFix', [
    '$window','$state','STATE','$location',
    function ($window, $state, STATE, $location) {
        var $win = angular.element($window);
        return{
            restrict: 'A',
            link: function (scope, element, attrs) {
                var topClass = attrs.scrollFix, // get CSS class from directive's attribute value
                    offsetTop = element.offset().top; // get element's offset top relative to document
                var checkTheme = function () {
                    var theme = false;
                    STATE.theme.forEach(function (element) {
                        if($state.includes(element) || $location.path().split('/')[1]===element){
                            theme = true;
                        }
                    });
                    return theme;
                };
                $win.on('scroll', function (e) {
                    if ($win.scrollTop() <= 100) {
                        if(!checkTheme()){
                            element.addClass(topClass);
                        }
                    } else {
                        element.removeClass(topClass);
                    }
                });
                scope.$watch(function(){
                    return $location.path();
                }, function(newVal, oldVal) {
                    if(!checkTheme()){
                        element.addClass(topClass);
                    }else{
                        element.removeClass(topClass);
                    }
                });
            }
        }
    }
]).directive('scrollSpy', [
    '$window','$rootScope',
    function($window, $rootScope){
        var $win = angular.element($window);
        return{
            restrict: 'A',
            link: function (scope, element, attrs) {
                var el = angular.element(element);
                var top = element[0].offsetTop;
                var limit = top + element[0].offsetHeight;
                $win.on('scroll', function (e) {
                    if ($win.scrollTop() <= limit && $win.scrollTop() >= top) {
                        $rootScope.$emit('enterHash', attrs.id);
                    } else {
                        $rootScope.$emit('quitHash', attrs.id);
                    }
                });
            }
        }
    }
]);
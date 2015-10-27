/**
 * Created by Bui Dang Khoa on 7/25/2015.
 */
'use strict';
angular.module('ceres').directive('contenteditable', [
    '$sce','KEYBOARD','$parse', function ($sce, KEYBOARD, $parse) {

        return {
            restrict: 'A', // only activate on element attribute
            // get a hold of NgModelController
            require: '?ngModel',
            link: function(scope, element, attrs, ngModel) {
                if (!ngModel) return; // do nothing if no ng-model
                // Specify how UI should be updated
                ngModel.$render = function() {
                    element.html(ngModel.$modelValue);
                };

                // Listen for change events to enable binding
                element.on('blur keyup change', function(event) {
                    scope.$evalAsync(read);
                });
                // initialize
                // Write data to the model
                function read() {
                    var html = element.html();
                    // When we clear the content editable the browser leaves a <br> behind
                    // If strip-br attribute is provided then we strip this out
                    ngModel.$setViewValue(html);
                }

                }
            }
        }
]);

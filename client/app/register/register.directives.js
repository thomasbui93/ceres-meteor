/**
 * Created by Bui Dang Khoa on 7/3/2015.
 */
'use strict';
angular.module('ceres').directive("compareTo", function(){
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
}).directive('emailExist', [
    '$meteor','$q',
    function($meteor, $q){
        return {
            require: 'ngModel',
            link: function(scope, element, attributes, ngModel){
                ngModel.$asyncValidators.emailExist = function(modelValue, viewValue) {
                    var value = modelValue || viewValue;
                    var exist = $meteor.call('emailExist', value);
                    return $meteor.call('emailExist', value).then(function(response) {
                        console.log(response);
                        if (!response) {
                            return $q.reject('Your email is exist');
                        }
                        return true;
                    });
                }
            }

        }
}]);
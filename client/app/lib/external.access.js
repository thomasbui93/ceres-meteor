/**
 * Created by Bui Dang Khoa on 7/11/2015.
 */
function getScope(ctrlName) {
    var sel = 'div[ng-controller="' + ctrlName + '"]';
    return angular.element(sel).scope();
}

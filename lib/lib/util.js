/**
 * Created by Bui Dang Khoa on 7/16/2015.
 */
RegExp.escape = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
Array.prototype.swapArray = function(index_a, index_b) {
    var temp = this[index_a];
    this[index_a] = this[index_b];
    this[index_b] = temp;
}
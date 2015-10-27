/**
 * Created by Bui Dang Khoa on 7/26/2015.
 */
Meteor.methods({
    removeProductImage: function (link) {
        var baseUrl = '/cfs/files/productImages/';
        return ProductImages.remove({_id: link.substr(baseUrl.length)});
    }
})
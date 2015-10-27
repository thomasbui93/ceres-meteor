/**
 * Created by Bui Dang Khoa on 7/27/2015.
 */
Bids = new Meteor.Collection('bids', {
    transform: function(doc){
        var owner = Meteor.users.findOne({_id: doc.ownerId});
        if(owner) {
            doc.owner = owner.profile;
        }
        return doc;
    }
});
Bids.allow({
    insert: function (userId, doc) {
        var product = Products.findOne(doc.productId);
        var enable = false;
        if(product.auctionConfig !== undefined && product !== null){
            enable = (product.auctionConfig.endDate > new Date());
        };
        return (userId && enable);
    },
    update: function (userId, doc, fields, modifier) {
        return false;
    },
    remove: function (userId, doc) {
        return (userId === doc.ownerId);
    }
});
if(Meteor.isServer){
    Meteor.publish('productBids', function (productId) {
        return Bids.find({
            productId: productId
        }, {
            sort: {
                createdTime: 1,
                price: 1
            }
        });
    });
}
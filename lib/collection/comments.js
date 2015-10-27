/**
 * Created by Bui Dang Khoa on 7/24/2015.
 */
Comments = new Meteor.Collection('comments', {
    transform: function(doc){
        var owner = Meteor.users.findOne({_id: doc.userId});
        if(owner) {
            doc.owner = owner.profile;
        }
        return doc;
    }
});
Comments.allow({
    insert: function (userId, doc) {
        // the user must be logged in, and the document must be owned by the user
        return Meteor.call('checkValidUser', userId)&& (doc.history[0].msg.length>0);
    },
    update: function (userId, doc, fields, modifier) {
        // can only change your own documents
        return doc.userId === userId;
    },
    remove: function (userId, doc) {
        // can only remove your own documents
        return doc.userId === userId;
    }
});
if(Meteor.isServer){
    Meteor.publish('productComments', function (productId) {
        //check(productId, String);
        return Comments.find({productId: productId});
    })
}
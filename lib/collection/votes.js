Votes = new Meteor.Collection('votes');

Votes.allow({
    insert: function (userId, doc) {
        // the user must be logged in, and the document must be owned by the user
        return (userId);
    },
    update: function (userId, doc, fields, modifier) {
        // can only change your own documents
        return doc.owner === userId;
    },
    remove: function (userId, doc) {
        // can only remove your own documents
        if(doc.owner !==userId){
            console.log('not allow');
        }
        return doc.owner === userId;
    }
});
Votes.deny({
    update: function (userId, doc, fields, modifiers) {
        if(_.contains(fields, 'owner')){
            return false;
        }
    }
})
if(Meteor.isServer){
    Meteor.publish('productVote', function (productId) {
        if(productId){
            return Votes.find({productId: productId}, {fields:{
                owner: 0
            } });
        }else{
            this.ready();
        }
    });
    Meteor.publish('individualVote', function () {
        return Votes.find({
            owner: this.userId
        });
    });
}
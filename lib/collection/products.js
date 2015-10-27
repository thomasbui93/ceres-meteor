/**
 * Created by Bui Dang Khoa on 7/16/2015.
 */
if(Meteor.isClient){
    Meteor.subscribe('individualVote');

}
Products = new Meteor.Collection('products', {
    transform: function(doc){

        doc.producer = Meteor.users.findOne({
            _id: doc.owner
        }).profile;
        /*
         * vote user
         */

        var voteCollection =  Votes.findOne({
            owner: Meteor.userId(),
            productId: doc._id
        });
        if(voteCollection && Meteor.userId()){
            doc.vote = voteCollection.vote;
        }else{
            doc.vote = 0;
        }
        /*
         * total vote
         */
        doc.votes = {
            up: 0,
            down: 0
        };

            doc.votes.up = Votes.find({
                productId: doc._id,
                vote: 1
            }).count();
            doc.votes.up = Votes.find({
                productId: doc._id,
                vote: 1
            }).count();

            doc.votes.down = Votes.find({
                productId: doc._id,
                vote: -1
            }).count();

        return doc;
    }
});

Products.allow({
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
    },
});
Products.deny({
    update: function (userId, docs, fields, modifier) {
        // can't change owners
        return _.contains(fields, 'owner');
    },
})
if(Meteor.isServer){
    Meteor.publish('individualProducts', function(){
        Products.find({owner: this.userId}).count();
        return Products.find(
            {
                owner: this.userId,
                setAuction: false
            }
        );
    });
    Meteor.publish('allProduct', function () {
        return Products.find({
        });
    });
    Meteor.publish('singleProduct', function (id) {
        return Products.find({_id: id});
    });
    Meteor.publish('singleAuction', function (id) {
        return Products.find({
            _id: id,
            setAuction: true
        });
    })
    Meteor.publish('individualAuctions', function () {
        Products.find({owner: this.userId}).count();
        return Products.find(
            {
                owner: this.userId,
                setAuction: true
            }
        );
    });
    Meteor.publish('allAuctions', function () {
        return Products.find(
            {
                setAuction: true
            }
        );
    })
}
if(Meteor.isClient){
    Meteor.subscribe('individualProducts');
    Meteor.subscribe('allProduct');
}
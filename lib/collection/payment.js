/**
 * Created by Bui Dang Khoa on 7/18/2015.
 */
Payments = new Meteor.Collection('payments', {
    transform: function(doc){
        doc.owner = Meteor.users.findOne({_id: doc.ownerId}).profile;
        doc.buyer = Meteor.users.findOne({_id: doc.buyerId}).profile;
        doc.productDetail = Products.findOne({_id:doc.productId});
        return doc;
    }
});
Payments.allow({
    insert: function (userId, doc) {
        // the user must be logged in, and the document must be owned by the user
        return (userId && doc.buyerId);
    },
    update: function (userId, doc, fields, modifier) {
        // can only change your own documents
        var forbiddenFields = ['buyerId', 'ownerId','productId', 'createdTime', 'updatedTime',  'unit'];
        var clientForbidden = 'status';
        var ownerForbidden = 'notification';
        //only authenticated
        var authentication = (doc.ownerId || doc.buyerId===userId);
        if(!authentication){
            return false;
        }else{
            if( _.intersection(fields, forbiddenFields).length > 0){
                console.log('forbidden in general');
                return false;
            }else{
                if(doc.ownerId === userId){
                    if(fields.indexOf(ownerForbidden)>-1){
                        console.log('forbidden in owner');
                        return false;
                    }else{
                        console.log('allow owner');
                        return true
                    }

                }else{
                    if(fields.indexOf(clientForbidden)>-1){
                        console.log('forbidden in client');
                        return false;
                    }else{
                        console.log('allow client');
                        return true
                    }
                }
            }
        }


    },
    remove: function (userId, doc) {
        // can only remove your own documents
        return false;
    },
});
if(Meteor.isServer){
    Meteor.publish('individualPayments', function () {
        if(Meteor.users.findOne(this.userId)){
            if(Meteor.users.findOne({ _id: this.userId}).profile.status.client){
                return Payments.find({
                    $and: [
                        {
                            $or: [
                                {
                                    ownerId : this.userId
                                },
                                {
                                    buyerId : this.userId
                                }
                            ]
                        },
                        {
                            archive: false
                        }
                    ]
                }, {
                    sort: {
                        createdTime: 1
                    },
                    fields: {
                        'status.ownerSeen': 0
                    }
                });
            }
            else{
                return Payments.find({
                    $and: [
                        {
                            $or: [
                                {
                                    ownerId : this.userId
                                },
                                {
                                    buyerId : this.userId
                                }
                            ]
                        },
                        {
                            archive: false,
                            'status.done':false
                        }
                    ]

                }, {
                    sort: {
                        createdTime: 1
                    },
                    fields: {
                        'status.buyerSeen': 0
                    }
                });
            }
        }else{
            this.ready()
        }

    });
}
if(Meteor.isClient){
    Meteor.subscribe('individualPayments');
}
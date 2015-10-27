/**
 * Created by Bui Dang Khoa on 7/18/2015.
 */
Meteor.methods({
    createPayment: function (product) {
        if(Meteor.userId()){
            product.status={
                paid: false,
                inProgress: false,
                done: false
            };
            product.archive = false;
            product.notification = {
                buyerSeen: false,
                ownerSeen: false
            }
            product.createdTime = new Date();
            product.updatedTime = new Date();
            return Payments.insert(product);
        }else{
            return false;
        }
    },
    removePayment: function (payment) {
        if(Meteor.userId() === payment.buyerId || Meteor.userId() === payment.ownerId){
            var checkPaid = function () {
                return payment.status.paid;
            }
            var checkInProgress = function () {
                return payment.status.inProgress;
            }
            var checkDone = function () {
                return payment.status.done;
            }
            if(!checkPaid()){
                Payments.update({_id: payment._id}, {
                    $set: {
                        archive: true
                    }
                })
            }else{
                if(checkInProgress()){
                    throw Meteor.Error('Not Allow', 'Already in progress');
                }else{
                    Payments.update({_id: payment._id}, {
                        $set: {
                            archive: true
                        }
                    })
                }
            }
        }else{
            throw Meteor.Error('Not Authenticated', 'You\'re not allow to do this.')
        }

    }
})
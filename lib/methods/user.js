Meteor.methods({
        checkValidUser: function (userId) {
            return (Meteor.users.findOne({_id: userId})!==undefined);
        }
    });
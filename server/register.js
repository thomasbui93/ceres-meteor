/**
 * Created by Bui Dang Khoa on 7/4/2015.
 */

Meteor.methods({
    isAdmin: function (user, password) {
        var user = Meteor.users.findOne({
            email: user,
            password: password
        }).fetch();
        if(user.admin === true){
            return true;
        }else{
            return false
        }
    },
    emailExist: function (email) {
        var count = Meteor.users.find({
            'emails.address': email
        }).count();
        return count===0;
    }
})
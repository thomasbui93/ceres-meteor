/**
 * Created by Bui Dang Khoa on 7/11/2015.
 */
Meteor.publish('currentUser', function(){
    return Meteor.users.find({_id: this.userId});
});
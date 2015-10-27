/**
 * Created by Bui Dang Khoa on 7/17/2015.
 */
if(Meteor.isServer){
    Meteor.publish('companyName', function () {

        return Meteor.users.find({
            'profile.status.client': false
        },{fields: {
            _id: 1,
            'profile.companyName': 1,
            'profile.address':1
        }});
    });
    Meteor.publish('user', function () {
        return Meteor.users.find({_id: this.userId});
    });
    Meteor.publish('userInformation', function () {
        return Meteor.users.find({
            'profile.status.client': true
        },{fields: {
            _id: 1,
            'profile': 1
        }})
    });
    Meteor.publish('usersBasic', function () {
        return Meteor.users.find({
                },
                {
                    fields: {
                        _id:1,
                        'profile.firstName':1,
                        'profile.lastName':1,
                        'profile.avatar': 1,
                        'profile.companyName':1,
                        'profile.address': 1
                    }
                })
            ;
    })
}
if(Meteor.isClient){
    Meteor.subscribe('user');
    Meteor.subscribe('userInformation');
    Meteor.subscribe('usersBasic');
}


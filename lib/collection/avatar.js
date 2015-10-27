/**
 * Created by Bui Dang Khoa on 7/18/2015.
 */
if(Meteor.isServer){
    var avatar = new FS.Store.Dropbox("avatar", {
        key: "2p2i3yhjht58u2w",
        secret: "t35drebhxlxdw5l",
        token: "dznF7N_9uZAAAAAAAAAABh4d4KhdvrLHSS4UG4HNhDVDTSX5p0rNxqA1lPJhxcm7"
    })
    Avatar = new FS.Collection("avatar", {
        stores: [avatar],
        filter: {
            allow: {
                contentTypes: ['image/*']
            }
        }
    })
}
if(Meteor.isClient){
    var avatar = new FS.Store.Dropbox("avatar");
    Avatar = new FS.Collection("avatar", {
        stores: [avatar],
        filter: {
            allow: {
                contentTypes: ['image/*']
            }
        },
        onInvalid: function () {
            if (Meteor.isClient) {
                var el = document.querySelector('div[ng-controller="mainController"]');
                var mainCtrl = angular.element(el).scope();
                mainCtrl.addAlert({
                    msg:'Images only.',
                    type: 'warning'
                });
                mainCtrl.$apply();
            }
        }
    })
}
if(Meteor.isServer){
    Avatar.allow({
        insert: function() {
            return true;
        },
        update: function() {
            return true;
        },
        remove: function() {
            return true;
        },
        download: function() {
            return true;
        }
    });
    Meteor.publish('avatars', function() {
        return Avatar.find();
    });
}
if(Meteor.isClient){
    Meteor.subscribe('avatars');
}
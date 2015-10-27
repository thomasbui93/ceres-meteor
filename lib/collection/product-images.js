/**
 * Created by Bui Dang Khoa on 7/16/2015.
 */
var dropboxStore = new FS.Store.Dropbox("files", {
    key: "2p2i3yhjht58u2w",
    secret: "t35drebhxlxdw5l",
    token: "dznF7N_9uZAAAAAAAAAABh4d4KhdvrLHSS4UG4HNhDVDTSX5p0rNxqA1lPJhxcm7", // Don’t share your access token with anyone.
    //optional, which folder (key prefix) to use
});

Files = new FS.Collection("files", {
    stores: [dropboxStore]
});

if(Meteor.isClient){
    var productImages = new FS.Store.Dropbox("productImages");
    ProductImages = new FS.Collection("productImages", {
        stores: [productImages],
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
};
/*
ProductImages = new FS.Collection("productImages", {
    stores: [new FS.Store.FileSystem("productImages", {path:'../../products'})],
    filter: {
        maxSize: 1048576, // in bytes
        allow: {
            contentTypes: ['image/*']
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
    }
});
*/
if(Meteor.isServer){
    var productImages = new FS.Store.Dropbox("productImages", {
        key: "2p2i3yhjht58u2w",
        secret: "t35drebhxlxdw5l",
        token: "dznF7N_9uZAAAAAAAAAABh4d4KhdvrLHSS4UG4HNhDVDTSX5p0rNxqA1lPJhxcm7"
    })
    ProductImages = new FS.Collection("productImages", {
        stores: [productImages],
        filter: {
            allow: {
                contentTypes: ['image/*']
            }
        }
    })
    ProductImages.allow({
        insert: function(userId) {
            return (userId);
        },
        update: function(userId) {
            return (userId);
        },
        remove: function(userId) {
            return (userId);
        },
        download: function() {
            return true;
        }
    });
    Meteor.publish('productImages', function() {
        return ProductImages.find();
    });
}

if(Meteor.isClient){
    Meteor.subscribe('productImages');
}
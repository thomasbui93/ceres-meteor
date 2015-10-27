/**
 * Created by Bui Dang Khoa on 7/16/2015.
 */

Meteor.startup(function(){
    if(Meteor.isClient){
        Meteor.subscribe('companyName');
    }
});
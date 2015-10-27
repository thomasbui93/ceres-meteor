/**
 * Created by Bui Dang Khoa on 7/22/2015.
 */
'use strict';
angular.module('ceres').factory('voteService', [
    '$meteor','$rootScope','MSG',
    function ($meteor, $rootScope, MSG) {
        return {
            vote: function (productId, arg) {
                if($rootScope.currentUser!==null){
                    $meteor.subscribe('productVote', productId).then(function (subscriptionHandle) {
                        var foundVote = Votes.findOne({
                            productId: productId,
                            owner: $rootScope.currentUser._id
                        });
                        var feedback = undefined;
                        if(foundVote){
                            console.log('update vote');
                            feedback = Votes.update({
                               _id: foundVote._id
                            },{
                                $set: {
                                    productId: productId,
                                    owner: $rootScope.currentUser._id,
                                    vote: arg
                                }
                            });
                        }else{
                            console.log('create new vote');
                            feedback = Votes.insert({
                                    productId: productId,
                                    owner: $rootScope.currentUser._id,
                                    vote: arg
                                });

                        }
                        if(feedback){
                            if(arg===1){
                                $rootScope.$emit('addToast', MSG.vote.up);
                            }
                            if(arg===-1){
                                $rootScope.$emit('addToast', MSG.vote.down);
                            }
                            if(arg===0){
                                $rootScope.$emit('addToast', MSG.vote.un);
                            }
                            
                            subscriptionHandle.stop();
                        }else{
                            console.log('error happened');
                            subscriptionHandle.stop()
                        }
                    });
                }else{
                    $rootScope.$emit('addToast', MSG.vote.authenticated);
                }
                
            },
            checkVote: function (productId) {
                return Votes.findOne({
                    productId : productId,
                    owner: $rootScope.currentUser._id
                })
            }
        }
    }
]);

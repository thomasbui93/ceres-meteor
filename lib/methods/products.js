/**
 * Created by Bui Dang Khoa on 7/16/2015.
 */
Meteor.methods({
    createProduct: function (product) {
        if(Meteor.userId()){
            product.image = [];
            return Products.insert(product);
        }else{
            return false;
        }
    },
    updateProductImage: function (productId, url, replaceIndex) {
        if(Meteor.userId()){
            var MAX_NUMBER_FILES = 5;
            var oldImgs = Products.findOne({_id: productId}).image;
            var baseUrl= '/cfs/files/productImages/';
            if(oldImgs.length === MAX_NUMBER_FILES){
                console.log('full capacity updated');
                var oldImg = oldImgs.shift();
                /*
                 * remove old images
                 */
                if(oldImg!== null ){
                    ProductImages.remove({_id: oldImg.substr(baseUrl.length)});
                }
                Products.update(productId, {$set: {image: oldImgs}});

            }else if(replaceIndex!==null && replaceImg !==undefined){
                console.log('change update');
                var replaceImg = oldImgs[replaceIndex];
                if(replaceImg!== null ){
                    ProductImages.remove({_id: replaceImg.substr(baseUrl.length)});
                }
                oldImgs[replaceIndex] = url;
                Products.update(productId, {$set: {image: oldImgs}});
            }else{
                console.log('regular update');
                Products.update(productId, {$push: {image: url}});
            }
            /*
             * upload img
             */



            return true;
        }else{
            return false;
        }
    },
    removeProduct: function (productId) {
        if(Meteor.userId()){

            var oldImgs = Products.findOne({_id: productId}).image;
            var baseUrl= '/cfs/files/productImages/';
            /*
             * remove product
             */
            var product = Products.remove(productId);

            /*
             * remove img of product
             */
            if(!oldImgs === null && oldImgs.length > 0){
                oldImgs.forEach(function (oldImg) {
                    if(oldImg!== null && product){
                        ProductImages.remove({_id: oldImg.substr(baseUrl.length)});
                    }
                });
            }

            if(product){
                return {
                    success: true
                }
            }else{
                throw new Meteor.Error("Undefined Error",
                    "Error occured in the proccess.");
            }
        }else{
            throw new Meteor.Error("403",
                "Unauthorized Actions");
        }
    },
    updateProduct: function (productId, doc) {
        if(Meteor.userId()){
            doc.createdTime = new Date();
            return Products.update({_id: productId}, doc );
        }else{
            throw new Meteor.Error("403",
                "Unauthorized Actions");
        }
    },
    setHighestBid: function (productId) {
        var bids = Bids.find({productId: productId}, {sort: {
            price: -1,
            createdTime: 1
        }},{
            limit: 1
        }).fetch();
        var highestBid = {
            ownerId: bids[0].ownerId,
            price: bids[0].price,
            createdTime: bids[0].createdTime
        };
        var product = Products.findOne(productId);

        if(product && product.auctionConfig){
            Products.update(productId, {
                $set: {
                    'auctionConfig.leading': highestBid
                }
            });
        }
    },
    removeAuction: function (productId) {
        var updateAuction = Products.update(productId,{
            $set:
            {
                auctionConfig: undefined,
                setAuction: false
            }
        });
        var removeBids = Bids.remove({
            productId: productId
        });
        console.log(updateAuction, removeBids);
    }
})
Products.search = function (queryString, config) {
    var parseBool = function(bool){
        if(bool===true){
            return 1;
        }else{
            return -1;
        }
    }

    var owners = [];
    var ownerConfig = {
        $regex: ".*"+RegExp.escape(queryString)+".*",
        $options: 'i'
    };

    if(config.provider){
        var users = Meteor.users.find({
            'profile.companyName': {
                $regex: ".*"+RegExp.escape(queryString)+".*",
                $options: 'i'
            }
        }, {fields: {_id: 1}}).fetch();
        ownerConfig = {
            $in: users
        }
    }


    if(config.categories){

    }

    return Products.find({
        $or: [
            {
                name: {
                    $regex: ".*"+RegExp.escape(queryString)+".*",
                    $options: 'i'
                }
            },
            {
                'detail.description': {
                    $regex: ".*"+RegExp.escape(queryString)+".*",
                    $options: 'i'
                }
            },
            {
                owner: ownerConfig
            }
        ]
    }, {
        sort: {
            createdTime: parseBool(config.newest),
            'price.main': parseBool(config.price)
        }
    }).fetch();
}
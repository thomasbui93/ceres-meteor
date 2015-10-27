/**
 * Created by Bui Dang Khoa on 7/15/2015.
 */
Meteor.methods(
    {
        removeProductImages: function (linkArray, product) {
            linkArray = _.uniq(linkArray);
            var image =  Products.findOne({_id: product._id}).image;

            linkArray.forEach(function (link) {
                var baseUrl= '/cfs/files/productImages/';
                ProductImages.remove({_id: link.substr(baseUrl.length)});
                if(image.indexOf(link)>-1){
                    image.splice(image.indexOf(link), 1);
                }
            });

            return Products.update(product._id,{
                $set: {
                    image: image
                }
            });
    }
    }
);
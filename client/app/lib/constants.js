/**
 * Created by Bui Dang Khoa on 6/30/2015.
 */
'use strict';
angular.module('ceres').constant(
    'STATE', {
        'theme': ['dashboard', 'auction', 'login', 'register','admin', 'product'],
        'authenticated': ['dashboard', 'admin'],
        'guest': ['login','register']
    }
).constant(
    'MSG', {
        dashboard: {
            updateSuccess: 'You have updated profile successfully',
            updateFailed: 'The update encountered error',
            avatarFailed: 'File is not supported',
            productSuccess: 'The image has been uploaded successfully',
            deleteProductSuccess: 'The product has been deleted successfully',
            deleteProductFail: 'The product has been failed to deleted.',
            imageFailed: 'Deleting the product image failed',
            imageSuccess: 'Deleting the product image success',
            createProductSuccess: 'You have created a product',
            createProductFail: 'You have failed to create a product'
        },
        payment: {
            created: 'Your payment has been created',
            archive: 'You have archived this payment',
            removeSuccess: 'You have removed this paynment',
            removeFailed: 'The removal has failed.',
            createdFail: 'Something\'ve happened in the process',
            init: 'Initializing payment...'
        },
        vote: {
            authenticated: 'You have to log in to to this',
            up: 'You have like this product',
            down: 'You have dislike this product',
            un: 'You have unlike this product'
        },
        comment: {
            success: 'You have commented',
            failed: 'Oops! Something wrong happened.',
            deleteSuccess:'The comment has been deleted'
        }
    }
).constant(
    'PRODUCT', {
        'categories': [
            {
                name: 'Animal Products',
                description: ''
            },
            {
                name: 'Vegetables',
                description: ''
            },
            {
                name: 'Fresh Seafood',
                description: ''
            },
            {
                name: 'Grain',
                description: ''
            },
            {
                name: 'Mushrooms & Truffles',
                description: ''
            },
            {
                name: 'Organic Produce',
                description: ''
            },
            {
                name: 'Fruit',
                description: ''
            },
            {
                name: 'Nuts & Kernels',
                description: ''
            },
            {
                name: 'Plant & Animal Oil',
                description:''
            },
            {
                name: 'Timber Raw Materials',
                description: ''
            },
            {
                name: 'Other',
                description: ''
            }
        ]
    }).constant('KEYBOARD',{
        ENTER: 13,
        ESC: 27
    }).constant('BID', {
        success: 'You have place your bid.',
        fail: 'Oops, something wrong happened.',
        newBid: 'A new bid has place.',
        first: 'Your bid is leading.',
        drop:'Your bid has been dethroned.'
    });
/**
 * Created by Bui Dang Khoa on 6/27/2015.
 */


/*
 * end database declare.
 */
'use strict';
angular.module('ceres',
    ['angular-meteor', 'ui.router', 'ngAnimate', 'ui.bootstrap', 'ngFileUpload', 'angular-velocity', 'ngTouch', 'ngSanitize'])
    .config([
    '$urlRouterProvider', '$stateProvider', '$locationProvider',
    function($urlRouterProvider, $stateProvider, $locationProvider){
        $urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'client/app/home/home.ng.html',
            controller: 'homeController'
        }).state('explore', {
            url: '/explore',
            templateUrl: 'client/app/explore/explore.ng.html',
            controller: 'exploreController',
            resolve: {
                products: [
                    '$meteor',
                    function($meteor){
                        return $meteor.subscribe('companyName');
                    }],
                allProducts: [
                    '$meteor',
                    function ($meteor) {
                        return $meteor.subscribe('allProduct');
                    }
                ]
            }
        }).state('provider', {
            url: '/providers',
            templateUrl: 'client/app/providers/provider.ng.html',
            controller: 'providerController',
            abstract: true
        }).state('provider.information',{
            url: '',
            views: {
                'information':{
                    templateUrl: 'client/app/providers/basic.ng.html',
                    controller: 'providerBasicController'
                }
            }
        }).state('provider.timeline',{
            url: '/timeline',
            views: {
                'information':{
                    templateUrl: 'client/app/providers/timeline.ng.html',
                    controller: 'providerTimelineController'
                }
            }
        }).state('provider.product',{
            url: '/product',
            views: {
                'information':{
                    templateUrl: 'client/app/providers/product.ng.html',
                    controller: 'providerProductController',
                }
            }
        }).state('products',{
            url: '/products/:id',
            templateUrl: 'client/app/products/product.ng.html',
            controller: 'productController',
            resolve: {
                votes: ['$meteor','$stateParams',
                    function ($meteor, $stateParams) {
                        return $meteor.subscribe('productVote', $stateParams.id);
                    }],
                comments: ['$meteor', '$stateParams',
                    function ($meteor, $stateParams) {
                        return $meteor.subscribe('productComments', $stateParams.id);
                    }],
                users: ['$meteor',
                    function ($meteor) {
                        return $meteor.subscribe('usersBasic');
                    }]
            }
        }).state('register', {
            url: '/register',
            templateUrl: 'client/app/register/register.ng.html',
            controller: 'registerController',
            abstract: true
        }).state('register.home', {
            url: '',
            views: {
                'register': {
                    templateUrl:'client/app/register/register.home.ng.html',
                    controller: 'registerHomeController'
                }
            }
        }).state('register.client', {
            url: '/client',
            views: {
                'register': {
                    templateUrl: 'client/app/register/register.client.ng.html',
                    controller: 'registerClientController'
                }
            }
        }).state('register.provider', {
            url: '/provider',
            views: {
                'register': {
                    templateUrl: 'client/app/register/register.provider.ng.html',
                    controller: 'registerProviderController'
                }
            }
        }).state('bargain', {
            url: '/bargains',
            templateUrl: 'client/app/bargain/bargain.ng.html',
            controller: 'bargainController'
        }).state('bargain.auction',{
            url: '/auction/:id',
            templateUrl: 'client/app/bargain/auction.ng.html',
            controller: 'auctionController'
        }).state('login', {
            url: '/login',
            templateUrl: 'client/app/login/login.ng.html',
            controller: 'loginController',
            abstract: true,
        }).state('login.user',{
            url: '',
            views: {
                'login': {
                    templateUrl: 'client/app/login/user.ng.html',
                    controller: 'loginController'
                }
            }
        }).state('login.admin',{
            url: '/admin',
            views: {
                'login': {
                    templateUrl: 'client/app/login/admin.ng.html',
                    controller: 'adminLoginController'
                }
            }
        }).state('dashboard',{
            url: '/dashboard',
            templateUrl: 'client/app/dashboard/dashboard.ng.html',
            controller: 'dashboardController',
            abstract: true,
            resolve: {
                "currentUser": ["$meteor", function($meteor){
                    return $meteor.waitForUser();
                }]
            }
        }).state('dashboard.home',{
            url: '',
            views: {
                'dashboard': {
                    templateUrl: 'client/app/dashboard/dashboard.home.ng.html',
                    controller: 'dashboardHomeController'
                }
            }
        }).state('dashboard.payment', {
            url: '/payment',
            views: {
                'dashboard': {
                    templateUrl: 'client/app/dashboard/payment.ng.html',
                    controller: 'dashboardPaymentController'
                }
            },
            resolve: {
                payment: ['$meteor',
                function($meteor){
                   return $meteor.subscribe('individualPayments');
                }]
            },
            abstract: true
        }).state('dashboard.payment.home', {
                url: '',
                views: {
                    'payment': {
                        templateUrl: 'client/app/dashboard/payment.home.ng.html',
                        controller: 'dashboardPaymentController'
                    }
                }
            }
        ).state('dashboard.payment.archive', {
                url: '/archive',
                views: {
                    'payment': {
                        templateUrl: 'client/app/dashboard/payment.archive.ng.html',
                        controller: 'dashboardPaymentController'
                    }
                }
            }
        ).state('dashboard.account', {
            url: '/account',
            views: {
                'dashboard': {
                    templateUrl: 'client/app/dashboard/account.ng.html',
                    controller: 'dashboardAccountController'
                }
            },
            abstract: true
        }).state('dashboard.account.home', {
            url: '',
            views: {
                'account': {
                    templateUrl: 'client/app/dashboard/account.home.ng.html',
                    controller: 'dashboardAccountController'
                }
            }
        }).state('dashboard.account.appearance', {
            url: '',
            views: {
                'account': {
                    templateUrl: 'client/app/dashboard/account.appearance.ng.html',
                    controller: 'dashboardAccountController'
                }
            }
        }).state('dashboard.account.password', {
            url: '',
            views: {
                'account': {
                    templateUrl: 'client/app/dashboard/account.password.ng.html',
                    controller: 'dashboardAccountController'
                }
            }
        }).state('dashboard.account.contact', {
            url: '',
            views: {
                'account': {
                    templateUrl: 'client/app/dashboard/account.contact.ng.html',
                    controller: 'dashboardAccountController'
                }
            }
        }).state('dashboard.bill', {
            url: '/bill',
            views: {
                'dashboard': {
                    templateUrl: 'client/app/dashboard/bill.ng.html',
                    controller: 'dashboardBillController'
                }
            },
            abstract: true
        }).state('dashboard.bill.home',{
            url: '',
            views: {
                'bill': {
                    templateUrl: 'client/app/dashboard/bill.home.ng.html',
                    controller: 'dashboardBillController'
                }
            }
        }).state('dashboard.bill.archive',{
            url: '/',
            views: {
                'bill': {
                    templateUrl: 'client/app/dashboard/bill.archive.ng.html',
                    controller: 'dashboardBillController'
                }
            }
        }).state('dashboard.product', {
            url: '/product',
            views: {
                'dashboard':{
                    templateUrl: 'client/app/dashboard/product.ng.html',
                    controller: 'dashboardProductController'
                }
            },
            abstract: true
        }).state('dashboard.product.compose',{
            url: '/compose',
            views: {
                'product': {
                    templateUrl: 'client/app/dashboard/product.compose.ng.html',
                    controller: 'dashboardProductController'
                }
            }
        }).state('dashboard.product.manage',{
            url: '',
            views: {
                'product': {
                    templateUrl: 'client/app/dashboard/product.manage.ng.html',
                    controller: 'dashboardProductManageController'
                }
            }
        }).state('dashboard.product.auctions', {
                url: '/auctions',
                views: {
                    'product': {
                        templateUrl: 'client/app/dashboard/product.auctions.ng.html',
                        controller: 'dashboardProductAuctionController'
                    }
                }
            }).state('dashboard.product.edit',{
            url: '/edit/:id',
            views: {
                'product': {
                    templateUrl: 'client/app/dashboard/product.edit.ng.html',
                    controller: 'dashboardProductEditController'
                }
            },
            resolve: {
                product: ['$meteor','$stateParams',
                    function ($meteor, $stateParams) {
                        return $meteor.subscribe('singleProduct', $stateParams.id);
                    }]
            }
        }).state('dashboard.providerProfile', {
            url: '/providerProfile',
            views: {
                'dashboard':{
                    templateUrl: 'client/app/dashboard/profile.ng.html',
                    controller: 'dashboardProfileController'
                }
            }, abstract: true
        }).state('dashboard.providerProfile.home',{
            url: '',
            views: {
                'profile': {
                    templateUrl: 'client/app/dashboard/profile.home.ng.html',
                    controller: 'dashboardProfileController'
                }
            }
        }).state('dashboard.providerProfile.appearance',{
            url: '/appearance',
            views: {
                'profile': {
                    templateUrl: 'client/app/dashboard/profile.appearance.ng.html',
                    controller: 'dashboardProfileController'
                }
            }
        }).state('dashboard.providerProfile.password', {
                url: '/password',
                views: {
                    'profile': {
                        templateUrl: 'client/app/dashboard/profile.password.ng.html',
                        controller: 'dashboardProfileController'
                    }
                }
        }).state('dashboard.providerProfile.contact',{
                url: '/contact',
                views: {
                    'profile': {
                        templateUrl: 'client/app/dashboard/profile.contact.ng.html',
                        controller: 'dashboardProfileController'
                    }
                }
        }).state('admin', {
            url: '/admin',
            templateUrl: 'client/app/admin/admin.ng.html',
            controller: 'adminController',
            abstract: true
        }).state('admin.block', {
            url: '',
            views: {
                'admin': {
                    templateUrl: 'client/app/admin/block.ng.html',
                    controller: 'adminBlockController'
                }
            }
        }).state('admin.verify', {
            url: '',
            views: {
                'admin': {
                    templateUrl: 'client/app/admin/verify.ng.html',
                    controller: 'adminVerifyController'
                }
            }
        }).state('product', {
            url: '/product/:id',
            templateUrl: 'client/app/product/product.ng.html',
            controller: 'productController',
            resolve: {
                product: ['$meteor','$stateParams',
                    function ($meteor, $stateParams) {
                    return $meteor.subscribe('singleProduct', $stateParams.id);
                }]
            }
            })
            .state('auction', {
                url: '/auction/:id',
                templateUrl: 'client/app/auction/auction.ng.html',
                controller: 'auctionController',
                resolve: {
                    "currentUser": ["$meteor", function($meteor){
                        return $meteor.waitForUser();
                    }]
                }
            });

        /*
         * redirect
         */

    }]).run([
        '$rootScope', '$state', '$meteor','STATE',
        function ($rootScope, $state, $meteor, STATE) {
            $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){

                if($rootScope.currentUser === null){
                    STATE.authenticated.forEach(function (state) {
                        var parentState = toState.name.split('.')[0];
                        if(parentState === state){
                            event.preventDefault();
                            $state.transitionTo('login.user');
                        }
                    });
                }
                if($rootScope.currentUser !== null){
                    STATE.guest.forEach(function (state) {
                        var parentState = toState.name.split('.')[0];
                        if(parentState ===state){
                            event.preventDefault();
                            $state.transitionTo('home');
                        }
                    })
                }

            });
    }]);
'use strict';
var BasePage = require('./base-page');
var templates = require('../templates');
var FacebookUserModel = require('../models/facebook-user-model');
/*

file:     login-page.js
class:    LoginPage
instance: loginPage

*/

module.exports = BasePage.extend({
    pageTitle: 'Facebook Login Page',
    template: templates.pages.login,

    events: {
        'click [role=login]': 'login',
        'click [role=logout]': 'logout'
    },

    // bindings: {
    //     'model.avatar': {
    //         type: 'attribute',
    //         role: 'avatar',
    //         name: 'src'
    //     },

    // },

    login: function() {
        this.facebook_user.login();
    },

    logout: function() {
        this.facebook_user.logout();
    },

    initialize: function() {
        window.fbAsyncInit = this.local_fbAsyncInit.bind(this);

        // Load the SDK Asynchronously
        (function(d){
           var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
           if (d.getElementById(id)) {return;}
           js = d.createElement('script'); js.id = id; js.async = true;
           js.src = '//connect.facebook.net/en_US/all.js';
           ref.parentNode.insertBefore(js, ref);
        }(document));

    },

    local_fbAsyncInit: function() {
        FB.init({
            appId: '282574611931207'
        });

        this.initializeHtmlElements();


        // FacebookUserModel
        this.facebook_user = new FacebookUserModel();
        window.app.facebook_user = this.facebook_user;

        this.facebook_user.on('change:unauthorized', function(model) {
            console.info('change:unauthorized');
            this.jStatus.text(model.loginStatus);
        }, this);

        this.facebook_user.on('change:connected', function(model) {
            console.info('change:connected');
            this.jStatus.text(model.loginStatus);
            this.jBtnLogin = $(this.getByRole('login'));
            this.jBtnLogin.attr('disabled', true);
            this.jBtnLogout.attr('disabled', false);
        }, this);

        this.facebook_user.on('change:disconnected', function(model, value) {
            if(value){
                console.info('change:disconnected');
                this.jStatus.text(model.loginStatus);
                this.jBtnLogin.attr('disabled', false);
                this.jBtnLogout.attr('disabled', true);
            }
        }, this);

        this.facebook_user.on('change', this.showDetails, this);
        this.facebook_user.updateLoginStatus();
    },

    initializeHtmlElements: function() {
        this.jBtnLogin = $(this.getByRole('login'));
        this.jBtnLogout = $(this.getByRole('logout'));
        this.jStatus = $(this.getByRole('status'));
        this.jPreDetails = $(this.getByRole('details'));
        this.jPicture = $(this.getByRole('facebook_user_picture'));
    },

    showDetails: function() {
        console.info('change');
        var authResponse = app.facebook_user.response.authResponse;
        var authResponse_stringified = JSON.stringify(authResponse, '  ', 2);
        this.jPreDetails.html(authResponse_stringified);
        this.jPicture.attr('src', this.facebook_user.pictureUrl);
    }

});

'use strict';
var BasePage = require('./base-page');
var templates = require('../templates');
var FacebookUserModel = require('../models/facebook-user-model');
var config = require('clientconfig');
/*

file:     facebook-login-page.js
class:    FacebookLoginPage
instance: facebookLoginPage

*/

module.exports = BasePage.extend({
    pageTitle: 'Facebook Login Page',
    template: templates.pages.facebookLogin,

    events: {
        'click [role=login]': 'login',
        'click [role=logout]': 'logout'
    },

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
            appId: config.facebook.app_id
        });

        this.initializeHtmlElements();


        // FacebookUserModel
        this.facebook_user = new FacebookUserModel();
        window.app.facebook_user = this.facebook_user;

        this.facebook_user.on('change:unauthorized', function(model) {
            console.info('change:unauthorized');
            this.jStatus.text(model.loginStatus);
        }, this);

        this.facebook_user.on('change:connected', function(model, value) {
            if(value){
                console.info('change:connected');
                this.jStatus.text(model.loginStatus);
                this.jBtnLogin = $(this.getByRole('login'));
                this.jBtnLogin.attr('disabled', true);
                this.jBtnLogout.attr('disabled', false);

                this.showDetails();
            }

        }, this);

        this.facebook_user.on('change:disconnected', function(model, value) {
            if(value){
                console.info('change:disconnected');
                this.jStatus.text(model.loginStatus);
                this.jBtnLogin.attr('disabled', false);
                this.jBtnLogout.attr('disabled', true);

                this.clearDetails();
            }
        }, this);

        this.facebook_user.on('change:details', this.showDetails, this);
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
        var authResponse = app.facebook_user.details;
        var authResponse_stringified = JSON.stringify(authResponse, '  ', 2);
        this.jPreDetails.html(authResponse_stringified);
        this.jPicture.attr('src', this.facebook_user.pictureUrl).show();
    },

    clearDetails: function() {
        this.jPreDetails.html('');
        this.jPicture.attr('src', '').hide();
    }

});

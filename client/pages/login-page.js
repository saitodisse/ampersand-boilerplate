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

        // FacebookUserModel
        this.facebook_user = new FacebookUserModel();
        window.app.facebook_user = this.facebook_user;

        this.facebook_user.on('change:unauthorized', function(model, response) {
            console.info('change:unauthorized', model, response);
            // $('#loginstatus').text(response.status);
        });

        this.facebook_user.on('change:connected', function(model, response) {
            console.info('change:connected', model, response);
            // $('#loginstatus').text(response.status);
            var jBtnLogin = this.getByRole('login');
            console.info(jBtnLogin);
            //jBtnLogin.attr('disabled', true);
            // $('#login').attr('disabled', true);
            // $('#logout').attr('disabled', false);
        });

        this.facebook_user.on('change:disconnected', function(model, response) {
            console.info('change:disconnected', model, response);
            // $('#loginstatus').text(response.status);
            // $('#login').attr('disabled', false);
            // $('#logout').attr('disabled', true)
        });

        // this.facebook_user.on('change', function() {
        //     console.info('change', arguments);
        //     // var table = $('.table tbody').empty();
        //     // _(this.facebook_user.attributes).each(function(value, attribute){
        //     //   if (typeof value !== 'string') return;
        //     //   var tr = $(document.createElement('tr'));
        //     //   var attr = $(document.createElement('td')).text(attribute).appendTo(tr);
        //     //   var val = $(document.createElement('td')).text(value).appendTo(tr);
        //     //   tr.append(attr).append(val).appendTo(table);
        //     // }, this);

        //     // $('#this.facebook_user_picture').show().attr('src', this.facebook_user.get('pictures').square);
        // });

        this.facebook_user.updateLoginStatus();
    },

});

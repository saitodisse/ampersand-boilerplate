/* global FB*/
var BasePage = require('./base-page');
var templates = require('../templates');
var FacebookUserModel = require('../models/facebook-user-model');
/*

file:     login-page.js
class:    LoginPage
instance: loginPage

*/

module.exports = BasePage.extend({
    pageTitle: 'more info',
    template: templates.pages.login,

    initializeFB: function() {
        console.info('FB jssdk loaded');

        FB.init({
            appId: '282574611931207'
        });

        var facebook_user = new FacebookUserModel();

        facebook_user.on('facebook:unauthorized', function(model, response) {
            console.info('facebook:unauthorized');
            // $('#loginstatus').text(response.status);
        });

        facebook_user.on('facebook:connected', function(model, response) {
            console.info('facebook:connected');
            // $('#loginstatus').text(response.status);
            // $('#login').attr('disabled', true);
            // $('#logout').attr('disabled', false);
        });

        facebook_user.on('facebook:disconnected', function(model, response) {
            console.info('facebook:disconnected');
            // $('#loginstatus').text(response.status);
            // $('#login').attr('disabled', false);
            // $('#logout').attr('disabled', true)
        });

        facebook_user.on('change', function() {
            console.info('change');
            // var table = $('.table tbody').empty();
            // _(facebook_user.attributes).each(function(value, attribute){
            //   if (typeof value !== 'string') return;
            //   var tr = $(document.createElement('tr'));
            //   var attr = $(document.createElement('td')).text(attribute).appendTo(tr);
            //   var val = $(document.createElement('td')).text(value).appendTo(tr);
            //   tr.append(attr).append(val).appendTo(table);
            // }, this);

            // $('#facebook_user_picture').show().attr('src', facebook_user.get('pictures').square);
        });

        // $('#login').click(function(){ facebook_user.login() });
        // $('#logout').click(function(){ facebook_user.logout() });

        facebook_user.updateLoginStatus();
    },

    initialize: function() {
        window.fbAsyncInit = this.initializeFB;

        // Load the SDK Asynchronously
        (function(d){
           var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
           if (d.getElementById(id)) {return;}
           js = d.createElement('script'); js.id = id; js.async = true;
           js.src = "//connect.facebook.net/en_US/all.js";
           ref.parentNode.insertBefore(js, ref);
        }(document));

    }
});

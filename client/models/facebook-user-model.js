'use strict';

/*
 * based on: facebook-user.js V. 1.1.0, Created 2012 by Christian Bäuerlein
 */
var AmpersandModel = require('ampersand-model');
/*

file:     facebook-user-model.js
class:    FacebookUserModel
instance: facebookUserModel

*/

module.exports = AmpersandModel.extend({
    type: 'user',
    props: {
        scope: ['array'],
        autoFetch: ['boolean', false, true],
        unauthorized: ['boolean'],
        connected: ['boolean'],
        disconnected: ['boolean'],
        loginStatus: ['string'],
        protocol: ['string', true, window.document.location.protocol],
        response: ['object'],
        profile_picture_type: ['string', true, 'normal'] //'square', 'small', 'normal', 'large'
    },
    derived: {
        isConnected:{
            // the properties it depends on
            deps: ['connected'],
            // how it's calculated
            fn: function () {
                // the distance formula
                return this.loginStatus === 'connected';
            }
        },
        pictureUrl:{
            // the properties it depends on
            deps: ['connected', 'profile_picture_type'],
            // how it's calculated
            fn: function () {
                // the distance formula
                return this.profilePictureUrl();
            }
        }
    },

    initialize: function() {
        // see https://developers.facebook.com/docs/authentication/permissions/
        window.FB.Event.subscribe('auth.authResponseChange', this.onLoginStatusChange.bind(this));
    },

    options: null,

    login: function(callback){
        if (typeof callback === 'undefined') {
            callback = function() {};
        }

        this.scope = ['email'];
        window.FB.login(callback, { scope: this.scope.join(',') });
    },

    logout: function(){
        window.FB.logout();
    },

    updateLoginStatus: function(){
        window.FB.getLoginStatus(this.onLoginStatusChange);
    },

    onLoginStatusChange: function(response) {
        this.response = response;
        this.loginStatus = response.status;
        this.unauthorized = (this.loginStatus === 'not_authorized');
        this.connected = (this.loginStatus === 'connected');
        this.disconnected = (this.loginStatus === 'unknown');

        if(this.connected && this.autoFetch){
            this.fetch();
        }
    },

    sync: function(method, model, options) {
        if(method !== 'read'){
            throw new Error('FacebookUser is a readonly model, cannot perform ' + method);
        }

        var callback = function(response) {
        if(response.error) {
            options.error(response);
        } else {
            options.success(response);
        }
        return true;
        };

        var request = window.FB.api('/me', callback);
        model.trigger('request', model, request, options);
        return request;
    },

    profilePictureUrl: function() {
        if(!this.isConnected){
            return '';
        }

        return [
            this.protocol,
            '//graph.facebook.com/',
            app.facebook_user.response.authResponse.userID,
            '/picture?type=',
            this.profile_picture_type,
            this.protocol.indexOf('https') > -1 ? '&return_ssl_resources=1' : ''
        ].join('');
    }


});
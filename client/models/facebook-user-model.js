'use strict';

/*
 * facebook-user.js V. 1.1.0, Created 2012 by Christian Bäuerlein
 */
var AmpersandModel = require('ampersand-model');
var _ = require('underscore');

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
        protocol: ['string', false, '']
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
        // if(this.loginStatus === response.status){
        //     return false;
        // }
        //
        // var event_name = '';

        if(response.status === 'not_authorized') {
            this.unauthorized = true;
        }
        else if (response.status === 'connected') {
            this.connected = true;
            if(this.autoFetch === true){
                this.fetch();
            }
        }
        else {
            this.disconnected = true;
        }

        this.loginStatus = response.status;
    },

    parse: function(response) {
        var attributes = _.extend(response, {
        pictures: this.profilePictureUrls(response.id)
        });

        return attributes;
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

    profilePictureUrls: function(id) {
        if(!id){
            id = this.id;
        }

        var urls = {};
        _([ 'square', 'small', 'normal', 'large' ]).each(function(size){
        urls[size] = this.profilePictureUrl(id, size);
        }, this);

        return urls;
    },

    profilePictureUrl: function(id, size) {
        return [
        this.protocol,
        '//graph.facebook.com/',
        id,
        '/picture?type=',
        size,
        this.protocol.indexOf('https') > -1 ? '&return_ssl_resources=1' : ''
        ].join('');
    }


});
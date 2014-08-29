/* globals gapi */
'use strict';
var BasePage = require('./base-page');
var templates = require('../templates');
var GoogleUserModel = require('../models/google-user-model');
var config = require('clientconfig');
/*

file:     google-login-page.js
class:    GoogleLoginPage
instance: googleLoginPage

*/



/*

https://developers.google.com/api-client-library/javascript/features/authentication#OAuth20basics

1. The user clicks a "login" link.
2. The browser shows a popup that allows the user to authenticate and authorize the web application.
3. After successful authorization, the browser redirects the user back to the calling application (your application).
4. The callback saves the authorization token and closes the popup.

*/

module.exports = BasePage.extend({
    pageTitle: 'Google Login Page',
    template: templates.pages.googleLogin,

    events: {
        'click [role=login]': 'handleAuthClick',
        'click [role=logout]': 'logout'
    },

    login: function() {
        this.google_user.login();
    },

    logout: function() {
        this.google_user.logout();
    },

    initialize: function() {
        // window.signinCallback = this.local_handleClientLoad.bind(this);

        // Load the SDK Asynchronously
        (function() {
            var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
            po.src = 'https://apis.google.com/js/client:plusone.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
        })();


        // (function(d){
        //      var js, id = 'google-jssdk', ref = d.getElementsByTagName('script')[0];
        //      if (d.getElementById(id)) {return;}
        //      js = d.createElement('script'); js.id = id; js.async = true;
        //      js.src = 'https://apis.google.com/js/client.js?onload=handleClientLoad';
        //      ref.parentNode.insertBefore(js, ref);
        // }(document));

        window.signinCallback = function signinCallback(authResult) {
            if (authResult.status.signed_in) {
                // Update the app to reflect a signed in user
                // Hide the sign-in button now that the user is authorized, for example:
                document.getElementById('signinButton').setAttribute('style', 'display: none');
            } else {
                // Update the app to reflect a signed out user
                // Possible error values:
                //   "user_signed_out" - User is signed-out
                //   "access_denied" - User denied access to your app
                //   "immediate_failed" - Could not automatically log in the user
                console.log('Sign-in state: ' + authResult.error);
            }

            var authResult_stringify = JSON.stringify(authResult, ' ', 2);
            console.log(authResult_stringify);

             window.makeApiCall();
        };


        // Load the API and make an API call.  Display the results on the screen.
        window.makeApiCall = function makeApiCall() {
            gapi.client.load('plus', 'v1', function() {
                var request = gapi.client.plus.people.get({
                    'userId': 'me'
                });
                request.execute(function(resp) {
                    var heading = document.createElement('h4');
                    var image = document.createElement('img');
                    image.src = resp.image.url;
                    heading.appendChild(image);
                    heading.appendChild(document.createTextNode(resp.displayName));

                    $('#content').html(heading);
                    document.getElementById('content').appendChild(heading);
                });
            });
        };

    },

    // Enter a client ID for a web application from the Google Developer Console.
    // The provided clientId will only work if the sample is run directly from
    // https://google-api-javascript-client.googlecode.com/hg/samples/authSample.html
    // In your Developer Console project, add a JavaScript origin that corresponds to the domain
    // where you will be running the script.
    // clientId: '',

    // // Enter the API key from the Google Develoepr Console - to handle any unauthenticated
    // // requests in the code.
    // // The provided key works for this sample only when run from
    // // https://google-api-javascript-client.googlecode.com/hg/samples/authSample.html
    // // To use in your own application, replace this API key with your own.
    // apiKey: '',

    // // To enter one or more authentication scopes, refer to the documentation for the API.
    // scopes: '',

    // Use a button to handle authentication the first time.
    //       local_handleClientLoad: function() {
    //     this.initializeHtmlElements();

    //     function checkAuth() {
    //         var clientId = config.google.client_id;
    //         var scopes = 'https://www.googleapis.com/auth/plus.me';
    //         gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: true }, handleAuthResult);
    //     }

    //     function handleAuthResult(authResult) {
    //         var authTimeout;

    //         console.log(authResult);

    //         if (authResult && !authResult.error) {
    //         // Schedule a check when the authentication token expires
    //         if (authResult.expires_in) {
    //             authTimeout = (authResult.expires_in - 5 * 60) * 1000;
    //             setTimeout(checkAuth, authTimeout);
    //         }

    //         //app.views.auth.$el.hide();
    //         $('#signed-in-container').show();
    //             console.log('ready');
    //         } else {
    //         if (authResult && authResult.error) {
    //             // TODO: Show error
    //             console.error('Unable to sign in:', authResult.error);
    //         }

    //         app.views.auth.$el.show();
    //         }
    //     }

    //     this.checkAuth = function() {
    //         gapi.auth.authorize({ client_id: config.clientId, scope: config.scopes, immediate: false }, handleAuthResult);
    //     };


    //     this.apiKey = config.google.api_key;

    //     gapi.client.setApiKey(this.apiKey);
    //     window.setTimeout(checkAuth.bind(this), 10);
    // },

    // checkAuth: function() {

    //     gapi.auth.authorize({client_id: this.clientId, scope: this.scopes, immediate: true}, this.handleAuthResult.bind(this));
    // },

    // handleAuthResult: function (authResult) {
    //     var isError = authResult.hasOwnProperty('stack');
    //     if(isError){
    //         throw authResult;
    //     }

    //     console.log('OK: authResult:', authResult);

    //     if (authResult && !authResult.error) {
    //         this.jBtnLogin.attr('disabled', true);
    //         this.jBtnLogout.attr('disabled', false);
    //         this.makeApiCall();
    //     } else {
    //         this.jBtnLogin.attr('disabled', false);
    //         this.jBtnLogout.attr('disabled', true);
    //     }
    // },

    // handleAuthClick: function (event) {
    //     gapi.auth.authorize({client_id: this.clientId, scope: this.scopes, immediate: false}, this.handleAuthResult);
    //     return false;
    // },

    // // Load the API and make an API call.  Display the results on the screen.
    // makeApiCall: function () {
    //     gapi.client.load('plus', 'v1', function() {
    //     var request = gapi.client.plus.people.get({
    //         'userId': 'me'
    //     });
    //     request.execute(function(resp) {
    //         console.log(resp);
    //         // var heading = document.createElement('h4');
    //         // var image = document.createElement('img');
    //         // image.src = resp.image.url;
    //         // heading.appendChild(image);
    //         // heading.appendChild(document.createTextNode(resp.displayName));

    //         // document.getElementById('content').appendChild(heading);
    //     });
    //     });
    // },

    initializeHtmlElements: function() {
        this.jBtnLogin = $(this.getByRole('login'));
        this.jBtnLogout = $(this.getByRole('logout'));
        this.jStatus = $(this.getByRole('status'));
        this.jPreDetails = $(this.getByRole('details'));
        this.jPicture = $(this.getByRole('google_user_picture'));
    },

    showDetails: function() {
        var authResponse = app.google_user.details;
        var authResponse_stringified = JSON.stringify(authResponse, '  ', 2);
        this.jPreDetails.html(authResponse_stringified);
        this.jPicture.attr('src', this.google_user.pictureUrl).show();
    },

    clearDetails: function() {
        this.jPreDetails.html('');
        this.jPicture.attr('src', '').hide();
    }

});

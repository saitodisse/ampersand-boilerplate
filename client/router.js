'use strict';

var Router = require('ampersand-router');
var HomePage = require('./pages/home-page');
var CollectionDemoPage = require('./pages/collection-demo-page');
var PersonAddPage = require('./pages/person-add-page');
var PersonEditPage = require('./pages/person-edit-page');
var PersonViewPage = require('./pages/person-view-page');
var BootstrapExamplesPage = require('./pages/bootstrap-examples-page');

var FacebookLoginPage = require('./pages/facebook-login-page');
var GoogleLoginPage = require('./pages/google-login-page');

module.exports = Router.extend({
    routes: {
        ''                  : 'load_home',
        'collections'       : 'load_collectionDemo',
        'facebook-login'    : 'load_facebookLogin',
        'google-login'      : 'load_googleLogin',
        'person/add'        : 'load_personAdd',
        'person/:id'        : 'load_personView',
        'person/:id/edit'   : 'load_personEdit',
        'bootstrap-examples': 'load_bootstrapExamples',
        '(*path)'           : 'catchAll'
    },

    // ------- ROUTE HANDLERS ---------
    load_home: function () {
        this.trigger('page', new HomePage({
            model: me
        }));
    },

    load_collectionDemo: function () {
        this.trigger('page', new CollectionDemoPage({
            model: me,
            collection: app.people
        }));
    },

    load_facebookLogin: function () {
        this.trigger('page', new FacebookLoginPage({
            model: me
        }));
    },

    load_googleLogin: function () {
        this.trigger('page', new GoogleLoginPage({
            model: me
        }));
    },

    load_bootstrapExamples: function () {
        this.trigger('page', new BootstrapExamplesPage());
    },

    load_personAdd: function () {
        this.trigger('page', new PersonAddPage());
    },

    load_personEdit: function (id) {
        this.trigger('page', new PersonEditPage({
            id: id
        }));
    },

    load_personView: function (id) {
        this.trigger('page', new PersonViewPage({
            id: id
        }));
    },

    catchAll: function () {
        this.redirectTo('');
    }
});

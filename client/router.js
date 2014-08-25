/*global me, app*/
var Router = require('ampersand-router');
var HomePage = require('./pages/home-page');
var CollectionDemo = require('./pages/collection-demo');
var InfoPage = require('./pages/info-page');
var PersonAddPage = require('./pages/person-add-page');
var PersonEditPage = require('./pages/person-edit-page');
var PersonViewPage = require('./pages/person-view-page');


module.exports = Router.extend({
    routes: {
        ''               : 'load_home',
        'collections'    : 'load_collectionDemo',
        'info'           : 'load_info',
        'person/add'     : 'load_personAdd',
        'person/:id'     : 'load_personView',
        'person/:id/edit': 'load_personEdit',
        '(*path)'        : 'catchAll'
    },

    // ------- ROUTE HANDLERS ---------
    load_home: function () {
        this.trigger('page', new HomePage({
            model: me
        }));
    },

    load_collectionDemo: function () {
        this.trigger('page', new CollectionDemo({
            model: me,
            collection: app.people
        }));
    },

    load_info: function () {
        this.trigger('page', new InfoPage({
            model: me
        }));
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

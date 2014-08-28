'use strict';

var BasePage = require('./base-page');
var templates = require('../templates');
//var PersonForm = require('../forms/person-form');

/*

file:     person-view-page.js
class:    PersonViewPage
instance: personViewPage

*/

module.exports = BasePage.extend({
    pageTitle: 'view person',
    template: templates.pages.personView,
    bindings: {
        'model.fullName': {
            role: 'name'
        },
        'model.avatar': {
            type: 'attribute',
            role: 'avatar',
            name: 'src'
        },
        'model.editUrl': {
            type: 'attribute',
            role: 'edit',
            name: 'href'
        }
    },
    events: {
        'click [role=delete]': 'handleDeleteClick'
    },
    initialize: function (spec) {
        var self = this;
        app.people.getOrFetch(spec.id, {all: true}, function (err, model) {
            if (err){
                alert('couldnt find a model with id: ' + spec.id);
            }
            self.model = model;
        });
    },
    handleDeleteClick: function () {
        this.model.destroy({success: function () {
            app.navigate('collections');
        }});
    }
});

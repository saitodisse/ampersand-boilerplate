'use strict';

var BasePage = require('./base-page');
var templates = require('../templates');
var PersonForm = require('../forms/person-form');

/*

file:     person-edit-page.js
class:    PersonEditPage
instance: personEditPage

*/

module.exports = BasePage.extend({
    pageTitle: 'edit person',
    template: templates.pages.personEdit,
    initialize: function (spec) {
        var self = this;
        app.people.getOrFetch(spec.id, {all: true}, function (err, model) {
            if (err){
                alert('couldnt find a model with id: ' + spec.id);
            }
            self.model = model;
        });
    },
    subviews: {
        form: {
            // this is the css selector that will be the `el` in the
            // prepareView function.
            container: 'form',
            // this says we'll wait for `this.model` to be truthy
            waitFor: 'model',
            prepareView: function (el) {
                var model = this.model;
                return new PersonForm({
                    el: el,
                    model: this.model,
                    submitCallback: function (data) {
                        model.save(data, {
                            wait: true,
                            success: function () {
                                app.navigate('/collections');
                            }
                        });
                    }
                });
            }
        }
    }
});

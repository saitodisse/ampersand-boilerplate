'use strict';

var BasePage = require('./base-page');
var templates = require('../templates');
var PersonForm = require('../forms/person-form');

/*

file:     person-add-page.js
class:    PersonAddPage
instance: personAddPage

*/

module.exports = BasePage.extend({
    pageTitle: 'add person',
    template: templates.pages.personAdd,
    subviews: {
        form: {
            container: 'form',
            prepareView: function (el) {
                return new PersonForm({
                    el: el,
                    submitCallback: function (data) {
                        app.people.create(data, {
                            wait: true,
                            success: function () {
                                app.navigate('/collections');
                                app.people.fetch();
                            }
                        });
                    }
                });
            }
        }
    }
});

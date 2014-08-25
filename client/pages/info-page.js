var BasePage = require('./base-page');
var templates = require('../templates');

/*

file:     info-page.js
class:    InfoPage
instance: infoPage

*/

module.exports = BasePage.extend({
    pageTitle: 'more info',
    template: templates.pages.info
});

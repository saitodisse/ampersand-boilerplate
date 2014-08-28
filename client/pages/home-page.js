'use strict';

var BasePage = require('./base-page');
var templates = require('../templates');

/*

file:     home-page.js
class:    HomePage
instance: homePage

*/

module.exports = BasePage.extend({
    pageTitle: 'home',
    template: templates.pages.home
});

'use strict';
var Mogger = require('mogger');
var _ = require('lodash');

/*
    usefull links
    -----------------
    test: https://github.com/saitodisse/mogger/blob/master/test/mogger.test.js
    usage: https://github.com/saitodisse/mogger/blob/gh-pages/examples/todo-mvc-backbone-require/js/mogger-example/mogger-example.js
    -----------------
*/

// all targets //////////////////////////////////////////

var ViewSwitcher = require('ampersand-view-switcher');
var Router = require('../router');

var PersonForm = require('../forms/person-form');

var MeModel = require('../models/me-model');
var PersonModel = require('../models/person-model');
var PersonsCollection = require('../models/persons-collection');
var FacebookUserModel = require('../models/facebook-user-model');

var BasePage = require('../pages/base-page');
var HomePage = require('../pages/home-page');
var BootstrapExamplesPage = require('../pages/bootstrap-examples-page');
var CollectionDemoPage = require('../pages/collection-demo-page');
var PersonAddPage = require('../pages/person-add-page');
var PersonEditPage = require('../pages/person-edit-page');
var PersonViewPage = require('../pages/person-view-page');

var MainView = require('../views/main-view');
var PersonView = require('../views/person-view');


var surrogateTargetsSource = {
    'ViewSwitcher.prototype': ViewSwitcher.prototype,
    'Router.prototype': Router.prototype,
    'PersonForm.prototype': PersonForm.prototype,
    'MeModel.prototype': MeModel.prototype,
    'PersonModel.prototype': PersonModel.prototype,
    'PersonsCollection.prototype': PersonsCollection.prototype,
    'FacebookUserModel.prototype': FacebookUserModel.prototype,
    'BasePage.prototype': BasePage.prototype,
    'HomePage.prototype': HomePage.prototype,
    'BootstrapExamplesPage.prototype': BootstrapExamplesPage.prototype,
    'CollectionDemoPage.prototype': CollectionDemoPage.prototype,
    'PersonAddPage.prototype': PersonAddPage.prototype,
    'PersonEditPage.prototype': PersonEditPage.prototype,
    'PersonViewPage.prototype': PersonViewPage.prototype,
    'MainView.prototype': MainView.prototype,
    'PersonView.prototype': PersonView.prototype,
};
// end/ all targets //////////////////////////////////////////

var MoggerTracer = function () {
    this.name = 'MoggerTracer';
};

_.assign(MoggerTracer.prototype, {

    addSurrogateAndTracer: function (opt) {
        surrogateTargetsSource[opt.surrogateTarget.name] = opt.surrogateTarget.instance;
        this.tracer.traceObj(opt.traceObj);
    },

    startTracing: function () {
        // get the tracer
        this.tracer = new Mogger.Tracer({
            //-------------------------------------------------------
            // enable / disable
            //-------------------------------------------------------
            enabled: true,

            //-------------------------------------------------------
            // prints a pause when no logs are printed for some time
            //-------------------------------------------------------
            showPause: true,

            //-------------------------------------------------------
            // where is our sources objects?
            // in our surrogateTargetsSource
            //-------------------------------------------------------
            surrogateTargets: surrogateTargetsSource,

            //-------------------------------------------------------
            // default output logger
            //-------------------------------------------------------
            loggerConfig: {
                output: console
            },

            //-------------------------------------------------------
            // global config
            //-------------------------------------------------------
            before: {
                //css: 'color: blue',
                size: 15
            },
            targetConfig: {
                //css: 'color: red',
                size: 30
            },
            showArguments: true,

            //-------------------------------------------------------
            // interceptors
            //-------------------------------------------------------
            interceptors: [
            {
                filterRegex: /^(trigger|get|has|\$|setFilter|on|_on\w+|render\b|sync|previous|_routeToRegExp|setElement|_getCompareForType|_getDerivedProperty)/i,
                callback: function (info) {
                    return info.method + '("' + info.args[0] + '")';
                }
            },
            {
                filterRegex: /^(execute)/i,
                callback: function (info) {
                    return info.method + '("' + info.args[2] + '")';
                }
            },
            {
                filterRegex: /^(_(show|render))|(renderWithTemplate)/i,
                callback: function (info) {
                    if(info.args[0]){
                        return info.method + '("' + info.args[0].cid + '")';
                    }
                    return info.method + '()';
                }
            },
            ]
        });

        /*
            Objects to trace
            use pointcut: /./ to trace all functions
        */

        // FIXME: (Mogger) por que será que só loga as funções internas da instancia "router"
        //      : quando antes é logado o "Router.prototype"?
        this.tracer.traceObj({
            before: {   message: 'ViewSwitcher', css: 'color: #555' },
            target: 'ViewSwitcher.prototype', targetConfig: {   css: 'color: #555' },
            pointcut: /(_show|render)/
        });
        this.tracer.traceObj({
            before: {   message: 'Router', css: 'color: #C42' },
            target: 'Router.prototype', targetConfig: { css: 'color: #C42' },
            pointcut: /./
        });

        /*
        MODELS
        */
        this.tracer.traceObj({
            before: {   message: 'Me', css: 'color: #2A2' },
            target: 'MeModel.prototype', targetConfig: { css: 'color: #2A2' },
            pointcut: /./
        });
        this.tracer.traceObj({
            before: {   message: 'Persons', css: 'color: #770' },
            target: 'PersonsCollection.prototype', targetConfig: {    css: 'color: #770' },
            pointcut: /^(trigger|on)$/
        });
        this.tracer.traceObj({
            before: {   message: 'Person', css: 'color: #A47' },
            target: 'PersonModel.prototype', targetConfig: { css: 'color: #A47' },
            pointcut: /^(trigger|on)$/
        });
        this.tracer.traceObj({
            before: {   message: 'FacebookUserModel', css: 'color: #A47' },
            target: 'FacebookUserModel.prototype', targetConfig: { css: 'color: #A47' },
            pointcut: /./
        });

        /*
        VIEWS
        */
        this.tracer.traceObj({
            before: {   message: 'MainView', css: 'color: #A42' },
            target: 'MainView.prototype', targetConfig: {   css: 'color: #A42' },
            pointcut: /renderWithTemplate/
        });
        this.tracer.traceObj({
            before: {   message: 'PersonView', css: 'color: #A42' },
            target: 'PersonView.prototype', targetConfig: {   css: 'color: #A42' },
            pointcut: /renderWithTemplate/
        });

        /*
        PAGES
        */
        this.tracer.traceObj({
            before: {   message: 'BasePage', css: 'color: #A42' },
            target: 'BasePage.prototype', targetConfig: {   css: 'color: #A42' },
            pointcut: /renderWithTemplate/
        });
        this.tracer.traceObj({
            before: {   message: 'HomePage', css: 'color: #A42' },
            target: 'HomePage.prototype', targetConfig: {   css: 'color: #A42' },
            pointcut: /renderWithTemplate/
        });
        this.tracer.traceObj({
            before: {   message: 'BootstrapExamplesPage', css: 'color: #A42' },
            target: 'BootstrapExamplesPage.prototype', targetConfig: {   css: 'color: #A42' },
            pointcut: /renderWithTemplate/
        });
        this.tracer.traceObj({
            before: {   message: 'CollectionDemoPage', css: 'color: #A42' },
            target: 'CollectionDemoPage.prototype', targetConfig: {   css: 'color: #A42' },
            pointcut: /renderWithTemplate/
        });
        this.tracer.traceObj({
            before: {   message: 'PersonAddPage', css: 'color: #A42' },
            target: 'PersonAddPage.prototype', targetConfig: {   css: 'color: #A42' },
            pointcut: /renderWithTemplate/
        });
        this.tracer.traceObj({
            before: {   message: 'PersonEditPage', css: 'color: #A42' },
            target: 'PersonEditPage.prototype', targetConfig: {   css: 'color: #A42' },
            pointcut: /renderWithTemplate/
        });
        this.tracer.traceObj({
            before: {   message: 'PersonViewPage', css: 'color: #A42' },
            target: 'PersonViewPage.prototype', targetConfig: {   css: 'color: #A42' },
            pointcut: /renderWithTemplate/
        });

        /*
        FORMS
        */
        this.tracer.traceObj({
            before: {   message: 'PersonForm', css: 'color: #A40' },
            target: 'PersonForm.prototype', targetConfig: {   css: 'color: #A40' },
            pointcut: /renderWithTemplate/
        });

        //2A2, 075, 249,
    }
});

module.exports = MoggerTracer;
var config = require('getconfig');
var stylizer = require('stylizer');
var templatizer = require('templatizer');
var path = require('path');
var Moonboots = require('moonboots-express');

// for reuse
var appDir = __dirname + '/client';
var cssDir = __dirname + '/public/css';


// a little helper for fixing paths for various environments
var fixPath = function (pathString) {
    return path.resolve(path.normalize(pathString));
};

module.exports = function(app) {
    new Moonboots({
        moonboots: {
            jsFileName: 'x_title_x',
            cssFileName: 'x_title_x',
            main: fixPath('client/app.js'),
            developmentMode: config.isDev,
            libraries: [
            __dirname + '/node_modules/jquery/dist/jquery.js',
            __dirname + '/node_modules/bootstrap/dist/js/bootstrap.js',
            ],
            // Specify the stylesheets we want to bundle
            stylesheets: [
                __dirname + '/node_modules/bootstrap/dist/css/bootstrap.css',
                cssDir + '/app.css'
            ],
            browserify: {
                debug: false
            },
            beforeBuildJS: function () {
                // This re-builds our template files from jade each time the app's main
                // js file is requested. Which means you can seamlessly change jade and
                // refresh in your browser to get new templates.
                if (config.isDev) {
                    templatizer(fixPath('templates'), fixPath('client/templates.js'));
                }
            },
            beforeBuildCSS: function (done) {
                // This re-builds css from stylus each time the app's main
                // css file is requested. Which means you can seamlessly change stylus files
                // and see new styles on refresh.
                if (config.isDev) {
                    stylizer({
                        infile: fixPath('public/css/app.styl'),
                        outfile: fixPath('public/css/app.css'),
                        development: true
                    }, done);
                } else {
                    done();
                }
            }
        },
        server: app
    });
};

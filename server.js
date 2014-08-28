'use strict';

/* global console */
var path            = require('path');
var express         = require('express');
var helmet          = require('helmet');
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var compress        = require('compression');
var config          = require('getconfig');
var serveStatic     = require('serve-static');
var morgan          = require('morgan');
var moonbootsConfig = require('./moonbootsConfig');

var server_app = express();
var PORT = process.env.PORT || config.http.port;

// a little helper for fixing paths for various environments
var fixPath = function (pathString) {
    return path.resolve(path.normalize(pathString));
};

// -----------------
// Configure express
// -----------------
server_app.use(compress());
server_app.use(serveStatic(fixPath('public')));

server_app.use(morgan('dev'));
server_app.use(cookieParser());
server_app.use(bodyParser.urlencoded({ extended: false }));
server_app.use(bodyParser.json());

// in order to test this with spacemonkey we need frames
if (!config.isDev) {
    server_app.use(helmet.xframe());
}
server_app.use(helmet.xssFilter());
server_app.use(helmet.nosniff());

server_app.set('view engine', 'jade');

// -----------------
// Set up our little demo API
// -----------------
var api = require('./fakeApi');
server_app.get('/api/people', api.list);
server_app.get('/api/people/:id', api.get);
server_app.delete('/api/people/:id', api.delete);
server_app.put('/api/people/:id', api.update);
server_app.post('/api/people', api.add);

// -----------------
// Set our client config cookie
// -----------------
server_app.use(function (req, res, next) {
    res.cookie('config', JSON.stringify(config.client));
    next();
});


// ---------------------------------------------------
// Configure Moonboots to serve our client application
// ---------------------------------------------------

//Bootstrap fonts
server_app.all(/^\/fonts$/, function(req, res) { res.redirect('/fonts/'); });
server_app.use('/fonts/',serveStatic(__dirname + '/node_modules/bootstrap/dist/fonts'));

moonbootsConfig(server_app);



// listen for incoming http requests on the port as specified in our config
server_app.listen(PORT);
console.log("X_Title_X is running at: http://localhost:" + PORT + " Yep. That\'s pretty awesome.");

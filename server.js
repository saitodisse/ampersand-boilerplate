/* global console */
var path = require('path');
var express = require('express');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var config = require('getconfig');
var semiStatic = require('semi-static');
var serveStatic = require('serve-static');
var stylizer = require('stylizer');
var templatizer = require('templatizer');
var moonbootsConfig = require('./moonbootsConfig');
var app = express();

var PORT = process.env.PORT || config.http.port;

// a little helper for fixing paths for various environments
var fixPath = function (pathString) {
    return path.resolve(path.normalize(pathString));
};

// -----------------
// Configure express
// -----------------
app.use(compress());
app.use(serveStatic(fixPath('public')));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// in order to test this with spacemonkey we need frames
if (!config.isDev) {
    app.use(helmet.xframe());
}
app.use(helmet.xssFilter());
app.use(helmet.nosniff());

app.set('view engine', 'jade');

// -----------------
// Set up our little demo API
// -----------------
var api = require('./fakeApi');
app.get('/api/people', api.list);
app.get('/api/people/:id', api.get);
app.delete('/api/people/:id', api.delete);
app.put('/api/people/:id', api.update);
app.post('/api/people', api.add);

// -----------------
// Set our client config cookie
// -----------------
app.use(function (req, res, next) {
    res.cookie('config', JSON.stringify(config.client));
    next();
});


// ---------------------------------------------------
// Configure Moonboots to serve our client application
// ---------------------------------------------------

//Bootstrap fonts
app.all(/^\/fonts$/, function(req, res) { res.redirect('/fonts/'); });
app.use('/fonts/',serveStatic(__dirname + '/node_modules/bootstrap/dist/fonts'));

moonbootsConfig(app);



// listen for incoming http requests on the port as specified in our config
app.listen(PORT);
console.log("X_Title_X is running at: http://localhost:" + PORT + " Yep. That\'s pretty awesome.");

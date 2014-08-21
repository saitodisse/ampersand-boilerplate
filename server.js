var Hapi = require('hapi');
var config = require('getconfig');
var server = new Hapi.Server('localhost', config.http.port);
var moonbootsConfig = require('./moonbootsConfig');
var fakeApi = require('./fakeApi');
var internals = {};

// set clientconfig cookie
internals.configStateConfig = {
    encoding: 'none',
    ttl: 1000 * 60 * 15,
    isSecure: config.isSecure
};

// bootstrap fonts (glyphicons)
server.route({
  method: 'GET',
  path: '/fonts/{path*}',
  handler: {
      directory: { path: __dirname + '/node_modules/bootstrap/dist/fonts/', listing: false, index: true }
  }
});

server.state('config', internals.configStateConfig);
internals.clientConfig = JSON.stringify(config.client);
server.ext('onPreResponse', function(request, reply) {
    if (!request.state.config) {
        var response = request.response;
        return reply(response.state('config', encodeURIComponent(internals.clientConfig)));
    }

    return reply();
});


// require moonboots_hapi plugin
server.pack.register({plugin: require('moonboots_hapi'), options: moonbootsConfig}, function (err) {
    if (err){
        throw err;
    }
    server.pack.register(fakeApi, function (err) {
        if (err){
            throw err;
        }
        // If everything loaded correctly, start the server:
        server.start(function (err) {
            if (err){
                throw err;
            }
            console.log("X_Title_X is running at: http://localhost:" + config.http.port + " Yep. That\'s pretty awesome.");
        });
    });
});

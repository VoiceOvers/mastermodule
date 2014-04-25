/*
 * server/app.js
 */

'use strict';

var path = require('path');
var http = require('http');

var _ = require('lodash');
var requireDir = require('require-dir');

var koa = require('koa');

//Find out which environment we are preparing for.
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require(path.join(path.normalize(__dirname + '/../config'), process.env.NODE_ENV));

// Create an app that will be available to us globally, yes modules are cached but this
// saves us writing countless lines for calling models, etc.
var app = {
  config: config,
  dir: __dirname,
  lib: {},
  project: require('../project'),
  routes: require('./routes'),
  servers: {
    http: {
      httpServer: null,
      getServer: function () {
        return this.httpServer;
      }
    },
    koa: {
      koaServer: null,
      getServer: function () {
        return this.koaServer;
      }
    },
    socketio: null
  },
  system: null,
};

exports = module.exports = app; //This needs to be here, so everything else may initialize.

//Make the models and such available.
app.lib = requireDir(app.dir + '/lib');
app.models = requireDir(app.dir + '/models');
app.controllers = requireDir(app.dir + '/controllers');


// Defaults for config
_.defaults(app.config, {
  url: app.config.url || 'http://localhost:' + app.project.server.port
});

//Attach All project specific middleware here.
app.attachMiddleware = function() {

  app.servers.koa.getServer().use(function *(next) {
    //This needs to set our csrf on this side.
    yield next;
  });
};

// Run app.servers
app.run = function () {
  // Connect to DB
  // app.lib.redisConnect.connect(app.config.db.redis);

  //KOA server
  app.servers.koa.koaServer = koa();
  app.lib.middlewares.attachMiddleware(app);

  //HTTP Server
  var port = process.env.PORT || app.project.server.port || 3000;
  app.servers.http.httpServer = http.createServer(app.servers.koa.getServer().callback()).listen(port);

    //Register our routes
  app.routes.register(app);

  require('./socketio').registerTinkerbell();

  return app.servers.http.getServer();
};
/*
 * server/app.js
 */

'use strict';

var path = require('path');
var http = require('http');

var _ = require('lodash');
var requireDir = require('require-dir');

var express = require('express');

//Find out which environment we are preparing for.
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// process.env.NODE_ENV='heroku';
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
    express: {
      expressServer: null,
      getServer: function () {
        return this.expressServer;
      }
    },
    socketio: null
  },
  system: null,
};

exports = module.exports = app; //This needs to be here, so everything else may initialize.

//Make the models and such available.
// app.lib = requireDir(app.dir + '/lib');
app.models = requireDir(app.dir + '/models');
app.controllers = requireDir(app.dir + '/controllers');


// Defaults for config
_.defaults(app.config, {
  url: app.config.url || 'http://localhost:' + app.project.server.port
});

//Attach All project specific middleware here.
app.attachMiddleware = function() {

  // app.servers.koa.getServer().use(function *(next) {
  //   //This needs to set our csrf on this side.
  //   yield next;
  // });
};

// Run app.servers
app.run = function () {

  //KOA server
  app.servers.express.expressServer = express();
  // app.lib.middlewares.attachMiddleware(app);

  //HTTP Server
  var port = process.env.PORT || app.project.server.port || 3000;
  app.servers.http.httpServer = http.createServer(app.servers.express.getServer()).listen(port);

    //Register our routes
  app.routes.register(app);

  require('./socketio').registerTinkerbell();

  // var pi = require('./zigbee');
  // pi.impl.pi();

  console.log('Client Server Running on Port %d', port);

  return app.servers.http.getServer();
};

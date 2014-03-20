/*
  This is the bootstrapped middleware, if you are adding middleware
  that is project specific, that should go in the AttachMiddleware
  method located in server/app.js
 */

'use strict';

var _ = require('lodash'),
    compress = require('koa-compress'),
    csrf = require('koa-csrf'),
    favicon = require('koa-favi'),
    logger = require('koa-log4js'),
    parse = require('co-body'),
    koaQs = require('koa-qs'),
    redisStore = require('koa-redis'),
    router = require('koa-router'),
    session = require('koa-sess');

var server = null;

function parseBody() {
  server.use(function *(next){
    //The only time we are expecting a body is with a POST/PUT
    if ('POST' !== this.method && 'PUT' !== this.method) {
      return yield next;
    }

    this.req.body = yield parse(this, { limit: '3kb' });
    yield next;
  });
}

function removePoweredBy() {
  server.use(function *(next) {
    this.remove('X-Powered-By');
    yield next;
  });
}



exports.attachMiddleware = function (app) {
  var maxAge = process.env.NODE_ENV === 'development' ? null : 1000 * 60 * 60 * 24 * 30;  // 1 month

  //Set some useless variables just because we can.
  server = app.servers.koa.getServer();
  server.name = app.project.name;


  //Middleware Attachment
  server.use(favicon());
  koaQs(server); //Add Query String Support
  parseBody();
  removePoweredBy();

  //Set this for sessions. (Should we need them in the future)
  if (_.isObject(app.config.cookie) && _.isString(app.config.cookie.secret)) {
    server.keys = [ app.config.cookie.secret ];
  }

  server.use(compress());
  server.use(router(server)); //Routing

  //Attach any extra Middleware that we want, located in server/app.js
  if (_.isFunction(app.attachMiddleware)) {
    console.log('Attaching Project Specific Middleware');
    app.attachMiddleware();
  }

  //Log all Exceptions when we aren't on a live version.
  if(process.env.NODE_ENV === 'development') {
    server.use(logger());
  }

  if (process.env.NODE_ENV === 'heroku' || process.env.NODE_ENV === 'production') {
    server.on('error', function (err) {
      console.log(err.stack);
      this.throw(500, err); //Pass an error down the chain, eventually reaching the request object.
    });
  }
};
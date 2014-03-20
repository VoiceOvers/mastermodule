/*
 * server/routes.js
 */

'use strict';

exports.register = function (app) {

  var c = app.controllers,
      s = app.servers.koa.getServer();

  s.get('/api', function *(next) {
    console.log('test');
    yield next;
  });
};
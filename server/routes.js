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

  s.get('/api/helper', function *(next){
    var result = yield c.interpretation.impl.interpret('TurnOffShower');

    console.log(result);
    yield next;
  });
};
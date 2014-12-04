/*
 * server/routes.js
 */

'use strict';

exports.register = function (app) {

  var c = app.controllers,
      s = app.servers.express.getServer();

  s.get('/api', function (req, res) {
    console.log('test');
  });

  s.get('/api/helper', function (req, res){
    c.interpretation.impl.interpret('TurnOffShower')
        .then(function (){
            res.send(200);
        });
  });

  s.get('/api/sendupdate', function (req, res){
    var pi = require('./zigbee');

    pi.sendUpdate();
  });
};
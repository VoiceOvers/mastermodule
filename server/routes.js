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

  var Promise = require('bluebird');
  s.get('/api/helper', function (req, res){
    c.interpretation.impl.interpret('ActivateEmergencyProfile')
        .then(function (){
            res.send(200);
        });
  });

  // s.get('/api/', function (req, res){
  //   var pi = require('./zigbee');

  //   pi.sendUpdate();
  // });
};
/*
 * server/socketio.js
 */

'use strict';

var _io = require('socket.io-client'),
    app = require('./app');

var _socket;
exports.registerTinkerbell = function () {
  _socket = _io.connect('http://localhost:3000/tinkerbells');

  console.log(Date.now());
  _socket.emit('tinkerbell:system:state:get', {type: 'Tinkerbell', module: {_id: app.config.module}});

  _socket.on('tinkerbell:system:state:status', function (data) {
    console.log(data);
    console.log(Date.now());
    app.system = data;
  });

  _socket.on('error', function (data) {
    console.log(data);
  });
};
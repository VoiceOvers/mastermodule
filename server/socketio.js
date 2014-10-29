/*
 * server/socketio.js
 */

'use strict';

var _io = require('socket.io-client'),
    app = require('./app');

var _socket;
exports.registerTinkerbell = function () {
  _socket = _io.connect('http://localhost:3000/tinkerbells');

  /**
   * Return the current status of the system
   *
   * @param {Object} data Any data prevelant to the query. // Could be zigbeeNetworkId
   */
  _socket.on('tinkerbell:system:state:get', function (data) {
    app.system = data;

    // This should grab the live status of the system.
    _socket.emit('tinkerbell:system:state:status', {type: 'Tinkerbell', system: {_id: app.config.module}});
  });

  // The system has been updated from the website / app, propogate all changes.
  _socket.on('tinkerbell:system:state:put', function (data){
    console.log(data);
  });

  _socket.on('error', function (data) {
    console.log(data);
  });
};
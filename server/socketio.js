/*
 * server/socketio.js
 */

'use strict';

var _io = require('socket.io-client'),
    app = require('./app'),
    wpi = require('wiring-pi');


var _socket;
exports.registerTinkerbell = function () {
  _socket = _io.connect(app.config.jenkins + '/tinkerbells');
  
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
    var showerPosition = data.zones[0].components[0].state.position;

    wpi.setup('gpio');
    wpi.wiringPiSetupGpio();

    wpi.pinMode(18, wpi.modes.OUTPUT); // MSB
    wpi.pinMode(23, wpi.modes.OUTPUT);
    wpi.pinMode(24, wpi.modes.OUTPUT);
    wpi.pinMode(25, wpi.modes.OUTPUT); // LSB

    switch (showerPosition){
      case 0: setBinary(0, 0, 0, 0); break;
      case 1: setBinary(0, 0, 0, 1); break;
      case 2: setBinary(0, 0, 1, 0); break;
      case 3: setBinary(0, 0, 1, 1); break;
      case 4: setBinary(0, 1, 0, 0); break;
      case 5: setBinary(0, 1, 0, 1); break;
      case 6: setBinary(0, 1, 1, 0); break;
      case 7: setBinary(0, 1, 1, 1); break;
      case 8: setBinary(1, 0, 0, 0); break;
      case 9: setBinary(1, 0, 0, 1); break;
    }

    console.log(data);
    console.log(data.zones[0].components[0]);
  });

  _socket.on('error', function (data) {
    console.log(data);
  });

  function setBinary (first, second, third, fourth){
    wpi.digitalWrite(18, first);
    wpi.digitalWrite(23, second);
    wpi.digitalWrite(24, third);
    wpi.digitalWrite(25, fourth);
  }
};

exports.activateEmergencyProfile = function (){
  _socket.emit('tinkerbell:system:state:emergency', {});
};

exports.updateComponent = function (update){
  _socket.emit('tinkerbell:system:component:put', update);
};
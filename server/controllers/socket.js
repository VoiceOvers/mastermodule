var app = require('../app'),
    io = require('socket');

exports.impl.initialize = function () {
  io(app.servers.http.getServer(), { path: app.config.jenkins });

  io.on('connection', function (socket) {
    socket.emit('authenticate', {id: 1, access: 'ACCESSTOKEN'});
  });

  io.on('authenticated', function (socket) {

  });
};
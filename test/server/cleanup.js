var app = require('../../server/app');
var _ = require('lodash');
var queue = [];
var user = require('../mocks/mock.user.js');

exports.removeUser = function (id) {
  queue.push(app.models.User.remove({_id: id}));
};

exports.clean = function *() {
  try {
    yield _.map(queue, function (item) {
      return item.exec();
    });
  } catch (e) {
    console.log(e);
  }

  queue = [];
  return;
};

exports.cleanDirtyTestUser = function *() {
  var result = yield app.models.User.remove({'email': 'faker@gmail.com'}).exec();
  return;
}
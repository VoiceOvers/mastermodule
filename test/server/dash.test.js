var app = require('../../server/app');

var  cleanup = require('./cleanup'),
    should = require('should'),
    training = require('../mocks/mock.training.js'),
    user = require('../mocks/mock.user.js'),
    _ = require('lodash');


describe('Dash', function () {

  it('Should Retrieve Data for Dash', function *(done) {
    try {
      var results = yield app.controllers.home.impl.getDashData({_id: user._id});
      results.should.have.property('courses');
      done();
    } catch (e) {
      should.not.exist(e);
    }
  });
});
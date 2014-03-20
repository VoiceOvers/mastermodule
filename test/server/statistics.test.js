var app = require('../../server/app');

var  cleanup = require('./cleanup'),
    should = require('should'),
    training = require('../mocks/mock.training.js'),
    user = require('../mocks/mock.user.js'),
    _ = require('lodash');


describe('Statistics', function () {

  it('Should Retrieve Statistics for Training', function *(done) {
    try {
      var results = yield app.controllers.statistics.impl.trainingStats(training._id, {_id: user._id});
      results.should.have.property('nonStructuredAverages');
      results.should.have.property('structuredAverages');
      done();
    } catch (e) {
      should.not.exist(e);
    }
  });
});

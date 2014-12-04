var app = require('./../app');
var Promise = require('bluebird');
var speech = require('google-speech-api');





exports.impl = {};
exports.impl.interpret = function (){
    return new Promise(function (resolve, reject){
        var opts = {
          file: 'speech.mp3',
          key: app.config.googlespeech.key
        };

        speech(opts, function (err, results) {
          console.log(results);
        });        
    });
};
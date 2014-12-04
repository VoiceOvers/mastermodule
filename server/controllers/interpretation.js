var app = require('./../app');
var Promise = require('bluebird');
var speech = require('google-speech-api');
var path = require('path');





exports.impl = {};
exports.impl.interpret = function (name){
    return new Promise(function (resolve, reject){
        var opts = {
            file: path.join('./server/clips/', name + '.wav'),
            key: app.config.googlespeech.key
        };

        speech(opts, function (err, results) {
            if (err){
                reject(err);
            }
            
            syntaxParser(results[0].result[0].alternative[0].transcript);

        });        
    });
};

function syntaxParser (){

}

function actionPhrase (){

}

function components (){

}

function variableAdjustment (){

}
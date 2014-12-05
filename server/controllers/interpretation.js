var app = require('./../app');
var Promise = require('bluebird');
var speech = require('google-speech-api');
var path = require('path');
var _ = require('lodash');
var socket = require('./../socketio');





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

            if(!results[0]) {
                return resolve();
            }

            var phrase = results[0].result[0].alternative[0].transcript;
            console.log('Parsed Audio Input: %s', phrase);
            var update = new SyntaxParser(phrase)
                .actionPhrase()
                .components()
                .variableAdjustment()
                .value(); 

            switch(update.component){
                case 'emergency profile': 
                    socket.activateEmergencyProfile();
                    break;
                case 'shower':
                    socket.updateComponent();
                    break;
                default:
                    console.log('In the wrong place.');
                    break;
            }
            resolve();
        });        
    });
};

function SyntaxParser (phrase){
    this.actionObject = {
        action: null,
        component: null,
        profile: null,
        newPosition: null
    };
    this.phrase = phrase;

    return this;
}


SyntaxParser.prototype.actionPhrase = function (){
    var phrases = [
        {say: 'turn on', action: true }, 
        {say: 'turn off', action: false}, 
        {say: 'activate', action: true }
    ];

    _.forEach(phrases, function (item){
        var reg = new RegExp(item.say);

        if(reg.test(this.phrase)){
            // Is this a ON / OFF phrase?
            this.actionObject.action = item.action;

            var newString = this.phrase.split(item.say);

            // Remove action phrase from string.
            this.phrase = newString[1];
        }
    }, this);

    return this;

};

SyntaxParser.prototype.components = function (){
    var components = [
        { say: 'shower' },
        { say: 'emergency profile' }
    ];

    _.forEach(components, function (item){
        var reg = new RegExp(item.say);

        if(reg.test(this.phrase)){
            this.actionObject.component = item.say;

            var newString = this.phrase.split(item.say);

            // Remove component phrase
            this.phrase = newString[1];
        }
    }, this);

    return this;
};

SyntaxParser.prototype.variableAdjustment = function (){
    var phrases = [
        'position'
    ];

    if(!this.phrase.length){
        return this;
    }

    // Do variable position interpretation
    _.forEach(phrases, function (item){
        var reg = new RegExp(item);

        if(reg.test(this.phrase)){
            var tempString = this.phrase.split(item)[1];
            var position = parseInt(tempString);
            this.actionObject.newPosition = position;
        }
    }, this);
    return this;
};

SyntaxParser.prototype.value = function (){
    return this.actionObject;
};
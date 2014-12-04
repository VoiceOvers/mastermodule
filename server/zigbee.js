var wpi = require('wiring-pi');

exports.impl.sendUpdate = function (){
    wpi.setup('gpio');
    wpi.wiringPisetupGpio();

    wpi.pinMode(18, wpi.modes.OUTPUT);
    wpi.digitalWrite(18, wpi.HIGH);

    wpi.pinMode(23, wpi.modes.OUTPUT);
    wpi.digitalWrite(23, wpi.HIGH);

    wpi.pinMode(24, wpi.modes.OUTPUT);
    wpi.digitalWrite(24, wpi.HIGH);

};
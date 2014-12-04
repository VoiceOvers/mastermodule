// var wpi = require('wiring-pi');

// exports.impl = {};
// exports.impl.sendUpdate = function (){
//     wpi.setup('gpio');
//     wpi.wiringPiSetupGpio();

//     wpi.pinMode(18, wpi.modes.OUTPUT);
//     wpi.pinMode(23, wpi.modes.OUTPUT);
//     wpi.pinMode(24, wpi.modes.OUTPUT);

//     var setting = wpi.HIGH;
//     setInterval(function (){
//         console.log('WRITING %s', setting);
//         setting = switchSetting(setting);
        
//         wpi.digitalWrite(18, setting);
//         wpi.digitalWrite(23, setting);
//         wpi.digitalWrite(24, setting);
//     }, 5000);


//     function switchSetting(setting){
//         if(setting === wpi.HIGH){
//             return setting = wpi.LOW;
//         } else {
//             return setting = wpi.HIGH;
//         }
//     }
// };
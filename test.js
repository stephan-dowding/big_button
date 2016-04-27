var mraa = require('mraa');
console.log('MRAA Version: ' + mraa.getVersion());
var myOnboardLed = new mraa.Gpio(13);
myOnboardLed.dir(mraa.DIR_OUT);
var ledState = true;
periodicActivity(); //call the periodicActivity function

function periodicActivity()
{
  myOnboardLed.write(ledState?1:0);
  ledState = !ledState;
  setTimeout(periodicActivity,1000);
}

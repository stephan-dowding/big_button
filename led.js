var mraa = require('mraa');
console.log('MRAA Version: ' + mraa.getVersion());
var red = new mraa.Gpio(3);
var green = new mraa.Gpio(4);
var blue = new mraa.Gpio(5);
red.dir(mraa.DIR_OUT);
green.dir(mraa.DIR_OUT);
blue.dir(mraa.DIR_OUT);

exports.alloff = function()
{
  red.write(0);
  green.write(0);
  blue.write(0);
}

exports.setRed = function(on)
{
  red.write(on);
}
exports.setGreen = function(on)
{
  green.write(on);
}
exports.setBlue = function(on)
{
  blue.write(on);
}

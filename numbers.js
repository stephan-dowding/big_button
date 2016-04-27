var mraa = require('mraa');
console.log('MRAA Version: ' + mraa.getVersion());
var SegA = new mraa.Gpio(6);
var SegB = new mraa.Gpio(7);
var SegC = new mraa.Gpio(9);
var SegD = new mraa.Gpio(13);
var SegE = new mraa.Gpio(12);
var SegF = new mraa.Gpio(10);
var SegG = new mraa.Gpio(11);
var SegX = new mraa.Gpio(8);
SegA.dir(mraa.DIR_OUT);
SegB.dir(mraa.DIR_OUT);
SegC.dir(mraa.DIR_OUT);
SegD.dir(mraa.DIR_OUT);
SegE.dir(mraa.DIR_OUT);
SegF.dir(mraa.DIR_OUT);
SegG.dir(mraa.DIR_OUT);
SegX.dir(mraa.DIR_OUT);

exports.display0 = function()
{
  SegA.write(1);
  SegB.write(1);
  SegC.write(1);
  SegD.write(1);
  SegE.write(1);
  SegF.write(1);
  SegG.write(0);
  SegX.write(0);
}

exports.display1 = function()
{
  SegA.write(0);
  SegB.write(1);
  SegC.write(1);
  SegD.write(0);
  SegE.write(0);
  SegF.write(0);
  SegG.write(0);
  SegX.write(0);
}

exports.display2 = function()
{
  SegA.write(1);
  SegB.write(1);
  SegC.write(0);
  SegD.write(1);
  SegE.write(1);
  SegF.write(0);
  SegG.write(1);
  SegX.write(0);
}

exports.display3 = function()
{
  SegA.write(1);
  SegB.write(1);
  SegC.write(1);
  SegD.write(1);
  SegE.write(0);
  SegF.write(0);
  SegG.write(1);
  SegX.write(0);
}

exports.display4 = function()
{
  SegA.write(0);
  SegB.write(1);
  SegC.write(1);
  SegD.write(0);
  SegE.write(0);
  SegF.write(1);
  SegG.write(1);
  SegX.write(0);
}

exports.display5 = function()
{
  SegA.write(1);
  SegB.write(0);
  SegC.write(1);
  SegD.write(1);
  SegE.write(0);
  SegF.write(1);
  SegG.write(1);
  SegX.write(0);
}

exports.display6 = function()
{
  SegA.write(1);
  SegB.write(0);
  SegC.write(1);
  SegD.write(1);
  SegE.write(1);
  SegF.write(1);
  SegG.write(1);
  SegX.write(0);
}

exports.display7 = function()
{
  SegA.write(1);
  SegB.write(1);
  SegC.write(1);
  SegD.write(0);
  SegE.write(0);
  SegF.write(0);
  SegG.write(0);
  SegX.write(0);
}

exports.display8 = function()
{
  SegA.write(1);
  SegB.write(1);
  SegC.write(1);
  SegD.write(1);
  SegE.write(1);
  SegF.write(1);
  SegG.write(1);
  SegX.write(0);
}

exports.display9 = function()
{
  SegA.write(1);
  SegB.write(1);
  SegC.write(1);
  SegD.write(1);
  SegE.write(0);
  SegF.write(1);
  SegG.write(1);
  SegX.write(0);
}

exports.displayClear = function()
{
  SegA.write(0);
  SegB.write(0);
  SegC.write(0);
  SegD.write(0);
  SegE.write(0);
  SegF.write(0);
  SegG.write(0);
  SegX.write(0);
}

exports.displayDot = function()
{
  SegA.write(0);
  SegB.write(0);
  SegC.write(0);
  SegD.write(0);
  SegE.write(0);
  SegF.write(0);
  SegG.write(0);
  SegX.write(1);
}

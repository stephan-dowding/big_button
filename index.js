var numbers = require('./numbers')
var led = require('./led')
var mraa = require('mraa');
var awsIot = require('aws-iot-device-sdk');

var deviceName = "trumpet-edison";
var deviceCredentials = {
  keyPath: '/home/root/aws_certs/private.pem.key',
  certPath: '/home/root/aws_certs/certificate.pem.crt',
  caPath: '/home/root/aws_certs/rootCA.pem.crt',
  clientId: deviceName,
  region: 'ap-southeast-1',
  reconnectPeriod: 1500
};
var mainTopic = "mozart";

numbers.displayDash();

var button = new mraa.Gpio(2); //setup digital read on Digital pin #6 (D6)
button.dir(mraa.DIR_IN);

var currentDigit;
var buttonInterval;
var countInterval;
var butCount;

function readButton()
{
  var buttonState = button.read()
  console.log('Button is: ' + buttonState);
  butCount = buttonState ? butCount + 1 : 0;
  if (butCount >= 3) {
    led.setBlue(1)
    clearInterval(buttonInterval);
    countInterval = setInterval(countUp, 1000);
  }
}

function countUp()
{
  if (!button.read())
  {
    if (currentDigit == 4) disarm();
    else boom();
    console.log('Button Released on: ' + currentDigit);
  }
  else
  {
    currentDigit = (currentDigit+1)%10
    console.log(currentDigit);
    numbers['display' + currentDigit]();
  }
}

var device = awsIot.device(deviceCredentials);

device.subscribe(mainTopic);

function clearAll() {
  if (buttonInterval) clearInterval(buttonInterval);
  if (countInterval) clearInterval(countInterval);
  currentDigit = 0;
  butCount = 0;
  numbers.displayClear();
  led.alloff();
}

function disarm() {
  console.log("Disarm!");
  clearAll();
  led.setGreen(1);
  device.publish(mainTopic, JSON.stringify({ event: 'disarmed', device: deviceName }));
}

function boom() {
  console.log("Boom!");
  clearAll();
  led.setRed(1);
  device.publish(mainTopic, JSON.stringify({ event: 'boom', device: deviceName }));
}

function arm() {
  console.log("Armed!");
  clearAll();
  numbers.displayDot();
  buttonInterval = setInterval(readButton, 100)
  device.publish(mainTopic, JSON.stringify({ event: 'armed', device: deviceName }));
}

function reset() {
  console.log("Reset.");
  clearAll();
  numbers.displayDash();
  currentDigit = 0;
}

function config(data) {
  device.publish(mainTopic, JSON.stringify({ event: "configured", device: deviceName, data: data}))
}

device.on('message', function(topic, payload) {
    console.log('Message Received - Topic: ' + topic + ' Payload: ' + payload.toString());

    payload = JSON.parse(payload);
    switch (payload.event) {
      case "arm":
        arm();
        break;
      case "config":
        if (payload.device === deviceName) {
          config(payload.data);
        }
        break;
      case "reset":
        reset();
        break;
    }
});

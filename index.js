var numbers = require('./numbers')
var led = require('./led')
var mraa = require('mraa');
var awsIot = require('aws-iot-device-sdk');
var ButtonPublisher = require('./ButtonPublisher');

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
var configData = {};

numbers.displayDash();

var button = new mraa.Gpio(2); //setup digital read on Digital pin #6 (D6)
button.dir(mraa.DIR_IN);

var device = awsIot.device(deviceCredentials);
device.subscribe(mainTopic);

function startLoop(configData) {
  var buttonPublisher = new ButtonPublisher();
  var buttonPressed, pressTime, counterInterval, ledTimeout;
  var deviceInterval = setInterval(function () {
    var buttonState = button.read();
    if (buttonState && !buttonPressed) {
      buttonPressed = true;
      pressTime = new Date();
      counterInterval = startCounter();
      ledTimeout = setTimeout(function () {
        led.setRGB(configData.led);
      });
    } else if (buttonPressed) {
      clearTimeout(ledTimeout);
      clearInterval(deviceInterval);
      clearInterval(counterInterval);
      buttonPublisher.publish(pressTime);
    }
  }, 10);

  return buttonPublisher;
}

function startCounter() {
  var digit = 0;
  numbers['display' + digit]();
  return setInterval(function () {
    digit += 1;
    numbers['display' + digit]();
  }, 1000);
}

function clearAll() {
  numbers.displayClear();
  led.alloff();
}

function disarm() {
  console.log("Disarm!");
  led.setGreen(1);
  device.publish(mainTopic, JSON.stringify({ event: 'disarmed', device: deviceName }));
}

function boom() {
  console.log("Boom!");
  led.setRed(1);
  device.publish(mainTopic, JSON.stringify({ event: 'boom', device: deviceName }));
}

function arm() {
  console.log("Armed!");
  clearAll();
  numbers.displayDot();
  var buttonPublisher = startLoop(configData);
  buttonPublisher.subscribe(function (pressDuration) {
    clearAll();
    if (pressDuration === configData.disarmCount) disarm();
    else boom();
  });
  device.publish(mainTopic, JSON.stringify({ event: 'armed', device: deviceName }));
}

function reset() {
  console.log("Reset.");
  clearAll();
}

function config(data) {
  console.log("Config", data)
  configData = data
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

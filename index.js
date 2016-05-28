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

var IDLE = 0;
var PRESSED = 1;
var PROCESSING = 2;

function startLoop(configData) {
  var buttonPublisher = new ButtonPublisher(),
      state = IDLE,
      data = { digit: -1 },
      pressTime, counterInterval;

  var deviceInterval = setInterval(function () {
    if(state === PROCESSING) return;

    var buttonState = button.read();
    if (buttonState && state === IDLE) {
      state = PRESSED;
      counterInterval = startCounter(data);
      led.setRGB(configData.led);
    } else if (!buttonState && state === PRESSED) {
      state = PROCESSING;
      var digit = data.digit;
      setTimeout(function () {
        if (button.read()) {
          state = PRESSED;
        } else {
          clearInterval(deviceInterval);
          clearInterval(counterInterval);
          buttonPublisher.publish(digit);
        }
      }, 300);
    }
  }, 10);

  return buttonPublisher;
}

function startCounter(data) {
  data.digit = -1;
  return setInterval(function () {
    data.digit += 1;
    if (data.digit > 9) { data.digit = 0; }
    numbers['display' + data.digit]();
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
  buttonPublisher.subscribe(function (digit) {
    clearAll();
    if (digit === configData.disarmCount) disarm();
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

function ButtonPublisher() {
  this.listeners = [];
}

ButtonPublisher.prototype.publish = function (pressTime) {
  var pressDuration = (new Date() - pressTime) / 1000;
  pressDuration = Math.floor(pressDuration);
  this.listeners.forEach(function (listener) {
    listener.apply(this, pressDuration);
  }, this);
};

ButtonPublisher.prototype.subscribe = function (fn) {
  this.listeners.push(fn);
};

module.exports = ButtonPublisher;

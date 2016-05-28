function ButtonPublisher() {
  this.listeners = [];
}

ButtonPublisher.prototype.publish = function (digit) {
  this.listeners.forEach(function (listener) {
    listener.call(this, digit);
  }, this);
};

ButtonPublisher.prototype.subscribe = function (fn) {
  this.listeners.push(fn);
};

module.exports = ButtonPublisher;

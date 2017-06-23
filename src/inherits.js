
module.exports = function inherits(sub, sup) {
  sub.prototype = new sup();
  sub.prototype.constructor = sub;
}
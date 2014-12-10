var t = require('tcomb-validation');
var mixin = t.util.mixin;

module.exports = merge;

function merge(a, b) {
  return mixin(mixin({}, a), b, true);
}

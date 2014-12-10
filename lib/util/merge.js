'use strict';

var t = require('tcomb-validation');
var mixin = t.util.mixin;

function merge(a, b) {
  return mixin(mixin({}, a), b, true);
}

module.exports = merge;
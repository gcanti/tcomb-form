'use strict';

var t = require('tcomb-validation');

function either(a, b) {
  return t.Nil.is(a) ? b : a;
}

module.exports = either;
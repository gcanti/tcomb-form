'use strict';

var t = require('tcomb-validation');
var api = require('../api');

module.exports = new api.Transformer({
  format: function (value) {
    return t.Nil.is(value) ? null : value;
  },
  parse: function (value) {
    return value;
  }
});

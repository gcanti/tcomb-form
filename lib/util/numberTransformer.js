'use strict';

var t = require('tcomb-validation');
var api = require('../api');

module.exports = new api.Transformer({
  format: function (value) {
    return t.Nil.is(value) ? value : String(value);
  },
  parse: function (value) {
    if (t.Str.is(value) && value.length > 0 && value[value.length - 1] === '.') { return value; }
    var n = parseFloat(value);
    var isNumeric = (value - n + 1) >= 0;
    return isNumeric ? n : value;
  }
});

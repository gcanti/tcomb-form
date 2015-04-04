'use strict';

var api = require('../api');

module.exports = new api.Transformer({
  format: function (value) {
    return value;
  },
  parse: function (value) {
    return value;
  }
});

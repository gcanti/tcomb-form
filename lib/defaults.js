'use strict';

var t = require('tcomb-validation');
var api = require('./api');

var defaultBundle = new api.Bundle({
  optional: ' (optional)',
  add: 'Add',
  remove: 'Remove',
  up: 'Up',
  down: 'Down'
});

var defaultContext = new api.Context({
  auto: 'placeholders',
  path: [],
  defaultLabel: '',
  bundle: defaultBundle
});

var defaultTransformer = new api.Transformer({
  from: t.Num,
  format: function (value) {
    return t.Nil.is(value) ? value : String(value);
  },
  parse: function (value) {
    var n = parseFloat(value);
    return isNaN(n) ? null : n;
  }
});

module.exports = {
  defaultContext: defaultContext,
  defaultTransformer: defaultTransformer
};
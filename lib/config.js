'use strict';

var api = require('./api');
var t = require('tcomb-validation');

var defaultLocaleBundle = new api.I18n({
  optional: ' (optional)',
  add: 'Add',
  remove: 'Remove',
  up: 'Up',
  down: 'Down'
});

var NumberTransformer = new api.Transformer({
  format: function (value) {
    return t.Nil.is(value) ? value : String(value);
  },
  parse: function (value) {
    var n = parseFloat(value);
    var isNumeric = (value - n + 1) >= 0;
    return isNumeric ? n : value;
  }
});

module.exports = {
  i18n: defaultLocaleBundle,
  transformers: {
    Num: NumberTransformer
  },
  irreducibles: {
    Bool: require('./components/Checkbox')
  }
};
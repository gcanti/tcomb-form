'use strict';

var api = require('./protocols/api');

var i18n = new api.I18n({
  optional: ' (optional)',
  add: 'Add',
  remove: 'Remove',
  up: 'Up',
  down: 'Down'
});

module.exports = {
  i18n: i18n
};
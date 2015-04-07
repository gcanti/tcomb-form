var t = require('./lib');
var templates = require('./lib/templates/bootstrap');

t.form.Form.templates = templates;
t.form.Form.i18n = {
  optional: ' (optional)',
  add: 'Add',
  remove: 'Remove',
  up: 'Up',
  down: 'Down'
};

module.exports = t;
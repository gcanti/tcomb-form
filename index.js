var t = require('./lib');
var templates = require('./lib/skins/bootstrap');
var i18n = require('./lib/i18n/en');

t.form.Form.templates = templates;
t.form.Form.i18n = i18n;

module.exports = t;
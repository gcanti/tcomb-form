var t = require('tcomb-validation');
var components = require('./components');

t.form = components;
t.form.config = t.form.Form;

module.exports = t;
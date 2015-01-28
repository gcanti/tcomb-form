var t = require('tcomb-validation');
var Form = require('./components/Form');
var config = require('./config');
var Radio = require('./components/Radio');
var debug = require('debug');

t.form = {
  Form: Form,
  config: config,
  radio: Radio,
  debug: debug
};

module.exports = t;
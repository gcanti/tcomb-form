var t = require('tcomb-validation');
var config = require('./config');
var Form = require('./components/Form');
var Textbox = require('./components/Textbox');
var Select = require('./components/Select');
var Checkbox = require('./components/Checkbox');
var Radio = require('./components/Radio');
var Struct = require('./components/Struct');
var List = require('./components/List');
var debug = require('debug');

t.form = {
  config: config,
  Form: Form,
  textbox: Textbox,
  select: Select,
  checkbox: Checkbox,
  radio: Radio,
  struct: Struct,
  list: List,
  debug: debug
};

module.exports = t;
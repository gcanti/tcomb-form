'use strict';

var t = require('tcomb-validation');
var create = require('./create');
var config = require('./config');

t.form = {
  create: create,
  config: config
};

module.exports = t;
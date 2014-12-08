'use strict';

var t = require('tcomb-validation');
var create = require('./create');
var config = require('./config');
var factories = require('./factories');

t.form = {
  create: create,
  config: config,
  factories: factories
};

module.exports = t;
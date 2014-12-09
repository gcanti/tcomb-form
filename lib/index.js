'use strict';

var t = require('tcomb-validation');
var create = require('./create');
var config = require('./config');
var factories = require('./factories');

t.form = t.util.mixin({
  create: create,
  config: config
}, factories);

module.exports = t;
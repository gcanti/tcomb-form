'use strict';

var t = require('tcomb-validation');
var getFactory = require('./react');
var defaults = require('./defaults');

// FIXME
require('./bootstrap');

t.form = {
  create: create
};

function create(type, opts) {
  opts = opts || {};
  // [extension point]
  var factory = opts.input || getFactory(type);
  return factory(type, opts, defaults.defaultContext);
}

module.exports = t;
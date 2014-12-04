'use strict';

var t = require('tcomb-validation');
var getFactory = require('./react');
var defaults = require('./defaults');

// FIXME
require('./bootstrap');

t.form = {
  create: create
};

function create(type, options) {
  options = options || {};
  // [extension point]
  var factory = options.input || getFactory(type);
  return factory(type, options, defaults.defaultContext);
}

module.exports = t;
'use strict';

var t = require('tcomb-validation');
var main = require('./lib/main');

// install react plugin
require('./lib/react');

// install bootstrap plugin
require('./lib/bootstrap');

function create(type, options) {
  return main(type, options);
}

t.form = {
  create: create
};

module.exports = t;

'use strict';

var t = require('tcomb-validation');
var toDSL = require('./lib/toDSL');

// install react plugin
require('./lib/react');

// install bootstrap plugin
require('./lib/bootstrap');

function create(type, options) {
  var dsl = toDSL(type, options);
  return dsl.render();
}

t.form = {
  create: create
};

module.exports = t;

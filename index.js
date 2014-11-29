'use strict';

var t = require('tcomb-validation');

// install bootstrap plugin
require('./lib/style/bootstrap');
// install react plugin
require('./lib/render/react');

var toDSL = require('./lib/core');

function create(type, options) {
  var dsl = toDSL(type, options);
  return dsl.render();
}

t.form = {
  toDSL: toDSL,
  create: create
};

module.exports = t;

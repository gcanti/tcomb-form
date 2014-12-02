'use strict';

var t = require('tcomb-validation');
var toDSL = require('./lib/toDSL');

// install react plugin
require('./lib/react');

// install bootstrap plugin
var style = require('./lib/bootstrap');

function create(type, options) {
  var dsl = toDSL(type, options);
  //console.log(JSON.stringify(dsl, null, 2));
  return dsl.render(style);
}

t.form = {
  create: create
};

module.exports = t;

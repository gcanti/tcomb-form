'use strict';

var t = require('tcomb-validation');

function getError(error, state) {
  if (!state.hasError) { return null; }
  return t.Func.is(error) ? error(state.value) : error;
}

module.exports = getError;
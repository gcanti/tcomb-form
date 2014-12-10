var t = require('tcomb-validation');

module.exports = getError;

function getError(error, state) {
  if (!state.hasError) { return null; }
  return t.Func.is(error) ? error(state.value) : error;
}

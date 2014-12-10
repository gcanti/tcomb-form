var t = require('tcomb-validation');

module.exports = either;

function either(a, b) {
  return t.Nil.is(a) ? b : a;
}

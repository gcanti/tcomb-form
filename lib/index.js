'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _t = require('tcomb-validation');

var _t2 = _interopRequireWildcard(_t);

var _import = require('./components');

var components = _interopRequireWildcard(_import);

_t2['default'].form = components;
_t2['default'].form.File = _t2['default'].irreducible('File', function (x) {
  return x instanceof File;
});

module.exports = _t2['default'];
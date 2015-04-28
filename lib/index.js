'use strict';

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === 'object' && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } };

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _t = require('tcomb-validation');

var _t2 = _interopRequireDefault(_t);

var _import = require('./components');

var components = _interopRequireWildcard(_import);

_t2['default'].form = components;
_t2['default'].form.File = _t2['default'].irreducible('File', function (x) {
  return x instanceof File;
});

module.exports = _t2['default'];

var a;
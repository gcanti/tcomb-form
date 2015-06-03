'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcombValidation = require('tcomb-validation');

var _tcombValidation2 = _interopRequireDefault(_tcombValidation);

var _components = require('./components');

var components = _interopRequireWildcard(_components);

_tcombValidation2['default'].form = components;
_tcombValidation2['default'].form.File = _tcombValidation2['default'].irreducible('File', function (x) {
  return x instanceof File;
});

module.exports = _tcombValidation2['default'];
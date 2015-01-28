'use strict';

var t = require('tcomb-validation');
var config = require('./config');

// here requires must be dynamic since there is a circular
// dependency between getComponent and the components
function getComponent(type, options) {
  if (options && options.factory) {
    return options.factory;
  }
  switch (type.meta.kind) {
    case 'irreducible' :
      var name = t.util.getName(type);
      if (t.Func.is(config.irreducibles[name])) {
        return config.irreducibles[name];
      }
      // fallback on textbox
      return require('./components/Textbox');
    case 'struct' :
      return require('./components/Struct');
    case 'enums' :
      return require('./components/Select');
    case 'list' :
      return require('./components/List');
    case 'maybe' :
    case 'subtype' :
      return getComponent(type.meta.type, options);
  }
}

module.exports = getComponent;
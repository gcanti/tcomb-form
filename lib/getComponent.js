'use strict';

var t = require('tcomb-validation');

// here requires must be dynamic since there is a circular
// dependency between getComponent and the components
function getComponent(type, options) {
  if (options && options.factory) {
    return options.factory;
  }
  switch (type.meta.kind) {
    case 'irreducible' :
    return type === t.Bool ?
      require('./components/Checkbox') :
      require('./components/Textbox');
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
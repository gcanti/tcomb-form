'use strict';

var t = require('tcomb-validation');

module.exports = getTypeReport;

function getTypeReport(type) {

  var kind;
  var isMaybe = false;
  var isSubtype = false;

  while (true) {
    kind = t.util.getKind(type);
    if (kind === 'maybe') {
      isMaybe = true;
      type = type.meta.type;
      continue;
    }
    if (kind === 'subtype') {
      isSubtype = true;
      type = type.meta.type;
      continue;
    }
    break;
  }

  return {
    isMaybe: isMaybe,
    isSubtype: isSubtype,
    innerType: type
  };
}


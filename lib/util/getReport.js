'use strict';

var t = require('tcomb-validation');

module.exports = getReport;

function getReport(type) {

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
    last: type
  };
}


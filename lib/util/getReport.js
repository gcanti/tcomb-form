'use strict';

var t = require('tcomb-validation');
var getKind = t.util.getKind;

function getReport(type) {

  var innerType = type;
  var maybe = false;
  var subtype = false;
  var kind;

  while (true) {
    kind = getKind(innerType);
    if (kind === 'maybe') {
      maybe = true;
      innerType = innerType.meta.type;
      continue;
    }
    if (kind === 'subtype') {
      subtype = true;
      innerType = innerType.meta.type;
      continue;
    }
    break;
  }

  return {
    type: type,
    maybe: maybe,
    subtype: subtype,
    innerType: innerType
  };
}

module.exports = getReport;
'use strict';

var t = require('tcomb-validation');

module.exports = getReport;

function getReport(type) {

  var last = type;
  var kind;
  var chain = [];
  var isOptional = false;
  var isList = false;

  while (true) {
    kind = t.util.getKind(last);
    chain.push({
      type: last,
      kind: kind
    });
    if (kind === 'maybe') {
      isOptional = true;
      last = last.meta.type;
      continue;
    }
    if (kind === 'subtype') {
      last = last.meta.type;
      continue;
    }
    if (kind === 'list') {
      if (isList) {
        break;
      }
      last = last.meta.type;
      isList = true;
      continue;
    }
    break;
  }

  return {
    isOptional: isOptional,
    last: last
  };
}


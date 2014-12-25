'use strict';

var t = require('tcomb-validation');

// simplify deepEqual tests
function compact(x) {
  if (Array.isArray(x)) {
    var arr = x.filter(function (y) { return !t.Nil.is(y); }).map(compact);
    var len = arr.length;
    if (len === 0) { return null; }
    if (len === 1) { return arr[0]; }
    return arr;
  } else if (t.Obj.is(x)) {
    var ret = {};
    var y;
    for (var k in x) {
      if (x.hasOwnProperty(k)) {
        if (!t.Nil.is(x[k]) && k !== 'events') {
          y = compact(x[k]);
          if (!t.Nil.is(y)) {
            ret[k] = y;
          }
        }
      }
    }
    return ret;
  }
  return x;
}

module.exports = compact;
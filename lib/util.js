'use strict';

var t = require('tcomb-validation');

function getError(error, value) {
  return t.Func.is(error) ? error(value) : error;
}

function getOptionsOfEnum(type) {
  var enums = type.meta.map;
  return Object.keys(enums).map(function (k) {
    return {
      value: k,
      text: enums[k]
    };
  });
}

function getReport(type) {

  var innerType = type;
  var maybe = false;
  var subtype = false;
  var kind;

  while (true) {
    kind = innerType.meta.kind;
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

// thanks to https://github.com/epeli/underscore.string

function underscored(s){
  return s.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
}

function capitalize(s){
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function humanize(s){
  return capitalize(underscored(s).replace(/_id$/,'').replace(/_/g, ' '));
}

function merge(a, b) {
  return t.mixin(t.mixin({}, a), b, true);
}

function move(arr, fromIndex, toIndex) {
  var element = arr.splice(fromIndex, 1)[0];
  arr.splice(toIndex, 0, element);
  return arr;
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = (c === 'x') ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

module.exports = {
  getError: getError,
  getOptionsOfEnum: getOptionsOfEnum,
  getReport: getReport,
  humanize: humanize,
  merge: merge,
  move: move,
  uuid: uuid
};
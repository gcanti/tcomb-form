'use strict';

exports.__esModule = true;
exports.getOptionsOfEnum = getOptionsOfEnum;
exports.getTypeInfo = getTypeInfo;
exports.humanize = humanize;
exports.merge = merge;
exports.move = move;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _tcombValidation = require('tcomb-validation');

function getOptionsOfEnum(type) {
  var enums = type.meta.map;
  return Object.keys(enums).map(function (value) {
    return {
      value: value,
      text: enums[value]
    };
  });
}

function getTypeInfo(type) {

  var innerType = type;
  var isMaybe = false;
  var isSubtype = false;
  var kind;

  while (innerType) {
    kind = innerType.meta.kind;
    if (kind === 'maybe') {
      isMaybe = true;
      innerType = innerType.meta.type;
      continue;
    }
    if (kind === 'subtype') {
      isSubtype = true;
      innerType = innerType.meta.type;
      continue;
    }
    break;
  }

  return {
    isMaybe: isMaybe,
    isSubtype: isSubtype,
    innerType: innerType
  };
}

// thanks to https://github.com/epeli/underscore.string

function underscored(s) {
  return s.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function humanize(s) {
  return capitalize(underscored(s).replace(/_id$/, '').replace(/_/g, ' '));
}

function merge(a, b) {
  return (0, _tcombValidation.mixin)((0, _tcombValidation.mixin)({}, a), b, true);
}

function move(arr, fromIndex, toIndex) {
  var element = arr.splice(fromIndex, 1)[0];
  arr.splice(toIndex, 0, element);
  return arr;
}

var UIDGenerator = (function () {
  function UIDGenerator(seed) {
    _classCallCheck(this, UIDGenerator);

    this.seed = seed;
    this.counter = 0;
  }

  UIDGenerator.prototype.next = function next() {
    return this.seed + this.counter++;
  };

  return UIDGenerator;
})();

exports.UIDGenerator = UIDGenerator;
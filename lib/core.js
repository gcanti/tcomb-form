'use strict';

var t = require('tcomb-validation');
var dsl = require('./dsl');
var humanize = require('./humanize');
var getNameAttribute = require('./getNameAttribute');
var mixin = t.util.mixin;

module.exports = toDSL;

function toDSL(type, options) {

  // add defaults preserving the original
  // since `toDSL` is a public API
  options = mixin({}, options);
  options._type = type;
  options._path = options._path || [];
  options._ref = options._ref || '';

  return _toDSL(type, options);
}

function _toDSL(type, options) {

  // hook for extensions
  if (options.input) {
    return options.input(type, options);
  }

  // every kind has a specialized handler..
  var kind = t.util.getKind(type);
  if (kinds.hasOwnProperty(kind)) {
    return kinds[kind](type, options);
  }

  t.fail(t.util.format('Kind `%s` is not supported', kind));
}

var kinds = {};

kinds.irriducible = function (type, options) {
  if (type === t.Bool) {
    // a checkbox must always have a label
    options.label = options.label || humanize(options._ref);
    return new dsl.Checkbox(options, true);
  }
  // ensure the default `type` attribute
  options.type = options.type || 'text';
  return new dsl.Textbox(options, true);
};

kinds.struct = function (type, options) {

  var props = type.meta.props;

  // add defaults
  if (options.auto !== 'none') {
    options.label = options.label || humanize(options._ref);
  }
  options.order = options.order || Object.keys(props);
  options.fields = options.fields || {};

  // build fields
  options.fields = options.order.map(function (k) {
    if (props.hasOwnProperty(k)) {

      // prepare field options preserving the original
      var field = mixin({
        _type: props[k],
        _path: options._path.concat(k),
        _ref: k
      }, options.fields[k]);
      field.name = field.name || getNameAttribute(field._path);
      field.auto =  field.auto || options.auto;
      if (field.auto === 'labels') {
        field.label = field.label || humanize(field._ref);
      }
      if (!field.label) { // labels have priority over placeholders
        field.placeholder = field.placeholder || humanize(field._ref);
      }
      return _toDSL(field._type, field);
    } else {
      // the user wants a "verbatim" here
      return new dsl.Verbatim({verbatim: k});
    }
  });

  return new dsl.Fieldset(options);
};

kinds.list = function (type, options) {
  throw new Error('not implemented');
};


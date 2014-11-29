'use strict';

var t = require('tcomb-validation');
var dsl = require('./dsl');
var humanize = require('./humanize');
var getNameAttribute = require('./getNameAttribute');
var mixin = t.util.mixin;

module.exports = toDSL;

function toDSL(type, options) {

  options = mixin({}, options);
  options._type = type;
  options._path = options._path || [];
  options.auto = options.auto || 'placeholders';

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
  var field;

  // add defaults
  if (options.auto !== 'none' && !options.label && options._ref) {
    options.label = humanize(options._ref);
  }
  options.order = options.order || Object.keys(props);
  options.fields = options.fields || {};
  options.value = options.value || {};

  // build fields
  options.fields = options.order.map(function (k) {
    if (props.hasOwnProperty(k)) {

      // prepare field options preserving the original
      field = mixin({
        _type: props[k],
      }, options.fields[k]);
      field._path = options._path.concat(k);
      field._ref =  getNameAttribute(field._path);
      field.name =  field.name || field._ref;
      field.auto =  field.auto || options.auto;
      field.value = either(field.value, options.value[k]);
      if (field.auto === 'labels') {
        field.label = field.label || humanize(k);
      }
      if (!field.label) { // labels have priority over placeholders
        field.placeholder = field.placeholder || humanize(k);
      }
      return _toDSL(field._type, field);
    } else {
      // the user wants a "verbatim" here
      return new dsl.Verbatim({verbatim: k});
    }
  });

  return new dsl.Fieldset(options);
};

kinds.enums = function (type, options) {

  options.options = options.options || Object.keys(type.meta.map).map(function (k) {
    return {
      value: k,
      text: type.meta.map[k]
    };
  });

  // sort options
  if (options.order) {
    options.options.sort(dsl.Order.meta.map[options.order]);
  }

  // add an empty choice in first position
  if (options.emptyOption) {
    options.options.unshift(options.emptyOption);
  }

  return new dsl.Select(options, true);
};

function either(a, b) {
  return t.Nil.is(a) ? b : a;
}

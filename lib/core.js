'use strict';

var t = require('tcomb-validation');
var dsl = require('./dsl');
var humanize = require('./humanize');
var getNameAttribute = require('./getNameAttribute');
var mixin = t.util.mixin;
var getKind = t.util.getKind;

module.exports = toDSL;

function toDSL(type, options) {

  options = mixin({}, options);
  options._type = type;
  options._path = options._path || [];
  options.auto = options.auto || 'placeholders';

  return process(options);
}

function process(options) {

  // hook for extensions
  if (options.input) {
    return options.input(options._type, options);
  }

  options._innerType = options._innerType || options._type;

  var kind = getKind(options._type);
  if (kinds.hasOwnProperty(kind)) {
    return kinds[kind](options);
  }

  t.fail(t.util.format('Kind `%s` is not supported', kind));
}

var kinds = {};

kinds.maybe = kinds.subtype = function (options) {
  options._innerType = options._type.meta.type;
  var kind = getKind(options._innerType);
  return kinds[kind](options);
};

kinds.irriducible = function (options) {
  return options._innerType === t.Bool ?
    checkbox(options) :
    textbox(options);
};

function checkbox(options) {

  // a checkbox must always have a label
  addLabel(options, true);

  return new dsl.Checkbox(options); // immmutable
}

function textbox(options) {

  // ensure the default `type` attribute
  options.type = options.type || 'text';

  addLabel(options);
  addPlaceholder(options);

  return new dsl.Textbox(options); // immmutable
}

kinds.enums = function (options) {

  var map = options._innerType.meta.map;

  addLabel(options);

  options.options = options.options || Object.keys(map).map(function (k) {
    return {
      value: k,
      text: map[k]
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

  return options.as === 'radio' ?
    new dsl.Radio(options) : // immmutable
    new dsl.Select(options); // immmutable
};

kinds.struct = function (options) {

  // FIXME
  t.assert(getKind(options._type) !== 'maybe', 'maybe structs are not allowed, check the `%s` field', options._ref);

  var props = options._innerType.meta.props;

  // a sub struct must always have a label unless auto = 'none'
  addLabel(options, options.auto !== 'none');
  options.order = options.order || Object.keys(props);
  options.fields = options.fields || {};
  options.value = options.value || {};

  var field, path, name;
  options.fields = options.order.map(function getField(k) {
    if (props.hasOwnProperty(k)) {

      // prepare field options preserving the original
      path = options._path.concat(k);
      name = getNameAttribute(path);
      field = {
        _type:  props[k],
        _path:  path,
        _ref:   k,
        name:   name,
        auto:   options.auto,
        value:  options.value[k]
      };
      mixin(field, options.fields[k], true);
      return process(field);
    } else {
      // the user wants a "verbatim" here
      return new dsl.Verbatim({verbatim: k});
    }
  });

  return new dsl.Struct(options);
};

kinds.list = function (options) {

  // FIXME
  t.assert(getKind(options._type) !== 'maybe', 'maybe lists are not allowed, check the `%s` field', options._ref);

  // a sub list must always have a label unless auto = 'none'
  addLabel(options, options.auto !== 'none');
  options._innerType = options._type.meta.type;
  options.value = options.value || [];
  var row, path, name;
  options.rows = options.value.map(function (value, i) {

    // prepare row options preserving the original
    path = options._path.concat(i);
    name = getNameAttribute(path);
    row = {
      _type:  options._innerType,
      _path:  path,
      _ref:   i + '',
      name:   name,
      auto:   options.auto,
      value:  value
    };
    mixin(row, options.item, true);
    return new dsl.ListRow({dsl: process(row)});
  });

  return new dsl.List(options); // immmutable
};

// FIXME
var optionalLabel = ' (optional)';

function addLabel(options, force) {
  var should = (options.auto === 'labels') && !options.label;
  if ((should || force) && options._ref) {
    options.label = humanize(options._ref);
  }
  // handle optional
  if (options.label && getKind(options._type) === 'maybe') {
    options.label += optionalLabel;
  }
}

function addPlaceholder(options) {
  if (!options.label && !options.placeholder && options._ref) {
    options.placeholder = humanize(options._ref);
  }
  // handle optional
  if (options.placeholder && getKind(options._type) === 'maybe') {
    options.placeholder += optionalLabel;
  }
}

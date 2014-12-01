'use strict';

var t = require('tcomb-validation');
var dsl = require('./dsl');
var humanize = require('./humanize');
var getNameAttribute = require('./getNameAttribute');
var mixin = t.util.mixin;
var getKind = t.util.getKind;

module.exports = toDSL;

function deepFreeze(x) {
  if (t.Obj.is(x)) {
    Object.freeze(x);
    for (var k in x) {
      if (x.hasOwnProperty(k)) {
        deepFreeze(x[k]);
      }
    }
  } else if (t.Arr.is(x)) {
    Object.freeze(x);
    x.forEach(deepFreeze);
  }
  return x;
}

function toDSL(type, options) {

  // FIXME
  deepFreeze(options);
  options = mixin({}, options);
  options.outerType = type;
  options.path = [];

  return process(options);
}

function process(options) {

  var kind = options.outerKind = getKind(options.outerType);
  options.innerType = options.outerType;
  options.innerKind = kind;
  if (kinds.hasOwnProperty(kind)) {
    return kinds[kind](options);
  }

  t.fail(t.util.format('Kind `%s` is not supported', kind));
}

var kinds = {};

kinds.maybe = kinds.subtype = function (options) {

  options.innerType = options.outerType.meta.type;
  var kind = options.innerKind = getKind(options.innerType);
  if (kinds.hasOwnProperty(kind)) {
    return kinds[kind](options);
  }

  t.fail(t.util.format('Kind `%s` is not supported', kind));
};

kinds.irriducible = function (options) {
  return options.innerType === t.Bool ?
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

  var map = options.innerType.meta.map;

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

  // FIXME handle subtypes
  t.assert(options.outerKind === 'struct', 'maybe structs are not allowed, check the `%s` field', options.ref);

  var props = options.innerType.meta.props;

  // a sub struct must always have a label unless auto = 'none'
  addLabel(options, options.auto !== 'none');

  options.order = options.order || Object.keys(props);
  options.fields = options.fields || {};
  options.value = options.value || {};

  var row, path;
  options.rows = options.order.map(function getRow(k) {
    if (props.hasOwnProperty(k)) {

      // prepare row options preserving the original
      path = options.path.concat(k);
      row = mixin({}, options.fields[k]);
      row.outerType = props[k];
      row.path = path;
      row.ref = k;
      row.name = row.name || getNameAttribute(path);
      row.auto = options.auto;
      row.value = either(row.value, options.value[k]);

      return process(row);
    } else {
      // the user wants a "verbatim" here
      return new dsl.Verbatim({verbatim: k});
    }
  });

  return new dsl.Struct(options);
};

kinds.list = function (options) {

  // FIXME handle subtypes
  t.assert(options.outerKind === 'list', 'maybe lists are not allowed, check the `%s` field', options.ref);

  options.innerType = options.outerType.meta.type;

  // a sub list must always have a label unless auto = 'none'
  addLabel(options, options.auto !== 'none');

  options.value = options.value || [];

  // FIXME button caption
  if (!options.disableAdd) {
    options.add = new dsl.Button({caption: 'Add'});
  }

  var item, path;
  options.rows = options.value.map(function getRow(value, i) {

    // prepare input options preserving the original
    path = options.path.concat(i);
    item = mixin({}, options.item);
    item.outerType = options.innerType;
    item.path = path;
    item.ref = String(i);
    item.name = item.name || getNameAttribute(path);
    item.auto = options.auto;
    item.value = value;

    // FIXME buttons caption
    return new dsl.ListRow({
      item: process(item),
      remove: options.disableRemove ? null : new dsl.Button({caption: 'Remove'}),
      up: options.disableOrder ? null : new dsl.Button({caption: 'Up'}),
      down: options.disableOrder ? null : new dsl.Button({caption: 'Down'})
    });
  });

  return new dsl.List(options); // immmutable
};

// FIXME
var optionalLabel = ' (optional)';

function addLabel(options, force) {
  var should = (options.auto === 'labels') && !options.label;
  if ((should || force) && options.ref) {
    options.label = humanize(options.ref);
  }
  // handle optional
  if (options.label && options.outerKind === 'maybe') {
    options.label += optionalLabel;
  }
}

function addPlaceholder(options) {
  if (!options.label && !options.placeholder && options.ref) {
    options.placeholder = humanize(options.ref);
  }
  // handle optional
  if (options.placeholder && options.outerKind === 'maybe') {
    options.placeholder += optionalLabel;
  }
}

function either(a, b) {
  return t.Nil.is(a) ? b : a;
}

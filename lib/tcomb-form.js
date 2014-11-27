'use strict';

var t = require('tcomb-validation');
var dsl = require('./dsl');
var humanize = require('./humanize');

t.form = {
  create: create
};

module.exports = t;

function create(type, options) {
  type = t.Type(type);
  var kind = t.util.getKind(type);
  switch (kind) {
    case 'struct' :
      return handleStruct(type, options);
    case 'list' :
      return handleList(type, options);
    case 'irriducible' :
      return handleIrriducible(type, options);
    default :
      t.fail(t.util.format('Kind %s not handled', kind));
  }
}

function handleStruct(type, options) {
  options = options || {};
  var props = type.meta.props;
  // if the `order` option is not specified, defaulted to Object.keys
  var order = options.order || Object.keys(props);
  var ret = order.map(function (x) {
    if (props.hasOwnProperty(x)) {
      return create(props[x], getSubOptions(x, options));
    } else {
      // the user wants to insert in the form a `verbatim` at this place
      return x;
    }
  });
  return ret;
}

function getSubOptions(x, options) {
  options.fields = options.fields || {};
  var opts = options.fields[x] || {};
  var placeholder = humanize(x);
  // placeholder
  opts.placeholder = opts.placeholder || placeholder;
  // label
  opts.label = opts.label || placeholder;
  return opts;
}

function handleList(type, options) {
  throw new Error('not implemented');
}

function handleIrriducible(type, options) {
  options = options || {};
  if (type === t.Bool) {
    return handleCheckbox(options);
  }
  return handleTextbox(type, options);
}

function handleCheckbox(options) {
  return new dsl.Checkbox({
    label: options.label
  });
}

function handleTextbox(type, options) {
  return new dsl.Textbox({
    label: options.label,
    input: {
      type: options.type || 'text',
      placeholder: options.placeholder
    }
  });
}

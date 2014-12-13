'use strict';

//==================
// WORK IN PROGRESS
//==================

var theme = require('../protocols/theme');

function getHiddenTextbox(locals) {
  return {
    tag: 'input',
    attrs: {
      type: 'hidden',
      defaultValue: locals.value,
      name: locals.name,
      ref: locals.ref
    }
  };
}

function getLabel(label) {
  if (!label) { return; }
  return {
    tag: 'label',
    children: label
  };
}

function getFormGroup(opts) {
  return {
    tag: 'div',
    attrs: {
      className: {
        'has-error': opts.hasError
      }
    },
    children: opts.children
  };
}

function getOption(opts) {
  return {
    tag: 'option',
    attrs: {
      disabled: opts.disabled,
      value: opts.value
    },
    children: opts.text,
    key: opts.value
  };
}

function getOptGroup(opts) {
  return {
    tag: 'optgroup',
    attrs: {
      disabled: opts.disabled,
      label: opts.label
    },
    children: opts.options.map(getOption),
    key: opts.label
  };
}

function textbox(locals) {

  var type = locals.type;

  if (locals.type === 'hidden') {
    return getHiddenTextbox(locals);
  }

  var attrs = {
    name: locals.name,
    type: (type === 'textarea') ? null : type,
    placeholder: locals.placeholder,
    defaultValue: locals.value,
    readOnly: locals.readOnly,
    disabled: locals.disabled,
    ref: locals.ref
  };

  var control = {
    tag: (type === 'textarea') ? 'textarea' : 'input',
    attrs: attrs
  };

  return getFormGroup({
    hasError: locals.hasError,
    children: [
      getLabel(locals.label),
      control
    ]
  });
}

function checkbox() {
  throw new Error('checkboxes are not implemented (yet)');
}

function select(locals) {

  var options = locals.options.map(function (x) {
    return theme.Option.is(x) ? getOption(x) : getOptGroup(x);
  });

  var control = {
    tag: 'select',
    attrs: {
      name: locals.name,
      defaultValue: locals.defaultValue,
      value: locals.value,
      disabled: locals.disabled
    },
    children: options,
    ref: locals.ref
  };

  return getFormGroup({
    hasError: locals.hasError,
    children: [
      getLabel(locals.label),
      control
    ]
  });
}

function radio() {
  throw new Error('radios are not implemented (yet)');
}

function struct() {
  throw new Error('In grid forms you must write a custom template for structs');
}

function list() {
  throw new Error('lists are not implemented (yet)');
}

module.exports = {
  name: 'gridforms',
  textbox: textbox,
  checkbox: checkbox,
  select: select,
  radio: radio,
  struct: struct,
  list: list
};

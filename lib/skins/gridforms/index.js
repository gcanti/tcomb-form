'use strict';

//==================
// WORK IN PROGRESS: contributions and PR are welcomed
//==================

var skin = require('../../skin');

function getHiddenTextbox(locals) {
  return {
    tag: 'input',
    attrs: {
      type: 'hidden',
      value: locals.value,
      name: locals.name
    },
    events: {
      change: function (evt) {
        locals.onChange(evt.target.value);
      }
    }
  };
}

function getLabel(locals) {
  if (!locals.label) { return; }
  return {
    tag: 'label',
    attrs: {
      htmlFor: locals.id
    },
    children: locals.label
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
    value: locals.value,
    disabled: locals.disabled,
    id: locals.id,
    type: (type === 'textarea') ? null : type,
    placeholder: locals.placeholder
  };

  var control = {
    tag: (type === 'textarea') ? 'textarea' : 'input',
    attrs: attrs,
    events: {
      change: function (evt) {
        locals.onChange(evt.target.value);
      }
    }
  };

  return getFormGroup({
    hasError: locals.hasError,
    children: [
      getLabel(locals),
      control
    ]
  });
}

function checkbox() {
  throw new Error('checkboxes are not (yet) supported');
}

function select(locals) {

  var options = locals.options.map(function (x) {
    return skin.Option.is(x) ? getOption(x) : getOptGroup(x);
  });

  function onChange(evt) {
    var value = locals.multiple ?
      evt.target.options.filter(function (option) {
        return option.selected;
      }).map(function (option) {
        return option.value;
      }) :
      evt.target.value;
    locals.onChange(value);
  }

  var control = {
    tag: 'select',
    attrs: {
      disabled: locals.disabled,
      id: locals.id,
      name: locals.name,
      value: locals.value
    },
    children: options,
    events: {
      change: onChange
    }
  };

  return getFormGroup({
    hasError: locals.hasError,
    children: [
      getLabel(locals),
      control
    ]
  });
}

function radio() {
  throw new Error('radios are not (yet) supported');
}

function struct() {
  throw new Error('In grid forms you must write a custom template for structs');
}

function list() {
  throw new Error('lists are not (yet) supported');
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

'use strict';

//==================
// WORK IN PROGRESS
//==================

function getLabel(label) {
  if (!label) { return; }
  return {
    tag: 'span',
    attrs: {
      className: {
        'input-label': true
      }
    },
    children: label
  };
}

function textbox(locals) {

  return {
    tag: 'label',
    attrs: {
      className: {
        'item': true,
        'item-input': true,
        'item-stacked-label': !!locals.label,
        'has-error': locals.hasError
      }
    },
    children: [
      getLabel(locals.label),
      {
        tag: 'input',
        attrs: {
          type: locals.type,
          placeholder: locals.placeholder
        },
        ref: locals.ref
      }
    ]
  };

}

function checkbox() {
  throw new Error('checkboxes are not implemented (yet)');
}

function select(locals) {
  throw new Error('selects are not implemented (yet)');
}

function radio() {
  throw new Error('radios are not implemented (yet)');
}

function struct(locals) {

  var rows = locals.order.map(function (name) {
    return locals.inputs.hasOwnProperty(name) ? locals.inputs[name] : name;
  });

  return {
    tag: 'div',
    attrs: {
      className: {
        'list': true
      }
    },
    children: rows
  };
}

function list() {
  throw new Error('lists are not implemented (yet)');
}

module.exports = {
  textbox: textbox,
  checkbox: checkbox,
  select: select,
  radio: radio,
  struct: struct,
  list: list
};

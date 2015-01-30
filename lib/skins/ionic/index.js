'use strict';

//==================
// WORK IN PROGRESS:
// contributions and PR are welcomed
//==================

function getInputLabel(label) {
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
      getInputLabel(locals.label),
      {
        tag: 'input',
        attrs: {
          id: locals.id,
          placeholder: locals.placeholder,
          type: locals.type
        },
        events: {
          change: function (evt) {
            locals.onChange(evt.target.value);
          }
        }
      }
    ]
  };

}

function checkbox(locals) {

  return {
    tag: 'label',
    attrs: {
      className: {
        'item': true,
        'item-checkbox': true,
        'has-error': locals.hasError
      }
    },
    children: [
      {
        tag: 'label',
        attrs: {
          className: {'checkbox': true}
        },
        children: {
          tag: 'input',
          attrs: {
            type: 'checkbox',
            id: locals.id
          },
          events: {
            change: function (evt) {
              locals.onChange(evt.target.checked);
            }
          }
        }
      },
      getInputLabel(locals.label),
    ]
  };
}

function select() {
  throw new Error('selects are not (yet) supported');
}

function radio() {
  throw new Error('radios are not (yet) supported');
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
  throw new Error('lists are not (yet) supported');
}

module.exports = {
  name: 'ionic',
  textbox: textbox,
  checkbox: checkbox,
  select: select,
  radio: radio,
  struct: struct,
  list: list
};

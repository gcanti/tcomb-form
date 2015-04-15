'use strict';

//==================
// WORK IN PROGRESS:
// contributions and PR are welcome
//==================

function getAlert(type, children) {
  var className = {
    ui: true,
    message: true
  };
  className[type] = true;
  return {
    tag: 'div',
    attrs: { className: className },
    children: children
  };
}

function textbox() {
  throw new Error('textboxes are not (yet) supported');
}

function checkbox() {
  throw new Error('checkboxes are not (yet) supported');
}

function select() {
  throw new Error('selects are not (yet) supported');
}

function radio() {
  throw new Error('radios are not (yet) supported');
}

function date() {

}

function struct(locals) {

  var rows = [];

  if (locals.help) {
    rows.push(getAlert('info', locals.error));
  }

  if (locals.error && locals.hasError) {
    rows.push(getAlert('error', locals.error));
  }

}

function list() {
  throw new Error('lists are not (yet) supported');
}

module.exports = {
  name: 'semanticui',
  textbox: textbox,
  checkbox: checkbox,
  select: select,
  radio: radio,
  date: date,
  struct: struct,
  list: list
};
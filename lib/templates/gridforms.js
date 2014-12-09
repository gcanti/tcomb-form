'use strict';

//==================
// WORK IN PROGRESS
//==================

var React = require('react');
var cx = require('react/lib/cx');
var util = require('./util');

module.exports = {
  textbox: textbox,
  checkbox: checkbox,
  select: select,
  radio: radio,
  struct: struct,
  list: list
};

function textbox(locals) {

  var type = locals.type;

  if (locals.type === 'hidden') {
    return util.getHiddenTextbox(locals);
  }

  var textbox = util.getTextbox(locals);

  return (
    <div className={cx({'has-error': locals.hasError})}>
      <label>{locals.label}</label>
      {textbox}
    </div>
  );
}

function checkbox(locals) {
  throw new Error('checkboxes are not implemented (yet)');
}

function select(locals) {

  var select = util.getSelect(locals);

  return (
    <div className={cx({'has-error': locals.hasError})}>
      <label>{locals.label}</label>
      {select}
    </div>
  );
}

function radio(locals) {
  throw new Error('radios are not implemented (yet)');
}

function struct(locals) {
  throw new Error('In grid forms you must write a custom template for structs');
}

function list(locals) {
  throw new Error('lists are not implemented (yet)');
}

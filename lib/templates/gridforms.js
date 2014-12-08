'use strict';

//==================
// WORK IN PROGRESS
//==================

var React = require('react');
var style = require('../protocols/style');
var cx = require('react/lib/cx');
var util = require('./util');

module.exports = {

  name: 'gridforms',

  textbox: textbox,
  checkbox: checkbox,
  select: select,
  radio: radio,
  struct: struct,
  list: list
};

function textbox(locals) {

  var type = locals.type;

  if (type === 'hidden') {
    return <input
      type="hidden"
      name={locals.name}
      defaultValue={locals.value}
      ref={locals.ref}/>;
  }

  var control = util.getTextbox(locals);

  return (
    <div>
      <label className={cx({'has-error': locals.hasError})}>{locals.label}</label>
      {control}
    </div>
  );
}

function checkbox(locals) {
  throw new Error('checkboxes are not implemented (yet)');
}

function select(locals) {

  var control = util.getSelect(locals);

  return (
    <div>
      <label className={cx({'has-error': locals.hasError})}>{locals.label}</label>
      {control}
    </div>
  );
}

function radio(locals) {
  throw new Error('radios are not implemented (yet)');
}

function struct(locals) {
  throw new Error('In grid forms you must write a custom  for structs');
}

function list(locals) {
  throw new Error('lists are not implemented (yet)');
}

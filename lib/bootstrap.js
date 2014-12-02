'use strict';

//==============
// dsl -> UVDOM
//==============

var bootstrap = require('uvdom-bootstrap');

module.exports = {
  textbox: textbox,
  checkbox: checkbox,
  select: select,
  radio: radio,
  fieldset: fieldset
};

function textbox(dsl) {

  var options = {
    ref: 'input',
    type: dsl.attrs.type,
    name: dsl.attrs.name,
    defaultValue: dsl.attrs.defaultValue,
    placeholder: dsl.attrs.placeholder,
    label: dsl.label,
    help: dsl.help,
    hasError: dsl.hasError,
    error: dsl.hasError ? dsl.error : null,
    wrap: true
  };

  return new bootstrap.Textbox(options).render();
}

function checkbox(dsl) {

  var options = {
    ref: 'input',
    name: dsl.name,
    defaultChecked: dsl.value,
    label: dsl.label,
    help: dsl.help,
    hasError: dsl.hasError,
    error: dsl.hasError ? dsl.error : null
  };

  return new bootstrap.Checkbox(options).render();
}

function select(dsl) {

  var options = {
    ref: 'input',
    name: dsl.name,
    defaultValue: dsl.value,
    label: dsl.label,
    help: dsl.help,
    hasError: dsl.hasError,
    error: dsl.hasError ? dsl.error : null,
    options: dsl.options,
    wrap: true
  };

  return new bootstrap.Select(options).render();
}

function radio(dsl) {

  var options = {
    ref: 'input',
    name: dsl.name,
    defaultValue: dsl.value,
    label: dsl.label,
    help: dsl.help,
    hasError: dsl.hasError,
    error: dsl.hasError ? dsl.error : null,
    options: dsl.options,
    wrap: true
  };

  return new bootstrap.Radio(options).render();
}

function fieldset(label, rows) {

  var options = {
    label: label,
    rows: rows
  };

  return new bootstrap.Fieldset(options).render();
}
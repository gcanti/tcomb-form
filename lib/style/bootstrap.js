'use strict';

//
// Bootstrap css framework plugin
//

var t = require('tcomb-validation');
var bootstrap = require('uvdom-bootstrap');
var dsl = require('../dsl');

dsl.Verbatim.prototype.toUVDOM = function () {
  return this.verbatim;
};

dsl.Textbox.prototype.toUVDOM = function () {
  var options = {
    ref: this._ref,
    type: this.type,
    name: this.name,
    defaultValue: this.value,
    placeholder: this.placeholder,
    label: this.label,
    help: this.help,
    hasError: this.hasError,
    error: this.hasError ? this.message : null,
    wrap: true
  };
  return new bootstrap.Textbox(options).render();
};

dsl.Checkbox.prototype.toUVDOM = function () {
  var options = {
    ref: this._ref,
    name: this.name,
    defaultChecked: this.value,
    label: this.label,
    help: this.help,
    hasError: this.hasError,
    error: this.hasError ? this.message : null,
  };
  return new bootstrap.Checkbox(options).render();
};

dsl.Select.prototype.toUVDOM = function () {
  var options = {
    ref: this._ref,
    name: this.name,
    defaultValue: this.value,
    options: this.options,
    label: this.label,
    help: this.help,
    hasError: this.hasError,
    error: this.hasError ? this.message : null,
    wrap: true
  };
  return new bootstrap.Select(options).render();
};

dsl.Radio.prototype.toUVDOM = function () {
  var options = {
    ref: this._ref,
    name: this.name,
    defaultValue: this.value,
    options: this.options,
    label: this.label,
    help: this.help,
    hasError: this.hasError,
    error: this.hasError ? this.message : null,
    wrap: true
  };
  return new bootstrap.Radio(options).render();
};

dsl.Struct.prototype.toUVDOM = function (fields) {
  if (t.Nil.is(fields)) {
    fields = this.fields.map(function (field) {
      return field.toUVDOM();
    });
  }
  var options = {
    label: this.label,
    fields: fields
  };
  return new bootstrap.Fieldset(options).render();
};

dsl.List.prototype.toUVDOM = function () {
  var options = {
    label: this.label
  };
  var uvdom = {
    tag: 'div',
    children: 'list...'
  };
  return uvdom;
};

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
    ref: this.ref,
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
    ref: this.ref,
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
    ref: this.ref,
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
    ref: this.ref,
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

dsl.Struct.prototype.toUVDOM = function (rows) {

  if (t.Nil.is(rows)) {
    rows = this.rows.map(function (field) {
      return field.toUVDOM();
    });
  }

  var options = {
    label: this.label,
    rows: rows
  };

  return new bootstrap.Fieldset(options).render();
};

dsl.List.prototype.toUVDOM = function (rows) {

  if (t.Nil.is(rows)) {
    rows = this.rows.map(function (row) {
      return row.toUVDOM();
    });
  }

  if (this.add) {
    rows.push(
      bootstrap.getFormGroup(
        this.add.toUVDOM()
      )
    );
  }

  var options = {
    label: this.label,
    rows: rows
  };

  return new bootstrap.Fieldset(options).render();
};

dsl.Button.prototype.toUVDOM = function () {

  var options = {
    caption: this.caption,
    click: this.click
  };

  return new bootstrap.Button(options).render();
};

dsl.ListRow.prototype.toUVDOM = function (item) {

  var buttons = [];
  if (this.remove) {
    buttons.push(this.remove);
  }
  if (this.up) {
    buttons.push(this.up);
  }
  if (this.down) {
    buttons.push(this.down);
  }

  item = item || this.item.toUVDOM();

  if (!buttons.length) {
    return item;
  }

  return {
    tag: 'div',
    attrs: {
      className: {
        row: true
      }
    },
    children: [
      {
        tag: 'div',
        attrs: {
          className: {
            'col-md-7': true
          }
        },
        children: item
      },
      {
        tag: 'div',
        attrs: {
          className: {
            'col-md-5': true
          }
        },
        children: new bootstrap.ButtonGroup({buttons: buttons}).render()
      }
    ]
  };
};

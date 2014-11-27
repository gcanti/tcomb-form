'use strict';

var dsl = require('../dsl');

function addFormGroup(children) {
  return {
    tag: 'div',
    attrs: {className: {'form-group': true}},
    children: children
  }
}

dsl.Textbox.prototype.toUVDOM = function () {
  var input = {
    tag: 'input',
    attrs: {
      type: this.input.type,
      placeholder: this.input.placeholder,
      className: {'form-control': true}
    }
  };
  // label
  if (this.label) {
    input = [
      {
        tag: 'label',
        children: this.label
      },
      input
    ];
  }
  // form group
  input = addFormGroup(input);
  return input;
};

dsl.Checkbox.prototype.toUVDOM = function () {
  var input = {
    tag: 'input',
    attrs: {
      type: 'checkbox'
    }
  };
  // label
  if (this.label) {
    input = {
      tag: 'label',
      children: [
        input,
        ' ',
        {
          tag: 'span',
          children: this.label
        }
      ]
    };
  }
  // wrapper
  return {
    tag: 'div',
    attrs: {className: {checkbox: true}},
    children: input
  };
  return input;
};
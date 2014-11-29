'use strict';

//
// Bootstrap css framework plugin
//

var t = require('tcomb-validation');
var dsl = require('../dsl');

// default implementation, delegates to renderer
dsl.Verbatim.prototype.toUVDOM = function () {
  return this.verbatim;
};

dsl.Textbox.prototype.toUVDOM = function () {
  var tag = 'input';
  var type = this.type;
  if (type === 'textarea') {
    tag = 'textarea';
    type = null
  }
  var input = {
    tag: tag,
    attrs: {
      name: this.name,
      type: type,
      placeholder: this.placeholder,
      className: {'form-control': true}, // `form-control` required for displaying validation states correctly
      defaultValue: this.value
    },
    ref: 'input'
  };
  // label
  if (this.label) {
    input = [
      {
        tag: 'label',
        attrs: {className: {'control-label': true}},
        children: this.label
      },
      input
    ];
  }
  // wrapper
  if (type !== 'hidden') {
    input = wrapWithFormGroup(input, this.hasError);
  }
  return input;
};

dsl.Checkbox.prototype.toUVDOM = function () {
  var input = {
    tag: 'input',
    attrs: {
      name: this.name,
      type: 'checkbox',
      defaultChecked: this.value
    },
    ref: 'input'
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

dsl.Fieldset.prototype.toUVDOM = function (children) {
  if (t.Nil.is(children)) {
    children = this.fields.map(function (field) {
      return field.toUVDOM();
    });
  }
  if (this.label) {
    children.unshift({
      tag: 'legend',
      children: this.label
    });
  }
  return {
    tag: 'fieldset',
    children: children
  };
};

function wrapWithFormGroup(children, hasError) {
  return {
    tag: 'div',
    attrs: {className: {'form-group': true, 'has-error': hasError}},
    children: children
  }
}

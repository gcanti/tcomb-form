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

  // textbox / textarea
  var tag = 'input';
  var type = this.type;
  if (type === 'textarea') {
    tag = 'textarea';
    type = null;
  }
  var input = {
    tag: tag,
    attrs: {
      name: this.name,
      type: type,
      placeholder: this.placeholder,
      className: {
        'form-control': true
      },
      defaultValue: this.value
    },
    ref: this._ref
  };

  // if input is hidden avoids useless decorations
  if (type === 'hidden') {
    return input;
  }

  // wrapper
  return {
    tag: 'div',
    attrs: {className: {'form-group': true, 'has-error': this.hasError}},
    children: [
      getLabel(this),
      input,
      getError(this),
      getHelp(this)
    ]
  };
};

dsl.Checkbox.prototype.toUVDOM = function () {

  var input = {
    tag: 'input',
    attrs: {
      name: this.name,
      type: 'checkbox',
      defaultChecked: this.value
    },
    ref: this._ref
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
    attrs: {className: {checkbox: true, 'has-error': this.hasError}},
    children: [
      input,
      getError(this),
      getHelp(this)
    ]
  };
};

dsl.Option.prototype.toOption = function () {
  return {
    tag: 'option',
    attrs: {value: this.value},
    children: this.text
  };
};

dsl.Select.prototype.toUVDOM = function () {

  var options = this.options.map(function (option) {
    return option.toOption();
  });

  var input = {
    tag: 'select',
    attrs: {
      name: this.name,
      className: {
        'form-control': true
      },
      defaultValue: this.value
    },
    children: options,
    ref: this._ref
  };

  // wrapper
  return {
    tag: 'div',
    attrs: {className: {'form-group': true, 'has-error': this.hasError}},
    children: [
      getLabel(this),
      input,
      getError(this),
      getHelp(this)
    ]
  };

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

function getLabel(dsl) {
  if (dsl.label) {
    return {
      tag: 'label',
      attrs: {className: {'control-label': true}},
      children: dsl.label
    };
  }
}

function getHelp(dsl) {
  if (dsl.help) {
    return {
      tag: 'span',
      attrs: {className: {'help-block': true}},
      children: dsl.help
    };
  }
}

function getError(dsl) {
  var message = dsl.message;
  if (message && dsl.hasError) {
    if (t.Func.is(message)) {
      message = message(dsl.value);
    }
    return {
      tag: 'span',
      attrs: {className: {'help-block': true, 'error-block': true}},
      children: message
    };
  }
}


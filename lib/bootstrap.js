'use strict';

//================
// style -> UVDOM
//================

var t = require('tcomb-validation');
var style = require('./style');
var dsl = require('./dsl');

var Option = dsl.Option;

var mixin = t.util.mixin;

style.Textbox.prototype.render = function () {

  if (this.type === 'hidden') {
    return {
      tag: 'input',
      attrs: {
        name: this.name,
        type: 'hidden',
        defaultValue: this.value
      },
      ref: this.ref
    };
  }

  var tag = (type === 'textarea') ? 'textarea' : 'input';
  var type = (type === 'textarea') ? null : type;

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
    ref: this.ref
  };

  var label = this.label ? getLabel(this.label) : null;
  var help = this.help ? getHelpBlock(this.help) : null;
  var error = this.error ? getHelpBlock(this.error, {'error-block': true}) : null;

  var children = [];
  if (label) { children.push(label); }
  children.push(input);
  if (error) { children.push(error); }
  if (help) { children.push(help); }

  return getFormGroup(children, {'has-error': !!this.error});
};

style.Checkbox.prototype.render = function () {

  var input = {
    tag: 'input',
    attrs: {
      name: this.name,
      type: 'checkbox',
      defaultChecked: this.value
    },
    ref: this.ref
  };

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

  var help = this.help ? getHelpBlock(this.help) : null;
  var error = this.error ? getHelpBlock(this.error, {'error-block': true}) : null;

  var children = [input];
  if (help) { children.push(help); }
  if (error) { children.push(error); }

  return {
    tag: 'div',
    attrs: {
      className: {
        checkbox: true,
        'has-error': !!this.error
      }
    },
    children: children
  };
};

Option.prototype.render = function () {
  return {
    tag: 'option',
    attrs: {
      value: this.value
    },
    key: this.value,
    children: this.text
  };
};

style.Select.prototype.render = function () {

  var options = this.options.map(function (option) {
    return option.render();
  });

  var input = {
    tag: 'select',
    attrs: {
      name: this.name,
      className: {
        'form-control': true
      },
      defaultValue: this.value,
      disabled: this.disabled
    },
    children: options,
    ref: this.ref
  };

  var label = this.label ? getLabel(this.label) : null;
  var help = this.help ? getHelpBlock(this.help) : null;
  var error = this.error ? getHelpBlock(this.error, {'error-block': true}) : null;

  var children = [];
  if (label) { children.push(label); }
  children.push(input);
  if (error) { children.push(error); }
  if (help) { children.push(help); }

  return getFormGroup(children, {'has-error': !!this.error});
};

style.Radio.getRadio = function (option, name, ref, defaultChecked) {
  return {
    tag: 'div',
    attrs: {
      className: {
        radio: true
      }
    },
    children: {
      tag: 'label',
      children: [
        {
          tag: 'input',
          attrs: {
            type: 'radio',
            name: name,
            value: option.value,
            defaultChecked: defaultChecked
          },
          ref: ref
        },
        option.text
      ]
    }
  };
};

style.Radio.prototype.render = function () {
  var radios = this.options.map(function (option, i) {
    return style.Radio.getRadio(
      option,
      this.name,
      this.ref + i,
      option.value === this.value
    );
  }.bind(this));

  var label = this.label ? getLabel(this.label) : null;
  var help = this.help ? getHelpBlock(this.help) : null;
  var error = this.error ? getHelpBlock(this.error, {'error-block': true}) : null;

  var children = [];
  if (label) { children.push(label); }
  children = children.concat(radios);
  if (error) { children.push(error); }
  if (help) { children.push(help); }

  return getFormGroup(children, {'has-error': !!this.error});
};

style.Fieldset.prototype.render = function () {
  var rows = this.rows.slice();
  if (this.label) {
    rows.unshift({
      tag: 'legend',
      children: this.label
    });
  }
  return {
    tag: 'fieldset',
    children: rows
  };
};

style.List.prototype.render = function () {

  var rows = this.rows.map(function (row) {
    return style.List.renderItem(row.item, row.buttons);
  });

  if (this.label) {
    rows.unshift({
      tag: 'legend',
      children: this.label
    });
  }

  if (this.add) {
    rows.push(style.List.renderAddButton(this.add));
  }

  return {
    tag: 'fieldset',
    children: rows
  };
};

style.List.renderAddButton = function (b) {
  return getFormGroup(button(b));
};

style.List.renderItem = function (item, buttons) {

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
        children: buttonGroup(buttons)
      }
    ]
  };
};

function button(button) {
  return {
    tag: 'button',
    attrs: {
      className: {
        btn: true,
        'btn-default': true
      }
    },
    events: {
      click: button.click
    },
    children: button.label
  }
};

function buttonGroup(buttons) {
  return {
    tag: 'div',
    attrs: {
      className: {
        'btn-group': true
      }
    },
    children: buttons.map(button)
  };
}

function getFormGroup(children, className) {
  return {
    tag: 'div',
    attrs: {
      className: mixin({
        'form-group': true
      }, className)
    },
    children: children
  };
}

function getLabel(children) {
  return {
    tag: 'label',
    attrs: {
      className: {
        'control-label': true
      }
    },
    children: children
  };
}

function getHelpBlock(children, className) {
  return {
    tag: 'span',
    attrs: {
      className: mixin({
        'help-block': true
      }, className)
    },
    children: children
  };
}



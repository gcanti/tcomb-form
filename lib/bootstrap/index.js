'use strict';

var style = require('../style');

style.Textbox.prototype.render = function (locals) {

  var type = this.type;

  if (type === 'hidden') {
    // if the textbox is hidden, no decorations only `name`, `value`.
    // And `ref` if you need to read the value
    return {
      tag: 'input',
      attrs: {
        name: this.name,
        type: 'hidden',
        defaultValue: locals.value
      },
      ref: this.ref
    };
  }

  var tag = 'input';
  // textbox handle textarea too
  if (type === 'textarea') {
    tag = 'textarea';
    type = null;
  }

  var control = {
    tag: tag,
    attrs: {
      name: this.name,
      type: type,
      placeholder: this.placeholder,
      className: {
        'form-control': true
      },
      defaultValue: locals.value,
      readOnly: this.readOnly,
      disabled: this.disabled
    },
    ref: this.ref
  };

  var content = [
    getLabel(this.label),
    control,
    getErrorBlock(locals.message),
    getHelpBlock(this.help)
  ];

  return wrapWithFormGroup(content, locals.hasError);
};

style.Checkbox.prototype.render = function (locals) {

  var control = {
    tag: 'input',
    attrs: {
      name: this.name,
      type: 'checkbox',
      defaultChecked: locals.value,
      disabled: this.disabled
    },
    ref: this.ref
  };

  if (this.label) {
    control = {
      tag: 'label',
      children: [
        control,
        ' ',
        {
          tag: 'span',
          children: this.label
        }
      ]
    };
  }

  var content = [
    control,
    getErrorBlock(locals.message),
    getHelpBlock(this.help)
  ];

  return {
    tag: 'div',
    attrs: {
      className: {
        checkbox: true,
        'has-error': locals.hasError
      }
    },
    children: content
  };
};

style.Option.prototype.render = function () {
  return {
    tag: 'option',
    attrs: {
      value: this.value
    },
    key: this.value,
    children: this.text
  };
};

style.OptGroup.prototype.render = function () {
  return {
    tag: 'optgroup',
    attrs: {
      label: this.group
    },
    key: this.group,
    children: this.options.map(function (option) {
      return option.render();
    })
  };
};

style.Select.prototype.render = function (locals) {

  var options = this.options.map(function (option) {
    return option.render();
  });

  var control = {
    tag: 'select',
    attrs: {
      name: this.name,
      className: {
        'form-control': true
      },
      defaultValue: locals.value,
      disabled: this.disabled
    },
    children: options,
    ref: this.ref
  };

  var content = [
    getLabel(this.label),
    control,
    getErrorBlock(locals.message),
    getHelpBlock(this.help)
  ];

  return wrapWithFormGroup(content, locals.hasError);
};

style.Radio.prototype.render = function (locals) {

  var control = this.options.map(function (option, i) {
    return getSingleRadio({
      option: option,
      name: this.name,
      ref: this.ref + i,
      key: option.value,
      checked: (option.value === locals.value)
    });
  }.bind(this));

  var content = [
    getLabel(this.label),
    control,
    getErrorBlock(locals.message),
    getHelpBlock(this.help)
  ];

  return wrapWithFormGroup(content, locals.hasError);
};

// FIXME handle error message
style.Struct.prototype.render = function () {

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

// FIXME handle error message
style.List.prototype.render = function (locals) {

  var rows = locals.rows.map(getListRow);

  if (this.label) {
    rows.unshift({
      tag: 'legend',
      children: this.label
    });
  }

  if (locals.add) {
    rows.push(getListAddButton(locals.add));
  }

  return {
    tag: 'fieldset',
    children: rows
  };
};

function getSingleRadio(options) {

  var option = options.option;

  // build the radio input..
  var radio = {
    tag: 'input',
    attrs: {
      type: 'radio',
      name: options.name,
      value: option.value,
      defaultChecked: options.checked
    },
    ref: options.ref
  };

  // ..wrap it with the label..
  var label = {
    tag: 'label',
    children: [
      radio,
      option.text
    ]
  };

  // ..wrap it with a div with "radio" class
  return {
    tag: 'div',
    attrs: {
      className: {
        radio: true
      }
    },
    children: label,
    key: options.key
  };
}

function getListAddButton(button) {
  return wrapWithFormGroup(getButton(button));
}

function getListRow(row) {

  if (!row.buttons.length) {
    return row.item;
  }

  var left = {
    tag: 'div',
    attrs: {
      className: {
        'col-md-7': true
      }
    },
    children: row.item
  };

  var right = {
    tag: 'div',
    attrs: {
      className: {
        'col-md-5': true
      }
    },
    children: getButtonGroup(row.buttons)
  };

  return {
    tag: 'div',
    attrs: {
      className: {
        row: true
      }
    },
    children: [
      left,
      right
    ]
  };
}

function getButton(button) {
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

function getButtonGroup(buttons) {
  return {
    tag: 'div',
    attrs: {
      className: {
        'btn-group': true
      }
    },
    children: buttons.map(getButton)
  };
}

function wrapWithFormGroup(content, hasError) {
  return {
    tag: 'div',
    attrs: {
      className: {
        'form-group': true,
        'has-error': hasError
      }
    },
    children: content
  };
}

function getLabel(label) {
  if (!label) { return; }
  return {
    tag: 'label',
    attrs: {
      className: {
        'control-label': true
      }
    },
    children: label
  };
}

function getHelpBlock(label) {
  if (!label) { return; }
  return {
    tag: 'span',
    attrs: {
      className: {
        'help-block': true
      }
    },
    children: label
  };
}

function getErrorBlock(error) {
  if (!error) { return; }
  return {
    tag: 'span',
    attrs: {
      className: {
        'help-block': true,
        'error-block': true
      }
    },
    children: error
  };
}


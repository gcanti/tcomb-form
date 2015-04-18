'use strict';

//==================
// WORK IN PROGRESS:
// contributions and PR are welcome
//==================

/*

  - no fieldset tag for forms
  - font: Lato from google font

*/

function getAlert(type, children) {
  var className = {
    ui: true,
    message: true
  };
  className[type] = true;
  return {
    tag: 'div',
    attrs: { className: className },
    children: children
  };
}

function getLabel(opts) {
  if (!opts.label) {
    return;
  }
  return {
    tag: 'label',
    attrs: {
      htmlFor: opts.htmlFor,
      id: opts.id
    },
    children: opts.label
  };
}

// TODO: idiomatic?
function getHelp(locals) {
  if (!locals.help) {
    return;
  }
  return {
    tag: 'div',
    attrs: {
      id: locals.id + '-tip'
    },
    children: locals.help
  };
}

// TODO: idiomatic?
function getError(locals) {
  if (!locals.hasError || !locals.error) {
    return;
  }
  return {
    tag: 'div',
    children: locals.error
  };
}

function getHiddenTextbox(locals) {
  return {
    tag: 'input',
    attrs: {
      type: 'hidden',
      value: locals.value,
      name: locals.name
    },
    events: {
      change: function change(evt) {
        locals.onChange(evt.target.value);
      }
    }
  };
}

function getOption(opts) {
  return {
    tag: 'option',
    attrs: {
      disabled: opts.disabled,
      value: opts.value
    },
    children: opts.text,
    key: opts.value
  };
}

function getOptGroup(opts) {
  return {
    tag: 'optgroup',
    attrs: {
      disabled: opts.disabled,
      label: opts.label
    },
    children: opts.options.map(getOption),
    key: opts.label
  };
}

function getButton(options) {
  return {
    tag: 'button',
    attrs: {
      className: {
        ui: true,
        basic: true,
        button: true
      }
    },
    events: {
      click: options.click
    },
    children: options.label,
    key: options.key
  };
}

function getRow(options) {
  return {
    tag: 'div',
    attrs: {
      className: {
        ui: true,
        grid: true
      }
    },
    children: options.children,
    key: options.key
  };
}

function getCol(options) {
  return {
    tag: 'div',
    attrs: {
      className: options.className
    },
    children: options.children
  };
}

function getButtonGroup(buttons) {
  return {
    tag: 'div',
    attrs: {
      className: {
        ui: true,
        basic: true,
        buttons: true
      }
    },
    children: buttons
  };
};

function textbox(locals) {

  if (locals.type === 'hidden') {
    return getHiddenTextbox(locals);
  }

  var tag = locals.type === 'textarea' ? 'textarea' : 'input';
  var control = {
    tag: tag,
    attrs: {
      autoFocus: locals.autoFocus,
      type: locals.type !== 'textarea' ? locals.type : null,
      value: locals.value,
      disabled: locals.disabled,
      'aria-describedby': locals.help ? locals.id + '-tip' : null,
      id: locals.label ? locals.id : null,
      placeholder: locals.placeholder,
      name: locals.name,
      className: locals.className
    },
    events: {
      change: function change(evt) {
        locals.onChange(evt.target.value);
      }
    }
  };

  var label = getLabel({
    label: locals.label,
    htmlFor: locals.id
  });
  var help = getHelp(locals);
  var error = getError(locals);

  return {
    tag: 'div',
    attrs: {
      className: {
        field: true,
        error: locals.hasError,
        disabled: locals.disabled
      }
    },
    children: [label, control, help, error]
  };
}

function checkbox(locals) {
  var control = {
    tag: 'input',
    attrs: {
      autoFocus: locals.autoFocus,
      type: 'checkbox',
      value: locals.value,
      disabled: locals.disabled,
      'aria-describedby': locals.help ? locals.id + '-tip' : null,
      id: locals.label ? locals.id : null,
      name: locals.name,
      className: locals.className
    },
    events: {
      change: function change(evt) {
        locals.onChange(evt.target.checked);
      }
    }
  };

  var label = getLabel({
    label: locals.label,
    htmlFor: locals.id
  });
  var help = getHelp(locals);
  var error = getError(locals);

  return {
    tag: 'div',
    attrs: {
      className: {
        field: true,
        inline: true,
        error: locals.hasError,
        disabled: locals.disabled
      }
    },
    children: {
      tag: 'div',
      attrs: {
        className: {
          ui: true,
          checkbox: true
        }
      },
      children: [control, label, help, error]
    }
  };
}

function select(locals) {
  var options = locals.options.map(function (x) {
    return x.label ? getOptGroup(x) : getOption(x);
  });

  function onChange(evt) {
    var value = locals.multiple ? Array.prototype.slice.call(evt.target.options).filter(function (option) {
      return option.selected;
    }).map(function (option) {
      return option.value;
    }) : evt.target.value;
    locals.onChange(value);
  }

  var control = {
    tag: 'select',
    attrs: {
      autoFocus: locals.autoFocus,
      value: locals.value,
      disabled: locals.disabled,
      'aria-describedby': locals.help ? locals.id + '-tip' : null,
      id: locals.label ? locals.id : null,
      name: locals.name,
      multiple: locals.multiple,
      className: locals.className
    },
    events: {
      change: onChange
    },
    children: options
  };

  var label = getLabel({
    label: locals.label,
    htmlFor: locals.id
  });
  var help = getHelp(locals);
  var error = getError(locals);

  return {
    tag: 'div',
    attrs: {
      className: {
        field: true,
        error: locals.hasError,
        disabled: locals.disabled
      }
    },
    children: [label, control, help, error]
  };
}

function radio(locals) {

  var control = {
    tag: 'div',
    attrs: {
      className: {
        fields: true,
        grouped: true
      }
    },
    children: locals.options.map(function (option, i) {
      return {
        tag: 'div',
        attrs: {
          className: {
            field: true
          }
        },
        children: {
          tag: 'div',
          attrs: {
            className: {
              ui: true,
              radio: true,
              checkbox: true
            }
          },
          children: [{
            tag: 'input',
            attrs: {
              autoFocus: locals.autoFocus && i === 0,
              type: 'radio',
              'aria-describedby': locals.label ? locals.id : null,
              id: locals.id + '-' + option.value,
              checked: option.value === locals.value,
              disabled: option.disabled || locals.disabled,
              name: locals.name,
              value: option.value,
              className: locals.className
            },
            events: {
              change: function change(evt) {
                locals.onChange(evt.target.value);
              }
            }
          }, {
            tag: 'label',
            children: option.text,
            events: {
              click: function click() {
                document.getElementById(locals.id + '-' + option.value).click();
              }
            }
          }] },
        key: option.value
      };
    })
  };

  var label = getLabel({
    label: locals.label,
    htmlFor: locals.id
  });
  var help = getHelp(locals);
  var error = getError(locals);

  return {
    tag: 'div',
    attrs: {
      className: {
        field: true,
        error: locals.hasError,
        disabled: locals.disabled
      }
    },
    children: [label, control, help, error]
  };
}

function date() {
  throw new Error('dates are not (yet) supported');
}

function struct(locals) {

  var rows = [];

  if (locals.help) {
    rows.push(getAlert('warning', locals.help));
  }

  rows = rows.concat(locals.order.map(function (name) {
    return locals.inputs[name];
  }));

  if (locals.error && locals.hasError) {
    rows.push(getAlert('error', locals.error));
  }

  // FIXME missing legend handling
  // FIXME missing disabled handling
  return {
    tag: 'div', // TODO why fieldset is not used here?
    attrs: {
      className: {
        ui: true,
        form: true,
        segment: locals.path.length > 0,
        warning: !!locals.help,
        error: locals.hasError
      }
    },
    children: rows
  };
}

function list(locals) {

  var rows = [];

  if (locals.help) {
    rows.push(getAlert('warning', locals.help));
  }

  rows = rows.concat(locals.items.map(function (item) {
    if (item.buttons.length === 0) {
      return getRow({
        key: item.key,
        children: [getCol({
          className: {
            six: true,
            wide: true,
            column: true
          },
          children: item.input
        })]
      });
    }
    return getRow({
      key: item.key,
      children: [getCol({
        className: {
          eight: true,
          wide: true,
          column: true
        },
        children: item.input
      }), getCol({
        className: {
          four: true,
          wide: true,
          column: true
        },
        children: getButtonGroup(item.buttons.map(function (button, i) {
          return getButton({
            click: button.click,
            key: i,
            label: button.label
          });
        }))
      })]
    });
  }));

  if (locals.error && locals.hasError) {
    rows.push(getAlert('error', locals.error));
  }

  if (locals.add) {
    rows.push(getButton(locals.add));
  }

  // FIXME missing legend handling
  // FIXME missing disabled handling
  return {
    tag: 'div', // TODO why fieldset is not used here?
    attrs: {
      className: {
        ui: true,
        form: true,
        segment: locals.path.length > 0,
        warning: !!locals.help,
        error: locals.hasError
      }
    },
    children: rows
  };
}

module.exports = {
  name: 'semanticui',
  textbox: textbox,
  checkbox: checkbox,
  select: select,
  radio: radio,
  date: date,
  struct: struct,
  list: list
};
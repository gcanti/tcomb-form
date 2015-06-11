'use strict';

exports.__esModule = true;
exports.textbox = textbox;
exports.checkbox = checkbox;
exports.select = select;
exports.radio = radio;
exports.date = date;
exports.struct = struct;
exports.list = list;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcombValidation = require('tcomb-validation');

var _tcombValidation2 = _interopRequireDefault(_tcombValidation);

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

function getHelp(locals) {
  if (!locals.help) {
    return;
  }
  return {
    tag: 'div',
    attrs: {
      className: 'ui pointing label visible',
      id: locals.id + '-tip'
    },
    children: locals.help
  };
}

function getError(locals) {
  if (!locals.hasError || !locals.error) {
    return;
  }
  return {
    tag: 'div',
    attrs: {
      className: 'ui pointing label visible red'
    },
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
}

function textbox(locals) {

  if (locals.type === 'hidden') {
    return getHiddenTextbox(locals);
  }

  var attrs = _tcombValidation2['default'].mixin({}, locals.attrs);

  var tag = 'textarea';
  if (locals.type !== 'textarea') {
    tag = 'input';
    attrs.type = locals.type;
  }

  attrs.className = _tcombValidation2['default'].mixin({}, attrs.className);
  attrs.className['form-control'] = true;

  attrs.disabled = locals.disabled;
  if (locals.type !== 'file') {
    attrs.value = locals.value;
  }
  attrs.onChange = locals.type === 'file' ? function (evt) {
    return locals.onChange(evt.target.files[0]);
  } : function (evt) {
    return locals.onChange(evt.target.value);
  };

  if (locals.help) {
    attrs['aria-describedby'] = attrs['aria-describedby'] || attrs.id + '-tip';
  }

  var control = {
    tag: tag,
    attrs: attrs
  };

  var label = getLabel({
    label: locals.label,
    htmlFor: attrs.id
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

  var attrs = _tcombValidation2['default'].mixin({}, locals.attrs);
  attrs.type = 'checkbox';
  attrs.disabled = locals.disabled;
  attrs.checked = locals.value;
  attrs.onChange = function (evt) {
    return locals.onChange(evt.target.checked);
  };

  if (locals.help) {
    attrs['aria-describedby'] = attrs['aria-describedby'] || attrs.id + '-tip';
  }

  var control = {
    tag: 'input',
    attrs: attrs
  };
  var label = getLabel({
    label: locals.label,
    htmlFor: attrs.id
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

  var attrs = _tcombValidation2['default'].mixin({}, locals.attrs);

  attrs.className = _tcombValidation2['default'].mixin({}, attrs.className);
  attrs.className['form-control'] = true;

  attrs.multiple = locals.isMultiple;
  attrs.disabled = locals.disabled;
  attrs.value = locals.value;
  attrs.onChange = function (evt) {
    var value = locals.isMultiple ? Array.prototype.slice.call(evt.target.options).filter(function (option) {
      return option.selected;
    }).map(function (option) {
      return option.value;
    }) : evt.target.value;
    locals.onChange(value);
  };

  if (locals.help) {
    attrs['aria-describedby'] = attrs['aria-describedby'] || attrs.id + '-tip';
  }

  var options = locals.options.map(function (x) {
    return x.label ? getOptGroup(x) : getOption(x);
  });

  var control = {
    tag: 'select',
    attrs: attrs,
    children: options
  };

  var label = getLabel({
    label: locals.label,
    htmlFor: attrs.id
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

  var id = locals.attrs.id;
  var onChange = function onChange(evt) {
    return locals.onChange(evt.target.value);
  };

  var control = {
    tag: 'div',
    attrs: {
      className: {
        fields: true,
        grouped: true
      }
    },
    children: locals.options.map(function (option, i) {

      var attrs = _tcombValidation2['default'].mixin({}, locals.attrs);
      attrs.type = 'radio';
      attrs.checked = option.value === locals.value;
      attrs.disabled = locals.disabled;
      attrs.value = option.value;
      attrs.autoFocus = attrs.autoFocus && i === 0;
      attrs.id = '' + id + '_' + i;
      attrs['aria-describedby'] = attrs['aria-describedby'] || (locals.label ? id : null);
      attrs.onChange = onChange;

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
            attrs: attrs
          }, {
            tag: 'label',
            children: option.text,
            events: {
              click: function click() {
                document.getElementById(attrs.id).click();
              }
            }
          }]
        },
        key: option.value
      };
    })
  };

  var label = getLabel({
    label: locals.label,
    htmlFor: id
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

function range(n) {
  var result = [];
  for (var i = 1; i <= n; i++) {
    result.push(i);
  }
  return result;
}

function padLeft(x, len) {
  var str = String(x);
  var times = len - str.length;
  for (var i = 0; i < times; i++) {
    str = '0' + str;
  }
  return str;
}

function toOption(value, text) {
  return {
    tag: 'option',
    attrs: { value: value + '' },
    children: text
  };
}

var nullOption = [toOption('', '-')];

var days = nullOption.concat(range(31).map(function (i) {
  return toOption(i, padLeft(i, 2));
}));

var months = nullOption.concat(range(12).map(function (i) {
  return toOption(i - 1, padLeft(i, 2));
}));

function date(locals) {

  var attrs = _tcombValidation2['default'].mixin({}, locals.attrs);
  var value = locals.value.slice();

  function onDayChange(evt) {
    value[2] = evt.target.value === '-' ? null : evt.target.value;
    locals.onChange(value);
  }

  function onMonthChange(evt) {
    value[1] = evt.target.value === '-' ? null : evt.target.value;
    locals.onChange(value);
  }

  function onYearChange(evt) {
    value[0] = evt.target.value.trim() === '' ? null : evt.target.value.trim();
    locals.onChange(value);
  }

  var parts = {

    D: {
      tag: 'div',
      key: 'D',
      attrs: {
        className: {
          field: true
        }
      },
      children: {
        tag: 'select',
        attrs: {
          disabled: locals.disabled,
          value: value[2]
        },
        events: {
          change: onDayChange
        },
        children: days
      }
    },

    M: {
      tag: 'div',
      key: 'M',
      attrs: {
        className: {
          field: true
        }
      },
      children: {
        tag: 'select',
        attrs: {
          disabled: locals.disabled,
          value: value[1]
        },
        events: {
          change: onMonthChange
        },
        children: months
      }
    },

    YY: {
      tag: 'div',
      key: 'YY',
      attrs: {
        className: {
          field: true
        }
      },
      children: {
        tag: 'input',
        attrs: {
          disabled: locals.disabled,
          type: 'text',
          size: 5,
          value: value[0]
        },
        events: {
          change: onYearChange
        }
      }
    }

  };

  var control = {
    tag: 'div',
    attrs: {
      className: {
        inline: true,
        fields: true
      }
    },
    children: locals.order.map(function (id) {
      return parts[id];
    })
  };

  var label = getLabel({
    label: locals.label,
    htmlFor: attrs.id
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

function struct(locals) {

  var rows = [];

  if (locals.label) {
    rows.push({
      tag: 'legend',
      attrs: {
        className: {
          ui: true,
          header: true
        }
      },
      children: locals.label
    });
  }

  if (locals.help) {
    rows.push(getAlert('info', locals.help));
  }

  rows = rows.concat(locals.order.map(function (name) {
    return locals.inputs[name];
  }));

  if (locals.error && locals.hasError) {
    rows.push(getAlert('error', locals.error));
  }

  return {
    tag: 'fieldset',
    attrs: {
      disabled: locals.disabled,
      style: {
        border: 0,
        margin: 0,
        padding: 0
      },
      className: {
        ui: true,
        form: true,
        segment: locals.path.length > 0,
        error: locals.hasError
      }
    },
    children: rows
  };
}

function list(locals) {

  var rows = [];

  if (locals.label) {
    rows.push({
      tag: 'legend',
      attrs: {
        className: {
          ui: true,
          header: true
        }
      },
      children: locals.label
    });
  }

  if (locals.help) {
    rows.push(getAlert('info', locals.help));
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

  return {
    tag: 'fieldset',
    attrs: {
      disabled: locals.disabled,
      style: {
        border: 0,
        margin: 0,
        padding: 0
      },
      className: {
        ui: true,
        form: true,
        segment: locals.path.length > 0,
        error: locals.hasError
      }
    },
    children: rows
  };
}
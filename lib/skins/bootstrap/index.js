'use strict';

var t = require('tcomb-validation');
var uform = require('uvdom-bootstrap/form');
var Any = t.Any;
var maybe = t.maybe;
var getFieldset = uform.getFieldset;
var getFormGroup = uform.getFormGroup;
var getAddon = uform.getAddon;
var getButton = uform.getButton;
var getCol = uform.getCol;
var getAlert = uform.getAlert;
var getBreakpoints = uform.getBreakpoints;

var noobj = Object.freeze({});

var Positive = t.subtype(t.Num, function (n) {
  return n % 1 === 0 && n >= 0;
}, 'Positive');

var Cols = t.subtype(t.tuple([Positive, Positive]), function (cols) {
  return cols[0] + cols[1] === 12;
}, 'Cols');

var Breakpoints = t.struct({
  xs: maybe(Cols),
  sm: maybe(Cols),
  md: maybe(Cols),
  lg: maybe(Cols)
}, 'Breakpoints');

Breakpoints.prototype.getBreakpoints = function (index) {
  var breakpoints = {};
  for (var size in this) {
    if (this.hasOwnProperty(size) && !t.Nil.is(this[size])) {
      breakpoints[size] = this[size][index];
    }
  }
  return breakpoints;
};

Breakpoints.prototype.getLabelClassName = function () {
  return getBreakpoints(this.getBreakpoints(0));
};

Breakpoints.prototype.getInputClassName = function () {
  return getBreakpoints(this.getBreakpoints(1));
};

Breakpoints.prototype.getOffsetClassName = function () {
  return t.mixin(uform.getOffsets(this.getBreakpoints(1)), getBreakpoints(this.getBreakpoints(1)));
};

Breakpoints.prototype.getFieldsetClassName = function () {
  return {
    'col-xs-12': true
  };
};

var Size = t.enums.of('xs sm md lg', 'Size');

var TextboxConfig = t.struct({
  addonBefore: Any,
  addonAfter: Any,
  horizontal: maybe(Breakpoints),
  size: maybe(Size)
}, 'TextboxConfig');

var CheckboxConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'CheckboxConfig');

var SelectConfig = t.struct({
  addonBefore: Any,
  addonAfter: Any,
  horizontal: maybe(Breakpoints),
  size: maybe(Size)
}, 'SelectConfig');

var RadioConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'RadioConfig');

var DateConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'DateConfig');

var StructConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'StructConfig');

var ListConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'ListConfig');

function getLabel(opts) {
  if (!opts.label) { return; }

  var align = null;
  var className = null;

  if (opts.breakpoints) {
    align = 'right';
    className = opts.breakpoints.getLabelClassName();
  }

  return uform.getLabel({
    align: align,
    className: className,
    htmlFor: opts.htmlFor,
    id: opts.id,
    label: opts.label
  });
}

function getHelp(locals) {
  if (!locals.help) { return; }
  return uform.getHelpBlock({
    help: locals.help,
    id: locals.id + '-tip'
  });
}

function getError(locals) {
  if (!locals.hasError || !locals.error) { return; }
  return uform.getErrorBlock({
    error: locals.error,
    hasError: locals.hasError
  });
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
      change: function (evt) {
        locals.onChange(evt.target.value);
      }
    }
  };
}

function textbox(locals) {

  var config = new TextboxConfig(locals.config || noobj);

  if (locals.type === 'hidden') {
    return getHiddenTextbox(locals);
  }

  var control = uform.getTextbox({
    autoFocus: locals.autoFocus,
    type: locals.type,
    value: locals.value,
    disabled: locals.disabled,
    'aria-describedby': locals.help ? locals.id + '-tip' : null,
    id: locals.label ? locals.id : null,
    onChange: function (evt) {
      locals.onChange(evt.target.value);
    },
    placeholder: locals.placeholder,
    name: locals.name,
    size: config.size,
    className: locals.className
  });

  if (config.addonBefore || config.addonAfter) {
    control = uform.getInputGroup([
      config.addonBefore ? getAddon(config.addonBefore) : null,
      control,
      config.addonAfter ? getAddon(config.addonAfter) : null
    ]);
  }

  var horizontal = config.horizontal;
  var label = getLabel({
    label: locals.label,
    htmlFor: locals.id,
    breakpoints: config.horizontal
  });
  var error = getError(locals);
  var help = getHelp(locals);

  var children = [
    label,
    control,
    error,
    help
  ];

  if (horizontal) {
    children = [
      label,
      {
        tag: 'div',
        attrs: {
          className: label ? horizontal.getInputClassName() : horizontal.getOffsetClassName()
        },
        children: [
          control,
          error,
          help
        ]
      }
    ];
  }

  return getFormGroup({
    hasError: locals.hasError,
    children: children
  });
}

function checkbox(locals) {

  var config = new CheckboxConfig(locals.config || noobj);

  var control = uform.getCheckbox({
    autoFocus: locals.autoFocus,
    checked: locals.value,
    disabled: locals.disabled,
    id: locals.id,
    label: locals.label,
    name: locals.name,
    onChange: function (evt) {
      locals.onChange(evt.target.checked);
    },
    className: locals.className
  });

  var error = getError(locals);
  var help = getHelp(locals);
  var children = [
    control,
    error,
    help
  ];

  if (config.horizontal) {
    children = {
      tag: 'div',
      attrs: {
        className: config.horizontal.getOffsetClassName()
      },
      children: children
    };
  }

  return getFormGroup({
    hasError: locals.hasError,
    children: children
  });
}

function select(locals) {

  var config = new SelectConfig(locals.config || noobj);

  var options = locals.options.map(function (x) {
    return x.label ? uform.getOptGroup(x) : uform.getOption(x);
  });

  function onChange(evt) {
    var value = locals.multiple ?
      Array.prototype.slice.call(evt.target.options)
        .filter(function (option) { return option.selected; })
        .map(function (option) { return option.value; }) :
      evt.target.value;
    locals.onChange(value);
  }

  var control = uform.getSelect({
    autoFocus: locals.autoFocus,
    value: locals.value,
    disabled: locals.disabled,
    'aria-describedby': locals.help ? locals.id + '-tip' : null,
    id: locals.label ? locals.id : null,
    name: locals.name,
    onChange: onChange,
    options: options,
    size: config.size,
    multiple: locals.multiple,
    className: locals.className
  });

  var horizontal = config.horizontal;
  var label = getLabel({
    label: locals.label,
    htmlFor: locals.id,
    breakpoints: config.horizontal
  });
  var error = getError(locals);
  var help = getHelp(locals);
  var children = [
    label,
    control,
    error,
    help
  ];

  if (horizontal) {
    children = [
      label,
      {
        tag: 'div',
        attrs: {
          className: label ? horizontal.getInputClassName() : horizontal.getOffsetClassName()
        },
        children: [
          control,
          error,
          help
        ]
      }
    ];
  }

  return getFormGroup({
    hasError: locals.hasError,
    children: children
  });
}

function radio(locals) {

  var config = new RadioConfig(locals.config || noobj);

  var control = locals.options.map(function (option, i) {
    return uform.getRadio({
      autoFocus: locals.autoFocus && (i === 0),
      'aria-describedby': locals.label ? locals.id : null,
      id: locals.id + '-' + option.value,
      checked: (option.value === locals.value),
      disabled: option.disabled || locals.disabled,
      label: option.text,
      name: locals.name,
      onChange: function (evt) {
        locals.onChange(evt.target.value);
      },
      value: option.value,
      className: locals.className
    });
  });

  var horizontal = config.horizontal;
  var label = getLabel({
    label: locals.label,
    id: locals.id,
    breakpoints: config.horizontal
  });
  var error = getError(locals);
  var help = getHelp(locals);
  var children = [
    label,
    control,
    error,
    help
  ];

  if (horizontal) {
    children = [
      label,
      {
        tag: 'div',
        attrs: {
          className: label ? horizontal.getInputClassName() : horizontal.getOffsetClassName()
        },
        children: [
          control,
          error,
          help
        ]
      }
    ];
  }

  return getFormGroup({
    hasError: locals.hasError,
    children: children
  });
}

function range(n) {
  var result = [];
  for (var i = 1 ; i <= n ; i++) { result.push(i); }
  return result;
}

function padLeft(x, len) {
  var str = String(x);
  var times = len - str.length;
  for (var i = 0 ; i < times ; i++ ) { str = '0' + str; }
  return str;
}

function toOption(value, text) {
  return {
    tag: 'option',
    attrs: {value: value + ''},
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

  var config = new DateConfig(locals.config || noobj);
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
      tag: 'li',
      key: 'D',
      children: {
        tag: 'select',
        attrs: {
          className: {
            'form-control': true
          },
          value: value[2]
        },
        events: {
          change: onDayChange
        },
        children: days
      }
    },

    M: {
      tag: 'li',
      key: 'M',
      children: {
        tag: 'select',
        attrs: {
          className: {
            'form-control': true
          },
          value: value[1]
        },
        events: {
          change: onMonthChange
        },
        children: months
      }
    },

    YY: {
      tag: 'li',
      key: 'YY',
      children: {
        tag: 'input',
        attrs: {
          type: 'text',
          size: 5,
          className: {
            'form-control': true
          },
          value: value[0]
        },
        events: {
          change: onYearChange
        }
      }
    }

  };

  var control = {
    tag: 'ul',
    attrs: {
      className: {
        'nav nav-pills': true
      }
    },
    children: locals.order.map(function (id) {
      return parts[id];
    })
  };

  var horizontal = config.horizontal;
  var label = getLabel({
    label: locals.label,
    id: locals.id,
    breakpoints: config.horizontal
  });
  var error = getError(locals);
  var help = getHelp(locals);
  var children = [
    label,
    control,
    error,
    help
  ];

  if (horizontal) {
    children = [
      label,
      {
        tag: 'div',
        attrs: {
          className: label ? horizontal.getInputClassName() : horizontal.getOffsetClassName()
        },
        children: [
          control,
          error,
          help
        ]
      }
    ];
  }

  return getFormGroup({
    hasError: locals.hasError,
    children: children
  });

}

function struct(locals) {

  var config = new StructConfig(locals.config || noobj);

  var rows = [];

  if (locals.help) {
    rows.push(getAlert({
      children: locals.help
    }));
  }

  rows = rows.concat(locals.order.map(function (name) {
    return locals.inputs.hasOwnProperty(name) ? locals.inputs[name] : name;
  }));

  if (locals.error && locals.hasError) {
    rows.push(getAlert({
      type: 'danger',
      children: locals.error
    }));
  }

  var fieldsetClassName = null;
  if (config.horizontal) {
    fieldsetClassName = config.horizontal.getFieldsetClassName();
  }
  if (locals.className) {
    fieldsetClassName = fieldsetClassName || {};
    fieldsetClassName[locals.className] = true;
  }

  return getFormGroup({
    children: getFieldset({
      className: fieldsetClassName,
      disabled: locals.disabled,
      legend: locals.label,
      children: rows
    })
  });
}

function list(locals) {

  var config = new ListConfig(locals.config || noobj);

  var rows = [];

  if (locals.help) {
    rows.push(getAlert({
      children: locals.help
    }));
  }

  rows = rows.concat(locals.items.map(function (item) {
    if (item.buttons.length === 0) {
      return uform.getRow({
        key: item.key,
        children: [
          getCol({
            breakpoints: {xs: 12},
            children: item.input
          })
        ]
      });
    }
    return uform.getRow({
      key: item.key,
      children: [
        getCol({
          breakpoints: {sm: 8, xs: 6},
          children: item.input
        }),
        getCol({
          breakpoints: {sm: 4, xs: 6},
          children: uform.getButtonGroup(item.buttons.map(function (button, i) {
            return getButton({
              click: button.click,
              key: i,
              label: button.label
            });
          }))
        })
      ]
    });
  }));

  if (locals.error && locals.hasError) {
    rows.push(getAlert({
      type: 'danger',
      children: locals.error
    }));
  }

  if (locals.add) {
    rows.push(getButton(locals.add));
  }

  var fieldsetClassName = null;
  if (config.horizontal) {
    fieldsetClassName = config.horizontal.getFieldsetClassName();
  }
  if (locals.className) {
    fieldsetClassName = fieldsetClassName || {};
    fieldsetClassName[locals.className] = true;
  }

  return getFormGroup({
    children: getFieldset({
      className: fieldsetClassName,
      disabled: locals.disabled,
      legend: locals.label,
      children: rows
    })
  });
}

module.exports = {
  name: 'bootstrap',
  textbox: textbox,
  checkbox: checkbox,
  select: select,
  radio: radio,
  date: date,
  struct: struct,
  list: list
};
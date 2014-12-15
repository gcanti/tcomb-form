'use strict';

var t = require('tcomb-validation');
var theme = require('../protocols/theme');
var Label = theme.Label;
var uform = require('uvdom-bootstrap/form');
var maybe = t.maybe;
var getHelpBlock = uform.getHelpBlock;
var getFieldset = uform.getFieldset;
var getFormGroup = uform.getFormGroup;
var getAddon = uform.getAddon;
var getButton = uform.getButton;
var getCol = uform.getCol;
var getAlert = uform.getAlert;
var getBreakpoints = uform.getBreakpoints;

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
  return t.util.mixin(uform.getOffsets(this.getBreakpoints(1)), getBreakpoints(this.getBreakpoints(1)));
};

Breakpoints.prototype.getFieldsetClassName = function () {
  return {
    'col-xs-12': true
  };
};

var Size = t.enums.of('xs sm md lg', 'Size');

var TextboxConfig = t.struct({
  addonBefore: maybe(Label),
  addonAfter: maybe(Label),
  horizontal: maybe(Breakpoints),
  size: maybe(Size)
}, 'TextboxConfig');

var CheckboxConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'CheckboxConfig');

var SelectConfig = t.struct({
  addonBefore: maybe(Label),
  addonAfter: maybe(Label),
  horizontal: maybe(Breakpoints),
  size: maybe(Size)
}, 'SelectConfig');

var RadioConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'RadioConfig');

var StructConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'StructConfig');

var ListConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'ListConfig');

function getLabel(locals, breakpoints) {
  if (!locals.label) { return; }

  var align = null;
  var className = null;

  if (breakpoints) {
    align = 'right';
    className = breakpoints.getLabelClassName();
  }

  return uform.getLabel({
    label: locals.label,
    align: align,
    className: className
  });
}

function getHelp(locals) {
  if (!locals.help) { return; }
  return getHelpBlock({
    help: locals.help
  });
}

function getError(locals) {
  if (!locals.error) { return; }
  return getHelpBlock({
    help: locals.error,
    hasError: locals.hasError
  });
}

function getHiddenTextbox(locals) {
  return {
    tag: 'input',
    attrs: {
      type: 'hidden',
      value: locals.value,
      name: locals.name,
      ref: locals.ref
    },
    events: {
      change: locals.onChange
    }
  };
}

function textbox(locals) {

  var config = new TextboxConfig(locals.config || {});

  if (locals.type === 'hidden') {
    return getHiddenTextbox(locals);
  }

  var control = uform.getTextbox({
    type: locals.type,
    value: locals.value,
    disabled: locals.disabled,
    onChange: locals.onChange,
    placeholder: locals.placeholder,
    name: locals.name,
    ref: locals.ref,
    size: config.size
  });

  if (config.addonBefore || config.addonAfter) {
    control = uform.getInputGroup([
      config.addonBefore ? getAddon(config.addonBefore) : null,
      control,
      config.addonAfter ? getAddon(config.addonAfter) : null
    ]);
  }

  var horizontal = config.horizontal;
  var label = getLabel(locals, horizontal);
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

  var config = new CheckboxConfig(locals.config || {});

  var control = uform.getCheckbox({
    checked: locals.value,
    disabled: locals.disabled,
    label: locals.label,
    name: locals.name,
    onChange: locals.onChange
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

  var config = new SelectConfig(locals.config || {});

  var options = locals.options.map(function (x) {
    return theme.Option.is(x) ? uform.getOption(x) : uform.getOptGroup(x);
  });

  var control = uform.getSelect({
    value: locals.value,
    disabled: locals.disabled,
    name: locals.name,
    onChange: locals.onChange,
    options: options,
    size: config.size
  });

  var horizontal = config.horizontal;
  var label = getLabel(locals, horizontal);
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

  var config = new RadioConfig(locals.config || {});

  var control = locals.options.map(function (option, i) {
    return uform.getRadio({
      checked: (option.value === locals.value),
      disabled: option.disabled || locals.disabled,
      label: option.text,
      name: locals.name,
      onChange: function (evt) {
        locals.onChange(option.value);
      },
      value: option.value
    });
  });

  var horizontal = config.horizontal;
  var label = getLabel(locals, horizontal);
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

  var config = new StructConfig(locals.config || {});

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

  return getFormGroup({
    children: getFieldset({
      className: config.horizontal && config.horizontal.getFieldsetClassName(),
      disabled: locals.disabled,
      legend: locals.label,
      children: rows
    })
  });
}

function list(locals) {

  var config = new ListConfig(locals.config || {});

  var rows = [];

  if (locals.help) {
    rows.push(getAlert({
      children: locals.help
    }));
  }

  rows = rows.concat(locals.items.map(function (item) {
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

  return getFormGroup({
    children: getFieldset({
      className: config.horizontal && config.horizontal.getFieldsetClassName(),
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
  struct: struct,
  list: list
};
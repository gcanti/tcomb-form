'use strict';

var t = require('tcomb-validation');
var theme = require('../protocols/theme');
var Label = theme.Label;
var uform = require('uvdom-bootstrap/form');
var getHelpBlock = uform.getHelpBlock;
var getFieldset = uform.getFieldset;
var getFormGroup = uform.getFormGroup;
var getAddon = uform.getAddon;
var getRow = uform.getRow;
var getCol = uform.getCol;
var getButton = uform.getButton;
var getBreakpoints = uform.getBreakpoints;
var getOffsets = uform.getOffsets;

var Positive = t.subtype(t.Num, function (n) {
  return n % 1 === 0 && n >= 0;
}, 'Positive');

var Cols = t.subtype(t.tuple([Positive, Positive]), function (cols) {
  return cols[0] + cols[1] === 12;
}, 'Cols');

var Breakpoints = t.struct({
  xs: t.maybe(Cols),
  sm: t.maybe(Cols),
  md: t.maybe(Cols),
  lg: t.maybe(Cols)
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
  return t.util.mixin(getOffsets(this.getBreakpoints(1)), getBreakpoints(this.getBreakpoints(1)));
};

var TextboxConfig = t.struct({
  addonBefore: t.maybe(Label),
  addonAfter: t.maybe(Label),
  horizontal: t.maybe(Breakpoints)
}, 'TextboxConfig');

var CheckboxConfig = t.struct({
  horizontal: t.maybe(Breakpoints)
}, 'CheckboxConfig');

var SelectConfig = t.struct({
  addonBefore: t.maybe(Label),
  addonAfter: t.maybe(Label),
  horizontal: t.maybe(Breakpoints)
}, 'SelectConfig');

var RadioConfig = t.struct({
  horizontal: t.maybe(Breakpoints)
}, 'RadioConfig');

var StructConfig = t.struct({
  horizontal: t.maybe(Breakpoints)
}, 'StructConfig');

var ListConfig = t.struct({
  horizontal: t.maybe(Breakpoints)
}, 'ListConfig');

function getLabel(locals, horizontal) {
  if (!locals.label) { return; }

  var align = null;
  var className = null;

  if (horizontal) {
    align = 'right';
    className = horizontal.getLabelClassName();
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

function textbox(locals) {

  if (locals.type === 'hidden') {
    return {
      tag: 'input',
      attrs: {
        type: 'hidden',
        name: locals.name,
        defaultValue: locals.value,
        ref: locals.ref
      }
    };
  }

  var control = uform.getTextbox({
    type: locals.type,
    defaultValue: locals.value,
    name: locals.name,
    disabled: locals.disabled,
    readOnly: locals.readOnly,
    placeholder: locals.placeholder,
    ref: locals.ref
  });

  var config = new TextboxConfig(locals.config || {});

  // handle addonBefore / addonAfter
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
  var children;

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
  } else {
    children = [
      label,
      control,
      error,
      help
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
    name: locals.name,
    defaultChecked: locals.value,
    ref: locals.ref,
    label: locals.label
  });

  var error = getError(locals);
  var help = getHelp(locals);
  var children = {
    tag: 'div',
    attrs: {
      className: {
        'checkbox': true
      }
    },
    children: [
      control,
      error,
      help
    ]
  };

  var horizontal = config.horizontal;
  if (horizontal) {
    children = {
      tag: 'div',
      attrs: {
        className: horizontal.getOffsetClassName()
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
    name: locals.name,
    defaultValue: locals.value,
    disabled: locals.disabled,
    ref: locals.ref,
    options: options
  });
  var horizontal = config.horizontal;
  var label = getLabel(locals, horizontal);
  var error = getError(locals);
  var help = getHelp(locals);
  var children;

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
  } else {
    children = [
      label,
      control,
      error,
      help
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
      name: locals.name,
      value: option.value,
      label: option.text,
      defaultChecked: (option.value === locals.value),
      ref: locals.ref + i
    });
  });

  var horizontal = config.horizontal;
  var label = getLabel(locals, horizontal);
  var error = getError(locals);
  var help = getHelp(locals);
  var children;

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
  } else {
    children = [
      label,
      control,
      error,
      help
    ];
  }

  return getFormGroup({
    hasError: locals.hasError,
    children: children
  });

}

function struct(locals) {

  var config = new StructConfig(locals.config || {});

  // FIXME handle help and error

  var groups = locals.order.map(function (name) {
    // handle verbatims
    return locals.inputs.hasOwnProperty(name) ?
      locals.inputs[name] :
      name;
  });

  return getFormGroup({
    hasError: locals.hasError,
    children: getFieldset({
      className: {
        'col-xs-12': !!config.horizontal
      },
      legend: locals.label,
      children: groups
    })
  });
}

function list(locals) {

  var config = new ListConfig(locals.config || {});

  // FIXME handle help and error

  var rows = locals.items.map(function (item) {
    return getRow({
      key: item.key,
      children: [
        getCol({
          breakpoints: {xs: 6},
          children: item.input
        }),
        getCol({
          breakpoints: {xs: 6},
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
  });

  if (locals.add) {
    rows.push(getButton(locals.add));
  }

  return getFormGroup({
    hasError: locals.hasError,
    children: getFieldset({
      className: {
        'col-xs-12': !!config.horizontal
      },
      legend: locals.label,
      children: rows
    })
  });
}

module.exports = {
  textbox: textbox,
  checkbox: checkbox,
  select: select,
  radio: radio,
  struct: struct,
  list: list
};
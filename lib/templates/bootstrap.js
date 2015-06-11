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

var _uvdomBootstrap = require('uvdom-bootstrap');

var _uvdomBootstrap2 = _interopRequireDefault(_uvdomBootstrap);

var Any = _tcombValidation2['default'].Any;
var maybe = _tcombValidation2['default'].maybe;
var noobj = {};

var Positive = _tcombValidation2['default'].subtype(_tcombValidation2['default'].Num, function (n) {
  return n % 1 === 0 && n >= 0;
}, 'Positive');

var Cols = _tcombValidation2['default'].tuple([Positive, Positive], 'Cols');

var Breakpoints = _tcombValidation2['default'].struct({
  xs: maybe(Cols),
  sm: maybe(Cols),
  md: maybe(Cols),
  lg: maybe(Cols)
}, 'Breakpoints');

Breakpoints.prototype.getBreakpoints = function (index) {
  var breakpoints = {};
  for (var size in this) {
    if (this.hasOwnProperty(size) && !_tcombValidation2['default'].Nil.is(this[size])) {
      breakpoints[size] = this[size][index];
    }
  }
  return breakpoints;
};

Breakpoints.prototype.getLabelClassName = function () {
  return _uvdomBootstrap2['default'].getBreakpoints(this.getBreakpoints(0));
};

Breakpoints.prototype.getInputClassName = function () {
  return _uvdomBootstrap2['default'].getBreakpoints(this.getBreakpoints(1));
};

Breakpoints.prototype.getOffsetClassName = function () {
  return _tcombValidation2['default'].mixin(_uvdomBootstrap2['default'].getOffsets(this.getBreakpoints(1)), _uvdomBootstrap2['default'].getBreakpoints(this.getBreakpoints(1)));
};

Breakpoints.prototype.getFieldsetClassName = function () {
  return {
    'col-xs-12': true
  };
};

var Size = _tcombValidation2['default'].enums.of('xs sm md lg', 'Size');

var TextboxConfig = _tcombValidation2['default'].struct({
  addonBefore: Any,
  addonAfter: Any,
  horizontal: maybe(Breakpoints),
  size: maybe(Size),
  buttonBefore: Any,
  buttonAfter: Any
}, 'TextboxConfig');

var CheckboxConfig = _tcombValidation2['default'].struct({
  horizontal: maybe(Breakpoints)
}, 'CheckboxConfig');

var SelectConfig = _tcombValidation2['default'].struct({
  addonBefore: Any,
  addonAfter: Any,
  horizontal: maybe(Breakpoints),
  size: maybe(Size)
}, 'SelectConfig');

var RadioConfig = _tcombValidation2['default'].struct({
  horizontal: maybe(Breakpoints)
}, 'RadioConfig');

var DateConfig = _tcombValidation2['default'].struct({
  horizontal: maybe(Breakpoints)
}, 'DateConfig');

var StructConfig = _tcombValidation2['default'].struct({
  horizontal: maybe(Breakpoints)
}, 'StructConfig');

var ListConfig = _tcombValidation2['default'].struct({
  horizontal: maybe(Breakpoints)
}, 'ListConfig');

function getLabel(_ref) {
  var label = _ref.label;
  var breakpoints = _ref.breakpoints;
  var htmlFor = _ref.htmlFor;
  var id = _ref.id;
  var align = _ref.align;

  if (!label) {
    return;
  }

  var className = breakpoints ? breakpoints.getLabelClassName() : null;

  return _uvdomBootstrap2['default'].getLabel({
    align: align,
    className: className,
    htmlFor: htmlFor,
    id: id,
    label: label
  });
}

function getHelp(_ref2) {
  var help = _ref2.help;
  var attrs = _ref2.attrs;

  if (!help) {
    return;
  }
  return _uvdomBootstrap2['default'].getHelpBlock({
    help: help,
    id: attrs.id + '-tip'
  });
}

function getError(_ref3) {
  var hasError = _ref3.hasError;
  var error = _ref3.error;

  if (!hasError || !error) {
    return;
  }
  return _uvdomBootstrap2['default'].getErrorBlock({
    error: error,
    hasError: hasError
  });
}

function getHiddenTextbox(_ref4) {
  var value = _ref4.value;
  var name = _ref4.name;

  return {
    tag: 'input',
    attrs: {
      type: 'hidden',
      value: value,
      name: name
    }
  };
}

function getInputGroupButton(button) {
  return {
    tag: 'div',
    attrs: {
      className: {
        'input-group-btn': true
      }
    },
    children: button
  };
}

function textbox(locals) {

  var config = new TextboxConfig(locals.config || noobj);

  if (locals.type === 'hidden') {
    return getHiddenTextbox(locals);
  }

  var attrs = _tcombValidation2['default'].mixin({}, locals.attrs);
  var control = undefined;

  if (locals.type === 'static') {
    control = _uvdomBootstrap2['default'].getStatic(locals.value);
  } else {

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

    control = {
      tag: tag,
      attrs: attrs
    };
    if (config.addonBefore || config.addonAfter || config.buttonBefore || config.buttonAfter) {
      control = _uvdomBootstrap2['default'].getInputGroup([config.buttonBefore ? getInputGroupButton(config.buttonBefore) : null, config.addonBefore ? _uvdomBootstrap2['default'].getAddon(config.addonBefore) : null, control, config.addonAfter ? _uvdomBootstrap2['default'].getAddon(config.addonAfter) : null, config.buttonAfter ? getInputGroupButton(config.buttonAfter) : null]);
    }
  }

  var horizontal = config.horizontal;
  var label = getLabel({
    label: locals.label,
    htmlFor: attrs.id,
    breakpoints: config.horizontal
  });
  var error = getError(locals);
  var help = getHelp(locals);

  var children = [label, control, error, help];

  if (horizontal) {
    children = [label, {
      tag: 'div',
      attrs: {
        className: label ? horizontal.getInputClassName() : horizontal.getOffsetClassName()
      },
      children: [control, error, help]
    }];
  }

  return _uvdomBootstrap2['default'].getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children: children
  });
}

function checkbox(locals) {

  var config = new CheckboxConfig(locals.config || noobj);

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

  var control = _uvdomBootstrap2['default'].getCheckbox(attrs, locals.label);

  var error = getError(locals);
  var help = getHelp(locals);
  var children = [control, error, help];

  if (config.horizontal) {
    children = {
      tag: 'div',
      attrs: {
        className: config.horizontal.getOffsetClassName()
      },
      children: children
    };
  }

  return _uvdomBootstrap2['default'].getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children: children
  });
}

function select(locals) {

  var config = new SelectConfig(locals.config || noobj);

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
    return x.label ? _uvdomBootstrap2['default'].getOptGroup(x) : _uvdomBootstrap2['default'].getOption(x);
  });

  var control = {
    tag: 'select',
    attrs: attrs,
    children: options
  };

  var horizontal = config.horizontal;
  var label = getLabel({
    label: locals.label,
    htmlFor: attrs.id,
    breakpoints: config.horizontal
  });
  var error = getError(locals);
  var help = getHelp(locals);
  var children = [label, control, error, help];

  if (horizontal) {
    children = [label, {
      tag: 'div',
      attrs: {
        className: label ? horizontal.getInputClassName() : horizontal.getOffsetClassName()
      },
      children: [control, error, help]
    }];
  }

  return _uvdomBootstrap2['default'].getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children: children
  });
}

function radio(locals) {

  var config = new RadioConfig(locals.config || noobj);

  var id = locals.attrs.id;
  var onChange = function onChange(evt) {
    return locals.onChange(evt.target.value);
  };

  var controls = locals.options.map(function (option, i) {

    var attrs = _tcombValidation2['default'].mixin({}, locals.attrs);
    attrs.type = 'radio';
    attrs.checked = option.value === locals.value;
    attrs.disabled = locals.disabled;
    attrs.value = option.value;
    attrs.autoFocus = attrs.autoFocus && i === 0;
    attrs.id = '' + id + '_' + i;
    attrs['aria-describedby'] = attrs['aria-describedby'] || (locals.label ? id : null);
    attrs.onChange = onChange;

    return _uvdomBootstrap2['default'].getRadio(attrs, option.text, option.value);
  });

  var horizontal = config.horizontal;
  var label = getLabel({
    label: locals.label,
    id: id,
    breakpoints: config.horizontal
  });
  var error = getError(locals);
  var help = getHelp(locals);
  var children = [label, controls, error, help];

  if (horizontal) {
    children = [label, {
      tag: 'div',
      attrs: {
        className: label ? horizontal.getInputClassName() : horizontal.getOffsetClassName()
      },
      children: [controls, error, help]
    }];
  }

  return _uvdomBootstrap2['default'].getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children: children
  });
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
          disabled: locals.disabled,
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
          disabled: locals.disabled,
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
          disabled: locals.disabled,
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
    breakpoints: config.horizontal
  });
  var error = getError(locals);
  var help = getHelp(locals);
  var children = [label, control, error, help];

  if (horizontal) {
    children = [label, {
      tag: 'div',
      attrs: {
        className: label ? horizontal.getInputClassName() : horizontal.getOffsetClassName()
      },
      children: [control, error, help]
    }];
  }

  return _uvdomBootstrap2['default'].getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children: children
  });
}

function struct(locals) {

  var config = new StructConfig(locals.config || noobj);
  var children = [];

  if (locals.help) {
    children.push(_uvdomBootstrap2['default'].getAlert({
      children: locals.help
    }));
  }

  if (locals.error && locals.hasError) {
    children.push(_uvdomBootstrap2['default'].getAlert({
      type: 'danger',
      children: locals.error
    }));
  }

  children = children.concat(locals.order.map(function (name) {
    return locals.inputs[name];
  }));

  var className = null;
  if (config.horizontal) {
    className = config.horizontal.getFieldsetClassName();
  }
  if (locals.className) {
    className = className || {};
    className[locals.className] = true;
  }

  return _uvdomBootstrap2['default'].getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    children: _uvdomBootstrap2['default'].getFieldset({
      className: className,
      disabled: locals.disabled,
      legend: locals.label,
      children: children
    })
  });
}

function list(locals) {

  var config = new ListConfig(locals.config || noobj);
  var children = [];

  if (locals.help) {
    children.push(_uvdomBootstrap2['default'].getAlert({
      children: locals.help
    }));
  }

  if (locals.error && locals.hasError) {
    children.push(_uvdomBootstrap2['default'].getAlert({
      type: 'danger',
      children: locals.error
    }));
  }

  children = children.concat(locals.items.map(function (item) {
    if (item.buttons.length === 0) {
      return _uvdomBootstrap2['default'].getRow({
        key: item.key,
        children: [_uvdomBootstrap2['default'].getCol({
          breakpoints: { xs: 12 },
          children: item.input
        })]
      });
    }
    return _uvdomBootstrap2['default'].getRow({
      key: item.key,
      children: [_uvdomBootstrap2['default'].getCol({
        breakpoints: { sm: 8, xs: 6 },
        children: item.input
      }), _uvdomBootstrap2['default'].getCol({
        breakpoints: { sm: 4, xs: 6 },
        children: _uvdomBootstrap2['default'].getButtonGroup(item.buttons.map(function (button, i) {
          return _uvdomBootstrap2['default'].getButton({
            click: button.click,
            key: i,
            label: button.label
          });
        }))
      })]
    });
  }));

  if (locals.add) {
    children.push(_uvdomBootstrap2['default'].getButton(locals.add));
  }

  var fieldsetClassName = null;
  if (config.horizontal) {
    fieldsetClassName = config.horizontal.getFieldsetClassName();
  }
  if (locals.className) {
    fieldsetClassName = fieldsetClassName || {};
    fieldsetClassName[locals.className] = true;
  }

  return _uvdomBootstrap2['default'].getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    children: _uvdomBootstrap2['default'].getFieldset({
      className: fieldsetClassName,
      disabled: locals.disabled,
      legend: locals.label,
      children: children
    })
  });
}
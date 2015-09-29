'use strict';

import t from 'tcomb-validation';
import bootstrap from 'uvdom-bootstrap';

const Any = t.Any;
const maybe = t.maybe;
const noobj = {};

const Positive = t.subtype(t.Num, function (n) {
  return n % 1 === 0 && n >= 0;
}, 'Positive');

const Cols = t.tuple([Positive, Positive], 'Cols');

const Breakpoints = t.struct({
  xs: maybe(Cols),
  sm: maybe(Cols),
  md: maybe(Cols),
  lg: maybe(Cols)
}, 'Breakpoints');

Breakpoints.prototype.getBreakpoints = function (index) {
  const breakpoints = {};
  for (const size in this) {
    if (this.hasOwnProperty(size) && !t.Nil.is(this[size])) {
      breakpoints[size] = this[size][index];
    }
  }
  return breakpoints;
};

Breakpoints.prototype.getLabelClassName = function () {
  return bootstrap.getBreakpoints(this.getBreakpoints(0));
};

Breakpoints.prototype.getInputClassName = function () {
  return bootstrap.getBreakpoints(this.getBreakpoints(1));
};

Breakpoints.prototype.getOffsetClassName = function () {
  return t.mixin(bootstrap.getOffsets(this.getBreakpoints(1)), bootstrap.getBreakpoints(this.getBreakpoints(1)));
};

const Size = t.enums.of('xs sm md lg', 'Size');

const TextboxConfig = t.struct({
  addonBefore: Any,
  addonAfter: Any,
  horizontal: maybe(Breakpoints),
  size: maybe(Size),
  buttonBefore: Any,
  buttonAfter: Any
}, 'TextboxConfig');

const CheckboxConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'CheckboxConfig');

const SelectConfig = t.struct({
  addonBefore: Any,
  addonAfter: Any,
  horizontal: maybe(Breakpoints),
  size: maybe(Size)
}, 'SelectConfig');

const RadioConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'RadioConfig');

const DateConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'DateConfig');

const StructConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'StructConfig');

const ListConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'ListConfig');

function getLabel({label, breakpoints, htmlFor, id, align}) {
  if (!label) { return; }

  const className = breakpoints ? breakpoints.getLabelClassName() : null;

  return bootstrap.getLabel({
    align,
    className,
    htmlFor,
    id,
    label
  });
}

function getHelp({help, attrs}) {
  if (!help) { return; }
  return bootstrap.getHelpBlock({
    help,
    id: attrs.id + '-tip'
  });
}

function getError({hasError, error}) {
  if (!hasError || !error) { return; }
  return bootstrap.getErrorBlock({
    error,
    hasError
  });
}

function getHiddenTextbox({value, name}) {
  return {
    tag: 'input',
    attrs: {
      type: 'hidden',
      value,
      name
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

export function textbox(locals) {

  const config = new TextboxConfig(locals.config || noobj);

  if (locals.type === 'hidden') {
    return getHiddenTextbox(locals);
  }

  const attrs = t.mixin({}, locals.attrs);
  let control;

  if (locals.type === 'static') {
    control = bootstrap.getStatic(locals.value);
  } else {

    let tag = 'textarea';
    if (locals.type !== 'textarea') {
      tag = 'input';
      attrs.type = locals.type;
    }

    attrs.className = t.mixin({}, attrs.className);
    attrs.className['form-control'] = true;

    attrs.disabled = locals.disabled;
    if (locals.type !== 'file') {
      attrs.value = locals.value;
    }
    attrs.onChange = locals.type === 'file' ?
      evt => locals.onChange(evt.target.files[0]) :
      evt => locals.onChange(evt.target.value);

    if (locals.help) {
      attrs['aria-describedby'] = attrs['aria-describedby'] || attrs.id + '-tip';
    }

    control = {
      tag,
      attrs: attrs
    };
    if (config.addonBefore || config.addonAfter || config.buttonBefore || config.buttonAfter) {
      control = bootstrap.getInputGroup([
        config.buttonBefore ? getInputGroupButton(config.buttonBefore) : null,
        config.addonBefore ? bootstrap.getAddon(config.addonBefore) : null,
        control,
        config.addonAfter ? bootstrap.getAddon(config.addonAfter) : null,
        config.buttonAfter ? getInputGroupButton(config.buttonAfter) : null
      ]);
    }
  }

  const horizontal = config.horizontal;
  const label = getLabel({
    label: locals.label,
    htmlFor: attrs.id,
    breakpoints: config.horizontal
  });
  const error = getError(locals);
  const help = getHelp(locals);

  let children = [
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

  return bootstrap.getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children
  });

}

export function checkbox(locals) {

  const config = new CheckboxConfig(locals.config || noobj);

  const attrs = t.mixin({}, locals.attrs);
  attrs.type = 'checkbox';
  attrs.disabled = locals.disabled;
  attrs.checked = locals.value;
  attrs.onChange = evt => locals.onChange(evt.target.checked);

  if (locals.help) {
    attrs['aria-describedby'] = attrs['aria-describedby'] || (attrs.id + '-tip');
  }

  const control = bootstrap.getCheckbox(attrs, locals.label);

  const error = getError(locals);
  const help = getHelp(locals);
  let children = [
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

  return bootstrap.getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children
  });

}

export function select(locals) {

  const config = new SelectConfig(locals.config || noobj);

  const attrs = t.mixin({}, locals.attrs);

  attrs.className = t.mixin({}, attrs.className);
  attrs.className['form-control'] = true;

  attrs.multiple = locals.isMultiple;
  attrs.disabled = locals.disabled;
  attrs.value = locals.value;
  attrs.onChange = evt => {
    const value = locals.isMultiple ?
      Array.prototype.slice.call(evt.target.options)
        .filter(option => option.selected)
        .map(option => option.value) :
      evt.target.value;
    locals.onChange(value);
  };

  if (locals.help) {
    attrs['aria-describedby'] = attrs['aria-describedby'] || (attrs.id + '-tip');
  }

  const options = locals.options.map(x => x.label ?
    bootstrap.getOptGroup(x) :
    bootstrap.getOption(x)
  );

  const control = {
    tag: 'select',
    attrs,
    children: options
  };

  const horizontal = config.horizontal;
  const label = getLabel({
    label: locals.label,
    htmlFor: attrs.id,
    breakpoints: config.horizontal
  });
  const error = getError(locals);
  const help = getHelp(locals);
  let children = [
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

  return bootstrap.getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children: children
  });

}

export function radio(locals) {

  const config = new RadioConfig(locals.config || noobj);

  const id = locals.attrs.id;
  const onChange = evt => locals.onChange(evt.target.value);

  const controls = locals.options.map((option, i) => {

    const attrs = t.mixin({}, locals.attrs);
    attrs.type = 'radio';
    attrs.checked = (option.value === locals.value);
    attrs.disabled = locals.disabled;
    attrs.value = option.value;
    attrs.autoFocus = attrs.autoFocus && (i === 0);
    attrs.id = `${id}_${i}`;
    attrs['aria-describedby'] = attrs['aria-describedby'] || (locals.label ? id : null);
    attrs.onChange = onChange;

    return bootstrap.getRadio(attrs, option.text, option.value);
  });

  const horizontal = config.horizontal;
  const label = getLabel({
    label: locals.label,
    id,
    breakpoints: config.horizontal
  });
  const error = getError(locals);
  const help = getHelp(locals);
  let children = [
    label,
    controls,
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
          controls,
          error,
          help
        ]
      }
    ];
  }

  return bootstrap.getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children
  });

}

function range(n) {
  var result = [];
  for (var i = 1; i <= n; i++) { result.push(i); }
  return result;
}

function padLeft(x, len) {
  var str = String(x);
  var times = len - str.length;
  for (var i = 0; i < times; i++ ) { str = '0' + str; }
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

export function date(locals) {

  const config = new DateConfig(locals.config || noobj);
  const value = locals.value.slice();

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

  const parts = {

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

  const control = {
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

  const horizontal = config.horizontal;
  const label = getLabel({
    label: locals.label,
    breakpoints: config.horizontal
  });
  const error = getError(locals);
  const help = getHelp(locals);
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

  return bootstrap.getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children: children
  });

}

export function struct(locals) {

  const config = new StructConfig(locals.config || noobj);
  let children = [];

  if (locals.help) {
    children.push(bootstrap.getAlert({
      children: locals.help
    }));
  }

  if (locals.error && locals.hasError) {
    children.push(bootstrap.getAlert({
      type: 'danger',
      children: locals.error
    }));
  }

  children = children.concat(locals.order.map(name => locals.inputs[name]));

  let className = {};
  if (locals.className) {
    className[locals.className] = true;
  }

  return bootstrap.getFieldset({
    className,
    disabled: locals.disabled,
    legend: locals.label,
    children
  });

}

export function list(locals) {

  const config = new ListConfig(locals.config || noobj);
  let children = [];

  if (locals.help) {
    children.push(bootstrap.getAlert({
      children: locals.help
    }));
  }

  if (locals.error && locals.hasError) {
    children.push(bootstrap.getAlert({
      type: 'danger',
      children: locals.error
    }));
  }

  children = children.concat(locals.items.map(function (item) {
    if (item.buttons.length === 0) {
      return bootstrap.getRow({
        key: item.key,
        children: [
          bootstrap.getCol({
            breakpoints: {xs: 12},
            children: item.input
          })
        ]
      });
    }
    return bootstrap.getRow({
      key: item.key,
      children: [
        bootstrap.getCol({
          breakpoints: {sm: 8, xs: 6},
          children: item.input
        }),
        bootstrap.getCol({
          breakpoints: {sm: 4, xs: 6},
          children: bootstrap.getButtonGroup(item.buttons.map(function (button, i) {
            return bootstrap.getButton({
              click: button.click,
              key: i,
              label: button.label
            });
          }))
        })
      ]
    });
  }));

  if (locals.add) {
    children.push({
      tag: 'div',
      attrs: { className: 'row' },
      children: {
        tag: 'div',
        attrs: { className: 'col-lg-12' },
        children: {
          tag: 'div',
          attrs: { style: {marginBottom: '15px'} },
          children: bootstrap.getButton(locals.add)
        }
      }
    });
  }

  let className = {};
  if (locals.className) {
    className[locals.className] = true;
  }

  return bootstrap.getFieldset({
    className,
    disabled: locals.disabled,
    legend: locals.label,
    children
  });

}


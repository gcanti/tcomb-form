'use strict';

var t = require('tcomb-validation');
var bootstrap = require('uvdom-bootstrap');

var Any = t.Any;
var maybe = t.maybe;

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
  return bootstrap.getBreakpoints(this.getBreakpoints(0));
};

Breakpoints.prototype.getInputClassName = function () {
  return bootstrap.getBreakpoints(this.getBreakpoints(1));
};

Breakpoints.prototype.getOffsetClassName = function () {
  return t.mixin(bootstrap.getOffsets(this.getBreakpoints(1)), bootstrap.getBreakpoints(this.getBreakpoints(1)));
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

var StructConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'StructConfig');

var ListConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'ListConfig');

function getLabel({label, breakpoints, htmlFor, id}) {
  if (!label) { return; }

  var align = null;
  var className = null;

  if (breakpoints) {
    align = 'right';
    className = breakpoints.getLabelClassName();
  }

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

function textbox(locals) {

  var config = new TextboxConfig(locals.config || {});

  if (locals.type === 'hidden') {
    return getHiddenTextbox(locals);
  }

  var attrs = locals.attrs;
  var control;

  if (locals.type === 'static') {
    control = bootstrap.getStatic(locals.value);
  } else {

    var tag = 'textarea';
    if (locals.type !== 'textarea') {
      tag = 'input';
      attrs.type = locals.type;
    }

    attrs.className = t.mixin({}, attrs.className);
    attrs.className['form-control'] = true;

    attrs.disabled = locals.disabled;
    attrs.placeholder = locals.placeholder;
    attrs.value = locals.value;
    attrs.onChange = evt => locals.onChange(evt.target.value);

    if (locals.help) {
      attrs['aria-describedby'] = attrs['aria-describedby'] || attrs.id + '-tip';
    }

    control = {
      tag,
      attrs: attrs
    };
    if (config.addonBefore || config.addonAfter) {
      control = bootstrap.getInputGroup([
        config.addonBefore ? bootstrap.getAddon(config.addonBefore) : null,
        control,
        config.addonAfter ? bootstrap.getAddon(config.addonAfter) : null
      ]);
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
    hasError: locals.hasError,
    children
  });

}

function checkbox(locals) {
console.log(locals)
  var config = new CheckboxConfig(locals.config || {});

  var attrs = locals.attrs;
  attrs.type = 'checkbox';
  attrs.disabled = locals.disabled;
  attrs.checked = locals.value;
  attrs.onChange = evt => locals.onChange(evt.target.checked);

  if (locals.help) {
    attrs['aria-describedby'] = attrs['aria-describedby'] || (attrs.id + '-tip');
  }

  var control = bootstrap.getCheckbox(attrs, locals.label);

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

  return bootstrap.getFormGroup({
    hasError: locals.hasError,
    children
  });

}

function select(locals) {

  var config = new SelectConfig(locals.config || {});

  var attrs = locals.attrs;
  var tag = 'textarea';
  if (locals.type !== 'textarea') {
    tag = 'input';
    attrs.type = locals.type;
  }

  attrs.className = t.mixin({}, attrs.className);
  attrs.className['form-control'] = true;

  attrs.disabled = locals.disabled;
  attrs.value = locals.value;
  attrs.onChange = evt => {
    var value = attrs.multiple ?
      Array.prototype.slice.call(evt.target.options)
        .filter(option => option.selected)
        .map(option => option.value) :
      evt.target.value;
    locals.onChange(value);
  };

  if (locals.help) {
    attrs['aria-describedby'] = attrs['aria-describedby'] || (attrs.id + '-tip');
  }

  var options = locals.options.map(x => x.label ?
    bootstrap.getOptGroup(x) :
    bootstrap.getOption(x)
  );

  var control = {
    tag: 'select',
    attrs,
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
    hasError: locals.hasError,
    children: children
  });

}

function radio(locals) {

  var config = new RadioConfig(locals.config || {});

  var id = locals.attrs.id;
  var onChange = evt => locals.onChange(evt.target.value);

  var controls = locals.options.map((option, i) => {

    var attrs = t.mixin({}, locals.attrs);
    attrs.type = 'radio';
    attrs.checked = (option.value === locals.value);
    attrs.disabled = locals.disabled;
    attrs.value = option.value;
    attrs.autoFocus = attrs.autoFocus && (i === 0),
    attrs.id = `${id}_${i}`;
    attrs['aria-describedby'] = attrs['aria-describedby'] || (locals.label ? id : null);
    attrs.onChange = onChange;

    return bootstrap.getRadio(attrs, option.text, option.value);
  });

  var horizontal = config.horizontal;
  var label = getLabel({
    label: locals.label,
    id,
    breakpoints: config.horizontal
  });
  var error = getError(locals);
  var help = getHelp(locals);
  var children = [
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
    hasError: locals.hasError,
    children
  });

}

function struct(locals) {

  var config = new StructConfig(locals.config || {});
  var children = [];

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

  var className = null;
  if (config.horizontal) {
    className = config.horizontal.getFieldsetClassName();
  }
  if (locals.className) {
    className = className || {};
    className[locals.className] = true;
  }

  return bootstrap.getFormGroup({
    children: bootstrap.getFieldset({
      className,
      disabled: locals.disabled,
      legend: locals.legend,
      children
    })
  });

}

function list(locals) {

  var config = new ListConfig(locals.config || {});
  var children = [];

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
          getCol({
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
    children.push(bootstrap.getButton(locals.add));
  }

  var fieldsetClassName = null;
  if (config.horizontal) {
    fieldsetClassName = config.horizontal.getFieldsetClassName();
  }
  if (locals.className) {
    fieldsetClassName = fieldsetClassName || {};
    fieldsetClassName[locals.className] = true;
  }

  return bootstrap.getFormGroup({
    children: bootstrap.getFieldset({
      className: fieldsetClassName,
      disabled: locals.disabled,
      legend: locals.legend,
      children
    })
  });

}

module.exports = {
  textbox,
  checkbox,
  select,
  radio,
  struct,
  list
};
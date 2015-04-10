'use strict';

import t from 'tcomb-validation';
import bootstrap from 'uvdom-bootstrap';

const Any = t.Any;
const maybe = t.maybe;

const Positive = t.subtype(t.Num, function (n) {
  return n % 1 === 0 && n >= 0;
}, 'Positive');

const Cols = t.subtype(t.tuple([Positive, Positive]), function (cols) {
  return cols[0] + cols[1] === 12;
}, 'Cols');

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

Breakpoints.prototype.getFieldsetClassName = function () {
  return {
    'col-xs-12': true
  };
};

const Size = t.enums.of('xs sm md lg', 'Size');

const TextboxConfig = t.struct({
  addonBefore: Any,
  addonAfter: Any,
  horizontal: maybe(Breakpoints),
  size: maybe(Size)
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

const StructConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'StructConfig');

const ListConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'ListConfig');

function getLabel({label, breakpoints, htmlFor, id}) {
  if (!label) { return; }

  let align = null;
  let className = null;

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

export function textbox(locals) {

  const config = new TextboxConfig(locals.config || {});

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

  const config = new CheckboxConfig(locals.config || {});

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

  const config = new SelectConfig(locals.config || {});

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

  const config = new RadioConfig(locals.config || {});

  const id = locals.attrs.id;
  const onChange = evt => locals.onChange(evt.target.value);

  const controls = locals.options.map((option, i) => {

    const attrs = t.mixin({}, locals.attrs);
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

export function struct(locals) {

  const config = new StructConfig(locals.config || {});
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

  let className = null;
  if (config.horizontal) {
    className = config.horizontal.getFieldsetClassName();
  }
  if (locals.className) {
    className = className || {};
    className[locals.className] = true;
  }

  return bootstrap.getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    children: bootstrap.getFieldset({
      className,
      disabled: locals.disabled,
      legend: locals.label,
      children
    })
  });

}

export function list(locals) {

  const config = new ListConfig(locals.config || {});
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

  let fieldsetClassName = null;
  if (config.horizontal) {
    fieldsetClassName = config.horizontal.getFieldsetClassName();
  }
  if (locals.className) {
    fieldsetClassName = fieldsetClassName || {};
    fieldsetClassName[locals.className] = true;
  }

  return bootstrap.getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    children: bootstrap.getFieldset({
      className: fieldsetClassName,
      disabled: locals.disabled,
      legend: locals.label,
      children
    })
  });

}


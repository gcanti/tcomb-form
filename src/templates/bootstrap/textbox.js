import t from 'tcomb-validation';
import bootstrap from 'uvdom-bootstrap';
import Breakpoints from './Breakpoints';
import Size from './Size';
import getLabel from './getLabel';
import getError from './getError';
import getHelp from './getHelp';

const TextboxConfig = t.struct({
  addonBefore: t.Any,
  addonAfter: t.Any,
  horizontal: t.maybe(Breakpoints),
  size: t.maybe(Size),
  buttonBefore: t.Any,
  buttonAfter: t.Any
}, 'TextboxConfig');

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

export default function textbox(locals) {

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


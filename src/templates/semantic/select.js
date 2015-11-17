import t from 'tcomb-validation';
import getLabel from './getLabel';
import getError from './getError';
import getHelp from './getHelp';

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

export default function select(locals) {

  const attrs = t.mixin({}, locals.attrs);

  attrs.className = t.mixin({}, attrs.className);

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
    getOptGroup(x) :
    getOption(x)
  );

  const control = {
    tag: 'select',
    attrs,
    children: options
  };

  const label = getLabel({
    label: locals.label,
    htmlFor: attrs.id
  });
  const help = getHelp(locals);
  const error = getError(locals);
  const config = locals.config || {};

  return {
    tag: 'div',
    attrs: {
      className: {
        field: true,
        error: locals.hasError,
        disabled: locals.disabled,
        [`${config.wide} wide`]: !t.Nil.is(config.wide)
      }
    },
    children: [
      label,
      control,
      help,
      error
    ]
  };
}

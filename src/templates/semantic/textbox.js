import t from 'tcomb-validation';
import getLabel from './getLabel';
import getError from './getError';
import getHelp from './getHelp';

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

export default function textbox(locals) {

  if (locals.type === 'hidden') {
    return getHiddenTextbox(locals);
  }

  const attrs = t.mixin({}, locals.attrs);

  let tag = 'textarea';
  if (locals.type !== 'textarea') {
    tag = 'input';
    attrs.type = locals.type;
  }

  attrs.className = t.mixin({}, attrs.className);

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

  const control = {
    tag,
    attrs: attrs
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

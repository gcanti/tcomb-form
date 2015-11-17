import t from 'tcomb-validation';
import getLabel from './getLabel';
import getError from './getError';
import getHelp from './getHelp';

export default function checkbox(locals) {

  const attrs = t.mixin({}, locals.attrs);
  attrs.type = 'checkbox';
  attrs.disabled = locals.disabled;
  attrs.checked = locals.value;
  attrs.onChange = evt => locals.onChange(evt.target.checked);

  if (locals.help) {
    attrs['aria-describedby'] = attrs['aria-describedby'] || (attrs.id + '-tip');
  }

  const control = {
    tag: 'input',
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
        inline: true,
        error: locals.hasError,
        disabled: locals.disabled,
        [`${config.wide} wide`]: !t.Nil.is(config.wide)
      }
    },
    children: {
      tag: 'div',
      attrs: {
        className: {
          ui: true,
          checkbox: true
        }
      },
      children: [
        control,
        label,
        help,
        error
      ]
    }
  };
}

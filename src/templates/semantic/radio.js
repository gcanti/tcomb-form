import t from 'tcomb-validation';
import getLabel from './getLabel';
import getError from './getError';
import getHelp from './getHelp';

export default function radio(locals) {

  const id = locals.attrs.id;
  const onChange = evt => locals.onChange(evt.target.value);

  var control = {
    tag: 'div',
    attrs: {
      className: {
        fields: true,
        grouped: true
      }
    },
    children: locals.options.map(function (option, i) {

      const attrs = t.mixin({}, locals.attrs);
      attrs.type = 'radio';
      attrs.checked = (option.value === locals.value);
      attrs.disabled = locals.disabled;
      attrs.value = option.value;
      attrs.autoFocus = attrs.autoFocus && (i === 0);
      attrs.id = `${id}_${i}`;
      attrs['aria-describedby'] = attrs['aria-describedby'] || (locals.label ? id : null);
      attrs.onChange = onChange;

      return {
        tag: 'div',
        attrs: {
          className: {
            field: true
          }
        },
        children: {
          tag: 'div',
          attrs: {
            className: {
              ui: true,
              radio: true,
              checkbox: true
            }
          },
          children: [
            {
              tag: 'input',
              attrs: attrs
            },
            {
              tag: 'label',
              children: option.text,
              events: {
                click: function () {
                  document.getElementById(attrs.id).click();
                }
              }
            }
          ],
        },
        key: option.value
      };
    })
  };

  const label = getLabel({
    label: locals.label,
    htmlFor: id
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

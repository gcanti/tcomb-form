import t from 'tcomb-validation';
import { compile } from 'uvdom/react';
import getLabel from './getLabel';
import getError from './getError';
import getHelp from './getHelp';

function create(overrides = {}) {

  function radio(locals) {
    return radio.renderVertical(locals);
  }

  radio.renderRadios = overrides.renderRadios || function renderRadios(locals) {
    const id = locals.attrs.id;
    const onChange = evt => locals.onChange(evt.target.value);
    return locals.options.map((option, i) => {

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
    });
  };

  radio.renderLabel = overrides.renderLabel || function renderLabel(locals) {
    return getLabel({
      label: locals.label,
      htmlFor: locals.attrs.id,
      breakpoints: locals.config.horizontal
    });
  };

  radio.renderError = overrides.renderError || function renderError(locals) {
    return getError(locals);
  };

  radio.renderHelp = overrides.renderHelp || function renderHelp(locals) {
    return getHelp(locals);
  };

  radio.renderVertical = overrides.renderVertical || function renderVertical(locals) {
    return {
      tag: 'div',
      attrs: {
        className: {
          field: true,
          error: locals.hasError,
          disabled: locals.disabled,
          [`${locals.config.wide} wide`]: !t.Nil.is(locals.config.wide)
        }
      },
      children: [
      radio.renderLabel(locals),
      radio.renderRadios(locals),
      radio.renderError(locals),
      radio.renderHelp(locals)
      ]
    };
  };

  radio.clone = function clone(newOverrides = {}) {
    return create({...overrides, ...newOverrides});
  };

  radio.toReactElement = compile;

  return radio;
}

export default create();

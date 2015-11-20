import t from 'tcomb-validation';
import { compile } from 'uvdom/react';
import getLabel from './getLabel';
import getError from './getError';
import getHelp from './getHelp';

function create(overrides = {}) {

  function textbox(locals) {

    locals.attrs = textbox.getAttrs(locals);

    if (locals.type === 'hidden') {
      return textbox.renderHiddenTextbox(locals);
    }

    return textbox.renderVertical(locals);
  }

  textbox.getAttrs = overrides.getAttrs || function getAttrs(locals) {
    const attrs = t.mixin({}, locals.attrs);
    attrs.type = locals.type;
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
    return attrs;
  };

  textbox.renderHiddenTextbox = overrides.renderHiddenTextbox || function renderHiddenTextbox(locals) {
    return {
      tag: 'input',
      attrs: {
        type: 'hidden',
        value: locals.value,
        name: locals.name
      }
    };
  };

  textbox.renderStatic = overrides.renderStatic || function renderStatic(locals) {
    return locals.value;
  };

  textbox.renderTextbox = overrides.renderTextbox || function renderTextbox(locals) {
    if (locals.type === 'static') {
      return textbox.renderStatic(locals);
    }
    return locals.type !== 'textarea' ?
      textbox.renderInput(locals) :
      textbox.renderTextarea(locals);
  };

  textbox.renderInput = overrides.renderInput || function renderInput(locals) {
    return {
      tag: 'input',
      attrs: locals.attrs
    };
  };

  textbox.renderTextarea = overrides.renderTextarea || function renderTextarea(locals) {
    return {
      tag: 'textarea',
      attrs: locals.attrs
    };
  };

  textbox.renderLabel = overrides.renderLabel || function renderLabel(locals) {
    return getLabel({
      label: locals.label,
      htmlFor: locals.attrs.id,
      breakpoints: locals.config.horizontal
    });
  };

  textbox.renderError = overrides.renderError || function renderError(locals) {
    return getError(locals);
  };

  textbox.renderHelp = overrides.renderHelp || function renderHelp(locals) {
    return getHelp(locals);
  };

  textbox.renderVertical = overrides.renderVertical || function renderVertical(locals) {
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
      textbox.renderLabel(locals),
      textbox.renderTextbox(locals),
      textbox.renderError(locals),
      textbox.renderHelp(locals)
      ]
    };
  };

  textbox.clone = function clone(newOverrides = {}) {
    return create({...overrides, ...newOverrides});
  };

  textbox.toReactElement = compile;

  return textbox;
}

export default create();

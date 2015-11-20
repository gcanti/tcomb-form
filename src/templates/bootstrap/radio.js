import t from 'tcomb-validation';
import { compile } from 'uvdom/react';
import bootstrap from 'uvdom-bootstrap';
import Breakpoints from './Breakpoints';
import getLabel from './getLabel';
import getError from './getError';
import getHelp from './getHelp';

const RadioConfig = t.struct({
  horizontal: t.maybe(Breakpoints)
}, 'RadioConfig');

function create(overrides = {}) {

  function radio(locals) {

    locals.config = radio.getConfig(locals);

    const children = locals.config.horizontal ?
      radio.renderHorizontal(locals) :
      radio.renderVertical(locals);

    return radio.renderFormGroup(children, locals);
  }

  radio.getConfig = overrides.getConfig || function getConfig(locals) {
    return new RadioConfig(locals.config || {});
  };

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

      return bootstrap.getRadio(attrs, option.text, option.value);
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
    return [
      radio.renderLabel(locals),
      radio.renderRadios(locals),
      radio.renderError(locals),
      radio.renderHelp(locals)
    ];
  };

  radio.renderHorizontal = overrides.renderHorizontal || function renderHorizontal(locals) {
    const label = radio.renderLabel(locals);
    return [
      label,
      {
        tag: 'div',
        attrs: {
          className: label ? locals.config.horizontal.getInputClassName() : locals.config.horizontal.getOffsetClassName()
        },
        children: [
          radio.renderRadios(locals),
          radio.renderError(locals),
          radio.renderHelp(locals)
        ]
      }
    ];
  };

  radio.renderFormGroup = overrides.renderFormGroup || function renderFormGroup(children, locals) {
    return bootstrap.getFormGroup({
      className: 'form-group-depth-' + locals.path.length,
      hasError: locals.hasError,
      children
    });
  };

  radio.clone = function clone(newOverrides = {}) {
    return create({...overrides, ...newOverrides});
  };

  radio.toReactElement = compile;

  return radio;
}

export default create();

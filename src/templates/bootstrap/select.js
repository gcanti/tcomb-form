import t from 'tcomb-validation';
import bootstrap from 'uvdom-bootstrap';
import Breakpoints from './Breakpoints';
import Size from './Size';
import getLabel from './getLabel';
import getError from './getError';
import getHelp from './getHelp';

const SelectConfig = t.struct({
  addonBefore: t.Any,
  addonAfter: t.Any,
  horizontal: t.maybe(Breakpoints),
  size: t.maybe(Size)
}, 'SelectConfig');

export default function select(locals) {

  locals.config = select.getConfig(locals);
  locals.attrs = select.getAttrs(locals);

  const children = locals.config.horizontal ?
    select.renderHorizontal(locals) :
    select.renderVertical(locals);

  return select.renderFormGroup(children, locals);
}

select.getConfig = function (locals) {
  return new SelectConfig(locals.config || {});
};

select.getAttrs = function (locals) {
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
  return attrs;
};

select.renderOptions = function (locals) {
  return locals.options.map(x => x.label ?
    bootstrap.getOptGroup(x) :
    bootstrap.getOption(x)
  );
};

select.renderSelect = function (locals) {
  return {
    tag: 'select',
    attrs: locals.attrs,
    children: select.renderOptions(locals)
  };
};

select.renderLabel = function (locals) {
  return getLabel({
    label: locals.label,
    htmlFor: locals.attrs.id,
    breakpoints: locals.config.horizontal
  });
};

select.renderError = function (locals) {
  return getError(locals);
};

select.renderHelp = function (locals) {
  return getHelp(locals);
};

select.renderVertical = function (locals) {
  return [
    select.renderLabel(locals),
    select.renderSelect(locals),
    select.renderError(locals),
    select.renderHelp(locals)
  ];
};

select.renderHorizontal = function (locals) {
  const label = select.renderLabel(locals);
  return [
    label,
    {
      tag: 'div',
      attrs: {
        className: label ? locals.config.horizontal.getInputClassName() : locals.config.horizontal.getOffsetClassName()
      },
      children: [
        select.renderSelect(locals),
        select.renderError(locals),
        select.renderHelp(locals)
      ]
    }
  ];
};

select.renderFormGroup = function (children, locals) {
  return bootstrap.getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children
  });
};

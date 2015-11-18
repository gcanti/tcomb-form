import t from 'tcomb-validation';
import bootstrap from 'uvdom-bootstrap';
import Breakpoints from './Breakpoints';
import getError from './getError';
import getHelp from './getHelp';

const CheckboxConfig = t.struct({
  horizontal: t.maybe(Breakpoints)
}, 'CheckboxConfig');

export default function checkbox(locals) {

  locals.config = checkbox.getConfig(locals);

  let children = [
    checkbox.renderCheckbox(locals),
    checkbox.renderError(locals),
    checkbox.renderHelp(locals)
  ];

  if (locals.config.horizontal) {
    children = checkbox.renderHorizontal(children, locals);
  }

  return checkbox.renderFormGroup(children, locals);
}

checkbox.getConfig = function (locals) {
  return new CheckboxConfig(locals.config || {});
};

checkbox.getAttrs = function (locals) {
  const attrs = t.mixin({}, locals.attrs);
  attrs.type = 'checkbox';
  attrs.disabled = locals.disabled;
  attrs.checked = locals.value;
  attrs.onChange = evt => locals.onChange(evt.target.checked);

  if (locals.help) {
    attrs['aria-describedby'] = attrs['aria-describedby'] || (attrs.id + '-tip');
  }
  return attrs;
};

checkbox.renderCheckbox = function (locals) {
  const attrs = checkbox.getAttrs(locals);
  return bootstrap.getCheckbox(attrs, locals.label);
};

checkbox.renderError = function (locals) {
  return getError(locals);
};

checkbox.renderHelp = function (locals) {
  return getHelp(locals);
};

checkbox.renderHorizontal = function (children, locals) {
  return {
    tag: 'div',
    attrs: {
      className: locals.config.horizontal.getOffsetClassName()
    },
    children: children
  };
};

checkbox.renderFormGroup = function (children, locals) {
  return bootstrap.getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children
  });
};

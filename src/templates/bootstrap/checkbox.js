import t from 'tcomb-validation';
import bootstrap from 'uvdom-bootstrap';
import Breakpoints from './Breakpoints';
import getError from './getError';
import getHelp from './getHelp';

const CheckboxConfig = t.struct({
  horizontal: t.maybe(Breakpoints)
}, 'CheckboxConfig');

export default function checkbox(locals) {

  const config = new CheckboxConfig(locals.config || {});

  const attrs = t.mixin({}, locals.attrs);
  attrs.type = 'checkbox';
  attrs.disabled = locals.disabled;
  attrs.checked = locals.value;
  attrs.onChange = evt => locals.onChange(evt.target.checked);

  if (locals.help) {
    attrs['aria-describedby'] = attrs['aria-describedby'] || (attrs.id + '-tip');
  }

  const control = bootstrap.getCheckbox(attrs, locals.label);

  const error = getError(locals);
  const help = getHelp(locals);
  let children = [
    control,
    error,
    help
  ];

  if (config.horizontal) {
    children = {
      tag: 'div',
      attrs: {
        className: config.horizontal.getOffsetClassName()
      },
      children: children
    };
  }

  return bootstrap.getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children
  });

}


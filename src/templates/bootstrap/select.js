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

  const config = new SelectConfig(locals.config || {});

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

  const options = locals.options.map(x => x.label ?
    bootstrap.getOptGroup(x) :
    bootstrap.getOption(x)
  );

  const control = {
    tag: 'select',
    attrs,
    children: options
  };

  const horizontal = config.horizontal;
  const label = getLabel({
    label: locals.label,
    htmlFor: attrs.id,
    breakpoints: config.horizontal
  });
  const error = getError(locals);
  const help = getHelp(locals);
  let children = [
    label,
    control,
    error,
    help
  ];

  if (horizontal) {
    children = [
      label,
      {
        tag: 'div',
        attrs: {
          className: label ? horizontal.getInputClassName() : horizontal.getOffsetClassName()
        },
        children: [
          control,
          error,
          help
        ]
      }
    ];
  }

  return bootstrap.getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children: children
  });

}

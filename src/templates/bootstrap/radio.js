import t from 'tcomb-validation';
import bootstrap from 'uvdom-bootstrap';
import Breakpoints from './Breakpoints';
import getLabel from './getLabel';
import getError from './getError';
import getHelp from './getHelp';

const RadioConfig = t.struct({
  horizontal: t.maybe(Breakpoints)
}, 'RadioConfig');

export default function radio(locals) {

  const config = new RadioConfig(locals.config || {});

  const id = locals.attrs.id;
  const onChange = evt => locals.onChange(evt.target.value);

  const controls = locals.options.map((option, i) => {

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

  const horizontal = config.horizontal;
  const label = getLabel({
    label: locals.label,
    id,
    breakpoints: config.horizontal
  });
  const error = getError(locals);
  const help = getHelp(locals);
  let children = [
    label,
    controls,
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
          controls,
          error,
          help
        ]
      }
    ];
  }

  return bootstrap.getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children
  });

}

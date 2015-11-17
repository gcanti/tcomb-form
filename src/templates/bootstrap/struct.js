import bootstrap from 'uvdom-bootstrap';

export default function struct(locals) {

  let children = [];

  if (locals.help) {
    children.push(bootstrap.getAlert({
      children: locals.help
    }));
  }

  if (locals.error && locals.hasError) {
    children.push(bootstrap.getAlert({
      type: 'danger',
      children: locals.error
    }));
  }

  children = children.concat(locals.order.map(name => locals.inputs[name]));

  let className = {};
  if (locals.className) {
    className[locals.className] = true;
  }

  return bootstrap.getFieldset({
    className,
    disabled: locals.disabled,
    legend: locals.label,
    children
  });

}

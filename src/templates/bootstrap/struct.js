import bootstrap from 'uvdom-bootstrap';

export default function struct(locals) {

  let children = [];

  if (locals.help) {
    children.push(struct.renderHelp(locals.help));
  }

  if (locals.error && locals.hasError) {
    children.push(struct.renderError(locals.error));
  }

  children = children.concat(locals.order.map(name => locals.inputs[name]));

  const className = {};
  if (locals.className) {
    className[locals.className] = true;
  }

  return struct.renderFieldset({
    className,
    disabled: locals.disabled,
    legend: locals.label,
    children
  });
}

struct.renderHelp = function (help) {
  return bootstrap.getAlert({
    children: help
  });
};

struct.renderError = function (error) {
  return bootstrap.getAlert({
    type: 'danger',
    children: error
  });
};

struct.renderFieldset = function ({className, disabled, legend, children}) {
  return bootstrap.getFieldset({
    className,
    disabled,
    legend,
    children
  });
};

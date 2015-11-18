import bootstrap from 'uvdom-bootstrap';

function clone() {

  function struct(locals) {

    let children = [];

    if (locals.help) {
      children.push(struct.renderHelp(locals));
    }

    if (locals.error && locals.hasError) {
      children.push(struct.renderError(locals));
    }

    children = children.concat(locals.order.map(name => locals.inputs[name]));

    return struct.renderFieldset(children, locals);
  }

  struct.clone = clone;

  struct.renderHelp = function (locals) {
    return bootstrap.getAlert({
      children: locals.help
    });
  };

  struct.renderError = function (locals) {
    return bootstrap.getAlert({
      type: 'danger',
      children: locals.error
    });
  };

  struct.renderFieldset = function (children, locals) {
    const className = {};
    if (locals.className) {
      className[locals.className] = true;
    }
    return bootstrap.getFieldset({
      className,
      disabled: locals.disabled,
      legend: locals.label,
      children
    });
  };

  return struct;
}

export default clone();


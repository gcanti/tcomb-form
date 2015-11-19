import bootstrap from 'uvdom-bootstrap';

function create(overrides = {}) {

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

  struct.renderHelp = overrides.renderHelp || function renderHelp(locals) {
    return bootstrap.getAlert({
      children: locals.help
    });
  };

  struct.renderError = overrides.renderError || function renderError(locals) {
    return bootstrap.getAlert({
      type: 'danger',
      children: locals.error
    });
  };

  struct.renderFieldset = overrides.renderFieldset || function renderFieldset(children, locals) {
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

  struct.clone = function clone(newOverrides = {}) {
    return create({...overrides, ...newOverrides});
  };

  return struct;
}

export default create();


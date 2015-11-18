import bootstrap from 'uvdom-bootstrap';

export default function list(locals) {

  let children = [];

  if (locals.help) {
    children.push(list.renderHelp(locals.help));
  }

  if (locals.error && locals.hasError) {
    children.push(list.renderError(locals.error));
  }

  children = children.concat(locals.items.map((item) => {
    return item.buttons.length === 0 ?
      list.renderRowWithoutButtons(item) :
      list.renderRow(item);
  }));

  if (locals.add) {
    children.push(list.renderAddButton(locals.add));
  }

  const className = {};
  if (locals.className) {
    className[locals.className] = true;
  }

  return list.renderFieldset({
    className,
    disabled: locals.disabled,
    legend: locals.label,
    children
  });
}

list.renderHelp = function (help) {
  return bootstrap.getAlert({
    children: help
  });
};

list.renderError = function (error) {
  return bootstrap.getAlert({
    type: 'danger',
    children: error
  });
};

list.renderRowWithoutButtons = function (item) {
  return bootstrap.getRow({
    key: item.key,
    children: [
      bootstrap.getCol({
        breakpoints: {xs: 12},
        children: item.input
      })
    ]
  });
};

list.renderRowButton = function (button) {
  return bootstrap.getButton({
    click: button.click,
    key: button.type,
    label: button.label,
    className: 'btn-' + button.type
  });
};

list.renderRowButtons = function (buttons) {
  return bootstrap.getButtonGroup(buttons.map(list.renderRowButton));
};

list.renderRow = function (row) {
  return bootstrap.getRow({
    key: row.key,
    children: [
      bootstrap.getCol({
        breakpoints: {sm: 8, xs: 6},
        children: row.input
      }),
      bootstrap.getCol({
        breakpoints: {sm: 4, xs: 6},
        children: list.renderRowButtons(row.buttons)
      })
    ]
  });
};

list.renderAddButton = function (button) {
  return {
    tag: 'div',
    attrs: { className: 'row' },
    children: {
      tag: 'div',
      attrs: { className: 'col-lg-12' },
      children: {
        tag: 'div',
        attrs: { style: {marginBottom: '15px'} },
        children: bootstrap.getButton({
          click: button.click,
          label: button.label,
          className: 'btn-' + button.type
        })
      }
    }
  };
};

list.renderFieldset = function ({className, disabled, legend, children}) {
  return bootstrap.getFieldset({
    className,
    disabled,
    legend,
    children
  });
};


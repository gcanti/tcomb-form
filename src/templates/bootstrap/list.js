import bootstrap from 'uvdom-bootstrap';

export default function list(locals) {

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

  children = children.concat(locals.items.map((item) => {
    if (item.buttons.length === 0) {
      return bootstrap.getRow({
        key: item.key,
        children: [
          bootstrap.getCol({
            breakpoints: {xs: 12},
            children: item.input
          })
        ]
      });
    }
    return bootstrap.getRow({
      key: item.key,
      children: [
        bootstrap.getCol({
          breakpoints: {sm: 8, xs: 6},
          children: item.input
        }),
        bootstrap.getCol({
          breakpoints: {sm: 4, xs: 6},
          children: bootstrap.getButtonGroup(item.buttons.map(function (button, i) {
            return bootstrap.getButton({
              click: button.click,
              key: i,
              label: button.label
            });
          }))
        })
      ]
    });
  }));

  if (locals.add) {
    children.push({
      tag: 'div',
      attrs: { className: 'row' },
      children: {
        tag: 'div',
        attrs: { className: 'col-lg-12' },
        children: {
          tag: 'div',
          attrs: { style: {marginBottom: '15px'} },
          children: bootstrap.getButton(locals.add)
        }
      }
    });
  }

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


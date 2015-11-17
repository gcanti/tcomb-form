import getAlert from './getAlert';

function getButton(options) {
  return {
    tag: 'button',
    attrs: {
      className: {
        ui: true,
        basic: true,
        button: true
      }
    },
    events: {
      click: options.click
    },
    children: options.label,
    key: options.key
  };
}

function getRow(options) {
  return {
    tag: 'div',
    attrs: {
      className: {
        ui: true,
        grid: true
      }
    },
    children: options.children,
    key: options.key
  };
}

function getCol(options) {
  return {
    tag: 'div',
    attrs: {
      className: options.className
    },
    children: options.children
  };
}

function getButtonGroup(buttons) {
  return {
    tag: 'div',
    attrs: {
      className: {
        ui: true,
        basic: true,
        buttons: true
      }
    },
    children: buttons
  };
}

export default function list(locals) {

  var rows = [];

  if (locals.label) {
    rows.push({
      tag: 'legend',
      attrs: {
        className: {
          ui: true,
          header: true
        }
      },
      children: locals.label
    });
  }

  if (locals.help) {
    rows.push(getAlert('info', locals.help));
  }

  rows = rows.concat(locals.items.map(function (item) {
    if (item.buttons.length === 0) {
      return getRow({
        key: item.key,
        children: [
          getCol({
            className: {
              six: true,
              wide: true,
              column: true
            },
            children: item.input
          })
        ]
      });
    }
    return getRow({
      key: item.key,
      children: [
        getCol({
          className: {
            eight: true,
            wide: true,
            column: true
          },
          children: item.input
        }),
        getCol({
          className: {
            four: true,
            wide: true,
            column: true
          },
          children: getButtonGroup(item.buttons.map(function (button, i) {
            return getButton({
              click: button.click,
              key: i,
              label: button.label
            });
          }))
        })
      ]
    });
  }));

  if (locals.error && locals.hasError) {
    rows.push(getAlert('error', locals.error));
  }

  if (locals.add) {
    rows.push(getButton(locals.add));
  }

  return {
    tag: 'fieldset',
    attrs: {
      disabled: locals.disabled,
      style: {
        border: 0,
        margin: 0,
        padding: 0
      },
      className: {
        ui: true,
        form: true,
        segment: locals.path.length > 0,
        error: locals.hasError
      }
    },
    children: rows
  };
}


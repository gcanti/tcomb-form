import getAlert from './getAlert';

export default function struct(locals) {

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

  rows = rows.concat(locals.order.map(function (name) {
    return locals.inputs[name];
  }));

  if (locals.error && locals.hasError) {
    rows.push(getAlert('error', locals.error));
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

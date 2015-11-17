import t from 'tcomb-validation';
import getLabel from './getLabel';
import getError from './getError';
import getHelp from './getHelp';

function range(n) {
  var result = [];
  for (var i = 1; i <= n; i++) { result.push(i); }
  return result;
}

function padLeft(x, len) {
  var str = String(x);
  var times = len - str.length;
  for (var i = 0; i < times; i++ ) { str = '0' + str; }
  return str;
}

function toOption(value, text) {
  return {
    tag: 'option',
    attrs: {value: value + ''},
    children: text
  };
}

const nullOption = [toOption('', '-')];

const days = nullOption.concat(range(31).map(function (i) {
  return toOption(i, padLeft(i, 2));
}));

const months = nullOption.concat(range(12).map(function (i) {
  return toOption(i - 1, padLeft(i, 2));
}));

export default function date(locals) {

  const attrs = t.mixin({}, locals.attrs);
  const value = locals.value.slice();

  function onDayChange(evt) {
    value[2] = evt.target.value === '-' ? null : evt.target.value;
    locals.onChange(value);
  }

  function onMonthChange(evt) {
    value[1] = evt.target.value === '-' ? null : evt.target.value;
    locals.onChange(value);
  }

  function onYearChange(evt) {
    value[0] = evt.target.value.trim() === '' ? null : evt.target.value.trim();
    locals.onChange(value);
  }

  const parts = {

    D: {
      tag: 'div',
      key: 'D',
      attrs: {
        className: {
          field: true
        }
      },
      children: {
        tag: 'select',
        attrs: {
          disabled: locals.disabled,
          value: value[2]
        },
        events: {
          change: onDayChange
        },
        children: days
      }
    },

    M: {
      tag: 'div',
      key: 'M',
      attrs: {
        className: {
          field: true
        }
      },
      children: {
        tag: 'select',
        attrs: {
          disabled: locals.disabled,
          value: value[1]
        },
        events: {
          change: onMonthChange
        },
        children: months
      }
    },

    YY: {
      tag: 'div',
      key: 'YY',
      attrs: {
        className: {
          field: true
        }
      },
      children: {
        tag: 'input',
        attrs: {
          disabled: locals.disabled,
          type: 'text',
          size: 5,
          value: value[0]
        },
        events: {
          change: onYearChange
        }
      }
    }

  };

  const control = {
    tag: 'div',
    attrs: {
      className: {
        inline: true,
        fields: true
      }
    },
    children: locals.order.map(function (id) {
      return parts[id];
    })
  };

  const label = getLabel({
    label: locals.label,
    htmlFor: attrs.id
  });
  const help = getHelp(locals);
  const error = getError(locals);
  const config = locals.config || {};

  return {
    tag: 'div',
    attrs: {
      className: {
        field: true,
        error: locals.hasError,
        disabled: locals.disabled,
        [`${config.wide} wide`]: !t.Nil.is(config.wide)
      }
    },
    children: [
      label,
      control,
      help,
      error
    ]
  };

}

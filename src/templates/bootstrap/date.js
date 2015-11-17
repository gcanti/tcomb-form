import t from 'tcomb-validation';
import bootstrap from 'uvdom-bootstrap';
import Breakpoints from './Breakpoints';
import getLabel from './getLabel';
import getError from './getError';
import getHelp from './getHelp';

const DateConfig = t.struct({
  horizontal: t.maybe(Breakpoints)
}, 'DateConfig');

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

var nullOption = [toOption('', '-')];

var days = nullOption.concat(range(31).map(function (i) {
  return toOption(i, padLeft(i, 2));
}));

var months = nullOption.concat(range(12).map(function (i) {
  return toOption(i - 1, padLeft(i, 2));
}));

export default function date(locals) {

  const config = new DateConfig(locals.config || {});
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
      tag: 'li',
      key: 'D',
      children: {
        tag: 'select',
        attrs: {
          disabled: locals.disabled,
          className: {
            'form-control': true
          },
          value: value[2]
        },
        events: {
          change: onDayChange
        },
        children: days
      }
    },

    M: {
      tag: 'li',
      key: 'M',
      children: {
        tag: 'select',
        attrs: {
          disabled: locals.disabled,
          className: {
            'form-control': true
          },
          value: value[1]
        },
        events: {
          change: onMonthChange
        },
        children: months
      }
    },

    YY: {
      tag: 'li',
      key: 'YY',
      children: {
        tag: 'input',
        attrs: {
          disabled: locals.disabled,
          type: 'text',
          size: 5,
          className: {
            'form-control': true
          },
          value: value[0]
        },
        events: {
          change: onYearChange
        }
      }
    }

  };

  const control = {
    tag: 'ul',
    attrs: {
      className: {
        'nav nav-pills': true
      }
    },
    children: locals.order.map(function (id) {
      return parts[id];
    })
  };

  const horizontal = config.horizontal;
  const label = getLabel({
    label: locals.label,
    breakpoints: config.horizontal
  });
  const error = getError(locals);
  const help = getHelp(locals);
  var children = [
    label,
    control,
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
          control,
          error,
          help
        ]
      }
    ];
  }

  return bootstrap.getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children: children
  });

}


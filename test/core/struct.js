'use strict';

var React = require('react');
var test = require('tape');
var vdom = require('react-vdom');
var t = require('../../.');
var Context = require('../../lib/protocols/api').Context;
var config = require('../../lib/config');
var getReport = require('../../lib/util/getReport');
var bootstrap = require('../../lib/themes/bootstrap');
var Struct = require('../../lib/protocols/theme').Struct;
var struct = require('../../lib/factories').struct;

//
// helpers
//

function getContext(ctx) {

  ctx = t.util.mixin({
    templates: config.templates,
    i18n: config.i18n,
    report: getReport(ctx.type),
    name: 'leaf',
    auto: 'placeholders',
    label: 'default label'
  }, ctx, true);

  return new Context(ctx);
}

function getLocals(ctx, opts) {
  var Component = struct(opts, getContext(ctx));
  vdom(React.createElement(Component)); // force render()
}

function getResult(ctx, opts, onResult, onRender) {
  var rendered = false;
  opts.templates = {
    struct: function (locals) {
      if (rendered && onRender) {
        onRender(locals);
      }
      return bootstrap.struct(locals);
    }
  };
  ctx = getContext(ctx);
  var Component = React.createFactory(struct(opts, ctx));
  var node = document.createElement('div');
  document.body.appendChild(node);
  var component = React.render(Component(), node);
  rendered = true;
  var result = component.getValue();
  onResult(result);
}

var Country = t.enums({
  IT: 'Italy',
  US: 'United States'
}, 'Country');

var Gender = t.enums({
  M: 'Male',
  F: 'Female'
}, 'Gender');

var Person = t.struct({
  name: t.Str,
  rememberMe: t.Bool,
  country: Country,
  gender: Gender
});

//
// rendering tests
//

test('struct() factory', function (tape) {

  tape.test('fields', function (tape) {
    tape.plan(7);

    getLocals({type: Person}, {templates: {struct: function (locals) {
      tape.ok(locals instanceof Struct);
      tape.deepEqual(locals.order, ['name', 'rememberMe', 'country', 'gender']);
      tape.deepEqual(Object.keys(locals.inputs).length, 4);
      tape.ok(locals.inputs.name);
      tape.ok(locals.inputs.rememberMe);
      tape.ok(locals.inputs.country);
      tape.ok(locals.inputs.gender);
    }}});

  });

  tape.test('order', function (tape) {
    tape.plan(5);

    // should order and filter the inputs
    getLocals({type: Person}, {order: ['name'], templates: {struct: function (locals) {
      tape.deepEqual(locals.order, ['name']);
      tape.ok(locals.inputs.name);
    }}});

    // should handle verbatims
    getLocals({type: Person}, {order: ['name', React.DOM.i(null, 'JSX field')], templates: {struct: function (locals) {
      tape.deepEqual(Object.keys(locals.inputs).length, 1);
      tape.deepEqual(vdom(locals.order), ['name', {tag: 'i', attrs: {}, children: 'JSX field'}]);
      tape.ok(locals.inputs.name);
    }}});

  });

  tape.test('disabled', function (tape) {
    tape.plan(2);

    getLocals({type: Person}, {templates: {struct: function (locals) {
      tape.deepEqual(locals.disabled, null);
    }}});

    getLocals({type: Person}, {disabled: true, templates: {struct: function (locals) {
      tape.deepEqual(locals.disabled, true);
    }}});
  });

  tape.test('label', function (tape) {
    tape.plan(3);

    // labels as strings
    getLocals({type: Person}, {label: 'mylabel', templates: {struct: function (locals) {
      tape.deepEqual(locals.label, 'mylabel');
    }}});

    // labels as JSX
    getLocals({type: Person}, {label: React.DOM.i(null, 'JSX label'), templates: {struct: function (locals) {
      tape.deepEqual(vdom(locals.label), {tag: 'i', attrs: {}, children: 'JSX label'});
    }}});

    // should have a default label if ctx.auto = `labels`
    getLocals({type: Person}, {auto: 'labels', templates: {struct: function (locals) {
      tape.deepEqual(locals.label, 'default label');
    }}});
  });

  tape.test('help', function (tape) {
    tape.plan(2);

    // helps as strings
    getLocals({type: Person}, {help: 'my help', templates: {struct: function (locals) {
      tape.deepEqual(locals.help, 'my help');
    }}});

    // helps as JSX
    getLocals({type: Person}, {help: React.DOM.i(null, 'JSX help'), templates: {struct: function (locals) {
      tape.deepEqual(vdom(locals.help), {tag: 'i', attrs: {}, children: 'JSX help'});
    }}});
  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    getLocals({type: Person}, {templates: {struct: function (locals) {
      tape.deepEqual(locals.hasError, false);
    }}});
    getLocals({type: Person}, {hasError: true, templates: {struct: function (locals) {
      tape.deepEqual(locals.hasError, true);
    }}});

  });

  tape.test('error', function (tape) {
    tape.plan(10);

    getLocals({type: Person}, {templates: {struct: function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.error, null);
    }}});

    getLocals({type: Person}, {error: 'my error', templates: {struct: function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.error, null);
    }}});

    // error as a string
    getLocals({type: Person}, {error: 'my error', hasError: true, templates: {struct: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.error, 'my error');
    }}});

    // error as a JSX
    getLocals({type: Person}, {error: React.DOM.i(null, 'JSX error'), hasError: true, templates: {struct: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(vdom(locals.error), {tag: 'i', attrs: {}, children: 'JSX error'});
    }}});

    // error as a function
    var getError = function (value) {
      return 'error: ' + JSON.stringify(value);
    };
    getLocals({type: Person}, {error: getError, hasError: true, value: {}, templates: {struct: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.error, 'error: {}');
    }}});

  });

  tape.test('value', function (tape) {
    tape.plan(7);

    // should receive a value from the context
    getLocals({type: Person, value: {name: 'Giulio'}}, {templates: {struct: function (locals) {
      tape.deepEqual(locals.value, {name: 'Giulio'});
    }}});

    // a value specified in opts should override the context one
    getLocals({type: Person, value: {name: 'Giulio'}}, {value: {name: 'Canti'}, templates: {struct: function (locals) {
      tape.deepEqual(locals.value, {name: 'Canti'});
    }}});

    // values should propagate to inputs
    getLocals({type: Person}, {
      value: {
        name: 'Giulio',
        rememberMe: true,
        country: 'IT',
        gender: 'M'
      },
      fields: {
        gender: {
          factory: t.form.radio
        }
      },
      templates: {
        struct: function (locals) {
          tape.deepEqual(locals.value, {
            name: 'Giulio',
            rememberMe: true,
            country: 'IT',
            gender: 'M'
          });
          return locals.order.map(function (name) {
            return locals.inputs[name];
          });
        },
        textbox: function (locals) {
          tape.deepEqual(locals.value, 'Giulio');
        },
        checkbox: function (locals) {
          tape.deepEqual(locals.value, true);
        },
        select: function (locals) {
          tape.deepEqual(locals.value, 'IT');
        },
        radio: function (locals) {
          tape.deepEqual(locals.value, 'M');
        }
      }
    });
  });

});

//
// getValue() tests (browser required)
//

if (typeof window !== 'undefined') {

  test('struct getValue()', function (tape) {
    tape.plan(12);

    getResult({type: Person}, {}, function (result) {
      tape.deepEqual(result.isValid(), false);
      tape.deepEqual(result.value, {
        name: null,
        rememberMe: false,
        country: null,
        gender: null
      });
    }, function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.value, {
        name: null,
        rememberMe: false,
        country: null,
        gender: null
      });
    });

    getResult({type: Person}, {value: {
      name: 'Giulio',
      rememberMe: true,
      country: 'IT',
      gender: 'M'
    }}, function (result) {
      tape.deepEqual(result.isValid(), true);
      tape.deepEqual(result.value, {
        name: 'Giulio',
        rememberMe: true,
        country: 'IT',
        gender: 'M'
      });
    }, function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.value, {
        name: 'Giulio',
        rememberMe: true,
        country: 'IT',
        gender: 'M'
      });
    });

    var Subtype = t.subtype(Person, function (obj) {
      return obj.rememberMe === true && obj.country === 'IT';
    })

    getResult({type: Subtype}, {value: {
      name: 'Giulio',
      rememberMe: true,
      country: 'US',
      gender: 'M'
    }}, function (result) {
      tape.deepEqual(result.isValid(), false);
      tape.deepEqual(result.value, {
        name: 'Giulio',
        rememberMe: true,
        country: 'US',
        gender: 'M'
      });
    }, function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.value, {
        name: 'Giulio',
        rememberMe: true,
        country: 'US',
        gender: 'M'
      });
    });

  });

}


'use strict';

var React = require('react');
var test = require('tape');
var vdom = require('react-vdom');
var t = require('../.');
var Context = require('../lib/protocols/api').Context;
var config = require('../lib/config');
var getReport = require('../lib/util/getReport');
var Struct = require('../lib/protocols/theme').Struct;
var struct = require('../lib/factories').struct;

//
// helpers
//

function getContext(ctx) {

  ctx = t.util.mixin({
    templates: config.templates,
    i18n: config.i18n,
    report: getReport(ctx.type),
    path: ['leaf'],
    auto: 'placeholders',
    label: 'default label'
  }, ctx, true);

  return new Context(ctx);
}

function assertLocals(factory, ctx, opts) {
  var Component = factory(opts, getContext(ctx));
  vdom(React.createElement(Component)); // force render()
}

//
// node tests
//

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

test('struct() factory', function (tape) {

  tape.test('fields', function (tape) {
    tape.plan(7);

    assertLocals(struct, {type: Person}, {templates: {struct: function (locals) {
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
    assertLocals(struct, {type: Person}, {order: ['name'], templates: {struct: function (locals) {
      tape.deepEqual(locals.order, ['name']);
      tape.ok(locals.inputs.name);
    }}});

    // should handle verbatims
    assertLocals(struct, {type: Person}, {order: ['name', React.DOM.i(null, 'JSX field')], templates: {struct: function (locals) {
      tape.deepEqual(Object.keys(locals.inputs).length, 1);
      tape.deepEqual(vdom(locals.order), ['name', {tag: 'i', attrs: {}, children: 'JSX field'}]);
      tape.ok(locals.inputs.name);
    }}});

  });

  tape.test('disabled', function (tape) {
    tape.plan(2);

    assertLocals(struct, {type: Person}, {templates: {struct: function (locals) {
      tape.deepEqual(locals.disabled, null);
    }}});

    assertLocals(struct, {type: Person}, {disabled: true, templates: {struct: function (locals) {
      tape.deepEqual(locals.disabled, true);
    }}});
  });

  tape.test('label', function (tape) {
    tape.plan(3);

    // labels as strings
    assertLocals(struct, {type: Person}, {label: 'mylabel', templates: {struct: function (locals) {
      tape.deepEqual(locals.label, 'mylabel');
    }}});

    // labels as JSX
    assertLocals(struct, {type: Person}, {label: React.DOM.i(null, 'JSX label'), templates: {struct: function (locals) {
      tape.deepEqual(vdom(locals.label), {tag: 'i', attrs: {}, children: 'JSX label'});
    }}});

    // should have a default label if ctx.auto = `labels`
    assertLocals(struct, {type: Person}, {auto: 'labels', templates: {struct: function (locals) {
      tape.deepEqual(locals.label, 'default label');
    }}});
  });

  tape.test('help', function (tape) {
    tape.plan(2);

    // helps as strings
    assertLocals(struct, {type: Person}, {help: 'my help', templates: {struct: function (locals) {
      tape.deepEqual(locals.help, 'my help');
    }}});

    // helps as JSX
    assertLocals(struct, {type: Person}, {help: React.DOM.i(null, 'JSX help'), templates: {struct: function (locals) {
      tape.deepEqual(vdom(locals.help), {tag: 'i', attrs: {}, children: 'JSX help'});
    }}});
  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    assertLocals(struct, {type: Person}, {templates: {struct: function (locals) {
      tape.deepEqual(locals.hasError, false);
    }}});
    assertLocals(struct, {type: Person}, {hasError: true, templates: {struct: function (locals) {
      tape.deepEqual(locals.hasError, true);
    }}});

  });

  tape.test('error', function (tape) {
    tape.plan(10);

    assertLocals(struct, {type: Person}, {templates: {struct: function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.error, null);
    }}});

    assertLocals(struct, {type: Person}, {error: 'my error', templates: {struct: function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.error, null);
    }}});

    // error as a string
    assertLocals(struct, {type: Person}, {error: 'my error', hasError: true, templates: {struct: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.error, 'my error');
    }}});

    // error as a JSX
    assertLocals(struct, {type: Person}, {error: React.DOM.i(null, 'JSX error'), hasError: true, templates: {struct: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(vdom(locals.error), {tag: 'i', attrs: {}, children: 'JSX error'});
    }}});

    // error as a function
    var getError = function (value) {
      return 'error: ' + JSON.stringify(value);
    };
    assertLocals(struct, {type: Person}, {error: getError, hasError: true, value: {}, templates: {struct: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.error, 'error: {}');
    }}});

  });

  tape.test('value', function (tape) {
    tape.plan(7);

    // should receive a value from the context
    assertLocals(struct, {type: Person, value: {name: 'Giulio'}}, {templates: {struct: function (locals) {
      tape.deepEqual(locals.value, {name: 'Giulio'});
    }}});

    // a value specified in opts should override the context one
    assertLocals(struct, {type: Person, value: {name: 'Giulio'}}, {value: {name: 'Canti'}, templates: {struct: function (locals) {
      tape.deepEqual(locals.value, {name: 'Canti'});
    }}});

    // values should propagate to inputs
    assertLocals(struct, {type: Person}, {
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

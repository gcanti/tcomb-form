'use strict';

var React = require('react');
var test = require('tape');
var vdom = require('react-vdom');
var t = require('../.');
var Context = require('../lib/protocols/api').Context;
var config = require('../lib/config');
var getReport = require('../lib/util/getReport');
var Checkbox = require('../lib/protocols/theme').Checkbox;
var checkbox = require('../lib/factories').checkbox;

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

test('checkbox() factory', function (tape) {

  tape.test('disabled', function (tape) {
    tape.plan(3);

    assertLocals(checkbox, {type: t.Bool}, {template: function (locals) {
      tape.ok(locals instanceof Checkbox);
      tape.deepEqual(locals.disabled, null);
    }});

    assertLocals(checkbox, {type: t.Bool}, {disabled: true, template: function (locals) {
      tape.deepEqual(locals.disabled, true);
    }});
  });

  tape.test('label', function (tape) {
    tape.plan(3);

    // labels as strings
    assertLocals(checkbox, {type: t.Bool}, {label: 'mylabel', template: function (locals) {
      tape.deepEqual(locals.label, 'mylabel');
    }});

    // labels as JSX
    assertLocals(checkbox, {type: t.Bool}, {label: React.DOM.i(null, 'JSX label'), template: function (locals) {
      tape.deepEqual(vdom(locals.label), {tag: 'i', attrs: {}, children: 'JSX label'});
    }});

    // should have a default label if ctx.auto = `labels`
    assertLocals(checkbox, {type: t.Bool, auto: 'labels'}, {template: function (locals) {
      tape.deepEqual(locals.label, 'default label');
    }});
  });

  tape.test('help', function (tape) {
    tape.plan(2);

    // helps as strings
    assertLocals(checkbox, {type: t.Bool}, {help: 'my help', template: function (locals) {
      tape.deepEqual(locals.help, 'my help');
    }});

    // helps as JSX
    assertLocals(checkbox, {type: t.Bool}, {help: React.DOM.i(null, 'JSX help'), template: function (locals) {
      tape.deepEqual(vdom(locals.help), {tag: 'i', attrs: {}, children: 'JSX help'});
    }});
  });

  tape.test('name', function (tape) {
    tape.plan(2);

    // should have a default name
    assertLocals(checkbox, {type: t.Bool}, {template: function (locals) {
      tape.deepEqual(locals.name, 'leaf');
    }});

    // should handle a custom name
    assertLocals(checkbox, {type: t.Bool}, {name: 'myname', template: function (locals) {
      tape.deepEqual(locals.name, 'myname');
    }});
  });

  tape.test('value', function (tape) {
    tape.plan(4);

    // should receive a value from the context
    assertLocals(checkbox, {type: t.Bool, value: true}, {template: function (locals) {
      tape.deepEqual(locals.value, true);
    }});
    assertLocals(checkbox, {type: t.Bool, value: false}, {template: function (locals) {
      tape.deepEqual(locals.value, false);
    }});
    assertLocals(checkbox, {type: t.Bool, value: {}}, {template: function (locals) {
      tape.deepEqual(locals.value, false);
    }});

    // a value specified in opts should override the context one
    assertLocals(checkbox, {type: t.Bool, value: false}, {value: true, template: function (locals) {
      tape.deepEqual(locals.value, true);
    }});
  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    assertLocals(checkbox, {type: t.Bool}, {template: function (locals) {
      tape.deepEqual(locals.hasError, false);
    }});
    assertLocals(checkbox, {type: t.Bool}, {hasError: true, template: function (locals) {
      tape.deepEqual(locals.hasError, true);
    }});

  });

  tape.test('error', function (tape) {
    tape.plan(10);

    assertLocals(checkbox, {type: t.Bool}, {template: function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.error, null);
    }});

    assertLocals(checkbox, {type: t.Bool}, {error: 'my error', template: function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.error, null);
    }});

    // error as a string
    assertLocals(checkbox, {type: t.Bool}, {error: 'my error', hasError: true, template: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.error, 'my error');
    }});

    // error as a JSX
    assertLocals(checkbox, {type: t.Bool}, {error: React.DOM.i(null, 'JSX error'), hasError: true, template: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(vdom(locals.error), {tag: 'i', attrs: {}, children: 'JSX error'});
    }});

    // error as a function
    var getError = function (value) {
      return 'error: ' + value;
    };
    assertLocals(checkbox, {type: t.Bool}, {error: getError, hasError: true, value: true, template: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.error, 'error: true');
    }});

  });

  tape.test('template', function (tape) {
    tape.plan(1);

    // should receive a default template form the context
    assertLocals(checkbox, {type: t.Bool, templates: {checkbox: function (locals) {
      tape.ok(true);
    }}});

  });

});

'use strict';

var React = require('react');
var test = require('tape');
var vdom = require('react-vdom');
var t = require('../.');
var Context = require('../lib/protocols/api').Context;
var config = require('../lib/config');
var getReport = require('../lib/util/getReport');
var Textbox = require('../lib/protocols/theme').Textbox;
var textbox = require('../lib/factories').textbox;

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

test('textbox() factory', function (tape) {

  tape.test('type', function (tape) {
    tape.plan(3);

    // the default should be `text`
    assertLocals(textbox, {type: t.Str}, {template: function (locals) {
      tape.ok(locals instanceof Textbox);
      tape.deepEqual(locals.type, 'text');
    }});

    // should handle a custom type
    assertLocals(textbox, {type: t.Str}, {type: 'hidden', template: function (locals) {
      tape.deepEqual(locals.type, 'hidden');
    }});
  });

  tape.test('disabled', function (tape) {
    tape.plan(2);

    assertLocals(textbox, {type: t.Str}, {template: function (locals) {
      tape.deepEqual(locals.disabled, null);
    }});

    assertLocals(textbox, {type: t.Str}, {disabled: true, template: function (locals) {
      tape.deepEqual(locals.disabled, true);
    }});
  });

  tape.test('readOnly', function (tape) {
    tape.plan(2);

    assertLocals(textbox, {type: t.Str}, {template: function (locals) {
      tape.deepEqual(locals.readOnly, null);
    }});

    assertLocals(textbox, {type: t.Str}, {readOnly: true, template: function (locals) {
      tape.deepEqual(locals.readOnly, true);
    }});
  });


  tape.test('placeholder', function (tape) {
    tape.plan(3);

    // should have a default placeholder
    assertLocals(textbox, {type: t.Str}, {template: function (locals) {
      tape.deepEqual(locals.placeholder, 'default label');
    }});

    // should handle optional
    assertLocals(textbox, {type: t.maybe(t.Str)}, {template: function (locals) {
      tape.deepEqual(locals.placeholder, 'default label (optional)');
    }});

    // should handle a custom placeholder
    assertLocals(textbox, {type: t.maybe(t.Str)}, {placeholder: 'my placeholder', template: function (locals) {
      tape.deepEqual(locals.placeholder, 'my placeholder');
    }});
  });

  tape.test('label', function (tape) {
    tape.plan(5);

    // labels override placeholders
    assertLocals(textbox, {type: t.Str}, {label: 'mylabel', placeholder: 'my placeholder', template: function (locals) {
      tape.deepEqual(locals.placeholder, null);
    }});

    // labels as strings
    assertLocals(textbox, {type: t.Str}, {label: 'mylabel', template: function (locals) {
      tape.deepEqual(locals.label, 'mylabel');
    }});

    // labels as JSX
    assertLocals(textbox, {type: t.Str}, {label: React.DOM.i(null, 'JSX label'), template: function (locals) {
      tape.deepEqual(vdom(locals.label), {tag: 'i', attrs: {}, children: 'JSX label'});
    }});

    // should have a default label if ctx.auto = `labels`
    assertLocals(textbox, {type: t.Str, auto: 'labels'}, {template: function (locals) {
      tape.deepEqual(locals.label, 'default label');
    }});

    // should handle optional
    assertLocals(textbox, {type: t.maybe(t.Str), auto: 'labels'}, {template: function (locals) {
      tape.deepEqual(locals.label, 'default label (optional)');
    }});

  });

  tape.test('help', function (tape) {
    tape.plan(2);

    // helps as strings
    assertLocals(textbox, {type: t.Str}, {help: 'my help', template: function (locals) {
      tape.deepEqual(locals.help, 'my help');
    }});

    // helps as JSX
    assertLocals(textbox, {type: t.Str}, {help: React.DOM.i(null, 'JSX help'), template: function (locals) {
      tape.deepEqual(vdom(locals.help), {tag: 'i', attrs: {}, children: 'JSX help'});
    }});
  });

  tape.test('name', function (tape) {
    tape.plan(2);

    // should have a default name
    assertLocals(textbox, {type: t.Str}, {template: function (locals) {
      tape.deepEqual(locals.name, 'leaf');
    }});

    // should handle a custom name
    assertLocals(textbox, {type: t.Str}, {name: 'myname', template: function (locals) {
      tape.deepEqual(locals.name, 'myname');
    }});
  });

  tape.test('value', function (tape) {
    tape.plan(2);

    // should receive a value from the context
    assertLocals(textbox, {type: t.Str, value: 'a'}, {template: function (locals) {
      tape.deepEqual(locals.value, 'a');
    }});

    // a value specified in opts should override the context one
    assertLocals(textbox, {type: t.Str, value: 'a'}, {value: 'b', template: function (locals) {
      tape.deepEqual(locals.value, 'b');
    }});
  });

  tape.test('transformer', function (tape) {
    tape.plan(2);

    // should have a default transformer based on the inner type
    assertLocals(textbox, {type: t.maybe(t.Num)}, {value: 1, template: function (locals) {
      tape.deepEqual(locals.value, '1');
    }});

    // should handle a custom transformer
    var transformer = {
      format: function (value) {
        return value.join(',');
      },
      parse: function (value) {
        return value.split(',');
      }
    };
    assertLocals(textbox, {type: t.Str}, {value: ['a', 'b'], transformer: transformer, template: function (locals) {
      tape.deepEqual(locals.value, 'a,b');
    }});

  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    assertLocals(textbox, {type: t.Str}, {template: function (locals) {
      tape.deepEqual(locals.hasError, false);
    }});
    assertLocals(textbox, {type: t.Str}, {hasError: true, template: function (locals) {
      tape.deepEqual(locals.hasError, true);
    }});

  });

  tape.test('error', function (tape) {
    tape.plan(10);

    assertLocals(textbox, {type: t.Str}, {template: function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.error, null);
    }});

    assertLocals(textbox, {type: t.Str}, {error: 'my error', template: function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.error, null);
    }});

    // error as a string
    assertLocals(textbox, {type: t.Str}, {error: 'my error', hasError: true, template: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.error, 'my error');
    }});

    // error as a JSX
    assertLocals(textbox, {type: t.Str}, {error: React.DOM.i(null, 'JSX error'), hasError: true, template: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(vdom(locals.error), {tag: 'i', attrs: {}, children: 'JSX error'});
    }});

    // error as a function
    var getError = function (value) {
      return 'error: ' + value;
    };
    assertLocals(textbox, {type: t.Str}, {error: getError, hasError: true, value: 'a', template: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.error, 'error: a');
    }});

  });

  tape.test('template', function (tape) {
    tape.plan(1);

    // should receive a default template form the context
    assertLocals(textbox, {type: t.Str, templates: {textbox: function (locals) {
      tape.ok(true);
    }}});

  });

});

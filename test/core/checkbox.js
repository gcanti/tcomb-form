'use strict';

var React = require('react');
var test = require('tape');
var vdom = require('react-vdom');
var t = require('../../.');
var Context = require('../../lib/protocols/api').Context;
var config = require('../../lib/config');
var getReport = require('../../lib/util/getReport');
var bootstrap = require('../../lib/templates/bootstrap');
var Checkbox = require('../../lib/protocols/theme').Checkbox;
var checkbox = require('../../lib/factories').checkbox;

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

function getLocals(ctx, opts) {
  var Component = checkbox(opts, getContext(ctx));
  vdom(React.createElement(Component)); // force render()
}

function getResult(ctx, opts, onResult, onRender) {
  var rendered = false;
  opts.template = function (locals) {
    if (rendered && onRender) {
      onRender(locals);
    }
    return bootstrap.checkbox(locals);
  };
  ctx = getContext(ctx);
  var Component = React.createFactory(checkbox(opts, ctx));
  var node = document.createElement('div');
  document.body.appendChild(node);
  var component = React.render(Component(), node);
  rendered = true;
  var result = component.getValue();
  onResult(result);
}

//
// rendering tests
//

test('checkbox() factory', function (tape) {

  tape.test('disabled', function (tape) {
    tape.plan(3);

    getLocals({type: t.Bool}, {template: function (locals) {
      tape.ok(locals instanceof Checkbox);
      tape.deepEqual(locals.disabled, null);
    }});

    getLocals({type: t.Bool}, {disabled: true, template: function (locals) {
      tape.deepEqual(locals.disabled, true);
    }});
  });

  tape.test('label', function (tape) {
    tape.plan(3);

    // labels as strings
    getLocals({type: t.Bool}, {label: 'mylabel', template: function (locals) {
      tape.deepEqual(locals.label, 'mylabel');
    }});

    // labels as JSX
    getLocals({type: t.Bool}, {label: React.DOM.i(null, 'JSX label'), template: function (locals) {
      tape.deepEqual(vdom(locals.label), {tag: 'i', attrs: {}, children: 'JSX label'});
    }});

    // should have a default label if ctx.auto = `labels`
    getLocals({type: t.Bool, auto: 'labels'}, {template: function (locals) {
      tape.deepEqual(locals.label, 'default label');
    }});
  });

  tape.test('help', function (tape) {
    tape.plan(2);

    // helps as strings
    getLocals({type: t.Bool}, {help: 'my help', template: function (locals) {
      tape.deepEqual(locals.help, 'my help');
    }});

    // helps as JSX
    getLocals({type: t.Bool}, {help: React.DOM.i(null, 'JSX help'), template: function (locals) {
      tape.deepEqual(vdom(locals.help), {tag: 'i', attrs: {}, children: 'JSX help'});
    }});
  });

  tape.test('name', function (tape) {
    tape.plan(2);

    // should have a default name
    getLocals({type: t.Bool}, {template: function (locals) {
      tape.deepEqual(locals.name, 'leaf');
    }});

    // should handle a custom name
    getLocals({type: t.Bool}, {name: 'myname', template: function (locals) {
      tape.deepEqual(locals.name, 'myname');
    }});
  });

  tape.test('value', function (tape) {
    tape.plan(4);

    // should receive a value from the context
    getLocals({type: t.Bool, value: true}, {template: function (locals) {
      tape.deepEqual(locals.value, true);
    }});
    getLocals({type: t.Bool, value: false}, {template: function (locals) {
      tape.deepEqual(locals.value, false);
    }});
    getLocals({type: t.Bool, value: {}}, {template: function (locals) {
      tape.deepEqual(locals.value, false);
    }});

    // a value specified in opts should override the context one
    getLocals({type: t.Bool, value: false}, {value: true, template: function (locals) {
      tape.deepEqual(locals.value, true);
    }});
  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    getLocals({type: t.Bool}, {template: function (locals) {
      tape.deepEqual(locals.hasError, false);
    }});
    getLocals({type: t.Bool}, {hasError: true, template: function (locals) {
      tape.deepEqual(locals.hasError, true);
    }});

  });

  tape.test('error', function (tape) {
    tape.plan(10);

    getLocals({type: t.Bool}, {template: function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.error, null);
    }});

    getLocals({type: t.Bool}, {error: 'my error', template: function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.error, null);
    }});

    // error as a string
    getLocals({type: t.Bool}, {error: 'my error', hasError: true, template: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.error, 'my error');
    }});

    // error as a JSX
    getLocals({type: t.Bool}, {error: React.DOM.i(null, 'JSX error'), hasError: true, template: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(vdom(locals.error), {tag: 'i', attrs: {}, children: 'JSX error'});
    }});

    // error as a function
    var getError = function (value) {
      return 'error: ' + value;
    };
    getLocals({type: t.Bool}, {error: getError, hasError: true, value: true, template: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.error, 'error: true');
    }});

  });

  tape.test('template', function (tape) {
    tape.plan(1);

    // should receive a default template form the context
    getLocals({type: t.Bool, templates: {checkbox: function (locals) {
      tape.ok(true);
    }}});

  });

  tape.test('id', function (tape) {
    tape.plan(2);

    getLocals({type: t.Bool}, {id: 'myid', template: function (locals) {
      tape.deepEqual(locals.id, 'myid');
    }});

    // should fallback on this._rootNodeID
    getLocals({type: t.Bool}, {template: function (locals) {
      tape.deepEqual(locals.id && t.Str.is(locals.id) && locals.id.length > 0, true);
    }});

  });

});

//
// getValue() tests (browser required)
//

if (typeof window !== 'undefined') {

  test('checkbox getValue()', function (tape) {
    tape.plan(8);

    getResult({type: t.Bool}, {}, function (result) {
      tape.deepEqual(result.isValid(), true);
      tape.deepEqual(result.value, false);
    }, function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.value, false);
    });

    getResult({type: t.Bool}, {value: true}, function (result) {
      tape.deepEqual(result.isValid(), true);
      tape.deepEqual(result.value, true);
    }, function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.value, true);
    });


  });

}




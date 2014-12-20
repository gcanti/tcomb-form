'use strict';

var React = require('react');
var test = require('tape');
var vdom = require('react-vdom');
var t = require('../../.');
var Context = require('../../lib/protocols/api').Context;
var config = require('../../lib/config');
var getReport = require('../../lib/util/getReport');
var bootstrap = require('../../lib/templates/bootstrap');
var List = require('../../lib/protocols/theme').List;
var list = require('../../lib/factories').list;

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
  var Component = list(opts, getContext(ctx));
  vdom(React.createElement(Component)); // force render()
}

function getResult(ctx, opts, onResult, onRender) {
  var rendered = false;
  opts.templates = {
    list: function (locals) {
      if (rendered && onRender) {
        onRender(locals);
      }
      return bootstrap.list(locals);
    }
  };
  ctx = getContext(ctx);
  var Component = React.createFactory(list(opts, ctx));
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

test('list() factory', function (tape) {

  tape.test('disabled', function (tape) {
    tape.plan(2);

    getLocals({type: t.list(t.Str)}, {templates: {list: function (locals) {
      tape.deepEqual(locals.disabled, null);
    }}});

    getLocals({type: t.list(t.Str)}, {disabled: true, templates: {list: function (locals) {
      tape.deepEqual(locals.disabled, true);
    }}});
  });

  tape.test('label', function (tape) {
    tape.plan(3);

    // labels as strings
    getLocals({type: t.list(t.Str)}, {label: 'mylabel', templates: {list: function (locals) {
      tape.deepEqual(locals.label, 'mylabel');
    }}});

    // labels as JSX
    getLocals({type: t.list(t.Str)}, {label: React.DOM.i(null, 'JSX label'), templates: {list: function (locals) {
      tape.deepEqual(vdom(locals.label), {tag: 'i', attrs: {}, children: 'JSX label'});
    }}});

    // should have a default label if ctx.auto = `labels`
    getLocals({type: t.list(t.Str)}, {auto: 'labels', templates: {list: function (locals) {
      tape.deepEqual(locals.label, 'default label');
    }}});
  });

  tape.test('help', function (tape) {
    tape.plan(2);

    // helps as strings
    getLocals({type: t.list(t.Str)}, {help: 'my help', templates: {list: function (locals) {
      tape.deepEqual(locals.help, 'my help');
    }}});

    // helps as JSX
    getLocals({type: t.list(t.Str)}, {help: React.DOM.i(null, 'JSX help'), templates: {list: function (locals) {
      tape.deepEqual(vdom(locals.help), {tag: 'i', attrs: {}, children: 'JSX help'});
    }}});
  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    getLocals({type: t.list(t.Str)}, {templates: {list: function (locals) {
      tape.deepEqual(locals.hasError, false);
    }}});
    getLocals({type: t.list(t.Str)}, {hasError: true, templates: {list: function (locals) {
      tape.deepEqual(locals.hasError, true);
    }}});

  });

  tape.test('error', function (tape) {
    tape.plan(10);

    getLocals({type: t.list(t.Str)}, {templates: {list: function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.error, null);
    }}});

    getLocals({type: t.list(t.Str)}, {error: 'my error', templates: {list: function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.error, null);
    }}});

    // error as a string
    getLocals({type: t.list(t.Str)}, {error: 'my error', hasError: true, templates: {list: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.error, 'my error');
    }}});

    // error as a JSX
    getLocals({type: t.list(t.Str)}, {error: React.DOM.i(null, 'JSX error'), hasError: true, templates: {list: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(vdom(locals.error), {tag: 'i', attrs: {}, children: 'JSX error'});
    }}});

    // error as a function
    var getError = function (value) {
      return 'error: ' + JSON.stringify(value);
    };
    getLocals({type: t.list(t.Str)}, {error: getError, hasError: true, value: [], templates: {list: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.error, 'error: []');
    }}});

  });

  tape.test('value', function (tape) {
    tape.plan(2);

    // should receive a value from the context
    getLocals({type: t.list(t.Str), value: ['a', 'b']}, {templates: {list: function (locals) {
      tape.deepEqual(locals.value, ['a', 'b']);
    }}});

    // a value specified in opts should override the context one
    getLocals({type: t.list(t.Str), value: ['a', 'b']}, {value: ['a', 'b', 'c'], templates: {list: function (locals) {
      tape.deepEqual(locals.value, ['a', 'b', 'c']);
    }}});

  });

  // FIXME buttons tests

});

//
// getValue() tests (browser required)
//

if (typeof window !== 'undefined') {

  test('list getValue()', function (tape) {
    tape.plan(16);

    getResult({type: t.list(t.Str)}, {value: [null]}, function (result) {
      tape.deepEqual(result.isValid(), false);
      tape.deepEqual(result.value, [null]);
    }, function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.value, [null]);
    });

    getResult({type: t.list(t.Str)}, {value: ['a', 'b']}, function (result) {
      tape.deepEqual(result.isValid(), true);
      tape.deepEqual(result.value, ['a', 'b']);
    }, function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.value, ['a', 'b']);
    });

    var Subtype = t.subtype(t.list(t.Str), function (arr) {
      return arr.length >= 2;
    });

    getResult({type: Subtype}, {value: ['a']}, function (result) {
      tape.deepEqual(result.isValid(), false);
      tape.deepEqual(result.value, ['a']);
    }, function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.value, ['a']);
    });

    getResult({type: Subtype}, {value: ['a', 'b']}, function (result) {
      tape.deepEqual(result.isValid(), true);
      tape.deepEqual(result.value, ['a', 'b']);
    }, function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.value, ['a', 'b']);
    });

  });

}


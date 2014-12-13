'use strict';

var React = require('react');
var test = require('tape');
var vdom = require('react-vdom');
var t = require('../.');
var Context = require('../lib/protocols/api').Context;
var config = require('../lib/config');
var getReport = require('../lib/util/getReport');
var List = require('../lib/protocols/theme').List;
var list = require('../lib/factories').list;

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

test('list() factory', function (tape) {

  tape.test('disabled', function (tape) {
    tape.plan(2);

    assertLocals(list, {type: t.list(t.Str)}, {templates: {list: function (locals) {
      tape.deepEqual(locals.disabled, null);
    }}});

    assertLocals(list, {type: t.list(t.Str)}, {disabled: true, templates: {list: function (locals) {
      tape.deepEqual(locals.disabled, true);
    }}});
  });

  tape.test('label', function (tape) {
    tape.plan(3);

    // labels as strings
    assertLocals(list, {type: t.list(t.Str)}, {label: 'mylabel', templates: {list: function (locals) {
      tape.deepEqual(locals.label, 'mylabel');
    }}});

    // labels as JSX
    assertLocals(list, {type: t.list(t.Str)}, {label: React.DOM.i(null, 'JSX label'), templates: {list: function (locals) {
      tape.deepEqual(vdom(locals.label), {tag: 'i', attrs: {}, children: 'JSX label'});
    }}});

    // should have a default label if ctx.auto = `labels`
    assertLocals(list, {type: t.list(t.Str)}, {auto: 'labels', templates: {list: function (locals) {
      tape.deepEqual(locals.label, 'default label');
    }}});
  });

  tape.test('help', function (tape) {
    tape.plan(2);

    // helps as strings
    assertLocals(list, {type: t.list(t.Str)}, {help: 'my help', templates: {list: function (locals) {
      tape.deepEqual(locals.help, 'my help');
    }}});

    // helps as JSX
    assertLocals(list, {type: t.list(t.Str)}, {help: React.DOM.i(null, 'JSX help'), templates: {list: function (locals) {
      tape.deepEqual(vdom(locals.help), {tag: 'i', attrs: {}, children: 'JSX help'});
    }}});
  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    assertLocals(list, {type: t.list(t.Str)}, {templates: {list: function (locals) {
      tape.deepEqual(locals.hasError, false);
    }}});
    assertLocals(list, {type: t.list(t.Str)}, {hasError: true, templates: {list: function (locals) {
      tape.deepEqual(locals.hasError, true);
    }}});

  });

  tape.test('error', function (tape) {
    tape.plan(10);

    assertLocals(list, {type: t.list(t.Str)}, {templates: {list: function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.error, null);
    }}});

    assertLocals(list, {type: t.list(t.Str)}, {error: 'my error', templates: {list: function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.error, null);
    }}});

    // error as a string
    assertLocals(list, {type: t.list(t.Str)}, {error: 'my error', hasError: true, templates: {list: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.error, 'my error');
    }}});

    // error as a JSX
    assertLocals(list, {type: t.list(t.Str)}, {error: React.DOM.i(null, 'JSX error'), hasError: true, templates: {list: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(vdom(locals.error), {tag: 'i', attrs: {}, children: 'JSX error'});
    }}});

    // error as a function
    var getError = function (value) {
      return 'error: ' + JSON.stringify(value);
    };
    assertLocals(list, {type: t.list(t.Str)}, {error: getError, hasError: true, value: [], templates: {list: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.error, 'error: []');
    }}});

  });

  tape.test('value', function (tape) {
    tape.plan(2);

    // should receive a value from the context
    assertLocals(list, {type: t.list(t.Str), value: ['a', 'b']}, {templates: {list: function (locals) {
      tape.deepEqual(locals.value, ['a', 'b']);
    }}});

    // a value specified in opts should override the context one
    assertLocals(list, {type: t.list(t.Str), value: ['a', 'b']}, {value: ['a', 'b', 'c'], templates: {list: function (locals) {
      tape.deepEqual(locals.value, ['a', 'b', 'c']);
    }}});

  });

});

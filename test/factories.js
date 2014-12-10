'use strict';

var React = require('react');
var test = require('tape');
var vdom = require('react-vdom');
var t = require('../.');
var Context = require('../lib/protocols/api').Context;
var config = require('../lib/config');
var getReport = require('../lib/util/getReport');
var factories = require('../lib/factories');

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

function assertLocals(factory, ctx, opts, template) {
  var ctx = getContext(ctx);
  opts = t.util.mixin({template: template}, opts);
  var Component = factory(opts, ctx);
  vdom(React.createElement(Component)); // invoke render()
}

test('textbox() factory', function (tape) {

  var textbox = factories.textbox;

  tape.test('the default of `opts.type` should be `text`', function (tape) {
    tape.plan(1);
    assertLocals(textbox, {type: t.Str}, {}, function (locals) {
      tape.deepEqual(locals.type, 'text');
    });
  });

  tape.test('should handle `opts.type`', function (tape) {
    tape.plan(2);
    assertLocals(textbox, {type: t.Str}, {type: 'hidden'}, function (locals) {
      tape.deepEqual(locals.type, 'hidden');
    });
    assertLocals(textbox, {type: t.Str}, {type: 'textarea'}, function (locals) {
      tape.deepEqual(locals.type, 'textarea');
    });
  });

  tape.test('should handle `opts.label`', function (tape) {
    tape.plan(4);
    assertLocals(textbox, {type: t.Str}, {label: 'mylabel'}, function (locals) {
      tape.deepEqual(locals.label, 'mylabel');
      tape.deepEqual(locals.placeholder, null);
    });
    assertLocals(textbox, {type: t.Str}, {label: <i>JSX label</i>}, function (locals) {
      tape.deepEqual(vdom(locals.label), {tag: 'i', attrs: {}, children: 'JSX label'});
      tape.deepEqual(locals.placeholder, null);
    });
  });

  tape.test('should have a default label when ctx.auto = `labels`', function (tape) {
    tape.plan(1);
    assertLocals(textbox, {type: t.Str, auto: 'labels'}, null, function (locals) {
      tape.deepEqual(locals.label, 'default label');
    });
  });

});

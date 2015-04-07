'use strict';

var tape = require('tape');
var t = require('tcomb');
var bootstrap = require('../lib/templates/bootstrap');
var components = require('../lib/components');
var React = require('react');
var vdom = require('react-vdom');

var ctx = {
  auto: 'labels',
  config: {},
  name: 'defaultName',
  label: 'Default label',
  i18n: {
    optional: ' (optional)',
    add: 'Add',
    remove: 'Remove',
    up: 'Up',
    down: 'Down'
  },
  templates: bootstrap,
  path: ['defaultPath']
};

function getContext(options) {
  return t.mixin(t.mixin({}, ctx), options, true);
}

var ctxPlaceholders = getContext({auto: 'placeholders'});
var ctxNone = getContext({auto: 'none'});

tape('Checkbox', function (tape) {

  var Checkbox = components.Checkbox;

  tape.test('label', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {},
        ctx: ctx
      }).getLocals().label,
      'Default label',
      'should have a default label');

    tape.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {label: 'mylabel'},
        ctx: ctx
      }).getLocals().label,
      'mylabel',
      'should handle label option as tring');

    tape.deepEqual(
      vdom(new Checkbox({
        type: t.Bool,
        options: {label: React.DOM.i(null, 'JSX label')},
        ctx: ctx
      }).getLocals().label),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle label option as JSX');


  });

  tape.test('help', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {help: 'myhelp'},
        ctx: ctx
      }).getLocals().help,
      'myhelp',
      'should handle help option as string');

    tape.deepEqual(
      vdom(new Checkbox({
        type: t.Bool,
        options: {help: React.DOM.i(null, 'JSX help')},
        ctx: ctx
      }).getLocals().help),
      {tag: 'i', attrs: {}, children: 'JSX help'},
      'should handle help option as JSX');

  });

  tape.test('value', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {},
        ctx: ctx
      }).getLocals().value,
      false,
      'default value should be false');

    tape.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {},
        ctx: ctx,
        value: false
      }).getLocals().value,
      false,
      'should handle value option');

    tape.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {},
        ctx: ctx,
        value: true
      }).getLocals().value,
      true,
      'should handle value option');

  });

  tape.test('transformer', function (tape) {
    tape.plan(2);

    var transformer = {
      format: function (value) {
        return t.Str.is(value) ? value : value === true ? '1' : '0';
      },
      parse: function (value) {
        return value === '1';
      }
    };

    tape.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {transformer: transformer},
        ctx: ctx,
        value: true
      }).getLocals().value,
      '1',
      'should handle transformer option (format)');

    tape.deepEqual(
      new Checkbox({
        type: t.Bool,
        options: {transformer: transformer},
        ctx: ctx,
        value: true
      }).validate().value,
      true,
      'should handle transformer option (parse)');

  });

  tape.test('hasError', function (tape) {
    tape.plan(4);

    var True = t.subtype(t.Bool, function (value) { return value === true; });

    tape.strictEqual(
      new Checkbox({
        type: True,
        options: {},
        ctx: ctx
      }).getLocals().hasError,
      false,
      'default hasError should be false');

    tape.strictEqual(
      new Checkbox({
        type: True,
        options: {hasError: true},
        ctx: ctx
      }).getLocals().hasError,
      true,
      'should handle hasError option');

    var checkbox = new Checkbox({
      type: True,
      options: {},
      ctx: ctx
    });

    checkbox.validate();

    tape.strictEqual(
      checkbox.getLocals().hasError,
      false,
      'after a validation error hasError should be true');

    var checkbox = new Checkbox({
      type: True,
      options: {},
      ctx: ctx,
      value: true
    });

    checkbox.validate();

    tape.strictEqual(
      checkbox.getLocals().hasError,
      false,
      'after a validation success hasError should be false');

  });

  tape.test('error', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {},
        ctx: ctx
      }).getLocals().error,
      undefined,
      'default error should be undefined');

    tape.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {error: 'myerror'},
        ctx: ctx
      }).getLocals().error,
      'myerror',
      'should handle error option');

    tape.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {error: function (value) { return 'error: ' + value; }},
        ctx: ctx,
        value: 'a'
      }).getLocals().error,
      'error: a',
      'should handle error option as a function');
  });

  tape.test('template', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {},
        ctx: ctx
      }).getTemplate(),
      bootstrap.checkbox,
      'default template should be bootstrap.checkbox');

    var template = function () {};

    tape.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {template: template},
        ctx: ctx
      }).getTemplate(),
      template,
      'should handle template option');

  });

});


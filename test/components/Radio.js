'use strict';

var tape = require('tape');
var t = require('tcomb');
var bootstrap = require('../../lib/templates/bootstrap');
var Radio = require('../../lib/components').Radio;
var React = require('react');
var vdom = require('react-vdom');
var util = require('./util');
var ctx = util.ctx;
var renderComponent = util.getRenderComponent(Radio);

var transformer = {
  format: function (value) {
    return t.Str.is(value) ? value : value === true ? '1' : '0';
  },
  parse: function (value) {
    return value === '1';
  }
};

tape('Radio', function (tape) {

  var Country = t.enums({
    'IT': 'Italy',
    'FR': 'France',
    'US': 'United States'
  });

  tape.test('label', function (tape) {
    tape.plan(4);

    tape.strictEqual(
      new Radio({
        type: Country,
        options: {},
        ctx: ctx
      }).getLocals().label,
      'Default label',
      'should have a default label');

    tape.strictEqual(
      new Radio({
        type: Country,
        options: {label: 'mylabel'},
        ctx: ctx
      }).getLocals().label,
      'mylabel',
      'should handle label option as string');

    tape.deepEqual(
      vdom(new Radio({
        type: Country,
        options: {label: React.DOM.i(null, 'JSX label')},
        ctx: ctx
      }).getLocals().label),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle label option as JSX');

    tape.strictEqual(
      new Radio({
        type: t.maybe(Country),
        options: {},
        ctx: ctx
      }).getLocals().label,
      'Default label (optional)',
      'should handle optional types');

  });

  tape.test('help', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      new Radio({
        type: Country,
        options: {help: 'myhelp'},
        ctx: ctx
      }).getLocals().help,
      'myhelp',
      'should handle help option as string');

    tape.deepEqual(
      vdom(new Radio({
        type: Country,
        options: {help: React.DOM.i(null, 'JSX help')},
        ctx: ctx
      }).getLocals().help),
      {tag: 'i', attrs: {}, children: 'JSX help'},
      'should handle help option as JSX');

  });

  tape.test('value', function (tape) {
    tape.plan(1);

    tape.strictEqual(
      new Radio({
        type: Country,
        options: {},
        ctx: ctx,
        value: 'a'
      }).getLocals().value,
      'a',
      'should handle value option');

  });

  tape.test('transformer', function (tape) {
    tape.plan(1);

    tape.strictEqual(
      new Radio({
        type: t.maybe(t.Bool),
        options: {
          transformer: transformer,
          options: [
            {value: '0', text: 'No'},
            {value: '1', text: 'Yes'}
          ]
        },
        ctx: ctx,
        value: true
      }).getLocals().value,
      '1',
      'should handle transformer option (format)');

  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      new Radio({
        type: Country,
        options: {},
        ctx: ctx
      }).getLocals().hasError,
      false,
      'default hasError should be false');

    tape.strictEqual(
      new Radio({
        type: Country,
        options: {hasError: true},
        ctx: ctx
      }).getLocals().hasError,
      true,
      'should handle hasError option');

  });

  tape.test('error', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      new Radio({
        type: Country,
        options: {},
        ctx: ctx
      }).getLocals().error,
      undefined,
      'default error should be undefined');

    tape.strictEqual(
      new Radio({
        type: Country,
        options: {error: 'myerror'},
        ctx: ctx
      }).getLocals().error,
      'myerror',
      'should handle error option');

    tape.strictEqual(
      new Radio({
        type: Country,
        options: {
            error: function (value) {
              return 'error: ' + value;
            }
        },
        ctx: ctx,
        value: 'a'
      }).getLocals().error,
      'error: a',
      'should handle error option as a function');
  });

  tape.test('template', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      new Radio({
        type: Country,
        options: {},
        ctx: ctx
      }).getTemplate(),
      bootstrap.radio,
      'default template should be bootstrap.eadio');

    var template = function () {};

    tape.strictEqual(
      new Radio({
        type: Country,
        options: {template: template},
        ctx: ctx
      }).getTemplate(),
      template,
      'should handle template option');

  });

  tape.test('options', function (tape) {
    tape.plan(1);

    tape.deepEqual(
      new Radio({
        type: Country,
        options: {
          options: [
            {value: 'IT', text: 'Italia'},
            {value: 'US', text: 'Stati Uniti'}
          ]
        },
        ctx: ctx
      }).getLocals().options,
      [
        { text: 'Italia', value: 'IT' },
        { text: 'Stati Uniti', value: 'US' }
      ],
      'should handle options option');

  });

  tape.test('order', function (tape) {
    tape.plan(2);

    tape.deepEqual(
      new Radio({
        type: Country,
        options: {order: 'asc'},
        ctx: ctx
      }).getLocals().options,
      [
        { text: 'France', value: 'FR' },
        { text: 'Italy', value: 'IT' },
        { text: 'United States', value: 'US' }
      ],
      'should handle order = asc option');

    tape.deepEqual(
      new Radio({
        type: Country,
        options: {order: 'desc'},
        ctx: ctx
      }).getLocals().options,
      [
        { text: 'United States', value: 'US' },
        { text: 'Italy', value: 'IT' },
        { text: 'France', value: 'FR' }
      ],
      'should handle order = desc option');

  });

  if (typeof window !== 'undefined') {

    tape.test('validate', function (tape) {
      tape.plan(8);

      var result;

      // required type, default value
      result = renderComponent({
        type: Country
      }).validate();

      tape.strictEqual(result.isValid(), false);
      tape.strictEqual(result.value, null);

      // required type, setting a value
      result = renderComponent({
        type: Country,
        value: 'IT'
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, 'IT');

      // optional type
      result = renderComponent({
        type: t.maybe(Country)
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, null);

      result = renderComponent({
        type: t.maybe(t.Bool),
        options: {
          transformer: transformer,
          options: [
            {value: '0', text: 'No'},
            {value: '1', text: 'Yes'}
          ]
        },
        value: true
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, true);

    });

  }

});


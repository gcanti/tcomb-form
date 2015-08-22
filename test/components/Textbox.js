'use strict';

var tape = require('tape');
var t = require('tcomb-validation');
var bootstrap = require('../../lib/templates/bootstrap');
var Textbox = require('../../lib/components').Textbox;
var React = require('react');
var vdom = require('react-vdom');
var util = require('./util');
var ctx = util.ctx;
var ctxPlaceholders = util.ctxPlaceholders;
var ctxNone = util.ctxNone;
var renderComponent = util.getRenderComponent(Textbox);

var transformer = {
  format: function (value) {
    return Array.isArray(value) ? value : value.split(' ');
  },
  parse: function (value) {
    return value.join(' ');
  }
};

tape('Textbox', function (tape) {

  tape.test('path', function (tape) {
    tape.plan(1);

    tape.deepEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().path,
      [ 'defaultPath' ],
      'should handle the path');

  });

  tape.test('attrs', function (tape) {
    tape.plan(1);

    tape.strictEqual(
      new Textbox({
        type: t.Num,
        options: {
          type: 'number',
          attrs: {
            min: 0
          }
        },
        ctx: ctx
      }).getLocals().attrs.min,
      0,
      'should handle attrs option');

  });

  tape.test('attrs.events', function (tape) {
    tape.plan(1);

    function onBlur() {}

    tape.deepEqual(
      new Textbox({
        type: t.Str,
        options: {
          attrs: {
            id: 'myid',
            onBlur: onBlur
          }
        },
        ctx: ctx
      }).getLocals().attrs,
      {
        name: 'defaultName',
        id: 'myid',
        onBlur: onBlur,
        placeholder: undefined
      },
      'should handle events');

  });

  tape.test('attrs.className', function (tape) {
    tape.plan(3);

    tape.deepEqual(
      new Textbox({
        type: t.Str,
        options: {
          attrs: {
            id: 'myid',
            className: 'myclass'
          }
        },
        ctx: ctx
      }).getLocals().attrs,
      {
        name: 'defaultName',
        id: 'myid',
        className: {
          myclass: true
        },
        placeholder: undefined
      },
      'should handle classNames as strings');

    tape.deepEqual(
      new Textbox({
        type: t.Str,
        options: {
          attrs: {
            id: 'myid',
            className: ['myclass1', 'myclass2']
          }
        },
        ctx: ctx
      }).getLocals().attrs,
      {
        name: 'defaultName',
        id: 'myid',
        className: {
          'myclass1 myclass2': true
        },
        placeholder: undefined
      },
      'should handle classNames as arrays');

    tape.deepEqual(
      new Textbox({
        type: t.Str,
        options: {
          attrs: {
            id: 'myid',
            className: {
              myclass1: true,
              myclass2: true
            }
          }
        },
        ctx: ctx
      }).getLocals().attrs,
      {
        name: 'defaultName',
        id: 'myid',
        className: {
          'myclass1 myclass2': true
        },
        placeholder: undefined
      },
      'should handle classNames as object');

  });

  tape.test('label', function (tape) {
    tape.plan(5);

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().label,
      'Default label',
      'should have a default label');

    ctx.i18n.required = ' (required)';
    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().label,
      'Default label (required)',
      'should have a default label');
    ctx.i18n.required = '';

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {label: 'mylabel'},
        ctx: ctx
      }).getLocals().label,
      'mylabel',
      'should handle label option as string');

    tape.deepEqual(
      vdom(new Textbox({
        type: t.Str,
        options: {label: React.DOM.i(null, 'JSX label')},
        ctx: ctx
      }).getLocals().label),
      {tag: 'i', children: 'JSX label'},
      'should handle label option as JSX');

    tape.strictEqual(
      new Textbox({
        type: t.maybe(t.Str),
        options: {},
        ctx: ctx
      }).getLocals().label,
      'Default label (optional)',
      'should handle optional types');

  });

  tape.test('attrs.placeholder', function (tape) {
    tape.plan(6);

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().attrs.placeholder,
      undefined,
      'default placeholder should be undefined');

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {attrs: {placeholder: 'myplaceholder'}},
        ctx: ctx
      }).getLocals().attrs.placeholder,
      'myplaceholder',
      'should handle placeholder option');

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {label: 'mylabel', attrs: {placeholder: 'myplaceholder'}},
        ctx: ctx
      }).getLocals().attrs.placeholder,
      'myplaceholder',
      'should handle placeholder option even if a label is specified');

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctxPlaceholders
      }).getLocals().attrs.placeholder,
      'Default label',
      'should have a default placeholder if auto = placeholders');

    tape.strictEqual(
      new Textbox({
        type: t.maybe(t.Str),
        options: {},
        ctx: ctxPlaceholders
      }).getLocals().attrs.placeholder,
      'Default label (optional)',
      'should handle optional types if auto = placeholders');

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {attrs: {placeholder: 'myplaceholder'}},
        ctx: ctxNone
      }).getLocals().attrs.placeholder,
      'myplaceholder',
      'should handle placeholder option even if auto === none');

  });

  tape.test('disabled', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().disabled,
      undefined,
      'default disabled should be undefined');

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {disabled: true},
        ctx: ctx
      }).getLocals().disabled,
      true,
      'should handle disabled = true');

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {disabled: false},
        ctx: ctx
      }).getLocals().disabled,
      false,
      'should handle disabled = false');
  });

  tape.test('help', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {help: 'myhelp'},
        ctx: ctx
      }).getLocals().help,
      'myhelp',
      'should handle help option as string');

    tape.deepEqual(
      vdom(new Textbox({
        type: t.Str,
        options: {help: React.DOM.i(null, 'JSX help')},
        ctx: ctx
      }).getLocals().help),
      {tag: 'i', children: 'JSX help'},
      'should handle help option as JSX');

  });

  tape.test('value', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().value,
      null,
      'default value should be null');

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx,
        value: 'a'
      }).getLocals().value,
      'a',
      'should handle value option');

    tape.strictEqual(
      new Textbox({
        type: t.Num,
        options: {},
        ctx: ctx,
        value: 1.1
      }).getLocals().value,
      '1.1',
      'should handle numeric values');

  });

  tape.test('transformer', function (tape) {
    tape.plan(1);

    tape.deepEqual(
      new Textbox({
        type: t.Str,
        options: {transformer: transformer},
        ctx: ctx,
        value: 'a b'
      }).getLocals().value,
      ['a', 'b'],
      'should handle transformer option (format)');

  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().hasError,
      false,
      'default hasError should be false');

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {hasError: true},
        ctx: ctx
      }).getLocals().hasError,
      true,
      'should handle hasError option');

    var textbox = new Textbox({
      type: t.Str,
      options: {},
      ctx: ctx
    });

  });

  tape.test('error', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().error,
      undefined,
      'default error should be undefined');

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {error: 'myerror'},
        ctx: ctx
      }).getLocals().error,
      'myerror',
      'should handle error option');

    tape.strictEqual(
      new Textbox({
        type: t.Str,
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
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getTemplate(),
      bootstrap.textbox,
      'default template should be bootstrap.textbox');

    var template = function () {};

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {template: template},
        ctx: ctx
      }).getTemplate(),
      template,
      'should handle template option');

  });

  if (typeof window !== 'undefined') {

    tape.test('validate', function (tape) {
      tape.plan(20);

      var result;

      // required type, default value
      result = renderComponent({
        type: t.Str
      }).validate();

      tape.strictEqual(result.isValid(), false);
      tape.strictEqual(result.value, null);

      // required type, setting a value
      result = renderComponent({
        type: t.Str,
        value: 'a'
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, 'a');

      // string type with numeric value
      result = renderComponent({
        type: t.Str,
        value: '123'
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, '123');

      // optional type
      result = renderComponent({
        type: t.maybe(t.Str)
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, null);

      // numeric type
      result = renderComponent({
        type: t.Num,
        value: 1
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, 1);

      // optional numeric type
      result = renderComponent({
        type: t.maybe(t.Num),
        value: ''
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, null);

      // numeric type with stringy value
      result = renderComponent({
        type: t.Num,
        value: '1.01'
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, 1.01);

      // subtype, setting a valid value
      result = renderComponent({
        type: t.subtype(t.Num, function (n) { return n >= 0; }),
        value: 1
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, 1);

      // subtype, setting an invalid value
      result = renderComponent({
        type: t.subtype(t.Num, function (n) { return n >= 0; }),
        value: -1
      }).validate();

      tape.strictEqual(result.isValid(), false);
      tape.strictEqual(result.value, -1);

      // should handle transformer option (parse)
      result = renderComponent({
        type: t.Str,
        options: {transformer: transformer},
        value: ['a', 'b']
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, 'a b');

    });

  }

});


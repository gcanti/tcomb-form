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

tape('Textbox', function (tape) {

  var Textbox = components.Textbox;

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

    tape.deepEqual(
      new Textbox({
        type: t.Num,
        options: {
          type: 'number',
          attrs: {
            id: 'myid',
            min: 0,
            max: 5
          }
        },
        ctx: ctx
      }).getLocals().attrs,
      {
        name: 'defaultName',
        id: 'myid',
        min: 0,
        max: 5
      },
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
        onBlur: onBlur
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
        }
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
          myclass1: true,
          myclass2: true
        }
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
          myclass1: true,
          myclass2: true
        }
      },
      'should handle classNames as object');

  });

  tape.test('label', function (tape) {
    tape.plan(4);

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().label,
      'Default label',
      'should have a default label');

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
      {tag: 'i', attrs: {}, children: 'JSX label'},
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

  tape.test('placeholder', function (tape) {
    tape.plan(6);

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().placeholder,
      undefined,
      'default placeholder should be undefined');

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {placeholder: 'myplaceholder'},
        ctx: ctx
      }).getLocals().placeholder,
      'myplaceholder',
      'should handle placeholder option');

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {label: 'mylabel', placeholder: 'myplaceholder'},
        ctx: ctx
      }).getLocals().placeholder,
      'myplaceholder',
      'should handle placeholder option even if a label is specified');

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctxPlaceholders
      }).getLocals().placeholder,
      'Default label',
      'should have a default placeholder if auto = placeholders');

    tape.strictEqual(
      new Textbox({
        type: t.maybe(t.Str),
        options: {},
        ctx: ctxPlaceholders
      }).getLocals().placeholder,
      'Default label (optional)',
      'should handle optional types if auto = placeholders');

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {placeholder: 'myplaceholder'},
        ctx: ctxNone
      }).getLocals().placeholder,
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
      {tag: 'i', attrs: {}, children: 'JSX help'},
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
    tape.plan(2);

    var transformer = {
      format: function (value) {
        return Array.isArray(value) ? value.join(' ') : value;
      },
      parse: function (value) {
        return value.split(' ');
      }
    };

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {transformer: transformer},
        ctx: ctx,
        value: ['a', 'b']
      }).getLocals().value,
      'a b',
      'should handle transformer option (format)');

    tape.deepEqual(
      new Textbox({
        type: t.Str,
        options: {transformer: transformer},
        ctx: ctx,
        value: ['a', 'b']
      }).validate().value,
      ['a', 'b'],
      'should handle transformer option (parse)');

  });

  tape.test('hasError', function (tape) {
    tape.plan(4);

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

    textbox.validate();

    tape.strictEqual(
      textbox.getLocals().hasError,
      false,
      'after a validation error hasError should be true');

    textbox = new Textbox({
      type: t.Str,
      options: {},
      ctx: ctx,
        value: 'a'
    });

    textbox.validate();

    tape.strictEqual(
      textbox.getLocals().hasError,
      false,
      'after a validation success hasError should be false');

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

});


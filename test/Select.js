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

tape('Select', function (tape) {

  var Select = components.Select;
  var Country = t.enums({
    'IT': 'Italy',
    'FR': 'France',
    'US': 'United States'
  });

  tape.test('label', function (tape) {
    tape.plan(4);

    tape.strictEqual(
      new Select({
        type: Country,
        options: {},
        ctx: ctx
      }).getLocals().label,
      'Default label',
      'should have a default label');

    tape.strictEqual(
      new Select({
        type: Country,
        options: {label: 'mylabel'},
        ctx: ctx
      }).getLocals().label,
      'mylabel',
      'should handle label option as string');

    tape.deepEqual(
      vdom(new Select({
        type: Country,
        options: {label: React.DOM.i(null, 'JSX label')},
        ctx: ctx
      }).getLocals().label),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle label option as JSX');

    tape.strictEqual(
      new Select({
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
      new Select({
        type: Country,
        options: {help: 'myhelp'},
        ctx: ctx
      }).getLocals().help,
      'myhelp',
      'should handle help option as string');

    tape.deepEqual(
      vdom(new Select({
        type: Country,
        options: {help: React.DOM.i(null, 'JSX help')},
        ctx: ctx
      }).getLocals().help),
      {tag: 'i', attrs: {}, children: 'JSX help'},
      'should handle help option as JSX');

  });

  tape.test('value', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      new Select({
        type: Country,
        options: {},
        ctx: ctx
      }).getLocals().value,
      '',
      'default value should be nullOption.value');

    tape.strictEqual(
      new Select({
        type: Country,
        options: {},
        ctx: ctx,
        value: 'a'
      }).getLocals().value,
      'a',
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
      new Select({
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

    tape.deepEqual(
      new Select({
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
      }).validate().value,
      true,
      'should handle transformer option (parse)');

  });

  tape.test('hasError', function (tape) {
    tape.plan(4);

    tape.strictEqual(
      new Select({
        type: Country,
        options: {},
        ctx: ctx
      }).getLocals().hasError,
      false,
      'default hasError should be false');

    tape.strictEqual(
      new Select({
        type: Country,
        options: {hasError: true},
        ctx: ctx
      }).getLocals().hasError,
      true,
      'should handle hasError option');

    var select = new Select({
      type: Country,
      options: {},
      ctx: ctx
    });

    select.validate();

    tape.strictEqual(
      select.getLocals().hasError,
      false,
      'after a validation error hasError should be true');

    var select = new Select({
      type: Country,
      options: {},
      ctx: ctx,
      value: 'IT'
    });

    select.validate();

    tape.strictEqual(
      select.getLocals().hasError,
      false,
      'after a validation success hasError should be false');

  });

  tape.test('error', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      new Select({
        type: Country,
        options: {},
        ctx: ctx
      }).getLocals().error,
      undefined,
      'default error should be undefined');

    tape.strictEqual(
      new Select({
        type: Country,
        options: {error: 'myerror'},
        ctx: ctx
      }).getLocals().error,
      'myerror',
      'should handle error option');

    tape.strictEqual(
      new Select({
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
      new Select({
        type: Country,
        options: {},
        ctx: ctx
      }).getTemplate(),
      bootstrap.select,
      'default template should be bootstrap.select');

    var template = function () {};

    tape.strictEqual(
      new Select({
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
      new Select({
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
        { text: '-', value: '' },
        { text: 'Italia', value: 'IT' },
        { text: 'Stati Uniti', value: 'US' }
      ],
      'should handle options option');

  });

  tape.test('order', function (tape) {
    tape.plan(2);

    tape.deepEqual(
      new Select({
        type: Country,
        options: {order: 'asc'},
        ctx: ctx
      }).getLocals().options,
      [
        { text: '-', value: '' },
        { text: 'France', value: 'FR' },
        { text: 'Italy', value: 'IT' },
        { text: 'United States', value: 'US' }
      ],
      'should handle order = asc option');

    tape.deepEqual(
      new Select({
        type: Country,
        options: {order: 'desc'},
        ctx: ctx
      }).getLocals().options,
      [
        { text: '-', value: '' },
        { text: 'United States', value: 'US' },
        { text: 'Italy', value: 'IT' },
        { text: 'France', value: 'FR' }
      ],
      'should handle order = desc option');

  });

  tape.test('nullOption', function (tape) {
    tape.plan(2);

    tape.deepEqual(
      new Select({
        type: Country,
        options: {
          nullOption: {value: '', text: 'Select a country'}
        },
        ctx: ctx
      }).getLocals().options,
      [
        { value: '', text: 'Select a country' },
        { text: 'Italy', value: 'IT' },
        { text: 'France', value: 'FR' },
        { text: 'United States', value: 'US' }
      ],
      'should handle nullOption option');

    tape.deepEqual(
      new Select({
        type: Country,
        options: {
          nullOption: false
        },
        ctx: ctx,
        value: 'US'
      }).getLocals().options,
      [
        { text: 'Italy', value: 'IT' },
        { text: 'France', value: 'FR' },
        { text: 'United States', value: 'US' }
      ],
      'should skip the nullOption if nullOption = false');

  });

});


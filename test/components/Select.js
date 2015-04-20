'use strict';

var tape = require('tape');
var t = require('tcomb');
var bootstrap = require('../../lib/templates/bootstrap');
var Select = require('../../lib/components').Select;
var React = require('react');
var vdom = require('react-vdom');
var util = require('./util');
var ctx = util.ctx;
var renderComponent = util.getRenderComponent(Select);

var transformer = {
  format: function (value) {
    return t.Str.is(value) ? value : value === true ? '1' : '0';
  },
  parse: function (value) {
    return value === '1';
  }
};

tape('Select', function (tape) {

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
    tape.plan(1);

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

  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

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

  if (typeof window !== 'undefined') {

    tape.test('validate', function (tape) {
      tape.plan(16);

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

      // option groups
      var Car = t.enums.of('Audi Chrysler Ford Renault Peugeot');
      result = renderComponent({
        type: Car,
        options: {
          options: [
            {value: 'Audi', text: 'Audi'}, // an option
            {label: 'US', options: [ // a group of options
              {value: 'Chrysler', text: 'Chrysler'},
              {value: 'Ford', text: 'Ford'}
            ]},
            {label: 'France', options: [ // another group of options
              {value: 'Renault', text: 'Renault'},
              {value: 'Peugeot', text: 'Peugeot'}
            ], disabled: true} // use `disabled: true` to disable an optgroup
          ]
        },
        value: 'Ford'
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, 'Ford');

      //
      // multiple select
      //

      // default value should be []
      result = renderComponent({
        type: t.list(Country)
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.deepEqual(result.value, []);

      // setting a value
      result = renderComponent({
        type: t.list(Country),
        value: ['IT', 'US']
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.deepEqual(result.value, ['IT', 'US']);

      // subtyped multiple select
      result = renderComponent({
        type: t.subtype(t.list(Country), function (x) { return x.length >= 2; }),
        value: ['IT']
      }).validate();

      tape.strictEqual(result.isValid(), false);
      tape.deepEqual(result.value, ['IT']);

      // should handle transformer option (parse)
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
      tape.deepEqual(result.value, true);

    });

  }

});


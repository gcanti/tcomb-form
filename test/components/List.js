'use strict';

var test = require('tape');
var React = require('react');
var t = require('../../.');
var List = require('../../lib/components/List');
var bootstrap = require('../../lib/skins/bootstrap');
var util = require('./util');
var vdom = require('react-vdom');

var getLocals = util.getLocalsFactory(List);
var getValue = util.getValueFactory(List, bootstrap.list);

test('List', function (tape) {

  tape.test('className', function (tape) {
    tape.plan(1);

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}, {className: 'myClassName'}).className,
      'myClassName',
      'should handle className option');

  });

  tape.test('disabled', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}).disabled,
      null,
      'default disabled should be null');

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}, {disabled: true}).disabled,
      true,
      'should handle disabled = true');

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}, {disabled: false}).disabled,
      false,
      'should handle disabled = false');
  });

  tape.test('disableRemove', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}, null, ['a']).items[0].buttons[0].label,
      'Remove',
      'default disableRemove should be null');

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}, {disableRemove: true}, ['a']).items[0].buttons[0].label,
      'Up',
      'should handle disableRemove = true');

  });

  tape.test('legend', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}, {legend: 'mylegend'}).legend,
      'mylegend',
      'should handle legend as strings');

    tape.deepEqual(
      vdom(getLocals({type: t.list(t.Str)}, {legend: React.DOM.i(null, 'JSX legend')}).legend),
      {tag: 'i', attrs: {}, children: 'JSX legend'},
      'should handle legend as JSX');
  });

  tape.test('help', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}, {help: 'mylabel'}).help,
      'mylabel',
      'should handle help as strings');

    tape.deepEqual(
      vdom(getLocals({type: t.list(t.Str)}, {help: React.DOM.i(null, 'JSX label')}).help),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle help as JSX');
  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}).hasError,
      false,
      'default hasError should be false');

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}, {hasError: true}).hasError,
      true,
      'should handle hasError option');
  });

  tape.test('error', function (tape) {
    tape.plan(4);

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}).error,
      null,
      'default error should be null');

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}, {error: 'myerror'}).error,
      'myerror',
      'should handle error option as string');

    tape.deepEqual(
      vdom(getLocals({type: t.list(t.Str)}, {error: React.DOM.i(null, 'JSX label')}).error),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle error option as JSX');

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}, {error: function (value) {
        return 'error: ' + JSON.stringify(value);
      }}, []).error,
      'error: []',
      'should handle error option as a function');
  });

  tape.test('value', function (tape) {
    tape.plan(2);

    tape.deepEqual(
      getLocals({type: t.list(t.Str)}).value,
      [],
      'default value should be []');

    tape.deepEqual(
      getLocals({type: t.list(t.Str)}, null, ['a']).value,
      ['a'],
      'should handle value prop');

  });

  if (typeof window !== 'undefined') {

    tape.test('getValue', function (tape) {
        tape.plan(2);

        getValue(function (result) {
          tape.strictEqual(result.isValid(), true);
          tape.deepEqual(result.value, ['a', 'b']);
        }, function () {
        }, {type: t.list(t.Str)}, null, ['a', 'b']);

    });

  }

});



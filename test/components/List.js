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

  tape.test('label', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}, {label: 'mylabel'}).label,
      'mylabel',
      'should handle label as strings');

    tape.deepEqual(
      vdom(getLocals({type: t.list(t.Str)}, {label: React.DOM.i(null, 'JSX label')}).label),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle label as JSX');
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



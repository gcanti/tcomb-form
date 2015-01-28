'use strict';

var test = require('tape');
var React = require('react');
var t = require('../../.');
var Checkbox = require('../../lib/components/Checkbox');
var bootstrap = require('../../lib/skins/bootstrap');
var util = require('./util');
var vdom = require('react-vdom');

var getLocals = util.getLocalsFactory(Checkbox);
var getValue = util.getValueFactory(Checkbox, bootstrap.checkbox);

test('Checkbox', function (tape) {

  tape.test('disabled', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: t.Bool}, {label: 'mylabel'}).disabled,
      null,
      'default disabled should be null');

    tape.strictEqual(
      getLocals({type: t.Bool}, {label: 'mylabel', disabled: true}).disabled,
      true,
      'should handle disabled = true');

    tape.strictEqual(
      getLocals({type: t.Bool}, {label: 'mylabel', disabled: false}).disabled,
      false,
      'should handle disabled = false');
  });

  tape.test('label', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.Bool}, {label: 'mylabel'}).label,
      'mylabel',
      'should handle label as strings');

    tape.deepEqual(
      vdom(getLocals({type: t.Bool}, {label: React.DOM.i(null, 'JSX label')}).label),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle label as JSX');
  });

  tape.test('help', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.Bool}, {help: 'mylabel'}).help,
      'mylabel',
      'should handle help as strings');

    tape.deepEqual(
      vdom(getLocals({type: t.Bool}, {help: React.DOM.i(null, 'JSX label')}).help),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle help as JSX');
  });

  tape.test('name', function (tape) {
    tape.plan(2);

    tape.ok(
      t.Str.is(getLocals({type: t.Bool}).name),
      'should have a default name');

    tape.strictEqual(
      getLocals({type: t.Bool}, {name: 'myname'}).name,
      'myname',
      'should handle name as strings');

  });

  tape.test('value', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.Bool}).value,
      false,
      'default value should be false');

    tape.strictEqual(
      getLocals({type: t.Bool}, null, true).value,
      true,
      'should handle value prop');

  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.Bool}).hasError,
      false,
      'default hasError should be false');

    tape.strictEqual(
      getLocals({type: t.Bool}, {hasError: true}).hasError,
      true,
      'should handle hasError option');
  });

  tape.test('error', function (tape) {
    tape.plan(4);

    tape.strictEqual(
      getLocals({type: t.Bool}).error,
      null,
      'default error should be null');

    tape.strictEqual(
      getLocals({type: t.Bool}, {error: 'myerror'}).error,
      'myerror',
      'should handle error option as string');

    tape.deepEqual(
      vdom(getLocals({type: t.Bool}, {error: React.DOM.i(null, 'JSX label')}).error),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle error option as JSX');

    tape.strictEqual(
      getLocals({type: t.Bool}, {error: function (value) {
        return 'error: ' + value;
      }}, true).error,
      'error: true',
      'should handle error option as a function');
  });

  tape.test('template', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: t.Bool}).template,
      bootstrap.checkbox,
      'default template should be bootstrap.checkbox');

    var template = function () {};

    tape.strictEqual(
      getLocals({type: t.Bool}, {template: template}).template,
      template,
      'should handle template option');

    tape.strictEqual(
      getLocals({type: t.Bool, templates: {checkbox: template}}).template,
      template,
      'should handle context templates');

  });

  tape.test('id', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: t.Bool}).id.substr(8, 1),
      '-',
      'default id should be a uuid');

    tape.strictEqual(
      getLocals({type: t.Bool}, {id: 'myid'}).id,
      'myid',
      'should handle id option');

    tape.strictEqual(
      getLocals({type: t.Bool}, {id: 'myid'}).name,
      'myid',
      'should use id as default name');

  });

  tape.test('autoFocus', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.Bool}).autoFocus,
      null,
      'default autoFocus should be null');

    tape.strictEqual(
      getLocals({type: t.Bool}, {autoFocus: true}).autoFocus,
      true,
      'should handle autoFocus option');

  });

  if (typeof window !== 'undefined') {

    tape.test('getValue', function (tape) {
        tape.plan(8);

        getValue(function (result) {
          tape.strictEqual(result.isValid(), true);
          tape.strictEqual(result.value, false);
        }, function (locals) {
          tape.strictEqual(locals.hasError, false);
          tape.strictEqual(locals.value, false);
        }, {type: t.Bool}, {label: 'mylabel'});

        getValue(function (result) {
          tape.strictEqual(result.isValid(), false);
          tape.strictEqual(result.value, false);
        }, function (locals, rendered) {
          if (rendered) {
            tape.strictEqual(locals.hasError, true);
            tape.strictEqual(locals.value, false);
          }
        }, {type: t.subtype(t.Bool, function (x) { return x === true; })}, {label: 'mylabel'});

    });

  }

});



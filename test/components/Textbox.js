'use strict';

var test = require('tape');
var React = require('react');
var t = require('../../.');
var Textbox = require('../../lib/components/Textbox');
var bootstrap = require('../../lib/skins/bootstrap');
var util = require('./util');
var vdom = require('react-vdom');

var getLocals = util.getLocalsFactory(Textbox);
var getValue = util.getValueFactory(Textbox, bootstrap.textbox);

var transformer = {
  format: function (value) {
    return value.join(',');
  },
  parse: function (value) {
    return value.split(',');
  }
};

test('Textbox', function (tape) {

  tape.test('type', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.Str}).type,
      'text',
      'default type should be "text"');

    tape.strictEqual(
      getLocals({type: t.Str}, {type: 'color'}).type,
      'color',
      'should handle text option');

  });

  tape.test('placeholder', function (tape) {
    tape.plan(4);

    tape.strictEqual(
      getLocals({type: t.Str}).placeholder,
      null,
      'default placeholder should be null');

    tape.strictEqual(
      getLocals({type: t.Str, label: 'defaultLabel'}).placeholder,
      'defaultLabel',
      'should use ontext label');

    tape.strictEqual(
      getLocals({type: t.maybe(t.Str), label: 'defaultLabel'}).placeholder,
      'defaultLabel (optional)',
      'should handle an optional type');

    tape.strictEqual(
      getLocals({type: t.Str}, {placeholder: 'myplaceholder'}).placeholder,
      'myplaceholder',
      'should handle placeholder option');

  });

  tape.test('disabled', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: t.Str}).disabled,
      null,
      'default disabled should be null');

    tape.strictEqual(
      getLocals({type: t.Str}, {disabled: true}).disabled,
      true,
      'should handle disabled = true');

    tape.strictEqual(
      getLocals({type: t.Str}, {disabled: false}).disabled,
      false,
      'should handle disabled = false');
  });

  tape.test('label', function (tape) {
    tape.plan(6);

    tape.strictEqual(
      getLocals({type: t.Str, label: 'defaultLabel'}).label,
      null,
      'should default to null');

    tape.strictEqual(
      getLocals({type: t.Str, label: 'defaultLabel', auto: 'labels'}).label,
      'defaultLabel',
      'should have a default label if ctx.auto = `labels`');

    tape.strictEqual(
      getLocals({type: t.maybe(t.Str), label: 'defaultLabel', auto: 'labels'}).label,
      'defaultLabel (optional)',
      'should handle optional types if ctx.auto = `labels`');

    tape.deepEqual(
      getLocals({type: t.Str, label: 'defaultLabel'}, {label: 'mylabel'}).placeholder,
      null,
      'should override the placeholder');

    tape.strictEqual(
      getLocals({type: t.Str, label: 'defaultLabel'}, {label: 'mylabel'}).label,
      'mylabel',
      'should handle label as strings');

    tape.deepEqual(
      vdom(getLocals({type: t.Str}, {label: React.DOM.i(null, 'JSX label')}).label),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle label as JSX');

  });

  tape.test('help', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.Str}, {help: 'mylabel'}).help,
      'mylabel',
      'should handle help as strings');

    tape.deepEqual(
      vdom(getLocals({type: t.Str}, {help: React.DOM.i(null, 'JSX label')}).help),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle help as JSX');
  });

  tape.test('name', function (tape) {
    tape.plan(2);

    tape.ok(
      t.Str.is(getLocals({type: t.Str}).name),
      'should have a default name');

    tape.strictEqual(
      getLocals({type: t.Str}, {name: 'myname'}).name,
      'myname',
      'should handle name as strings');

  });

  tape.test('transformer', function (tape) {
    tape.plan(1);

    tape.strictEqual(
      getLocals({type: t.Arr}, {transformer: transformer}, ['a', 'b']).value,
      'a,b',
      'should handle transformer option');

  });

  tape.test('value', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: t.Str}).value,
      null,
      'default value should be null');

    tape.strictEqual(
      getLocals({type: t.Str}, {}, 'a').value,
      'a',
      'should handle value prop');

    tape.strictEqual(
      getLocals({type: t.Num}, {}, 1).value,
      '1',
      'should handle numeric values');

  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.Str}).hasError,
      false,
      'default hasError should be false');

    tape.strictEqual(
      getLocals({type: t.Str}, {hasError: true}).hasError,
      true,
      'should handle hasError option');
  });

  tape.test('error', function (tape) {
    tape.plan(4);

    tape.strictEqual(
      getLocals({type: t.Str}).error,
      null,
      'default error should be null');

    tape.strictEqual(
      getLocals({type: t.Str}, {error: 'myerror'}).error,
      'myerror',
      'should handle error option as string');

    tape.deepEqual(
      vdom(getLocals({type: t.Str}, {error: React.DOM.i(null, 'JSX label')}).error),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle error option as JSX');

    tape.strictEqual(
      getLocals({type: t.Str}, {error: function (value) {
        return 'error: ' + value;
      }}, 'a').error,
      'error: a',
      'should handle error option as a function');
  });

  tape.test('template', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: t.Str}).template,
      bootstrap.textbox,
      'default template should be bootstrap.textbox');

    var template = function () {};

    tape.strictEqual(
      getLocals({type: t.Str}, {template: template}).template,
      template,
      'should handle template option');

    tape.strictEqual(
      getLocals({type: t.Str, templates: {textbox: template}}).template,
      template,
      'should handle context templates');

  });

  tape.test('id', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: t.Str}).id.substr(8, 1),
      '-',
      'default id should be a uuid');

    tape.strictEqual(
      getLocals({type: t.Str}, {id: 'myid'}).id,
      'myid',
      'should handle id option');

    tape.strictEqual(
      getLocals({type: t.Str}, {id: 'myid'}).name,
      'myid',
      'should use id as default name');

  });

  tape.test('autoFocus', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.Str}).autoFocus,
      null,
      'default autoFocus should be null');

    tape.strictEqual(
      getLocals({type: t.Str}, {autoFocus: true}).autoFocus,
      true,
      'should handle autoFocus option');

  });

  if (typeof window !== 'undefined') {

    tape.test('getValue', function (tape) {
        tape.plan(20);

        getValue(function (result) {
          tape.strictEqual(result.isValid(), true);
          tape.strictEqual(result.value, null);
        }, function (locals) {
            tape.strictEqual(locals.hasError, false);
            tape.strictEqual(locals.value, null);
        }, {type: t.maybe(t.Str)});

        getValue(function (result) {
          tape.strictEqual(result.isValid(), false);
          tape.strictEqual(result.value, null);
        }, function (locals, rendered) {
          if (rendered) {
            tape.strictEqual(locals.hasError, true);
            tape.strictEqual(locals.value, null);
          }
        }, {type: t.Str});

        // should handle numeric values
        getValue(function (result) {
          tape.strictEqual(result.isValid(), true);
          tape.strictEqual(result.value, 1);
        }, function (locals) {
            tape.strictEqual(locals.hasError, false);
            tape.strictEqual(locals.value, '1');
        }, {type: t.Num}, null, 1);

        // should handle transformer option
        getValue(function (result) {
          tape.strictEqual(result.isValid(), true);
          tape.deepEqual(result.value, ['a', 'b']);
        }, function (locals) {
            tape.strictEqual(locals.hasError, false);
            tape.strictEqual(locals.value, 'a,b');
        }, {type: t.Arr}, {transformer: transformer}, ['a', 'b']);

        // hidden textbox
        getValue(function (result) {
          tape.strictEqual(result.isValid(), true);
          tape.strictEqual(result.value, null);
        }, function (locals) {
            tape.strictEqual(locals.hasError, false);
            tape.strictEqual(locals.value, null);
        }, {type: t.maybe(t.Str)}, {type: 'hidden'});

    });

  }

});



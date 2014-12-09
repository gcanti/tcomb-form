'use strict';

require('node-jsx').install();
var React = require('react');
var test = require('tape');
var vdom = require('react-vdom');
var t = require('../.');

function assertLocals(type, opts, asserts) {
  opts = t.util.mixin({template: asserts}, opts);
  var Input = t.form.create(type, opts);
  vdom(React.createElement(Input, {}));
}

test('humanize', function (tape) {
  tape.plan(3);

  var humanize = require('../lib/util/humanize');

  tape.deepEqual(humanize('username'), 'Username');
  tape.deepEqual(humanize('rememberMe'), 'Remember me');
  tape.deepEqual(humanize('remember_me'), 'Remember me');
});

test('textbox', function (tape) {

  tape.test('default for `opts.type` should be `text`', function (tape) {
    tape.plan(1);
    assertLocals(t.Str, {}, function (locals) {
      tape.deepEqual(locals.type, 'text');
    });
  });

  tape.test('should handle `opts.type`', function (tape) {
    tape.plan(2);
    assertLocals(t.Str, {type: 'hidden'}, function (locals) {
      tape.deepEqual(locals.type, 'hidden');
    });
    assertLocals(t.Str, {type: 'textarea'}, function (locals) {
      tape.deepEqual(locals.type, 'textarea');
    });
  });

});

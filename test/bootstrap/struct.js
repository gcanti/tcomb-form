'use strict';

var test = require('tape');
var t = require('tcomb-validation');
var skin = require('../../lib/skin');
var bootstrap = require('../../lib/skins/bootstrap');
var diff = require('deep-diff').diff;
var compact = require('./compact');
var mixin = t.util.mixin;

test('bootstrap struct()', function (tape) {

  var base = {
    inputs: {},
    order: []
  };

  var equal = function (tape, locals, expected, showDiff) {
    locals = mixin(mixin({}, base), locals, true);
    locals = new skin.Struct(locals);
    expected = compact(expected);
    var actual = compact(bootstrap.struct(locals));
    if (showDiff) {
      console.dir(diff(actual, expected));
    }
    tape.deepEqual(actual, expected);
  };

  tape.test('base', function (tape) {
    tape.plan(1);
    equal(tape, {}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'fieldset',
        attrs: {}
      }
    });
  });

  tape.test('disabled', function (tape) {
    tape.plan(1);
    equal(tape, {disabled: true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'fieldset',
        attrs: {
          disabled: true
        }
      }
    });
  });

  tape.test('error', function (tape) {
    tape.plan(1);
    equal(tape, {error: 'myerror', 'hasError': true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'fieldset',
        attrs: {},
        children: {
          tag: 'div',
          attrs: {
            className: {
              'alert': true,
              'alert-danger': true
            }
          },
          children: 'myerror'
        }
      }
    });
  });

  tape.test('help', function (tape) {
    tape.plan(1);
    equal(tape, {help: 'myhelp'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'fieldset',
        attrs: {},
        children: {
          tag: 'div',
          attrs: {
            className: {
              'alert': true,
              'alert-info': true
            }
          },
          children: 'myhelp'
        }
      }
    });
  });

  tape.test('label', function (tape) {
    tape.plan(1);
    equal(tape, {label: 'mylabel'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'fieldset',
        attrs: {},
        children: {
          tag: 'legend',
          children: 'mylabel'
        }
      }
    });
  });

  // FIXME test order
  // FIXME test inputs
  // FIXME test config

});

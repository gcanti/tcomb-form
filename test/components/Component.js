'use strict';

var tape = require('tape');
var t = require('tcomb-validation');
var bootstrap = require('../../lib/templates/bootstrap');
var Component = require('../../lib/components').Component;
var React = require('react');
var util = require('./util');
var ctx = util.ctx;

tape('Component', function (tape) {

  tape.test('typeInfo', function (tape) {
    tape.plan(3);

    var component = new Component({
      type: t.Str,
      options: {},
      ctx: ctx
    });

    tape.deepEqual(component.typeInfo, {
      isMaybe: false,
      isSubtype: false,
      innerType: t.Str
    });

    component = new Component({
      type: t.maybe(t.Str),
      options: {},
      ctx: ctx
    });

    tape.deepEqual(component.typeInfo, {
      isMaybe: true,
      isSubtype: false,
      innerType: t.Str
    });

    component = new Component({
      type: t.subtype(t.Str, function() { return true; }),
      options: {},
      ctx: ctx
    });

    tape.deepEqual(component.typeInfo, {
      isMaybe: false,
      isSubtype: true,
      innerType: t.Str
    });

  });

  tape.test('getId()', function (tape) {
    tape.plan(1);

    tape.strictEqual(
      new Component({
        type: t.Str,
        options: {attrs: {id: 'myid'}},
        ctx: ctx
      }).getId(),
      'myid',
      'should return the provided id');

  });

});

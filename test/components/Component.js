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

    var MaybeString = t.maybe(t.String);
    var Subtype = t.subtype(t.String, function() { return true; });

    var component = new Component({
      type: t.String,
      options: {},
      ctx: ctx
    });

    tape.deepEqual(component.typeInfo, {
      type: t.String,
      isMaybe: false,
      isSubtype: false,
      innerType: t.Str
    });

    component = new Component({
      type: MaybeString,
      options: {},
      ctx: ctx
    });

    tape.deepEqual(component.typeInfo, {
      type: MaybeString,
      isMaybe: true,
      isSubtype: false,
      innerType: t.Str
    });

    component = new Component({
      type: Subtype,
      options: {},
      ctx: ctx
    });

    tape.deepEqual(component.typeInfo, {
      type: Subtype,
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

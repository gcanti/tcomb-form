'use strict';

var tape = require('tape');
var t = require('tcomb');
var bootstrap = require('../../lib/templates/bootstrap');
var Component = require('../../lib/components').Component;
var React = require('react');
var vdom = require('react-vdom');
var util = require('./util');
var ctx = util.ctx;

tape('Component', (tape) => {

  tape.test('typeInfo', (tape) => {
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
      type: t.subtype(t.Str, () => true),
      options: {},
      ctx: ctx
    });

    tape.deepEqual(component.typeInfo, {
      isMaybe: false,
      isSubtype: true,
      innerType: t.Str
    });

  });

  tape.test('getId()', (tape) => {
    tape.plan(2);

    tape.strictEqual(
      t.Str.is(new Component({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getId()),
      true,
      'should return a random uuid');

    tape.strictEqual(
      new Component({
        type: t.Str,
        options: {attrs: {id: 'myid'}},
        ctx: ctx
      }).getId(),
      'myid',
      'should return a random uuid');

  });

});

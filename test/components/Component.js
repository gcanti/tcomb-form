'use strict';

var tape = require('tape');
var t = require('tcomb-validation');
var Component = require('../../src/components').Component;
var util = require('./util');
var ctx = util.ctx;

tape('Component', function (tape) {

  tape.test('getValidationErrorMessage', function (tape) {
    tape.plan(16);

    var component = new Component({
      type: t.String,
      options: {hasError: true},
      ctx: ctx
    });

    tape.strictEqual(component.getError(), undefined, '#1');

    component = new Component({
      type: t.maybe(t.String),
      options: {hasError: true},
      ctx: ctx
    });

    tape.strictEqual(component.getError(), undefined, '#2');

    var Password = t.refinement(t.String, function (s) { return s.length > 6; });

    component = new Component({
      type: Password,
      options: {hasError: true},
      ctx: ctx
    });

    tape.strictEqual(component.getError(), undefined, '#3');

    Password.getValidationErrorMessage = function () {
      return 'bad password';
    };

    component = new Component({
      type: Password,
      options: {hasError: false},
      ctx: ctx
    });

    tape.strictEqual(component.getError(), undefined, '#4.1');

    component = new Component({
      type: Password,
      options: {hasError: true},
      ctx: ctx
    });

    tape.strictEqual(component.getError(), 'bad password', '#4.2');

    component = new Component({
      type: t.maybe(Password),
      options: {hasError: true},
      ctx: ctx
    });

    tape.strictEqual(component.getError(), undefined, '#5');

    component = new Component({
      type: t.maybe(Password),
      options: {hasError: true},
      ctx: ctx,
      value: 'a'
    });

    tape.strictEqual(component.getError(), 'bad password', '#6');

    t.String.getValidationErrorMessage = function () {
      return 'bad string';
    };

    component = new Component({
      type: Password,
      options: {hasError: true},
      ctx: ctx
    });

    tape.strictEqual(component.getError(), 'bad string', '#7');

    delete t.String.getValidationErrorMessage;

    var Age = t.refinement(t.Number, function (n) { return n > 6; });

    component = new Component({
      type: Age,
      options: {hasError: true},
      ctx: ctx
    });

    tape.strictEqual(component.getError(), undefined, '#8');

    component = new Component({
      type: t.maybe(Age),
      options: {hasError: true},
      ctx: ctx
    });

    tape.strictEqual(component.getError(), undefined, '#9');

    Age.getValidationErrorMessage = function () {
      return 'bad age';
    };

    component = new Component({
      type: Age,
      options: {hasError: true},
      ctx: ctx
    });

    tape.strictEqual(component.getError(), 'bad age', '#10');

    component = new Component({
      type: t.maybe(Age),
      options: {hasError: true},
      ctx: ctx
    });

    tape.strictEqual(component.getError(), undefined, '#11');

    component = new Component({
      type: t.maybe(Age),
      options: {hasError: true},
      ctx: ctx,
      value: 'a'
    });

    tape.strictEqual(component.getError(), 'bad age', '#12');

    t.Number.getValidationErrorMessage = function () {
      return 'bad number';
    };

    component = new Component({
      type: Age,
      options: {hasError: true},
      ctx: ctx,
      value: 'a'
    });

    tape.strictEqual(component.getError(), 'bad number', '#13');

    component = new Component({
      type: Age,
      options: {hasError: true},
      ctx: ctx,
      value: 1
    });

    tape.strictEqual(component.getError(), 'bad age', '#14');

    component = new Component({
      type: t.maybe(Age),
      options: {hasError: true},
      ctx: ctx
    });

    tape.strictEqual(component.getError(), undefined, '#15');

    delete t.Number.getValidationErrorMessage;

  });

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
      innerType: t.Str,
      getValidationErrorMessage: undefined
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
      innerType: t.Str,
      getValidationErrorMessage: undefined
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
      innerType: t.Str,
      getValidationErrorMessage: undefined
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

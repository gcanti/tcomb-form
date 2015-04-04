'use strict';

var test = require('tape');
var numberTransformer = require('../../lib/util/numberTransformer');
var format = numberTransformer.format;
var parse = numberTransformer.parse;

test('numberTransformer', function (tape) {

  tape.test('format', function (tape) {
    tape.plan(10);
    tape.strictEqual(format(0), '0');
    tape.strictEqual(format('0.0'), '0.0');
    tape.strictEqual(format(0.1), '0.1');
    tape.strictEqual(format(-0.1), '-0.1');
    tape.strictEqual(format(1), '1');
    tape.strictEqual(format('1.0'), '1.0');
    tape.strictEqual(format(1000), '1000');
    tape.strictEqual(format(1000.), '1000');
    tape.strictEqual(format(1000.0), '1000');
    tape.strictEqual(format(1000.1), '1000.1');
  });

  tape.test('parse', function (tape) {
    tape.plan(6);
    tape.strictEqual(parse(''), '');
    tape.strictEqual(parse('a'), 'a');
    tape.strictEqual(parse('0'), 0);
    tape.strictEqual(parse('0.1'), 0.1);
    tape.strictEqual(parse('-0.1'), -0.1);
    tape.strictEqual(parse('0'), 0);
  });

});
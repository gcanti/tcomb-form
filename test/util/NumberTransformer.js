'use strict';

var test = require('tape');
var NumberTransformer = require('../../lib/config').transformers.Num;
var format = NumberTransformer.format;
var parse = NumberTransformer.parse;

test('NumberTransformer', function (tape) {

  tape.test('format', function (tape) {
    tape.plan(9);
    tape.strictEqual(format(0), '0');
    tape.strictEqual(format('0.0'), '0.0');
    tape.strictEqual(format(0.1), '0.1');
    tape.strictEqual(format(1), '1');
    tape.strictEqual(format('1.0'), '1.0');
    tape.strictEqual(format(1000), '1000');
    tape.strictEqual(format(1000.), '1000');
    tape.strictEqual(format(1000.0), '1000');
    tape.strictEqual(format(1000.1), '1000.1');
  });

  tape.test('parse', function (tape) {
    tape.plan(5);
    tape.strictEqual(parse(''), '');
    tape.strictEqual(parse('a'), 'a');
    tape.strictEqual(parse('0'), 0);
    tape.strictEqual(parse('0.1'), 0.1);
    tape.strictEqual(parse('0.'), '0.');
  });

  tape.test('interaction', function (tape) {
    tape.plan(1);
    tape.strictEqual(format(parse('1.')), '1.');
  });

});
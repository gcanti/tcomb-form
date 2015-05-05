'use strict';

var tape = require('tape');
var bootstrap = require('../../lib/templates/bootstrap');

tape('textbox', function (tape) {

  var textbox = bootstrap.textbox;

  tape.test('static', function (tape) {
    tape.plan(1);

    tape.deepEqual(
      textbox({type: 'static', attrs: {}, path: []}).children[1].attrs.className,
      { 'form-control-static': true },
      'should handle static type');
  });

  tape.test('depth', function (tape) {
    tape.plan(1);

    tape.deepEqual(
      textbox({type: 'static', attrs: {}, path: []}).attrs.className,
      {'form-group': true, 'form-group-depth-0': true, 'has-error': undefined},
      'should handle form depth');
  });

});

tape('date', function (tape) {

  var date = bootstrap.date;

  tape.test('base execution', function (tape) {
    tape.plan(1);

    tape.deepEqual(
      typeof date({value: [], order: ['M', 'D', 'YY'], path: []}),
      'object',
      'should execute');
  });

});

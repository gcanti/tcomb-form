'use strict';

var tape = require('tape');
var bootstrap = require('../../src/templates/bootstrap');

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

  tape.test('should handle help option', function (tape) {
    tape.plan(1);

    tape.deepEqual(
      date({value: [1973, 10, 30], order: ['M', 'D', 'YY'], path: [], help: 'my help', attrs: {id: 'myId'}}).children[3].tag,
      'span');
  });

});

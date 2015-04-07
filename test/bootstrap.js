'use strict';

var tape = require('tape');
var bootstrap = require('../lib/templates/bootstrap');

tape('textbox', function (tape) {

  var textbox = bootstrap.textbox;

  tape.test('static', function (tape) {
    tape.plan(1);

    tape.deepEqual(
      textbox({type: 'static', attrs: {}}).children[1].attrs.className,
      { 'form-control-static': true },
      'should handle static type');
  });

});
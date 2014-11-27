'use strict';

var t = require('../index');
var test = require('tape');

test('humanize', function (tape) {
  tape.plan(3);
  var humanize = require('../src/humanize');
  tape.deepEqual('Username', humanize('username'));
  tape.deepEqual('Remember me', humanize('rememberMe'));
  tape.deepEqual('Remember me', humanize('remember_me'));
});


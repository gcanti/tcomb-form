'use strict';

require('node-jsx').install();
var t = require('../index');

var Str = t.Str;
var maybe = t.maybe;
var subtype = t.subtype;
var list = t.list;

var test = require('tape');

test('humanize', function (tape) {
  tape.plan(3);
  var humanize = require('../lib/util/humanize');
  tape.deepEqual('Username', humanize('username'));
  tape.deepEqual('Remember me', humanize('rememberMe'));
  tape.deepEqual('Remember me', humanize('remember_me'));
});

test('getReport', function (tape) {
  tape.plan(15);
  var getReport = require('../lib/util/getReport');

  var predicate = function (x) { return true; };
  tape.deepEqual(null, getReport(Str));
  tape.deepEqual(null, getReport(maybe(Str)));
  tape.deepEqual(null, getReport(subtype(maybe(Str), predicate)));
  tape.deepEqual(null, getReport(maybe(subtype(Str, predicate))));
  tape.deepEqual(null, getReport(list(Str)));
  tape.deepEqual(null, getReport(list(maybe(Str))));
  tape.deepEqual(null, getReport(list(maybe(Str))));
  tape.deepEqual(null, getReport(list(subtype(maybe(Str), predicate))));
  tape.deepEqual(null, getReport(list(maybe(subtype(Str, predicate)))));
  tape.deepEqual(null, getReport(list(list(Str))));
  tape.deepEqual(null, getReport(list(maybe(list(Str)))));
  tape.deepEqual(null, getReport(list(subtype(list(Str), predicate))));
  tape.deepEqual(null, getReport(list(subtype(maybe(list(Str)), predicate))));
  tape.deepEqual(null, getReport(list(maybe(subtype(list(Str), predicate)))));
  tape.deepEqual(null, getReport(maybe(list(Str))));

});

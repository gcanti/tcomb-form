var test = require('tape');

test('humanize', function (tape) {
  tape.plan(3);

  var humanize = require('../lib/util/humanize');

  tape.deepEqual(humanize('username'), 'Username');
  tape.deepEqual(humanize('rememberMe'), 'Remember me');
  tape.deepEqual(humanize('remember_me'), 'Remember me');
});


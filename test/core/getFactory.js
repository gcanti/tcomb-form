'use strict';

var test = require('tape');
var t = require('../../.');
var factories = require('../../lib/factories');
var getFactory = factories.getFactory;

function predicate() {
  return true;
}

var Country = t.enums({
  IT: 'Italy',
  US: 'United States',
  FR: 'France'
}, 'Country');

var Person = t.struct({
  name: t.Str
});

test('getFactory()', function (tape) {
  tape.plan(22);

  // textbox
  tape.strictEqual(getFactory(t.Str), factories.textbox);
  tape.strictEqual(getFactory(t.maybe(t.Str)), factories.textbox);
  tape.strictEqual(getFactory(t.subtype(t.Str, predicate)), factories.textbox);
  tape.strictEqual(getFactory(t.maybe(t.subtype(t.Str, predicate))), factories.textbox);
  tape.strictEqual(getFactory(t.subtype(t.maybe(t.Str), predicate)), factories.textbox);

  tape.strictEqual(getFactory(t.Num), factories.textbox);
  tape.strictEqual(getFactory(t.maybe(t.Num)), factories.textbox);
  tape.strictEqual(getFactory(t.subtype(t.Num, predicate)), factories.textbox);
  tape.strictEqual(getFactory(t.maybe(t.subtype(t.Num, predicate))), factories.textbox);
  tape.strictEqual(getFactory(t.subtype(t.maybe(t.Num), predicate)), factories.textbox);

  // fallback
  tape.strictEqual(getFactory(t.Any), factories.textbox);

  // checkbox
  tape.strictEqual(getFactory(t.Bool), factories.checkbox);
  tape.strictEqual(getFactory(t.subtype(t.Bool, predicate)), factories.checkbox);

  // select
  tape.strictEqual(getFactory(Country), factories.select);
  tape.strictEqual(getFactory(t.maybe(Country)), factories.select);
  tape.strictEqual(getFactory(t.subtype(Country, predicate)), factories.select);
  tape.strictEqual(getFactory(t.maybe(t.subtype(Country, predicate))), factories.select);
  tape.strictEqual(getFactory(t.subtype(t.maybe(Country), predicate)), factories.select);

  // struct
  tape.strictEqual(getFactory(Person), factories.struct);
  tape.strictEqual(getFactory(t.subtype(Person, predicate)), factories.struct);

  // list
  tape.strictEqual(getFactory(t.list(t.Str)), factories.list);
  tape.strictEqual(getFactory(t.subtype(t.list(t.Str), predicate)), factories.list);

});

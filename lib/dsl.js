'use strict';

var t = require('tcomb-validation');

var Renderable = t.Any;

var Verbatim = t.struct({
  verbatim: Renderable
}, 'Verbatim');

var Path = t.union([t.Str, t.Num]);

var Kind = t.enums.of('struct list irriducible maybe subtype enums');

var Meta = t.struct({
  path: t.list(Path),
  outerType: t.Type,
  outerKind: Kind,
  innerType: t.Type,
  innerKind: Kind,
  ref: t.maybe(t.Str)
});

var InputMixin = {
  name: t.maybe(t.Str),
  label: t.Any,
  help: t.Any,
  message: t.maybe(t.union([t.Str, t.Func])),
  hasError: t.maybe(t.Bool)
};

var TypeAttribute = t.enums.of('hidden text textarea password color date datetime datetime-local email month number range search tel time url week', 'TypeAttribute');

var Textbox = Meta.extend([InputMixin, {
  value: t.Any,
  type: t.maybe(TypeAttribute),
  placeholder: t.maybe(t.Str)
}], 'Textbox');

var Checkbox = Meta.extend([InputMixin, {
  value: t.maybe(t.Bool)
}], 'Checkbox');

var Option = t.struct({
  value: t.Str,
  text: t.Str
}, 'Option');

function asc(a, b) {
  return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
}

var Order = t.enums({
  asc: asc,
  desc: function desc(a, b) {
    return -asc(a, b);
  }
}, 'Order');

var Select = Meta.extend([InputMixin, {
  value: t.Any,
  options: t.list(Option),
  order: t.maybe(Order),
  emptyOption: t.maybe(Option)
}], 'Select');

var Radio = Meta.extend([InputMixin, {
  value: t.Any,
  options: t.list(Option),
  order: t.maybe(Order)
}], 'Radio');

var Struct = Meta.extend({
  label: t.Any,
  rows: t.list(t.Any)
}, 'Struct');

var Button = t.struct({
  caption: t.Str
});

var ListRow = t.struct({
  item: t.Any,
  remove: t.maybe(Button),
  up: t.maybe(Button),
  down: t.maybe(Button)
}, 'ListRow');

var List = Meta.extend({
  label: t.Any,
  value: t.Any,
  rows: t.list(ListRow),
  add: t.maybe(Button)
}, 'list');

module.exports = {
  Verbatim: Verbatim,
  Textbox: Textbox,
  Checkbox: Checkbox,
  Option: Option,
  Order: Order,
  Select: Select,
  Radio: Radio,
  Struct: Struct,
  Button: Button,
  ListRow: ListRow,
  List: List
};
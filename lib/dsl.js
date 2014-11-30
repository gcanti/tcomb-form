'use strict';

var t = require('tcomb-validation');

var Path = t.union([t.Str, t.Num]);
var TextboxType = t.enums.of('hidden text textarea password color date datetime datetime-local email month number range search tel time url week', 'TypeAttr');

var Verbatim = t.struct({
  verbatim: t.Any
}, 'Verbatim');

var Base = t.struct({
  _path: t.list(Path),
  _type: t.Type,
  _innerType: t.maybe(t.Type),
  _ref: t.maybe(t.Str)
});

var InputMixin = {
  name: t.maybe(t.Str),
  label: t.Any,
  help: t.Any,
  message: t.maybe(t.union([t.Str, t.Func])),
  hasError: t.maybe(t.Bool)
};

var Textbox = Base.extend([InputMixin, {
  value: t.Any,
  type: t.maybe(TextboxType),
  placeholder: t.maybe(t.Str)
}], 'Textbox');

var Checkbox = Base.extend([InputMixin, {
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

var Select = Base.extend([InputMixin, {
  value: t.Any,
  options: t.list(Option),
  order: t.maybe(Order),
  emptyOption: t.maybe(Option)
}], 'Select');

var Radio = Base.extend([InputMixin, {
  value: t.Any,
  options: t.list(Option),
  order: t.maybe(Order)
}], 'Radio');

var Struct = Base.extend({
  label: t.Any,
  fields: t.list(t.Any)
}, 'Struct');

var ListRow = t.struct({
  dsl: t.Any
}, 'ListRow');

var List = Base.extend({
  label: t.Any,
  rows: t.list(ListRow)
}, 'list');

var Button = t.struct({
  caption: t.Str,
  click: t.maybe(t.Func)
});

module.exports = {
  Verbatim: Verbatim,
  Textbox: Textbox,
  Checkbox: Checkbox,
  Option: Option,
  Order: Order,
  Select: Select,
  Radio: Radio,
  Struct: Struct,
  ListRow: ListRow,
  List: List,
  Button: Button
};
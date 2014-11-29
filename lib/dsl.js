'use strict';

var t = require('tcomb-validation');

var TextboxType = t.enums.of('hidden text textarea password color date datetime datetime-local email month number range search tel time url week', 'TypeAttr');

var Verbatim = t.struct({
  verbatim: t.Any
}, 'Verbatim');

var Base = t.struct({
  _path: t.list(t.Str),
  _type: t.Type,
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
  placeholder: t.Any
}], 'Textbox');

var Checkbox = Base.extend([InputMixin, {
  value: t.maybe(t.Bool)
}], 'Checkbox');

var Option = t.struct({
  value: t.Str,
  text: t.Str
}, 'Option');

var Order = t.enums({
  asc: function (a, b) {
    return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
  },
  desc: function (a, b) {
    return a.text < b.text ? 1 : a.text > b.text ? -1 : 0;
  }
}, 'Order');

var Select = Base.extend([InputMixin, {
  value: t.Any,
  options: t.list(Option),
  order: t.maybe(Order),
  emptyOption: t.maybe(Option)
}], 'Select');

var Fieldset = Base.extend({
  label: t.Any,
  fields: t.list(t.Any)
}, 'Fieldset');

module.exports = {
  Verbatim: Verbatim,
  Textbox: Textbox,
  Checkbox: Checkbox,
  Option: Option,
  Order: Order,
  Select: Select,
  Fieldset: Fieldset
};
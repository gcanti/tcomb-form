'use strict';

var t = require('tcomb-validation');

var Any = t.Any;
var Str = t.Str;
var Bool = t.Bool;
var Func = t.Func;
var Obj = t.Obj;
var maybe = t.maybe;
var list = t.list;
var struct = t.struct;
var union = t.union;
var Type = t.Type;

var Auto = t.enums.of('placeholders labels none', 'Auto');

// internationalization (labels)
var Bundle = struct({
  optional: Str,  // suffix added to optional fields
  add: Str,       // add button for lists
  remove: Str,    // remove button for lists
  up: Str,        // move up button for lists
  down: Str       // move down button for lists
}, 'Bundle');

// localization
var Transformer = struct({
  format: Func,
  parse: Func
}, 'Transformer');

var Context = struct({
  path: list(union([Str, t.Num])),
  auto: Auto,
  defaultLabel: Str,
  bundle: Bundle,
  value: Any
});

var Message = union([Str, Func], 'Message');

var TypeAttr = t.enums.of('hidden text textarea password color date datetime datetime-local email month number range search tel time url week', 'TypeAttr');

var Textbox = struct({
  label: maybe(Str),
  help: maybe(Str),
  hasError: maybe(Bool),
  message: maybe(Message),
  type: maybe(TypeAttr),
  name: maybe(t.Str),
  placeholder: maybe(Str),
  value: Any,
  readOnly: maybe(Bool),
  disabled: maybe(Bool),
  transformer: maybe(Transformer)
}, 'Textbox');

var Checkbox = struct({
  label: maybe(Str),
  help: maybe(Str),
  hasError: maybe(Bool),
  message: maybe(Message),
  name: maybe(t.Str),
  value: maybe(Bool),
  disabled: maybe(Bool)
}, 'Checkbox');

function asc(a, b) {
  return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
}

var Order = t.enums({
  asc: asc,
  desc: function desc(a, b) {
    return -asc(a, b);
  }
}, 'Order');

var Option = t.struct({
  value: Str,
  text: Str
}, 'Option');

var OptGroup = t.struct({
  group: Str,
  options: list(Option)
}, 'OptGroup');

var SelectOption = union([Option, OptGroup], 'SelectOption');

SelectOption.dispatch = function (x) {
  if (x.hasOwnProperty('group')) { return OptGroup; }
  return Option;
};

var Select = struct({
  label: maybe(Str),
  help: maybe(Str),
  hasError: maybe(Bool),
  message: maybe(Message),
  name: maybe(t.Str),
  value: maybe(Str),
  order: maybe(Order),
  options: maybe(list(SelectOption)),
  emptyOption: maybe(Option),
  renderAs: maybe(Str),
  disabled: maybe(Bool)
}, 'Select');

var Struct = struct({
  bundle: maybe(Bundle),
  value: maybe(t.Obj),
  auto: maybe(Auto),
  label: maybe(Str),
  order: maybe(list(Str)),
  fields: maybe(Obj)
}, 'Struct');

var List = struct({
  bundle: maybe(Bundle),
  value: maybe(t.Arr),
  auto: maybe(Auto),
  label: maybe(Str),
  hasError: maybe(Bool),
  message: maybe(Message),
  item: maybe(Obj),
  disableAdd: maybe(Bool),
  disableRemove: maybe(Bool),
  disableOrder: maybe(Bool)
}, 'List');

module.exports = {
  Bundle: Bundle,
  Context: Context,
  Transformer: Transformer,
  Textbox: Textbox,
  Checkbox: Checkbox,
  Select: Select,
  Struct: Struct,
  List: List
};
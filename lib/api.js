'use strict';

//
// api interface
//

var t = require('tcomb-validation');
var dsl = require('./dsl');

var Any = t.Any;
var Bool = t.Bool;
var Str = t.Str;
var Obj = t.Obj;
var maybe = t.maybe;
var list = t.list;
var struct = t.struct;
var union = t.union;

var Message = dsl.Message;
var Option = dsl.Option;
var SelectOption = dsl.SelectOption;
var Transformer = dsl.Transformer;

var Auto = t.enums.of('placeholders labels none');

// internationalization (labels)
var Bundle = struct({
  optional: Str,  // suffix added to optional fields
  add: Str,       // add button for lists
  remove: Str,    // remove button for lists
  up: Str,        // move up button for lists
  down: Str       // move down button for lists
}, 'Bundle');

var Context = struct({
  bundle: Bundle,
  auto: Auto,
  path: list(union([Str, t.Num])),
  label: maybe(t.Str),
  key: Str
});

var Textbox = struct({
  label: maybe(Str),
  help: maybe(Str),
  hasError: maybe(Bool),
  message: maybe(Message),
  type: maybe(dsl.TypeAttr),
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

var Select = struct({
  label: maybe(Str),
  help: maybe(Str),
  hasError: maybe(Bool),
  message: maybe(Message),
  name: maybe(t.Str),
  value: maybe(Str),
  order: maybe(Order),
  options: maybe(list(SelectOption)),
  renderAs: maybe(Str),
  disabled: maybe(Bool)
}, 'Select');

var Struct = struct({
  bundle: maybe(Bundle),
  value: maybe(t.Obj),
  auto: maybe(Auto),
  label: maybe(Str),
  hasError: maybe(Bool),
  message: maybe(Message),
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
  noItems: maybe(Str),
  disableAdd: maybe(Bool),
  disableRemove: maybe(Bool),
  disableOrder: maybe(Bool)
}, 'List');

module.exports = {
  Transformer: Transformer,
  Context: Context,
  Bundle: Bundle,
  Auto: Auto,
  Textbox: Textbox,
  Checkbox: Checkbox,
  Order: Order,
  Select: Select,
  Struct: Struct,
  List: List
};

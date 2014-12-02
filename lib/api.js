'use strict';

//===============
// api interface
//===============

var t = require('tcomb-validation');
var dsl = require('./dsl');

var Any = t.Any;
var Bool = t.Bool;
var Str = t.Str;
var maybe = t.maybe;
var list = t.list;
var struct = t.struct;

var Message = dsl.Message;
var Option = dsl.Option;

// internationalization
var Bundle = struct({
  optionalLabel: Str,
  addLabel: Str,
  removeLabel: Str,
  upLabel: Str,
  downLabel: Str
}, 'Bundle');

var Textbox = struct({
  label: maybe(Str),
  help: maybe(Str),
  message: maybe(Message),
  hasError: maybe(Bool),
  type: maybe(dsl.TypeAttr),
  name: maybe(t.Str),
  placeholder: maybe(Str),
  value: Any,
  readOnly: maybe(Bool),
  disabled: maybe(Bool)
}, 'Textbox');

var Checkbox = struct({
  label: maybe(Str),
  help: maybe(Str),
  message: maybe(Message),
  hasError: maybe(Bool),
  name: maybe(t.Str),
  value: maybe(Bool)
}, 'Checkbox');

var RenderSelectAs = t.enums.of('select radio', 'RenderSelectAs');

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
  message: maybe(Message),
  hasError: maybe(Bool),
  name: maybe(t.Str),
  value: maybe(Str),
  order: maybe(Order),
  options: maybe(list(Option)),
  renderAs: maybe(RenderSelectAs),
  disabled: maybe(Bool)
}, 'Select');

var Auto = t.enums.of('labels none');

var Struct = struct({
  bundle: maybe(Bundle),
  value: maybe(t.Obj),
  auto: maybe(Auto),
  label: maybe(Str),
  message: maybe(Message),
  hasError: maybe(t.Bool),
  order: maybe(list(Str)),
  fields: Any
});

var List = struct({
  bundle: maybe(Bundle),
  value: maybe(t.Arr),
  auto: maybe(Auto),
  label: maybe(Str),
  message: maybe(Message),
  hasError: maybe(t.Bool),
  item: Any,
  noItems: maybe(Str),
  disableAdd: maybe(Bool),
  disableRemove: maybe(Bool),
  disableOrder: maybe(Bool)
});

module.exports = {
  Bundle: Bundle,
  Textbox: Textbox,
  Checkbox: Checkbox,
  Order: Order,
  Select: Select,
  Struct: Struct,
  List: List
};

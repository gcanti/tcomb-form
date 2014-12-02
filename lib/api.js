'use strict';

var t = require('tcomb-validation');
var dsl = require('./dsl');

var Bool = t.Bool;
var Str = t.Str;
var Any = t.Any;
var maybe = t.maybe;
var list = t.list;
var struct = t.struct;
var union = t.union;

var Message = dsl.Message;
var Option = dsl.Option;

var Textbox = struct({
  label: maybe(Str),
  help: maybe(Str),
  message: maybe(Message),
  hasError: maybe(Bool),
  type: maybe(dsl.TextboxType),
  name: maybe(t.Str),
  placeholder: maybe(Str),
  value: Any
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
  renderAs: maybe(RenderSelectAs)
}, 'Select');

var Auto = t.enums.of('labels none');

var Struct = struct({
  value: maybe(t.Obj),
  auto: maybe(Auto),
  label: maybe(Str),
  message: maybe(Message),
  hasError: maybe(t.Bool),
  order: maybe(list(Str)),
  fields: Any
});

var List = struct({
  value: maybe(t.Arr),
  auto: maybe(Auto),
  label: maybe(Str),
  message: maybe(Message),
  hasError: maybe(t.Bool),
  item: Any
});

module.exports = {
  Textbox: Textbox,
  Checkbox: Checkbox,
  Order: Order,
  Select: Select,
  Struct: Struct,
  List: List
};

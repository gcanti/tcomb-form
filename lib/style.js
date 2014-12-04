'use strict';

var t = require('tcomb-validation');
var Any = t.Any;
var Str = t.Str;
var Bool = t.Bool;
var Func = t.Func;
var maybe = t.maybe;
var list = t.list;
var struct = t.struct;

var Message = t.union([Str, Func], 'Message');

var Option = t.struct({
  value: Str,
  text: Str
}, 'Option');

var OptGroup = t.struct({
  group: Str,
  options: list(Option)
}, 'OptGroup');

var SelectOption = t.union([Option, OptGroup], 'SelectOption');

SelectOption.dispatch = function (x) {
  if (x.hasOwnProperty('group')) { return OptGroup; }
  return Option;
};

var TypeAttr = t.enums.of('hidden text textarea password color date datetime datetime-local email month number range search tel time url week', 'TypeAttr');

var Textbox = struct({
  ref: Str,
  type: TypeAttr,
  name: Str,
  placeholder: maybe(Str),
  label: maybe(Str),
  help: maybe(Str),
  readOnly: maybe(Bool),
  disabled: maybe(Bool),
  value: Any,
  hasError: maybe(Bool),
  message: maybe(Message)
}, 'Textbox');

var Checkbox = struct({
  ref: Str,
  name: Str,
  label: Str,
  help: maybe(Str),
  disabled: maybe(Bool),
  value: Bool,
  hasError: maybe(Bool),
  message: maybe(Message)
}, 'Checkbox');

var Select = struct({
  ref: Str,
  name: Str,
  label: maybe(Str),
  help: maybe(Str),
  options: list(SelectOption),
  disabled: maybe(Bool),
  value: maybe(Str),
  hasError: maybe(Bool),
  message: maybe(Message)
}, 'Select');

var Radio = struct({
  ref: Str,
  name: Str,
  label: maybe(Str),
  help: maybe(Str),
  options: list(Option),
  value: maybe(Str),
  hasError: maybe(Bool),
  message: maybe(Message)
}, 'Radio');

var Struct = struct({
  label: maybe(Str),
  rows: list(t.Any), // FIXME
  hasError: maybe(Bool),
  message: maybe(Message)
}, 'Struct');

var Button = struct({
  label: Str,
  click: Func
}, 'Button');

var List = struct({
  label: maybe(Str),
  add: maybe(t.Obj),
  rows: list(t.Any), // FIXME,
  hasError: maybe(Bool),
  message: maybe(Message)
});

module.exports = {
  Textbox: Textbox,
  Checkbox: Checkbox,
  Option: Option,
  OptGroup: OptGroup,
  Select: Select,
  Radio: Radio,
  Struct: Struct,
  List: List
};
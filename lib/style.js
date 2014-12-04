'use strict';

var t = require('tcomb-validation');
var Str = t.Str;
var Bool = t.Bool;
var maybe = t.maybe;
var list = t.list;
var struct = t.struct;

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
  readOnly: Bool,
  disabled: Bool
}, 'Textbox');

var Checkbox = struct({
  ref: Str,
  name: Str,
  value: Bool,
  label: maybe(Str),
  help: maybe(Str),
  disabled: Bool
}, 'Checkbox');

var Select = struct({
  ref: Str,
  name: Str,
  value: maybe(Str),
  label: maybe(Str),
  help: maybe(Str),
  options: list(SelectOption),
  disabled: Bool
}, 'Select');

var Radio = struct({
  ref: Str,
  name: Str,
  value: maybe(Str),
  label: maybe(Str),
  help: maybe(Str),
  options: list(Option)
}, 'Radio');

var Struct = struct({
  label: maybe(Str),
  rows: list(t.Obj)
}, 'Struct');

var Button = struct({
  label: Str,
  click: t.Func
}, 'Button');

var List = struct({
  label: maybe(Str)
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
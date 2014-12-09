'use strict';

var React = require('react');
var t = require('tcomb-validation');
var Any = t.Any;
var Str = t.Str;
var Bool = t.Bool;
var Func = t.Func;
var maybe = t.maybe;
var list = t.list;
var struct = t.struct;
var union = t.union;

var ReactElement = t.irriducible('ReactElement', React.isValidElement);

var Label = union([Str, ReactElement], 'Label');

var Option = struct({
  value: Str,
  text: Str
}, 'Option');

var OptGroup = struct({
  group: Str,
  options: list(Option)
}, 'OptGroup');

var SelectOption = union([Option, OptGroup], 'SelectOption');

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
  label: maybe(Label),
  help: maybe(Label),
  readOnly: maybe(Bool),
  disabled: maybe(Bool),
  value: Any,
  hasError: maybe(Bool),
  message: maybe(Label),
  addonBefore: maybe(Label),
  addonAfter: maybe(Label)
}, 'Textbox');

var Checkbox = struct({
  ref: Str,
  name: Str,
  label: Label, // checkboxes must always have a label
  help: maybe(Label),
  disabled: maybe(Bool),
  value: Bool,
  hasError: maybe(Bool),
  message: maybe(Label)
}, 'Checkbox');

var Select = struct({
  ref: Str,
  name: Str,
  label: maybe(Label),
  help: maybe(Label),
  options: list(SelectOption),
  disabled: maybe(Bool),
  multiple: maybe(Bool),
  value: maybe(union([Str, list(Str)])), // handle multiple
  hasError: maybe(Bool),
  message: maybe(Label)
}, 'Select');

var Radio = struct({
  ref: Str,
  name: Str,
  label: maybe(Label),
  help: maybe(Label),
  options: list(Option),
  value: maybe(Str),
  hasError: maybe(Bool),
  message: maybe(Label)
}, 'Radio');

var Struct = struct({
  label: maybe(Label),
  help: maybe(Label),
  order: list(Label),
  inputs: t.dict(Str, ReactElement),
  hasError: maybe(Bool),
  message: maybe(Label)
}, 'Struct');

var Button = struct({
  label: Str,
  click: Func
}, 'Button');

var ListItem = struct({
  input: ReactElement,
  key: Str,
  buttons: list(Button)
});

var List = struct({
  label: maybe(Label),
  help: maybe(Label),
  add: maybe(Button),
  items: list(ListItem),
  hasError: maybe(Bool),
  message: maybe(Label)
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
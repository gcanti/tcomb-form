'use strict';

var React = require('react');
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

var ReactElement = t.irriducible('ReactElement', React.isValidElement);

var Label = union([Str, ReactElement], 'Label');

var Option = t.struct({
  disabled: maybe(Bool),
  text: Str,
  value: Str
}, 'Option');

var OptGroup = t.struct({
  disabled: maybe(Bool),
  label: Str,
  options: list(Option)
}, 'OptGroup');

var SelectOption = union([Option, OptGroup], 'SelectOption');

SelectOption.dispatch = function (x) {
  if (x.hasOwnProperty('label')) { return OptGroup; }
  return Option;
};

var TypeAttr = t.enums.of('textarea hidden text password color date datetime datetime-local email month number range search tel time url week', 'TypeAttr');

var Textbox = struct({
  config: maybe(Obj),
  disabled: maybe(Bool),
  error: maybe(Label),
  hasError: maybe(Bool),
  help: maybe(Label),
  label: maybe(Label),
  name: Str,
  onChange: Func,
  placeholder: maybe(Str),
  type: TypeAttr,
  value: Any
}, 'Textbox');

var Checkbox = struct({
  config: maybe(Obj),
  disabled: maybe(Bool),
  error: maybe(Label),
  hasError: maybe(Bool),
  help: maybe(Label),
  label: Label, // checkboxes must always have a label
  name: Str,
  onChange: Func,
  value: Bool
}, 'Checkbox');

var Select = struct({
  config: maybe(Obj),
  error: maybe(Label),
  disabled: maybe(Bool),
  hasError: maybe(Bool),
  help: maybe(Label),
  label: maybe(Label),
  multiple: maybe(Bool),
  name: Str,
  onChange: Func,
  options: list(SelectOption),
  value: maybe(union([Str, list(Str)])) // handle multiple
}, 'Select');

var Radio = struct({
  config: maybe(Obj),
  disabled: maybe(Bool),
  error: maybe(Label),
  hasError: maybe(Bool),
  help: maybe(Label),
  label: maybe(Label),
  name: Str,
  onChange: Func,
  options: list(Option),
  value: maybe(Str)
}, 'Radio');

var Struct = struct({
  config: maybe(Obj),
  disabled: maybe(Bool),
  error: maybe(Label),
  help: maybe(Label),
  hasError: maybe(Bool),
  inputs: t.dict(Str, ReactElement),
  label: maybe(Label),
  order: list(Label),
  value: Any
}, 'Struct');

var Button = struct({
  click: Func,
  label: Str
}, 'Button');

var ListItem = struct({
  buttons: list(Button),
  input: ReactElement,
  key: Str
}, 'ListItem');

var List = struct({
  add: maybe(Button),
  config: maybe(Obj),
  disabled: maybe(Bool),
  error: maybe(Label),
  hasError: maybe(Bool),
  help: maybe(Label),
  items: list(ListItem),
  label: maybe(Label),
  value: Any
}, 'List');

module.exports = {
  Label: Label,
  Textbox: Textbox,
  Checkbox: Checkbox,
  Option: Option,
  OptGroup: OptGroup,
  Select: Select,
  Radio: Radio,
  Struct: Struct,
  List: List
};
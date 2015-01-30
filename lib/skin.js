'use strict';

var React = require('react');
var t = require('tcomb-validation');
var Str = t.Str;
var Bool = t.Bool;
var Func = t.Func;
var Obj = t.Obj;
var maybe = t.maybe;
var list = t.list;
var struct = t.struct;
var union = t.union;

var ReactElement = t.irreducible('ReactElement', React.isValidElement);

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
  autoFocus: maybe(Bool),
  config: maybe(Obj),
  disabled: maybe(Bool),    // should be disabled
  error: maybe(Label),      // should show an error
  hasError: maybe(Bool),    // if true should show an error state
  help: maybe(Label),       // should show an help message
  id: Str,                  // should use this as id attribute and as htmlFor label attribute
  label: maybe(Label),      // should show a label
  name: Str,                // should use this as name attribute
  onChange: Func,           // should call this function with the changed value
  placeholder: maybe(Str),  // should show a placeholder
  type: TypeAttr,           // should use this as type attribute
  value: t.Any              // should use this as value attribute
}, 'Textbox');

var Checkbox = struct({
  autoFocus: maybe(Bool),
  config: maybe(Obj),
  disabled: maybe(Bool),
  error: maybe(Label),
  hasError: maybe(Bool),
  help: maybe(Label),
  id: Str,                  // should use this as id attribute and as htmlFor label attribute
  label: Label,             // checkboxes must always have a label
  name: Str,
  onChange: Func,
  value: Bool
}, 'Checkbox');

// handle multiple attribute
var SelectValue = union([Str, list(Str)], 'SelectValue');

var Select = struct({
  autoFocus: maybe(Bool),
  config: maybe(Obj),
  error: maybe(Label),
  disabled: maybe(Bool),
  hasError: maybe(Bool),
  help: maybe(Label),
  id: Str,                  // should use this as id attribute and as htmlFor label attribute
  label: maybe(Label),
  multiple: maybe(Bool),
  name: Str,
  onChange: Func,
  options: list(SelectOption),
  value: maybe(SelectValue)
}, 'Select');

var Radio = struct({
  autoFocus: maybe(Bool),
  config: maybe(Obj),
  disabled: maybe(Bool),
  error: maybe(Label),
  hasError: maybe(Bool),
  help: maybe(Label),
  id: Str,
  label: maybe(Label),
  name: Str,
  onChange: Func,
  options: list(Option),
  value: maybe(Str)
}, 'Radio');

var StructValue = t.dict(Str, t.Any, 'StructValue');

var Struct = struct({
  config: maybe(Obj),
  disabled: maybe(Bool),
  error: maybe(Label),
  help: maybe(Label),
  hasError: maybe(Bool),
  inputs: t.dict(Str, ReactElement),
  legend: maybe(Label),
  order: list(Label),
  value: maybe(StructValue)
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
  legend: maybe(Label),
  value: maybe(list(t.Any))
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
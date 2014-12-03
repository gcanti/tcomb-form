'use strict';

//
// style plugin interface
//

var t = require('tcomb-validation');
var dsl = require('./dsl');

var Option = dsl.Option;
var OptGroup = dsl.OptGroup;
var SelectOption = dsl.SelectOption;

var Str = t.Str;
var Bool = t.Bool;
var Obj = t.Obj;
var maybe = t.maybe;
var list = t.list;
var struct = t.struct;

var Textbox = struct({
  ref: Str,
  type: dsl.TypeAttr,
  name: Str,
  value: maybe(Str),
  placeholder: maybe(Str),
  label: maybe(Str),
  help: maybe(Str),
  hasError: Bool,
  error: maybe(Str),
  readOnly: Bool,
  disabled: Bool
}, 'Textbox');

var Checkbox = struct({
  ref: Str,
  name: Str,
  value: Bool,
  label: maybe(Str),
  help: maybe(Str),
  hasError: Bool,
  error: maybe(Str),
  disabled: Bool
}, 'Checkbox');

var Select = struct({
  ref: Str,
  name: Str,
  value: maybe(Str),
  label: maybe(Str),
  help: maybe(Str),
  hasError: Bool,
  error: maybe(Str),
  options: list(SelectOption),
  disabled: Bool
}, 'Select');

var Radio = struct({
  ref: Str,
  name: Str,
  value: maybe(Str),
  label: maybe(Str),
  help: maybe(Str),
  hasError: Bool,
  error: maybe(Str),
  options: list(Option)
}, 'Radio');

var Fieldset = struct({
  label: maybe(Str),
  rows: list(Obj),
  hasError: Bool,
  error: maybe(Str)
}, 'Fieldset');

var Button = struct({
  label: Str,
  click: t.Func
}, 'Button');

var ListItem = struct({
  item: Obj,
  buttons: list(Button)
});

var List = struct({
  label: maybe(Str),
  rows: list(ListItem),
  add: maybe(Button),
  hasError: Bool,
  error: maybe(Str)
});

module.exports = {
  Textbox: Textbox,
  Checkbox: Checkbox,
  Option: Option,
  OptGroup: OptGroup,
  Select: Select,
  Radio: Radio,
  Fieldset: Fieldset,
  List: List
};
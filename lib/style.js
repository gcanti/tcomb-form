'use strict';

//========================
// style plugin interface
//========================

var t = require('tcomb-validation');
var dsl = require('./dsl');

var Option = dsl.Option;

var Any = t.Any;
var Str = t.Str;
var Bool = t.Bool;
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
  error: maybe(Str)
}, 'Textbox');

var Checkbox = struct({
  ref: Str,
  name: Str,
  value: Bool,
  label: maybe(Str),
  help: maybe(Str),
  error: maybe(Str)
}, 'Checkbox');

var Select = struct({
  ref: Str,
  name: Str,
  value: maybe(Str),
  label: maybe(Str),
  help: maybe(Str),
  error: maybe(Str),
  options: list(Option),
  disabled: Bool
}, 'Select');

var Radio = struct({
  ref: Str,
  name: Str,
  value: maybe(Str),
  label: maybe(Str),
  help: maybe(Str),
  error: maybe(Str),
  options: list(Option)
}, 'Radio');

var Fieldset = struct({
  label: maybe(Str),
  rows: list(Any)
}, 'Fieldset');

var Button = struct({
  label: Str,
  click: t.Func
}, 'Button');

var ListItem = struct({
  item: Any,
  buttons: list(Button)
});

var List = struct({
  label: maybe(Str),
  rows: list(ListItem),
  add: maybe(Button)
});

module.exports = {
  Textbox: Textbox,
  Checkbox: Checkbox,
  Select: Select,
  Radio: Radio,
  Fieldset: Fieldset,
  List: List
};
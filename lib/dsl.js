'use strict';

var t = require('tcomb-validation');
var Bool = t.Bool;
var Str = t.Str;
var Any = t.Any;
var maybe = t.maybe;
var list = t.list;
var struct = t.struct;
var union = t.union;
var Type = t.Type;

var Message = union([Str, t.Func], 'Message');

var TextboxType = t.enums.of('hidden text textarea password color date datetime datetime-local email month number range search tel time url week', 'TextboxType');

var Textbox = struct({
  type: Type,
  key: Str,
  label: maybe(Str),
  help: maybe(Str),
  error: maybe(Message),
  hasError: maybe(Bool),
  attrs: struct({
    type: TextboxType,
    name: maybe(Str),
    placeholder: maybe(Str),
    defaultValue: Any
  }, 'TextboxAttributes')
}, 'Textbox');

var Checkbox = struct({
  type: Type,
  key: Str,
  label: maybe(Str),
  help: maybe(Str),
  error: maybe(Message),
  hasError: maybe(Bool),
  attrs: struct({
    name: maybe(Str),
    defaultChecked: maybe(Bool)
  }, 'CheckboxAttributes')
}, 'Checkbox');

var Option = t.struct({
  value: t.Str,
  text: t.Str
}, 'Option');

var Select = struct({
  type: Type,
  key: Str,
  label: maybe(Str),
  help: maybe(Str),
  error: maybe(Message),
  hasError: maybe(Bool),
  attrs: struct({
    name: maybe(Str),
    defaultValue: maybe(Str)
  }, 'SelectAttributes'),
  options: list(Option)
}, 'Select');

var Radio = struct({
  type: Type,
  key: Str,
  label: maybe(Str),
  help: maybe(Str),
  error: maybe(Message),
  hasError: maybe(Bool),
  attrs: struct({
    name: maybe(Str),
    defaultValue: maybe(Str)
  }, 'RadioAttributes'),
  options: list(Option)
}, 'Radio');

var Struct = struct({
  type: Type,
  key: Str,
  label: maybe(Str),
  error: maybe(Message),
  hasError: maybe(Bool),
  rows: list(Any)
}, 'Struct');

var List = struct({
  type: Type,
  key: Str,
  label: maybe(Str),
  error: maybe(Message),
  hasError: maybe(Bool),
  rows: list(Any)
}, 'List');

module.exports = {
  Message: Message,
  TextboxType: TextboxType,
  Textbox: Textbox,
  Checkbox: Checkbox,
  Option: Option,
  Select: Select,
  Radio: Radio,
  Struct: Struct,
  List: List
};
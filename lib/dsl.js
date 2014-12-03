'use strict';

//
// render plugin interface
//

var t = require('tcomb-validation');

var Any = t.Any;
var Bool = t.Bool;
var Str = t.Str;
var Func = t.Func;
var maybe = t.maybe;
var list = t.list;
var struct = t.struct;
var union = t.union;
var Type = t.Type;

// localization
var Transformer = struct({
  from: maybe(Type), // if null it can be applied to all types
  format: Func,
  parse: Func
}, 'Transformer');

var Message = union([Str, Func], 'Message');

var TypeAttr = t.enums.of('hidden text textarea password color date datetime datetime-local email month number range search tel time url week', 'TypeAttr');

var Textbox = struct({
  type: Type,
  key: Str,
  label: maybe(Str),
  help: maybe(Str),
  error: maybe(Message),
  hasError: Bool,
  typeAttr: TypeAttr,
  name: Str,
  placeholder: maybe(Str),
  value: Any, // textbox can be used to handle several types: Str, Num, ...
  readOnly: Bool,
  disabled: Bool,
  transformer: maybe(Transformer) // if type is different from Str, must be formatted and parsed
}, 'Textbox');

var Checkbox = struct({
  type: Type,
  key: Str,
  label: maybe(Str),
  help: maybe(Str),
  error: maybe(Message),
  hasError: Bool,
  name: Str,
  value: Bool,
  disabled: Bool
}, 'Checkbox');

var Option = t.struct({
  value: Str,
  text: Str
}, 'Option');

var OptGroup = t.struct({
  group: Str,
  options: list(Option)
}, 'OptGroup');

var SelectOption = union([Option, OptGroup], 'SelectOption');

SelectOption.dispatch = function (x) {
  if (x.hasOwnProperty('group')) { return OptGroup; }
  return Option;
};

var Select = struct({
  type: Type,
  key: Str,
  label: maybe(Str),
  help: maybe(Str),
  error: maybe(Message),
  hasError: Bool,
  name: Str,
  value: maybe(Str),
  disabled: Bool,
  options: list(SelectOption)
}, 'Select');

var Radio = struct({
  type: Type,
  key: Str,
  label: maybe(Str),
  help: maybe(Str),
  error: maybe(Message),
  hasError: Bool,
  name: Str,
  value: maybe(Str),
  options: list(Option)
}, 'Radio');

var Struct = struct({
  type: Type,
  key: Str,
  label: maybe(Str),
  error: maybe(Message),
  hasError: Bool,
  rows: list(Any)
}, 'Struct');

var List = struct({
  type: Type,
  key: Str,
  label: maybe(Str),
  error: maybe(Message),
  hasError: Bool,
  rows: list(Any),
  getRow: maybe(Func),
  add: maybe(Str),
  remove: maybe(Str),
  up: maybe(Str),
  down: maybe(Str)
}, 'List');

List.prototype.addRow = function () {
  return List.update(this, {
    rows: {'$push': [this.getRow(null, this.rows.length)]}
  });
};

List.prototype.removeRow = function (i) {
  return List.update(this, {
    rows: {'$splice': [[i, 1]]}
  });
};

List.prototype.moveUpRow = function (i) {
  return List.update(this, {
    rows: {'$swap': {from: i, to: i - 1}}
  });
};

List.prototype.moveDownRow = function (i) {
  return List.update(this, {
    rows: {'$swap': {from: i, to: i + 1}}
  });
};

module.exports = {
  Transformer: Transformer,
  Message: Message,
  TypeAttr: TypeAttr,
  Textbox: Textbox,
  Checkbox: Checkbox,
  Option: Option,
  OptGroup: OptGroup,
  SelectOption: SelectOption,
  Select: Select,
  Radio: Radio,
  Struct: Struct,
  List: List
};
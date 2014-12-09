'use strict';

var React = require('react');
var t = require('tcomb-validation');
var getReport = require('../util/getReport');

var Any = t.Any;
var Str = t.Str;
var Bool = t.Bool;
var Func = t.Func;
var Obj = t.Obj;
var maybe = t.maybe;
var list = t.list;
var struct = t.struct;
var union = t.union;

var Auto = t.enums.of('placeholders labels none', 'Auto');

// internationalization (labels)
var I18n = struct({
  optional: Str,  // suffix added to optional fields
  add: Str,       // add button for lists
  remove: Str,    // remove button for lists
  up: Str,        // move up button for lists
  down: Str       // move down button for lists
}, 'I18n');

var Report = struct({
  type: t.Type,
  maybe: maybe(Bool),
  subtype: maybe(Bool),
  innerType: maybe(t.Type)
}, 'Report');

var Templates = t.dict(Str, Func, 'Templates');

var Context = struct({
  templates: Templates,
  i18n: I18n,
  report: Report,
  path: list(union([Str, t.Num])),
  auto: Auto,
  label: Str,
  value: Any
}, 'Context');

Context.getReport = getReport;

/*

  Proposals:

  - RFC 6901
  JavaScript Object Notation (JSON) Pointer
  http://tools.ietf.org/html/rfc6901

  - W3C HTML JSON form submission
  http://www.w3.org/TR/html-json-forms/

*/
Context.prototype.getDefaultName = function () {
  return this.path.join('/');
};

Context.prototype.getDefaultLabel = function () {
  return this.label + (this.report.maybe ? this.i18n.optional : '');
};

Context.prototype.getDefaultDisplayName = function () {
  return t.util.format('[`%s`, TcombFormInput]', (this.getDefaultName() || 'top level'));
};

var ReactElement = t.irriducible('ReactElement', React.isValidElement);

var Label = union([Str, ReactElement], 'Label');

var Message = union([Label, Func], 'Message');

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

var TypeAttr = t.enums.of('hidden text textarea password color date datetime datetime-local email month number range search tel time url week', 'TypeAttr');

var Transformer = struct({
  format: Func,
  parse: Func
}, 'Transformer');

var Textbox = struct({
  label: maybe(Label),
  help: maybe(Label),
  hasError: maybe(Bool),
  message: maybe(Message),
  type: maybe(TypeAttr),
  name: maybe(t.Str),
  placeholder: maybe(Str),
  value: Any,
  readOnly: maybe(Bool),
  disabled: maybe(Bool),
  transformer: maybe(Transformer),
  template: maybe(Func)
}, 'Textbox');

var Checkbox = struct({
  label: maybe(Label),
  help: maybe(Label),
  hasError: maybe(Bool),
  message: maybe(Message),
  name: maybe(t.Str),
  value: maybe(Bool),
  disabled: maybe(Bool),
  template: maybe(Func)
}, 'Checkbox');

function asc(a, b) {
  return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
}

var Order = t.enums({
  asc: asc,
  desc: function desc(a, b) {
    return -asc(a, b);
  }
}, 'Order');

Order.getComparator = function (order) {
  return Order.meta.map[order];
};

var Select = struct({
  label: maybe(Label),
  help: maybe(Label),
  hasError: maybe(Bool),
  message: maybe(Message),
  name: maybe(t.Str),
  value: maybe(Str),
  order: maybe(Order),
  options: maybe(list(SelectOption)),
  nullOption: maybe(Option),
  disabled: maybe(Bool),
  template: maybe(Func)
}, 'Select');

var Radio = struct({
  label: maybe(Label),
  help: maybe(Label),
  hasError: maybe(Bool),
  message: maybe(Message),
  name: maybe(t.Str),
  value: maybe(Str),
  order: maybe(Order),
  options: maybe(list(SelectOption)),
  template: maybe(Func)
}, 'Select');

var Struct = struct({
  i18n: maybe(I18n),
  value: maybe(Obj),
  auto: maybe(Auto),
  label: maybe(Label),
  help: maybe(Label),
  hasError: maybe(Bool),
  message: maybe(Message),
  order: maybe(list(Label)),
  fields: maybe(Obj),
  templates: maybe(Templates)
}, 'Struct');

var List = struct({
  i18n: maybe(I18n),
  value: maybe(t.Arr),
  auto: maybe(Auto),
  label: maybe(Label),
  help: maybe(Label),
  hasError: maybe(Bool),
  message: maybe(Message),
  item: maybe(Obj),
  disableAdd: maybe(Bool),
  disableRemove: maybe(Bool),
  disableOrder: maybe(Bool),
  templates: maybe(Templates)
}, 'List');

module.exports = {
  I18n: I18n,
  Context: Context,
  Transformer: Transformer,
  Textbox: Textbox,
  Checkbox: Checkbox,
  Select: Select,
  Radio: Radio,
  Struct: Struct,
  List: List
};
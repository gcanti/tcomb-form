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
  value: Any,
  config: maybe(Obj)
}, 'Context');

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

Context.prototype.getDisplayName = function () {
  return t.util.format('[`%s`, TcombForm]', (this.getDefaultName() || 'top'));
};

var ReactElement = t.irriducible('ReactElement', React.isValidElement);

var Label = union([Str, ReactElement], 'Label');

var ErrorMessage = union([Label, Func], 'Error');

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

var TypeAttr = t.enums.of('static hidden text textarea password color date datetime datetime-local email month number range search tel time url week', 'TypeAttr');

var Transformer = struct({
  format: Func,
  parse: Func
}, 'Transformer');

var Textbox = struct({
  config: maybe(Obj),
  disabled: maybe(Bool),
  error: maybe(ErrorMessage),
  hasError: maybe(Bool),
  help: maybe(Label),
  label: maybe(Label),
  name: maybe(t.Str),
  placeholder: maybe(Str),
  readOnly: maybe(Bool),
  template: maybe(Func),
  transformer: maybe(Transformer),
  type: maybe(TypeAttr),
  value: Any
}, 'Textbox');

var Checkbox = struct({
  config: maybe(Obj),
  disabled: maybe(Bool),
  hasError: maybe(Bool),
  help: maybe(Label),
  error: maybe(ErrorMessage),
  label: maybe(Label),
  name: maybe(t.Str),
  template: maybe(Func),
  value: maybe(Bool)
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
  config: maybe(Obj),
  disabled: maybe(Bool),
  hasError: maybe(Bool),
  help: maybe(Label),
  error: maybe(ErrorMessage),
  label: maybe(Label),
  name: maybe(t.Str),
  nullOption: maybe(Option),
  options: maybe(list(SelectOption)),
  order: maybe(Order),
  template: maybe(Func),
  value: maybe(Str)
}, 'Select');

var Radio = struct({
  config: maybe(Obj),
  disabled: maybe(Bool),
  hasError: maybe(Bool),
  help: maybe(Label),
  error: maybe(ErrorMessage),
  label: maybe(Label),
  name: maybe(t.Str),
  options: maybe(list(SelectOption)),
  order: maybe(Order),
  template: maybe(Func),
  value: maybe(Str)
}, 'Select');

var Struct = struct({
  auto: maybe(Auto),
  config: maybe(Obj),
  disabled: maybe(Bool),
  fields: maybe(Obj),
  i18n: maybe(I18n),
  hasError: maybe(Bool),
  help: maybe(Label),
  error: maybe(ErrorMessage),
  label: maybe(Label),
  order: maybe(list(Label)),
  templates: maybe(Templates),
  value: maybe(Obj)
}, 'Struct');

var List = struct({
  auto: maybe(Auto),
  config: maybe(Obj),
  disableAdd: maybe(Bool),
  disableRemove: maybe(Bool),
  disableOrder: maybe(Bool),
  disabled: maybe(Bool),
  i18n: maybe(I18n),
  item: maybe(Obj),
  hasError: maybe(Bool),
  help: maybe(Label),
  error: maybe(ErrorMessage),
  label: maybe(Label),
  templates: maybe(Templates),
  value: maybe(t.Arr)
}, 'List');

module.exports = {
  I18n: I18n,
  Templates: Templates,
  Context: Context,
  ReactElement: ReactElement,
  Label: Label,
  ErrorMessage: ErrorMessage,
  Option: Option,
  OptGroup: OptGroup,
  SelectOption: SelectOption,
  Transformer: Transformer,
  Order: Order,
  Textbox: Textbox,
  Checkbox: Checkbox,
  Select: Select,
  Radio: Radio,
  Struct: Struct,
  List: List
};
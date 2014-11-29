'use strict';

var t = require('tcomb-validation');

var TextboxType = t.enums.of('hidden text textarea password color date datetime datetime-local email month number range search tel time url week', 'TypeAttr');

var Verbatim = t.struct({
  verbatim: t.Any
}, 'Verbatim');

var Base = t.struct({
  _path: t.list(t.Str),
  _type: t.Type,
  _ref: t.maybe(t.Str)
});

var InputMixin = {
  name: t.maybe(t.Str),
  label: t.Any,
  help: t.Any,
  message: t.maybe(t.union([t.Str, t.Func])),
  hasError: t.maybe(t.Bool)
};

var Textbox = Base.extend([InputMixin, {
  value: t.Any,
  type: t.maybe(TextboxType),
  placeholder: t.Any
}], 'Textbox');

var Checkbox = Base.extend([InputMixin, {
  value: t.maybe(t.Bool)
}], 'Checkbox');

var Fieldset = Base.extend({
  label: t.Any,
  fields: t.list(t.Any)
}, 'Fieldset');

module.exports = {
  Textbox: Textbox,
  Checkbox: Checkbox,
  Verbatim: Verbatim,
  Fieldset: Fieldset
};
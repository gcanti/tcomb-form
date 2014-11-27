'use strict';

var t = require('tcomb-validation');

var TextboxType = t.enums.of('hidden text textarea password color date datetime datetime-local email month number range search tel time url week', 'TypeAttr');

var Common = t.struct({
  label: t.Any,
  help: t.Any,
  message: t.maybe(t.union([t.Str, t.Func])),
  hasError: t.maybe(t.Bool)
});

var Textbox = Common.extend({
  input: t.struct({
    type: t.maybe(TextboxType),
    value: t.Any,
    placeholder: t.Any,
    name: t.maybe(t.Str)
  })
}, 'Textbox');

var Checkbox = Common.extend({
  input: t.maybe(t.struct({
    value: t.maybe(t.Bool),
    name: t.maybe(t.Str)
  }))
}, 'Checkbox');

module.exports = {
  Textbox: Textbox,
  Checkbox: Checkbox
};
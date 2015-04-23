v0.4.11

- Remove class "has-error" from empty optional field, fix #113

v0.4.10

- fix nullOption was incorrectly added to multiple selects
- experimental semantic ui skin

v0.4.9

- code refactoring (backporting v0.5)
- added `template` option to structs and lists
- added `Component.extend` API
- added `getComponent(path)` API
- added basic date component

v0.4.8

- fix #98

v0.4.7

- added path field to contexts: validations report correct error paths now, fix #94
- added support for transformers (all components), fix #90, fix #93
- added a path argument to onChange in order to know what field changed, fix #97, fix #87
- fix #98

v0.4.6

- `value = null`, `undefined` or `nullOption.value` selects the null option now
- fix #89

v0.4.5

- move tcomb-validation to peerDependencies, fix #84

v0.4.4

- Allow removal of nullOption if a default value is set, fix #71
- Input className customization, fix #76
  1. added a `className` option to:
    - `Textbox`
    - `Select`
    - `Checkbox`
    - `Radio`
    - `List`
    - `Struct`
  2. handled in Bootstrap's skin:
    - `Textbox`: add the className to the `<input type="text"/>` / `<textarea/>` tag
    - `Select`: add the className to the `<select/>` tag
    - `Checkbox`: add the className to the `<input type="checkbox"/>` tag
    - `Radio`: add the className to **all** the `<input type="radio"/>` tags
    - `List`: add the className to the `<fieldset/>` tag
    - `Struct`: add the className to the `<fieldset/>` tag

v0.4.3

- fix onChange order: after setState

v0.4.2

- upgrade to tcomb-validation v1.0

v0.4.1

- fix #65 bug
- bootstrap skin: lists - if there are no buttons, give items 12 cols

v0.4

- complete rewrite

**BREAKING**

- removed `t.form.create` API, use `t.form.Form` component instead
- Renamed options->label to options->legend (structs and lists)
- changed auto default value to `labels`, #62
- Always show placeholders that are set, #61
- renamed `t.form.radio` to `t.form.Radio`

v0.3.1

- Move react to peerDependencies so multiple versions of React not loaded

v0.3

- added experimental tuple support

v0.3.0-rc2

- added autofocus attribute support, fix #47

**BREAKING**

- refactored `templates` folder for better file organisation, fix #45

v0.3.0-rc2

- fix bug #40
- add `id` option to textbox and select (used for label's htmlFor attribute) #35
- textbox value: handle white spaces as `null` #34

**BREAKING**

- changed onChange(evt) to onChange(value)

v0.3.0-rc1

- complete code refactoring, fix #8

**BREAKING**

- `input` option is now `factory`
- `emptyOption` option is now `nullOption`
- no more "Choose your ..." option in selects
- no more need for `multiple` option, use `t.form.select` with lists of enums instead
- `i17n` option is now called `transformer`
- horizontal forms must be handled by the style
- custom input now must be functions with signature: `(opts, ctx) -> React Class`
- optgroup has now a `label` property instead of `group`

v0.2.3

- Always add control-label class to labels. Required for example for displaying validation states correctly.

v0.2.2

- upgrade to tcomb-validation v0.2.1
- better lists management
- `createForm` and `createList` apis are deprecated and they will be removed in the next release. Use `create` instead.

v0.2.1

- `createForm` doesn't handle correctly a `maybe(Num)` field, fix #20
- better documentation
- add a default value for the `name` attribute to all inputs, fix #17

v0.2.0

- update to React v0.12.1

v0.1.8

- repo refactoring to simplify setup (gulp)

v0.1.7

- `opts.message` can be a function

v0.1.6

- `createForm` and `createList` now return a `fieldset` tag as a top level element, fix #2 (partially)
- added `opts.i18n` (i18n support) fix #4
- added `hasError` and `message` options
- added `defaultI17n`, fix #14
- added `opts.name` to all inputs

v0.1.5

- upgrade to tcomb-validation v0.1.3

v0.1.4

- allow `hidden` type for the textbox component, fix #13
- add custom options support (allows grouped options too), fix #12
- added `create` API, fix #9

v0.1.3

- Example #7 `invalid Array.prototype.sort argument` fix #7

v0.1.2

- fix i17n related bug

v0.1.1

- Add-ons
- horizontal forms
- disabled inputs
- readOnly inputs
- control sizing
- column sizing
- i17n opt for forms and lists
- context opt for forms and lists

v0.1.0

initial release

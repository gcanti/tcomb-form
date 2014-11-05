If you don't know how to define types with tcomb you may want to take a look at its [README](https://github.com/gcanti/tcomb/blob/master/README.md) file.

# create

```js
create(type, [opts])
```

Dispatches to `createForm` or `createList` based on the argument `type`.

# createForm

```js
createForm(type, [opts])
```

Returns a React.js component handling the form fields defined by the `type` struct.

- `type`: a `struct` or a `subtype` of a `struct`
- `opts`: a hash containing directives on how you want render the form

Example

```js
var Person = struct({
  name: Str,
  surname: Str
});

var Form = createForm(Person);
```

## getValue()

Returns an instance of `type` if the validation succeded, `null` otherwise.

## opts.ctx: Any

Useful to pass a context to deeply nested inputs.

## opts.value: maybe(Obj)

A hash containing the default values of the form fields.

Example

```js
var Person = struct({
  name: Str,
  surname: Str
});

var Form = createForm(Person, {
  value: {
    name: 'Giulio',
    surname: 'Canti'
  }
});
```

## opts.label: Any

Adds a label above the form.

Example

```js
var Person = struct({
  name: Str,
  surname: Str
});

var Form = createForm(Person, {
  label: 'Insert your data'
});
```

## opts.auto

One of `placeholders` (default), `labels`, `none`. Adds automatically generated placeholders or labels
to the form. Set `auto` to `none` if you don't want neither.

Example

```js
var Person = struct({
  name: Str,
  surname: Str
});

var Form = createForm(Person, {
  auto: 'labels'
});
```

## opts.order: maybe(list(Str))

Renders the form fields in the specified order

Example

```js
var Person = struct({
  name: Str,
  surname: Str
});

var Form = createForm(Person, {
  order: ['surname', 'name'] // `surname` field first, then `name` field
});
```

## opts.fields: maybe(Obj)

A hash containing the options for every fields. See the section `opts` of the inputs types
for details.

```js
var Person = struct({
  name: Str,
  surname: Str
});

var Form = createForm(Person, {
  fields: {
    name: { label: 'Your name' },       // override default placeholder / label
    surname: { label: 'Your surname' }  // override default placeholder / label
  }
});
```

## opts.breakpoints: maybe(Breakpoints)

Useful when the form is horizonatal.
An hash containing the optional keys: `xs`, `sm`, `md`, `lg`.
For each key you can set the width of the label and the width of the input.

Example

```js
var Person = struct({
  name: Str,
  surname: Str,
});

var Form = createForm(Person, {
  auto: 'labels',
  breakpoints: { md: [2, 10] }
});
```

## opts.i17n: maybe(I17n)

i17n support

# createList

```js
createList(type, [opts])
```

Returns a React.js component handling the items defined by the `type` list.

- `type`: a `list` or a `subtype` of a `list`
- `opts`: a hash containing directives on how you want render the list

Example

```js
var Tags = list(Str);

var Form = createList(Tags);
```

## getValue()

Returns an instance of `type` if the validation succeded, `null` otherwise.

## opts.ctx: Any

Useful to pass a context to deeply nested inputs.

## opts.value: maybe(Arr)

A hash containing the default values of the form fields.

Example

```js
var Tags = list(Str);

var Form = createList(Tags, {
  value: ['domain', 'driven', 'forms']
});
```

## opts.label: Any

Adds a label above the form.

Example

```js
var Tags = list(Str);

var Form = createList(Tags, {
  label: 'Insert your tags'
});
```

## opts.disableAdd: maybe(Bool)

If set to `true` removes the possibility to add an item to the list.

## opts.disableRemove: maybe(Bool)

If set to `true` removes the possibility to remove the items from the list.

## opts.disableOrder: maybe(Bool)

If set to `true` removes the possibility to sort the items in the list.

## opts.item: maybe(Obj)

A hash containing the options for every item in the list. See the section `opts` of the inputs types
for details.

```js
var Colors = list(Str);

var Form = createList(Colors, {
  item: {
    type: 'color' // use HTML5 color textbox
  }
});
```

## opts.i17n: maybe(I17n)

i17n support

# textbox

```js
textbox(type, [opts])
```

- `type`: every type that it makes sense to render in a textbox / textarea
- `opts`: a hash containing directives on how you want render the textbox / textarea

## opts.ctx: Any

Useful to pass a context to deeply nested inputs.

## opts.name: maybe(Str)

Sets the `name` attribute of the textbox / textarea input.

## opts.type: maybe(Str)

One of

- `text`
- `textarea`
- `password`
- `color`
- `date`
- `datetime`
- `datetime-local`
- `email`
- `month`
- `number`
- `range`
- `search`,
- `tel`
- `time`
- `url`
- `week`

## opts.value: Any

The default value of the textbox / textarea.

## opts.label: Any

Adds a label above the textbox / textarea.

## opts.help: Any

Adds a label below the textbox / textarea.

## opts.groupClasses: maybe(Obj)

Customize the `className` of the containing `div`.

## opts.placeholder: maybe(Str)

Overrrides the default placeholder.

## opts.i17n: maybe(I17n)

i17n support

Example

```js
var Person = struct({
  name: Str,
  age: Num // a number property
});

var Form = createForm(Person, {
  fields: {
    age: {
      i17n: {
        // this is used from the model to the UI
        format: function (value) {
          return value;
        },
        // this is used from the UI to the model
        parse: function (s) {
          return parseFloat(s, 10);
        }
      }
    }
  }
});
```

## opts.disabled: maybe(Bool)

Disable the input.

## opts.readOnly: maybe(Bool)

Makes the the input readOnly.

## opts.addonBefore: Any

Bootstrap 3 addon before.

## opts.addonAfter: Any

Bootstrap 3 addon after.

## opts.height: maybe(Size)

Set height, one of `xs`, `sm`, `md`, `lg`.

# select

```js
textbox(type, [opts])
```

- `type`: an `enums` or a `subtype` of an `enums`
- `opts`: a hash containing directives on how you want render the select

## opts.ctx: Any

Useful to pass a context to deeply nested inputs.

## opts.name: maybe(Str)

Sets the `name` attribute of the select input.

## opts.value: maybe(type)

The default value of the select.

## opts.label: Any

Adds a label above the select.

## opts.help: Any 

Adds a label below the select.

## opts.groupClasses: maybe(Obj)

Customize the `className` of the containing `div`.

## opts.multiple: maybe(Bool)

Sets the `multiple` attribute of the select input.

```js
var Country = t.enums({
  IT: 'Italy',
  US: 'United States'
});

var Person = struct({
  country: list(Country)
});

var Form = t.form.createForm(Person, {
  fields: {
    country: {
      multiple: true,
      input: t.form.select
    }
  }
});
```

## opts.emptyOption: maybe(Option)

Adds a first option to the select representing a "no choice".
Overrides the default one.

Example

```js
var Country = enums({ IT: 'Italy', US: 'United States' });

var Person = struct({
  name: Str,
  country: Country
});

var Form = createForm(Person, {
  fields: {
    country: {
      emptyOption: {value: '', text: '-'}
    }
  }
});
```

## opts.order: maybe(Order)

Sorts the options `asc` or `desc`.

## opts.disabled: maybe(Bool)

Disable the input.

## opts.height: maybe(Size)

Set height, one of `xs`, `sm`, `md`, `lg`.

## opts.options: maybe(list(Option))

Allows to override the default options created by the library.

```js
var MyEnum = enums({
  value1: 'description1',
  value2: 'description2',
  value3: 'description3'
});

var MyStruct = struct({
  myenum: MyEnum
});

var Form = t.form.create(MyStruct, {
  fields: {
    myenum: {
      options: [
        {value: 'value1', text: 'another description 1'},
        {value: 'value3', text: 'another description 3'},
        {value: 'value2', text: 'another description 2'}
      ]
    }
  }
});
```

You can also handle grouped options:

```js
var MyEnum = enums({
  value1: 'description1',
  value2: 'description2',
  value3: 'description3',
  value4: 'description4',
  value5: 'description5'
});

var MyStruct = struct({
  myenum: MyEnum
});

var Form = t.form.createForm(MyStruct, {
  fields: {
    myenum: {
      options: [
        {value: 'value5', text: 'description5'}, // an option
        {group: 'group1', options: [ // a group of options
          {value: 'value1', text: 'description1'},
          {value: 'value3', text: 'description3'}
        ]},
        {group: 'group2', options: [ // another group of options
          {value: 'value4', text: 'description4'},
          {value: 'value2', text: 'description2'}
        ]}
      ]
    }
  }
});
```

# radio

```js
textbox(type, [opts])
```

- `type`: an `enums` or a `subtype` of an `enums`
- `opts`: a hash containing directives on how you want render the radio

## opts.ctx: Any

Useful to pass a context to deeply nested inputs.

## opts.name: maybe(Str)

Sets the `name` attribute of all the radio inputs.

## opts.value: Any

The default value of the radio.

## opts.label: Any

Adds a label above the radio.

## opts.help: Any

Adds a label below the radio.

## opts.groupClasses: maybe(Obj)

Customize the `className` of the containing `div`.

## opts.order: maybe(Order)

# checkbox

```js
checkbox(type, [opts])
```

- `type`: a `Bool` or a `subtype` of a `Bool`
- `opts`: a hash containing directives on how you want render the checkbox

## opts.ctx: Any

Useful to pass a context to deeply nested inputs.

## opts.name: maybe(Str)

Sets the `name` attribute of the checkbox input.

## opts.value: maybe(type)

The default value of the checkbox.

## opts.label: Any

Adds a label above the checkbox.

## opts.help: Any

Adds a label below the checkbox.

## opts.groupClasses: maybe(Obj)

Customize the `className` of the containing `div`.

# Custom inputs

A custom input is simply a function `(type, opts) -> ReactClass` where the ReactClass must have a `getValue` method.

```js
function hiddenInput(type, opts) {
  return React.createClass({
    getValue: function () {
      return opts.value;
    },
    render: function () {
      return React.DOM.input({type: 'hidden', value: opts.value});
    }
  });
}

var Person = struct({
  name: Str,
  surname: Str,
  secret: Str // this will be the `type` argument passed to `hiddenInput`
});

var Form = createForm(Person, {
  fields: {
    // this will be the `opts` argument passed to `hiddenInput`
    secret: {
      // override the default input for Str (textbox)
      input: hiddenInput,
      value: 'mysecret'
    }
  }
})
```

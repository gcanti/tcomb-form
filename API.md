If you don't know how to define types with tcomb you may want to take a look at its [README](https://github.com/gcanti/tcomb/blob/master/README.md) file.

# create

```js
create(type, [opts])
```

Dispatches to `createForm` or `createList` based on the argument `type`.

# createForm

```js
createForm(type, [options])
```

Returns a React.js component handling the form fields defined by the `type` struct.

- `type`: a `struct` or a `subtype` of a `struct`
- `options`: an optional hash containing directives on how you want to render the form

The props of the struct can be:

- irriducibles or maybe irriducibles
- a struct (maybe sub structs are not allowed)
- a list (maybe sub lists are not allowed)

Example

```js
var t = require('tcomb-form');

// define a type
var Person = t.struct({
  name: t.Str,
  surname: t.Str
});

// create the form
var Form = t.form.createForm(Person);

// use the form in your component
var App = React.createClass({
  onClick: function (evt) {
    evt.preventDefault();
    var value = this.refs.form.getValue();
    if (value) {
      console.log(value);
    }
  },
  render: function () {
    return (
      <form onClick={this.onClick}>
        <Form ref="form"/>
        <button className="btn btn-primary">Click me</button>
      </form>
    );
  }
});
```

## getValue()

Returns an instance of `type` if the validation succeded, `null` otherwise.

## Options

### ctx: Any

Useful to pass a context to deeply nested inputs.

### value: maybe(Obj)

A hash containing the default values of the form fields.

```js
var Form = createForm(Person, {
  value: {
    name: 'Giulio',
    surname: 'Canti'
  }
});
```

### label: Any

Adds a label above the form.

```js
var Form = createForm(Person, {
  label: 'Insert your data'
});
```

### auto: enums.of('placeholders labels none')

One of `placeholders` (default), `labels`, `none`. Adds automatically generated placeholders or labels
to the form. Set `auto` to `none` if you don't want neither.

```js
var Form = createForm(Person, {
  auto: 'labels'
});
```

### order: maybe(list(union[Str, ReactElement]))

Renders the form fields in the specified order.

```js
var Form = createForm(Person, {
  order: ['surname', 'name'] // `surname` field first, then `name` field
});
```

### fields: maybe(Obj)

A hash containing the options for every fields. See the section `options` of the inputs types for details.

```js
var Form = createForm(Person, {
  fields: {
    // override default placeholder / label
    name: { label: 'Your name' },
    // override default placeholder / label
    surname: { label: 'Your surname' }  
  }
});
```

### breakpoints: maybe(Breakpoints)

Useful when the form is horizontal.
An hash containing the optional keys: `xs`, `sm`, `md`, `lg`.
For each key you can set the width of the label and the width of the input, following Bootstrap 3 conventions.

```js
var Form = createForm(Person, {
  auto: 'labels',
  breakpoints: { md: [2, 10] }
});
```

# createList

```js
createList(type, [options])
```

Returns a React.js component handling the items defined by the `type` list.

- `type`: a `list` or a `subtype` of a `list`
- `options`: a hash containing directives on how you want render the list

Example

```js
var Tags = list(Str);

var Form = createList(Tags);
```

## getValue()

Returns an instance of `type` if the validation succeded, `null` otherwise.

## options

### ctx: Any

Useful to pass a context to deeply nested inputs.

### value: maybe(Arr)

An array containing the default values of the form fields.

```js
var Form = createList(Tags, {
  value: ['domain', 'driven', 'forms']
});
```

### label: Any

Adds a label above the form.

Example

```js
var Form = createList(Tags, {
  label: 'Insert your tags'
});
```

### disableAdd: maybe(Bool)

If set to `true` removes the possibility to add an item to the list.

### disableRemove: maybe(Bool)

If set to `true` removes the possibility to remove the items from the list.

### disableOrder: maybe(Bool)

If set to `true` removes the possibility to sort the items in the list.

### item: maybe(Obj)

A hash containing the options for every item in the list. See the section `options` of the inputs types for details.

```js
var Colors = list(Str);

var Form = createList(Colors, {
  item: {
    type: 'color' // use HTML5 color textbox
  }
});
```

# Inputs

All inputs have the following signature:

```js
function(type, [options])
```

- `type`: a type that it makes sense to render in the input
- `options`: a hash containing directives on how you want render the input

All inputs support the following options:

## Options

### ctx: Any

Useful to pass a context to deeply nested inputs.

### value: Any

The default value of the input.

### label: Any

Adds a label to the input.

### help: Any

Adds a label below the input containing a help for the user.

### name: maybe(Str)

Sets the `name` attribute of the input.

### hasError: maybe(Bool)

Show the input in "error mode".

### message: maybe(union([Str, Func]))

If `hasError = true` adds a label below the input containing the specified error message. `message` can be a function with the following signature

```js
function (value: Any) -> Str
```

where `value` is the current value of the input.

An example of setting error messages at runtime using `setState`:

```js
var Model = t.struct({
  email: t.Str
});

function sendDataToServer(values) {
  return {email: 'Duplicated email'};
}

var RegisterForm = React.createClass({

  getInitialState: function () {
    return {};
  },

  onClick: function(evt) {
    evt.preventDefault();
    var values = this.refs.form.getValue();
    if (values) {
      var errors = sendDataToServer(values);
      if (errors.email) {
        this.setState({
          email: values.email,
          emailMessage: errors.email
        });
      }
    }
  },

  render: function() {

    var Form = t.form.createForm(Model, {
      fields: {
        email: {
          type: 'email',
          value: this.state.email, // keeps the user input
          hasError: !!this.state.emailMessage,
          message: this.state.emailMessage
        }
      }
    });

    return (
      <form onSubmit={this.onClick}>
        <Form ref="form"/>
        <input type="submit" className="button" value="Register" />
      </form>
    );
  }
});
```

# textbox

```js
textbox(type, [options])
```

- `type`: every type that it makes sense to render in a textbox / textarea
- `options`: a hash containing directives on how you want render the textbox / textarea

## Options

### type: maybe(Str)

One of:

- `text` **default**
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

### placeholder: maybe(Str)

Overrrides the default placeholder.

### i17n: maybe(I17n)

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

### disabled: maybe(Bool)

Makes the textbox disabled.

### readOnly: maybe(Bool)

Makes the textbox readOnly.

### Bootstrap goodies options

- addonBefore: Any. Bootstrap 3 addon before
- addonAfter: Any. Bootstrap 3 addon after
- height: maybe(Size). One of `xs`, `sm`, `md`, `lg`

```js
var Person = struct({
  name: Str,
  surname: Str,
  preferredSong: Str,
  twitter: Str
});

var Form = createForm(Person, {
  fields: {
    // control sizing
    name: {height: 'lg'},
    // addon after
    preferredSong: {
      addonAfter: React.DOM.span({className: 'glyphicon glyphicon-music'})
    },
    // addon before
    twitter: {
      addonBefore: '@'
    }
  }  
});

```

# select

```js
select(type, [options])
```

- `type`: an `enums` or a `subtype` of an `enums`
- `options`: a hash containing directives on how you want render the select

### multiple: maybe(Bool)

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

### emptyOption: maybe(Option)

Adds a first option to the select representing a "no choice".
Overrides the default one.

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

### order: maybe(Order)

Sorts the options `asc` or `desc`.

### disabled: maybe(Bool)

Makes the select disabled.

### height: maybe(Size)

Set height, one of `xs`, `sm`, `md`, `lg`.

### options: maybe(list(Option))

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
radio(type, [options])
```

- `type`: an `enums` or a `subtype` of an `enums`
- `options`: a hash containing directives on how you want render the radio

### order: maybe(Order)

# checkbox

```js
checkbox(type, [options])
```

- `type`: a `Bool` or a `subtype` of a `Bool`
- `options`: a hash containing directives on how you want render the checkbox

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

# Get started

## Setup

```sh
$ npm install tcomb-form
```

## Working example

```js
var React = require('react');
var t = require('tcomb-form');
var Form = t.form.Form;

// define your domain model with tcomb
// https://github.com/gcanti/tcomb
var Person = t.struct({
  name: t.Str,
  surname: t.Str
});

var App = React.createClass({

  save() {
    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();
    // if validation fails, value will be null
    if (value) {
      // value here is an instance of Person
      console.log(value);
    }
  },

  render() {
    return (
      <div>
        <Form
          ref="form"
          type={Person}
        />
        <button onClick={this.save}>Save</button>
      </div>
    );
  }

});

React.render(<App />, document.getElementById('app'));
```

> **Note**. Labels are automatically generated.

## API

### `getValue()`

Returns `null` if the validation failed, an instance of your model otherwise.

> **Note**. Calling `getValue` will cause the validation of all the fields of the form, including some side effects like highlighting the errors.

### `validate()`

Returns a `ValidationResult` (see [tcomb-validation](https://github.com/gcanti/tcomb-validation) for a reference documentation).

### Adding a default value and listen to changes

The `Form` component behaves like a [controlled component](https://facebook.github.io/react/docs/forms.html):

```js
var App = React.createClass({

  getInitialState() {
    return {
      value: {
        name: 'Giulio',
        surname: 'Canti'
      }
    };
  },

  onChange(value) {
    this.setState({value});
  },

  save() {
    var value = this.refs.form.getValue();
    if (value) {
      console.log(value);
    }
  },

  render() {
    return (
      <div>
        <Form
          ref="form"
          type={Person}
          value={this.state.value}
          onChange={this.onChange}
        />
        <button onClick={this.save}>Save</button>
      </div>
    );
  }

});
```

The `onChange` handler has the following signature:

```
(raw: any, path: Array<string | number>, kind?) => void
```

where

- `raw` contains the current raw value of the form (can be an invalid value for your model)
- `path` is the path to the field triggering the change
- `kind` specify the kind of change (when `undefined` means a value change)
  + `'add'` list item added
  + `'remove'` list item removed
  + `'moveUp'` list item moved up
  + `'moveDown'` list item moved down

### How to get access to a field

You can get access to a field with the `getComponent(path)` API:

```js
var Person = t.struct({
  name: t.Str,
  surname: t.Str
});

var App = React.createClass({

  onChange(value, path) {
    // validate a field on every change
    this.refs.form.getComponent(path).validate();
  },

  render() {
    return (
      <div>
        <Form ref="form"
          type={Person}
          onChange={this.onChange}
        />
      </div>
    );
  }

});
```

### Submitting the form

The output of the `Form` component is a `fieldset` tag containing your fields. You can submit the form wrapping the output with a `form` tag:

```js
var App = React.createClass({

  onSubmit(evt) {
    var value = this.refs.form.getValue();
    if (!value) {
      // there are errors, don't send the form
      evt.preventDefault();
    } else {
      // everything ok, let the form fly...
      // ...or handle the values contained in the
      // `value` variable with js
    }
  },

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <Form
          ref="form"
          type={Person}
        />
        <button type="submit">Save</button>
      </form>
    );
  }

});
```

# Types

Models are defined with [tcomb](https://github.com/gcanti/tcomb). tcomb is a library for Node.js and the browser which allows you to check the types of JavaScript values at runtime with a simple syntax. It's great for Domain Driven Design, for testing and for adding safety to your internal code.

## Required field

By default fields are required:

```js
var Person = t.struct({
  name: t.Str,    // a required string
  surname: t.Str  // a required string
});
```

## Optional field

In order to create an optional field, wrap the field type with the `t.maybe` combinator:

```js
var Person = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str) // an optional string
});
```

The postfix `" (optional)"` is automatically added to optional fields.

## Numbers

In order to create a numeric field, use the `t.Num` type:

```js
var Person = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str),
  age: t.Num // a numeric field
});
```

tcomb-form will convert automatically numbers to / from strings.

## Subtypes

A *predicate* is a function with the following signature:

```
(x: any) => boolean
```

You can refine a type with the `t.subtype(type, predicate)` combinator:

```js
// a type representing positive numbers
var Positive = t.subtype(t.Num, function (n) {
  return n >= 0;
});

var Person = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str),
  age: Positive // refinement
});
```

Subtypes allow you to express any custom validation with a simple predicate.

## Booleans

In order to create a boolean field, use the `t.Bool` type:

```js
var Person = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str),
  age: t.Num,
  rememberMe: t.Bool // a boolean field
});
```

Booleans are displayed as checkboxes.

## Dates

In order to create a date field, use the `t.Dat` type:

```js
var Person = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str),
  age: t.Num,
  rememberMe: t.Bool,
  birthDate: t.Dat // a date field
});
```

## Enums

In order to create an enum field, use the `t.enums` combinator:

```js
var Gender = t.enums({
  M: 'Male',
  F: 'Female'
});

var Person = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str),
  age: t.Num,
  rememberMe: t.Bool,
  birthDate: t.Dat,
  gender: Gender // enum
});
```

By default enums are displayed as selects.

## Lists

You can handle a list with the `t.list` combinator:

```js
var Person = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str),
  age: Positive, // refinement
  rememberMe: t.Bool,
  birthDate: t.Dat,
  gender: Gender,
  tags: t.list(t.Str) // a list of strings
});
```

## Nested structures

You can nest lists and structs at an arbitrary level:

```js
var Person = t.struct({
  name: t.Str,
  surname: t.Str
});

var Persons = t.list(Person);

...

<Form
  ref="form"
  type={Persons}
/>
```

# Rendering options

In order to customize the look and feel, use an `options` prop:

```js
<Form type={Model} options={options} />
```

## Struct options

### Automatically generated placeholders

In order to generate default placeholders use the option `auto: 'placeholders'`:

```js
var options = {
  auto: 'placeholders'
};

<Form type={Person} options={options} />
```

Or `auto: 'none'` if you don't want neither labels nor placeholders:

```js
var options = {
  auto: 'none'
};
```

### Fields order

You can sort the fields with the order option:

```js
var options = {
  order: ['name', 'surname', 'rememberMe', 'gender', 'age', 'email']
};
```

### Legend

You can add a fieldset legend with the `legend` option:

```js
var options = {
  // you can use strings or JSX
  legend: <i>My form legend</i>
};
```

### Help message

You can add an help message with the `help` option:

```js
var options = {
  // you can use strings or JSX
  help: <i>My form help</i>
};
```

### Error message

You can add a custom error message with the `error` options:

```js
var options = {
  // you can use strings or JSX
  error: <i>A custom error message</i>
};
```

`error` can also be a function with the following signature:

```
(value: any) => ?(string | ReactElement)
```

where `value` is an object containing the current form value.

If you want to show the error message onload, add the `hasError` option:

```js
var options = {
  hasError: true,
  error: <i>A custom error message</i>
};
```

### Disabled

You can disable the whole fieldset with the `disabled` option:

```js
var options = {
  disabled: true
};
```

### Fields configuration

You can configure each field with the `fields` option:

```js
var options = {
  fields: {
    name: {
      // name field configuration here..
    },
    surname: {
      // surname field configuration here..
    },
    ...
  }
});
```

`fields` is a hash containing a key for each field you want to configure.

### Look and feel

You can customize the look and feel with the `template` option:

```js
var options = {
  template: mytemplate // see Templates section for documentation
}
```

## List options

The following options are similar to the Struct ones:

- `auto`
- `disabled`
- `help`
- `hasError`
- `error`
- `legend`
- `template`

### Items configuration

To configure all the items in a list set the `item` option:

```js
var Colors = t.list(t.Str);

var options = {
  item: {
    type: 'color' // HTML5 type attribute
  }
});

<Form type={Colors} options={options} />
```

### Internationalization

You can override the default language (english) with the `i18n` option:

```js
var options = {
  i18n: {
    add: 'Nuovo',               // add button
    down: 'Giù',                // move down button
    optional: ' (opzionale)',   // suffix added to optional fields
    remove: 'Elimina',          // remove button
    up: 'Su'                    // move up button
  }
};
```

### Buttons configuration

You can prevent operations on lists with the following options:

- `disableAdd`: (default `false`) prevents adding new items
- `disableRemove`: (default `false`) prevents removing existing items
- `disableOrder`: (default `false`) prevents sorting existing items

```js
var options = {
  disableOrder: true
};
```

## Textbox options

> **Tech note**. Values containing only white spaces are converted to null.

The following options are similar to the fieldset ones:

- `disabled`
- `help`
- `hasError`
- `error`
- `template`

### Type attribute

You can set the type attribute with the `type` option. The following values are allowed:

- 'text' (default)
- 'password'
- 'hidden'
- 'textarea' (outputs a textarea instead of a textbox)
- 'static' (outputs a static value)
- all the HTML5 type values

### Label

You can override the default label with the `label` option:

```js
var options = {
  fields: {
    name: {
      // you can use strings or JSX
      label: <i>My label</i>
    }
  }
};
```

### Attributes and events

You can add attributes and events with the `attrs` option:

```js
var options = {
  fields: {
    name: {
      attrs: {
        autoFocus: true,
        placeholder: 'Type your name here',
        onBlur: function () {
          console.log('onBlur');
        }
      }
    }
  }
};
```


### Styling

You can a style class with the `className` or the `style` attribute:

```js
var options = {
  fields: {
    name: {
      attrs: {
        className: 'myClassName'
      }
    }
  }
};
```

`className` can be a string, an array of strings or a dictionary `string -> boolean`.

## Checkbox options

The following options are similar to the textbox ones:

- `attrs`
- `label`
- `help`
- `disabled`
- `hasError`
- `error`
- `template`

## Select options

The following options are similar to the textbox ones:

- `attrs`
- `label`
- `help`
- `disabled`
- `hasError`
- `error`
- `template`

### Null option

You can customize the null option with the `nullOption` option:

```js
var options = {
  fields: {
    gender: {
      nullOption: {value: '', text: 'Choose your gender'}
    }
  }
};
```

You can remove the null option setting the `nullOption` option to `false`.

> **Warning**: when you set `nullOption = false` you must also set the Form's `value` prop for the select field.

> **Tech note**. A value equal to `nullOption.value` (default `''`) is converted to `null`.

### Options order

You can sort the options with the `order` option:

```js
var options = {
  fields: {
    gender: {
      order: 'asc' // or 'desc'
    }
  }
};
```

### Custom options

You can customize the options with the `options` option:

```js
var options = {
  fields: {
    gender: {
      options: [
        {value: 'M', text: 'Maschio'},
         // use `disabled: true` to disable an option
        {value: 'F', text: 'Femmina', disabled: true}
      ]
    }
  }
};
```

An option is a object with the following structure:

```js
{
  value: string,      // required
  text: string,       // required
  disabled: ?boolean  // optional, default = false
}
```

You can also add optgroups:

```js
var Car = t.enums.of('Audi Chrysler Ford Renault Peugeot');

var Select = t.struct({
  car: Car
});

var options = {
  fields: {
    car: {
      options: [
        {value: 'Audi', text: 'Audi'}, // an option
        {label: 'US', options: [ // a group of options
          {value: 'Chrysler', text: 'Chrysler'},
          {value: 'Ford', text: 'Ford'}
        ]},
        {label: 'France', options: [ // another group of options
          {value: 'Renault', text: 'Renault'},
          {value: 'Peugeot', text: 'Peugeot'}
        ], disabled: true} // use `disabled: true` to disable an optgroup
      ]
    }
  }
};
```

### Render as a radio group

You can render the select as a radio group using the `factory` option to override the default:

```js
var options = {
  factory: t.form.Radio
};
```

### Multiple select

You can turn the select in a multiple select passing a `list` as type and using the `factory` option to override the default:

```js
var Car = t.enums.of('Audi Chrysler Ford Renault Peugeot');

var Select = t.struct({
  car: t.list(Car)
});

var options = {
  fields: {
    car: {
      factory: t.form.Select
    }
  }
};
```

## Date options

The following options are similar to the textbox ones:

- `label`
- `help`
- `disabled`
- `hasError`
- `error`
- `template`

# Customizations

## Templates

To customize the "skin" of tcomb-form you have to write a *template*. A template is simply a function with the following signature:

```
(locals: any) => UVDOM | ReactElement
```

where `locals` is an object contaning the "recipe" for rendering the input and is built by tcomb-form for you. The returned value can be a [UVDOM](https://github.com/gcanti/uvdom) or a `ReactElement`.

For example this is the recipe for a textbox:

```js
{
  attrs: maybe(Obj),        // should render attributes and events
  config: maybe(Obj),       // custom options, see Template addons section
  disabled: maybe(Bool),    // should be disabled
  error: maybe(Label),      // should show an error
  hasError: maybe(Bool),    // if true should show an error state
  help: maybe(Label),       // should show an help message
  label: maybe(Label),      // should show a label
  onChange: Func,           // should call this function with the changed value
  path: Arr,                // the path of this field with respect to the form root
  type: Str,                // should use this as type attribute
  value: Any                // the current value of the textbox
}
```

You can set a custom template using the `template` option:

```js
var Animal = t.enums({
 dog: "Dog",
 cat: "Cat"
});

var Pet = t.struct({
  name: t.Str,
  type: Animal
});

var Person = t.struct({
  name: t.Str,
  pets: t.list(Pet)
});

var formLayout = function(locals){
  return (
    <div>
      <p>formLayout</p>
      <div>{locals.inputs.name}</div>
      <div>{locals.inputs.pets}</div>
    </div>
  );
};

var petLayout = function(locals){
  return (
    <div>
      <p>petLayout</p>
      <div>{locals.inputs.name}</div>
      <div>{locals.inputs.type}</div>
    </div>
  );
};

var options = {
  template: formLayout,
  fields: {
    pets: { // <- pets is a list, you can customize the elements with the `item` option
      item: {
        template: petLayout
      }
    }
  }
};

var value = {
  birthday: 'mybirthday',
  name: 'myname',
  pets: [
    {name: 'pet1', type: 'dog'},
    {name: 'pet2', type: 'cat'}
  ]
};

var App = React.createClass({

  save() {
    var value = this.refs.form.getValue();
    if (value) {
      console.log(value);
    }
  },

  render() {

    return (
      <div>
        <Form ref="form"
          type={Person}
          options={options}
          value={value}
        />
        <br/>
        <button className="btn btn-primary" onClick={this.save}>Save</button>
      </div>
    );
  }

});

React.render(<App />, document.getElementById('app'));
```

# Bootstrap extras

## Textbox

### Addons

You can set an addon before or an addon after with the `config.addonBefore` and `config.addonAfter` options:

```js
var Textbox = t.struct({
  mytext: t.Str
});

var options = {
  fields: {
    mytext: {
      config: {
        // you can use strings or JSX
        addonBefore: <i>before<i>,
        addonAfter: <i>after</i>
      }
    }
  }
};

<Form type={Textbox} options={options} />
```

You can set a button after (before) with the `config.buttonAfter` (`config.buttonBefore`) option:

```js
var options = {
  fields: {
    mytext: {
      config: {
        buttonAfter: <button className="btn btn-default">Click me</button>
      }
    }
  }
};

<Form type={Textbox} options={options} />
```

### Size

You can set the textbox size with the `config.size` option:

```js
var Textbox = t.struct({
  mytext: t.Str
});

var options = {
  fields: {
    mytext: {
      config: {
        size: 'lg' // xs sm md lg are allowed
      }
    }
  }
};

<Form type={Textbox} options={options} />
```

## Select

Same as Textbox extras.

## Struct

You can render the form horizontal with the `config.horizontal` option:

```js
var Person = t.struct({
  name: t.Str,
  notifyMe: t.Bool,
  email: t.maybe(t.Str)
});

var options = {
  config: {
    // for each of lg md sm xs you can specify the columns width
    horizontal: {
      md: [3, 9],
      sm: [6, 6]
    }
  }
};

// remember to add the proper bootstrap style class
// to a wrapping div (or form) tag in order
// to get a nice layout
<div className="form-horizontal"> 
  <Form type={Person} options={options} />
</div>
```

# General configuration

tcomb-form uses the following default settings:

- english as language
- Bootstrap as theme

## Changing the default language

```js
// load tcomb-form without templates and i18n
var t = require('tcomb-form/lib');
var bootstrap = require('tcomb-form/lib/templates/bootstrap');
t.form.Form.templates = bootstrap;
t.form.Form.i18n = {
  optional: ' (opzionale)',
  add: 'Nuovo',
  remove: 'Elimina',
  up: 'Su',
  down: 'Giù'
};
```

## Changing the default skin

```js
// load tcomb-form without templates and i18n
var t = require('tcomb-form/lib');
var en = require('tcomb-form/lib/i18n/en');
var semantic = require('tcomb-form/lib/templates/semantic');

t.form.Form.i18n = en;
t.form.Form.templates = semantic;
```
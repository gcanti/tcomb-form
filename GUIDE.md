Table of Contents
=================

  * [Get started](#get-started)
    * [Setup](#setup)
    * [Working example](#working-example)
    * [API](#api)
      * [getValue()](#getvalue)
      * [validate()](#validate)
    * [How to](#how-to)
      * [Adding a default value and listening to changes](#adding-a-default-value-and-listening-to-changes)
      * [Accessing fields](#accessing-fields)
      * [Submitting the form](#submitting-the-form)
      * [Customised error messages](#customised-error-messages)
  * [Types](#types)
    * [Required field](#required-field)
    * [Optional field](#optional-field)
    * [Numbers](#numbers)
    * [Refinements](#refinements)
    * [Booleans](#booleans)
    * [Dates](#dates)
    * [Enums](#enums)
    * [Lists](#lists)
    * [Nested structures](#nested-structures)
  * [Rendering options](#rendering-options)
    * [Struct options](#struct-options)
      * [Automatically generated placeholders](#automatically-generated-placeholders)
      * [Fields order](#fields-order)
      * [Legend](#legend)
      * [Help message](#help-message)
      * [Error messages](#error-messages)
      * [Disabled](#disabled)
      * [Fields configuration](#fields-configuration)
      * [Look and feel](#look-and-feel)
    * [List options](#list-options)
      * [Items configuration](#items-configuration)
      * [Internationalization](#internationalization)
      * [Buttons configuration](#buttons-configuration)
    * [Textbox options](#textbox-options)
      * [Type attribute](#type-attribute)
      * [Label](#label)
      * [Attributes and events](#attributes-and-events)
      * [Styling](#styling)
    * [Checkbox options](#checkbox-options)
    * [Select options](#select-options)
      * [Null option](#null-option)
      * [Options order](#options-order)
      * [Custom options](#custom-options)
      * [Render as a radio group](#render-as-a-radio-group)
      * [Multiple select](#multiple-select)
    * [Date options](#date-options)
      * [Fields order](#fields-order-1)
  * [Customizations](#customizations)
    * [Templates](#templates)
      * [Clone default templates](#clone-default-templates)
    * [Transformers](#transformers)
    * [Custom factories](#custom-factories)
    * [getTcombFormFactory](#gettcombformfactory)
  * [Bootstrap extras](#bootstrap-extras)
    * [Textbox](#textbox)
      * [Addons](#addons)
      * [Size](#size)
    * [Select](#select)
    * [Struct](#struct)
  * [General configuration](#general-configuration)
    * [Changing the default language](#changing-the-default-language)
    * [Changing the default skin](#changing-the-default-skin)

# Get started

## Setup

```sh
$ npm install tcomb-form
```
Note: Use tcomb-form@0.6.x with react@0.13.x. See [#200](https://github.com/gcanti/tcomb-form/issues/200).

## Working example

```js
import React from 'react';
import { render } from 'react-dom';
import t from 'tcomb-form';

const Form = t.form.Form;

// define your domain model with tcomb
// https://github.com/gcanti/tcomb
const Person = t.struct({
  name: t.String,
  surname: t.String
});

const App = React.createClass({

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

render(<App />, document.getElementById('app'));
```

> **Note**. Labels are automatically generated.

## API

### `getValue()`

Returns `null` if the validation failed; otherwise returns an instance of your model.

> **Note**. Calling `getValue` will cause the validation of all the fields of the form, including some side effects like highlighting the errors.

### `validate()`

Returns a `ValidationResult` (see [tcomb-validation](https://github.com/gcanti/tcomb-validation) for a reference documentation).

## How to

### Adding a default value and listening to changes

The `Form` component behaves like a [controlled component](https://facebook.github.io/react/docs/forms.html):

```js
const App = React.createClass({

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

### Accessing fields

You can get access to a field with the `getComponent(path)` API:

```js
const Person = t.struct({
  name: t.String,
  surname: t.String
});

const App = React.createClass({

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

The output of the `Form` component is a `fieldset` tag containing your fields. You can submit the form by wrapping the output with a `form` tag:

```js
const App = React.createClass({

  onSubmit(evt) {
    const value = this.refs.form.getValue();
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

### Customised error messages

See [Error messages](#error-messages) section.

# Types

Models are defined with [tcomb](https://github.com/gcanti/tcomb). tcomb is a library for Node.js and the browser which allows you to check the types of JavaScript values at runtime with a simple syntax. It's great for Domain Driven Design, for testing, and for adding safety to your internal code.

## Required field

By default fields are required:

```js
const Person = t.struct({
  name: t.String,    // a required string
  surname: t.String  // a required string
});
```

## Optional field

In order to create an optional field, wrap the field type with the `t.maybe` combinator:

```js
const Person = t.struct({
  name: t.String,
  surname: t.String,
  email: t.maybe(t.String) // an optional string
});
```

The suffix `" (optional)"` is automatically added to optional fields.

You can customise the suffix value, or set a suffix for required fields (see the "Internationalization" section).

## Numbers

In order to create a numeric field, use the `t.Number` type:

```js
const Person = t.struct({
  name: t.String,
  surname: t.String,
  email: t.maybe(t.String),
  age: t.Number // a numeric field
});
```

tcomb-form will automatically convert numbers to / from strings.

## Refinements

A *predicate* is a function with the following signature:

```
(x: any) => boolean
```

You can refine a type with the `t.refinement(type, predicate)` combinator:

```js
// a type representing positive numbers
const Positive = t.refinement(t.Number, (n) => n >= 0});

const Person = t.struct({
  name: t.String,
  surname: t.String,
  email: t.maybe(t.String),
  age: Positive
});
```

Refinements allow you to express any custom validation with a simple predicate.

## Booleans

In order to create a boolean field, use the `t.Boolean` type:

```js
const Person = t.struct({
  name: t.String,
  surname: t.String,
  email: t.maybe(t.String),
  age: t.Number,
  rememberMe: t.Boolean // a boolean field
});
```

Booleans are displayed as checkboxes.

## Dates

In order to create a date field, use the `t.Date` type:

```js
const Person = t.struct({
  name: t.String,
  surname: t.String,
  email: t.maybe(t.String),
  age: t.Number,
  rememberMe: t.Boolean,
  birthDate: t.Date // a date field
});
```

## Enums

In order to create an enum field, use the `t.enums` combinator:

```js
const Gender = t.enums({
  M: 'Male',
  F: 'Female'
});

const Person = t.struct({
  name: t.String,
  surname: t.String,
  email: t.maybe(t.String),
  age: t.Number,
  rememberMe: t.Boolean,
  birthDate: t.Date,
  gender: Gender // enum
});
```

By default enums are displayed as selects.

## Lists

You can handle a list with the `t.list` combinator:

```js
const Person = t.struct({
  name: t.String,
  surname: t.String,
  email: t.maybe(t.String),
  age: Positive, // refinement
  rememberMe: t.Boolean,
  birthDate: t.Date,
  gender: Gender,
  tags: t.list(t.String) // a list of strings
});
```

## Nested structures

You can nest lists and structs at an arbitrary level:

```js
const Person = t.struct({
  name: t.String,
  surname: t.String
});

const Persons = t.list(Person);

...

<Form
  ref="form"
  type={Persons}
/>
```

# Rendering options

In order to customise the look and feel, use an `options` prop:

```js
<Form type={Model} options={options} />
```

> **Warning**. tcomb-form uses shouldComponentUpdate aggressively. In order to ensure that tcomb-form detect any change to `type`, `options` or `value` props you have to change references:

Example: disable a field based on another field's value

```js
const Type = t.struct({
  disable: t.Boolean, // if true, name field will be disabled
  name: t.String
});

const options = {
  fields: {
    name: {}
  }
};

const App = React.createClass({

  getInitialState() {
    return {
      options: options,
      value: null
    };
  },

  onSubmit(evt) {
    evt.preventDefault();
    var value = this.refs.form.getValue();
    if (value) {
      console.log(value);
    }
  },

  onChange(value) {
    // tcomb immutability helpers
    // https://github.com/gcanti/tcomb/blob/master/GUIDE.md#updating-immutable-instances
    var options = t.update(this.state.options, {
      fields: {
        name: {
          disabled: {'$set': value.disable}
        }
      }
    });
    this.setState({options: options, value: value});
  },

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <Form ref="form"
          type={Type}
          options={this.state.options}
          value={this.state.value}
          onChange={this.onChange}
        />
        <button className="btn btn-primary">Save</button>
      </form>
    );
  }

});
```

## Struct options

### Automatically generated placeholders

In order to generate default placeholders use the option `auto: 'placeholders'`:

```js
const options = {
  auto: 'placeholders'
};

<Form type={Person} options={options} />
```

Or `auto: 'none'` if you don't want neither labels nor placeholders:

```js
const options = {
  auto: 'none'
};
```

### Fields order

You can sort the fields with the `order` option:

```js
const options = {
  order: ['name', 'surname', 'rememberMe', 'gender', 'age', 'email']
};
```

> **Warning**: Any field that is not in this array will be omitted from the form

### Legend

You can add a fieldset legend with the `legend` option:

```js
const options = {
  // you can use strings or JSX
  legend: <i>My form legend</i>
};
```

### Help message

You can add an help message with the `help` option:

```js
const options = {
  // you can use strings or JSX
  help: <i>My form help</i>
};
```

### Error messages

You can add a custom error message with the `error` option:

```js
const options = {
  error: <i>A custom error message</i> // use strings or JSX
};
```

`error` can also be a function with the following signature:

```
type getValidationErrorMessage = (value, path, context) => ?(string | ReactElement)
```

where

- `value` is the (parsed) current value of the component.
- `path` is the path of the value being validated
- `context` is the value of the `context` prop. Also it contains a reference to the component options.

The value returned by the function will be used as error message.

If you want to show the error message onload, add the `hasError` option:

```js
const options = {
  hasError: true,
  error: <i>A custom error message</i>
};
```

Another (advanced) way to customize the error message is to add a:

```
getValidationErrorMessage(value, path, context) => ?(string | ReactElement)
```

static function to the type, where the arguments are the same as above:

```js
const Age = t.refinement(t.Number, (n) => return n >= 18);

// if you define a getValidationErrorMessage function, it will be called on validation errors
Age.getValidationErrorMessage = (value, path, context) => {
  return 'bad age, locale: ' + context.locale;
};

const Schema = t.struct({
  age: Age
});

const App = React.createClass({

  onSubmit(evt) {
    evt.preventDefault();
    const value = this.refs.form.getValue();
    if (value) {
      console.log(value);
    }
  },

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <t.form.Form
          ref="form"
          type={Schema}
          context={{locale: 'it-IT'}}
        />
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    );
  }

});
```

You can even define `getValidationErrorMessage` on the supertype in order to be DRY:

```js
t.Number.getValidationErrorMessage = (value, path, context) => {
  return 'bad number';
};

Age.getValidationErrorMessage = (value, path, context) => {
  return 'bad age, locale: ' + context.locale;
};
```

### Disabled

You can disable the whole fieldset with the `disabled` option:

```js
const options = {
  disabled: true
};
```

### Fields configuration

You can configure each field with the `fields` option:

```js
const options = {
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

You can customise the look and feel with the `template` option:

```js
const options = {
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

To configure all the items in a list, set the `item` option:

```js
const Colors = t.list(t.String);

const options = {
  item: {
    type: 'color' // HTML5 type attribute
  }
});

<Form type={Colors} options={options} />
```

### Internationalization

You can override the default language (english) with the `i18n` option:

```js
const options = {
  i18n: {
    add: 'Nuovo',               // add button
    down: 'Giù',                // move down button
    optional: ' (opzionale)',   // suffix added to optional fields
    required: '',               // suffix added to required fields
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
const options = {
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
const options = {
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
const options = {
  fields: {
    name: {
      attrs: {
        autoFocus: true,
        placeholder: 'Type your name here',
        onBlur: () => {
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
const options = {
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

You can customise the null option with the `nullOption` option:

```js
const options = {
  fields: {
    gender: {
      nullOption: {value: '', text: 'Choose your gender'}
    }
  }
};
```

You can remove the null option by setting the `nullOption` option to `false`.

> **Warning**: when you set `nullOption = false` you must also set the Form's `value` prop for the select field.

> **Tech note**. A value equal to `nullOption.value` (default `''`) is converted to `null`.

### Options order

You can sort the options with the `order` option:

```js
const options = {
  fields: {
    gender: {
      order: 'asc' // or 'desc'
    }
  }
};
```

### Custom options

You can customise the options with the `options` option:

```js
const options = {
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

An option is an object with the following structure:

```js
{
  value: string,      // required
  text: string,       // required
  disabled: ?boolean  // optional, default = false
}
```

You can also add optgroups:

```js
const Car = t.enums.of('Audi Chrysler Ford Renault Peugeot');

const Select = t.struct({
  car: Car
});

const options = {
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

You can render the select as a radio group by using the `factory` option to override the default:

```js
const options = {
  factory: t.form.Radio
};
```

### Multiple select

You can turn the select into a multiple select by passing a `list` as type and using the `factory` option to override the default:

```js
const Car = t.enums.of('Audi Chrysler Ford Renault Peugeot');

const Select = t.struct({
  car: t.list(Car)
});

const options = {
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

### Fields order

You can sort the fields with the `order` option:

```js
const Type = t.struct({
  date: t.Date
});

const options = {
  fields: {
    date: {
      order: ['D', 'M', 'YY']
    }
  }
};
```

# Customizations

## Templates

To customise the "skin" of tcomb-form you have to write a *template*. A template is simply a function with the following signature:

```
(locals: any) => ReactElement
```

where `locals` is an object contaning the "recipe" for rendering the input, and is built by tcomb-form for you.

For example, this is the recipe for a textbox:

```js
{
  attrs: Object             // should render attributes and events
  config: Object            // custom options, see Template addons section
  context: Any              // a reference to the context prop
  disabled: maybe(Boolean), // should be disabled
  error: maybe(Label),      // should show an error
  hasError: maybe(Boolean), // if true should show an error state
  help: maybe(Label),       // should show a help message
  label: maybe(Label),      // should show a label
  onChange: Function,       // should call this function with the changed value
  path: Array,              // the path of this field with respect to the form root
  type: String,             // should use this as type attribute
  typeInfo: Object          // an object containing info on the current type
  value: Any                // the current value of the textbox
}
```

You can set a custom template using the `template` option:

```js
const Animal = t.enums({
 dog: "Dog",
 cat: "Cat"
});

const Pet = t.struct({
  name: t.String,
  type: Animal
});

const Person = t.struct({
  name: t.String,
  pets: t.list(Pet)
});

const formLayout = (locals) => {
  return (
    <div>
      <p>formLayout</p>
      <div>{locals.inputs.name}</div>
      <div>{locals.inputs.pets}</div>
    </div>
  );
};

const petLayout = (locals) => {
  return (
    <div>
      <p>petLayout</p>
      <div>{locals.inputs.name}</div>
      <div>{locals.inputs.type}</div>
    </div>
  );
};

const options = {
  template: formLayout,
  fields: {
    pets: { // <- pets is a list, you can customise the elements with the `item` option
      item: {
        template: petLayout
      }
    }
  }
};

const value = {
  name: 'myname',
  pets: [
    {name: 'pet1', type: 'dog'},
    {name: 'pet2', type: 'cat'}
  ]
};

const App = React.createClass({

  save() {
    const value = this.refs.form.getValue();
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
```

### Clone default templates

In order to keep the majority of the implementation a template can be cloned. Every template own a series of `render*` function that can be overridden:

```js
const Type = t.struct({
  name: t.String
})

const myTemplate = t.form.Form.templates.textbox.clone({
  // override just the input default implementation (labels, help, error will be preserved)
  renderInput: (locals) => {
    return <input value={locals.value} />
  }
})

const options = {
  fields: {
    name: {
      template: myTemplate
    }
  }
}
```

## Transformers

Say you want a search textbox which accepts a list of keywords separated by spaces:

```js
const Search = t.struct({
  search: t.list(t.String)
});
```

tcomb-form by default will render the `search` field as a list. In order to render a textbox you have to override the default behaviour with the `factory` option:

```js
const options = {
  fields: {
    search: {
      factory: t.form.Textbox
    }
  }
};
```

There is a problem though: a textbox handles only strings, so we need a way to transform a list to a string and a string to a list. A `Transformer` deals with serialization / deserialization of data and has the following interface:

```js
const Transformer = t.struct({
  format: t.Function, // from value to string, it must be idempotent
  parse: t.Function   // from string to value
});
```

**Important**. the `format` function SHOULD BE idempotent.

A basic transformer implementation for the search textbox:

```js
const listTransformer = {
  format: (value) => {
    return Array.isArray(value) ? value.join(' ') : value;
  },
  parse: (str) => {
    return str ? str.split(' ') : [];
  }
};
```

Now you can handle lists using the transformer option:

```js
// example of initial value
const value = {
  search: ['climbing', 'yosemite']
};

const options = {
  fields: {
    search: {
      factory: t.form.Textbox,
      transformer: listTransformer,
      help: 'Keywords are separated by spaces'
    }
  }
};
```

## Custom factories

The easisiest way to define a custom factory is to extend `t.form.Component` and define the `getTemplate` method:

```js
//
// a custom factory representing a tags input
//

import React from 'react';
import t from 'tcomb-form';
import TagsInput from 'react-tagsinput'; // I'm using this but you can build your own (and reusable!) tagsinput

class TagsComponent extends t.form.Component { // extend the base class

  getTemplate() {
    return (locals) => {
      return (
        <TagsInput value={locals.value} onChange={locals.onChange} />
      );
    };
  }

}

export default TagsComponent;
```

Usage

```js
const Type = t.struct({
  tags: t.list(t.String)
});

const options = {
  fields: {
    tags: {
      factory: TagsComponent
    }
  }
};

const value = {
  tags: [] // react-tagsinput requires an initial value
}
...

<t.form.Form
  ref="form"
  type={Type}
  options={options}
  value={value}
/>
```

## getTcombFormFactory

If a type owns a `getTcombFormFactory(options)` static function, it will be used to retrieve the suitable factory

**Example**

```js
// instead of
const Country = t.enums.of(['IT', 'US'], 'Country');

const Type = t.struct({
  country: Country
});

const options = {
  fields: {
    country: {
      factory: t.form.Radio
    }
  }
};

// you can write
const Country = t.enums.of(['IT', 'US'], 'Country');

Country.getTcombFormFactory = (/*options*/) => {
  return t.form.Radio;
};

const Type = t.struct({
  country: Country
});

const options = {};
```

# Bootstrap extras

## Textbox

### Addons

You can set an addon before or an addon after with the `config.addonBefore` and `config.addonAfter` options:

```js
const Textbox = t.struct({
  mytext: t.String
});

const options = {
  fields: {
    mytext: {
      config: {
        // you can use strings or JSX
        addonBefore: <i>before</i>,
        addonAfter: <i>after</i>
      }
    }
  }
};

<Form type={Textbox} options={options} />
```

You can set a button after (before) with the `config.buttonAfter` (`config.buttonBefore`) option:

```js
const options = {
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
const Textbox = t.struct({
  mytext: t.String
});

const options = {
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
const Person = t.struct({
  name: t.String,
  notifyMe: t.Boolean,
  email: t.maybe(t.String)
});

const options = {
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

- English as language
- Bootstrap as theme ([tcomb-form-templates-bootstrap](https://github.com/gcanti/tcomb-form-templates-bootstrap))

## Changing the default language

```js
import t from 'tcomb-form/lib'; // load tcomb-form without templates and i18n
import templates from 'tcomb-form-templates-bootstrap';

t.form.Form.templates = templates;
t.form.Form.i18n = {
  optional: ' (opzionale)',
  required: '',
  add: 'Nuovo',
  remove: 'Elimina',
  up: 'Su',
  down: 'Giù'
};
```

## Changing the default skin

```js
import t from 'tcomb-form/lib'; // load tcomb-form without templates and i18n
import en from 'tcomb-form/lib/i18n/en';
import semantic from 'tcomb-form-templates-semantic';

t.form.Form.i18n = en;
t.form.Form.templates = semantic;
```

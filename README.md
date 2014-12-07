> "La semplicità è l'ultima sofisticazione" (Leonardo da Vinci)

# Domain Driven Forms

The [tcomb library](https://github.com/gcanti/tcomb) provides a concise but expressive way to define domain models in javascript.

The [tcomb-validation library](https://github.com/gcanti/tcomb-validation) builds on tcomb, providing validation functions for tcomb domain models.

This library builds on those two and realizes an old dream of mine.

![tcomb-form diagram](https://gcanti.github.io/resources/tcomb-form/tcomb-form-diagram.png)

# Playground

[Live Demo!](http://gcanti.github.io/resources/tcomb-form/playground/playground.html)

If you want to see this library in action, the playground contains a dozen examples and the code section is fully editable with live updates in the preview and HTML views.

# Benefits

With tcomb-form you simply call `var Form = t.form.create(domainModel)` to generate a form based on that domain model. What does this get you?

1. Write a lot less HTML
2. Usability and accessibility for free (automatic labels, inline validation, etc)
3. No need to update forms when domain model changes

# Flexibility

- tcomb-forms lets you override automatic features or add additional information to forms.
- You often don't want to use your domain model directly for a form. You can easily create a form specific model with tcomb that captures the details of a particular feature, and then define a function that uses that model to process the main domain model.

# Stable release

This library is under heavy development.
The current stable release is on [branch v0.2](https://github.com/gcanti/tcomb-form/tree/v0.2)

# Roadmap to v0.3.0

- [] enanche Context providing util methods to hwlp writing new inputs
- [] custom input
- [] for attribute for labels
- [] aria support
- [] playground
- styles
  - [] foundation
  - [] pure
  - [] ionic
  - [] [flakes](http://getflakes.com/index.html)
- [x] horizontal forms
- [x] return null if validation failed (but provide a `raw` option to return `ValidationResult`)
- textbox (Str, Num)
  - [x] label as ReactElement
  - [x] help as ReactElement
  - [x] optional label
  - [x] optional placeholder
  - [x] addonBefore
  - [x] addonAfter
  - [x] handle conversion for numbers
  - [x] error message
- checkbox (Bool)
  - [x] label as ReactElement
  - [x] help as ReactElement
  - [x] optional label
  - [x] error message
- select (enums)
  - [x] label as ReactElement
  - [x] help as ReactElement
  - [x] optional label
  - [x] multiple
  - [x] error message
  - [x] opt group
  - [x] custom options
- radio
  - [x] label as ReactElement
  - [x] help as ReactElement
  - [x] renderAs: 'radio'
  - [x] optional label
  - [x] error message
- struct
  - [x] auto labels, none
  - [x] label as ReactElement
  - [x] help as ReactElement
  - [x] subtype
  - [x] error message
  - [x] interleave in `order` option verbatim (ReactElements)
- list
  - [x] label as ReactElement
  - [x] help as ReactElement
  - [x] subtype
  - [x] error message


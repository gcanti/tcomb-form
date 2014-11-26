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

With tcomb-form you simply call `var Form = t.form.createForm(domainModel)` to generate a form based on that domain model. What does this get you?

1. Write a lot less HTML
2. Usability and accessibility for free (automatic labels, inline validation, etc)
3. No need to update forms when domain model changes

# Flexibility

- tcomb-forms lets you override automatic features or add additional information to forms.
- You often don't want to use your domain model directly for a form. You can easily create a form specific model with tcomb that captures the details of a particular feature, and then define a function that uses that model to process the main domain model.

# Contributions

Special thanks to [William Lubelski](https://github.com/lubelski) ([@uiwill](https://twitter.com/uiwill)), without him this library would be less magic.

Thanks to [Esa-Matti Suuronen](https://github.com/epeli) for the excellent `humanize()` function.

# Example

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

# Dependencies

- tcomb-validation.js
- React.js

# Api

[API.md](API.md)

- [createForm](API.md#createform)
- [createList](API.md#createlist)
- [textbox](API.md#textbox)
- [select](API.md#select)
- [radio](API.md#radio)
- [checkbox](API.md#checkbox)
- [Custom inputs](API.md#custom-inputs)

# Tests

Run `mocha` on the project root, rendering tests made possible thanks to [react-vdom](https://github.com/gcanti/react-vdom).

# License

MIT

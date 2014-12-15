'use strict';

var React = require('react');
var t = require('.');

// helper function
function render(i, type, opts) {

  var node = document.getElementById('p' + i);
  var Form = t.form.create(type, opts);

  var App  = React.createClass({

    onClick: function () {
      var value = this.refs.form.getValue();
      if (value) {
        document.getElementById('v' + i).style.display = 'block';
        document.getElementById('v' + i).innerHTML = JSON.stringify(value, null, 2);
      }
    },

    render: function () {
      return (
        React.DOM.div(null,
          React.createFactory(Form)({ref: 'form'}),
          React.DOM.button({
            onClick: this.onClick,
            className: 'btn btn-primary'
          }, 'Click me')
        )
      );
    }

  });

  React.render(React.createFactory(App)(), node);
}

var Person1 = t.struct({
  name: t.Str,
  surname: t.Str
});

render('1', Person1, {
  help: 'Placeholders are automatically added'
});

var Person2 = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str) // an optional string
});

render('2', Person2, {
  help: 'The postfix `optional` is automatically added'
});

var Person3 = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str),
  age: t.Num // a numeric field
});

render('3', Person3, {
  help: 'tcomb-form automatically converts numbers to / from strings'
});

var Person4 = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str),
  age: t.Num,
  rememberMe: t.Bool // a boolean field
});

render('4', Person4, {
  help: 'Booleans are displayed as checkboxes'
});

var Gender = t.enums({
  M: 'Male',
  F: 'Female'
});

var Person5 = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str),
  age: t.Num,
  rememberMe: t.Bool,
  gender: Gender
});

render('5', Person5, {
  help: 'Enums are displayed as selects',
  fields: {
    gender: {
      help: 'tcomb-form adds automatically a `null option` in first position'
    }
  }
});

var Positive = t.subtype(t.Num, function (n) {
  return n >= 0;
});

var Person6 = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str),
  age: Positive, // refinement
  rememberMe: t.Bool,
  gender: Gender
});

render('6', Person6, {
  help: 'Subtypes allow you to express any custom validation with a simple predicate'
});

var Person7 = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str),
  age: Positive, // refine with positive numbers
  rememberMe: t.Bool,
  gender: Gender
});

var Tags = t.list(t.Str);

render('7', Tags, {
  help: 'Click Add to add an item. Once created, items can be re-arranged with the buttons to the right'
});

var Person8 = t.struct({
  name: t.Str,
  surname: t.Str
});

var Persons = t.list(Person8);

render('8', Persons, {
  item: {
    label: ''
  }
});

render('9', Person7, {
  auto: 'labels'
});

render('10', Person7, {
  order: ['name', 'surname', 'rememberMe', 'gender', 'age', 'email']
});

render('11', Person7, {
  value: {
    name: 'Giulio',
    surname: 'Canti',
    age: 41,
    gender: 'M'
  }
});

var Palette = t.struct({
  paletteName: t.Str,
  colors: t.list(t.Str)
});

render('100', Palette, {
  fields: {
    colors: {
      item: {
        type: 'color'
      }
    }
  }
});





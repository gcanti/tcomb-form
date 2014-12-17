'use strict';

var React = require('react');
var t = require('../../.');

// helper function
function render(i, type, opts) {

  var formPreview = document.getElementById('p' + i);
  var Form = t.form.create(type, opts);

  var App  = React.createClass({

    onClick: function () {
      var value = this.refs.form.getValue();
      if (value) {
        var valuePreview = document.getElementById('v' + i)
        valuePreview.style.display = 'block';
        valuePreview.innerHTML = JSON.stringify(value, null, 2);
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

  React.render(React.createFactory(App)(), formPreview);
}

// ===============================================

var Person1 = t.struct({
  name: t.Str,
  surname: t.Str
});

render('1', Person1);

// ===============================================

var Person2 = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str) // an optional string
});

render('2', Person2);

// ===============================================

var Person3 = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str),
  age: t.Num // a numeric field
});

render('3', Person3);

// ===============================================

var Person4 = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str),
  age: t.Num,
  rememberMe: t.Bool // a boolean field
});

render('4', Person4);

// ===============================================

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
  fields: {
    gender: {
      help: 'tcomb-form adds a `null option` in first position'
    }
  }
});

// ===============================================

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

render('6', Person6);

// ===============================================

var Tags = t.list(t.Str);

render('7', Tags);

// ===============================================

var Person8 = t.struct({
  name: t.Str,
  surname: t.Str
});

var Persons = t.list(Person8);

render('8', Persons);

// ===============================================

render('9', Person6, {
  auto: 'labels'
});

// ===============================================

render('10', Person6, {
  order: ['name', 'surname', 'rememberMe', 'gender', 'age', 'email']
});

// ===============================================

render('11', Person6, {
  value: {
    name: 'Giulio',
    surname: 'Canti',
    age: 41,
    gender: 'M'
  }
});

// ===============================================

render('12', Person1, {
  label: React.DOM.i(null, 'My form legend')
});

// ===============================================

render('13', Person1, {
  help: React.DOM.i(null, 'My form help')
});

// ===============================================

render('14', Person1, {
  hasError: true,
  error: React.DOM.i(null, 'A custom error message')
});

// ===============================================

render('15', Person1, {
  disabled: true
});

// ===============================================

var Colors = t.list(t.Str);

render('16', Colors, {
  item: {
    type: 'color'
  }
});

// ===============================================

render('17', Colors, {
  i18n: {
    add: 'Nuovo',               // add button for lists
    down: 'Giù',                // move down button for lists
    optional: ' (opzionale)',   // suffix added to optional fields
    remove: 'Elimina',          // remove button for lists
    up: 'Su'                    // move up button for lists
  },
  item: {
    type: 'color'
  }
});

// ===============================================

render('18', Colors, {
  disableOrder: true,
  item: {
    type: 'color'
  }
});

// ===============================================

var Textbox = t.struct({
  mytext: t.Str
});

render('19', Textbox, {
  fields: {
    mytext: {
      type: 'password'
    }
  }
});

render('20', Textbox, {
  fields: {
    mytext: {
      type: 'textarea'
    }
  }
});

// ===============================================

render('21', Textbox, {
  fields: {
    mytext: {
      placeholder: 'Type your text here'
    }
  }
});

// ===============================================

render('22', Textbox, {
  fields: {
    mytext: {
      label: React.DOM.i(null, 'My label')
    }
  }
});

// ===============================================

render('23', Textbox, {
  fields: {
    mytext: {
      help: React.DOM.i(null, 'My help')
    }
  }
});

// ===============================================

render('24', Textbox, {
  fields: {
    mytext: {
      disabled: true
    }
  }
});


// ===============================================

render('25', Textbox, {
  fields: {
    mytext: {
      hasError: true,
      error: React.DOM.i(null, 'A custom error message')
    }
  }
});

// ===============================================

var Checkbox = t.struct({
  rememberMe: t.Bool
});

render('26', Checkbox, {
  fields: {
    rememberMe: {
      label: React.DOM.i(null, 'My label'),
      help: React.DOM.i(null, 'My help')
    }
  }
});

// ===============================================

var Select = t.struct({
  gender: Gender
});

render('27', Select, {
  fields: {
    gender: {
      label: React.DOM.i(null, 'My label'),
      help: React.DOM.i(null, 'My help')
    }
  }
});

// ===============================================

render('28', Select, {
  fields: {
    gender: {
      nullOption: {value: '', text: 'Choose your gender'}
    }
  }
});

// ===============================================

render('29', Select, {
  fields: {
    gender: {
      order: 'asc'
    }
  }
});

// ===============================================

render('30', Select, {
  fields: {
    gender: {
      options: [
        {value: 'M', text: 'Maschio'},
        {value: 'F', text: 'Femmina', disabled: true} // use `disabled: true` to disable an option
      ]
    }
  }
});

// ===============================================

var Car = t.enums.of('Audi Chrysler Ford Renault Peugeot');

var Select2 = t.struct({
  car: Car
});

render('31', Select2, {
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
});

// ===============================================

render('32', Select, {
  fields: {
    gender: {
      factory: t.form.radio
    }
  }
});

// ===============================================

render('33', t.list(Car), {
  factory: t.form.select
});

// ===============================================

var themeSelector = document.getElementById('themeSelector');
var theme = document.getElementById('theme');
themeSelector.onchange = function () {
  theme.href = themeSelector.value;
};




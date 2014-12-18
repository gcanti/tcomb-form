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

var cx = require('react/lib/cx');

function search(locals) {

  var formGroupClasses = {
    'form-group': true,
    'has-feedback': true, // required for the icon
    'has-error': locals.hasError // add 'has-error' class if tcomb-form says there is an error
  };

  var config = locals.config || {};
  var style = {
    borderRadius: '20px',
    color: config.color,
    backgroundColor: config.backgroundColor
  };

  return (
    <div className={cx(formGroupClasses)}>

      {/* add a label if specified */}
      {locals.label ? <label className="control-label">{locals.label}</label> : null}

      <input
        disabled={locals.disabled}
        className="form-control"
        name={locals.name}
        placeholder={locals.placeholder}
        onChange={locals.onChange}
        style={style}
        type={locals.type}
        value={locals.value}/>
      {/* add a search icon */}
      <span className="glyphicon glyphicon-search form-control-feedback"></span>

      {/* add an error if specified */}
      {locals.error ? <span className="help-block error-block">{locals.error}</span> : null}

      {/* add an help if specified */}
      {locals.help ? <span className="help-block">{locals.help}</span> : null}

    </div>
  );
}

var Search = t.struct({
  search: t.Str
});

render('34', Search, {
  templates: {
    textbox: search
  }
});

// ===============================================

render('35', Search, {
  templates: {
    textbox: search
  },
  fields: {
    search: {
      // custom configuration
      config: {
        color: '#FFA000',
        backgroundColor: '#FFECB3'
      }
    }
  }
});

// ===============================================

var Search2 = t.struct({
  search: t.list(t.Str)
});

render('36', Search2, {
});

// ===============================================

var listTransformer = {
  format: function (value) {
    return value ? value.join(' ') : null;
  },
  parse: function (value) {
    return value ? value.split(' ') : [];
  }
};

render('37', Search2, {
  templates: {
    textbox: search
  },
  fields: {
    search: {
      factory: t.form.textbox,
      transformer: listTransformer,
      help: 'Keywords are separated by spaces'
    }
  },
  value: {
    search: ['climbing', 'yosemite']
  }
});

// ===============================================

function searchFactory(opts, ctx) {

  opts = opts || {};

  // handling label
  var label = opts.label;
  if (!label && ctx.auto === 'labels') {
    // if labels are auto generated, get the default label
    label = ctx.getDefaultLabel();
  }

  // handling placeholder
  var placeholder = null;
  // labels have higher priority
  if (!label && ctx.auto !== 'none') {
    placeholder = !t.Nil.is(opts.placeholder) ? opts.placeholder : ctx.getDefaultLabel();
  }

  // handling name attribute
  var name = opts.name || ctx.getDefaultName();

  // handling value
  var value = !t.Nil.is(opts.value) ? opts.value : !t.Nil.is(ctx.value) ? ctx.value : null;

  //
  // return a ReactClass
  //

  return React.createClass({

    getInitialState: function () {
      return {
        hasError: !!opts.hasError,
        value: value
      };
    },

    onChange: function (evt) {
      var value = evt.target.value || null;

      // handling transformation
      value = listTransformer.parse(value);

      // notify the parent components that there is a change
      if (this.props.onChange) {
        this.props.onChange(value);
      }

      // re-render
      this.setState({value: value});
    },

    getValue: function () {

      // ctx.report.type contains the type specified in the api call
      var result = t.validate(this.state.value, ctx.report.type);
      this.setState({
        hasError: !result.isValid(),
        value: result.value
      });

      // return a ResultValidation instance
      return result;
    },

    render: function () {

      // handling transformation
      var value = listTransformer.format(this.state.value);

      // handling errors
      var error = opts.error;
      if (this.state.hasError) {
        // show the error message only if there is an error
        error = t.Func.is(error) ? error(this.state.value) : error
      }

      return search({
        config: opts.config,
        disabled: opts.disabled,
        error: error,
        hasError: this.state.hasError,
        help: opts.help,
        label: label,
        name: name,
        onChange: this.onChange,
        placeholder: placeholder,
        type: 'search',
        value: value
      });

    }
  });

}

render('38', Search2, {
  fields: {
    search: {
      factory: searchFactory
    }
  },
  value: {
    search: ['climbing', 'yosemite']
  }
});

// ===============================================

// if notifyMe === true then email is required
var structPredicate = function (person) {
  return person.notifyMe === false || (!t.Nil.is(person.email));
};

var Person7 = t.subtype(t.struct({
  name: t.Str,
  notifyMe: t.Bool,
  email: t.maybe(t.Str)
}), structPredicate);

render('39', Person7, {
  error: 'Insert your email if you want to be notified'
});

// ===============================================

// at least two tags
var listPredicate = function (tags) {
  return tags.length >= 2;
};

var Tags2 = t.subtype(t.list(t.Str), listPredicate);

render('40', Tags2, {
  error: 'Insert at least two tags'
});

// ===============================================

var themeSelector = document.getElementById('themeSelector');
var theme = document.getElementById('theme');
themeSelector.onchange = function () {
  theme.href = themeSelector.value;
};




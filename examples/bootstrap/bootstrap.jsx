var React = require('react');
var t = require('../../.');

var Country = t.enums({
  IT: 'Italy',
  US: 'United States'
}, 'Country');

var Gender = t.enums({
  M: 'Male',
  F: 'Female'
}, 'Gender');

var Registration = t.struct({
  username: t.Str,
  password: t.Str,
  name: t.maybe(t.Str),
  surname: t.maybe(t.Str),
  rememberMe: t.Bool,
  age: t.Num,
  country: t.maybe(Country),
  gender: t.maybe(Gender),
  tags: t.list(t.Str)
}, 'Registration');

var Form = t.form.create(Registration, {
  label: 'Registration',
  //auto: 'labels',
  fields: {
    password: {
      type: 'password'
    },
    country: {
      //nullOption: {value: '', text: 'Choose your country'}
    },
    gender: {
      factory: t.form.radio
    }
  }
});

// rendering
var App = React.createClass({

  onClick: function(evt) {
    evt.preventDefault();
    var values = this.refs.form.getValue();
    if (values) {
      document.getElementById('value').innerHTML = JSON.stringify(values, null, 2);
    }
  },

  render: function() {
    return (
      <form onSubmit={this.onClick} className="grid-form">
        <Form ref="form" />
        <div className="form-group">
          <input type="submit" className="btn btn-primary" value="Save" />
        </div>
      </form>
    );
  }
});

React.render(<App />, document.getElementById('app'));

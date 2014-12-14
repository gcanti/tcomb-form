'use strict';

var React = require('react');
var t = require('../../.');

var Data1 = t.struct({
  firstName: t.Str,
  lastName: t.Str,
  email: t.maybe(t.Str)
});

var Form1 = t.form.create(Data1, {
});

var Example1 = React.createClass({

  onClick: function(evt) {
    evt.preventDefault();
    var values = this.refs.form.getValue();
    if (values) {
      document.getElementById('value1').style.display = 'block';
      document.getElementById('value1').innerHTML = JSON.stringify(values, null, 2);
    }
  },

  render: function() {
    return (
      <form onSubmit={this.onClick} className="grid-form">
        <Form1 ref="form" />
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Submit" />
        </div>
      </form>
    );
  }
});

React.render(<Example1 />, document.getElementById('example1'));

// ==================================

var Booking = t.enums.of('Hotel B&B');
var Location = t.enums.of('London Milan');
var Currency = t.enums({
  USD: '$ USD',
  EUR: '€ EUR'
});

var Data2 = t.struct({
  booking: Booking,
  arrivalDate: t.Str,
  departureDate: t.Str,
  flexible: t.Bool,
  location: Location,
  currency: Currency,
  budget: t.Num,
  adults: t.Num,
  children: t.maybe(t.Num),
  toddlers: t.maybe(t.Num),
  babies: t.maybe(t.Num),
  message: t.maybe(t.Str)
});

var Form2 = t.form.create(Data2, {
  auto: 'labels',
  label: <h2>How can we help?</h2>,
  fields: {
    booking: {
      label: '',
      nullOption: {value: '', text: 'I\'m interested in booking'}
    },
    flexible: { label: 'My dates are flexible' },
    location: { label: 'One fine stay location' },
    currency: { label: '' },
    budget: { label: '', placeholder: '' },
    children: { help: 'Age 4-12' },
    toddlers: { help: 'Age 1-3' },
    babies: { help: 'Under 1' },
    message: { type: 'textarea' }
  },
  templates: {
    struct: function (locals) {
      return (
        <div>
          <div className="col-xs-12">
            {locals.label}
          </div>
          <div className="col-xs-12">
            {locals.inputs.booking}
          </div>
          <div className="col-xs-6">
            {locals.inputs.arrivalDate}
          </div>
          <div className="col-xs-6">
            {locals.inputs.departureDate}
          </div>
          <div className="col-xs-12">
            {locals.inputs.flexible}
          </div>
          <div className="col-sm-6">
            {locals.inputs.location}
          </div>
          <div className="col-sm-6">
            <label>Approximate budget (per night)</label>
            <div className="row">
              <div className="col-xs-6 col-sm-3">
                {locals.inputs.currency}
              </div>
              <div className="col-xs-6 col-sm-9">
                {locals.inputs.budget}
              </div>
            </div>
          </div>
          <div className="col-xs-3">
            {locals.inputs.adults}
          </div>
          <div className="col-xs-3">
            {locals.inputs.children}
          </div>
          <div className="col-xs-3">
            {locals.inputs.toddlers}
          </div>
          <div className="col-xs-3">
            {locals.inputs.babies}
          </div>
          <div className="col-xs-12">
            {locals.inputs.message}
          </div>
        </div>
      )
    }
  }
});

var Example2 = React.createClass({

  onClick: function(evt) {
    evt.preventDefault();
    var values = this.refs.form.getValue();
    if (values) {
      document.getElementById('value2').style.display = 'block';
      document.getElementById('value2').innerHTML = JSON.stringify(values, null, 2);
    }
  },

  render: function() {
    return (
      <form onSubmit={this.onClick} className="grid-form">
        <Form2 ref="form" />
        <div className="col-xs-12">
          <input className="btn btn-primary" type="submit" value="Submit" />
        </div>
      </form>
    );
  }
});

React.render(<Example2 />, document.getElementById('example2'));

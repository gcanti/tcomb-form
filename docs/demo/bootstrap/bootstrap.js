'use strict';

var React = require('react');
var t = require('.');

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

var Gender = t.enums({
  M: 'Male',
  F: 'Female'
});

var Country = t.enums({
  US: 'United States',
  IT: 'Italy'
});

var Person = t.struct({
  fullName: t.Str,
  nickname: t.maybe(t.Str),
  gender: Gender,
  country: Country,
  tags: t.list(t.Str)
});

render('1', Person, {
  auto: 'labels',
  fields: {
    gender: {
      factory: t.form.radio
    }
  }
});

// ===============================================

var Target = t.enums.of('Hotel B&B');

var Location = t.enums.of('London Milan');

var Currency = t.enums({
  USD: '$ USD',
  EUR: '€ EUR'
});

var Booking = t.struct({
  booking: Target,
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

render('2', Booking, {
  auto: 'labels',
  label: React.createElement("h2", null, "How can we help?"),
  fields: {
    booking: { label: '' },
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
    struct: mylayout
  },
});

function mylayout(locals) {
  return (
    React.createElement("fieldset", null,
      React.createElement("legend", null, locals.label),
      React.createElement("div", {className: "row"},
        React.createElement("div", {className: "col-xs-12"},
          locals.inputs.booking
        )
      ),
      React.createElement("div", {className: "row"},
        React.createElement("div", {className: "col-xs-6"},
          locals.inputs.arrivalDate
        ),
        React.createElement("div", {className: "col-xs-6"},
          locals.inputs.departureDate
        )
      ),
      React.createElement("div", {className: "row"},
        React.createElement("div", {className: "col-xs-12"},
          locals.inputs.flexible
        )
      ),
      React.createElement("div", {className: "row"},
        React.createElement("div", {className: "col-sm-6"},
          locals.inputs.location
        ),
        React.createElement("div", {className: "col-sm-6"},
          React.createElement("label", null, "Approximate budget (per night)"),
          React.createElement("div", {className: "row"},
            React.createElement("div", {className: "col-xs-6 col-sm-3"},
              locals.inputs.currency
            ),
            React.createElement("div", {className: "col-xs-6 col-sm-9"},
              locals.inputs.budget
            )
          )
        )
      ),
      React.createElement("div", {className: "row"},
        React.createElement("div", {className: "col-xs-3"},
          locals.inputs.adults
        ),
        React.createElement("div", {className: "col-xs-3"},
          locals.inputs.children
        ),
        React.createElement("div", {className: "col-xs-3"},
          locals.inputs.toddlers
        ),
        React.createElement("div", {className: "col-xs-3"},
          locals.inputs.babies
        )
      ),
      React.createElement("div", {className: "row"},
        React.createElement("div", {className: "col-xs-12"},
          locals.inputs.message
        )
      )
    )
  );
}

// ===============================================

var themeSelector = document.getElementById('themeSelector');
var theme = document.getElementById('theme');
themeSelector.onchange = function () {
  theme.href = themeSelector.value;
};


'use strict';

var React = require('react');
var t = require('../../../.');

// configure ionic plugin
t.form.config.templates = require('../../../lib/skins/ionic');

var Account = t.struct({
  firstName: t.Str,
  lastName: t.Str,
  email: t.maybe(t.Str)
});

var Form = t.form.Form;

var options = {
  auto: 'labels'
};

var App = React.createClass({displayName: 'App',

  onClick: function(evt) {
    evt.preventDefault();
    var value = this.refs.form.getValue();
    if (value) {
      document.getElementById('value').style.display = 'block';
      document.getElementById('value').innerHTML = JSON.stringify(value, null, 2);
    }
  },

  render: function() {
    return (
      React.createElement("div", null,
        React.createElement("div", {className: "bar bar-header"},
          React.createElement("h1", {className: "title"}, "Sign up")
        ),
        React.createElement("div", {className: "content has-header"},
          React.createFactory(Form)({
            ref: 'form',
            type: Account,
            options: options
          }),
          React.createElement("div", {className: "padding"},
            React.createElement("button", {onClick: this.onClick, className: "button button-block button-positive"}, "Create Account")
          )
        )
      )
    );
  }
});

React.render(React.createElement(App, null), document.getElementById('preview'));

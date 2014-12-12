var React = require('react');
var t = require('../../lib');

// configure ionic plugin
t.form.config.templates = require('../../lib/templates/ionic');

var Data = t.struct({
  firstName: t.Str,
  lastName: t.Str,
  email: t.maybe(t.Str)
});

var Form = t.form.create(Data, {
  auto: 'labels'
});

var App = React.createClass({

  onClick: function(evt) {
    evt.preventDefault();
    var value = this.refs.form.getValue();
    if (value) {
      document.getElementById('value').innerHTML = JSON.stringify(value, null, 2);
    }
  },

  render: function() {
    return (
      <div>
        <div className="bar bar-header">
          <h1 className="title">Sign up</h1>
        </div>
        <div className="content has-header">
          <Form ref="form" />
          <div className="padding">
            <button onClick={this.onClick} className="button button-block button-positive">Create Account</button>
          </div>
        </div>
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
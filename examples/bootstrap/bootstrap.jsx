'use strict';

var React = require('react');
var t = require('../../.');

var pre = document.getElementById('value');

var Data = t.struct({
  firstName: t.Str,
  lastName: t.Str,
  email: t.maybe(t.Str)
});

var Form = t.form.create(Data, {
});

var App = React.createClass({

  onClick: function(evt) {
    evt.preventDefault();
    var values = this.refs.form.getValue();
    if (values) {
      pre.style.display = 'block';
      pre.innerHTML = JSON.stringify(values, null, 2);
    }
  },

  render: function() {
    return (
      <form onSubmit={this.onClick} className="grid-form">
        <Form ref="form" />
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Submit" />
        </div>
      </form>
    );
  }
});

React.render(<App />, document.getElementById('app'));

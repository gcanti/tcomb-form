'use strict';

var React = require('react');
var t = require('../../.');

var pre = document.getElementById('value');

var Data = t.struct({
  name: t.Str
});

// React form component
var Form = t.form.create(Data, {
});

// rendering
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
          <input className="btn btn-primary" type="submit" value="Save" />
        </div>
      </form>
    );
  }
});

React.render(<App />, document.getElementById('app'));

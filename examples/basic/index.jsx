var React = require('react');
var t = require('../../index');

// define a type
var Person = t.struct({
  name: t.Str,
  surname: t.Str
});

// create the form
var Form = t.form.create(Person);

// use the form in your component
var App = React.createClass({
  onClick: function (evt) {
    evt.preventDefault();
    var value = this.refs.form.getValue();
    if (value) {
      console.log(value);
    }
  },
  render: function () {
    return (
      <form>
        <Form ref="form"/>
        <button className="btn btn-primary" onClick={this.onClick}>Click me</button>
      </form>
    );
  }
});

var node = document.getElementById('app');
React.render(<App />, node);
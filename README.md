% tcomb-form

Form generation and validation based on types combinators.

```js
var React = require('react');
var t = require('tcomb-react');
var tf = require('../index');
var Result = t.validate.Result;

var Username = new tf.Textbox(t.Str);

var App = React.createClass({
  onClick: function () {
    var value = this.refs.username.getValue();
    if (Result.is(value)) {
      this.refs.username.setError();
    } else {
      console.log(this.refs.username.getValue());
    }
  },
  render: function () {
    return (
      <form>
        <Username ref="username"/>
        <button onClick={this.onClick}>Click me</button>
      </form>
    );    
  }
});

React.renderComponent(<App/>, document.getElementById('app'));
```

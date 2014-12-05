'use strict';

var React = require('react');
var api = require('./protocols/api');
var getFactory = require('./react').getFactory;

module.exports = create;

var defaultBundle = new api.Bundle({
  optional: ' (optional)',
  add: 'Add',
  remove: 'Remove',
  up: 'Up',
  down: 'Down'
});

var defaultContext = new api.Context({
  auto: 'placeholders',
  path: [],
  defaultLabel: '',
  bundle: defaultBundle
});

function create(type, opts) {

  opts = opts || {};
  var factory = getFactory(type, opts);
  var Component = factory(type, opts, defaultContext);

  var Root = React.createClass({

    // the public api returns `null` if validation failed
    // unless the optional boolean argument `raw` is set to `true`
    getValue: function (raw) {

      var result = this.refs.input.getValue();

      if (raw === true) { return result; }
      if (result.isValid()) { return result.value; }
      return null;
    },

    render: function () {
      return <Component ref="input"/>;
    }
  });

  return Root;
}

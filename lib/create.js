'use strict';

var React = require('react');
var t = require('tcomb-validation');
var api = require('./protocols/api');
var getFactory = require('./react').getFactory;

module.exports = create;

var defaultI18n = new api.I18n({
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
  i18n: defaultI18n
});

function create(type, opts) {

  type = t.Type(type);
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

'use strict';

var React = require('react');
var api = require('./protocols/api');
var config = require('./config');
var getFactory = require('./react').getFactory;

module.exports = create;

function create(type, opts) {

  var defaultContext = new api.Context({
    report: api.Context.getReport(type),
    auto: 'placeholders',
    path: [],
    defaultLabel: '',
    i18n: new api.I18n(config.defaultI18n)
  });

  var factory = getFactory(type, opts);
  var Component = factory(opts, defaultContext);

  var Root = React.createClass({

    // the public api returns `null` if validation failed
    // unless the optional boolean argument `raw` is set to `true`
    getValue: function (raw) {

      var result = this.refs.root.getValue();

      if (raw === true) { return result; }
      if (result.isValid()) { return result.value; }
      return null;
    },

    render: function () {
      return React.createElement(Component, {ref: 'root'});
    }
  });

  return Root;
}

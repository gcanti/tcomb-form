'use strict';

var React = require('react');
var Context = require('./protocols/api').Context;
var config = require('./config');
var getFactory = require('./factories').getFactory;

module.exports = create;

function create(type, opts) {

  var factory = getFactory(type, opts);

  var Form = React.createClass({

    // the public api returns `null` if validation failed
    // unless the optional boolean argument `raw` is set to `true`
    getValue: function (raw) {

      var result = this.refs.input.getValue();

      if (raw === true) { return result; }
      if (result.isValid()) { return result.value; }
      return null;
    },

    render: function () {

      var defaultContext = new Context({
        templates: config.templates,
        i18n: config.i18n,
        report: Context.getReport(type),
        path: [],
        auto: 'placeholders',
        label: '',
        value: this.props.value
      });
      var Component = factory(opts, defaultContext);

      return React.createElement(Component, {ref: 'input'});
    }
  });

  return Form;
}

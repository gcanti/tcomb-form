'use strict';

var React = require('react');
var getComponent = require('../getComponent');
var api = require('../api');
var getReport = require('../util/getReport');
var config =  require('../config');

function noop() {}

var Form = React.createClass({

  displayName: 'Form',

  // the public api returns `null` if validation failed
  // unless the optional boolean argument `raw` is set to `true`
  getValue: function (raw) {
    var result = this.refs.input.getValue();
    if (raw === true) { return result; }
    if (result.isValid()) { return result.value; }
    return null;
  },

  render: function () {
    var type = this.props.type;
    var options = this.props.options;
    var ctx = new api.Context({
      auto: api.Auto.defaultValue,
      i18n: config.i18n,
      report: getReport(type),
      templates: config.templates
    });
    var factory = React.createFactory(getComponent(type, options));
    return factory({
      ref: 'input',
      options: options,
      value: this.props.value,
      onChange: this.props.onChange || noop,
      ctx: ctx
    });
  }

});

module.exports = Form;
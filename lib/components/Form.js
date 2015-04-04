'use strict';

var React = require('react');
var getComponent = require('../getComponent');
var api = require('../api');
var getReport = require('../util/getReport');

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
      i18n: Form.i18n,
      report: getReport(type),
      templates: Form.templates,
      path: []
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

Form.i18n = require('../util/defaultLocaleBundle');

module.exports = Form;
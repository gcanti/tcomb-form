'use strict';

var React = require('react');
var api = require('./protocols/api');
var config = require('./config');
var getFactory = require('./factories').getFactory;
var getReport = require('./util/getReport');

function create(type, opts) {

  var factory = getFactory(type, opts);

  var Form = React.createClass({
    propTypes: {
      onChange: React.PropTypes.func.isRequired
    },

    displayName: 'Form',

    // the public api returns `null` if validation failed
    // unless the optional boolean argument `raw` is set to `true`
    getValue: function (raw, withErr) {
      var result = this.refs.input.getValue();
      if (raw === true) { return result; }
      if (result.isValid()) { return result.value; }
      if(withErr === true) {return result.errors; }
      return null;
    },

    render: function () {

      var ctx = new api.Context({
        auto: api.Auto.defaultValue,
        i18n: config.i18n,
        label: null,
        name: '',
        report: getReport(type),
        templates: config.templates,
        value: this.props.value
      });
      var Component = factory(opts, ctx);

      return React.createElement(Component, {
        onChange: this.props.onChange,
        ref: 'input'
      });
    }
  });

  return Form;
}

module.exports = create;

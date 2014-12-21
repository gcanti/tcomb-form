'use strict';

var React = require('react');
var Context = require('./protocols/api').Context;
var config = require('./config');
var getFactory = require('./factories').getFactory;
var getReport = require('./util/getReport');

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

      var ctx = new Context({
        auto: 'placeholders',
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
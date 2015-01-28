'use strict';

var React = require('react');
var t = require('tcomb-validation');
var shouldComponentUpdate = require('./shouldComponentUpdate');
var getComponent = require('../getComponent');
var api = require('../api');
var skin = require('../skin');
var getError = require('../util/getError');
var merge = require('../util/merge');
var humanize = require('../util/humanize');
var getReport = require('../util/getReport');
var compile = require('uvdom/react').compile;
var debug = require('debug')('Struct');

function normalize(value) {
  return t.maybe(t.Obj)(value) || {};
}

var Struct = React.createClass({

  displayName: 'Struct',

  getInitialState: function () {
    return {
      hasError: false,
      value: normalize(this.props.value)
    };
  },

  componentWillReceiveProps: function (props) {
    this.setState({value: normalize(props.value)});
  },

  shouldComponentUpdate: shouldComponentUpdate,

  onChange: function (fieldName, fieldValue) {
    var value = t.util.mixin({}, this.state.value);
    value[fieldName] = fieldValue;
    this.setState({value: value}, function () {
      this.props.onChange(value);
    }.bind(this));
  },

  getValue: function () {
    var report = this.props.ctx.report;
    var value = {};
    var errors = [];
    var hasError = false;
    var result;

    for (var ref in this.refs) {
      if (this.refs.hasOwnProperty(ref)) {
        result = this.refs[ref].getValue();
        errors = errors.concat(result.errors);
        value[ref] = result.value;
      }
    }

    if (errors.length === 0) {
      value = new report.innerType(value);
      // handle subtype
      if (report.subtype && errors.length === 0) {
        result = t.validate(value, report.type);
        hasError = !result.isValid();
        errors = errors.concat(result.errors);
      }
    }

    this.setState({hasError: hasError});
    return new t.ValidationResult({errors: errors, value: value});
  },

  getLocals: function () {
    var opts = new api.Struct(this.props.options || {});
    var ctx = this.props.ctx;
    debug('render', ctx.name);
    t.assert(!ctx.report.maybe, 'maybe structs are not supported');
    var auto =  opts.auto || ctx.auto;
    var label = !t.Nil.is(opts.label) ? opts.label :
      auto !== 'none' ? ctx.getDefaultLabel() :
      null;
    var config = merge(ctx.config, opts.config);
    var value = this.state.value;
    var props = ctx.report.innerType.meta.props;
    var i18n =  opts.i18n || ctx.i18n;
    var templates = merge(ctx.templates, opts.templates);
    var inputs = {};
    for (var prop in props) {
      if (props.hasOwnProperty(prop)) {
        var propType = props[prop];
        var propOptions = opts.fields ? opts.fields[prop] : null;
        inputs[prop] = React.createFactory(getComponent(propType, propOptions))({
          key: prop,
          ref: prop,
          type: propType,
          options: propOptions,
          value: value[prop],
          onChange: this.onChange.bind(this, prop),
          ctx: new api.Context({
            auto:       auto,
            config:     config,
            i18n:       i18n,
            label:      humanize(prop),
            name:       ctx.name ? ctx.name + '[' + prop + ']' : prop,
            report:     new getReport(propType),
            templates:  templates
          })
        });
      }
    }
    return {
      config: config,
      disabled: opts.disabled,
      error: getError(opts.error, value),
      hasError: opts.hasError || this.state.hasError,
      help: opts.help,
      inputs: inputs,
      label: label,
      order: opts.order || Object.keys(props),
      value: value,
      templates: templates
    };
  },

  render: function () {
    var locals = this.getLocals();
    return compile(locals.templates.struct(new skin.Struct(locals)));
  }

});

module.exports = Struct;
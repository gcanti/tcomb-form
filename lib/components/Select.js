'use strict';

var React = require('react');
var t = require('tcomb-validation');
var api = require('../api');
var skin = require('../skin');
var shouldComponentUpdate = require('./shouldComponentUpdate');
var defaultTransformer = require('../util/defaultTransformer');
var getError = require('../util/getError');
var getReport = require('../util/getReport');
var merge = require('../util/merge');
var uuid = require('../util/uuid');
var getOptionsOfEnum = require('../util/getOptionsOfEnum');
var compile = require('uvdom/react').compile;
var debug = require('debug')('component:Select');

var Select = React.createClass({

  displayName: 'Select',

  getInitialState: function () {
    var value = this.getTransformer().format(this.props.value);
    return {
      hasError: false,
      value: value
    };
  },

  componentWillReceiveProps: function (props) {
    var value = this.getTransformer().format(props.value);
    this.setState({value: value});
  },

  shouldComponentUpdate: shouldComponentUpdate,

  getTransformer: function () {
    if (this.props.options && this.props.options.transformer) {
      return this.props.options.transformer;
    }
    return defaultTransformer;
  },

  onChange: function (value) {
    this.setState({value: value}, function () {
      this.props.onChange(value, this.props.ctx.path);
    }.bind(this));
  },

  getValue: function () {
    var value = this.getTransformer().parse(this.state.value);
    var result = t.validate(value, this.props.ctx.report.type, this.props.ctx.path);
    this.setState({hasError: !result.isValid()});
    return result;
  },

  getLocals: function () {
    var opts = new api.Select(this.props.options || {});
    var ctx = this.props.ctx;
    var id = opts.id || this._rootNodeID || uuid();
    var name = opts.name || ctx.name || id;
    debug('render() called for `%s` field', name);
    var Enum = ctx.report.innerType;
    // handle `multiple` attribute
    var multiple = false;
    if (Enum.meta.kind === 'list') {
      multiple = true;
      Enum = getReport(Enum.meta.type).innerType;
    }

    // handle labels
    var label = opts.label; // always use the option value if is manually set
    if (!label && ctx.auto === 'labels') {
      // add automatically a label only if there is not a label
      // and the 'labels' auto option is turned on
      label = ctx.getDefaultLabel();
    }

    var value = this.state.value;
    var options = opts.options ? opts.options.slice() : getOptionsOfEnum(Enum);
    // sort opts
    if (opts.order) {
      options.sort(api.Order.getComparator(opts.order));
    }
    // add a `null` option in first position
    var nullOption = opts.nullOption || {value: '', text: '-'};
    if (!multiple && opts.nullOption !== false) {
      if (t.Nil.is(value)) { value = nullOption.value; }
      options.unshift(nullOption);
    }
    return {
      autoFocus: opts.autoFocus,
      config: merge(ctx.config, opts.config),
      disabled: opts.disabled,
      error: getError(opts.error, value),
      hasError: opts.hasError || this.state.hasError,
      help: opts.help,
      id: id,
      label: label,
      name: name,
      multiple: multiple,
      onChange: function (value) {
        if (value === nullOption.value) {
          value = null;
        }
        this.onChange(value);
      }.bind(this),
      options: options,
      value: value,
      template: opts.template || ctx.templates.select,
      className: opts.className
    };
  },

  render: function () {
    var locals = this.getLocals();
    return compile(locals.template(new skin.Select(locals)));
  }

});

module.exports = Select;
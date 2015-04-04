'use strict';

var React = require('react');
var t = require('tcomb-validation');
var api = require('../api');
var skin = require('../skin');
var shouldComponentUpdate = require('./shouldComponentUpdate');
var numberTransformer = require('../util/numberTransformer');
var getError = require('../util/getError');
var merge = require('../util/merge');
var uuid = require('../util/uuid');
var compile = require('uvdom/react').compile;
var debug = require('debug')('component:Textbox');

var defaultTransformer = new api.Transformer({
  format: function (value) {
    return t.Nil.is(value) ? null : value;
  },
  parse: function (value) {
    return (t.Str.is(value) && value.trim() === '') || t.Nil.is(value) ? null : value;
  }
});

var Textbox = React.createClass({

  displayName: 'Textbox',

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
    if (this.props.ctx.report.innerType === t.Num) {
      return numberTransformer;
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

  // useful for tests
  getLocals: function () {
    var opts = new api.Textbox(this.props.options || {});
    var ctx = this.props.ctx;
    var id = opts.id || this._rootNodeID || uuid();
    var name = opts.name || ctx.name || id;
    debug('render() called for `%s` field', name);

    // handle labels
    var label = opts.label; // always use the option value if is manually set
    if (!label && ctx.auto === 'labels') {
      // add automatically a label only if there is not a label
      // and the 'labels' auto option is turned on
      label = ctx.getDefaultLabel();
    }

    // handle placeholders
    var placeholder = opts.placeholder; // always use the option value if is manually set
    if (!label && !placeholder && ctx.auto === 'placeholders') {
      // add automatically a placeholder only if there is not a label
      // nor a placeholder manually set and the 'placeholders' auto option is turned on
      placeholder = ctx.getDefaultLabel();
    }

    var value = this.state.value;

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
      onChange: this.onChange,
      placeholder: placeholder,
      type: opts.type || 'text',
      value: value,
      template: opts.template || ctx.templates.textbox,
      className: opts.className
    };
  },

  render: function () {
    var locals = this.getLocals();
    return compile(locals.template(new skin.Textbox(locals)));
  }

});

module.exports = Textbox;
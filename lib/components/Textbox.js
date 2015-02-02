'use strict';

var React = require('react');
var t = require('tcomb-validation');
var api = require('../api');
var skin = require('../skin');
var shouldComponentUpdate = require('./shouldComponentUpdate');
var getError = require('../util/getError');
var merge = require('../util/merge');
var uuid = require('../util/uuid');
var config = require('../config');
var compile = require('uvdom/react').compile;
var debug = require('debug')('component:Textbox');

function normalize(value) {
  return (t.Str.is(value) && value.trim() === '') ? null :
    !t.Nil.is(value) ? value :
    null;
}

var Textbox = React.createClass({

  displayName: 'Textbox',

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

  onChange: function (value) {
    value = normalize(value);
    this.props.onChange(value);
    this.setState({value: value});
  },

  getValue: function () {
    var result = t.validate(this.state.value, this.props.ctx.report.type);
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
    var transformer = opts.transformer || config.transformers[t.util.getName(ctx.report.innerType)];
    if (transformer) {
      value = transformer.format(value);
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
      onChange: function (value) {
        if (transformer) {
          value = transformer.parse(value);
        }
        this.onChange(value);
      }.bind(this),
      placeholder: placeholder,
      type: opts.type || 'text',
      value: value,
      template: opts.template || ctx.templates.textbox
    };
  },

  render: function () {
    var locals = this.getLocals();
    return compile(locals.template(new skin.Textbox(locals)));
  }

});

module.exports = Textbox;
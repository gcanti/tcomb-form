'use strict';

var React = require('react');
var t = require('tcomb-validation');
var api = require('../api');
var skin = require('../skin');
var shouldComponentUpdate = require('./shouldComponentUpdate');
var getError = require('../util/getError');
var merge = require('../util/merge');
var uuid = require('../util/uuid');
var compile = require('uvdom/react').compile;
var debug = require('debug')('component:Checkbox');

function normalize(value) {
  return !!t.maybe(t.Bool)(value);
}

var Checkbox = React.createClass({

  displayName: 'Checkbox',

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

  getLocals: function () {
    var opts = new api.Checkbox(this.props.options || {});
    var ctx = this.props.ctx;
    t.assert(!ctx.report.maybe, 'maybe booleans are not supported');
    t.assert(ctx.report.innerType === t.Bool, 'checkboxes support only booleans');
    var id = opts.id || this._rootNodeID || uuid();
    var name = opts.name || ctx.name || id;
    debug('render() called for `%s` field', name);

    // handle labels
    var label = opts.label || ctx.getDefaultLabel(); // checkboxes must have a label

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
      value: value,
      template: opts.template || ctx.templates.checkbox
    };
  },

  render: function () {
    var locals = this.getLocals();
    return compile(locals.template(new skin.Checkbox(locals)));
  }

});

module.exports = Checkbox;
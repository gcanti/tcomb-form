'use strict';

var React = require('react');
var t = require('tcomb-validation');
var shouldComponentUpdate = require('./shouldComponentUpdate');
var getComponent = require('../getComponent');
var api = require('../api');
var skin = require('../skin');
var getError = require('../util/getError');
var merge = require('../util/merge');
var move = require('../util/move');
var uuid = require('../util/uuid');
var getReport = require('../util/getReport');
var compile = require('uvdom/react').compile;
var debug = require('debug')('component:List');

function justify(value, keys) {
  if (value.length === keys.length) { return keys; }
  var ret = [];
  for (var i = 0, len = value.length ; i < len ; i++ ) {
    ret[i] = keys[i] || uuid();
  }
  return ret;
}

function normalize(value) {
  t.maybe(t.Arr)(value);
  return value || [];
}

var List = React.createClass({

  displayName: 'List',

  getInitialState: function () {
    var value = normalize(this.props.value);
    return {
      hasError: false,
      value: value,
      keys: value.map(uuid)
    };
  },

  componentWillReceiveProps: function (props) {
    var value = normalize(props.value);
    this.setState({
      value: value,
      keys: justify(value, this.state.keys)
    });
  },

  shouldComponentUpdate: shouldComponentUpdate,

  onChange: function (value, keys) {
    this.props.onChange(value);
    this.setState({value: value, keys: keys});
  },

  getValue: function () {
    var report = this.props.ctx.report;
    var value = [];
    var errors = [];
    var hasError = false;
    var result;

    for (var i = 0, len = this.state.value.length ; i < len ; i++ ) {
      result = this.refs[i].getValue();
      errors = errors.concat(result.errors);
      value.push(result.value);
    }

    // handle subtype
    if (report.subtype && errors.length === 0) {
      result = t.validate(value, report.type);
      hasError = !result.isValid();
      errors = errors.concat(result.errors);
    }

    this.setState({hasError: hasError});
    return new t.ValidationResult({errors: errors, value: value});
  },

  addItem: function (evt) {
    evt.preventDefault();
    var value = this.state.value.concat(null);
    var keys = this.state.keys.concat(uuid());
    this.onChange(value, keys);
  },

  onItemChange: function (itemIndex, itemValue) {
    var value = this.state.value.slice();
    value[itemIndex] = itemValue;
    this.onChange(value, this.state.keys);
  },

  removeItem: function (i, evt) {
    evt.preventDefault();
    var value = this.state.value.slice();
    value.splice(i, 1);
    var keys = this.state.keys.slice();
    keys.splice(i, 1);
    this.onChange(value, keys);
  },

  moveUpItem: function (i, evt) {
    evt.preventDefault();
    if (i > 0) {
      this.onChange(
        move(this.state.value.slice(), i, i - 1),
        move(this.state.keys.slice(), i, i - 1)
      );
    }
  },

  moveDownItem: function (i, evt) {
    evt.preventDefault();
    if (i < this.state.value.length - 1) {
      this.onChange(
        move(this.state.value.slice(), i, i + 1),
        move(this.state.keys.slice(), i, i + 1)
      );
    }
  },

  getLocals: function () {
    var opts = new api.List(this.props.options || {});
    var ctx = this.props.ctx;
    debug('render() called for `%s` field', ctx.name);
    t.assert(!ctx.report.maybe, 'maybe lists are not supported');
    var auto = opts.auto || ctx.auto;
    var i18n = opts.i18n || ctx.i18n;
    var value = t.Arr(this.state.value || []);

    // handle legend
    var legend = opts.legend; // always use the option value if is manually set
    if (!legend && ctx.auto === 'labels') {
      // add automatically a legend only if there is not a legend
      // and the 'labels' auto option is turned on
      legend = ctx.getDefaultLabel();
    }

    var config = merge(ctx.config, opts.config);
    var templates = merge(ctx.templates, opts.templates);
    var itemType = ctx.report.innerType.meta.type;
    var factory = React.createFactory(getComponent(itemType, opts.item));
    var items = value.map(function (value, i) {
      var buttons = [];
      if (!opts.disabledRemove) { buttons.push({ label: i18n.remove, click: this.removeItem.bind(this, i) }); }
      if (!opts.disableOrder)   { buttons.push({ label: i18n.up, click: this.moveUpItem.bind(this, i) }); }
      if (!opts.disableOrder)   { buttons.push({ label: i18n.down, click: this.moveDownItem.bind(this, i) }); }
      return {
        input: factory({
          ref: i,
          type: itemType,
          options: opts.item,
          value: value,
          onChange: this.onItemChange.bind(this, i),
          ctx: new api.Context({
            auto:       auto,
            config:     config,
            i18n:       i18n,
            label:      null,
            name:       ctx.name + '[' + i + ']',
            report:     new getReport(itemType),
            templates:  templates
          })
        }),
        key: this.state.keys[i],
        buttons: buttons
      };
    }.bind(this));
    return {
      add: opts.disableAdd ? null : {
        label: i18n.add,
        click: this.addItem
      },
      config: config,
      disabled: opts.disabled,
      error: getError(opts.error, value),
      hasError: opts.hasError || this.state.hasError,
      help: opts.help,
      items: items,
      legend: legend,
      value: value,
      templates: templates
    };
  },

  render: function () {
    var locals = this.getLocals();
    return compile(locals.templates.list(new skin.List(locals)));
  }

});

module.exports = List;
'use strict';

var React = require('react');
var t = require('tcomb-validation');
var api = require('../api');
var style = require('../style');
var getReport = require('./getReport');
var array = require('./array');
var defaults = require('../defaults');
var humanize = require('./humanize');

var assert = t.assert;
var ValidationResult = t.ValidationResult;

module.exports = getFactory;

function getFactory(type) {
  switch (t.util.getKind(type)) {
    case 'irriducible' :
      return (type === t.Bool) ?
        checkboxFactory :
        textboxFactory;
    case 'struct' :
      return structFactory;
    case 'list' :
      return listFactory;
    case 'enums' :
      return selectFactory;
    case 'maybe' :
    case 'subtype' :
      return getFactory(type.meta.type);
    default :
      t.fail(t.util.format('cannot handle type %s', t.util.getName(type)));
  }
}

function textboxFactory(type, opts, ctx) {

  type = t.Type(type);
  opts = new api.Textbox(opts);
  ctx = new api.Context(ctx);
  var report = getReport(type);

  var label = opts.label;
  if (!label && ctx.auto === 'labels') {
    label = ctx.defaultLabel;
  }
  if (label && report.isOptional) {
    label += ctx.bundle.optional;
  }

  // labels have priority over placeholders
  var placeholder = null;
  if (!label) {
    var placeholder = opts.placeholder || ctx.defaultLabel;
    if (placeholder && report.isOptional) {
      placeholder += ctx.bundle.optional;
    }
  }

  var name = opts.name || getName(ctx);

  var value = either(ctx.value, opts.value);

  var transformer = opts.transformer;
  if (!transformer && report.last === t.Num) {
    transformer = defaults.defaultTransformer;
  }

  var Textbox = React.createClass({

    getInitialState: function () {
      return {
        hasError: opts.hasError,
        value: value
      };
    },

    getValue: function () {
      var value = this.getRawValue();
      var result = t.validate(value, type);
      this.setState({
        hasError: !result.isValid(),
        value: result.value
      });
      return result;
    },

    getRawValue: function () {
      var value = this.refs.input.getDOMNode().value.trim() || null;
      if (transformer) {
        value = transformer.parse(value);
      }
      return value;
    },

    render: function () {

      var message = opts.message;
      if (t.Func.is(message)) {
        message = message(this.state.value);
      }

      return style.Textbox.template({
        ref: 'input',
        type: opts.type || 'text',
        name: name,
        placeholder: placeholder,
        label: label,
        help: opts.help,
        readOnly: opts.readOnly,
        disabled: opts.disabled,
        hasError: this.state.hasError,
        value: this.state.value,
        message: message
      });
    }

  });

  return Textbox;

}

function checkboxFactory(type, opts, ctx) {

  type = t.Type(type);
  opts = new api.Checkbox(opts);
  ctx = new api.Context(ctx);

  // checkboxes must always have a label
  var label = opts.label;
  if (!label) {
    label = ctx.defaultLabel;
  }

  var name = opts.name || getName(ctx);

  var value = !!either(ctx.value, opts.value);

  var Checkbox = React.createClass({

    getInitialState: function () {
      return {
        hasError: opts.hasError,
        value: value
      };
    },

    getValue: function () {
      var value = this.getRawValue();
      var result = t.validate(value, type);
      this.setState({
        hasError: !result.isValid(),
        value: result.value
      });
      return result;
    },

    getRawValue: function () {
      return this.refs.input.getDOMNode().checked;
    },

    render: function () {

      var message = opts.message;
      if (t.Func.is(message)) {
        message = message(this.state.value);
      }

      return style.Checkbox.template({
        ref: 'input',
        name: name,
        label: label,
        help: opts.help,
        disabled: opts.disabled,
        hasError: this.state.hasError,
        value: this.state.value,
        message: message
      });
    }

  });

  return Checkbox;

}

function selectFactory(type, opts, ctx) {

  type = t.Type(type);
  opts = new api.Select(opts);
  ctx = new api.Context(ctx);

  var renderAs = opts.renderAs || 'select';
  assert(api.Select.renderers.hasOwnProperty(renderAs), 'invalid `renderAs` option `%s` supplied to api.Select.renderers', renderAs);
  return api.Select.renderers[renderAs].call(this, type, opts, ctx);
}

api.Select.renderers = {};

api.Select.renderers.select = function select(type, opts, ctx) {

  var report = getReport(type);

  var label = opts.label;
  if (!label && ctx.auto === 'labels') {
    label = ctx.label;
  }
  if (label && report.isOptional) {
    label += ctx.bundle.optional;
  }

  var name = opts.name || getName(ctx);

  var value = either(ctx.value, opts.value);

  var options = opts.options ?
    opts.options.slice() :
    getOptionsOfEnum(report.last);

  if (opts.order) {
    // sort opts
    options.sort(api.Order.meta.map[opts.order]);
  }

  if (opts.emptyOption) {
    // add the empty choice in first position
    options.unshift(opts.emptyOption);
  }

  var Select = React.createClass({

    getInitialState: function () {
      return {
        hasError: opts.hasError,
        value: value
      };
    },

    getValue: function () {
      var value = this.getRawValue();
      var result = t.validate(value, type);
      this.setState({
        hasError: !result.isValid(),
        value: result.value
      });
      return result;
    },

    getRawValue: function () {
      var value = this.refs.input.getDOMNode().value;
      if (opts.emptyOption && value === opts.emptyOption.value) {
        value = null;
      }
      return value;
    },

    render: function () {

      var message = opts.message;
      if (t.Func.is(message)) {
        message = message(this.state.value);
      }

      return style.Select.template({
        ref: 'input',
        name: name,
        label: label,
        help: opts.help,
        options: options,
        disabled: opts.disabled,
        hasError: this.state.hasError,
        value: this.state.value,
        message: message
      });
    }

  });

  return Select;

};

api.Select.renderers.radio = function radio(type, opts, ctx) {

  var report = getReport(type);

  var label = opts.label;
  if (!label && ctx.auto === 'labels') {
    label = ctx.defaultLabel;
  }
  if (label && report.isOptional) {
    label += ctx.bundle.optional;
  }

  var name = opts.name || getName(ctx);

  var value = either(ctx.value, opts.value);

  var options = opts.opts;
  if (!options) {
    options = getOptionsOfEnum(report.last);
  }

  if (opts.order) {
    // sort opts
    options.sort(api.Order.meta.map[opts.order]);
  }

  var Select = React.createClass({

    getInitialState: function () {
      return {
        hasError: opts.hasError,
        value: value
      };
    },

    getValue: function () {
      var value = this.getRawValue();
      var result = t.validate(value, type);
      this.setState({
        hasError: !result.isValid(),
        value: result.value
      });
      return result;
    },

    getRawValue: function () {
      var value = null, node;
      for (var i = 0, len = options.length ; i < len ; i++ ) {
        node = this.refs['input' + i].getDOMNode();
        if (node.checked) {
          value = node.value;
          break;
        }
      }
      return value;
    },

    render: function () {

      var message = opts.message;
      if (t.Func.is(message)) {
        message = message(this.state.value);
      }

      return style.Radio.template({
        ref: 'input',
        name: name,
        label: label,
        help: opts.help,
        options: options,
        hasError: this.state.hasError,
        value: this.state.value,
        message: message
      });
    }

  });

  return Select;

};

function getOptionsOfEnum(type) {
  var map = type.meta.map;
  return Object.keys(map).map(function (k) {
    return {
      value: k,
      text: map[k]
    };
  });
}

function structFactory(type, opts, ctx) {

  type = t.Type(type);
  opts = new api.Struct(opts);
  ctx = new api.Context(ctx);
  var report = getReport(type);

  assert(!report.isOptional, 'optional structs are not (yet) supported');

  var props = report.last.meta.props;
  var order = opts.order || Object.keys(props);
  var auto = opts.auto || ctx.auto;
  var bundle = opts.bundle || ctx.bundle;
  var value = ctx.value || opts.value || {};

  var label = opts.label;
  if (!label && auto !== 'none') {
    label = ctx.defaultLabel;
  }

  var fields = opts.fields || {};
  var components = {};
  for (var k in props) {
    if (props.hasOwnProperty(k)) {
      var factory = getFactory(props[k]);
      var field = t.util.mixin({}, fields[k]);
      var Component = factory(props[k], field, {
        bundle: ctx.bundle,
        auto: ctx.auto,
        path: ctx.path.concat(k),
        value: either(value[k], opts.value),
        defaultLabel: humanize(k)
      });
      components[k] = React.createFactory(Component);
    }
  }

  var Struct = React.createClass({

    getInitialState: function () {
      return {
        hasError: opts.hasError,
        value: value
      };
    },

    getValue: function () {

      var value = {};
      var errors = [];
      var result;

      for (var ref in this.refs) {
        if (this.refs.hasOwnProperty(ref)) {
          result = this.refs[ref].getValue();
          errors = errors.concat(result.errors);
          value[ref] = result.value;
        }
      }

      return new ValidationResult({errors: errors, value: value});
    },

    render: function () {

      var message = opts.message;
      if (t.Func.is(message)) {
        message = message(this.state.value);
      }

      var rows = order.map(function (name, i) {
        return components[name]({ref: name, key: name});
      });

      return style.Struct.template({
        label: label,
        rows: rows,
        hasError: this.state.hasError,
        message: message
      });
    }
  });

  return Struct;
}

function listFactory(type, opts, ctx) {

  type = t.Type(type);
  opts = new api.List(opts);
  ctx = new api.Context(ctx);
  var report = getReport(type);

  assert(!report.isOptional, 'optional lists are not (yet) supported');

  var auto = opts.auto || ctx.auto;
  var bundle = opts.bundle || ctx.bundle;
  var value = ctx.value || opts.value || [];

  var label = opts.label;
  if (!label && auto !== 'none') {
    label = ctx.defaultLabel;
  }

  var List = React.createClass({

    getInitialState: function () {
      return {
        hasError: opts.hasError,
        value: value
      };
    },

    getValue: function () {

      var value = [];
      var errors = [];
      var result;

      for (var i = 0, len = this.state.value.length ; i < len ; i++ ) {
        result = this.refs[i].getValue();
        errors = errors.concat(result.errors);
        value.push(result.value);
      }

      return new ValidationResult({errors: errors, value: value});
    },

    add: function (evt) {
      evt.preventDefault();
      var value = this.getValue().value;
      this.setState({value: value.concat(null)});
    },

    remove: function (i, evt) {
      evt.preventDefault();
      var value = this.getValue().value;
      this.setState({value: array.remove(value, i)});
    },

    up: function (i, evt) {
      evt.preventDefault();
      if (i > 0) {
        var value = this.getValue().value;
        this.setState({value: array.moveUp(value, i)});
      }
    },

    down: function (i, evt) {
      evt.preventDefault();
      if (i < this.state.value.length - 1) {
        var value = this.getValue().value;
        this.setState({value: array.moveDown(value, i)});
      }
    },

    render: function () {

      var rows = this.state.value.map(function getRow(value, i) {

        var itemFactory = getFactory(report.last);
        var item = itemFactory(report.last, opts.item || {}, {
          bundle: ctx.bundle,
          auto: ctx.auto,
          path: ctx.path.concat(i),
          value: value,
          defaultLabel: '#' + (i + 1)
        });

        var buttons = [];
        if (!opts.disabledRemove) { buttons.push({ label: bundle.remove, click: this.remove.bind(this, i) }); }
        if (!opts.disableOrder) { buttons.push({ label: bundle.up, click: this.up.bind(this, i) }); }
        if (!opts.disableOrder) { buttons.push({ label: bundle.down, click: this.down.bind(this, i) }); }

        return {
          item: React.createFactory(item)({ref: i, key: i}),
          buttons: buttons
        };
      }.bind(this));

      var message = opts.message;
      if (t.Func.is(message)) {
        message = message(this.state.value);
      }

      return style.List.template({
        label: label,
        add: opts.disableAdd ? null : {
          label: bundle.add,
          click: this.add
        },
        rows: rows,
        hasError: this.state.hasError,
        message: message
      });
    }
  });

  return List;

}

/*

  Proposals:

  - RFC 6901
  JavaScript Object Notation (JSON) Pointer
  http://tools.ietf.org/html/rfc6901

  - W3C HTML JSON form submission
  http://www.w3.org/TR/html-json-forms/

*/
function getName(ctx) {
  return ctx.path.join('/');
}

function either(a, b) {
  return t.Nil.is(a) ? b : a;
}





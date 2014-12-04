'use strict';

var React = require('react');
var t = require('tcomb-validation');
var api = require('../api');
var style = require('../style');
var compile = require('uvdom/react').compile;
var getReport = require('./getReport');
var array = require('./array');
var defaults = require('../defaults');
var humanize = require('./humanize');

var assert = t.assert;
var getKind = t.util.getKind;
var ValidationResult = t.ValidationResult;

module.exports = getFactory;

function getFactory(type) {
  switch (getKind(type)) {
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

var InputMixin = function (type, value, hasError, message, template) {

  return {

    getInitialState: function () {
      return {
        hasError: hasError,
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

    render: function () {

      if (t.Func.is(message)) {
        message = message(this.state.value);
      }

      return compile(template.render({
        hasError: this.state.hasError,
        value: this.state.value,
        message: message
      }));
    }
  };

}

function textboxFactory(type, options, ctx) {

  type = t.Type(type);
  options = new api.Textbox(options);
  ctx = new api.Context(ctx);
  var report = getReport(type);

  var label = options.label;
  if (!label && ctx.auto === 'labels') {
    label = ctx.defaultLabel;
  }
  if (label && report.isOptional) {
    label += ctx.bundle.optional;
  }

  // labels have priority over placeholders
  var placeholder = null;
  if (!label) {
    var placeholder = options.placeholder || ctx.defaultLabel;
    if (placeholder && report.isOptional) {
      placeholder += ctx.bundle.optional;
    }
  }

  var name = options.name || getName(ctx);

  var value = either(ctx.value, options.value);

  var transformer = options.transformer;
  if (!transformer && report.last === t.Num) {
    transformer = defaults.defaultTransformer;
  }

  var template = new style.Textbox({
    ref: 'input',
    type: options.type || 'text',
    name: name,
    placeholder: placeholder,
    label: label,
    help: options.help,
    readOnly: !!options.readOnly,
    disabled: !!options.disabled
  });

  var Textbox = React.createClass({

    mixins: [InputMixin(type, value, !!options.hasError, options.message, template)],

    getRawValue: function () {
      var value = this.refs.input.getDOMNode().value.trim() || null;
      if (transformer) {
        value = transformer.parse(value);
      }
      return value;
    }

  });

  return Textbox;

}

function checkboxFactory(type, options, ctx) {

  type = t.Type(type);
  options = new api.Checkbox(options);
  ctx = new api.Context(ctx);

  // checkboxes must always have a label
  var label = options.label;
  if (!label) {
    label = ctx.defaultLabel;
  }

  var name = options.name || getName(ctx);

  var value = !!either(ctx.value, options.value);

  var template = new style.Checkbox({
    ref: 'input',
    name: name,
    value: value,
    label: label,
    help: options.help,
    disabled: !!options.disabled
  });

  var Checkbox = React.createClass({

    mixins: [InputMixin(type, value, !!options.hasError, options.message, template)],

    getRawValue: function () {
      return this.refs.input.getDOMNode().checked;
    }

  });

  return Checkbox;

}

function selectFactory(type, options, ctx) {

  type = t.Type(type);
  options = new api.Select(options);
  ctx = new api.Context(ctx);

  var renderAs = options.renderAs || 'select';
  assert(api.Select.renderers.hasOwnProperty(renderAs), 'invalid `renderAs` option `%s` supplied to api.Select.renderers', renderAs);
  return api.Select.renderers[renderAs].call(this, type, options, ctx);
}

api.Select.renderers = {};

api.Select.renderers.select = function select(type, options, ctx) {

  var report = getReport(type);

  var label = options.label;
  if (!label && ctx.auto === 'labels') {
    label = ctx.label;
  }
  if (label && report.isOptional) {
    label += ctx.bundle.optional;
  }

  var name = options.name || getName(ctx);

  var value = either(ctx.value, options.value);

  var opts = options.options;
  if (!opts) {
    opts = getOptionsOfEnum(type);
  }

  if (options.order) {
    // sort options
    opts.sort(api.Order.meta.map[options.order]);
  }

  if (options.emptyOption) {
    // add the empty choice in first position
    opts.unshift(options.emptyOption);
  }

  var template = new style.Select({
    ref: 'input',
    name: name,
    value: value,
    label: label,
    help: options.help,
    options: opts,
    disabled: !!options.disabled
  });

  var Select = React.createClass({

    mixins: [InputMixin(type, value, !!options.hasError, options.message, template)],

    getRawValue: function () {
      var value = this.refs.input.getDOMNode().value;
      if (options.emptyOption && value === options.emptyOption.value) {
        value = null;
      }
      return value;
    }

  });

  return Select;

};

api.Select.renderers.radio = function radio(type, options, ctx) {

  var report = getReport(type);

  var label = options.label;
  if (!label && ctx.auto === 'labels') {
    label = ctx.defaultLabel;
  }
  if (label && report.isOptional) {
    label += ctx.bundle.optional;
  }

  var name = options.name || getName(ctx);

  var value = either(ctx.value, options.value);

  var opts = options.options;
  if (!opts) {
    opts = getOptionsOfEnum(type);
  }

  if (options.order) {
    // sort options
    opts.sort(api.Order.meta.map[options.order]);
  }

  var template = new style.Radio({
    ref: 'input',
    name: name,
    value: value,
    label: label,
    help: options.help,
    options: opts
  });

  var Select = React.createClass({

    mixins: [InputMixin(type, value, !!options.hasError, options.message, template)],

    getRawValue: function () {
      var value = null, node;
      for (var i = 0, len = opts.length ; i < len ; i++ ) {
        node = this.refs['input' + i].getDOMNode();
        if (node.checked) {
          value = node.value;
          break;
        }
      }
      return value;
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

function structFactory(type, options, ctx) {

  type = t.Type(type);
  options = new api.Struct(options);
  ctx = new api.Context(ctx);
  var report = getReport(type);

  assert(!report.isOptional, 'optional structs are not (yet) supported');

  var props = report.last.meta.props;
  var order = options.order || Object.keys(props);
  var fields = options.fields || {};
  var auto = options.auto || ctx.auto;
  var bundle = options.bundle || ctx.bundle;
  var value = ctx.value || options.value || {};

  var label = options.label;
  if (!label && auto !== 'none') {
    label = ctx.defaultLabel;
  }

  var rows = order.map(function (prop) {

    var factory = getFactory(props[prop]);
    var field = t.util.mixin({}, fields[prop]);
    var component = factory(props[prop], field, {
      bundle: ctx.bundle,
      auto: ctx.auto,
      path: ctx.path.concat(prop),
      value: either(value[prop], options.value),
      defaultLabel: humanize(prop)
    });

    return {
      tag: component,
      ref: prop
    };

  });

  var template = new style.Struct({
    label: label,
    rows: rows
  });

  var Struct = React.createClass({

    getInitialState: function () {
      return {
        hasError: !!options.hasError,
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

      var message = options.message;
      if (t.Func.is(message)) {
        message = message(this.state.value);
      }

      return compile(template.render({
        hasError: this.state.hasError,
        value: this.state.value,
        message: message
      }));
    }
  });

  return Struct;
}

function listFactory(type, options, ctx) {

  type = t.Type(type);
  options = new api.List(options);
  ctx = new api.Context(ctx);
  var report = getReport(type);

  assert(!report.isOptional, 'optional lists are not (yet) supported');

  var auto = options.auto || ctx.auto;
  var bundle = options.bundle || ctx.bundle;
  var value = ctx.value || options.value || [];

  var label = options.label;
  if (!label && auto !== 'none') {
    label = ctx.defaultLabel;
  }

  var template = new style.List({
    label: label
  });

  var List = React.createClass({

    getInitialState: function () {
      return {
        hasError: !!options.hasError,
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
        var item = itemFactory(report.last, options.item || {}, {
          bundle: ctx.bundle,
          auto: ctx.auto,
          path: ctx.path.concat(i),
          value: value,
          defaultLabel: '#' + (i + 1)
        });

        var buttons = [];
        if (options.remove) { buttons.push({ label: options.remove, click: this.remove.bind(this, i) }); }
        if (options.up) { buttons.push({ label: options.up, click: this.up.bind(this, i) }); }
        if (options.down) { buttons.push({ label: options.down, click: this.down.bind(this, i) }); }

        return {
          item: React.createFactory(item)({ref: i, key: i}),
          buttons: buttons
        };
      }.bind(this));

      var message = options.message;
      if (t.Func.is(message)) {
        message = message(this.state.value);
      }

      return compile(template.render({
        add: options.disableAdd ? null : {
          label: bundle.add,
          click: this.add
        },
        rows: rows,
        hasError: this.state.hasError,
        value: this.state.value,
        message: message
      }));
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





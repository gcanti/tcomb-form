'use strict';

var React = require('react');
var t = require('tcomb-validation');
var api = require('./protocols/api');
var theme = require('./protocols/theme');
var config = require('./config');
var compile = require('uvdom/react').compile;

var either = require('./util/either');
var getError = require('./util/getError');
var getOptionsOfEnum = require('./util/getOptionsOfEnum');
var getReport = require('./util/getReport');
var humanize = require('./util/humanize');
var merge = require('./util/merge');
var move = require('./util/move');
var uuid = require('./util/uuid');

var assert = t.assert;
var Nil = t.Nil;
var ValidationResult = t.ValidationResult;
var getKind = t.util.getKind;
var getName = t.util.getName;
var Context = api.Context;

//
// main function
//

function getFactory(type, opts) {

  type = t.Type(type);
  opts = opts || {};

  // [extension point]
  if (opts.factory) {
    assert(t.Func.is(opts.factory), 'invalid `factory` option, must be a function with signature (opts, [ctx]) -> React Class');
    return opts.factory;
  }

  var kind = getKind(type);
  if (config.kinds.hasOwnProperty(kind)) {
    return config.kinds[kind](type, opts);
  }

  t.fail(t.util.format('cannot handle type %s', getName(type)));
}

//
// factories
//

var REF = 'input';

function textbox(opts, ctx) {

  opts = new api.Textbox(opts || {});

  var label = opts.label;
  if (!label && ctx.auto === 'labels') {
    label = ctx.getDefaultLabel();
  }

  // labels have higher priority
  var placeholder = null;
  if (!label && ctx.auto !== 'none') {
    placeholder = opts.placeholder || ctx.getDefaultLabel();
  }

  var name = opts.name || ctx.getDefaultName();

  var value = either(opts.value, ctx.value);

  var transformer = opts.transformer || config.transformers[getName(ctx.report.innerType)];

  var template = opts.template || ctx.templates.textbox;

  return React.createClass({

    displayName: ctx.getDisplayName(),

    getInitialState: function () {
      return {
        hasError: !!opts.hasError,
        value: value
      };
    },

    getRawValue: function () {
      assert(!Nil.is(this.refs[REF]), 'missing `ref` for input `%s`, check out its template', name);
      var value = this.refs[REF].getDOMNode().value.trim() || null;
      if (transformer) {
        value = transformer.parse(value);
      }
      return value;
    },

    getValue: function () {
      var result = t.validate(this.getRawValue(), ctx.report.type);
      this.setState({
        hasError: !result.isValid(),
        value: result.value
      });
      return result;
    },

    render: function () {

      var value = this.state.value;
      if (transformer) {
        value = transformer.format(value);
      }

      return compile(template(new theme.Textbox({
        ref: REF,
        type: opts.type || 'text',
        name: name,
        placeholder: placeholder,
        label: label,
        help: opts.help,
        readOnly: opts.readOnly,
        disabled: opts.disabled,
        hasError: this.state.hasError,
        value: value,
        error: getError(opts.error, this.state),
        config: merge(ctx.config, opts.config)
      })));
    }
  });
}

function checkbox(opts, ctx) {

  opts = new api.Checkbox(opts || {});

  // checkboxes must have a label
  var label = opts.label;
  if (!label) {
    label = ctx.getDefaultLabel();
  }

  var name = opts.name || ctx.getDefaultName();

  var value = !!either(opts.value, ctx.value === true);

  var template = opts.template || ctx.templates.checkbox;

  return React.createClass({

    displayName: ctx.getDisplayName(),

    getInitialState: function () {
      return {
        hasError: !!opts.hasError,
        value: value
      };
    },

    getRawValue: function () {
      assert(!Nil.is(this.refs[REF]), 'missing `ref` for input `%s`, check out its template', name);
      return this.refs[REF].getDOMNode().checked;
    },

    getValue: function () {
      var result = t.validate(this.getRawValue(), ctx.report.type);
      this.setState({
        hasError: !result.isValid(),
        value: result.value
      });
      return result;
    },

    render: function () {
      return compile(template(new theme.Checkbox({
        ref: REF,
        name: name,
        label: label,
        help: opts.help,
        disabled: opts.disabled,
        hasError: this.state.hasError,
        value: this.state.value,
        error: getError(opts.error, this.state),
        config: merge(ctx.config, opts.config)
      })));
    }
  });
}

function select(opts, ctx) {

  opts = new api.Select(opts || {});

  var Enum = ctx.report.innerType;

  // handle `multiple` attribute
  var multiple = false;
  if (getKind(Enum) === 'list') {
    multiple = true;
    Enum = getReport(Enum.meta.type).innerType;
  }

  var label = opts.label;
  if (!label && ctx.auto === 'labels') {
    label = ctx.getDefaultLabel();
  }

  var name = opts.name || ctx.getDefaultName();

  var value = either(opts.value, ctx.value);

  var options = opts.options ? opts.options : getOptionsOfEnum(Enum);

  // sort opts
  if (opts.order) {
    options.sort(api.Order.getComparator(opts.order));
  }

  // add a `null` option in first position
  var nullOption = opts.nullOption || {value: '', text: '-'};
  if (!multiple) {
    options.unshift(nullOption);
  }

  var template = opts.template || ctx.templates.select;

  return React.createClass({

    displayName: ctx.getDisplayName(),

    getInitialState: function () {
      return {
        hasError: !!opts.hasError,
        value: value
      };
    },

    getRawValue: function () {

      assert(!Nil.is(this.refs[REF]), 'missing `ref` for input `%s`, check out its template', name);

      var select = this.refs[REF].getDOMNode();
      var value = select.value;

      if (multiple) {
        value = [];
        for (var i = 0, len = select.options.length ; i < len ; i++ ) {
            var option = select.options[i];
            if (option.selected) {
              value.push(option.value);
            }
        }
      }

      return (value === nullOption.value) ? null : value;
    },

    getValue: function () {
      var result = t.validate(this.getRawValue(), ctx.report.type);
      this.setState({
        hasError: !result.isValid(),
        value: result.value
      });
      return result;
    },

    render: function () {
      return compile(template(new theme.Select({
        ref: REF,
        name: name,
        label: label,
        help: opts.help,
        options: options,
        disabled: opts.disabled,
        hasError: this.state.hasError,
        value: this.state.value,
        error: getError(opts.error, this.state),
        multiple: multiple,
        config: merge(ctx.config, opts.config)
      })));
    }
  });
}

function radio(opts, ctx) {

  opts = new api.Radio(opts || {});

  // radios must always have a label
  var label = opts.label;
  if (!label) {
    label = ctx.getDefaultLabel();
  }

  var name = opts.name || ctx.getDefaultName();

  var value = either(opts.value, ctx.value);

  var options = opts.options || getOptionsOfEnum(ctx.report.innerType);

  // sort opts
  if (opts.order) {
    options.sort(api.Order.getComparator(opts.order));
  }

  var template = opts.template || ctx.templates.radio;

  return React.createClass({

    displayName: ctx.getDisplayName(),

    getInitialState: function () {
      return {
        hasError: !!opts.hasError,
        value: value
      };
    },

    getRawValue: function () {

      var value = null;

      for (var i = 0, len = options.length ; i < len ; i++ ) {
        assert(!Nil.is(this.refs[REF + i]), 'missing `ref` for input `%s`, check out its template', name);
        var node = this.refs[REF + i].getDOMNode();
        if (node.checked) {
          value = node.value;
          break;
        }
      }

      return value;
    },

    getValue: function () {
      var result = t.validate(this.getRawValue(), ctx.report.type);
      this.setState({
        hasError: !result.isValid(),
        value: result.value
      });
      return result;
    },

    render: function () {
      return compile(template(new theme.Radio({
        ref: REF,
        name: name,
        label: label,
        help: opts.help,
        options: options,
        hasError: this.state.hasError,
        value: this.state.value,
        error: getError(opts.error, this.state),
        config: merge(ctx.config, opts.config)
      })));
    }
  });
}

function struct(opts, ctx) {

  opts = new api.Struct(opts || {});
  var report = ctx.report;

  assert(!report.maybe, 'maybe structs are not (yet) supported');

  var props = report.innerType.meta.props;
  var order = opts.order || Object.keys(props);
  var auto =  opts.auto || ctx.auto;
  var i18n =  opts.i18n || ctx.i18n;
  var value = opts.value || ctx.value || {};

  var label = opts.label;
  if (!label && auto !== 'none') {
    label = ctx.getDefaultLabel();
  }

  var config = merge(ctx.config, opts.config);

  var templates = merge(ctx.templates, opts.templates);

  var components = {};
  var fields = opts.fields || {};
  order.forEach(function (prop) {
    if (props.hasOwnProperty(prop)) {

      var propType = props[prop];
      var propOpts = fields[prop] || {};
      var factory = getFactory(propType, propOpts);
      var Component = factory(propOpts, new Context({
        templates:  templates,
        i18n:       i18n,
        report:     new getReport(propType),
        path:       ctx.path.concat(prop),
        auto:       auto,
        label:      humanize(prop),
        value:      value[prop],
        config:     config
      }));

      components[prop] = Component;

    }
  });

  return React.createClass({

    displayName: ctx.getDisplayName(),

    getInitialState: function () {
      return {
        hasError: !!opts.hasError
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

      if (errors.length === 0) {
        value = value = new report.innerType(value);
        // handle subtype
        if (report.subtype && errors.length === 0) {
          this.setState({hasError: false});
          result = t.validate(value, report.type);
          errors = errors.concat(result.errors);
          this.setState({hasError: errors.length > 0});
        }
      }

      return new ValidationResult({errors: errors, value: value});
    },

    render: function () {

      var inputs = {};
      for (var name in components) {
        if (components.hasOwnProperty(name)) {
          inputs[name] = React.createElement(components[name], {ref: name, key: name}); // // exploit the `name` uniqueness for keys
        }
      }

      return compile(templates.struct(new theme.Struct({
        label: label,
        help: opts.help,
        order: order,
        inputs: inputs,
        value: value,
        hasError: this.state.hasError,
        error: getError(opts.error, this.state),
        config: config
      })));
    }
  });
}

function list(opts, ctx) {

  opts = new api.List(opts || {});
  var report = ctx.report;

  assert(!report.maybe, 'maybe lists are not (yet) supported');

  var auto = opts.auto || ctx.auto;
  var i18n = opts.i18n || ctx.i18n;
  var value = opts.value || ctx.value || [];

  var label = opts.label;
  if (!label && auto !== 'none') {
    label = ctx.getDefaultLabel();
  }

  var config = merge(ctx.config, opts.config);

  var templates = merge(ctx.templates, opts.templates);

  var itemType = report.innerType.meta.type;
  var itemOpts = opts.item || {};
  var itemFactory = getFactory(itemType, itemOpts);
  var getComponent = function (value, i) {
    return itemFactory(itemOpts, new Context({
      templates: templates,
      i18n: i18n,
      report: getReport(itemType),
      path: ctx.path.concat(i),
      auto: auto,
      label: '#' + (i + 1),
      value: value,
      config: config
    }));
  };

  // for lists it's very important to set the keys correctly
  // otherwise React will re-render the inputs
  // losing their states (hasError and value)

  // [mutable]
  var components = value.map(function (value, i) {
    return {
      Component: getComponent(value, i),
      key: uuid() // every component has a  unique generated key
    };
  });

  return React.createClass({

    displayName: ctx.getDisplayName(),

    getInitialState: function () {
      return {
        hasError: !!opts.hasError
      };
    },

    getValue: function () {

      var value = [];
      var errors = [];
      var result;

      for (var i = 0, len = components.length ; i < len ; i++ ) {
        if (this.refs.hasOwnProperty(i)) {
          result = this.refs[i].getValue();
          errors = errors.concat(result.errors);
          value.push(result.value);
        }
      }

      // handle subtype
      if (report.subtype && errors.length === 0) {
        this.setState({hasError: false});
        result = t.validate(value, report.type);
        errors = errors.concat(result.errors);
        this.setState({hasError: errors.length > 0});
      }

      return new ValidationResult({errors: errors, value: value});
    },

    addItem: function (evt) {
      evt.preventDefault();
      components.push({
        Component: getComponent(null, components.length - 1),
        key: uuid()
      });
      this.forceUpdate();
    },

    removeItem: function (i, evt) {
      evt.preventDefault();
      components.splice(i, 1);
      this.forceUpdate();
    },

    moveUpItem: function (i, evt) {
      evt.preventDefault();
      if (i > 0) {
        move(components, i, i - 1);
        this.forceUpdate();
      }
    },

    moveDownItem: function (i, evt) {
      evt.preventDefault();
      if (i < components.length - 1) {
        move(components, i, i + 1);
        this.forceUpdate();
      }
    },

    render: function () {

      var items = components.map(function getItem(item, i) {

        var buttons = [];
        if (!opts.disabledRemove) { buttons.push({ label: i18n.remove, click: this.removeItem.bind(this, i) }); }
        if (!opts.disableOrder)   { buttons.push({ label: i18n.up, click: this.moveUpItem.bind(this, i) }); }
        if (!opts.disableOrder)   { buttons.push({ label: i18n.down, click: this.moveDownItem.bind(this, i) }); }

        return {
          input: React.createElement(item.Component, {ref: i, key: item.key}),
          key: item.key,
          buttons: buttons
        };
      }.bind(this));

      return compile(templates.list(new theme.List({
        label: label,
        help: opts.help,
        add: opts.disableAdd ? null : {
          label: i18n.add,
          click: this.addItem
        },
        items: items,
        value: value,
        hasError: this.state.hasError,
        error: getError(opts.error, this.state),
        config: config
      })));
    }
  });
}

//
// configuration
//

config.kinds = {
  irriducible: function (type, opts) {
    var name = getName(type);
    if (t.Func.is(config.irriducibles[name])) {
      return config.irriducibles[name](opts);
    }
    return textbox; // fallback on textbox
  },
  enums:    function () { return select; },
  struct:   function () { return struct; },
  list:     function () { return list; },
  maybe:    function (type, opts) { return getFactory(type.meta.type, opts); },
  subtype:  function (type, opts) { return getFactory(type.meta.type, opts); }
};

config.irriducibles = {
  Bool: function () { return checkbox; }
};

config.transformers = {
  Num: new api.Transformer({
    format: function (value) {
      return Nil.is(value) ? value : String(value);
    },
    parse: function (value) {
      var n = parseFloat(value);
      var isNumeric = (value - n + 1) >= 0;
      return isNumeric ? n : value;
    }
  })
};

module.exports = {
  getFactory: getFactory,
  textbox:    textbox,
  checkbox:   checkbox,
  select:     select,
  radio:      radio,
  struct:     struct,
  list:       list
};

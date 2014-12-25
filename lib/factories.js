'use strict';

var React = require('react');
var t = require('tcomb-validation');
var api = require('./protocols/api');
var theme = require('./protocols/theme');
var config = require('./config');
var compile = require('uvdom/react').compile;

var getError = require('./util/getError');
var getOptionsOfEnum = require('./util/getOptionsOfEnum');
var getReport = require('./util/getReport');
var humanize = require('./util/humanize');
var merge = require('./util/merge');
var move = require('./util/move');
var uuid = require('./util/uuid');

var assert = t.assert;
var Nil = t.Nil;
var mixin = t.util.mixin;
var ValidationResult = t.ValidationResult;
var getKind = t.util.getKind;
var getName = t.util.getName;
var Context = api.Context;

function getFactory(type, opts) {

  opts = opts || {};

  // [extension point]
  if (opts.factory) {
    assert(t.Func.is(opts.factory), 'invalid `factory` option, must be a function with signature (opts, [ctx]) -> React Class');
    return opts.factory;
  }

  // get factory by type
  type = t.Type(type);
  var kind = getKind(type);
  if (config.kinds.hasOwnProperty(kind)) {
    return config.kinds[kind](type, opts);
  }

  t.fail(t.util.format('cannot handle type %s', getName(type)));
}

//
// factories
//

function textbox(opts, ctx) {

  opts = new api.Textbox(opts || {});

  var label = !Nil.is(opts.label) ? opts.label :
    ctx.auto === 'labels' ? ctx.getDefaultLabel() :
    null;

  // labels have higher priority
  var placeholder = null;
  if (!label && ctx.auto !== 'none') {
    placeholder = !Nil.is(opts.placeholder) ? opts.placeholder : ctx.getDefaultLabel();
  }

  var name = opts.name || ctx.name;

  var value = !Nil.is(opts.value) ? opts.value : !Nil.is(ctx.value) ? ctx.value : null;

  var transformer = opts.transformer || config.transformers[getName(ctx.report.innerType)];

  var template = opts.template || ctx.templates.textbox;

  return React.createClass({

    displayName: 'Textbox',

    getInitialState: function () {
      return {
        hasError: !!opts.hasError,
        value: value
      };
    },

    onChange: function (evt) {
      var value = evt.target.value;
      if (transformer) {
        value = transformer.parse(value);
      }
      if (this.props.onChange) {
        this.props.onChange(value);
      }
      this.setState({value: value});
    },

    getValue: function () {
      var value = this.state.value;
      // handle white spaces
      if (t.Str.is(value)) {
        value = value.trim() || null;
      }
      var result = t.validate(value, ctx.report.type);
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

      var id = opts.id || this._rootNodeID || uuid();

      return compile(template(new theme.Textbox({
        config: merge(ctx.config, opts.config),
        disabled: opts.disabled,
        error: getError(opts.error, this.state),
        hasError: this.state.hasError,
        help: opts.help,
        id: id,
        label: label,
        name: name,
        onChange: this.onChange,
        placeholder: placeholder,
        type: opts.type || 'text',
        value: value
      })));
    }
  });
}

function checkbox(opts, ctx) {

  opts = new api.Checkbox(opts || {});

  // checkboxes must have a label
  var label = opts.label || ctx.getDefaultLabel();

  var name = opts.name || ctx.name;

  var value = t.Bool.is(opts.value) ? opts.value : t.Bool.is(ctx.value) ? ctx.value : false;

  var template = opts.template || ctx.templates.checkbox;

  return React.createClass({

    displayName: 'Checkbox',

    getInitialState: function () {
      return {
        hasError: !!opts.hasError,
        value: value
      };
    },

    onChange: function (evt) {
      var value = evt.target.checked;
      if (this.props.onChange) {
        this.props.onChange(value);
      }
      this.setState({value: value});
    },

    getValue: function () {
      var result = t.validate(this.state.value, ctx.report.type);
      this.setState({
        hasError: !result.isValid(),
        value: result.value
      });
      return result;
    },

    render: function () {

      var id = opts.id || this._rootNodeID || uuid();

      return compile(template(new theme.Checkbox({
        config: merge(ctx.config, opts.config),
        disabled: opts.disabled,
        error: getError(opts.error, this.state),
        hasError: this.state.hasError,
        help: opts.help,
        id: id,
        label: label,
        name: name,
        onChange: this.onChange,
        value: this.state.value
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

  var label = !Nil.is(opts.label) ? opts.label :
    ctx.auto === 'labels' ? ctx.getDefaultLabel() :
    null;

  var name = opts.name || ctx.name;

  var value = !Nil.is(opts.value) ? opts.value :
    !Nil.is(ctx.value) ? ctx.value :
    multiple ? [] : null;

  var options = opts.options ? opts.options.slice() : getOptionsOfEnum(Enum);

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

    displayName: 'Select',

    getInitialState: function () {
      return {
        hasError: !!opts.hasError,
        value: value
      };
    },

    onChange: function (evt) {

      var value;

      if (multiple) {
        value = [];
        var options = evt.target.options;
        for (var i = 0, len = options.length; i < len ; i++ ) {
          if (options[i].selected) {
            value.push(options[i].value);
          }
        }
      } else {
        value = evt.target.value;
        if (value === nullOption.value) {
          value = null;
        }
      }

      if (this.props.onChange) {
        this.props.onChange(value);
      }
      this.setState({value: value});
    },

    getValue: function () {
      var result = t.validate(this.state.value, ctx.report.type);
      this.setState({
        hasError: !result.isValid(),
        value: result.value
      });
      return result;
    },

    render: function () {

      var id = opts.id || this._rootNodeID || uuid();

      return compile(template(new theme.Select({
        config: merge(ctx.config, opts.config),
        disabled: opts.disabled,
        error: getError(opts.error, this.state),
        hasError: this.state.hasError,
        help: opts.help,
        id: id,
        label: label,
        name: name,
        multiple: multiple,
        onChange: this.onChange,
        options: options,
        value: this.state.value
      })));
    }
  });
}

function radio(opts, ctx) {

  opts = new api.Radio(opts || {});

  var label = !Nil.is(opts.label) ? opts.label :
    ctx.auto === 'labels' ? ctx.getDefaultLabel() :
    null;

  var name = opts.name || ctx.name;

  var value = !Nil.is(opts.value) ? opts.value : !Nil.is(ctx.value) ? ctx.value : null;

  var options = opts.options ? opts.options.slice() : getOptionsOfEnum(ctx.report.innerType);

  // sort opts
  if (opts.order) {
    options.sort(api.Order.getComparator(opts.order));
  }

  var template = opts.template || ctx.templates.radio;

  return React.createClass({

    displayName: 'Radio',

    getInitialState: function () {
      return {
        hasError: !!opts.hasError,
        value: value
      };
    },

    onChange: function (evt) {
      var value = evt.target.value;
      if (this.props.onChange) {
        this.props.onChange(value);
      }
      this.setState({value: value});
    },

    getValue: function () {
      var result = t.validate(this.state.value, ctx.report.type);
      this.setState({
        hasError: !result.isValid(),
        value: result.value
      });
      return result;
    },

    render: function () {

      var id = opts.id || this._rootNodeID || uuid();

      return compile(template(new theme.Radio({
        config: merge(ctx.config, opts.config),
        disabled: opts.disabled,
        error: getError(opts.error, this.state),
        hasError: this.state.hasError,
        help: opts.help,
        id: id,
        label: label,
        name: name,
        onChange: this.onChange,
        options: options,
        value: this.state.value
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

  var label = !Nil.is(opts.label) ? opts.label :
    ctx.auto !== 'none' ? ctx.getDefaultLabel() :
    null;

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
        auto:       auto,
        config:     config,
        i18n:       i18n,
        label:      humanize(prop),
        name:       ctx.name ? ctx.name + '[' + prop + ']' : prop,
        report:     new getReport(propType),
        templates:  templates,
        value:      value[prop]
      }));

      components[prop] = Component;

    }
  });

  return React.createClass({

    displayName: 'Struct',

    getInitialState: function () {
      return {
        hasError: !!opts.hasError,
        value: value
      };
    },

    onFieldChange: function (fieldName, fieldValue) {
      var value = mixin({}, this.state.value);
      value[fieldName] = fieldValue;
      this.onChange(value);
    },

    onChange: function (value) {
      if (this.props.onChange) {
        this.props.onChange(value);
      }
      this.setState({value: value});
    },

    getValue: function () {

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

      this.setState({hasError: hasError, value: value});
      return new ValidationResult({errors: errors, value: value});
    },

    render: function () {

      var inputs = {};
      for (var name in components) {
        if (components.hasOwnProperty(name)) {
          inputs[name] = React.createElement(components[name], {
            key: name,
            onChange: this.onFieldChange.bind(this, name),
            ref: name // exploit the `name` uniqueness for keys
          });
        }
      }

      return compile(templates.struct(new theme.Struct({
        config: config,
        disabled: opts.disabled,
        error: getError(opts.error, this.state),
        hasError: this.state.hasError,
        help: opts.help,
        inputs: inputs,
        label: label,
        order: order,
        value: this.state.value
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

  var label = !Nil.is(opts.label) ? opts.label :
    ctx.auto !== 'none' ? ctx.getDefaultLabel() :
    null;

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
      name: ctx.name + '[' + i + ']',
      auto: auto,
      label: null,
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

    displayName: 'List',

    getInitialState: function () {
      return {
        hasError: !!opts.hasError,
        value: value
      };
    },

    onItemChange: function (itemIndex, itemValue) {
      var value = this.state.value.slice();
      value[itemIndex] = itemValue;
      this.onChange(value);
    },

    onChange: function (value) {
      if (this.props.onChange) {
        this.props.onChange(value);
      }
      this.setState({value: value});
    },

    getValue: function () {

      var value = [];
      var errors = [];
      var hasError = false;
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
        result = t.validate(value, report.type);
        hasError = !result.isValid();
        errors = errors.concat(result.errors);
      }

      this.setState({hasError: hasError, value: value});
      return new ValidationResult({errors: errors, value: value});
    },

    addItem: function (evt) {
      evt.preventDefault();
      components.push({
        Component: getComponent(null, components.length),
        key: uuid()
      });
      var value = this.state.value.slice();
      value.push(null);
      this.onChange(value);
    },

    removeItem: function (i, evt) {
      evt.preventDefault();
      components.splice(i, 1);
      var value = this.state.value.slice();
      value.splice(i, 1);
      this.onChange(value);
    },

    moveUpItem: function (i, evt) {
      evt.preventDefault();
      if (i > 0) {
        move(components, i, i - 1);
        this.onChange(move(this.state.value.slice(), i, i - 1));
      }
    },

    moveDownItem: function (i, evt) {
      evt.preventDefault();
      if (i < components.length - 1) {
        move(components, i, i + 1);
        this.onChange(move(this.state.value.slice(), i, i + 1));
      }
    },

    render: function () {

      var items = components.map(function getItem(item, i) {

        var buttons = [];
        if (!opts.disabledRemove) { buttons.push({ label: i18n.remove, click: this.removeItem.bind(this, i) }); }
        if (!opts.disableOrder)   { buttons.push({ label: i18n.up, click: this.moveUpItem.bind(this, i) }); }
        if (!opts.disableOrder)   { buttons.push({ label: i18n.down, click: this.moveDownItem.bind(this, i) }); }

        return {
          input: React.createElement(item.Component, {
            key: item.key,
            onChange: this.onItemChange.bind(this, i),
            ref: i
          }),
          key: item.key,
          buttons: buttons
        };
      }.bind(this));

      return compile(templates.list(new theme.List({
        add: opts.disableAdd ? null : {
          label: i18n.add,
          click: this.addItem
        },
        config: config,
        disabled: opts.disabled,
        error: getError(opts.error, this.state),
        hasError: this.state.hasError,
        help: opts.help,
        items: items,
        label: label,
        value: this.state.value
      })));
    }
  });
}

//
// configuration
//

config.kinds = {
  irreducible: function (type, opts) {
    var name = getName(type);
    if (t.Func.is(config.irreducibles[name])) {
      return config.irreducibles[name](opts);
    }
    return textbox; // fallback on textbox
  },
  enums:    function () { return select; },
  struct:   function () { return struct; },
  list:     function () { return list; },
  maybe:    function (type, opts) { return getFactory(type.meta.type, opts); },
  subtype:  function (type, opts) { return getFactory(type.meta.type, opts); }
};

config.irreducibles = {
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

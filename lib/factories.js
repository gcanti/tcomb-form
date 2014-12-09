'use strict';

var React =   require('react');
var t =       require('tcomb-validation');
var api =     require('./protocols/api');
var style =   require('./protocols/style');
var config =  require('./config');

var assert = t.assert;
var Nil = t.Nil;
var ValidationResult = t.ValidationResult;
var getKind = t.util.getKind;
var getName = t.util.getName;

// utils
var humanize = require('./util/humanize');
var getOptionsOfEnum = require('./util/getOptionsOfEnum');
var uuid = require('./util/uuid');

module.exports = {
  getFactory: getFactory,
  textbox:    textbox,
  checkbox:   checkbox,
  select:     select,
  radio:      radio,
  struct:     struct,
  list:       list
};

//
// default configuration
//

config.kinds = {
  irriducible: function (type, opts) {
    var name = getName(type);
    return config.irriducibles.hasOwnProperty(name) ?
      config.irriducibles[name](opts) :
      textbox; // fallback on textbox
  },
  enums:    function () { return select; },
  struct:   function () { return struct; },
  list:     function () { return list; },
  maybe:    function (type, opts) { return getFactory(type.meta.type, opts); },
  subtype:  function (type, opts) { return getFactory(type.meta.type, opts); }
};

config.irriducibles = {
  Bool: function (opts) { return checkbox; }
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
// input factories
//

var REF = 'input';

function textbox(opts, ctx) {

  opts = new api.Textbox(opts || {});
  var report = ctx.report;

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

  var transformer = opts.transformer;
  if (!transformer) {
    // lookup a suitable transformer
    transformer = config.transformers[getName(report.innerType)];
  }

  var template = opts.template || ctx.templates.textbox;

  return React.createClass({

    displayName: ctx.getDefaultDisplayName(),

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
      var value = this.getRawValue();
      var result = t.validate(value, report.type);
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

      return template(new style.Textbox({
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
        message: getMessage(opts, this.state)
      }));
    }
  });
}

function checkbox(opts, ctx) {

  opts = new api.Checkbox(opts || {});
  var report = ctx.report;

  // checkboxes must always have a label
  var label = opts.label;
  if (!label) {
    label = ctx.getDefaultLabel();
  }

  var name = opts.name || ctx.getDefaultName();

  var value = !!either(opts.value, ctx.value);

  var template = opts.template || ctx.templates.checkbox;

  return React.createClass({

    displayName: ctx.getDefaultDisplayName(),

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
      var value = this.getRawValue();
      var result = t.validate(value, report.type);
      this.setState({
        hasError: !result.isValid(),
        value: result.value
      });
      return result;
    },

    render: function () {

      return template(new style.Checkbox({
        ref: REF,
        name: name,
        label: label,
        help: opts.help,
        disabled: opts.disabled,
        hasError: this.state.hasError,
        value: this.state.value,
        message: getMessage(opts, this.state)
      }));
    }
  });
}

function select(opts, ctx) {

  opts = new api.Select(opts || {});
  var report = ctx.report;
  var enumType = report.innerType;

  // handle `multiple` attribute
  var multiple = false;
  if (getKind(enumType) === 'list') {
    multiple = true;
    report = api.Context.getReport(enumType.meta.type);
    enumType = report.innerType;
  }

  var label = opts.label;
  if (!label && ctx.auto === 'labels') {
    label = ctx.getDefaultLabel();
  }

  var name = opts.name || ctx.getDefaultName();

  var value = either(opts.value, ctx.value);

  var options = opts.options ?
    opts.options.slice() :
    getOptionsOfEnum(enumType);

  // sort opts
  if (opts.order) {
    options.sort(api.Order.getComparator(opts.order));
  }

  // add the empty option in first position
  var nullOption = opts.nullOption || {value: '', text: '-'};
  options.unshift(nullOption);

  var template = opts.template || ctx.templates.select;

  return React.createClass({

    displayName: ctx.getDefaultDisplayName(),

    getInitialState: function () {
      return {
        hasError: !!opts.hasError,
        value: value
      };
    },

    getRawValue: function () {

      assert(!Nil.is(this.refs[REF]), 'missing `ref` for input `%s`, check out its template', name);

      var select = this.refs[REF].getDOMNode();
      var value;

      if (multiple) {
        value = [];
        for (var i = 0, len = select.options.length ; i < len ; i++ ) {
            var option = select.options[i];
            if (option.selected) {
              value.push(option.value);
            }
        }
        return value;
      }

      value = select.value;
      if (value === nullOption.value) {
        value = null;
      }
      return value;
    },

    getValue: function () {
      var value = this.getRawValue();
      var result = t.validate(value, report.type);
      this.setState({
        hasError: !result.isValid(),
        value: result.value
      });
      return result;
    },

    render: function () {

      return template(new style.Select({
        ref: REF,
        name: name,
        label: label,
        help: opts.help,
        options: options,
        disabled: opts.disabled,
        hasError: this.state.hasError,
        value: this.state.value,
        message: getMessage(opts, this.state),
        multiple: multiple
      }));
    }
  });
}

function radio(opts, ctx) {

  opts = new api.Radio(opts || {});
  var report = ctx.report;

  // radios must always have a label
  var label = opts.label;
  if (!label) {
    label = ctx.getDefaultLabel();
  }

  var name = opts.name || ctx.getDefaultName();

  var value = either(opts.value, ctx.value);

  var options = opts.opts;
  if (!options) {
    options = getOptionsOfEnum(report.innerType);
  }

  // sort opts
  if (opts.order) {
    options.sort(api.Order.getComparator(opts.order));
  }

  var template = opts.template || ctx.templates.radio;

  return React.createClass({

    displayName: ctx.getDefaultDisplayName(),

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
      var value = this.getRawValue();
      var result = t.validate(value, report.type);
      this.setState({
        hasError: !result.isValid(),
        value: result.value
      });
      return result;
    },

    render: function () {

      return template(new style.Radio({
        ref: REF,
        name: name,
        label: label,
        help: opts.help,
        options: options,
        hasError: this.state.hasError,
        value: this.state.value,
        message: getMessage(opts, this.state)
      }));
    }
  });
}

function struct(opts, ctx) {

  opts = new api.Struct(opts || {});
  var report = ctx.report;

  assert(!report.maybe, 'maybe structs are not (yet) supported');
  assert(getKind(report.innerType) === 'struct', 'struct must be called with a struct');

  var props = report.innerType.meta.props;
  var order = opts.order || Object.keys(props);
  var auto = opts.auto || ctx.auto;
  var i18n = opts.i18n || ctx.i18n;
  var value = opts.value || ctx.value || {};

  var label = opts.label;
  if (!label && auto !== 'none') {
    label = ctx.getDefaultLabel();
  }

  var templates = opts.templates || ctx.templates;

  var fields = opts.fields || {};
  var components = {};
  order.forEach(function (prop) {
    if (props.hasOwnProperty(prop)) {
      var factory = getFactory(props[prop], fields[prop]);
      var Component = factory(fields[prop], new api.Context({
        templates: templates,
        i18n: i18n,
        report: new api.Context.getReport(props[prop]),
        path: ctx.path.concat(prop),
        auto: auto,
        label: humanize(prop),
        value: value[prop]
      }));
      components[prop] = Component;
    }
  });

  var template = opts.template || templates.struct;

  return React.createClass({

    displayName: ctx.getDefaultDisplayName(),

    getInitialState: function () {
      return {
        hasError: !!opts.hasError
      };
    },

    getValue: function () {

      var value = {};
      var errors = [];
      var result;

      for (var ref in components) {
        if (components.hasOwnProperty(ref)) {
          assert(!Nil.is(this.refs[ref]), 'missing `ref` for input `%s`, check out its template', ref);
          result = this.refs[ref].getValue();
          errors = errors.concat(result.errors);
          value[ref] = result.value;
        }
      }

      // handle subtype
      if (report.subtype && errors.length === 0) {
        this.setState({hasError: false});
        value = new report.innerType(value);
        result = t.validate(value, report.type);
        errors = errors.concat(result.errors);
        this.setState({hasError: errors.length > 0});
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

      return template(new style.Struct({
        label: label,
        help: opts.help,
        order: order,
        inputs: inputs,
        hasError: this.state.hasError,
        message: getMessage(opts, this.state)
      }));
    }
  });
}

function list(opts, ctx) {

  opts = new api.List(opts || {});
  var report = ctx.report;

  assert(!report.maybe, 'maybe lists are not (yet) supported');
  assert(getKind(report.innerType) === 'list', 'list must be called with not a list');

  var auto = opts.auto || ctx.auto;
  var i18n = opts.i18n || ctx.i18n;
  var value = opts.value || ctx.value || [];

  var label = opts.label;
  if (!label && auto !== 'none') {
    label = ctx.getDefaultLabel();
  }

  var templates = opts.templates || ctx.templates;

  var itemType = report.innerType.meta.type;
  var itemFactory = getFactory(itemType, opts.item);
  var getComponent = function (value, i) {
    return itemFactory(opts.item, new api.Context({
      templates: templates,
      i18n: i18n,
      report: api.Context.getReport(itemType),
      path: ctx.path.concat(i),
      auto: auto,
      label: '#' + (i + 1),
      value: value
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

  var template = opts.template || templates.list;

  return React.createClass({

    displayName: ctx.getDefaultDisplayName(),

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
        assert(!Nil.is(this.refs[i]), 'missing `ref` for input `%s`, check out its template', i);
        result = this.refs[i].getValue();
        errors = errors.concat(result.errors);
        value.push(result.value);
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

    add: function (evt) {
      evt.preventDefault();
      components.push({
        Component: getComponent(null, components.length - 1),
        key: uuid()
      });
      this.forceUpdate();
    },

    remove: function (i, evt) {
      evt.preventDefault();
      components.splice(i, 1);
      this.forceUpdate();
    },

    up: function (i, evt) {
      evt.preventDefault();
      if (i > 0) {
        move(components, i, i - 1);
        this.forceUpdate();
      }
    },

    down: function (i, evt) {
      evt.preventDefault();
      if (i < components.length - 1) {
        move(components, i, i + 1);
        this.forceUpdate();
      }
    },

    render: function () {

      var items = components.map(function getItem(item, i) {

        var buttons = [];
        if (!opts.disabledRemove) { buttons.push({ label: i18n.remove, click: this.remove.bind(this, i) }); }
        if (!opts.disableOrder)   { buttons.push({ label: i18n.up, click: this.up.bind(this, i) }); }
        if (!opts.disableOrder)   { buttons.push({ label: i18n.down, click: this.down.bind(this, i) }); }

        return {
          input: React.createElement(item.Component, {ref: i, key: item.key}),
          key: item.key,
          buttons: buttons
        };
      }.bind(this));

      return template(new style.List({
        label: label,
        help: opts.help,
        add: opts.disableAdd ? null : {
          label: i18n.add,
          click: this.add
        },
        items: items,
        hasError: this.state.hasError,
        message: getMessage(opts, this.state)
      }));
    }
  });
}

//
// helpers
//

function either(a, b) {
  return t.Nil.is(a) ? b : a;
}

function move(arr, fromIndex, toIndex) {
  var element = arr.splice(fromIndex, 1)[0];
  arr.splice(toIndex, 0, element);
}

function getMessage(opts, state) {
  if (!state.hasError) {
    return null;
  }
  var message = opts.message;
  if (t.Func.is(message)) {
    message = message(state.value);
  }
  return message;
}


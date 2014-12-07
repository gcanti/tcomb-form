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
  textbox:    textboxFactory,
  checkbox:   checkboxFactory,
  select:     selectFactoryDispatcher,
  struct:     structFactory,
  list:       listFactory
};

//
// default configuration
//

config.kinds = {
  irriducible: function (type, opts) {
    var name = getName(type);
    if (config.irriducibles.hasOwnProperty(name)) {
      return config.irriducibles[name](opts);
    }
    // fallback on textbox
    return textboxFactory;
  },
  enums:    function (type, opts) { return selectFactoryDispatcher; },
  maybe:    function (type, opts) { return getFactory(type.meta.type, opts); },
  subtype:  function (type, opts) { return getFactory(type.meta.type, opts); },
  struct:   function (type, opts) { return structFactory; },
  list:     function (type, opts) { return listFactory; }
};

config.irriducibles = {
  Bool: function (opts) { return checkboxFactory; }
};

config.renderAs = {
  select: selectFactory,
  radio: radioFactory
};

config.transformers = {
  Num: new api.Transformer({
    format: function (value) {
      return Nil.is(value) ? value : String(value);
    },
    parse: function (value) {
      var n = parseFloat(value);
      return isNaN(n) ? null : n;
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
  if (opts.input) {

    assert(t.Func.is(opts.input), 'invalid `input` option, must be a function with signature (opts, [ctx]) -> React Class');

    return opts.input;
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

function getValueFactory(type, name) {
  return function getValue() {

    assert(!Nil.is(this.refs[REF]), 'missing `ref` for input `%s`, checkout its template', name);

    var value = this.getRawValue();
    var result = t.validate(value, type);
    this.setState({
      hasError: !result.isValid(),
      value: result.value
    });
    return result;
  };
}

function textboxFactory(opts, ctx) {

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

  var template = opts.template || config.style.textbox;

  return React.createClass({

    displayName: ctx.getDisplayName(),

    getInitialState: function () {
      return {
        hasError: !!opts.hasError,
        value: value
      };
    },

    getRawValue: function () {
      var value = this.refs[REF].getDOMNode().value.trim() || null;
      if (transformer) {
        value = transformer.parse(value);
      }
      return value;
    },

    getValue: getValueFactory(report.type, name),

    render: function () {

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
        value: this.state.value,
        message: getMessage(opts, this.state),
        addonBefore: opts.addonBefore,
        addonAfter: opts.addonAfter,
        horizontal: ctx.horizontal
      }));
    }
  });
}

function checkboxFactory(opts, ctx) {

  opts = new api.Checkbox(opts || {});

  // checkboxes must always have a label
  var label = opts.label;
  if (!label) {
    label = ctx.getDefaultLabel();
  }

  var name = opts.name || ctx.getDefaultName();

  var value = !!either(opts.value, ctx.value);

  var template = opts.template || config.style.checkbox;

  return React.createClass({

    displayName: ctx.getDisplayName(),

    getInitialState: function () {
      return {
        hasError: !!opts.hasError,
        value: value
      };
    },

    getRawValue: function () {
      return this.refs[REF].getDOMNode().checked;
    },

    getValue: getValueFactory(report.type, name),

    render: function () {

      return template(new style.Checkbox({
        ref: REF,
        name: name,
        label: label,
        help: opts.help,
        disabled: opts.disabled,
        hasError: this.state.hasError,
        value: this.state.value,
        message: getMessage(opts, this.state),
        horizontal: ctx.horizontal
      }));
    }
  });
}

function selectFactoryDispatcher(opts, ctx) {

  opts = new api.Select(opts || {});

  var renderAs = opts.renderAs || 'select';

  assert(config.renderAs.hasOwnProperty(renderAs), 'invalid `renderAs` option `%s` supplied to api.Select.renderers', renderAs);

  return config.renderAs[renderAs](opts, ctx);
}

function selectFactory(opts, ctx) {

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
  options.unshift(opts.emptyOption || {value: '', text: '-'});

  var template = opts.template || config.style.select;

  return React.createClass({

    displayName: ctx.getDisplayName(),

    getInitialState: function () {
      return {
        hasError: !!opts.hasError,
        value: value
      };
    },

    getRawValue: function () {
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
      if (opts.emptyOption && (value === opts.emptyOption.value)) {
        value = null;
      }
      return value;
    },

    getValue: getValueFactory(report.type, name),

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
        multiple: multiple,
        horizontal: ctx.horizontal
      }));
    }
  });
}

function radioFactory(opts, ctx) {

  opts = opts || {};
  var report = ctx.report;

  var label = opts.label;
  if (!label && ctx.auto === 'labels') {
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

  var template = opts.template || config.style.radio;

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
        var node = this.refs[REF + i].getDOMNode();
        if (node.checked) {
          value = node.value;
          break;
        }
      }

      return value;
    },

    getValue: getValueFactory(report.type, name),

    render: function () {

      return template(new style.Radio({
        ref: REF,
        name: name,
        label: label,
        help: opts.help,
        options: options,
        hasError: this.state.hasError,
        value: this.state.value,
        message: getMessage(opts, this.state),
        horizontal: ctx.horizontal
      }));
    }
  });
}

function structFactory(opts, ctx) {

  opts = new api.Struct(opts || {});
  var report = ctx.report;

  assert(!report.maybe, 'maybe structs are not (yet) supported');
  assert(getKind(report.innerType) === 'struct', 'structFactory must be called with a struct');

  var props = report.innerType.meta.props;
  var order = opts.order || Object.keys(props);
  var auto = opts.auto || ctx.auto;
  var i18n = opts.i18n || ctx.i18n;
  var value = ctx.value || opts.value || {};

  var label = opts.label;
  if (!label && auto !== 'none') {
    label = ctx.getDefaultLabel();
  }

  var horizontal = either(opts.horizontal, ctx.horizontal);

  var fields = opts.fields || {};
  var components = {};
  order.forEach(function (prop) {
    if (props.hasOwnProperty(prop)) {
      var factory = getFactory(props[prop], fields[prop]);
      var Component = factory(fields[prop], new api.Context({
        report: new api.Context.getReport(props[prop]),
        i18n: i18n,
        auto: auto,
        path: ctx.path.concat(prop),
        value: value[prop],
        defaultLabel: humanize(prop),
        horizontal: horizontal
      }));
      components[prop] = Component;
    }
  });

  var template = opts.template || config.style.struct;

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

      for (var ref in components) {
        if (components.hasOwnProperty(ref)) {
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
        message: getMessage(opts, this.state),
        horizontal: horizontal
      }));
    }
  });
}

function listFactory(opts, ctx) {

  opts = new api.List(opts || {});
  var report = ctx.report;

  assert(!report.maybe, 'maybe lists are not (yet) supported');
  assert(getKind(report.innerType) === 'list', 'listFactory must be called with not a list');

  var auto = opts.auto || ctx.auto;
  var i18n = opts.i18n || ctx.i18n;
  var value = ctx.value || opts.value || [];

  var label = opts.label;
  if (!label && auto !== 'none') {
    label = ctx.getDefaultLabel();
  }

  var horizontal = either(opts.horizontal, ctx.horizontal);
  var itemType = report.innerType.meta.type;
  var itemFactory = getFactory(itemType, opts.item);
  var getComponent = function getComponent(value, i) {
    return itemFactory(opts.item, new api.Context({
      report: api.Context.getReport(itemType),
      i18n: i18n,
      auto: auto,
      path: ctx.path.concat(i),
      value: value,
      defaultLabel: '#' + (i + 1),
      horizontal: horizontal
    }));
  };

  // for lists it's very important to set the keys correctly
  // otherwise React will re-render the inputs
  // losing their states (hasError and value)

  // [mutable]
  var components = value.map(function (value, i) {
    return {
      component: getComponent(value, i),
      key: uuid() // every component is associed with a unique generated key
    };
  });

  var template = opts.template || config.style.list;

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
        component: getComponent(null, components.length - 1),
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

      var rows = components.map(function getRow(row, i) {

        var buttons = [];
        if (!opts.disabledRemove) { buttons.push({ label: i18n.remove, click: this.remove.bind(this, i) }); }
        if (!opts.disableOrder)   { buttons.push({ label: i18n.up, click: this.up.bind(this, i) }); }
        if (!opts.disableOrder)   { buttons.push({ label: i18n.down, click: this.down.bind(this, i) }); }

        return {
          component: React.createElement(row.component, {ref: i, key: row.key}),
          key: row.key,
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
        rows: rows,
        hasError: this.state.hasError,
        message: getMessage(opts, this.state)
      }));
    }
  });
}

//
// helpers
//

api.Context.prototype.getDisplayName = function () {
  return this.getDefaultName() || 'top level';
};

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


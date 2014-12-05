'use strict';

var React = require('react');
var t = require('tcomb-validation');
var api = require('./protocols/api');
var style = require('./protocols/style');
var config = require('./config');
var util = require('./util');

var assert = t.assert;
var ValidationResult = t.ValidationResult;
var getKind = t.util.getKind;
var getName = t.util.getName;

module.exports = {
  getFactory: getFactory,
  textbox: textboxFactory,
  checkbox: checkboxFactory,
  select: selectFactoryDispatcher,
  struct: structFactory,
  list: listFactory
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
  enums: function (type, opts) { return selectFactoryDispatcher; },
  maybe: function (type, opts) { return getFactory(type.meta.type, opts); },
  subtype: function (type, opts) { return getFactory(type.meta.type, opts); },
  struct: function (type, opts) { return structFactory; },
  list: function (type, opts) { return listFactory; }
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
      return t.Nil.is(value) ? value : String(value);
    },
    parse: function (value) {
      var n = parseFloat(value);
      return isNaN(n) ? null : n;
    }
  })
};

function getFactory(type, opts) {
  opts = opts || {};
  // [extension point]
  if (opts.factory) {
    return opts.factory;
  }
  var kind = getKind(type);
  if (config.kinds.hasOwnProperty(kind)) {
    return config.kinds[kind](type, opts);
  }
  t.fail(t.util.format('cannot handle type %s', getName(type)));
}

function textboxFactory(type, opts, ctx) {

  type = t.Type(type);
  opts = new api.Textbox(opts || {});
  ctx = new api.Context(ctx);
  var report = util.getReport(type);

  var label = opts.label;
  if (!label && ctx.auto === 'labels') {
    label = ctx.defaultLabel;
    if (report.isMaybe) {
      label += ctx.i18n.optional;
    }
  }

  // labels have priority over placeholders
  var placeholder = null;
  if (!label && ctx.auto !== 'none') {
    var placeholder = opts.placeholder || ctx.defaultLabel;
    if (placeholder && report.isMaybe) {
      placeholder += ctx.i18n.optional;
    }
  }

  var name = opts.name || util.getNameAttribute(ctx);

  var value = either(ctx.value, opts.value);

  var transformer = opts.transformer;
  if (!transformer) {
    // search in config a suitable transformer
    var lastName = getName(report.last);
    if (config.transformers.hasOwnProperty(lastName)) {
      transformer = config.transformers[lastName];
    }
  }

  var Textbox = React.createClass({

    getInitialState: function () {
      return {
        hasError: !!opts.hasError,
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

      return config.style.textbox(new style.Textbox({
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
        message: getMessage(opts, this.state)
      }));
    }

  });

  return Textbox;

}

function checkboxFactory(type, opts, ctx) {

  type = t.Type(type);
  opts = new api.Checkbox(opts || {});
  ctx = new api.Context(ctx);

  // checkboxes must always have a label
  var label = opts.label;
  if (!label) {
    label = ctx.defaultLabel;
  }

  var name = opts.name || util.getNameAttribute(ctx);

  var value = !!either(ctx.value, opts.value);

  var Checkbox = React.createClass({

    getInitialState: function () {
      return {
        hasError: !!opts.hasError,
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

      return config.style.checkbox(new style.Checkbox({
        ref: 'input',
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

  return Checkbox;

}

function selectFactoryDispatcher(type, opts, ctx) {

  type = t.Type(type);
  opts = new api.Select(opts || {});
  ctx = new api.Context(ctx);

  var renderAs = opts.renderAs || 'select';
  assert(config.renderAs.hasOwnProperty(renderAs), 'invalid `renderAs` option `%s` supplied to api.Select.renderers', renderAs);
  return config.renderAs[renderAs](type, opts, ctx);
}

function selectFactory(type, opts, ctx) {

  var report = util.getReport(type);
  var enumType = report.last;

  // handle multiple attribute
  var multiple = false;
  if (getKind(enumType) === 'list') {
    multiple = true;
    report = util.getReport(enumType.meta.type);
    enumType = report.last;
  }

  var label = opts.label;
  if (!label && ctx.auto === 'labels') {
    label = ctx.defaultLabel;
    if (report.isMaybe) {
      label += ctx.i18n.optional;
    }
  }

  var name = opts.name || util.getNameAttribute(ctx);

  var value = either(ctx.value, opts.value);

  var options = opts.options ?
    opts.options.slice() :
    util.getOptionsOfEnum(enumType);

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
        hasError: !!opts.hasError,
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
      var select = this.refs.input.getDOMNode();
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

    render: function () {

      return config.style.select(new style.Select({
        ref: 'input',
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

  return Select;

}

function radioFactory(type, opts, ctx) {

  opts = opts || {};
  var report = util.getReport(type);

  var label = opts.label;
  if (!label && ctx.auto === 'labels') {
    label = ctx.defaultLabel;
    if (report.isMaybe) {
      label += ctx.i18n.optional;
    }
  }

  var name = opts.name || util.getNameAttribute(ctx);

  var value = either(ctx.value, opts.value);

  var options = opts.opts;
  if (!options) {
    options = util.getOptionsOfEnum(report.last);
  }

  if (opts.order) {
    // sort opts
    options.sort(api.Order.meta.map[opts.order]);
  }

  var Select = React.createClass({

    getInitialState: function () {
      return {
        hasError: !!opts.hasError,
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

      return config.style.radio(new style.Radio({
        ref: 'input',
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

  return Select;

}

function structFactory(type, opts, ctx) {

  type = t.Type(type);
  opts = new api.Struct(opts || {});
  ctx = new api.Context(ctx);
  var report = util.getReport(type);

  assert(!report.isMaybe, 'maybe structs are not (yet) supported');
  assert(getKind(report.last) === 'struct');

  var props = report.last.meta.props;
  var order = opts.order || Object.keys(props);
  var auto = opts.auto || ctx.auto;
  var i18n = opts.i18n || ctx.i18n;
  var value = ctx.value || opts.value || {};

  var label = opts.label;
  if (!label && auto !== 'none') {
    label = ctx.defaultLabel;
  }

  var fields = opts.fields || {};
  var components = {};
  for (var k in props) {
    if (props.hasOwnProperty(k)) {
      var factory = getFactory(props[k], fields[k]);
      var Component = factory(props[k], fields[k], {
        i18n: i18n,
        auto: auto,
        path: ctx.path.concat(k),
        value: value[k],
        defaultLabel: util.humanize(k)
      });
      components[k] = Component;
    }
  }

  var Struct = React.createClass({

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

      return new ValidationResult({errors: errors, value: value});
    },

    render: function () {

      var rows = order.map(function (name, i) {
        return React.createElement(components[name], {ref: name, key: name});
      });

      return config.style.struct(new style.Struct({
        label: label,
        help: opts.help,
        rows: rows,
        hasError: this.state.hasError,
        message: getMessage(opts, this.state)
      }));
    }
  });

  return Struct;
}

function listFactory(type, opts, ctx) {

  type = t.Type(type);
  opts = new api.List(opts || {});
  ctx = new api.Context(ctx);
  var report = util.getReport(type);

  assert(!report.isMaybe, 'maybe lists are not (yet) supported');
  assert(getKind(report.last) === 'list');

  var auto = opts.auto || ctx.auto;
  var i18n = opts.i18n || ctx.i18n;
  var value = ctx.value || opts.value || [];

  var label = opts.label;
  if (!label && auto !== 'none') {
    label = ctx.defaultLabel;
  }

  var itemType = report.last.meta.type;
  var itemFactory = getFactory(itemType, opts.item);
  var getComponent = function getComponent(value, i) {
    return itemFactory(itemType, opts.item, {
      i18n: i18n,
      auto: auto,
      path: ctx.path.concat(i),
      value: value,
      defaultLabel: '#' + (i + 1)
    });
  };
  var components = value.map(function (value, i) {
    return {
      component: getComponent(value, i),
      key: util.uuid()
    };
  });

  var List = React.createClass({

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

      return new ValidationResult({errors: errors, value: value});
    },

    add: function (evt) {
      evt.preventDefault();
      components.push({
        component: getComponent(null, components.length - 1),
        key: util.uuid()
      });
      this.forceUpdate();
    },

    remove: function (i, evt) {
      evt.preventDefault();
      components = util.array.remove(components, i);
      this.forceUpdate();
    },

    up: function (i, evt) {
      evt.preventDefault();
      if (i > 0) {
        components = util.array.moveUp(components, i);
        this.forceUpdate();
      }
    },

    down: function (i, evt) {
      evt.preventDefault();
      if (i < components.length - 1) {
        components = util.array.moveDown(components, i);
        this.forceUpdate();
      }
    },

    render: function () {

      var rows = components.map(function getRow(row, i) {

        var buttons = [];
        if (!opts.disabledRemove) { buttons.push({ label: i18n.remove, click: this.remove.bind(this, i) }); }
        if (!opts.disableOrder) { buttons.push({ label: i18n.up, click: this.up.bind(this, i) }); }
        if (!opts.disableOrder) { buttons.push({ label: i18n.down, click: this.down.bind(this, i) }); }

        return {
          component: React.createElement(row.component, {ref: i, key: row.key}),
          key: row.key,
          buttons: buttons
        };
      }.bind(this));

      return config.style.list(new style.List({
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

  return List;

}

function either(a, b) {
  return t.Nil.is(a) ? b : a;
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


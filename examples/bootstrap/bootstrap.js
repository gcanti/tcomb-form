(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React = require('react');
var t = require('../../.');

var Country = t.enums({
  IT: 'Italy',
  US: 'United States'
}, 'Country');

var Gender = t.enums({
  M: 'Male',
  F: 'Female'
}, 'Gender');

var Registration = t.struct({
  username: t.Str,
  password: t.Str,
  name: t.maybe(t.Str),
  surname: t.maybe(t.Str),
  rememberMe: t.Bool,
  age: t.Num,
  country: t.maybe(Country),
  gender: t.maybe(Gender),
  tags: t.list(t.Str)
}, 'Registration');

var Form = t.form.create(Registration, {
  label: 'Registration',
  auto: 'labels',
  fields: {
    password: {
      type: 'password'
    },
    country: {
      //nullOption: {value: '', text: 'Choose your country'}
    },
    gender: {
      factory: t.form.radio
    }
  }
});

// rendering
var App = React.createClass({displayName: 'App',

  onClick: function(evt) {
    evt.preventDefault();
    var values = this.refs.form.getValue();
    if (values) {
      document.getElementById('value').innerHTML = JSON.stringify(values, null, 2);
    }
  },

  render: function() {
    return (
      React.createElement("form", {onSubmit: this.onClick, className: "grid-form"}, 
        React.createElement(Form, {ref: "form"}), 
        React.createElement("div", {className: "form-group"}, 
          React.createElement("input", {type: "submit", className: "btn btn-primary", value: "Save"})
        )
      )
    );
  }
});

React.render(React.createElement(App, null), document.getElementById('app'));

},{"../../.":2,"react":"react"}],2:[function(require,module,exports){
var t = require('./lib');

// plug bootstrap style
t.form.config.templates = require('./lib/templates/bootstrap');

module.exports = t;
},{"./lib":6,"./lib/templates/bootstrap":9}],3:[function(require,module,exports){
var api = require('./protocols/api');

var i18n = new api.I18n({
  optional: ' (optional)',
  add: 'Add',
  remove: 'Remove',
  up: 'Up',
  down: 'Down'
});

module.exports = {
  i18n: i18n
};
},{"./protocols/api":7}],4:[function(require,module,exports){
'use strict';

var React = require('react');
var Context = require('./protocols/api').Context;
var config = require('./config');
var getFactory = require('./factories').getFactory;

module.exports = create;

function create(type, opts) {

  var factory = getFactory(type, opts);

  var Form = React.createClass({displayName: 'Form',

    // the public api returns `null` if validation failed
    // unless the optional boolean argument `raw` is set to `true`
    getValue: function (raw) {

      var result = this.refs.input.getValue();

      if (raw === true) { return result; }
      if (result.isValid()) { return result.value; }
      return null;
    },

    render: function () {

      var defaultContext = new Context({
        templates: config.templates,
        i18n: config.i18n,
        report: Context.getReport(type),
        path: [],
        auto: 'placeholders',
        label: '',
        value: this.props.value
      });
      var Component = factory(opts, defaultContext);

      return React.createElement(Component, {ref: 'input'});
    }
  });

  return Form;
}

},{"./config":3,"./factories":5,"./protocols/api":7,"react":"react"}],5:[function(require,module,exports){
'use strict';

var React =   require('react');
var t =       require('tcomb-validation');
var api =     require('./protocols/api');
var theme =   require('./protocols/theme');
var config =  require('./config');

var assert = t.assert;
var Nil = t.Nil;
var ValidationResult = t.ValidationResult;
var getKind = t.util.getKind;
var getName = t.util.getName;
var mixin = t.util.mixin;

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

var transformers = config.transformers = {
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
    // lookup for a suitable transformer
    transformer = transformers[getName(report.innerType)];
  }

  var config = merge(ctx.config, opts.config);

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

      return template(new theme.Textbox({
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
        message: getMessage(opts, this.state),
        config: config
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

  var config = merge(ctx.config, opts.config);

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

      return template(new theme.Checkbox({
        ref: REF,
        name: name,
        label: label,
        help: opts.help,
        disabled: opts.disabled,
        hasError: this.state.hasError,
        value: this.state.value,
        message: getMessage(opts, this.state),
        config: config
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

  var config = merge(ctx.config, opts.config);

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

      return template(new theme.Select({
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
        config: config
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

  var config = merge(ctx.config, opts.config);

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

      return template(new theme.Radio({
        ref: REF,
        name: name,
        label: label,
        help: opts.help,
        options: options,
        hasError: this.state.hasError,
        value: this.state.value,
        message: getMessage(opts, this.state),
        config: config
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

  var config = merge(ctx.config, opts.config);

  var templates = merge(ctx.templates, opts.templates);

  var fields = opts.fields || {};
  var components = {};
  order.forEach(function (prop) {
    if (props.hasOwnProperty(prop)) {
      var propType = props[prop];
      var propOpts = fields[prop] || {};
      var factory = getFactory(propType, propOpts);
      var Component = factory(propOpts, new api.Context({
        templates: templates,
        i18n: i18n,
        report: new api.Context.getReport(propType),
        path: ctx.path.concat(prop),
        auto: auto,
        label: humanize(prop),
        value: value[prop],
        config: merge(config, propOpts.config)
      }));
      components[prop] = Component;
    }
  });

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

      for (var ref in this.refs) {
        if (this.refs.hasOwnProperty(ref)) {
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

      return templates.struct(new theme.Struct({
        label: label,
        help: opts.help,
        order: order,
        inputs: inputs,
        value: value,
        hasError: this.state.hasError,
        message: getMessage(opts, this.state),
        config: config
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

  var config = merge(ctx.config, opts.config);

  var templates = merge(ctx.templates, opts.templates);

  var itemType = report.innerType.meta.type;
  var itemOpts = opts.item || {};
  var itemFactory = getFactory(itemType, itemOpts);
  var getComponent = function (value, i) {
    return itemFactory(itemOpts, new api.Context({
      templates: templates,
      i18n: i18n,
      report: api.Context.getReport(itemType),
      path: ctx.path.concat(i),
      auto: auto,
      label: '#' + (i + 1),
      value: value,
      config: merge(config, itemOpts.config)
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

      return templates.list(new theme.List({
        label: label,
        help: opts.help,
        add: opts.disableAdd ? null : {
          label: i18n.add,
          click: this.addItem
        },
        items: items,
        value: value,
        hasError: this.state.hasError,
        message: getMessage(opts, this.state),
        config: config
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

function merge(a, b) {
  return mixin(mixin({}, a), b, true);
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


},{"./config":3,"./protocols/api":7,"./protocols/theme":8,"./util/getOptionsOfEnum":11,"./util/humanize":13,"./util/uuid":14,"react":"react","tcomb-validation":16}],6:[function(require,module,exports){
'use strict';

var t = require('tcomb-validation');
var create = require('./create');
var config = require('./config');
var factories = require('./factories');

t.form = t.util.mixin({
  create: create,
  config: config
}, factories);

module.exports = t;
},{"./config":3,"./create":4,"./factories":5,"tcomb-validation":16}],7:[function(require,module,exports){
'use strict';

var React = require('react');
var t = require('tcomb-validation');
var getReport = require('../util/getReport');

var Any = t.Any;
var Str = t.Str;
var Bool = t.Bool;
var Func = t.Func;
var Obj = t.Obj;
var maybe = t.maybe;
var list = t.list;
var struct = t.struct;
var union = t.union;

var Auto = t.enums.of('placeholders labels none', 'Auto');

// internationalization (labels)
var I18n = struct({
  optional: Str,  // suffix added to optional fields
  add: Str,       // add button for lists
  remove: Str,    // remove button for lists
  up: Str,        // move up button for lists
  down: Str       // move down button for lists
}, 'I18n');

var Report = struct({
  type: t.Type,
  maybe: maybe(Bool),
  subtype: maybe(Bool),
  innerType: maybe(t.Type)
}, 'Report');

var Templates = t.dict(Str, Func, 'Templates');

var Context = struct({
  templates: Templates,
  i18n: I18n,
  report: Report,
  path: list(union([Str, t.Num])),
  auto: Auto,
  label: Str,
  value: Any,
  config: maybe(Obj)
}, 'Context');

Context.getReport = getReport;

/*

  Proposals:

  - RFC 6901
  JavaScript Object Notation (JSON) Pointer
  http://tools.ietf.org/html/rfc6901

  - W3C HTML JSON form submission
  http://www.w3.org/TR/html-json-forms/

*/
Context.prototype.getDefaultName = function () {
  return this.path.join('/');
};

Context.prototype.getDefaultLabel = function () {
  return this.label + (this.report.maybe ? this.i18n.optional : '');
};

Context.prototype.getDefaultDisplayName = function () {
  return t.util.format('[`%s`, TcombFormInput]', (this.getDefaultName() || 'top level'));
};

var ReactElement = t.irriducible('ReactElement', React.isValidElement);

var Label = union([Str, ReactElement], 'Label');

var Message = union([Label, Func], 'Message');

var Option = t.struct({
  value: Str,
  text: Str
}, 'Option');

var OptGroup = t.struct({
  group: Str,
  options: list(Option)
}, 'OptGroup');

var SelectOption = union([Option, OptGroup], 'SelectOption');

SelectOption.dispatch = function (x) {
  if (x.hasOwnProperty('group')) { return OptGroup; }
  return Option;
};

var TypeAttr = t.enums.of('hidden text textarea password color date datetime datetime-local email month number range search tel time url week', 'TypeAttr');

var Transformer = struct({
  format: Func,
  parse: Func
}, 'Transformer');

var Textbox = struct({
  label: maybe(Label),
  help: maybe(Label),
  hasError: maybe(Bool),
  message: maybe(Message),
  type: maybe(TypeAttr),
  name: maybe(t.Str),
  placeholder: maybe(Str),
  value: Any,
  readOnly: maybe(Bool),
  disabled: maybe(Bool),
  transformer: maybe(Transformer),
  template: maybe(Func),
  config: maybe(Obj)
}, 'Textbox');

var Checkbox = struct({
  label: maybe(Label),
  help: maybe(Label),
  hasError: maybe(Bool),
  message: maybe(Message),
  name: maybe(t.Str),
  value: maybe(Bool),
  disabled: maybe(Bool),
  template: maybe(Func),
  config: maybe(Obj)
}, 'Checkbox');

function asc(a, b) {
  return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
}

var Order = t.enums({
  asc: asc,
  desc: function desc(a, b) {
    return -asc(a, b);
  }
}, 'Order');

Order.getComparator = function (order) {
  return Order.meta.map[order];
};

var Select = struct({
  label: maybe(Label),
  help: maybe(Label),
  hasError: maybe(Bool),
  message: maybe(Message),
  name: maybe(t.Str),
  value: maybe(Str),
  order: maybe(Order),
  options: maybe(list(SelectOption)),
  nullOption: maybe(Option),
  disabled: maybe(Bool),
  template: maybe(Func),
  config: maybe(Obj)
}, 'Select');

var Radio = struct({
  label: maybe(Label),
  help: maybe(Label),
  hasError: maybe(Bool),
  message: maybe(Message),
  name: maybe(t.Str),
  value: maybe(Str),
  order: maybe(Order),
  options: maybe(list(SelectOption)),
  template: maybe(Func),
  config: maybe(Obj)
}, 'Select');

var Struct = struct({
  i18n: maybe(I18n),
  value: maybe(Obj),
  auto: maybe(Auto),
  label: maybe(Label),
  help: maybe(Label),
  hasError: maybe(Bool),
  message: maybe(Message),
  order: maybe(list(Label)),
  fields: maybe(Obj),
  templates: maybe(Templates),
  config: maybe(Obj)
}, 'Struct');

var List = struct({
  i18n: maybe(I18n),
  value: maybe(t.Arr),
  auto: maybe(Auto),
  label: maybe(Label),
  help: maybe(Label),
  hasError: maybe(Bool),
  message: maybe(Message),
  item: maybe(Obj),
  disableAdd: maybe(Bool),
  disableRemove: maybe(Bool),
  disableOrder: maybe(Bool),
  templates: maybe(Templates),
  config: maybe(Obj)
}, 'List');

module.exports = {
  I18n: I18n,
  Context: Context,
  Transformer: Transformer,
  Textbox: Textbox,
  Checkbox: Checkbox,
  Select: Select,
  Radio: Radio,
  Struct: Struct,
  List: List
};
},{"../util/getReport":12,"react":"react","tcomb-validation":16}],8:[function(require,module,exports){
'use strict';

var React = require('react');
var t = require('tcomb-validation');
var Any = t.Any;
var Str = t.Str;
var Bool = t.Bool;
var Func = t.Func;
var Obj = t.Obj;
var maybe = t.maybe;
var list = t.list;
var struct = t.struct;
var union = t.union;

var ReactElement = t.irriducible('ReactElement', React.isValidElement);

var Label = union([Str, ReactElement], 'Label');

var Option = struct({
  value: Str,
  text: Str
}, 'Option');

var OptGroup = struct({
  group: Str,
  options: list(Option)
}, 'OptGroup');

var SelectOption = union([Option, OptGroup], 'SelectOption');

SelectOption.dispatch = function (x) {
  if (x.hasOwnProperty('group')) { return OptGroup; }
  return Option;
};

var TypeAttr = t.enums.of('hidden text textarea password color date datetime datetime-local email month number range search tel time url week', 'TypeAttr');

var Textbox = struct({
  ref: Str,
  type: TypeAttr,
  name: Str,
  placeholder: maybe(Str),
  label: maybe(Label),
  help: maybe(Label),
  readOnly: maybe(Bool),
  disabled: maybe(Bool),
  value: Any,
  hasError: maybe(Bool),
  message: maybe(Label),
  config: maybe(Obj)
}, 'Textbox');

var Checkbox = struct({
  ref: Str,
  name: Str,
  label: Label, // checkboxes must always have a label
  help: maybe(Label),
  disabled: maybe(Bool),
  value: Bool,
  hasError: maybe(Bool),
  message: maybe(Label),
  config: maybe(Obj)
}, 'Checkbox');

var Select = struct({
  ref: Str,
  name: Str,
  label: maybe(Label),
  help: maybe(Label),
  options: list(SelectOption),
  disabled: maybe(Bool),
  multiple: maybe(Bool),
  value: maybe(union([Str, list(Str)])), // handle multiple
  hasError: maybe(Bool),
  message: maybe(Label),
  config: maybe(Obj)
}, 'Select');

var Radio = struct({
  ref: Str,
  name: Str,
  label: maybe(Label),
  help: maybe(Label),
  options: list(Option),
  value: maybe(Str),
  hasError: maybe(Bool),
  message: maybe(Label),
  config: maybe(Obj)
}, 'Radio');

var Struct = struct({
  label: maybe(Label),
  help: maybe(Label),
  order: list(Label),
  inputs: t.dict(Str, ReactElement),
  value: Any,
  hasError: maybe(Bool),
  message: maybe(Label),
  config: maybe(Obj)
}, 'Struct');

var Button = struct({
  label: Str,
  click: Func
}, 'Button');

var ListItem = struct({
  input: ReactElement,
  key: Str,
  buttons: list(Button)
});

var List = struct({
  label: maybe(Label),
  help: maybe(Label),
  add: maybe(Button),
  items: list(ListItem),
  value: Any,
  hasError: maybe(Bool),
  message: maybe(Label),
  config: maybe(Obj)
});

module.exports = {
  Textbox: Textbox,
  Checkbox: Checkbox,
  Option: Option,
  OptGroup: OptGroup,
  Select: Select,
  Radio: Radio,
  Struct: Struct,
  List: List
};
},{"react":"react","tcomb-validation":16}],9:[function(require,module,exports){
'use strict';

var React = require('react');
var cx = require('react/lib/cx');
var util = require('./util');

module.exports = {
  textbox: textbox,
  checkbox: checkbox,
  select: select,
  radio: radio,
  struct: struct,
  list: list
};

function textbox(locals) {

  if (locals.type === 'hidden') {
    return util.getHiddenTextbox(locals);
  }

  var textbox = util.getTextbox(locals, 'form-control');
  var label = getLabel(locals);
  var error = getErrorBlock(locals);
  var help = getHelpBlock(locals);

  var groupClassName = {
    'form-group': true,
    'has-error': locals.hasError
  };

  return (
    React.createElement("div", {className: cx(groupClassName)}, 
      label, 
      textbox, 
      error, 
      help
    )
  );
}

function checkbox(locals) {

  var checkbox = (
    React.createElement("label", null, 
      util.getCheckbox(locals), " ", React.createElement("span", null, locals.label)
    )
  );
  var error = getErrorBlock(locals);
  var help = getHelpBlock(locals);

  var groupClassName = {
    'form-group': true,
    'has-error': locals.hasError
  };

  return (
    React.createElement("div", {className: cx(groupClassName)}, 
      React.createElement("div", {className: "checkbox"}, 
        checkbox, 
        error, 
        help
      )
    )
  );
}

function select(locals) {

  var select = util.getSelect(locals, 'form-control');
  var label = getLabel(locals);
  var error = getErrorBlock(locals);
  var help = getHelpBlock(locals);

  var groupClassName = {
    'form-group': true,
    'has-error': locals.hasError
  };

  return (
    React.createElement("div", {className: cx(groupClassName)}, 
      label, 
      select, 
      error, 
      help
    )
  );
}

function radio(locals) {

  var radios = locals.options.map(function (option, i) {
    return (
      React.createElement("div", {className: "radio", key: option.value}, 
        React.createElement("label", null, 
          
            util.getRadio({
              name: locals.name,
              value: option.value,
              defaultChecked: (option.value === locals.value),
              ref: locals.ref + i
            }), 
          
          option.text
        )
      )
    );
  });

  var label = getLabel(locals);
  var error = getErrorBlock(locals);
  var help = getHelpBlock(locals);

  var groupClassName = {
    'form-group': true,
    'has-error': locals.hasError
  };

  return (
    React.createElement("div", {className: cx(groupClassName)}, 
      label, 
      radios, 
      error, 
      help
    )
  );
}

function struct(locals) {

  var rows = locals.order.map(function (name) {
    // handle verbatims
    return locals.inputs.hasOwnProperty(name) ?
      locals.inputs[name] :
      name;
  });

  var legend = null;
  if (locals.label) {
    legend = React.createElement("legend", null, locals.label);
  }

  var className = {
    'has-error': locals.hasError
  };

  return (
    React.createElement("fieldset", {className: cx(className)}, 
      legend, 
      rows, 
      getErrorBlock(locals), 
      getHelpBlock(locals)
    )
  );
}

function list(locals) {

  var items = locals.items.map(function (item, i) {
    if (!item.buttons.length) {
      return (
        React.createElement("div", {className: "row", key: item.key}, 
          React.createElement("div", {className: "col-md-12"}, 
            item.input
          )
        )
      );
    }
    return (
      React.createElement("div", {className: "row", key: item.key}, 
        React.createElement("div", {className: "col-md-8"}, 
          item.input
        ), 
        React.createElement("div", {className: "col-md-4"}, 
          React.createElement("div", {className: "btn-group"}, 
            
              item.buttons.map(function (button, i) {
                return (
                  React.createElement("button", {className: "btn btn-default", onClick: button.click, key: i}, button.label)
                );
              })
            
          )
        )
      )
    );
  });

  var legend = null;
  if (locals.label) {
    legend = React.createElement("legend", null, locals.label);
  }

  var addButton = null;
  if (locals.add) {
    addButton = (
      React.createElement("div", {className: "form-group"}, 
        React.createElement("button", {className: "btn btn-default", onClick: locals.add.click}, locals.add.label)
      )
    );
  }

  var className = {
    'has-error': locals.hasError
  };

  return (
    React.createElement("fieldset", {className: cx(className)}, 
      legend, 
      items, 
      addButton, 
      getErrorBlock(locals), 
      getHelpBlock(locals)
    )
  );

}

function getLabel(locals) {
  if (!locals.label) { return; }
  return (
    React.createElement("label", {className: "control-label"}, 
      locals.label
    )
  );
}

function getHelpBlock(locals) {
  if (!locals.help) { return; }
  return (
    React.createElement("span", {className: "help-block"}, 
      locals.help
    )
  );
}

function getErrorBlock(locals) {
  if (!locals.message || !locals.hasError) { return; }
  return (
    React.createElement("span", {className: "help-block error-block"}, 
      locals.message
    )
  );
}

},{"./util":10,"react":"react","react/lib/cx":15}],10:[function(require,module,exports){
'use strict';

var React = require('react');
var theme = require('../protocols/theme');

module.exports = {
  getRadio: getRadio,
  getCheckbox: getCheckbox,
  getHiddenTextbox: getHiddenTextbox,
  getTextbox: getTextbox,
  getOption: getOption,
  getSelect: getSelect
};

function getRadio(locals) {
  return React.createElement("input", {type: "radio", 
    name: locals.name, 
    value: locals.value, 
    defaultChecked: locals.defaultChecked, 
    ref: locals.ref});
}

function getCheckbox(locals) {
  return React.createElement("input", {
    type: "checkbox", 
    name: locals.name, 
    defaultChecked: locals.defaultValue, 
    ref: locals.ref});
}

function getHiddenTextbox(locals) {
  return React.createElement("input", {
    type: "hidden", 
    name: locals.name, 
    defaultValue: locals.value, 
    ref: locals.ref});
}

function getTextbox(locals, className) {

  var type = locals.type;

  var attrs = {
    name: locals.name,
    type: (type === 'textarea') ? null : type,
    placeholder: locals.placeholder,
    className: className,
    defaultValue: locals.value,
    readOnly: locals.readOnly,
    disabled: locals.disabled,
    ref: locals.ref
  };

  return (type === 'textbox') ?
    React.createElement('textarea', attrs) :
    React.createElement('input', attrs);
}

function getOption(option, i) {
  return theme.Option.is(option) ?
    React.createElement("option", {value: option.value, key: option.value}, option.text) :
    React.createElement("optgroup", {label: option.group, key: option.group}, 
      option.options.map(getOption)
    )
}

function getSelect(locals, className) {
  return (
    React.createElement("select", {name: locals.name, 
      className: className, 
      defaultValue: locals.value, 
      disabled: locals.disabled, 
      multiple: locals.multiple, 
      ref: locals.ref}, 
      locals.options.map(getOption)
    )
  );
}

},{"../protocols/theme":8,"react":"react"}],11:[function(require,module,exports){
'use strict';

module.exports = getOptionsOfEnum;

function getOptionsOfEnum(type) {
  var map = type.meta.map;
  return Object.keys(map).map(function (k) {
    return {
      value: k,
      text: map[k]
    };
  });
}


},{}],12:[function(require,module,exports){
'use strict';

var t = require('tcomb-validation');

module.exports = getReport;

function getReport(type) {

  var innerType = type;
  var maybe = false;
  var subtype = false;
  var kind;

  while (true) {
    kind = t.util.getKind(innerType);
    if (kind === 'maybe') {
      maybe = true;
      innerType = innerType.meta.type;
      continue;
    }
    if (kind === 'subtype') {
      subtype = true;
      innerType = innerType.meta.type;
      continue;
    }
    break;
  }

  return {
    type: type,
    maybe: maybe,
    subtype: subtype,
    innerType: innerType
  };
}


},{"tcomb-validation":16}],13:[function(require,module,exports){
// thanks to https://github.com/epeli/underscore.string

module.exports = humanize;

function underscored(s){
  return s.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
}

function capitalize(s){
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function humanize(s){
  return capitalize(underscored(s).replace(/_id$/,'').replace(/_/g, ' '));
}

},{}],14:[function(require,module,exports){
'use strict';

module.exports = uuid;

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

},{}],15:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule cx
 */

/**
 * This function is used to mark string literals representing CSS class names
 * so that they can be transformed statically. This allows for modularization
 * and minification of CSS class names.
 *
 * In static_upstream, this function is actually implemented, but it should
 * eventually be replaced with something more descriptive, and the transform
 * that is used in the main stack should be ported for use elsewhere.
 *
 * @param string|object className to modularize, or an object of key/values.
 *                      In the object case, the values are conditions that
 *                      determine if the className keys should be included.
 * @param [string ...]  Variable list of classNames in the string case.
 * @return string       Renderable space-separated CSS className.
 */
function cx(classNames) {
  if (typeof classNames == 'object') {
    return Object.keys(classNames).filter(function(className) {
      return classNames[className];
    }).join(' ');
  } else {
    return Array.prototype.join.call(arguments, ' ');
  }
}

module.exports = cx;

},{}],16:[function(require,module,exports){
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['tcomb'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('tcomb'));
  } else {
    root.t = factory(root.t);
  }
}(this, function (t) {

  'use strict';

  var Any = t.Any;
  var Obj = t.Obj;
  var Str = t.Str;
  var Arr = t.Arr;
  var struct = t.struct;
  var list = t.list;
  var format = t.util.format;

  //
  // domain model
  //

  var ValidationError = struct({
    message: Str,
    actual: Any,
    expected: t.Type,
    path: list(t.union([Str, t.Num]))
  }, 'ValidationError');

  function getDefaultMessage(actual, expected, path) {
    return format('%s is `%j` should be a `%s`', '/' + path.join('/'), actual, expected.meta.name);
  }

  ValidationError.of = function of(actual, expected, path) {
    return new ValidationError({
      message: getDefaultMessage(actual, expected, path),
      actual: actual,
      expected: expected,
      path: path
    });
  };

  var ValidationResult = struct({
    errors: list(ValidationError),
    value: Any
  }, 'ValidationResult');

  ValidationResult.prototype.isValid = function isValid() {
    return !(this.errors.length);
  };

  ValidationResult.prototype.firstError = function firstError() {
    return this.isValid() ? null : this.errors[0];
  };

  ValidationResult.prototype.toString = function toString() {
    return this.isValid() ?
      format('[ValidationResult, true, %j]', this.value) :
      format('[ValidationResult, false, (%s)]', this.errors.map(function errorToString(err) {
        return err.message;
      }).join(', '));
  };

  //
  // validate
  //

  function validate(x, type) {
    return new ValidationResult(recurse(x, type, []));
  }

  function recurse(x, type, path) {
    var kind = t.util.getKind(type);
    return validators[kind](x, type, path);
  }

  var validators = {};

  // irriducibles and enums
  validators.irriducible =
  validators.enums = function validateIrriducible(x, type, path) {
    return {
      value: x,
      errors: type.is(x) ? [] : [ValidationError.of(x, type, path)]
    };
  };

  validators.list = function validateList(x, type, path) {

    // x should be an array
    if (!Arr.is(x)) {
      return {value: x, errors: [ValidationError.of(x, type, path)]};
    }

    var ret = {value: [], errors: []};
    // every item should be of type `type.meta.type`
    for (var i = 0, len = x.length ; i < len ; i++ ) {
      var item = recurse(x[i], type.meta.type, path.concat(i));
      ret.value[i] = item.value;
      ret.errors = ret.errors.concat(item.errors);
    }
    return ret;
  };

  validators.subtype = function validateSubtype(x, type, path) {

    // x should be a valid inner type
    var ret = recurse(x, type.meta.type, path);
    if (ret.errors.length) {
      return ret;
    }

    // x should satisfy the predicate
    if (!type.meta.predicate(ret.value)) {
      ret.errors = [ValidationError.of(x, type, path)];
    }

    return ret;

  };

  validators.maybe = function validateMaybe(x, type, path) {
    return t.Nil.is(x) ?
      {value: null, errors: []} :
      recurse(x, type.meta.type, path);
  };

  validators.struct = function validateStruct(x, type, path) {

    // x should be an object
    if (!Obj.is(x)) {
      return {value: x, errors: [ValidationError.of(x, type, path)]};
    }

    // [optimization]
    if (type.is(x)) {
      return {value: x, errors: []};
    }

    var ret = {value: {}, errors: []};
    var props = type.meta.props;
    // every item should be of type `props[name]`
    for (var name in props) {
      if (props.hasOwnProperty(name)) {
        var prop = recurse(x[name], props[name], path.concat(name));
        ret.value[name] = prop.value;
        ret.errors = ret.errors.concat(prop.errors);
      }
    }
    if (!ret.errors.length) {
      ret.value = new type(ret.value);
    }
    return ret;
  };

  validators.tuple = function validateTuple(x, type, path) {

    var types = type.meta.types;
    var len = types.length;

    // x should be an array of at most `len` items
    if (!Arr.is(x) || x.length > len) {
      return {value: x, errors: [ValidationError.of(x, type, path)]};
    }

    var ret = {value: [], errors: []};
    // every item should be of type `types[i]`
    for (var i = 0 ; i < len ; i++ ) {
      var item = recurse(x[i], types[i], path.concat(i));
      ret.value[i] = item.value;
      ret.errors = ret.errors.concat(item.errors);
    }
    return ret;
  };

  validators.dict = function validateDict(x, type, path) {

    // x should be an object
    if (!Obj.is(x)) {
      return {value: x, errors: [ValidationError.of(x, type, path)]};
    }

    var ret = {value: {}, errors: []};
    // every key should be of type `domain`
    // every value should be of type `codomain`
    for (var k in x) {
      if (x.hasOwnProperty(k)) {
        path = path.concat(k);
        var key = recurse(k, type.meta.domain, path);
        var item = recurse(x[k], type.meta.codomain, path);
        ret.value[k] = item.value;
        ret.errors = ret.errors.concat(key.errors, item.errors);
      }
    }
    return ret;
  };

  validators.union = function validateUnion(x, type, path) {
    var ctor = type.dispatch(x);
    return t.Func.is(ctor)?
      recurse(x, ctor, path.concat(type.meta.types.indexOf(ctor))) :
      {value: x, errors: [ValidationError.of(x, type, path)]};
  };

  // exports
  t.util.mixin(t, {
    ValidationError: ValidationError,
    ValidationResult: ValidationResult,
    validate: validate
  });

  return t;

}));

},{"tcomb":17}],17:[function(require,module,exports){
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.t = factory();
  }
}(this, function () {

  'use strict';

  var failed = false;

  function onFail(message) {
    // start debugger only once
    if (!failed) {
      /*
        DEBUG HINT:
        if you are reading this, chances are that there is a bug in your system
        see the Call Stack to find out what's wrong..
      */
      /*jshint debug: true*/
      debugger;
    }
    failed = true;
    throw new Error(message);
  }

  var options = {
    onFail: onFail
  };

  function fail(message) {
    /*
      DEBUG HINT:
      if you are reading this, chances are that there is a bug in your system
      see the Call Stack to find out what's wrong..
    */
    options.onFail(message);
  }

  function assert(guard) {
    if (guard !== true) {
      var args = slice.call(arguments, 1);
      var message = args[0] ? format.apply(null, args) : 'assert failed';
      /*
        DEBUG HINT:
        if you are reading this, chances are that there is a bug in your system
        see the Call Stack to find out what's wrong..
      */
      fail(message);
    }
  }

  //
  // utils
  //

  var slice = Array.prototype.slice;

  function mixin(target, source, overwrite) {
    if (Nil.is(source)) {
      return target;
    }
    for (var k in source) {
      if (source.hasOwnProperty(k)) {
        if (overwrite !== true) {
          assert(!target.hasOwnProperty(k), 'cannot overwrite property %s', k);
        }
        target[k] = source[k];
      }
    }
    return target;
  }

  function format() {
    var args = slice.call(arguments);
    var len = args.length;
    var i = 1;
    var message = args[0];

    function formatArgument(match, type) {
      if (match === '%%') { return '%'; }       // handle escaping %
      if (i >= len) { return match; }           // handle less arguments than placeholders
      var formatter = format.formatters[type];
      if (!formatter) { return match; }         // handle undefined formatters
      return formatter(args[i++]);
    }

    var str = message.replace(/%([a-z%])/g, formatArgument);
    if (i < len) {
      str += ' ' + args.slice(i).join(' ');     // handle more arguments than placeholders
    }
    return str;
  }

  function replacer(key, value) {
    if (typeof value === 'function') {
      return format('Func', value.name);
    }
    return value;
  }

  format.formatters = {
    s: function formatString(x) { return String(x); },
    j: function formatJSON(x) {
      try {
        return JSON.stringify(x, replacer);
      } catch (e) {
        return String(x);
      }
    }
  };

  function getName(type) {
    assert(Type.is(type), 'Invalid argument `type` of value `%j` supplied to `getName()`, expected a type.', type);
    return type.meta.name;
  }

  function getKind(type) {
    assert(Type.is(type), 'Invalid argument `type` of value `%j` supplied to `geKind()`, expected a type.', type);
    return type.meta.kind;
  }

  function blockNew(x, type) {
    assert(!(x instanceof type), 'Operator `new` is forbidden for `%s`', getName(type));
  }

  function shallowCopy(x) {
    return Arr.is(x) ? x.concat() : Obj.is(x) ? mixin({}, x) : x;
  }

  function update(instance, spec) {
    assert(Obj.is(spec));
    var value = shallowCopy(instance);
    for (var k in spec) {
      if (spec.hasOwnProperty(k)) {
        if (update.commands.hasOwnProperty(k)) {
          assert(Object.keys(spec).length === 1);
          return update.commands[k](spec[k], value);
        } else {
          value[k] = update(value[k], spec[k]);
        }
      }
    }
    return value;
  }

  update.commands = {
    '$apply': function $apply(f, value) {
      assert(Func.is(f));
      return f(value);
    },
    '$push': function $push(elements, arr) {
      assert(Arr.is(elements));
      assert(Arr.is(arr));
      return arr.concat(elements);
    },
    '$remove': function $remove(keys, obj) {
      assert(Arr.is(keys));
      assert(Obj.is(obj));
      for (var i = 0, len = keys.length ; i < len ; i++ ) {
        delete obj[keys[i]];
      }
      return obj;
    },
    '$set': function $set(value) {
      return value;
    },
    '$splice': function $splice(splices, arr) {
      assert(list(Arr).is(splices));
      assert(Arr.is(arr));
      return splices.reduce(function reducer(acc, splice) {
        acc.splice.apply(acc, splice);
        return acc;
      }, arr);
    },
    '$swap': function $swap(config, arr) {
      assert(Obj.is(config));
      assert(Num.is(config.from));
      assert(Num.is(config.to));
      assert(Arr.is(arr));
      var element = arr[config.to];
      arr[config.to] = arr[config.from];
      arr[config.from] = element;
      return arr;
    },
    '$unshift': function $unshift(elements, arr) {
      assert(Arr.is(elements));
      assert(Arr.is(arr));
      return elements.concat(arr);
    },
    '$merge': function (obj, value) {
      return mixin(mixin({}, value), obj, true);
    }
  };

  //
  // irriducibles
  //

  function irriducible(name, is) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a string
    assert(typeof name === 'string', 'Invalid argument `name` supplied to `irriducible()`');

    // DEBUG HINT: if the debugger stops here, the second argument is not a function
    assert(typeof is === 'function', 'Invalid argument `is` supplied to `irriducible()`');

    function Irriducible(value) {

      // DEBUG HINT: if the debugger stops here, you have used the `new` operator but it's forbidden
      blockNew(this, Irriducible);

      // DEBUG HINT: if the debugger stops here, the first argument is invalid
      // mouse over the `value` variable to see what's wrong. In `name` there is the name of the type
      assert(is(value), 'Invalid `%s` supplied to `%s`', value, name);

      return value;
    }

    Irriducible.meta = {
      kind: 'irriducible',
      name: name
    };

    Irriducible.displayName = name;

    Irriducible.is = is;

    return Irriducible;
  }

  var Any = irriducible('Any', function isAny() {
    return true;
  });

  var Nil = irriducible('Nil', function isNil(x) {
    return x === null || x === void 0;
  });

  var Str = irriducible('Str', function isStr(x) {
    return typeof x === 'string';
  });

  var Num = irriducible('Num', function isNum(x) {
    return typeof x === 'number' && isFinite(x) && !isNaN(x);
  });

  var Bool = irriducible('Bool', function isBool(x) {
    return x === true || x === false;
  });

  var Arr = irriducible('Arr', function isArr(x) {
    return x instanceof Array;
  });

  var Obj = irriducible('Obj', function isObj(x) {
    return !Nil.is(x) && typeof x === 'object' && !Arr.is(x);
  });

  var Func = irriducible('Func', function isFunc(x) {
    return typeof x === 'function';
  });

  var Err = irriducible('Err', function isErr(x) {
    return x instanceof Error;
  });

  var Re = irriducible('Re', function isRe(x) {
    return x instanceof RegExp;
  });

  var Dat = irriducible('Dat', function isDat(x) {
    return x instanceof Date;
  });

  var Type = irriducible('Type', function isType(x) {
    return Func.is(x) && Obj.is(x.meta);
  });

  function struct(props, name) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a dict of types
    // mouse over the `props` variable to see what's wrong
    assert(dict(Str, Type).is(props), 'Invalid argument `props` supplied to `struct()`');

    // DEBUG HINT: if the debugger stops here, the second argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` supplied to `struct()`');

    // DEBUG HINT: always give a name to a type, the debug will be easier
    name = name || 'struct';

    function Struct(value, mut) {

      // makes Struct idempotent
      if (Struct.is(value)) {
        return value;
      }

      // DEBUG HINT: if the debugger stops here, the first argument is invalid
      // mouse over the `value` variable to see what's wrong. In `name` there is the name of the type
      assert(Obj.is(value), 'Invalid `%s` supplied to `%s`, expected an `Obj`', value, name);

      // makes `new` optional
      if (!(this instanceof Struct)) {
        return new Struct(value, mut);
      }

      for (var k in props) {
        if (props.hasOwnProperty(k)) {
          var expected = props[k];
          var actual = value[k];
          // DEBUG HINT: if the debugger stops here, the `actual` value supplied to the `expected` type is invalid
          // mouse over the `actual` and `expected` variables to see what's wrong
          this[k] = expected(actual, mut);
        }
      }

      if (mut !== true) {
        Object.freeze(this);
      }
    }

    Struct.meta = {
      kind: 'struct',
      props: props,
      name: name
    };

    Struct.displayName = name;

    Struct.is = function isStruct(x) {
      return x instanceof Struct;
    };

    Struct.update = function updateStruct(instance, spec, value) {
      return new Struct(update(instance, spec, value));
    };

    Struct.extend = function extendStruct(newProps, name) {
      var newStruct = struct([props].concat(newProps).reduce(mixin, {}), name);
      mixin(newStruct.prototype, Struct.prototype); // prototypal inheritance
      return newStruct;
    };

    return Struct;
  }

  function union(types, name) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a list of types
    assert(list(Type).is(types), 'Invalid argument `types` supplied to `union()`');

    var len = types.length;

    // DEBUG HINT: if the debugger stops here, there are too few types (they must be at least two)
    assert(len >= 2, 'Invalid argument `types` supplied to `union()`');

    // DEBUG HINT: if the debugger stops here, the second argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` supplied to `union()`');

    name = name || format('union([%s])', types.map(getName).join(', '));

    function Union(value, mut) {

      // DEBUG HINT: if the debugger stops here, you have used the `new` operator but it's forbidden
      blockNew(this, Union);

      // DEBUG HINT: if the debugger stops here, you must implement the `dispatch` static method for this type
      assert(Func.is(Union.dispatch), 'unimplemented %s.dispatch()', name);

      var type = Union.dispatch(value);

      // DEBUG HINT: if the debugger stops here, the `dispatch` static method returns no type
      assert(Type.is(type), '%s.dispatch() returns no type', name);

      // DEBUG HINT: if the debugger stops here, `value` can't be converted to `type`
      // mouse over the `value` and `type` variables to see what's wrong
      return type(value, mut);
    }

    Union.meta = {
      kind: 'union',
      types: types,
      name: name
    };

    Union.displayName = name;

    Union.is = function isUnion(x) {
      return types.some(function isType(type) {
        return type.is(x);
      });
    };

    // default dispatch implementation
    Union.dispatch = function dispatch(x) {
      for (var i = 0, len = types.length ; i < len ; i++ ) {
        if (types[i].is(x)) {
          return types[i];
        }
      }
    };

    return Union;
  }

  function maybe(type, name) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a type
    assert(Type.is(type), 'Invalid argument `type` supplied to `maybe()`');

    // makes the combinator idempotent
    if (getKind(type) === 'maybe') {
      return type;
    }

    // DEBUG HINT: if the debugger stops here, the second argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(Nil.is(name) || Str.is(name), 'Invalid argument `name` supplied to `maybe()`');

    name = name || format('maybe(%s)', getName(type));

    function Maybe(value, mut) {

      // DEBUG HINT: if the debugger stops here, you have used the `new` operator but it's forbidden
      blockNew(this, Maybe);

      // DEBUG HINT: if the debugger stops here, `value` can't be converted to `type`
      // mouse over the `value` and `type` variables to see what's wrong
      return Nil.is(value) ? null : type(value, mut);
    }

    Maybe.meta = {
      kind: 'maybe',
      type: type,
      name: name
    };

    Maybe.displayName = name;

    Maybe.is = function isMaybe(x) {
      return Nil.is(x) || type.is(x);
    };

    return Maybe;
  }

  function enums(map, name) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a hash
    // mouse over the `map` variable to see what's wrong
    assert(Obj.is(map), 'Invalid argument `map` supplied to `enums()`');

    // DEBUG HINT: if the debugger stops here, the second argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` supplied to `enums()`');

    name = name || 'enums';

    // cache enums
    var keys = Object.keys(map);

    function Enums(value) {

      // DEBUG HINT: if the debugger stops here, you have used the `new` operator but it's forbidden
      blockNew(this, Enums);

      // DEBUG HINT: if the debugger stops here, the value is not one of the defined enums
      // mouse over the `value`, `name` and `keys` variables to see what's wrong
      assert(Enums.is(value), 'Invalid `%s` supplied to `%s`, expected one of %j', value, name, keys);

      return value;
    }

    Enums.meta = {
      kind: 'enums',
      map: map,
      name: name
    };

    Enums.displayName = name;

    Enums.is = function isEnums(x) {
      return Str.is(x) && map.hasOwnProperty(x);
    };

    return Enums;
  }

  enums.of = function enumsOf(keys, name) {
    keys = Str.is(keys) ? keys.split(' ') : keys;
    var value = {};
    keys.forEach(function setEnum(k) {
      value[k] = k;
    });
    return enums(value, name);
  };

  function tuple(types, name) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a list of types
    assert(list(Type).is(types), 'Invalid argument `types` supplied to `tuple()`');

    var len = types.length;

    // DEBUG HINT: if the debugger stops here, the second argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` supplied to `tuple()`');

    name = name || format('tuple([%s])', types.map(getName).join(', '));

    function Tuple(value, mut) {

      // DEBUG HINT: if the debugger stops here, the value is not one of the defined enums
      // mouse over the `value`, `name` and `len` variables to see what's wrong
      assert(Arr.is(value) && value.length === len, 'Invalid `%s` supplied to `%s`, expected an `Arr` of length `%s`', value, name, len);

      // makes Tuple idempotent
      if (Tuple.isTuple(value)) {
        return value;
      }

      var arr = [];
      for (var i = 0 ; i < len ; i++) {
        var expected = types[i];
        var actual = value[i];
        // DEBUG HINT: if the debugger stops here, the `actual` value supplied to the `expected` type is invalid
        // mouse over the `actual` and `expected` variables to see what's wrong
        arr.push(expected(actual, mut));
      }

      if (mut !== true) {
        Object.freeze(arr);
      }
      return arr;
    }

    Tuple.meta = {
      kind: 'tuple',
      types: types,
      length: len,
      name: name
    };

    Tuple.displayName = name;

    Tuple.isTuple = function isTuple(x) {
      return types.every(function isType(type, i) {
        return type.is(x[i]);
      });
    };

    Tuple.is = function isTuple(x) {
      return Arr.is(x) && x.length === len && Tuple.isTuple(x);
    };

    Tuple.update = function updateTuple(instance, spec, value) {
      return Tuple(update(instance, spec, value));
    };

    return Tuple;
  }

  function subtype(type, predicate, name) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a type
    assert(Type.is(type), 'Invalid argument `type` supplied to `subtype()`');

    // DEBUG HINT: if the debugger stops here, the second argument is not a function
    assert(Func.is(predicate), 'Invalid argument `predicate` supplied to `subtype()`');

    // DEBUG HINT: if the debugger stops here, the third argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` supplied to `subtype()`');

    // DEBUG HINT: always give a name to a type, the debug will be easier
    name = name || format('subtype(%s)', getName(type));

    // cache expected value
    var expected = predicate.__doc__ || format('insert a valid value for %s', predicate.name || 'the subtype');

    function Subtype(value, mut) {

      // DEBUG HINT: if the debugger stops here, you have used the `new` operator but it's forbidden
      blockNew(this, Subtype);

      // DEBUG HINT: if the debugger stops here, the value cannot be converted to the base type
      var x = type(value, mut);

      // DEBUG HINT: if the debugger stops here, the value is converted to the base type
      // but the predicate returns `false`
      assert(predicate(x), 'Invalid `%s` supplied to `%s`, %s', value, name, expected);
      return x;
    }

    Subtype.meta = {
      kind: 'subtype',
      type: type,
      predicate: predicate,
      name: name
    };

    Subtype.displayName = name;

    Subtype.is = function isSubtype(x) {
      return type.is(x) && predicate(x);
    };

    Subtype.update = function updateSubtype(instance, spec, value) {
      return Subtype(update(instance, spec, value));
    };

    return Subtype;
  }

  function list(type, name) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a type
    assert(Type.is(type), 'Invalid argument `type` supplied to `list()`');

    // DEBUG HINT: if the debugger stops here, the third argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` supplied to `list()`');

    // DEBUG HINT: always give a name to a type, the debug will be easier
    name = name || format('list(%s)', getName(type));

    function List(value, mut) {

      // DEBUG HINT: if the debugger stops here, you have used the `new` operator but it's forbidden

      // DEBUG HINT: if the debugger stops here, the value is not one of the defined enums
      // mouse over the `value` and `name` variables to see what's wrong
      assert(Arr.is(value), 'Invalid `%s` supplied to `%s`, expected an `Arr`', value, name);

      // makes List idempotent
      if (List.isList(value)) {
        return value;
      }

      var arr = [];
      for (var i = 0, len = value.length ; i < len ; i++ ) {
        var actual = value[i];
        // DEBUG HINT: if the debugger stops here, the `actual` value supplied to the `type` type is invalid
        // mouse over the `actual` and `type` variables to see what's wrong
        arr.push(type(actual, mut));
      }

      if (mut !== true) {
        Object.freeze(arr);
      }
      return arr;
    }

    List.meta = {
      kind: 'list',
      type: type,
      name: name
    };

    List.displayName = name;

    List.isList = function isList(x) {
      return x.every(type.is);
    };

    List.is = function isList(x) {
      return Arr.is(x) && List.isList(x);
    };

    List.update = function updateList(instance, spec, value) {
      return List(update(instance, spec, value));
    };

    return List;
  }

  function dict(domain, codomain, name) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a type
    assert(Type.is(domain), 'Invalid argument `domain` supplied to `dict()`');

    // DEBUG HINT: if the debugger stops here, the second argument is not a type
    assert(Type.is(codomain), 'Invalid argument `codomain` supplied to `dict()`');

    // DEBUG HINT: if the debugger stops here, the third argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` supplied to `dict()`');

    // DEBUG HINT: always give a name to a type, the debug will be easier
    name = name || format('dict(%s, %s)', getName(domain), getName(codomain));

    function Dict(value, mut) {

      // DEBUG HINT: if the debugger stops here, the value is not an object
      // mouse over the `value` and `name` variables to see what's wrong
      assert(Obj.is(value), 'Invalid `%s` supplied to `%s`, expected an `Obj`', value, name);

      // makes Dict idempotent
      if (Dict.isDict(value)) {
        return value;
      }

      var obj = {};
      for (var k in value) {
        if (value.hasOwnProperty(k)) {
          // DEBUG HINT: if the debugger stops here, the `k` value supplied to the `domain` type is invalid
          // mouse over the `k` and `domain` variables to see what's wrong
          k = domain(k);
          var actual = value[k];
          // DEBUG HINT: if the debugger stops here, the `actual` value supplied to the `codomain` type is invalid
          // mouse over the `actual` and `codomain` variables to see what's wrong
          obj[k] = codomain(actual, mut);
        }
      }

      if (mut !== true) {
        Object.freeze(obj);
      }
      return obj;
    }

    Dict.meta = {
      kind: 'dict',
      domain: domain,
      codomain: codomain,
      name: name
    };

    Dict.displayName = name;

    Dict.isDict = function isDict(x) {
      for (var k in x) {
        if (x.hasOwnProperty(k)) {
          if (!domain.is(k) || !codomain.is(x[k])) { return false; }
        }
      }
      return true;
    };

    Dict.is = function isDict(x) {
      return Obj.is(x) && Dict.isDict(x);
    };


    Dict.update = function updateDict(instance, spec, value) {
      return Dict(update(instance, spec, value));
    };

    return Dict;
  }

  function func(domain, codomain, name) {

    // handle handy syntax for unary functions
    domain = Arr.is(domain) ? domain : [domain];

    // DEBUG HINT: if the debugger stops here, the first argument is not a list of types
    assert(list(Type).is(domain), 'Invalid argument `domain` supplied to `func()`');

    // DEBUG HINT: if the debugger stops here, the second argument is not a type
    assert(Type.is(codomain), 'Invalid argument `codomain` supplied to `func()`');

    // DEBUG HINT: always give a name to a type, the debug will be easier
    name = name || format('func([%s], %s)', domain.map(getName).join(', '), getName(codomain));

    // cache the domain length
    var domainLen = domain.length;

    function Func(value) {

      // automatically instrument the function if is not already instrumented
      if (!func.is(value)) {
        value = Func.of(value);
      }

      // DEBUG HINT: if the debugger stops here, the first argument is invalid
      // mouse over the `value` and `name` variables to see what's wrong
      assert(Func.is(value), 'Invalid `%s` supplied to `%s`', value, name);

      return value;
    }

    Func.meta = {
      kind: 'func',
      domain: domain,
      codomain: codomain,
      name: name
    };

    Func.displayName = name;

    Func.is = function isFunc(x) {
      return func.is(x) &&
        x.func.domain.length === domain.length &&
        x.func.domain.every(function isEqual(type, i) {
          return type === domain[i];
        }) &&
        x.func.codomain === codomain;
    };

    Func.of = function funcOf(f) {

      // DEBUG HINT: if the debugger stops here, f is not a function
      assert(typeof f === 'function');

      // makes Func.of idempotent
      if (Func.is(f)) {
        return f;
      }

      function fn() {

        var args = slice.call(arguments);
        var len = Math.min(args.length, domainLen);

        // DEBUG HINT: if the debugger stops here, you provided wrong arguments to the function
        // mouse over the `args` variable to see what's wrong
        args = tuple(domain.slice(0, len))(args);

        if (len === domainLen) {

          /* jshint validthis: true */
          var r = f.apply(this, args);

          // DEBUG HINT: if the debugger stops here, the return value of the function is invalid
          // mouse over the `r` variable to see what's wrong
          r = codomain(r);

          return r;

        } else {

          var curried = Function.prototype.bind.apply(f, [this].concat(args));
          var newdomain = func(domain.slice(len), codomain);
          return newdomain.of(curried);

        }

      }

      fn.func = {
        domain: domain,
        codomain: codomain,
        f: f
      };

      return fn;

    };

    return Func;

  }

  // returns true if x is an instrumented function
  func.is = function isFunc(f) {
    return Func.is(f) && Obj.is(f.func);
  };

  return {

    util: {
      mixin: mixin,
      format: format,
      getName: getName,
      getKind: getKind,
      slice: slice,
      shallowCopy: shallowCopy,
      update: update
    },

    options: options,
    assert: assert,
    fail: fail,

    Any: Any,
    Nil: Nil,
    Str: Str,
    Num: Num,
    Bool: Bool,
    Arr: Arr,
    Obj: Obj,
    Func: Func,
    Err: Err,
    Re: Re,
    Dat: Dat,
    Type: Type,

    irriducible: irriducible,
    struct: struct,
    enums: enums,
    union: union,
    maybe: maybe,
    tuple: tuple,
    subtype: subtype,
    list: list,
    dict: dict,
    func: func
  };
}));

},{}]},{},[1]);

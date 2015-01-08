(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var React = require('react');
var t = require('../../../.');

// helper function
function render(i, type, opts) {

  var formPreview = document.getElementById('p' + i);
  var Form = t.form.create(type, opts);

  var App  = React.createClass({displayName: "App",

    onClick: function () {
      var value = this.refs.form.getValue();
      if (value) {
        var valuePreview = document.getElementById('v' + i)
        valuePreview.style.display = 'block';
        valuePreview.innerHTML = JSON.stringify(value, null, 2);
      }
    },

    render: function () {
      return (
        React.DOM.div(null,
          React.createFactory(Form)({ref: 'form'}),
          React.DOM.button({
            onClick: this.onClick,
            className: 'btn btn-primary'
          }, 'Click me')
        )
      );
    }

  });

  React.render(React.createFactory(App)(), formPreview);
}

// ===============================================

var Gender = t.enums({
  M: 'Male',
  F: 'Female'
});

var Country = t.enums({
  US: 'United States',
  IT: 'Italy'
});

var Person = t.struct({
  fullName: t.Str,
  nickname: t.maybe(t.Str),
  gender: Gender,
  country: Country,
  tags: t.list(t.Str)
});

render('1', Person, {
  auto: 'labels',
  fields: {
    gender: {
      factory: t.form.radio
    }
  }
});

// ===============================================

var Target = t.enums.of('Hotel B&B');

var Location = t.enums.of('London Milan');

var Currency = t.enums({
  USD: '$ USD',
  EUR: '€ EUR'
});

var Booking = t.struct({
  booking: Target,
  arrivalDate: t.Str,
  departureDate: t.Str,
  flexible: t.Bool,
  location: Location,
  currency: Currency,
  budget: t.Num,
  adults: t.Num,
  children: t.maybe(t.Num),
  toddlers: t.maybe(t.Num),
  babies: t.maybe(t.Num),
  message: t.maybe(t.Str)
});

render('2', Booking, {
  auto: 'labels',
  label: React.createElement("h2", null, "How can we help?"),
  fields: {
    booking: { label: '' },
    flexible: { label: 'My dates are flexible' },
    location: { label: 'One fine stay location' },
    currency: { label: '' },
    budget: { label: '', placeholder: '' },
    children: { help: 'Age 4-12' },
    toddlers: { help: 'Age 1-3' },
    babies: { help: 'Under 1' },
    message: { type: 'textarea' }
  },
  templates: {
    struct: mylayout
  },
});

function mylayout(locals) {
  return (
    React.createElement("fieldset", null,
      React.createElement("legend", null, locals.label),
      React.createElement("div", {className: "row"},
        React.createElement("div", {className: "col-xs-12"},
          locals.inputs.booking
        )
      ),
      React.createElement("div", {className: "row"},
        React.createElement("div", {className: "col-xs-6"},
          locals.inputs.arrivalDate
        ),
        React.createElement("div", {className: "col-xs-6"},
          locals.inputs.departureDate
        )
      ),
      React.createElement("div", {className: "row"},
        React.createElement("div", {className: "col-xs-12"},
          locals.inputs.flexible
        )
      ),
      React.createElement("div", {className: "row"},
        React.createElement("div", {className: "col-sm-6"},
          locals.inputs.location
        ),
        React.createElement("div", {className: "col-sm-6"},
          React.createElement("label", null, "Approximate budget (per night)"),
          React.createElement("div", {className: "row"},
            React.createElement("div", {className: "col-xs-6 col-sm-3"},
              locals.inputs.currency
            ),
            React.createElement("div", {className: "col-xs-6 col-sm-9"},
              locals.inputs.budget
            )
          )
        )
      ),
      React.createElement("div", {className: "row"},
        React.createElement("div", {className: "col-xs-3"},
          locals.inputs.adults
        ),
        React.createElement("div", {className: "col-xs-3"},
          locals.inputs.children
        ),
        React.createElement("div", {className: "col-xs-3"},
          locals.inputs.toddlers
        ),
        React.createElement("div", {className: "col-xs-3"},
          locals.inputs.babies
        )
      ),
      React.createElement("div", {className: "row"},
        React.createElement("div", {className: "col-xs-12"},
          locals.inputs.message
        )
      )
    )
  );
}

// ===============================================

var themeSelector = document.getElementById('themeSelector');
var theme = document.getElementById('theme');
themeSelector.onchange = function () {
  theme.href = themeSelector.value;
};


},{"../../../.":2,"react":"react"}],2:[function(require,module,exports){
var t = require('./lib');

// plug bootstrap style
t.form.config.templates = require('./lib/themes/bootstrap');

module.exports = t;
},{"./lib":6,"./lib/themes/bootstrap":9}],3:[function(require,module,exports){
'use strict';

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
var api = require('./protocols/api');
var config = require('./config');
var getFactory = require('./factories').getFactory;
var getReport = require('./util/getReport');

function create(type, opts) {

  var factory = getFactory(type, opts);

  var Form = React.createClass({

    displayName: 'Form',

    // the public api returns `null` if validation failed
    // unless the optional boolean argument `raw` is set to `true`
    getValue: function (raw) {
      var result = this.refs.input.getValue();
      if (raw === true) { return result; }
      if (result.isValid()) { return result.value; }
      return null;
    },

    render: function () {

      var ctx = new api.Context({
        auto: api.Auto.defaultValue,
        i18n: config.i18n,
        label: null,
        name: '',
        report: getReport(type),
        templates: config.templates,
        value: this.props.value
      });
      var Component = factory(opts, ctx);

      return React.createElement(Component, {
        onChange: this.props.onChange,
        ref: 'input'
      });
    }
  });

  return Form;
}

module.exports = create;

},{"./config":3,"./factories":5,"./protocols/api":7,"./util/getReport":12,"react":"react"}],5:[function(require,module,exports){
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
    assert(t.Func.is(opts.factory), 'invalid `factory` option, must be a function with signature (opts: Obj, ctx: ?Context) -> ReactClass');
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

    onChange: function (value) {
      if (transformer) {
        value = transformer.parse(value);
      }
      this.setState({value: value}, function () {
        if (this.props.onChange) {
          this.props.onChange(value);
        }
      }.bind(this));
    },

    getValue: function () {
      var value = this.state.value;
      // handle white spaces
      if (t.Str.is(value) && value.trim() === '') {
        value = null;
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
        autoFocus: opts.autoFocus,
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

    onChange: function (value) {
      this.setState({value: value}, function () {
        if (this.props.onChange) {
          this.props.onChange(value);
        }
      }.bind(this));
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
        autoFocus: opts.autoFocus,
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

    onChange: function (value) {
      if (value === nullOption.value) {
        value = null;
      }
      this.setState({value: value}, function () {
        if (this.props.onChange) {
          this.props.onChange(value);
        }
      }.bind(this));
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
        autoFocus: opts.autoFocus,
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

    onChange: function (value) {
      this.setState({value: value}, function () {
        if (this.props.onChange) {
          this.props.onChange(value);
        }
      }.bind(this));
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
        autoFocus: opts.autoFocus,
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
      this.setState({value: value}, function () {
        if (this.props.onChange) {
          this.props.onChange(value);
        }
      }.bind(this));
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
      this.setState({value: value}, function () {
        if (this.props.onChange) {
          this.props.onChange(value);
        }
      }.bind(this));
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

},{"./config":3,"./protocols/api":7,"./protocols/theme":8,"./util/getError":10,"./util/getOptionsOfEnum":11,"./util/getReport":12,"./util/humanize":13,"./util/merge":14,"./util/move":15,"./util/uuid":16,"react":"react","tcomb-validation":17,"uvdom/react":43}],6:[function(require,module,exports){
var t = require('tcomb-validation');
var create = require('./create');
var config = require('./config');
var factories = require('./factories');

t.form = t.util.mixin({
  create: create,
  config: config
}, factories);

module.exports = t;
},{"./config":3,"./create":4,"./factories":5,"tcomb-validation":17}],7:[function(require,module,exports){
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

var Auto = t.enums.of('placeholders labels none', 'Auto');
Auto.defaultValue = 'placeholders';

// internationalization
var I18n = struct({
  add: Str,       // add button for lists
  down: Str,      // move down button for lists
  optional: Str,  // suffix added to optional fields
  remove: Str,    // remove button for lists
  up: Str         // move up button for lists
}, 'I18n');

var Report = struct({
  innerType: maybe(t.Type),
  maybe: maybe(Bool),
  subtype: maybe(Bool),
  type: t.Type
}, 'Report');

var Context = struct({
  auto: Auto,
  config: maybe(Obj),
  i18n: I18n,
  label: maybe(Str),
  name: Str,
  report: Report,
  templates: Obj,
  value: Any
}, 'Context');

Context.prototype.getDefaultLabel = function () {
  if (!this.label) { return null; }
  return this.label + (this.report.maybe ? this.i18n.optional : '');
};

var ReactElement = t.irreducible('ReactElement', React.isValidElement);

var Label = union([Str, ReactElement], 'Label');

var ErrorMessage = union([Label, Func], 'Error');

var Option = t.struct({
  disabled: maybe(Bool),
  text: Str,
  value: Str
}, 'Option');

var OptGroup = t.struct({
  disabled: maybe(Bool),
  label: Str,
  options: list(Option)
}, 'OptGroup');

var SelectOption = union([Option, OptGroup], 'SelectOption');

SelectOption.dispatch = function (x) {
  if (x.hasOwnProperty('label')) { return OptGroup; }
  return Option;
};

var TypeAttr = t.enums.of('textarea hidden text password color date datetime datetime-local email month number range search tel time url week', 'TypeAttr');

var Transformer = struct({
  format: Func, // from value to string
  parse: Func   // from string to value
}, 'Transformer');

var Textbox = struct({
  autoFocus: maybe(Bool),
  config: maybe(Obj),
  disabled: maybe(Bool),
  error: maybe(ErrorMessage),
  hasError: maybe(Bool),
  help: maybe(Label),
  id: maybe(Str),
  label: maybe(Label),
  name: maybe(t.Str),
  placeholder: maybe(Str),
  template: maybe(Func),
  transformer: maybe(Transformer),
  type: maybe(TypeAttr),
  value: Any
}, 'Textbox');

var Checkbox = struct({
  autoFocus: maybe(Bool),
  config: maybe(Obj),
  disabled: maybe(Bool),
  hasError: maybe(Bool),
  help: maybe(Label),
  id: maybe(Str),
  error: maybe(ErrorMessage),
  label: maybe(Label),
  name: maybe(t.Str),
  template: maybe(Func),
  value: maybe(Bool)
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

// handle multiple attribute
var SelectValue = union([Str, list(Str)], 'SelectValue');

var Select = struct({
  autoFocus: maybe(Bool),
  config: maybe(Obj),
  disabled: maybe(Bool),
  hasError: maybe(Bool),
  help: maybe(Label),
  id: maybe(Str),
  error: maybe(ErrorMessage),
  label: maybe(Label),
  name: maybe(t.Str),
  nullOption: maybe(Option),
  options: maybe(list(SelectOption)),
  order: maybe(Order),
  template: maybe(Func),
  value: maybe(SelectValue)
}, 'Select');

var Radio = struct({
  autoFocus: maybe(Bool),
  config: maybe(Obj),
  disabled: maybe(Bool),
  hasError: maybe(Bool),
  help: maybe(Label),
  id: maybe(Str),
  error: maybe(ErrorMessage),
  label: maybe(Label),
  name: maybe(t.Str),
  options: maybe(list(SelectOption)),
  order: maybe(Order),
  template: maybe(Func),
  value: maybe(Str)
}, 'Select');

var Struct = struct({
  auto: maybe(Auto),
  config: maybe(Obj),
  disabled: maybe(Bool),
  fields: maybe(Obj),
  i18n: maybe(I18n),
  hasError: maybe(Bool),
  help: maybe(Label),
  error: maybe(ErrorMessage),
  label: maybe(Label),
  order: maybe(list(Label)),
  templates: maybe(Obj),
  value: maybe(Obj)
}, 'Struct');

var List = struct({
  auto: maybe(Auto),
  config: maybe(Obj),
  disableAdd: maybe(Bool),
  disableRemove: maybe(Bool),
  disableOrder: maybe(Bool),
  disabled: maybe(Bool),
  i18n: maybe(I18n),
  item: maybe(Obj),
  hasError: maybe(Bool),
  help: maybe(Label),
  error: maybe(ErrorMessage),
  label: maybe(Label),
  templates: maybe(Obj),
  value: maybe(t.Arr)
}, 'List');

module.exports = {
  Auto: Auto,
  I18n: I18n,
  Context: Context,
  ReactElement: ReactElement,
  Label: Label,
  ErrorMessage: ErrorMessage,
  Option: Option,
  OptGroup: OptGroup,
  SelectOption: SelectOption,
  Transformer: Transformer,
  Order: Order,
  Textbox: Textbox,
  Checkbox: Checkbox,
  Select: Select,
  Radio: Radio,
  Struct: Struct,
  List: List
};
},{"react":"react","tcomb-validation":17}],8:[function(require,module,exports){
'use strict';

var React = require('react');
var t = require('tcomb-validation');
var Str = t.Str;
var Bool = t.Bool;
var Func = t.Func;
var Obj = t.Obj;
var maybe = t.maybe;
var list = t.list;
var struct = t.struct;
var union = t.union;

var ReactElement = t.irreducible('ReactElement', React.isValidElement);

var Label = union([Str, ReactElement], 'Label');

var Option = t.struct({
  disabled: maybe(Bool),
  text: Str,
  value: Str
}, 'Option');

var OptGroup = t.struct({
  disabled: maybe(Bool),
  label: Str,
  options: list(Option)
}, 'OptGroup');

var SelectOption = union([Option, OptGroup], 'SelectOption');

SelectOption.dispatch = function (x) {
  if (x.hasOwnProperty('label')) { return OptGroup; }
  return Option;
};

var TypeAttr = t.enums.of('textarea hidden text password color date datetime datetime-local email month number range search tel time url week', 'TypeAttr');

var Textbox = struct({
  autoFocus: maybe(Bool),
  config: maybe(Obj),
  disabled: maybe(Bool),    // should be disabled
  error: maybe(Label),      // should show an error
  hasError: maybe(Bool),    // if true should show an error state
  help: maybe(Label),       // should show an help message
  id: Str,                  // should use this as id attribute and as htmlFor label attribute
  label: maybe(Label),      // should show a label
  name: Str,                // should use this as name attribute
  onChange: Func,           // should call this function with the changed value
  placeholder: maybe(Str),  // should show a placeholder
  type: TypeAttr,           // should use this as type attribute
  value: t.Any              // should use this as value attribute
}, 'Textbox');

var Checkbox = struct({
  autoFocus: maybe(Bool),
  config: maybe(Obj),
  disabled: maybe(Bool),
  error: maybe(Label),
  hasError: maybe(Bool),
  help: maybe(Label),
  id: Str,                  // should use this as id attribute and as htmlFor label attribute
  label: Label,             // checkboxes must always have a label
  name: Str,
  onChange: Func,
  value: Bool
}, 'Checkbox');

// handle multiple attribute
var SelectValue = union([Str, list(Str)], 'SelectValue');

var Select = struct({
  autoFocus: maybe(Bool),
  config: maybe(Obj),
  error: maybe(Label),
  disabled: maybe(Bool),
  hasError: maybe(Bool),
  help: maybe(Label),
  id: Str,                  // should use this as id attribute and as htmlFor label attribute
  label: maybe(Label),
  multiple: maybe(Bool),
  name: Str,
  onChange: Func,
  options: list(SelectOption),
  value: maybe(SelectValue)
}, 'Select');

var Radio = struct({
  autoFocus: maybe(Bool),
  config: maybe(Obj),
  disabled: maybe(Bool),
  error: maybe(Label),
  hasError: maybe(Bool),
  help: maybe(Label),
  id: Str,
  label: maybe(Label),
  name: Str,
  onChange: Func,
  options: list(Option),
  value: maybe(Str)
}, 'Radio');

var StructValue = t.dict(Str, t.Any, 'StructValue');

var Struct = struct({
  config: maybe(Obj),
  disabled: maybe(Bool),
  error: maybe(Label),
  help: maybe(Label),
  hasError: maybe(Bool),
  inputs: t.dict(Str, ReactElement),
  label: maybe(Label),
  order: list(Label),
  value: maybe(StructValue)
}, 'Struct');

var Button = struct({
  click: Func,
  label: Str
}, 'Button');

var ListItem = struct({
  buttons: list(Button),
  input: ReactElement,
  key: Str
}, 'ListItem');

var List = struct({
  add: maybe(Button),
  config: maybe(Obj),
  disabled: maybe(Bool),
  error: maybe(Label),
  hasError: maybe(Bool),
  help: maybe(Label),
  items: list(ListItem),
  label: maybe(Label),
  value: maybe(list(t.Any))
}, 'List');

module.exports = {
  Label: Label,
  Textbox: Textbox,
  Checkbox: Checkbox,
  Option: Option,
  OptGroup: OptGroup,
  Select: Select,
  Radio: Radio,
  Struct: Struct,
  List: List
};
},{"react":"react","tcomb-validation":17}],9:[function(require,module,exports){
'use strict';

var t = require('tcomb-validation');
var theme = require('../../protocols/theme');
var Label = theme.Label;
var uform = require('uvdom-bootstrap/form');
var maybe = t.maybe;
var getFieldset = uform.getFieldset;
var getFormGroup = uform.getFormGroup;
var getAddon = uform.getAddon;
var getButton = uform.getButton;
var getCol = uform.getCol;
var getAlert = uform.getAlert;
var getBreakpoints = uform.getBreakpoints;

var Positive = t.subtype(t.Num, function (n) {
  return n % 1 === 0 && n >= 0;
}, 'Positive');

var Cols = t.subtype(t.tuple([Positive, Positive]), function (cols) {
  return cols[0] + cols[1] === 12;
}, 'Cols');

var Breakpoints = t.struct({
  xs: maybe(Cols),
  sm: maybe(Cols),
  md: maybe(Cols),
  lg: maybe(Cols)
}, 'Breakpoints');

Breakpoints.prototype.getBreakpoints = function (index) {
  var breakpoints = {};
  for (var size in this) {
    if (this.hasOwnProperty(size) && !t.Nil.is(this[size])) {
      breakpoints[size] = this[size][index];
    }
  }
  return breakpoints;
};

Breakpoints.prototype.getLabelClassName = function () {
  return getBreakpoints(this.getBreakpoints(0));
};

Breakpoints.prototype.getInputClassName = function () {
  return getBreakpoints(this.getBreakpoints(1));
};

Breakpoints.prototype.getOffsetClassName = function () {
  return t.util.mixin(uform.getOffsets(this.getBreakpoints(1)), getBreakpoints(this.getBreakpoints(1)));
};

Breakpoints.prototype.getFieldsetClassName = function () {
  return {
    'col-xs-12': true
  };
};

var Size = t.enums.of('xs sm md lg', 'Size');

var TextboxConfig = t.struct({
  addonBefore: maybe(Label),
  addonAfter: maybe(Label),
  horizontal: maybe(Breakpoints),
  size: maybe(Size)
}, 'TextboxConfig');

var CheckboxConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'CheckboxConfig');

var SelectConfig = t.struct({
  addonBefore: maybe(Label),
  addonAfter: maybe(Label),
  horizontal: maybe(Breakpoints),
  size: maybe(Size)
}, 'SelectConfig');

var RadioConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'RadioConfig');

var StructConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'StructConfig');

var ListConfig = t.struct({
  horizontal: maybe(Breakpoints)
}, 'ListConfig');

function getLabel(opts) {
  if (!opts.label) { return; }

  var align = null;
  var className = null;

  if (opts.breakpoints) {
    align = 'right';
    className = opts.breakpoints.getLabelClassName();
  }

  return uform.getLabel({
    align: align,
    className: className,
    htmlFor: opts.htmlFor,
    id: opts.id,
    label: opts.label
  });
}

function getHelp(locals) {
  if (!locals.help) { return; }
  return uform.getHelpBlock({
    help: locals.help,
    id: locals.id + '-tip'
  });
}

function getError(locals) {
  if (!locals.error) { return; }
  return uform.getErrorBlock({
    error: locals.error,
    hasError: locals.hasError
  });
}

function getHiddenTextbox(locals) {
  return {
    tag: 'input',
    attrs: {
      type: 'hidden',
      value: locals.value,
      name: locals.name
    },
    events: {
      change: function (evt) {
        locals.onChange(evt.target.value);
      }
    }
  };
}

function textbox(locals) {

  var config = new TextboxConfig(locals.config || {});

  if (locals.type === 'hidden') {
    return getHiddenTextbox(locals);
  }

  var control = uform.getTextbox({
    autoFocus: locals.autoFocus,
    type: locals.type,
    value: locals.value,
    disabled: locals.disabled,
    'aria-describedby': locals.help ? locals.id + '-tip' : null,
    id: locals.label ? locals.id : null,
    onChange: function (evt) {
      locals.onChange(evt.target.value);
    },
    placeholder: locals.placeholder,
    name: locals.name,
    size: config.size
  });

  if (config.addonBefore || config.addonAfter) {
    control = uform.getInputGroup([
      config.addonBefore ? getAddon(config.addonBefore) : null,
      control,
      config.addonAfter ? getAddon(config.addonAfter) : null
    ]);
  }

  var horizontal = config.horizontal;
  var label = getLabel({
    label: locals.label,
    htmlFor: locals.id,
    breakpoints: config.horizontal
  });
  var error = getError(locals);
  var help = getHelp(locals);

  var children = [
    label,
    control,
    error,
    help
  ];

  if (horizontal) {
    children = [
      label,
      {
        tag: 'div',
        attrs: {
          className: label ? horizontal.getInputClassName() : horizontal.getOffsetClassName()
        },
        children: [
          control,
          error,
          help
        ]
      }
    ];
  }

  return getFormGroup({
    hasError: locals.hasError,
    children: children
  });
}

function checkbox(locals) {

  var config = new CheckboxConfig(locals.config || {});

  var control = uform.getCheckbox({
    autoFocus: locals.autoFocus,
    checked: locals.value,
    disabled: locals.disabled,
    id: locals.id,
    label: locals.label,
    name: locals.name,
    onChange: function (evt) {
      locals.onChange(evt.target.checked);
    }
  });

  var error = getError(locals);
  var help = getHelp(locals);
  var children = [
    control,
    error,
    help
  ];

  if (config.horizontal) {
    children = {
      tag: 'div',
      attrs: {
        className: config.horizontal.getOffsetClassName()
      },
      children: children
    };
  }

  return getFormGroup({
    hasError: locals.hasError,
    children: children
  });
}

function select(locals) {

  var config = new SelectConfig(locals.config || {});

  var options = locals.options.map(function (x) {
    return theme.Option.is(x) ? uform.getOption(x) : uform.getOptGroup(x);
  });

  function onChange(evt) {
    var value = locals.multiple ?
      evt.target.options.filter(function (option) {
        return option.selected;
      }).map(function (option) {
        return option.value;
      }) :
      evt.target.value;
    locals.onChange(value);
  }

  var control = uform.getSelect({
    autoFocus: locals.autoFocus,
    value: locals.value,
    disabled: locals.disabled,
    'aria-describedby': locals.help ? locals.id + '-tip' : null,
    id: locals.label ? locals.id : null,
    name: locals.name,
    onChange: onChange,
    options: options,
    size: config.size,
    multiple: locals.multiple
  });

  var horizontal = config.horizontal;
  var label = getLabel({
    label: locals.label,
    htmlFor: locals.id,
    breakpoints: config.horizontal
  });
  var error = getError(locals);
  var help = getHelp(locals);
  var children = [
    label,
    control,
    error,
    help
  ];

  if (horizontal) {
    children = [
      label,
      {
        tag: 'div',
        attrs: {
          className: label ? horizontal.getInputClassName() : horizontal.getOffsetClassName()
        },
        children: [
          control,
          error,
          help
        ]
      }
    ];
  }

  return getFormGroup({
    hasError: locals.hasError,
    children: children
  });
}

function radio(locals) {

  var config = new RadioConfig(locals.config || {});

  var control = locals.options.map(function (option, i) {
    return uform.getRadio({
      autoFocus: locals.autoFocus && (i === 0),
      'aria-describedby': locals.label ? locals.id : null,
      id: locals.id + '-' + option.value,
      checked: (option.value === locals.value),
      disabled: option.disabled || locals.disabled,
      label: option.text,
      name: locals.name,
      onChange: function (evt) {
        locals.onChange(evt.target.value);
      },
      value: option.value
    });
  });

  var horizontal = config.horizontal;
  var label = getLabel({
    label: locals.label,
    id: locals.id,
    breakpoints: config.horizontal
  });
  var error = getError(locals);
  var help = getHelp(locals);
  var children = [
    label,
    control,
    error,
    help
  ];

  if (horizontal) {
    children = [
      label,
      {
        tag: 'div',
        attrs: {
          className: label ? horizontal.getInputClassName() : horizontal.getOffsetClassName()
        },
        children: [
          control,
          error,
          help
        ]
      }
    ];
  }

  return getFormGroup({
    hasError: locals.hasError,
    children: children
  });
}

function struct(locals) {

  var config = new StructConfig(locals.config || {});

  var rows = [];

  if (locals.help) {
    rows.push(getAlert({
      children: locals.help
    }));
  }

  rows = rows.concat(locals.order.map(function (name) {
    return locals.inputs.hasOwnProperty(name) ? locals.inputs[name] : name;
  }));

  if (locals.error && locals.hasError) {
    rows.push(getAlert({
      type: 'danger',
      children: locals.error
    }));
  }

  return getFormGroup({
    children: getFieldset({
      className: config.horizontal && config.horizontal.getFieldsetClassName(),
      disabled: locals.disabled,
      legend: locals.label,
      children: rows
    })
  });
}

function list(locals) {

  var config = new ListConfig(locals.config || {});

  var rows = [];

  if (locals.help) {
    rows.push(getAlert({
      children: locals.help
    }));
  }

  rows = rows.concat(locals.items.map(function (item) {
    return uform.getRow({
      key: item.key,
      children: [
        getCol({
          breakpoints: {sm: 8, xs: 6},
          children: item.input
        }),
        getCol({
          breakpoints: {sm: 4, xs: 6},
          children: uform.getButtonGroup(item.buttons.map(function (button, i) {
            return getButton({
              click: button.click,
              key: i,
              label: button.label
            });
          }))
        })
      ]
    });
  }));

  if (locals.error && locals.hasError) {
    rows.push(getAlert({
      type: 'danger',
      children: locals.error
    }));
  }

  if (locals.add) {
    rows.push(getButton(locals.add));
  }

  return getFormGroup({
    children: getFieldset({
      className: config.horizontal && config.horizontal.getFieldsetClassName(),
      disabled: locals.disabled,
      legend: locals.label,
      children: rows
    })
  });
}

module.exports = {
  name: 'bootstrap',
  textbox: textbox,
  checkbox: checkbox,
  select: select,
  radio: radio,
  struct: struct,
  list: list
};
},{"../../protocols/theme":8,"tcomb-validation":17,"uvdom-bootstrap/form":19}],10:[function(require,module,exports){
'use strict';

var t = require('tcomb-validation');

function getError(error, state) {
  if (!state.hasError) { return null; }
  return t.Func.is(error) ? error(state.value) : error;
}

module.exports = getError;
},{"tcomb-validation":17}],11:[function(require,module,exports){
'use strict';

function getOptionsOfEnum(type) {
  var enums = type.meta.map;
  return Object.keys(enums).map(function (k) {
    return {
      value: k,
      text: enums[k]
    };
  });
}

module.exports = getOptionsOfEnum;
},{}],12:[function(require,module,exports){
'use strict';

var t = require('tcomb-validation');
var getKind = t.util.getKind;

function getReport(type) {

  var innerType = type;
  var maybe = false;
  var subtype = false;
  var kind;

  while (true) {
    kind = getKind(innerType);
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

module.exports = getReport;
},{"tcomb-validation":17}],13:[function(require,module,exports){
'use strict';

// thanks to https://github.com/epeli/underscore.string

function underscored(s){
  return s.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
}

function capitalize(s){
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function humanize(s){
  return capitalize(underscored(s).replace(/_id$/,'').replace(/_/g, ' '));
}

module.exports = humanize;
},{}],14:[function(require,module,exports){
'use strict';

var t = require('tcomb-validation');
var mixin = t.util.mixin;

function merge(a, b) {
  return mixin(mixin({}, a), b, true);
}

module.exports = merge;
},{"tcomb-validation":17}],15:[function(require,module,exports){
'use strict';

function move(arr, fromIndex, toIndex) {
  var element = arr.splice(fromIndex, 1)[0];
  arr.splice(toIndex, 0, element);
  return arr;
}

module.exports = move;
},{}],16:[function(require,module,exports){
'use strict';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = (c === 'x') ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

module.exports = uuid;
},{}],17:[function(require,module,exports){
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

  var validators = validate.validators = {};

  // irreducibles and enums
  validators.irreducible =
  validators.enums = function validateIrreducible(x, type, path) {
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

},{"tcomb":18}],18:[function(require,module,exports){
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
          assert(!target.hasOwnProperty(k), 'Cannot overwrite property %s', k);
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
    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `getName()`', type);
    return type.meta.name;
  }

  function getFunctionName(f) {
    assert(typeof f === 'function', 'Invalid argument `f` = `%s` supplied to `getFunctionName()`', f);
    return f.displayName || f.name || format('<function%s>', f.length);
  }

  function getKind(type) {
    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `geKind()`', type);
    return type.meta.kind;
  }

  function blockNew(x, type) {
    assert(!(x instanceof type), 'Operator `new` is forbidden for type `%s`', getName(type));
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
  // irreducibles
  //

  function irreducible(name, is) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a string
    assert(typeof name === 'string', 'Invalid argument `name` = `%s` supplied to `irreducible()`', name);

    // DEBUG HINT: if the debugger stops here, the second argument is not a function
    assert(typeof is === 'function', 'Invalid argument `is` = `%s` supplied to `irreducible()`', is);

    function Irreducible(value) {

      // DEBUG HINT: if the debugger stops here, you have used the `new` operator but it's forbidden
      blockNew(this, Irreducible);

      // DEBUG HINT: if the debugger stops here, the first argument is invalid
      // mouse over the `value` variable to see what's wrong. In `name` there is the name of the type
      assert(is(value), 'Invalid argument `value` = `%s` supplied to irreducible type `%s`', value, name);

      return value;
    }

    Irreducible.meta = {
      kind: 'irreducible',
      name: name
    };

    Irreducible.displayName = name;

    Irreducible.is = is;

    return Irreducible;
  }

  var Any = irreducible('Any', function isAny() {
    return true;
  });

  var Nil = irreducible('Nil', function isNil(x) {
    return x === null || x === void 0;
  });

  var Str = irreducible('Str', function isStr(x) {
    return typeof x === 'string';
  });

  var Num = irreducible('Num', function isNum(x) {
    return typeof x === 'number' && isFinite(x) && !isNaN(x);
  });

  var Bool = irreducible('Bool', function isBool(x) {
    return x === true || x === false;
  });

  var Arr = irreducible('Arr', function isArr(x) {
    return x instanceof Array;
  });

  var Obj = irreducible('Obj', function isObj(x) {
    return !Nil.is(x) && typeof x === 'object' && !Arr.is(x);
  });

  var Func = irreducible('Func', function isFunc(x) {
    return typeof x === 'function';
  });

  var Err = irreducible('Err', function isErr(x) {
    return x instanceof Error;
  });

  var Re = irreducible('Re', function isRe(x) {
    return x instanceof RegExp;
  });

  var Dat = irreducible('Dat', function isDat(x) {
    return x instanceof Date;
  });

  var Type = irreducible('Type', function isType(x) {
    return Func.is(x) && Obj.is(x.meta);
  });

  function struct(props, name) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a dict of types
    // mouse over the `props` variable to see what's wrong
    assert(dict(Str, Type).is(props), 'Invalid argument `props` = `%s` supplied to `struct` combinator', props);

    // DEBUG HINT: if the debugger stops here, the second argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `struct` combinator', name);

    // DEBUG HINT: always give a name to a type, the debug will be easier
    name = name || format('{%s}', Object.keys(props).map(function (prop) {
      return format('%s: %s', prop, getName(props[prop]));
    }).join(', '));

    function Struct(value, mut) {

      // makes Struct idempotent
      if (Struct.is(value)) {
        return value;
      }

      // DEBUG HINT: if the debugger stops here, the first argument is invalid
      // mouse over the `value` variable to see what's wrong. In `name` there is the name of the type
      assert(Obj.is(value), 'Invalid argument `value` = `%s` supplied to struct type `%s`', value, name);

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

    Struct.extend = function extendStruct(arr, name) {
      arr = [].concat(arr).map(function (x) {
        return Obj.is(x) ? x : x.meta.props;
      });
      arr.unshift(props);
      var ret = struct(arr.reduce(mixin, {}), name);
      mixin(ret.prototype, Struct.prototype); // prototypal inheritance
      return ret;
    };

    return Struct;
  }

  function union(types, name) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a list of types
    assert(list(Type).is(types), 'Invalid argument `types` = `%s` supplied to `union` combinator', types);

    var len = types.length;
    var defaultName = types.map(getName).join(' | ');

    // DEBUG HINT: if the debugger stops here, there are too few types (they must be at least two)
    assert(len >= 2, 'Invalid argument `types` = `%s` supplied to `union` combinator, provide at least two types', defaultName);

    // DEBUG HINT: if the debugger stops here, the second argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `union` combinator', name);

    name = name || defaultName;

    function Union(value, mut) {

      // DEBUG HINT: if the debugger stops here, you have used the `new` operator but it's forbidden
      blockNew(this, Union);

      // DEBUG HINT: if the debugger stops here, you must implement the `dispatch` static method for this type
      assert(Func.is(Union.dispatch), 'Unimplemented `dispatch()` function for union type `%s`', name);

      var type = Union.dispatch(value);

      // DEBUG HINT: if the debugger stops here, the `dispatch` static method returns no type
      assert(Type.is(type), 'The `dispatch()` function of union type `%s` returns no type constructor', name);

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
    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `maybe` combinator', type);

    // makes the combinator idempotent and handle Any, Nil
    if (getKind(type) === 'maybe' || type === Any || type === Nil) {
      return type;
    }

    // DEBUG HINT: if the debugger stops here, the second argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(Nil.is(name) || Str.is(name), 'Invalid argument `name` = `%s` supplied to `maybe` combinator', name);

    name = name || ('?' + getName(type));

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
    assert(Obj.is(map), 'Invalid argument `map` = `%s` supplied to `enums` combinator', map);

    // DEBUG HINT: if the debugger stops here, the second argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `enums` combinator', name);

    // cache enums
    var keys = Object.keys(map);

    name = name || keys.map(function (k) { return JSON.stringify(k); }).join(' | ');

    function Enums(value) {

      // DEBUG HINT: if the debugger stops here, you have used the `new` operator but it's forbidden
      blockNew(this, Enums);

      // DEBUG HINT: if the debugger stops here, the value is not one of the defined enums
      // mouse over the `value`, `name` and `keys` variables to see what's wrong
      assert(Enums.is(value), 'Invalid argument `value` = `%s` supplied to enums type `%s`, expected one of %j', value, name, keys);

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
    assert(list(Type).is(types), 'Invalid argument `types` = `%s` supplied to `tuple` combinator', types);

    var len = types.length;

    // DEBUG HINT: if the debugger stops here, the second argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `tuple` combinator', name);

    name = name || format('[%s]', types.map(getName).join(', '));

    function Tuple(value, mut) {

      // DEBUG HINT: if the debugger stops here, the value is not one of the defined enums
      // mouse over the `value`, `name` and `len` variables to see what's wrong
      assert(Arr.is(value) && value.length === len, 'Invalid argument `value` = `%s` supplied to tuple type `%s`, expected an `Arr` of length `%s`', value, name, len);

      var frozen = (mut !== true);

      // makes Tuple idempotent
      if (Tuple.isTuple(value) && Object.isFrozen(value) === frozen) {
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

      if (frozen) {
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
    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `subtype` combinator', type);

    // DEBUG HINT: if the debugger stops here, the second argument is not a function
    assert(Func.is(predicate), 'Invalid argument `predicate` = `%s` supplied to `subtype` combinator', predicate);

    // DEBUG HINT: if the debugger stops here, the third argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `subtype` combinator', name);

    // DEBUG HINT: always give a name to a type, the debug will be easier
    name = name || format('{%s | %s}', getName(type), getFunctionName(predicate));

    function Subtype(value, mut) {

      // DEBUG HINT: if the debugger stops here, you have used the `new` operator but it's forbidden
      blockNew(this, Subtype);

      // DEBUG HINT: if the debugger stops here, the value cannot be converted to the base type
      var x = type(value, mut);

      // DEBUG HINT: if the debugger stops here, the value is converted to the base type
      // but the predicate returns `false`
      assert(predicate(x), 'Invalid argument `value` = `%s` supplied to subtype type `%s`', value, name);
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
    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `list` combinator', type);

    // DEBUG HINT: if the debugger stops here, the third argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `list` combinator', name);

    // DEBUG HINT: always give a name to a type, the debug will be easier
    name = name || format('Array<%s>', getName(type));

    function List(value, mut) {

      // DEBUG HINT: if the debugger stops here, you have used the `new` operator but it's forbidden

      // DEBUG HINT: if the debugger stops here, the value is not one of the defined enums
      // mouse over the `value` and `name` variables to see what's wrong
      assert(Arr.is(value), 'Invalid argument `value` = `%s` supplied to list type `%s`', value, name);

      var frozen = (mut !== true);

      // makes List idempotent
      if (List.isList(value) && Object.isFrozen(value) === frozen) {
        return value;
      }

      var arr = [];
      for (var i = 0, len = value.length ; i < len ; i++ ) {
        var actual = value[i];
        // DEBUG HINT: if the debugger stops here, the `actual` value supplied to the `type` type is invalid
        // mouse over the `actual` and `type` variables to see what's wrong
        arr.push(type(actual, mut));
      }

      if (frozen) {
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
    assert(Type.is(domain), 'Invalid argument `domain` = `%s` supplied to `dict` combinator', domain);

    // DEBUG HINT: if the debugger stops here, the second argument is not a type
    assert(Type.is(codomain), 'Invalid argument `codomain` = `%s` supplied to `dict` combinator', codomain);

    // DEBUG HINT: if the debugger stops here, the third argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `dict` combinator', name);

    // DEBUG HINT: always give a name to a type, the debug will be easier
    name = name || format('{[key:%s]: %s}', getName(domain), getName(codomain));

    function Dict(value, mut) {

      // DEBUG HINT: if the debugger stops here, the value is not an object
      // mouse over the `value` and `name` variables to see what's wrong
      assert(Obj.is(value), 'Invalid argument `value` = `%s` supplied to dict type `%s`', value, name);

      var frozen = (mut !== true);

      // makes Dict idempotent
      if (Dict.isDict(value) && Object.isFrozen(value) === frozen) {
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

      if (frozen) {
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
    assert(list(Type).is(domain), 'Invalid argument `domain` = `%s` supplied to `func` combinator', domain);

    // DEBUG HINT: if the debugger stops here, the second argument is not a type
    assert(Type.is(codomain), 'Invalid argument `codomain` = `%s` supplied to `func` combinator', codomain);

    // DEBUG HINT: if the debugger stops here, the third argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `func` combinator', name);

    // DEBUG HINT: always give a name to a type, the debug will be easier
    name = name || format('(%s) -> %s', domain.map(getName).join(', '), getName(codomain));

    // cache the domain length
    var domainLen = domain.length;

    function Func(value) {

      // automatically instrument the function if is not already instrumented
      if (!func.is(value)) {
        value = Func.of(value);
      }

      // DEBUG HINT: if the debugger stops here, the first argument is invalid
      // mouse over the `value` and `name` variables to see what's wrong
      assert(Func.is(value), 'Invalid argument `value` = `%s` supplied to func type `%s`', value, name);

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
      format: format,
      getKind: getKind,
      getFunctionName: getFunctionName,
      getName: getName,
      mixin: mixin,
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

    irreducible: irreducible,
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

},{}],19:[function(require,module,exports){
module.exports = {
  getAddon: require('./lib/getAddon'),
  getAlert: require('./lib/getAlert'),
  getBreakpoints: require('./lib/getBreakpoints'),
  getButton: require('./lib/getButton'),
  getButtonGroup: require('./lib/getButtonGroup'),
  getCheckbox: require('./lib/getCheckbox'),
  getCol: require('./lib/getCol'),
  getErrorBlock: require('./lib/getErrorBlock'),
  getFieldset: require('./lib/getFieldset'),
  getFormGroup: require('./lib/getFormGroup'),
  getHelpBlock: require('./lib/getHelpBlock'),
  getInputGroup: require('./lib/getInputGroup'),
  getLabel: require('./lib/getLabel'),
  getOffsets: require('./lib/getOffsets'),
  getOptGroup: require('./lib/getOptGroup'),
  getOption: require('./lib/getOption'),
  getRadio: require('./lib/getRadio'),
  getRow: require('./lib/getRow'),
  getSelect: require('./lib/getSelect'),
  getStatic: require('./lib/getStatic'),
  getTextbox: require('./lib/getTextbox')
};
},{"./lib/getAddon":20,"./lib/getAlert":21,"./lib/getBreakpoints":22,"./lib/getButton":23,"./lib/getButtonGroup":24,"./lib/getCheckbox":25,"./lib/getCol":26,"./lib/getErrorBlock":27,"./lib/getFieldset":28,"./lib/getFormGroup":29,"./lib/getHelpBlock":30,"./lib/getInputGroup":31,"./lib/getLabel":32,"./lib/getOffsets":33,"./lib/getOptGroup":34,"./lib/getOption":35,"./lib/getRadio":36,"./lib/getRow":37,"./lib/getSelect":38,"./lib/getStatic":39,"./lib/getTextbox":40}],20:[function(require,module,exports){
'use strict';

function getAddon(addon) {
  return {
    tag: 'span',
    attrs: {
      className: {
        'input-group-addon': true
      }
    },
    children: addon
  };
}

module.exports = getAddon;
},{}],21:[function(require,module,exports){
'use strict';

function getAlert(opts) {

  var type = opts.type || 'info';
  var className = {
    'alert': true
  };
  className['alert-' + type] = true;

  return {
    tag: 'div',
    attrs: {
      className: className
    },
    children: opts.children
  };
}

module.exports = getAlert;
},{}],22:[function(require,module,exports){
'use strict';

function getBreakpoints(breakpoints) {
  var className = {};
  for (var size in breakpoints) {
    if (breakpoints.hasOwnProperty(size)) {
      className['col-' + size + '-' + breakpoints[size]] = true;
    }
  }
  return className;
}

module.exports = getBreakpoints;
},{}],23:[function(require,module,exports){
'use strict';

/*

  Example:

  {
    type: 'primary',
    block: true,
    active: true,
    size: 'lg',
    disabled: true,
    autoFocus: true
  }

*/

function getButton(opts) {

  var type = opts.type || 'default';

  var className = {
    'btn': true,
    'btn-block': opts.block,
    'active': opts.active
  };
  className['btn-' + type] = true;
  if (opts.size) {
    className['btn-' + opts.size] = true;
  }

  return {
    tag: 'button',
    attrs: {
      disabled: opts.disabled,
      className: className,
      autoFocus: opts.autoFocus
    },
    events: {
      click: opts.click
    },
    children: opts.label,
    key: opts.key
  }
}

module.exports = getButton;

},{}],24:[function(require,module,exports){
'use strict';

function getButtonGroup(buttons) {
  return {
    tag: 'div',
    attrs: {
      className: {
        'btn-group': true
      }
    },
    children: buttons
  };
};

module.exports = getButtonGroup;


},{}],25:[function(require,module,exports){
'use strict';

/*

  Example:

  {
    label: 'Remember me',
    defaultChecked: true,
    checked: true,
    name: 'rememberMe',
    disabled: false,
    onChange: function () {},
    autoFocus: true
  }

*/

function getCheckbox(opts) {

  return {
    tag: 'div',
    attrs: {
      className: {
        'checkbox': true,
        'disabled': opts.disabled
      }
    },
    children: {
      tag: 'label',
      attrs: {
        htmlFor: opts.id
      },
      children: [
        {
          tag: 'input',
          attrs: {
            checked: opts.checked,
            disabled: opts.disabled,
            id: opts.id,
            name: opts.name,
            type: 'checkbox',
            autoFocus: opts.autoFocus
          },
          events: {
            change: opts.onChange
          }
        },
        ' ',
        opts.label
      ]
    }
  }
}

module.exports = getCheckbox;
},{}],26:[function(require,module,exports){
'use strict';

var getBreakpoints = require('./getBreakpoints');

function getCol(opts) {

  var className = opts.breakpoints ? getBreakpoints(opts.breakpoints) : null;

  return {
    tag: 'div',
    attrs: {
      className: className
    },
    children: opts.children
  };
}

module.exports = getCol;
},{"./getBreakpoints":22}],27:[function(require,module,exports){
'use strict';

function getErrorBlock(opts) {
  return {
    tag: 'span',
    attrs: {
      className: {
        'help-block': true,
        'error-block': opts.hasError
      }
    },
    children: opts.error
  };
}

module.exports = getErrorBlock;


},{}],28:[function(require,module,exports){
'use strict';

function getFieldset(opts) {

  var children = opts.children.slice();

  if (opts.legend) {
    children.unshift({
      tag: 'legend',
      children: opts.legend
    });
  }

  return {
    tag: 'fieldset',
    attrs: {
      className: opts.className,
      disabled: opts.disabled
    },
    children: children
  };
};

module.exports = getFieldset;


},{}],29:[function(require,module,exports){
'use strict';

function getFormGroup(opts) {
  return {
    tag: 'div',
    attrs: {
      className: {
        'form-group': true,
        'has-error': opts.hasError
      }
    },
    children: opts.children
  };
}

module.exports = getFormGroup;
},{}],30:[function(require,module,exports){
'use strict';

/*

  Example:

  {
    help: 'my help',
    hasError: true,
    id: 'password-tip'
  }

*/

function getHelpBlock(opts) {
  return {
    tag: 'span',
    attrs: {
      className: {
        'help-block': true,
        'error-block': opts.hasError
      },
      // aria support
      id: opts.id,
      role: 'tooltip'
    },
    children: opts.help
  };
}

module.exports = getHelpBlock;


},{}],31:[function(require,module,exports){
'use strict';

function getInputGroup(children) {
  return {
    tag: 'div',
    attrs: {
      className: {
        'input-group': true
      }
    },
    children: children
  };
}

module.exports = getInputGroup;
},{}],32:[function(require,module,exports){
'use strict';

var mixin = require('./mixin');

/*

  Example:

  {
    label: 'my label',
    htmlFor: 'inputId',
    id: 'myid',
    align: 'right',
    className: {}
  }

*/

function getLabel(opts) {

  var className = mixin({
    'control-label': true
  }, opts.className);

  if (opts.align) {
    className['text-' + opts.align] = true;
  }

  return {
    tag: 'label',
    attrs: {
      htmlFor: opts.htmlFor,
      id: opts.id,
      className: className
    },
    children: opts.label
  };
}

module.exports = getLabel;


},{"./mixin":41}],33:[function(require,module,exports){
'use strict';

function getOffsets(breakpoints) {
  var className = {};
  for (var size in breakpoints) {
    if (breakpoints.hasOwnProperty(size)) {
      className['col-' + size + '-offset-' + (12 - breakpoints[size])] = true;
    }
  }
  return className;
}

module.exports = getOffsets;
},{}],34:[function(require,module,exports){
'use strict';

var getOption = require('./getOption');

/*

  Example:

  {
    label: 'group1',
    options: [
      {value: 'value1', text: 'description1'},
      {value: 'value3', text: 'description3'}
    ]
  }

*/

function getOptGroup(opts) {
  return {
    tag: 'optgroup',
    attrs: {
      disabled: opts.disabled,
      label: opts.label
    },
    children: opts.options.map(getOption),
    key: opts.label
  };
}

module.exports = getOptGroup;


},{"./getOption":35}],35:[function(require,module,exports){
'use strict';

/*

  Example:

  {
    value: '1',
    text: 'option 1'
  }

*/

function getOption(opts) {
  return {
    tag: 'option',
    attrs: {
      disabled: opts.disabled,
      value: opts.value
    },
    children: opts.text,
    key: opts.value
  };
}

module.exports = getOption;


},{}],36:[function(require,module,exports){
'use strict';

/*

  Example:

  {
    label: 'Option',
    defaultChecked: true,
    checked: true,
    value: '1',
    name: 'option',
    disabled: false,
    onChange: function () {},
    autoFocus: true
  }

*/

function getRadio(opts) {

  return {
    tag: 'div',
    attrs: {
      className: {
        'radio': true,
        'disabled': opts.disabled
      }
    },
    children: {
      tag: 'label',
      attrs: {
        htmlFor: opts.id,
      },
      children: [
        {
          tag: 'input',
          attrs: {
            type: 'radio',
            checked: opts.checked,
            defaultChecked: opts.defaultChecked,
            disabled: opts.disabled,
            name: opts.name,
            value: opts.value,
            id: opts.id,
            // aria support
            'aria-describedby': opts['aria-describedby'],
            autoFocus: opts.autoFocus
          },
          events: {
            change: opts.onChange
          }
        },
        ' ',
        opts.label
      ]
    },
    key: opts.value
  };
}

module.exports = getRadio;
},{}],37:[function(require,module,exports){
'use strict';

function getRow(opts) {
  return {
    tag: 'div',
    attrs: {
      className: {
        'row': true
      }
    },
    children: opts.children,
    key: opts.key
  };
}

module.exports = getRow;
},{}],38:[function(require,module,exports){
'use strict';

/*

  Example:

  {
    defaultValue: 'hello',
    value: 'hello',
    name: 'myname',
    disabled: false,
    size: 'lg',
    onChange: function () {},
    'aria-describedby': 'password-tip',
    autoFocus: false
  }

*/

function getSelect(opts) {

  var className = {
    'form-control': true
  };
  if (opts.size) {
    className['input-' + opts.size] = true;
  }

  return {
    tag: 'select',
    attrs: {
      name: opts.name,
      defaultValue: opts.defaultValue,
      value: opts.value,
      disabled: opts.disabled,
      className: className,
      multiple: opts.multiple,
      id: opts.id,
      // aria support
      'aria-describedby': opts['aria-describedby'],
      autoFocus: opts.autoFocus
    },
    children: opts.options,
    events: {
      change: opts.onChange
    }
  };
}

module.exports = getSelect;
},{}],39:[function(require,module,exports){
'use strict';

function getStatic(value) {
  return {
    tag: 'p',
    attrs: {
      className: {
        'form-control-static': true
      }
    },
    children: value
  };
}

module.exports = getStatic;
},{}],40:[function(require,module,exports){
'use strict';

/*

  Example:

  {
    type: 'password',
    defaultValue: 'hello',
    value: 'hello',
    name: 'myname',
    disabled: false,
    placeholder: 'insert your name',
    readOnly: true,
    size: 'lg',
    onChange: function () {},
    'aria-describedby': 'password-tip',
    autoFocus: true
  }

*/

function getTextbox(opts) {

  var type = opts.type || 'text';
  var className = {
    'form-control': true
  };
  if (opts.size) {
    className['input-' + opts.size] = true;
  }

  return {
    tag: type === 'textarea' ? 'textarea' : 'input',
    attrs: {
      type: type === 'textarea' ? null : type,
      name: opts.name,
      defaultValue: opts.defaultValue,
      value: opts.value,
      disabled: opts.disabled,
      placeholder: opts.placeholder,
      readOnly: opts.readOnly,
      className: className,
      id: opts.id,
      'aria-describedby': opts['aria-describedby'],
      autoFocus: opts.autoFocus
    },
    events: {
      change: opts.onChange
    }
  };
}

module.exports = getTextbox;
},{}],41:[function(require,module,exports){
'use strict';

function mixin(a, b) {
  if (!b) { return a; }
  for (var k in b) {
    if (b.hasOwnProperty(k)) {
      a[k] = b[k];
    }
  }
  return a;
}

module.exports = mixin;
},{}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
'use strict';

var React = require('react');
var cx = require('react/lib/cx');

// compile: x -> ReactElement
function compile(x) {

  // with host elements, compile behaves like the identity
  if (React.isValidElement(x)) {
    return x;
  }

  if (Array.isArray(x)) {
    return x.map(compile);
  }

  if (typeof x === 'object' && x !== null) {

    // attrs
    var attrs = mixin({}, x.attrs);
    if (attrs.className) {
      attrs.className = cx(attrs.className) || null; // avoid class=""
    }
    if (x.key != null) { attrs.key = x.key; }
    if (x.ref != null) { attrs.ref = x.ref; }

    // events
    if (x.events) {
      for (var name in x.events) {
        attrs[camelizeEvent(name)] = x.events[name];
      }
    }

    // children
    var children = compile(x.children);

    // build ReactElement
    return React.createElement.apply(React, [x.tag, attrs].concat(children));
  }

  return x;
}

//
// helpers
//

// transforms an event name to a React event name
// click -> onClick
// blur -> onBlur
function camelizeEvent(name) {
  return 'on' + name.charAt(0).toUpperCase() + name.substring(1);
}

function mixin(x, y) {
  if (!y) { return x; }
  for (var k in y) {
    if (y.hasOwnProperty(k)) {
      x[k] = y[k];
    }
  }
  return x;
}

module.exports = {
  compile: compile
};
},{"react":"react","react/lib/cx":42}]},{},[1]);

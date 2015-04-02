(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var React = require('react');
var t = require('../../../.');

// configure ionic plugin
t.form.config.templates = require('../../../lib/skins/gridforms');

// helper function
function render(i, type, options) {

  var formPreview = document.getElementById('p' + i);
  var Form = t.form.Form;

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
        React.DOM.div({className: "grid-form"},
          React.createFactory(Form)({
            ref: 'form',
            type: type,
            options: options
          }),
          React.DOM.br(),
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

var Vendor = t.enums.of(['Magna Phasellus Dolor Incorporated', 'Fames Ac Turpis Inc.']);

var ProductType = t.enums.of(['Vivamus rhoncus.', 'egestas ligula.']);

var Product = t.struct({
  productName: t.Str,
  tags: t.Str,
  vendor: Vendor,
  productType: ProductType,
  productDescription: t.maybe(t.Str),
  sku: t.Str,
  initialStockLevel: t.Num,
  costPrice: t.Num,
  wholesalePrice: t.Num,
  retailPrice: t.Num
});

render('1', Product, {
  label: 'Add to inventory',
  templates: {
    struct: mylayout  // custom template for structs
  },
  fields: {
    initialStockLevel: {
      help: 'Insert a number'
    }
  }
});

// custom template for structs
function mylayout(locals) {

  // hash field name -> field input
  var inputs = locals.inputs;

  return (
    React.createElement("fieldset", null,
      React.createElement("legend", null, locals.label),
      React.createElement("div", {'data-row-span': "4"},
        React.createElement("div", {'data-field-span': "3"},
          inputs.productName
        ),
        React.createElement("div", {'data-field-span': "1"},
          inputs.tags
        )
      ),
      React.createElement("div", {'data-row-span': "2"},
        React.createElement("div", {'data-field-span': "1"},
          inputs.vendor
        ),
        React.createElement("div", {'data-field-span': "1"},
          inputs.productType
        )
      ),
      React.createElement("div", {'data-row-span': "1"},
        React.createElement("div", {'data-field-span': "1"},
          inputs.productDescription
        )
      ),
      React.createElement("div", {'data-row-span': "5"},
        React.createElement("div", {'data-field-span': "1"},
          inputs.sku
        ),
        React.createElement("div", {'data-field-span': "1"},
          inputs.initialStockLevel
        ),
        React.createElement("div", {'data-field-span': "1"},
          inputs.costPrice
        ),
        React.createElement("div", {'data-field-span': "1"},
          inputs.wholesalePrice
        ),
        React.createElement("div", {'data-field-span': "1"},
          inputs.retailPrice
        )
      )
    )
  );
}



},{"../../../.":2,"../../../lib/skins/gridforms":17,"react":"react"}],2:[function(require,module,exports){
var t = require('./lib');

// plug bootstrap skin
t.form.config.templates = require('./lib/skins/bootstrap');

module.exports = t;


},{"./lib":14,"./lib/skins/bootstrap":16}],3:[function(require,module,exports){
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

var Auto = t.enums.of('placeholders labels none', 'Auto');
Auto.defaultValue = 'labels';

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
  label: maybe(Str), // must be a string because of `i18n.optional` concatenation
  name: maybe(Str),
  report: Report,
  templates: Obj
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
  name: maybe(Str),
  placeholder: maybe(Str),
  template: maybe(Func),
  transformer: maybe(Transformer),
  type: maybe(TypeAttr),
  className: maybe(Str)
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
  className: maybe(Str)
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

var NullOption = union([Option, Bool], 'NullOption');

NullOption.dispatch = function (x) {
  return Bool.is(x) ? Bool : Option;
};

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
  nullOption: maybe(NullOption),
  options: maybe(list(SelectOption)),
  order: maybe(Order),
  template: maybe(Func),
  className: maybe(Str)
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
  className: maybe(Str)
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
  legend: maybe(Label),
  order: maybe(list(Label)),
  templates: maybe(Obj),
  className: maybe(Str)
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
  legend: maybe(Label),
  templates: maybe(Obj),
  className: maybe(Str)
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
  SelectValue: SelectValue,
  Radio: Radio,
  Struct: Struct,
  List: List
};


},{"react":"react","tcomb-validation":28}],4:[function(require,module,exports){
'use strict';

var React = require('react');
var t = require('tcomb-validation');
var api = require('../api');
var skin = require('../skin');
var shouldComponentUpdate = require('./shouldComponentUpdate');
var getError = require('../util/getError');
var merge = require('../util/merge');
var uuid = require('../util/uuid');
var compile = require('uvdom/react').compile;
var debug = require('debug')('component:Checkbox');

function normalize(value) {
  return !!t.maybe(t.Bool)(value);
}

var Checkbox = React.createClass({

  displayName: 'Checkbox',

  getInitialState: function () {
    return {
      hasError: false,
      value: normalize(this.props.value)
    };
  },

  componentWillReceiveProps: function (props) {
    this.setState({value: normalize(props.value)});
  },

  shouldComponentUpdate: shouldComponentUpdate,

  onChange: function (value) {
    value = normalize(value);
    this.setState({value: value}, function () {
      this.props.onChange(value);
    }.bind(this));
  },

  getValue: function () {
    var result = t.validate(this.state.value, this.props.ctx.report.type);
    this.setState({hasError: !result.isValid()});
    return result;
  },

  getLocals: function () {
    var opts = new api.Checkbox(this.props.options || {});
    var ctx = this.props.ctx;
    t.assert(!ctx.report.maybe, 'maybe booleans are not supported');
    t.assert(ctx.report.innerType === t.Bool, 'checkboxes support only booleans');
    var id = opts.id || this._rootNodeID || uuid();
    var name = opts.name || ctx.name || id;
    debug('render() called for `%s` field', name);

    // handle labels
    var label = opts.label || ctx.getDefaultLabel(); // checkboxes must have a label

    var value = this.state.value;
    return {
      autoFocus: opts.autoFocus,
      config: merge(ctx.config, opts.config),
      disabled: opts.disabled,
      error: getError(opts.error, value),
      hasError: opts.hasError || this.state.hasError,
      help: opts.help,
      id: id,
      label: label,
      name: name,
      onChange: this.onChange,
      value: value,
      template: opts.template || ctx.templates.checkbox,
      className: opts.className
    };
  },

  render: function () {
    var locals = this.getLocals();
    return compile(locals.template(new skin.Checkbox(locals)));
  }

});

module.exports = Checkbox;


},{"../api":3,"../skin":15,"../util/getError":18,"../util/merge":22,"../util/uuid":24,"./shouldComponentUpdate":11,"debug":25,"react":"react","tcomb-validation":28,"uvdom/react":54}],5:[function(require,module,exports){
'use strict';

var React = require('react');
var getComponent = require('../getComponent');
var api = require('../api');
var getReport = require('../util/getReport');
var config =  require('../config');

function noop() {}

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
    var type = this.props.type;
    var options = this.props.options;
    var ctx = new api.Context({
      auto: api.Auto.defaultValue,
      i18n: config.i18n,
      report: getReport(type),
      templates: config.templates
    });
    var factory = React.createFactory(getComponent(type, options));
    return factory({
      ref: 'input',
      options: options,
      value: this.props.value,
      onChange: this.props.onChange || noop,
      ctx: ctx
    });
  }

});

module.exports = Form;


},{"../api":3,"../config":12,"../getComponent":13,"../util/getReport":20,"react":"react"}],6:[function(require,module,exports){
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
    this.setState({value: value, keys: keys}, function () {
      this.props.onChange(value);
    }.bind(this));
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
      if (!opts.disableRemove) { buttons.push({ label: i18n.remove, click: this.removeItem.bind(this, i) }); }
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
      templates: templates,
      className: opts.className
    };
  },

  render: function () {
    var locals = this.getLocals();
    return compile(locals.templates.list(new skin.List(locals)));
  }

});

module.exports = List;



},{"../api":3,"../getComponent":13,"../skin":15,"../util/getError":18,"../util/getReport":20,"../util/merge":22,"../util/move":23,"../util/uuid":24,"./shouldComponentUpdate":11,"debug":25,"react":"react","tcomb-validation":28,"uvdom/react":54}],7:[function(require,module,exports){
'use strict';

var React = require('react');
var t = require('tcomb-validation');
var api = require('../api');
var skin = require('../skin');
var shouldComponentUpdate = require('./shouldComponentUpdate');
var getError = require('../util/getError');
var merge = require('../util/merge');
var uuid = require('../util/uuid');
var getOptionsOfEnum = require('../util/getOptionsOfEnum');
var compile = require('uvdom/react').compile;
var debug = require('debug')('component:Radio');

function normalize(value) {
  return t.maybe(api.SelectValue)(value);
}

var Radio = React.createClass({

  displayName: 'Radio',

  getInitialState: function () {
    return {
      hasError: false,
      value: normalize(this.props.value)
    };
  },

  componentWillReceiveProps: function (props) {
    this.setState({value: normalize(props.value)});
  },

  shouldComponentUpdate: shouldComponentUpdate,

  onChange: function (value) {
    value = normalize(value);
    this.setState({value: value}, function () {
      this.props.onChange(value);
    }.bind(this));
  },

  getValue: function () {
    var result = t.validate(this.state.value, this.props.ctx.report.type);
    this.setState({hasError: !result.isValid()});
    return result;
  },

  getLocals: function () {
    var opts = new api.Radio(this.props.options || {});
    var ctx = this.props.ctx;
    var id = opts.id || this._rootNodeID || uuid();
    var name = opts.name || ctx.name || id;
    debug('render() called for `%s` field', name);

    // handle labels
    var label = opts.label; // always use the option value if is manually set
    if (!label && ctx.auto === 'labels') {
      // add automatically a label only if there is not a label
      // and the 'labels' auto option is turned on
      label = ctx.getDefaultLabel();
    }

    var options = opts.options ? opts.options.slice() : getOptionsOfEnum(ctx.report.innerType);
    // sort opts
    if (opts.order) {
      options.sort(api.Order.getComparator(opts.order));
    }
    var value = this.state.value;
    return {
      autoFocus: opts.autoFocus,
      config: merge(ctx.config, opts.config),
      disabled: opts.disabled,
      error: getError(opts.error, value),
      hasError: opts.hasError || this.state.hasError,
      help: opts.help,
      id: id,
      label: label,
      name: name,
      onChange: this.onChange,
      options: options,
      value: value,
      template: opts.template || ctx.templates.radio,
      className: opts.className
    };
  },

  render: function () {
    var locals = this.getLocals();
    return compile(locals.template(new skin.Radio(locals)));
  }

});

module.exports = Radio;


},{"../api":3,"../skin":15,"../util/getError":18,"../util/getOptionsOfEnum":19,"../util/merge":22,"../util/uuid":24,"./shouldComponentUpdate":11,"debug":25,"react":"react","tcomb-validation":28,"uvdom/react":54}],8:[function(require,module,exports){
'use strict';

var React = require('react');
var t = require('tcomb-validation');
var api = require('../api');
var skin = require('../skin');
var shouldComponentUpdate = require('./shouldComponentUpdate');
var getError = require('../util/getError');
var getReport = require('../util/getReport');
var merge = require('../util/merge');
var uuid = require('../util/uuid');
var getOptionsOfEnum = require('../util/getOptionsOfEnum');
var compile = require('uvdom/react').compile;
var debug = require('debug')('component:Select');

function normalize(value) {
  return t.maybe(api.SelectValue)(value);
}

var Select = React.createClass({

  displayName: 'Select',

  getInitialState: function () {
    return {
      hasError: false,
      value: normalize(this.props.value)
    };
  },

  componentWillReceiveProps: function (props) {
    this.setState({value: normalize(props.value)});
  },

  shouldComponentUpdate: shouldComponentUpdate,

  onChange: function (value) {
    value = normalize(value);
    this.setState({value: value}, function () {
      this.props.onChange(value);
    }.bind(this));
  },

  getValue: function () {
    var result = t.validate(this.state.value, this.props.ctx.report.type);
    this.setState({hasError: !result.isValid()});
    return result;
  },

  getLocals: function () {
    var opts = new api.Select(this.props.options || {});
    var ctx = this.props.ctx;
    var id = opts.id || this._rootNodeID || uuid();
    var name = opts.name || ctx.name || id;
    debug('render() called for `%s` field', name);
    var Enum = ctx.report.innerType;
    // handle `multiple` attribute
    var multiple = false;
    if (Enum.meta.kind === 'list') {
      multiple = true;
      Enum = getReport(Enum.meta.type).innerType;
    }

    // handle labels
    var label = opts.label; // always use the option value if is manually set
    if (!label && ctx.auto === 'labels') {
      // add automatically a label only if there is not a label
      // and the 'labels' auto option is turned on
      label = ctx.getDefaultLabel();
    }

    var value = this.state.value;
    var options = opts.options ? opts.options.slice() : getOptionsOfEnum(Enum);
    // sort opts
    if (opts.order) {
      options.sort(api.Order.getComparator(opts.order));
    }
    // add a `null` option in first position
    var nullOption = opts.nullOption || {value: '', text: '-'};
    if (!multiple && opts.nullOption !== false) {
      if (t.Nil.is(value)) { value = nullOption.value; }
      options.unshift(nullOption);
    }
    return {
      autoFocus: opts.autoFocus,
      config: merge(ctx.config, opts.config),
      disabled: opts.disabled,
      error: getError(opts.error, value),
      hasError: opts.hasError || this.state.hasError,
      help: opts.help,
      id: id,
      label: label,
      name: name,
      multiple: multiple,
      onChange: function (value) {
        if (value === nullOption.value) {
          value = null;
        }
        this.onChange(value);
      }.bind(this),
      options: options,
      value: value,
      template: opts.template || ctx.templates.select,
      className: opts.className
    };
  },

  render: function () {
    var locals = this.getLocals();
    return compile(locals.template(new skin.Select(locals)));
  }

});

module.exports = Select;


},{"../api":3,"../skin":15,"../util/getError":18,"../util/getOptionsOfEnum":19,"../util/getReport":20,"../util/merge":22,"../util/uuid":24,"./shouldComponentUpdate":11,"debug":25,"react":"react","tcomb-validation":28,"uvdom/react":54}],9:[function(require,module,exports){
'use strict';

var React = require('react');
var t = require('tcomb-validation');
var shouldComponentUpdate = require('./shouldComponentUpdate');
var getComponent = require('../getComponent');
var api = require('../api');
var skin = require('../skin');
var getError = require('../util/getError');
var merge = require('../util/merge');
var humanize = require('../util/humanize');
var getReport = require('../util/getReport');
var compile = require('uvdom/react').compile;
var debug = require('debug')('component:Struct');

function normalize(value) {
  t.maybe(t.Obj)(value);
  return value || {};
}

var Struct = React.createClass({

  displayName: 'Struct',

  getInitialState: function () {
    return {
      hasError: false,
      value: normalize(this.props.value)
    };
  },

  componentWillReceiveProps: function (props) {
    this.setState({value: normalize(props.value)});
  },

  shouldComponentUpdate: shouldComponentUpdate,

  onChange: function (fieldName, fieldValue) {
    var value = t.mixin({}, this.state.value);
    value[fieldName] = fieldValue;
    this.setState({value: value}, function () {
      this.props.onChange(value);
    }.bind(this));
  },

  getValue: function () {
    var report = this.props.ctx.report;
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

    this.setState({hasError: hasError});
    return new t.ValidationResult({errors: errors, value: value});
  },

  getLocals: function () {
    var opts = new api.Struct(this.props.options || {});
    var ctx = this.props.ctx;
    debug('render() called for `%s` field', ctx.name);
    t.assert(!ctx.report.maybe, 'maybe structs are not supported');
    var auto =  opts.auto || ctx.auto;

    // handle legend
    var legend = opts.legend; // always use the option value if is manually set
    if (!legend && ctx.auto === 'labels') {
      // add automatically a legend only if there is not a legend
      // and the 'labels' auto option is turned on
      legend = ctx.getDefaultLabel();
    }

    var config = merge(ctx.config, opts.config);
    var value = this.state.value;
    var props = ctx.report.innerType.meta.props;
    var i18n =  opts.i18n || ctx.i18n;
    var templates = merge(ctx.templates, opts.templates);
    var inputs = {};
    for (var prop in props) {
      if (props.hasOwnProperty(prop)) {
        var propType = props[prop];
        var propOptions = opts.fields ? opts.fields[prop] : null;
        inputs[prop] = React.createFactory(getComponent(propType, propOptions))({
          key: prop,
          ref: prop,
          type: propType,
          options: propOptions,
          value: value[prop],
          onChange: this.onChange.bind(this, prop),
          ctx: new api.Context({
            auto:       auto,
            config:     config,
            i18n:       i18n,
            label:      humanize(prop),
            name:       ctx.name ? ctx.name + '[' + prop + ']' : prop,
            report:     new getReport(propType),
            templates:  templates
          })
        });
      }
    }
    return {
      config: config,
      disabled: opts.disabled,
      error: getError(opts.error, value),
      hasError: opts.hasError || this.state.hasError,
      help: opts.help,
      inputs: inputs,
      legend: legend,
      order: opts.order || Object.keys(props),
      value: value,
      templates: templates,
      className: opts.className
    };
  },

  render: function () {
    var locals = this.getLocals();
    return compile(locals.templates.struct(new skin.Struct(locals)));
  }

});

module.exports = Struct;


},{"../api":3,"../getComponent":13,"../skin":15,"../util/getError":18,"../util/getReport":20,"../util/humanize":21,"../util/merge":22,"./shouldComponentUpdate":11,"debug":25,"react":"react","tcomb-validation":28,"uvdom/react":54}],10:[function(require,module,exports){
'use strict';

var React = require('react');
var t = require('tcomb-validation');
var api = require('../api');
var skin = require('../skin');
var shouldComponentUpdate = require('./shouldComponentUpdate');
var getError = require('../util/getError');
var merge = require('../util/merge');
var uuid = require('../util/uuid');
var config = require('../config');
var compile = require('uvdom/react').compile;
var debug = require('debug')('component:Textbox');

function normalize(value) {
  return (t.Str.is(value) && value.trim() === '') ? null :
    !t.Nil.is(value) ? value :
    null;
}

var Textbox = React.createClass({

  displayName: 'Textbox',

  getInitialState: function () {
    return {
      hasError: false,
      value: normalize(this.props.value)
    };
  },

  componentWillReceiveProps: function (props) {
    this.setState({value: normalize(props.value)});
  },

  shouldComponentUpdate: shouldComponentUpdate,

  onChange: function (value) {
    value = normalize(value);
    this.setState({value: value}, function () {
      this.props.onChange(value);
    }.bind(this));
  },

  getValue: function () {
    var result = t.validate(this.state.value, this.props.ctx.report.type);
    this.setState({hasError: !result.isValid()});
    return result;
  },

  // useful for tests
  getLocals: function () {
    var opts = new api.Textbox(this.props.options || {});
    var ctx = this.props.ctx;
    var id = opts.id || this._rootNodeID || uuid();
    var name = opts.name || ctx.name || id;
    debug('render() called for `%s` field', name);

    // handle labels
    var label = opts.label; // always use the option value if is manually set
    if (!label && ctx.auto === 'labels') {
      // add automatically a label only if there is not a label
      // and the 'labels' auto option is turned on
      label = ctx.getDefaultLabel();
    }

    // handle placeholders
    var placeholder = opts.placeholder; // always use the option value if is manually set
    if (!label && !placeholder && ctx.auto === 'placeholders') {
      // add automatically a placeholder only if there is not a label
      // nor a placeholder manually set and the 'placeholders' auto option is turned on
      placeholder = ctx.getDefaultLabel();
    }

    var value = this.state.value;
    var transformer = opts.transformer || config.transformers[t.getTypeName(ctx.report.innerType)];
    if (transformer) {
      value = transformer.format(value);
    }
    return {
      autoFocus: opts.autoFocus,
      config: merge(ctx.config, opts.config),
      disabled: opts.disabled,
      error: getError(opts.error, value),
      hasError: opts.hasError || this.state.hasError,
      help: opts.help,
      id: id,
      label: label,
      name: name,
      onChange: function (value) {
        if (transformer) {
          value = transformer.parse(value);
        }
        this.onChange(value);
      }.bind(this),
      placeholder: placeholder,
      type: opts.type || 'text',
      value: value,
      template: opts.template || ctx.templates.textbox,
      className: opts.className
    };
  },

  render: function () {
    var locals = this.getLocals();
    return compile(locals.template(new skin.Textbox(locals)));
  }

});

module.exports = Textbox;


},{"../api":3,"../config":12,"../skin":15,"../util/getError":18,"../util/merge":22,"../util/uuid":24,"./shouldComponentUpdate":11,"debug":25,"react":"react","tcomb-validation":28,"uvdom/react":54}],11:[function(require,module,exports){
'use strict';

module.exports = function (nextProps, nextState) {
  return nextState.value !== this.state.value ||
    nextState.hasError !== this.state.hasError ||
    nextProps.value !== this.props.value ||
    nextProps.options !== this.props.options ||
    nextProps.ctx.report.type !== this.props.ctx.report.type;
};


},{}],12:[function(require,module,exports){
'use strict';

var api = require('./api');
var t = require('tcomb-validation');

var defaultLocaleBundle = new api.I18n({
  optional: ' (optional)',
  add: 'Add',
  remove: 'Remove',
  up: 'Up',
  down: 'Down'
});

var NumberTransformer = new api.Transformer({
  format: function (value) {
    return t.Nil.is(value) ? value : String(value);
  },
  parse: function (value) {
    var n = parseFloat(value);
    var isNumeric = (value - n + 1) >= 0;
    return isNumeric ? n : value;
  }
});

module.exports = {
  i18n: defaultLocaleBundle,
  transformers: {
    Num: NumberTransformer
  },
  irreducibles: {
    Bool: require('./components/Checkbox')
  }
};


},{"./api":3,"./components/Checkbox":4,"tcomb-validation":28}],13:[function(require,module,exports){
'use strict';

var t = require('tcomb-validation');
var config = require('./config');

// here requires must be dynamic since there is a circular
// dependency between getComponent and the components
function getComponent(type, options) {
  if (options && options.factory) {
    return options.factory;
  }
  switch (type.meta.kind) {
    case 'irreducible' :
      var name = t.getTypeName(type);
      if (t.Func.is(config.irreducibles[name])) {
        return config.irreducibles[name];
      }
      // fallback on textbox
      return require('./components/Textbox');
    case 'struct' :
      return require('./components/Struct');
    case 'enums' :
      return require('./components/Select');
    case 'list' :
      return require('./components/List');
    case 'maybe' :
    case 'subtype' :
      return getComponent(type.meta.type, options);
  }
}

module.exports = getComponent;


},{"./components/List":6,"./components/Select":8,"./components/Struct":9,"./components/Textbox":10,"./config":12,"tcomb-validation":28}],14:[function(require,module,exports){
var t = require('tcomb-validation');

t.form = {
  debug:    require('debug'),
  config:   require('./config'),
  Form:     require('./components/Form'),
  Textbox:  require('./components/Textbox'),
  Select:   require('./components/Select'),
  Checkbox: require('./components/Checkbox'),
  Radio:    require('./components/Radio'),
  Struct:   require('./components/Struct'),
  List:     require('./components/List')
};

module.exports = t;


},{"./components/Checkbox":4,"./components/Form":5,"./components/List":6,"./components/Radio":7,"./components/Select":8,"./components/Struct":9,"./components/Textbox":10,"./config":12,"debug":25,"tcomb-validation":28}],15:[function(require,module,exports){
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
  value: t.Any,             // should use this as value attribute
  className: maybe(Str)     // should add this to the className attribute
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
  value: Bool,
  className: maybe(Str)
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
  value: maybe(SelectValue),
  className: maybe(Str)
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
  value: maybe(Str),
  className: maybe(Str)
}, 'Radio');

var StructValue = t.dict(Str, t.Any, 'StructValue');

var Struct = struct({
  config: maybe(Obj),
  disabled: maybe(Bool),
  error: maybe(Label),
  help: maybe(Label),
  hasError: maybe(Bool),
  inputs: t.dict(Str, ReactElement),
  legend: maybe(Label),
  order: list(Label),
  value: maybe(StructValue),
  className: maybe(Str)
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
  legend: maybe(Label),
  value: maybe(list(t.Any)),
  className: maybe(Str)
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


},{"react":"react","tcomb-validation":28}],16:[function(require,module,exports){
'use strict';

var t = require('tcomb-validation');
var skin = require('../../skin');
var Label = skin.Label;
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
  return t.mixin(uform.getOffsets(this.getBreakpoints(1)), getBreakpoints(this.getBreakpoints(1)));
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
  if (!locals.hasError || !locals.error) { return; }
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
    size: config.size,
    className: locals.className
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
    },
    className: locals.className
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
    return skin.Option.is(x) ? uform.getOption(x) : uform.getOptGroup(x);
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
    multiple: locals.multiple,
    className: locals.className
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
      value: option.value,
      className: locals.className
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

  var fieldsetClassName = null;
  if (config.horizontal) {
    fieldsetClassName = config.horizontal.getFieldsetClassName();
  }
  if (locals.className) {
    fieldsetClassName = fieldsetClassName || {};
    fieldsetClassName[locals.className] = true;
  }

  return getFormGroup({
    children: getFieldset({
      className: fieldsetClassName,
      disabled: locals.disabled,
      legend: locals.legend,
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
    if (item.buttons.length === 0) {
      return uform.getRow({
        key: item.key,
        children: [
          getCol({
            breakpoints: {xs: 12},
            children: item.input
          })
        ]
      });
    }
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

  var fieldsetClassName = null;
  if (config.horizontal) {
    fieldsetClassName = config.horizontal.getFieldsetClassName();
  }
  if (locals.className) {
    fieldsetClassName = fieldsetClassName || {};
    fieldsetClassName[locals.className] = true;
  }

  return getFormGroup({
    children: getFieldset({
      className: fieldsetClassName,
      disabled: locals.disabled,
      legend: locals.legend,
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


},{"../../skin":15,"tcomb-validation":28,"uvdom-bootstrap/form":30}],17:[function(require,module,exports){
'use strict';

//==================
// WORK IN PROGRESS: contributions and PR are welcomed
//==================

var skin = require('../../skin');

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

function getLabel(locals) {
  if (!locals.label) { return; }
  return {
    tag: 'label',
    attrs: {
      htmlFor: locals.id
    },
    children: locals.label
  };
}

function getFormGroup(opts) {
  return {
    tag: 'div',
    attrs: {
      className: {
        'has-error': opts.hasError
      }
    },
    children: opts.children
  };
}

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

function textbox(locals) {

  var type = locals.type;

  if (locals.type === 'hidden') {
    return getHiddenTextbox(locals);
  }

  var attrs = {
    name: locals.name,
    value: locals.value,
    disabled: locals.disabled,
    id: locals.id,
    type: (type === 'textarea') ? null : type,
    placeholder: locals.placeholder
  };

  var control = {
    tag: (type === 'textarea') ? 'textarea' : 'input',
    attrs: attrs,
    events: {
      change: function (evt) {
        locals.onChange(evt.target.value);
      }
    }
  };

  return getFormGroup({
    hasError: locals.hasError,
    children: [
      getLabel(locals),
      control
    ]
  });
}

function checkbox() {
  throw new Error('checkboxes are not (yet) supported');
}

function select(locals) {

  var options = locals.options.map(function (x) {
    return skin.Option.is(x) ? getOption(x) : getOptGroup(x);
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

  var control = {
    tag: 'select',
    attrs: {
      disabled: locals.disabled,
      id: locals.id,
      name: locals.name,
      value: locals.value
    },
    children: options,
    events: {
      change: onChange
    }
  };

  return getFormGroup({
    hasError: locals.hasError,
    children: [
      getLabel(locals),
      control
    ]
  });
}

function radio() {
  throw new Error('radios are not (yet) supported');
}

function struct() {
  throw new Error('In grid forms you must write a custom template for structs');
}

function list() {
  throw new Error('lists are not (yet) supported');
}

module.exports = {
  name: 'gridforms',
  textbox: textbox,
  checkbox: checkbox,
  select: select,
  radio: radio,
  struct: struct,
  list: list
};



},{"../../skin":15}],18:[function(require,module,exports){
'use strict';

var t = require('tcomb-validation');

function getError(error, value) {
  return t.Func.is(error) ? error(value) : error;
}

module.exports = getError;


},{"tcomb-validation":28}],19:[function(require,module,exports){
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


},{}],20:[function(require,module,exports){
'use strict';

function getReport(type) {

  var innerType = type;
  var maybe = false;
  var subtype = false;
  var kind;

  while (true) {
    kind = innerType.meta.kind;
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


},{}],21:[function(require,module,exports){
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


},{}],22:[function(require,module,exports){
'use strict';

var t = require('tcomb-validation');
var mixin = t.mixin;

function merge(a, b) {
  return mixin(mixin({}, a), b, true);
}

module.exports = merge;


},{"tcomb-validation":28}],23:[function(require,module,exports){
'use strict';

function move(arr, fromIndex, toIndex) {
  var element = arr.splice(fromIndex, 1)[0];
  arr.splice(toIndex, 0, element);
  return arr;
}

module.exports = move;


},{}],24:[function(require,module,exports){
'use strict';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = (c === 'x') ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

module.exports = uuid;


},{}],25:[function(require,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Use chrome.storage.local if we are in an app
 */

var storage;

if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined')
  storage = chrome.storage.local;
else
  storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      storage.removeItem('debug');
    } else {
      storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

},{"./debug":26}],26:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":27}],27:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],28:[function(require,module,exports){
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
  var format = t.format;

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
    return validators[type.meta.kind](x, type, path);
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
  t.mixin(t, {
    ValidationError: ValidationError,
    ValidationResult: ValidationResult,
    validate: validate
  });

  return t;

}));

},{"tcomb":29}],29:[function(require,module,exports){
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

  function fail(message) {
    // start debugger only once
    if (!fail.failed) {
      /*jshint debug: true*/
      debugger;
    }
    fail.failed = true;
    throw new TypeError(message);
  }

  function assert(guard, message) {
    if (guard !== true) {
      message = message ? format.apply(null, slice.call(arguments, 1)) : 'assert failed';
      exports.fail(message);
    }
  }

  //
  // utils
  //

  var slice = Array.prototype.slice;

  function mixin(target, source, overwrite) {
    if (Nil.is(source)) { return target; }
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

  function getFunctionName(f) {
    assert(typeof f === 'function', 'Invalid argument `f` = `%s` supplied to `getFunctionName()`', f);
    return f.displayName || f.name || format('<function%s>', f.length);
  }

  function replacer(key, value) {
    return Func.is(value) ? getFunctionName(value) : value;
  }

  format.formatters = {
    s: function (x) { return String(x); },
    j: function (x) {
      try { // handle circular references
        return JSON.stringify(x, replacer);
      } catch (e) {
        return String(x);
      }
    }
  };

  function getTypeName(type) {
    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `getTypeName()`', type);
    return type.meta.name;
  }

  function blockNew(x, type) {
    assert(!(x instanceof type), 'Operator `new` is forbidden for type `%s`', getTypeName(type));
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
    '$apply': function (f, value) {
      assert(Func.is(f));
      return f(value);
    },
    '$push': function (elements, arr) {
      assert(Arr.is(elements));
      assert(Arr.is(arr));
      return arr.concat(elements);
    },
    '$remove': function (keys, obj) {
      assert(Arr.is(keys));
      assert(Obj.is(obj));
      for (var i = 0, len = keys.length ; i < len ; i++ ) {
        delete obj[keys[i]];
      }
      return obj;
    },
    '$set': function (value) {
      return value;
    },
    '$splice': function (splices, arr) {
      assert(list(Arr).is(splices));
      assert(Arr.is(arr));
      return splices.reduce(function (acc, splice) {
        acc.splice.apply(acc, splice);
        return acc;
      }, arr);
    },
    '$swap': function (config, arr) {
      assert(Obj.is(config));
      assert(Num.is(config.from));
      assert(Num.is(config.to));
      assert(Arr.is(arr));
      var element = arr[config.to];
      arr[config.to] = arr[config.from];
      arr[config.from] = element;
      return arr;
    },
    '$unshift': function (elements, arr) {
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

    assert(typeof name === 'string', 'Invalid argument `name` = `%s` supplied to `irreducible()`', name);
    assert(typeof is === 'function', 'Invalid argument `is` = `%s` supplied to `irreducible()`', is);

    function Irreducible(value) {
      blockNew(this, Irreducible);
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

  var Any = irreducible('Any', function () {
    return true;
  });

  var Nil = irreducible('Nil', function (x) {
    return x === null || x === void 0;
  });

  var Str = irreducible('Str', function (x) {
    return typeof x === 'string';
  });

  var Num = irreducible('Num', function (x) {
    return typeof x === 'number' && isFinite(x) && !isNaN(x);
  });

  var Bool = irreducible('Bool', function (x) {
    return x === true || x === false;
  });

  var Arr = irreducible('Arr', function (x) {
    return x instanceof Array;
  });

  var Obj = irreducible('Obj', function (x) {
    return !Nil.is(x) && typeof x === 'object' && !Arr.is(x);
  });

  var Func = irreducible('Func', function (x) {
    return typeof x === 'function';
  });

  var Err = irreducible('Err', function (x) {
    return x instanceof Error;
  });

  var Re = irreducible('Re', function (x) {
    return x instanceof RegExp;
  });

  var Dat = irreducible('Dat', function (x) {
    return x instanceof Date;
  });

  var Type = irreducible('Type', function (x) {
    return Func.is(x) && Obj.is(x.meta);
  });

  function struct(props, name) {

    assert(dict(Str, Type).is(props), 'Invalid argument `props` = `%s` supplied to `struct` combinator', props);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `struct` combinator', name);
    name = name || format('{%s}', Object.keys(props).map(function (prop) {
      return format('%s: %s', prop, getTypeName(props[prop]));
    }).join(', '));

    function Struct(value, mut) {
      // makes Struct idempotent
      if (Struct.is(value)) {
        return value;
      }
      assert(Obj.is(value), 'Invalid argument `value` = `%s` supplied to struct type `%s`', value, name);
      // makes `new` optional
      if (!(this instanceof Struct)) {
        return new Struct(value, mut);
      }
      for (var k in props) {
        if (props.hasOwnProperty(k)) {
          var expected = props[k];
          var actual = value[k];
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

    Struct.is = function (x) {
      return x instanceof Struct;
    };

    Struct.update = function (instance, spec) {
      return new Struct(exports.update(instance, spec));
    };

    Struct.extend = function (arr, name) {
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

    assert(list(Type).is(types), 'Invalid argument `types` = `%s` supplied to `union` combinator', types);
    var len = types.length;
    var defaultName = types.map(getTypeName).join(' | ');
    assert(len >= 2, 'Invalid argument `types` = `%s` supplied to `union` combinator, provide at least two types', defaultName);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `union` combinator', name);
    name = name || defaultName;

    function Union(value, mut) {
      blockNew(this, Union);
      assert(Func.is(Union.dispatch), 'Unimplemented `dispatch()` function for union type `%s`', name);
      var type = Union.dispatch(value);
      assert(Type.is(type), 'The `dispatch()` function of union type `%s` returns no type constructor', name);
      return type(value, mut);
    }

    Union.meta = {
      kind: 'union',
      types: types,
      name: name
    };

    Union.displayName = name;

    Union.is = function (x) {
      return types.some(function (type) {
        return type.is(x);
      });
    };

    // default dispatch implementation
    Union.dispatch = function (x) {
      for (var i = 0 ; i < len ; i++ ) {
        if (types[i].is(x)) {
          return types[i];
        }
      }
    };

    return Union;
  }

  function maybe(type, name) {

    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `maybe` combinator', type);
    // makes the combinator idempotent and handle Any, Nil
    if (type.meta.kind === 'maybe' || type === Any || type === Nil) {
      return type;
    }
    assert(Nil.is(name) || Str.is(name), 'Invalid argument `name` = `%s` supplied to `maybe` combinator', name);
    name = name || ('?' + getTypeName(type));

    function Maybe(value, mut) {
      blockNew(this, Maybe);
      return Nil.is(value) ? null : type(value, mut);
    }

    Maybe.meta = {
      kind: 'maybe',
      type: type,
      name: name
    };

    Maybe.displayName = name;

    Maybe.is = function (x) {
      return Nil.is(x) || type.is(x);
    };

    return Maybe;
  }

  function enums(map, name) {

    assert(Obj.is(map), 'Invalid argument `map` = `%s` supplied to `enums` combinator', map);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `enums` combinator', name);
    var keys = Object.keys(map); // cache enums
    name = name || keys.map(function (k) { return JSON.stringify(k); }).join(' | ');

    function Enums(value) {
      blockNew(this, Enums);
      assert(Enums.is(value), 'Invalid argument `value` = `%s` supplied to enums type `%s`, expected one of %j', value, name, keys);
      return value;
    }

    Enums.meta = {
      kind: 'enums',
      map: map,
      name: name
    };

    Enums.displayName = name;

    Enums.is = function (x) {
      return Str.is(x) && map.hasOwnProperty(x);
    };

    return Enums;
  }

  enums.of = function (keys, name) {
    keys = Str.is(keys) ? keys.split(' ') : keys;
    var value = {};
    keys.forEach(function (k) {
      value[k] = k;
    });
    return enums(value, name);
  };

  function tuple(types, name) {

    assert(list(Type).is(types), 'Invalid argument `types` = `%s` supplied to `tuple` combinator', types);
    var len = types.length; // cache types length
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `tuple` combinator', name);
    name = name || format('[%s]', types.map(getTypeName).join(', '));

    function isTuple(x) {
      return types.every(function (type, i) {
        return type.is(x[i]);
      });
    }

    function Tuple(value, mut) {
      assert(Arr.is(value) && value.length === len, 'Invalid argument `value` = `%s` supplied to tuple type `%s`, expected an `Arr` of length `%s`', value, name, len);
      var frozen = (mut !== true);
      // makes Tuple idempotent
      if (isTuple(value) && Object.isFrozen(value) === frozen) {
        return value;
      }
      var arr = [];
      for (var i = 0 ; i < len ; i++) {
        var expected = types[i];
        var actual = value[i];
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

    Tuple.is = function (x) {
      return Arr.is(x) && x.length === len && isTuple(x);
    };

    Tuple.update = function (instance, spec) {
      return Tuple(exports.update(instance, spec));
    };

    return Tuple;
  }

  function subtype(type, predicate, name) {

    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `subtype` combinator', type);
    assert(Func.is(predicate), 'Invalid argument `predicate` = `%s` supplied to `subtype` combinator', predicate);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `subtype` combinator', name);
    name = name || format('{%s | %s}', getTypeName(type), getFunctionName(predicate));

    function Subtype(value, mut) {
      blockNew(this, Subtype);
      var x = type(value, mut);
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

    Subtype.is = function (x) {
      return type.is(x) && predicate(x);
    };

    Subtype.update = function (instance, spec) {
      return Subtype(exports.update(instance, spec));
    };

    return Subtype;
  }

  function list(type, name) {

    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `list` combinator', type);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `list` combinator', name);
    name = name || format('Array<%s>', getTypeName(type));

    function isList(x) {
      return x.every(type.is);
    }

    function List(value, mut) {
      assert(Arr.is(value), 'Invalid argument `value` = `%s` supplied to list type `%s`', value, name);
      var frozen = (mut !== true);
      // makes List idempotent
      if (isList(value) && Object.isFrozen(value) === frozen) {
        return value;
      }
      var arr = [];
      for (var i = 0, len = value.length ; i < len ; i++ ) {
        var actual = value[i];
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

    List.is = function (x) {
      return Arr.is(x) && isList(x);
    };

    List.update = function (instance, spec) {
      return List(exports.update(instance, spec));
    };

    return List;
  }

  function dict(domain, codomain, name) {

    assert(Type.is(domain), 'Invalid argument `domain` = `%s` supplied to `dict` combinator', domain);
    assert(Type.is(codomain), 'Invalid argument `codomain` = `%s` supplied to `dict` combinator', codomain);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `dict` combinator', name);
    name = name || format('{[key:%s]: %s}', getTypeName(domain), getTypeName(codomain));

    function isDict(x) {
      for (var k in x) {
        if (x.hasOwnProperty(k)) {
          if (!domain.is(k) || !codomain.is(x[k])) { return false; }
        }
      }
      return true;
    }

    function Dict(value, mut) {
      assert(Obj.is(value), 'Invalid argument `value` = `%s` supplied to dict type `%s`', value, name);
      var frozen = (mut !== true);
      // makes Dict idempotent
      if (isDict(value) && Object.isFrozen(value) === frozen) {
        return value;
      }
      var obj = {};
      for (var k in value) {
        if (value.hasOwnProperty(k)) {
          k = domain(k);
          var actual = value[k];
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

    Dict.is = function (x) {
      return Obj.is(x) && isDict(x);
    };

    Dict.update = function (instance, spec) {
      return Dict(exports.update(instance, spec));
    };

    return Dict;
  }

  function isInstrumented(f) {
    return Func.is(f) && Obj.is(f.type);
  }

  function func(domain, codomain, name) {

    // handle handy syntax for unary functions
    domain = Arr.is(domain) ? domain : [domain];
    assert(list(Type).is(domain), 'Invalid argument `domain` = `%s` supplied to `func` combinator', domain);
    assert(Type.is(codomain), 'Invalid argument `codomain` = `%s` supplied to `func` combinator', codomain);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `func` combinator', name);
    name = name || format('(%s) => %s', domain.map(getTypeName).join(', '), getTypeName(codomain));
    var domainLen = domain.length; // cache the domain length

    function Func(value) {
      // automatically instrument the function
      if (!isInstrumented(value)) {
        return Func.of(value);
      }
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

    Func.is = function (x) {
      return isInstrumented(x) &&
        x.type.domain.length === domainLen &&
        x.type.domain.every(function (type, i) {
          return type === domain[i];
        }) &&
        x.type.codomain === codomain;
    };

    Func.of = function (f) {

      assert(typeof f === 'function');

      // makes Func.of idempotent
      if (Func.is(f)) {
        return f;
      }

      function fn() {
        var args = slice.call(arguments);
        var len = args.length;
        var argsType = tuple(domain.slice(0, len));
        args = argsType(args);
        if (len === domainLen) {
          /* jshint validthis: true */
          return codomain(f.apply(this, args));
        } else {
          var curried = Function.prototype.bind.apply(f, [this].concat(args));
          var newdomain = func(domain.slice(len), codomain);
          return newdomain.of(curried);
        }
      }

      fn.type = {
        domain: domain,
        codomain: codomain,
        f: f
      };

      fn.displayName = getFunctionName(f);

      return fn;

    };

    return Func;

  }

  var exports = {
    format: format,
    getFunctionName: getFunctionName,
    getTypeName: getTypeName,
    mixin: mixin,
    slice: slice,
    shallowCopy: shallowCopy,
    update: update,
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

  return exports;

}));

},{}],30:[function(require,module,exports){
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
},{"./lib/getAddon":31,"./lib/getAlert":32,"./lib/getBreakpoints":33,"./lib/getButton":34,"./lib/getButtonGroup":35,"./lib/getCheckbox":36,"./lib/getCol":37,"./lib/getErrorBlock":38,"./lib/getFieldset":39,"./lib/getFormGroup":40,"./lib/getHelpBlock":41,"./lib/getInputGroup":42,"./lib/getLabel":43,"./lib/getOffsets":44,"./lib/getOptGroup":45,"./lib/getOption":46,"./lib/getRadio":47,"./lib/getRow":48,"./lib/getSelect":49,"./lib/getStatic":50,"./lib/getTextbox":51}],31:[function(require,module,exports){
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
},{}],32:[function(require,module,exports){
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
},{}],33:[function(require,module,exports){
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
},{}],34:[function(require,module,exports){
'use strict';

/*

  Example:

  {
    type: 'primary',
    block: true,
    active: true,
    size: 'lg',
    disabled: true,
    autoFocus: true,
    events: {
      ...
    }
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

  var events = opts.events || {
    click: opts.click
  };

  return {
    tag: 'button',
    attrs: {
      disabled: opts.disabled,
      className: className,
      autoFocus: opts.autoFocus
    },
    events: events,
    children: opts.label,
    key: opts.key
  }
}

module.exports = getButton;

},{}],35:[function(require,module,exports){
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


},{}],36:[function(require,module,exports){
'use strict';

/*

  Example:

  {
    label: 'Remember me',
    defaultChecked: true,
    checked: true,
    name: 'rememberMe',
    disabled: false,
    events: {
      ...
    },
    autoFocus: true,
    className: 'myClassName'
  }

*/

function getCheckbox(opts) {

  var events = opts.events || {
    change: opts.onChange
  };

  var className = null;
  if (opts.className) {
    className = {};
    className[opts.className] = true;
  }

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
            autoFocus: opts.autoFocus,
            className: className
          },
          events: events
        },
        ' ',
        opts.label
      ]
    }
  }
}

module.exports = getCheckbox;
},{}],37:[function(require,module,exports){
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
},{"./getBreakpoints":33}],38:[function(require,module,exports){
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


},{}],39:[function(require,module,exports){
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


},{}],40:[function(require,module,exports){
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
},{}],41:[function(require,module,exports){
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


},{}],42:[function(require,module,exports){
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
},{}],43:[function(require,module,exports){
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


},{"./mixin":52}],44:[function(require,module,exports){
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
},{}],45:[function(require,module,exports){
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


},{"./getOption":46}],46:[function(require,module,exports){
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


},{}],47:[function(require,module,exports){
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
    events: {
      ...
    },
    autoFocus: true,
    className: 'myClassName'
  }

*/

function getRadio(opts) {

  var events = opts.events || {
    change: opts.onChange
  };

  var className = null;
  if (opts.className) {
    className = {};
    className[opts.className] = true;
  }

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
            autoFocus: opts.autoFocus,
            className: className
          },
          events: events
        },
        ' ',
        opts.label
      ]
    },
    key: opts.value
  };
}

module.exports = getRadio;
},{}],48:[function(require,module,exports){
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
},{}],49:[function(require,module,exports){
'use strict';

/*

  Example:

  {
    defaultValue: 'hello',
    value: 'hello',
    name: 'myname',
    disabled: false,
    size: 'lg',
    events: {
      ...
    },
    'aria-describedby': 'password-tip',
    autoFocus: false,
    className: 'myClassName'
  }

*/

function getSelect(opts) {

  var events = opts.events || {
    change: opts.onChange
  };

  var className = {
    'form-control': true
  };
  if (opts.size) {
    className['input-' + opts.size] = true;
  }
  if (opts.className) {
    className[opts.className] = true;
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
    events: events
  };
}

module.exports = getSelect;
},{}],50:[function(require,module,exports){
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
},{}],51:[function(require,module,exports){
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
    events: {
      ...
    },
    'aria-describedby': 'password-tip',
    autoFocus: true,
    className: 'myClassName'
  }

*/

function getTextbox(opts) {

  var events = opts.events || {
    change: opts.onChange
  };

  var type = opts.type || 'text';
  var className = {
    'form-control': true
  };
  if (opts.size) {
    className['input-' + opts.size] = true;
  }
  if (opts.className) {
    className[opts.className] = true;
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
    events: events
  };
}

module.exports = getTextbox;
},{}],52:[function(require,module,exports){
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
},{}],53:[function(require,module,exports){
function classNames() {
	var classes = '';
	var arg;

	for (var i = 0; i < arguments.length; i++) {
		arg = arguments[i];
		if (!arg) {
			continue;
		}

		if ('string' === typeof arg || 'number' === typeof arg) {
			classes += ' ' + arg;
		} else if (Object.prototype.toString.call(arg) === '[object Array]') {
			classes += ' ' + classNames.apply(null, arg);
		} else if ('object' === typeof arg) {
			for (var key in arg) {
				if (!arg.hasOwnProperty(key) || !arg[key]) {
					continue;
				}
				classes += ' ' + key;
			}
		}
	}
	return classes.substr(1);
}

// safely export classNames in case the script is included directly on a page
if (typeof module !== 'undefined' && module.exports) {
	module.exports = classNames;
}

},{}],54:[function(require,module,exports){
'use strict';

var React = require('react');
var cx = require('classnames');

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
},{"classnames":53,"react":"react"}]},{},[1]);

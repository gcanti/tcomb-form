(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/giulio/Documents/Projects/github/tcomb-form/index.js":[function(require,module,exports){
var t = require('./lib');

// plug bootstrap skin
t.form.config.templates = require('./lib/skins/bootstrap');

module.exports = t;

},{"./lib":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/index.js","./lib/skins/bootstrap":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skins/bootstrap/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/api.js":[function(require,module,exports){
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
  name: maybe(t.Str),
  placeholder: maybe(Str),
  template: maybe(Func),
  transformer: maybe(Transformer),
  type: maybe(TypeAttr)
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
  template: maybe(Func)
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
  template: maybe(Func)
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
  template: maybe(Func)
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
  templates: maybe(Obj)
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
  templates: maybe(Obj)
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

},{"react":"react","tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Checkbox.js":[function(require,module,exports){
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
var debug = require('debug')('Checkbox');

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
    this.props.onChange(value);
    this.setState({value: value});
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
    debug('render', name);

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
      template: opts.template || ctx.templates.checkbox
    };
  },

  render: function () {
    var locals = this.getLocals();
    return compile(locals.template(new skin.Checkbox(locals)));
  }

});

module.exports = Checkbox;

},{"../api":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/api.js","../skin":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skin.js","../util/getError":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/getError.js","../util/merge":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/merge.js","../util/uuid":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/uuid.js","./shouldComponentUpdate":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/shouldComponentUpdate.js","debug":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/debug/browser.js","react":"react","tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js","uvdom/react":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom/react.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Form.js":[function(require,module,exports){
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

},{"../api":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/api.js","../config":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/config.js","../getComponent":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/getComponent.js","../util/getReport":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/getReport.js","react":"react"}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/List.js":[function(require,module,exports){
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
var debug = require('debug')('List');

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
    this.props.onChange(value);
    this.setState({value: value, keys: keys});
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
    debug('render', ctx.name);
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
      if (!opts.disabledRemove) { buttons.push({ label: i18n.remove, click: this.removeItem.bind(this, i) }); }
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
      templates: templates
    };
  },

  render: function () {
    var locals = this.getLocals();
    return compile(locals.templates.list(new skin.List(locals)));
  }

});

module.exports = List;

},{"../api":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/api.js","../getComponent":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/getComponent.js","../skin":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skin.js","../util/getError":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/getError.js","../util/getReport":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/getReport.js","../util/merge":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/merge.js","../util/move":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/move.js","../util/uuid":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/uuid.js","./shouldComponentUpdate":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/shouldComponentUpdate.js","debug":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/debug/browser.js","react":"react","tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js","uvdom/react":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom/react.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Radio.js":[function(require,module,exports){
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
var debug = require('debug')('Radio');

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
    this.props.onChange(value);
    this.setState({value: value});
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
    debug('render', name);

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
      template: opts.template || ctx.templates.radio
    };
  },

  render: function () {
    var locals = this.getLocals();
    return compile(locals.template(new skin.Radio(locals)));
  }

});

module.exports = Radio;

},{"../api":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/api.js","../skin":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skin.js","../util/getError":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/getError.js","../util/getOptionsOfEnum":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/getOptionsOfEnum.js","../util/merge":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/merge.js","../util/uuid":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/uuid.js","./shouldComponentUpdate":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/shouldComponentUpdate.js","debug":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/debug/browser.js","react":"react","tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js","uvdom/react":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom/react.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Select.js":[function(require,module,exports){
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
var debug = require('debug')('Select');

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
    this.props.onChange(value);
    this.setState({value: value});
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
    debug('render', name);
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
    if (!multiple) {
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
      template: opts.template || ctx.templates.select
    };
  },

  render: function () {
    var locals = this.getLocals();
    return compile(locals.template(new skin.Select(locals)));
  }

});

module.exports = Select;

},{"../api":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/api.js","../skin":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skin.js","../util/getError":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/getError.js","../util/getOptionsOfEnum":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/getOptionsOfEnum.js","../util/getReport":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/getReport.js","../util/merge":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/merge.js","../util/uuid":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/uuid.js","./shouldComponentUpdate":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/shouldComponentUpdate.js","debug":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/debug/browser.js","react":"react","tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js","uvdom/react":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom/react.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Struct.js":[function(require,module,exports){
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
var debug = require('debug')('Struct');

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
    var value = t.util.mixin({}, this.state.value);
    value[fieldName] = fieldValue;
    this.props.onChange(value);
    this.setState({value: value});
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
    debug('render', ctx.name);
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
      templates: templates
    };
  },

  render: function () {
    var locals = this.getLocals();
    return compile(locals.templates.struct(new skin.Struct(locals)));
  }

});

module.exports = Struct;

},{"../api":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/api.js","../getComponent":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/getComponent.js","../skin":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skin.js","../util/getError":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/getError.js","../util/getReport":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/getReport.js","../util/humanize":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/humanize.js","../util/merge":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/merge.js","./shouldComponentUpdate":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/shouldComponentUpdate.js","debug":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/debug/browser.js","react":"react","tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js","uvdom/react":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom/react.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Textbox.js":[function(require,module,exports){
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
var debug = require('debug')('Textbox');

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
    this.props.onChange(value);
    this.setState({value: value});
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
    debug('render', name);

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
    var transformer = opts.transformer || config.transformers[t.util.getName(ctx.report.innerType)];
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
      template: opts.template || ctx.templates.textbox
    };
  },

  render: function () {
    var locals = this.getLocals();
    return compile(locals.template(new skin.Textbox(locals)));
  }

});

module.exports = Textbox;

},{"../api":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/api.js","../config":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/config.js","../skin":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skin.js","../util/getError":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/getError.js","../util/merge":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/merge.js","../util/uuid":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/uuid.js","./shouldComponentUpdate":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/shouldComponentUpdate.js","debug":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/debug/browser.js","react":"react","tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js","uvdom/react":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom/react.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/shouldComponentUpdate.js":[function(require,module,exports){
'use strict';

module.exports = function (nextProps, nextState) {
  return nextState.value !== this.state.value ||
    nextState.hasError !== this.state.hasError ||
    nextProps.value !== this.props.value ||
    nextProps.options !== this.props.options ||
    nextProps.ctx.report.type !== this.props.ctx.report.type;
};

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/config.js":[function(require,module,exports){
'use strict';

var api = require('./api');
var Checkbox = require('./components/Checkbox');
var t = require('tcomb-validation');

var i18n = new api.I18n({
  optional: ' (optional)',
  add: 'Add',
  remove: 'Remove',
  up: 'Up',
  down: 'Down'
});

module.exports = {
  i18n: i18n,
  transformers: {
    Num: new api.Transformer({
      format: function (value) {
        return t.Nil.is(value) ? value : String(value);
      },
      parse: function (value) {
        var n = parseFloat(value);
        var isNumeric = (value - n + 1) >= 0;
        return isNumeric ? n : value;
      }
    })
  },
  irreducibles: {
    Bool: Checkbox
  }
};

},{"./api":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/api.js","./components/Checkbox":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Checkbox.js","tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/getComponent.js":[function(require,module,exports){
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
      var name = t.util.getName(type);
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

},{"./components/List":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/List.js","./components/Select":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Select.js","./components/Struct":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Struct.js","./components/Textbox":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Textbox.js","./config":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/config.js","tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/index.js":[function(require,module,exports){
var t = require('tcomb-validation');
var config = require('./config');
var Form = require('./components/Form');
var Textbox = require('./components/Textbox');
var Select = require('./components/Select');
var Checkbox = require('./components/Checkbox');
var Radio = require('./components/Radio');
var Struct = require('./components/Struct');
var List = require('./components/List');
var debug = require('debug');

t.form = {
  config: config,
  Form: Form,
  textbox: Textbox,
  select: Select,
  checkbox: Checkbox,
  radio: Radio,
  struct: Struct,
  list: List,
  debug: debug
};

module.exports = t;

},{"./components/Checkbox":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Checkbox.js","./components/Form":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Form.js","./components/List":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/List.js","./components/Radio":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Radio.js","./components/Select":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Select.js","./components/Struct":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Struct.js","./components/Textbox":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Textbox.js","./config":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/config.js","debug":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/debug/browser.js","tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skin.js":[function(require,module,exports){
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
  legend: maybe(Label),
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
  legend: maybe(Label),
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

},{"react":"react","tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skins/bootstrap/index.js":[function(require,module,exports){
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

},{"../../skin":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skin.js","tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js","uvdom-bootstrap/form":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/form.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/getError.js":[function(require,module,exports){
'use strict';

var t = require('tcomb-validation');

function getError(error, value) {
  return t.Func.is(error) ? error(value) : error;
}

module.exports = getError;

},{"tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/getOptionsOfEnum.js":[function(require,module,exports){
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

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/getReport.js":[function(require,module,exports){
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

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/humanize.js":[function(require,module,exports){
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

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/merge.js":[function(require,module,exports){
'use strict';

var t = require('tcomb-validation');
var mixin = t.util.mixin;

function merge(a, b) {
  return mixin(mixin({}, a), b, true);
}

module.exports = merge;

},{"tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/move.js":[function(require,module,exports){
'use strict';

function move(arr, fromIndex, toIndex) {
  var element = arr.splice(fromIndex, 1)[0];
  arr.splice(toIndex, 0, element);
  return arr;
}

module.exports = move;

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/uuid.js":[function(require,module,exports){
'use strict';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = (c === 'x') ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

module.exports = uuid;

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/debug/browser.js":[function(require,module,exports){

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
  storage = window.localStorage;

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

},{"./debug":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/debug/debug.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/debug/debug.js":[function(require,module,exports){

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

},{"ms":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/debug/node_modules/ms/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/debug/node_modules/ms/index.js":[function(require,module,exports){
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
  var match = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 's':
      return n * s;
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

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/deep-diff/index.js":[function(require,module,exports){
(function (global){
/*!
 * deep-diff.
 * Licensed under the MIT License.
 */ 
/*jshint indent:2, laxcomma:true*/
;(function (undefined) {
  "use strict";

  var $scope
  , conflict, conflictResolution = [];
  if (typeof global === 'object' && global) {
    $scope = global;
  } else if (typeof window !== 'undefined') {
    $scope = window;
  } else {
    $scope = {};
  }
  conflict = $scope.DeepDiff;
  if (conflict) {
    conflictResolution.push(
      function () {
        if ('undefined' !== typeof conflict && $scope.DeepDiff === accumulateDiff) {
          $scope.DeepDiff = conflict;
          conflict = undefined;
        }
      });
  }

  // nodejs compatible on server side and in the browser.
  function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  }

  function Diff(kind, path) {
    Object.defineProperty(this, 'kind', { value: kind, enumerable: true });
    if (path && path.length) {
      Object.defineProperty(this, 'path', { value: path, enumerable: true });
    }
  }

  function DiffEdit(path, origin, value) {
    DiffEdit.super_.call(this, 'E', path);
    Object.defineProperty(this, 'lhs', { value: origin, enumerable: true });
    Object.defineProperty(this, 'rhs', { value: value, enumerable: true });
  }
  inherits(DiffEdit, Diff);

  function DiffNew(path, value) {
    DiffNew.super_.call(this, 'N', path);
    Object.defineProperty(this, 'rhs', { value: value, enumerable: true });
  }
  inherits(DiffNew, Diff);

  function DiffDeleted(path, value) {
    DiffDeleted.super_.call(this, 'D', path);
    Object.defineProperty(this, 'lhs', { value: value, enumerable: true });
  }
  inherits(DiffDeleted, Diff);

  function DiffArray(path, index, item) {
    DiffArray.super_.call(this, 'A', path);
    Object.defineProperty(this, 'index', { value: index, enumerable: true });
    Object.defineProperty(this, 'item', { value: item, enumerable: true });
  }
  inherits(DiffArray, Diff);

  function arrayRemove(arr, from, to) {
    var rest = arr.slice((to || from) + 1 || arr.length);
    arr.length = from < 0 ? arr.length + from : from;
    arr.push.apply(arr, rest);
    return arr;
  }

  function deepDiff(lhs, rhs, changes, prefilter, path, key, stack) {
    path = path || [];
    var currentPath = path.slice(0);
    if (typeof key !== 'undefined') {
      if (prefilter && prefilter(currentPath, key)) { return; }
      currentPath.push(key);
    }
    var ltype = typeof lhs;
    var rtype = typeof rhs;
    if (ltype === 'undefined') {
      if (rtype !== 'undefined') {
        changes(new DiffNew(currentPath, rhs));
      }
    } else if (rtype === 'undefined') {
      changes(new DiffDeleted(currentPath, lhs));
    } else if (ltype !== rtype) {
      changes(new DiffEdit(currentPath, lhs, rhs));
    } else if (lhs instanceof Date && rhs instanceof Date && ((lhs - rhs) !== 0)) {
      changes(new DiffEdit(currentPath, lhs, rhs));
    } else if (ltype === 'object' && lhs !== null && rhs !== null) {
      stack = stack || [];
      if (stack.indexOf(lhs) < 0) {
        stack.push(lhs);
        if (Array.isArray(lhs)) {
          var i
          , len = lhs.length
          ;
          for (i = 0; i < lhs.length; i++) {
            if (i >= rhs.length) {
              changes(new DiffArray(currentPath, i, new DiffDeleted(undefined, lhs[i])));
            } else {
              deepDiff(lhs[i], rhs[i], changes, prefilter, currentPath, i, stack);
            }
          }
          while (i < rhs.length) {
            changes(new DiffArray(currentPath, i, new DiffNew(undefined, rhs[i++])));
          }
        } else {
          var akeys = Object.keys(lhs);
          var pkeys = Object.keys(rhs);
          akeys.forEach(function (k, i) {
            var other = pkeys.indexOf(k);
            if (other >= 0) {
              deepDiff(lhs[k], rhs[k], changes, prefilter, currentPath, k, stack);
              pkeys = arrayRemove(pkeys, other);
            } else {
              deepDiff(lhs[k], undefined, changes, prefilter, currentPath, k, stack);
            }
          });
          pkeys.forEach(function (k) {
            deepDiff(undefined, rhs[k], changes, prefilter, currentPath, k, stack);
          });
        }
        stack.length = stack.length - 1;
      }
    } else if (lhs !== rhs) {
      if (!(ltype === "number" && isNaN(lhs) && isNaN(rhs))) {
        changes(new DiffEdit(currentPath, lhs, rhs));
      }
    }
  }

  function accumulateDiff(lhs, rhs, prefilter, accum) {
    accum = accum || [];
    deepDiff(lhs, rhs,
      function (diff) {
        if (diff) {
          accum.push(diff);
        }
      },
      prefilter);
    return (accum.length) ? accum : undefined;
  }

  function applyArrayChange(arr, index, change) {
    if (change.path && change.path.length) {
      var it = arr[index], i, u = change.path.length - 1;
      for (i = 0; i < u; i++) {
        it = it[change.path[i]];
      }
      switch (change.kind) {
        case 'A':
        applyArrayChange(it[change.path[i]], change.index, change.item);
        break;
        case 'D':
        delete it[change.path[i]];
        break;
        case 'E':
        case 'N':
        it[change.path[i]] = change.rhs;
        break;
      }
    } else {
      switch(change.kind) {
        case 'A':
        applyArrayChange(arr[index], change.index, change.item);
        break;
        case 'D':
        arr = arrayRemove(arr, index);
        break;
        case 'E':
        case 'N':
        arr[index] = change.rhs;
        break;
      }
    }
    return arr;
  }

  function applyChange(target, source, change) {
    if (target && source && change && change.kind) {
      var it = target
      , i = -1
      , last = change.path.length - 1
      ;
      while (++i < last) {
        if (typeof it[change.path[i]] === 'undefined') {
          it[change.path[i]] = (typeof change.path[i] === 'number') ? new Array() : {};
        }
        it = it[change.path[i]];
      }
      switch(change.kind) {
        case 'A':
        applyArrayChange(it[change.path[i]], change.index, change.item);
        break;
        case 'D':
        delete it[change.path[i]];
        break;
        case 'E':
        case 'N':
        it[change.path[i]] = change.rhs;
        break;
      }
    }
  }

  function revertArrayChange(arr, index, change) {
    if (change.path && change.path.length) {
      // the structure of the object at the index has changed...
      var it = arr[index], i, u = change.path.length - 1;
      for (i = 0; i < u; i++) {
        it = it[change.path[i]];
      }
      switch(change.kind) {
        case 'A':
        revertArrayChange(it[change.path[i]], change.index, change.item);
        break;
        case 'D':
        it[change.path[i]] = change.lhs;
        break;
        case 'E':
        it[change.path[i]] = change.lhs;
        break;
        case 'N':
        delete it[change.path[i]];
        break;
      }
    } else {
      // the array item is different...
      switch(change.kind) {
        case 'A':
        revertArrayChange(arr[index], change.index, change.item);
        break;
        case 'D':
        arr[index] = change.lhs;
        break;
        case 'E':
        arr[index] = change.lhs;
        break;
        case 'N':
        arr = arrayRemove(arr, index);
        break;
      }
    }
    return arr;
  }

  function revertChange(target, source, change) {
    if (target && source && change && change.kind) {
      var it = target, i, u;
      u = change.path.length - 1;
      for (i = 0; i < u; i++) {
        if (typeof it[change.path[i]] === 'undefined') {
          it[change.path[i]] = {};
        }
        it = it[change.path[i]];
      }
      switch (change.kind) {
        case 'A':
          // Array was modified...
          // it will be an array...
          revertArrayChange(it[change.path[i]], change.index, change.item);
          break;
        case 'D':
          // Item was deleted...
          it[change.path[i]] = change.lhs;
          break;
        case 'E':
          // Item was edited...
          it[change.path[i]] = change.lhs;
          break;
        case 'N':
          // Item is new...
          delete it[change.path[i]];
          break;
      }
    }
  }

  function applyDiff(target, source, filter) {
    if (target && source) {
      var onChange = function (change) {
        if (!filter || filter(target, source, change)) {
          applyChange(target, source, change);
        }
      };
      deepDiff(target, source, onChange);
    }
  }

  Object.defineProperties(accumulateDiff, {

    diff: { value: accumulateDiff, enumerable: true },
    observableDiff: { value: deepDiff, enumerable: true },
    applyDiff: { value: applyDiff, enumerable: true },
    applyChange: { value: applyChange, enumerable: true },
    revertChange: { value: revertChange, enumerable: true },
    isConflict: { value: function () { return 'undefined' !== typeof conflict; }, enumerable: true },
    noConflict: {
      value: function () {
        if (conflictResolution) {
          conflictResolution.forEach(function (it) { it(); });
          conflictResolution = null;
        }
        return accumulateDiff;
      },
      enumerable: true
    }
  });

  if (typeof module !== 'undefined' && module && typeof exports === 'object' && exports && module.exports === exports) {
    module.exports = accumulateDiff; // nodejs
  } else {
    $scope.DeepDiff = accumulateDiff; // other... browser?
  }
}());

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/react-vdom/index.js":[function(require,module,exports){
'use strict';

var t = require('tcomb');

function compact(arr) {
  return arr.filter(function (x) {
    return !t.Nil.is(x);
  });
}

function flatten(arr) {
  return [].concat.apply([], arr);
}

function vdom(x, state) {
  if (t.Arr.is(x)) {
    x = compact(flatten(x)).map(function (y) {
      return vdom(y);
    });
    return x.length > 1 ? x : x[0];
  } else if (t.Obj.is(x)) {
    var type = x.type;
    if (t.Str.is(type)) {
      // tag
      var ret = { tag: type };
      ret.attrs = {};
      var children;
      for (var prop in x.props) {
        if (x.props.hasOwnProperty(prop)) {
          if (prop === 'children') {
            children = vdom(x.props[prop]);
          } else {
            ret.attrs[prop] = vdom(x.props[prop]);
          }
        }
      }
      if (!t.Nil.is(children)) {
        ret.children = children;
      }
      return ret;
    } else {
      // component
      var y = new x.type();
      // props
      var props = y.getDefaultProps ? y.getDefaultProps() : {};
      if (x.props) {
        props = t.util.mixin(props, x.props, true);
      }
      y.props = props;
      // state
      if (t.Nil.is(state) && t.Func.is(y.getInitialState)) {
        state = y.getInitialState();
      }
      y.state = state;
      return vdom(y.render());
    }
  }
  return x;
}

module.exports = vdom;
},{"tcomb":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/react-vdom/node_modules/tcomb/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/react-vdom/node_modules/tcomb/index.js":[function(require,module,exports){
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

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/index.js":[function(require,module,exports){
(function (process){
var defined = require('defined');
var createDefaultStream = require('./lib/default_stream');
var Test = require('./lib/test');
var createResult = require('./lib/results');
var through = require('through');

var canEmitExit = typeof process !== 'undefined' && process
    && typeof process.on === 'function' && process.browser !== true
;
var canExit = typeof process !== 'undefined' && process
    && typeof process.exit === 'function'
;

var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

exports = module.exports = (function () {
    var harness;
    var lazyLoad = function () {
        return getHarness().apply(this, arguments);
    };
    
    lazyLoad.only = function () {
        return getHarness().only.apply(this, arguments);
    };
    
    lazyLoad.createStream = function (opts) {
        if (!opts) opts = {};
        if (!harness) {
            var output = through();
            getHarness({ stream: output, objectMode: opts.objectMode });
            return output;
        }
        return harness.createStream(opts);
    };
    
    return lazyLoad
    
    function getHarness (opts) {
        if (!opts) opts = {};
        opts.autoclose = !canEmitExit;
        if (!harness) harness = createExitHarness(opts);
        return harness;
    }
})();

function createExitHarness (conf) {
    if (!conf) conf = {};
    var harness = createHarness({
        autoclose: defined(conf.autoclose, false)
    });
    
    var stream = harness.createStream({ objectMode: conf.objectMode });
    var es = stream.pipe(conf.stream || createDefaultStream());
    if (canEmitExit) {
        es.on('error', function (err) { harness._exitCode = 1 });
    }
    
    var ended = false;
    stream.on('end', function () { ended = true });
    
    if (conf.exit === false) return harness;
    if (!canEmitExit || !canExit) return harness;

    var inErrorState = false;

    var $_fatalException = process._fatalException
    process._fatalException = function fakeFatalException() {
        inErrorState = true;
        $_fatalException.apply(this, arguments)
    }

    process.on('exit', function (code) {
        // let the process exit cleanly.
        if (inErrorState) {
            return
        }

        if (!ended) {
            var only = harness._results._only;
            for (var i = 0; i < harness._tests.length; i++) {
                var t = harness._tests[i];
                if (only && t.name !== only) continue;
                t._exit();
            }
        }
        harness.close();
        process.exit(code || harness._exitCode);
    });
    
    return harness;
}

exports.createHarness = createHarness;
exports.Test = Test;
exports.test = exports; // tap compat
exports.test.skip = Test.skip;

var exitInterval;

function createHarness (conf_) {
    if (!conf_) conf_ = {};
    var results = createResult();
    if (conf_.autoclose !== false) {
        results.once('done', function () { results.close() });
    }
    
    var test = function (name, conf, cb) {
        var t = new Test(name, conf, cb);
        test._tests.push(t);
        
        (function inspectCode (st) {
            st.on('test', function sub (st_) {
                inspectCode(st_);
            });
            st.on('result', function (r) {
                if (!r.ok) test._exitCode = 1
            });
        })(t);
        
        results.push(t);
        return t;
    };
    test._results = results;
    
    test._tests = [];
    
    test.createStream = function (opts) {
        return results.createStream(opts);
    };
    
    var only = false;
    test.only = function (name) {
        if (only) throw new Error('there can only be one only test');
        results.only(name);
        only = true;
        return test.apply(null, arguments);
    };
    test._exitCode = 0;
    
    test.close = function () { results.close() };
    
    return test;
}

}).call(this,require('_process'))
},{"./lib/default_stream":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/lib/default_stream.js","./lib/results":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/lib/results.js","./lib/test":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/lib/test.js","_process":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","defined":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/defined/index.js","through":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/through/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/lib/default_stream.js":[function(require,module,exports){
(function (process){
var through = require('through');
var fs = require('fs');

module.exports = function () {
    var line = '';
    var stream = through(write, flush);
    return stream;
    
    function write (buf) {
        for (var i = 0; i < buf.length; i++) {
            var c = typeof buf === 'string'
                ? buf.charAt(i)
                : String.fromCharCode(buf[i])
            ;
            if (c === '\n') flush();
            else line += c;
        }
    }
    
    function flush () {
        if (fs.writeSync && /^win/.test(process.platform)) {
            try { fs.writeSync(1, line + '\n'); }
            catch (e) { stream.emit('error', e) }
        }
        else {
            try { console.log(line) }
            catch (e) { stream.emit('error', e) }
        }
        line = '';
    }
};

}).call(this,require('_process'))
},{"_process":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","fs":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/lib/_empty.js","through":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/through/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/lib/results.js":[function(require,module,exports){
(function (process){
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var through = require('through');
var resumer = require('resumer');
var inspect = require('object-inspect');
var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

module.exports = Results;
inherits(Results, EventEmitter);

function Results () {
    if (!(this instanceof Results)) return new Results;
    this.count = 0;
    this.fail = 0;
    this.pass = 0;
    this._stream = through();
    this.tests = [];
}

Results.prototype.createStream = function (opts) {
    if (!opts) opts = {};
    var self = this;
    var output, testId = 0;
    if (opts.objectMode) {
        output = through();
        self.on('_push', function ontest (t, extra) {
            if (!extra) extra = {};
            var id = testId++;
            t.once('prerun', function () {
                var row = {
                    type: 'test',
                    name: t.name,
                    id: id
                };
                if (has(extra, 'parent')) {
                    row.parent = extra.parent;
                }
                output.queue(row);
            });
            t.on('test', function (st) {
                ontest(st, { parent: id });
            });
            t.on('result', function (res) {
                res.test = id;
                res.type = 'assert';
                output.queue(res);
            });
            t.on('end', function () {
                output.queue({ type: 'end', test: id });
            });
        });
        self.on('done', function () { output.queue(null) });
    }
    else {
        output = resumer();
        output.queue('TAP version 13\n');
        self._stream.pipe(output);
    }
    
    nextTick(function next() {
        var t;
        while (t = getNextTest(self)) {
            t.run();
            if (!t.ended) return t.once('end', function(){ nextTick(next); });
        }
        self.emit('done');
    });
    
    return output;
};

Results.prototype.push = function (t) {
    var self = this;
    self.tests.push(t);
    self._watch(t);
    self.emit('_push', t);
};

Results.prototype.only = function (name) {
    if (this._only) {
        self.count ++;
        self.fail ++;
        write('not ok ' + self.count + ' already called .only()\n');
    }
    this._only = name;
};

Results.prototype._watch = function (t) {
    var self = this;
    var write = function (s) { self._stream.queue(s) };
    t.once('prerun', function () {
        write('# ' + t.name + '\n');
    });
    
    t.on('result', function (res) {
        if (typeof res === 'string') {
            write('# ' + res + '\n');
            return;
        }
        write(encodeResult(res, self.count + 1));
        self.count ++;

        if (res.ok) self.pass ++
        else self.fail ++
    });
    
    t.on('test', function (st) { self._watch(st) });
};

Results.prototype.close = function () {
    var self = this;
    if (self.closed) self._stream.emit('error', new Error('ALREADY CLOSED'));
    self.closed = true;
    var write = function (s) { self._stream.queue(s) };
    
    write('\n1..' + self.count + '\n');
    write('# tests ' + self.count + '\n');
    write('# pass  ' + self.pass + '\n');
    if (self.fail) write('# fail  ' + self.fail + '\n')
    else write('\n# ok\n')

    self._stream.queue(null);
};

function encodeResult (res, count) {
    var output = '';
    output += (res.ok ? 'ok ' : 'not ok ') + count;
    output += res.name ? ' ' + res.name.toString().replace(/\s+/g, ' ') : '';
    
    if (res.skip) output += ' # SKIP';
    else if (res.todo) output += ' # TODO';
    
    output += '\n';
    if (res.ok) return output;
    
    var outer = '  ';
    var inner = outer + '  ';
    output += outer + '---\n';
    output += inner + 'operator: ' + res.operator + '\n';
    
    if (has(res, 'expected') || has(res, 'actual')) {
        var ex = inspect(res.expected);
        var ac = inspect(res.actual);
        
        if (Math.max(ex.length, ac.length) > 65) {
            output += inner + 'expected:\n' + inner + '  ' + ex + '\n';
            output += inner + 'actual:\n' + inner + '  ' + ac + '\n';
        }
        else {
            output += inner + 'expected: ' + ex + '\n';
            output += inner + 'actual:   ' + ac + '\n';
        }
    }
    if (res.at) {
        output += inner + 'at: ' + res.at + '\n';
    }
    if (res.operator === 'error' && res.actual && res.actual.stack) {
        var lines = String(res.actual.stack).split('\n');
        output += inner + 'stack:\n';
        output += inner + '  ' + lines[0] + '\n';
        for (var i = 1; i < lines.length; i++) {
            output += inner + lines[i] + '\n';
        }
    }
    
    output += outer + '...\n';
    return output;
}

function getNextTest (results) {
    if (!results._only) {
        return results.tests.shift();
    }
    
    do {
        var t = results.tests.shift();
        if (!t) continue;
        if (results._only === t.name) {
            return t;
        }
    } while (results.tests.length !== 0)
}

function has (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'))
},{"_process":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","events":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/events/events.js","inherits":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/inherits/inherits_browser.js","object-inspect":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/object-inspect/index.js","resumer":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/resumer/index.js","through":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/through/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/lib/test.js":[function(require,module,exports){
(function (process,__dirname){
var deepEqual = require('deep-equal');
var defined = require('defined');
var path = require('path');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

module.exports = Test;

var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

inherits(Test, EventEmitter);

var getTestArgs = function (name_, opts_, cb_) {
    var name = '(anonymous)';
    var opts = {};
    var cb;

    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        var t = typeof arg;
        if (t === 'string') {
            name = arg;
        }
        else if (t === 'object') {
            opts = arg || opts;
        }
        else if (t === 'function') {
            cb = arg;
        }
    }
    return { name: name, opts: opts, cb: cb };
};

function Test (name_, opts_, cb_) {
    if (! (this instanceof Test)) {
        return new Test(name_, opts_, cb_);
    }

    var args = getTestArgs(name_, opts_, cb_);

    this.readable = true;
    this.name = args.name || '(anonymous)';
    this.assertCount = 0;
    this.pendingCount = 0;
    this._skip = args.opts.skip || false;
    this._plan = undefined;
    this._cb = args.cb;
    this._progeny = [];
    this._ok = true;

    if (args.opts.timeout !== undefined) {
        this.timeoutAfter(args.opts.timeout);
    }

    for (var prop in this) {
        this[prop] = (function bind(self, val) {
            if (typeof val === 'function') {
                return function bound() {
                    return val.apply(self, arguments);
                };
            }
            else return val;
        })(this, this[prop]);
    }
}

Test.prototype.run = function () {
    if (!this._cb || this._skip) {
        return this._end();
    }
    this.emit('prerun');
    this._cb(this);
    this.emit('run');
};

Test.prototype.test = function (name, opts, cb) {
    var self = this;
    var t = new Test(name, opts, cb);
    this._progeny.push(t);
    this.pendingCount++;
    this.emit('test', t);
    t.on('prerun', function () {
        self.assertCount++;
    })
    
    if (!self._pendingAsserts()) {
        nextTick(function () {
            self._end();
        });
    }
    
    nextTick(function() {
        if (!self._plan && self.pendingCount == self._progeny.length) {
            self._end();
        }
    });
};

Test.prototype.comment = function (msg) {
    this.emit('result', msg.trim().replace(/^#\s*/, ''));
};

Test.prototype.plan = function (n) {
    this._plan = n;
    this.emit('plan', n);
};

Test.prototype.timeoutAfter = function(ms) {
    if (!ms) throw new Error('timeoutAfter requires a timespan');
    var self = this;
    var timeout = setTimeout(function() {
        self.fail('test timed out after ' + ms + 'ms');
        self.end();
    }, ms);
    this.once('end', function() {
        clearTimeout(timeout);
    });
}

Test.prototype.end = function (err) { 
    var self = this;
    if (arguments.length >= 1) {
        this.ifError(err);
    }
    
    if (this.calledEnd) {
        this.fail('.end() called twice');
    }
    this.calledEnd = true;
    this._end();
};

Test.prototype._end = function (err) {
    var self = this;
    if (this._progeny.length) {
        var t = this._progeny.shift();
        t.on('end', function () { self._end() });
        t.run();
        return;
    }
    
    if (!this.ended) this.emit('end');
    var pendingAsserts = this._pendingAsserts();
    if (!this._planError && this._plan !== undefined && pendingAsserts) {
        this._planError = true;
        this.fail('plan != count', {
            expected : this._plan,
            actual : this.assertCount
        });
    }
    this.ended = true;
};

Test.prototype._exit = function () {
    if (this._plan !== undefined &&
        !this._planError && this.assertCount !== this._plan) {
        this._planError = true;
        this.fail('plan != count', {
            expected : this._plan,
            actual : this.assertCount,
            exiting : true
        });
    }
    else if (!this.ended) {
        this.fail('test exited without ending', {
            exiting: true
        });
    }
};

Test.prototype._pendingAsserts = function () {
    if (this._plan === undefined) {
        return 1;
    }
    else {
        return this._plan - (this._progeny.length + this.assertCount);
    }
};

Test.prototype._assert = function assert (ok, opts) {
    var self = this;
    var extra = opts.extra || {};
    
    var res = {
        id : self.assertCount ++,
        ok : Boolean(ok),
        skip : defined(extra.skip, opts.skip),
        name : defined(extra.message, opts.message, '(unnamed assert)'),
        operator : defined(extra.operator, opts.operator)
    };
    if (has(opts, 'actual') || has(extra, 'actual')) {
        res.actual = defined(extra.actual, opts.actual);
    }
    if (has(opts, 'expected') || has(extra, 'expected')) {
        res.expected = defined(extra.expected, opts.expected);
    }
    this._ok = Boolean(this._ok && ok);
    
    if (!ok) {
        res.error = defined(extra.error, opts.error, new Error(res.name));
    }
    
    if (!ok) {
        var e = new Error('exception');
        var err = (e.stack || '').split('\n');
        var dir = path.dirname(__dirname) + '/';
        
        for (var i = 0; i < err.length; i++) {
            var m = /^[^\s]*\s*\bat\s+(.+)/.exec(err[i]);
            if (!m) {
                continue;
            }
            
            var s = m[1].split(/\s+/);
            var filem = /(\/[^:\s]+:(\d+)(?::(\d+))?)/.exec(s[1]);
            if (!filem) {
                filem = /(\/[^:\s]+:(\d+)(?::(\d+))?)/.exec(s[2]);
                
                if (!filem) {
                    filem = /(\/[^:\s]+:(\d+)(?::(\d+))?)/.exec(s[3]);

                    if (!filem) {
                        continue;
                    }
                }
            }
            
            if (filem[1].slice(0, dir.length) === dir) {
                continue;
            }
            
            res.functionName = s[0];
            res.file = filem[1];
            res.line = Number(filem[2]);
            if (filem[3]) res.column = filem[3];
            
            res.at = m[1];
            break;
        }
    }

    self.emit('result', res);
    
    var pendingAsserts = self._pendingAsserts();
    if (!pendingAsserts) {
        if (extra.exiting) {
            self._end();
        } else {
            nextTick(function () {
                self._end();
            });
        }
    }
    
    if (!self._planError && pendingAsserts < 0) {
        self._planError = true;
        self.fail('plan != count', {
            expected : self._plan,
            actual : self._plan - pendingAsserts
        });
    }
};

Test.prototype.fail = function (msg, extra) {
    this._assert(false, {
        message : msg,
        operator : 'fail',
        extra : extra
    });
};

Test.prototype.pass = function (msg, extra) {
    this._assert(true, {
        message : msg,
        operator : 'pass',
        extra : extra
    });
};

Test.prototype.skip = function (msg, extra) {
    this._assert(true, {
        message : msg,
        operator : 'skip',
        skip : true,
        extra : extra
    });
};

Test.prototype.ok
= Test.prototype['true']
= Test.prototype.assert
= function (value, msg, extra) {
    this._assert(value, {
        message : msg,
        operator : 'ok',
        expected : true,
        actual : value,
        extra : extra
    });
};

Test.prototype.notOk
= Test.prototype['false']
= Test.prototype.notok
= function (value, msg, extra) {
    this._assert(!value, {
        message : msg,
        operator : 'notOk',
        expected : false,
        actual : value,
        extra : extra
    });
};

Test.prototype.error
= Test.prototype.ifError
= Test.prototype.ifErr
= Test.prototype.iferror
= function (err, msg, extra) {
    this._assert(!err, {
        message : defined(msg, String(err)),
        operator : 'error',
        actual : err,
        extra : extra
    });
};

Test.prototype.equal
= Test.prototype.equals
= Test.prototype.isEqual
= Test.prototype.is
= Test.prototype.strictEqual
= Test.prototype.strictEquals
= function (a, b, msg, extra) {
    this._assert(a === b, {
        message : defined(msg, 'should be equal'),
        operator : 'equal',
        actual : a,
        expected : b,
        extra : extra
    });
};

Test.prototype.notEqual
= Test.prototype.notEquals
= Test.prototype.notStrictEqual
= Test.prototype.notStrictEquals
= Test.prototype.isNotEqual
= Test.prototype.isNot
= Test.prototype.not
= Test.prototype.doesNotEqual
= Test.prototype.isInequal
= function (a, b, msg, extra) {
    this._assert(a !== b, {
        message : defined(msg, 'should not be equal'),
        operator : 'notEqual',
        actual : a,
        notExpected : b,
        extra : extra
    });
};

Test.prototype.deepEqual
= Test.prototype.deepEquals
= Test.prototype.isEquivalent
= Test.prototype.same
= function (a, b, msg, extra) {
    this._assert(deepEqual(a, b, { strict: true }), {
        message : defined(msg, 'should be equivalent'),
        operator : 'deepEqual',
        actual : a,
        expected : b,
        extra : extra
    });
};

Test.prototype.deepLooseEqual
= Test.prototype.looseEqual
= Test.prototype.looseEquals
= function (a, b, msg, extra) {
    this._assert(deepEqual(a, b), {
        message : defined(msg, 'should be equivalent'),
        operator : 'deepLooseEqual',
        actual : a,
        expected : b,
        extra : extra
    });
};

Test.prototype.notDeepEqual
= Test.prototype.notEquivalent
= Test.prototype.notDeeply
= Test.prototype.notSame
= Test.prototype.isNotDeepEqual
= Test.prototype.isNotDeeply
= Test.prototype.isNotEquivalent
= Test.prototype.isInequivalent
= function (a, b, msg, extra) {
    this._assert(!deepEqual(a, b, { strict: true }), {
        message : defined(msg, 'should not be equivalent'),
        operator : 'notDeepEqual',
        actual : a,
        notExpected : b,
        extra : extra
    });
};

Test.prototype.notDeepLooseEqual
= Test.prototype.notLooseEqual
= Test.prototype.notLooseEquals
= function (a, b, msg, extra) {
    this._assert(!deepEqual(a, b), {
        message : defined(msg, 'should be equivalent'),
        operator : 'notDeepLooseEqual',
        actual : a,
        expected : b,
        extra : extra
    });
};

Test.prototype['throws'] = function (fn, expected, msg, extra) {
    if (typeof expected === 'string') {
        msg = expected;
        expected = undefined;
    }

    var caught = undefined;

    try {
        fn();
    } catch (err) {
        caught = { error : err };
        var message = err.message;
        delete err.message;
        err.message = message;
    }

    var passed = caught;

    if (expected instanceof RegExp) {
        passed = expected.test(caught && caught.error);
        expected = String(expected);
    }

    if (typeof expected === 'function') {
        passed = caught.error instanceof expected;
        caught.error = caught.error.constructor;
    }

    this._assert(passed, {
        message : defined(msg, 'should throw'),
        operator : 'throws',
        actual : caught && caught.error,
        expected : expected,
        error: !passed && caught && caught.error,
        extra : extra
    });
};

Test.prototype.doesNotThrow = function (fn, expected, msg, extra) {
    if (typeof expected === 'string') {
        msg = expected;
        expected = undefined;
    }
    var caught = undefined;
    try {
        fn();
    }
    catch (err) {
        caught = { error : err };
    }
    this._assert(!caught, {
        message : defined(msg, 'should not throw'),
        operator : 'throws',
        actual : caught && caught.error,
        expected : expected,
        error : caught && caught.error,
        extra : extra
    });
};

function has (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

Test.skip = function (name_, _opts, _cb) {
    var args = getTestArgs.apply(null, arguments);
    args.opts.skip = true;
    return Test(args.name, args.opts, args.cb);
};

// vim: set softtabstop=4 shiftwidth=4:


}).call(this,require('_process'),"/node_modules/tape/lib")
},{"_process":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","deep-equal":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/deep-equal/index.js","defined":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/defined/index.js","events":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/events/events.js","inherits":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/inherits/inherits_browser.js","path":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/path-browserify/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/deep-equal/index.js":[function(require,module,exports){
var pSlice = Array.prototype.slice;
var objectKeys = require('./lib/keys.js');
var isArguments = require('./lib/is_arguments.js');

var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {};
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return opts.strict ? actual === expected : actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected, opts);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer (x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b, opts);
  }
  if (isBuffer(a)) {
    if (!isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b);
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }
  return true;
}

},{"./lib/is_arguments.js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/deep-equal/lib/is_arguments.js","./lib/keys.js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/deep-equal/lib/keys.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/deep-equal/lib/is_arguments.js":[function(require,module,exports){
var supportsArgumentsClass = (function(){
  return Object.prototype.toString.call(arguments)
})() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
};

exports.unsupported = unsupported;
function unsupported(object){
  return object &&
    typeof object == 'object' &&
    typeof object.length == 'number' &&
    Object.prototype.hasOwnProperty.call(object, 'callee') &&
    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
    false;
};

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/deep-equal/lib/keys.js":[function(require,module,exports){
exports = module.exports = typeof Object.keys === 'function'
  ? Object.keys : shim;

exports.shim = shim;
function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/defined/index.js":[function(require,module,exports){
module.exports = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) return arguments[i];
    }
};

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/inherits/inherits_browser.js":[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/object-inspect/index.js":[function(require,module,exports){
module.exports = function inspect_ (obj, opts, depth, seen) {
    if (!opts) opts = {};
    
    var maxDepth = opts.depth === undefined ? 5 : opts.depth;
    if (depth === undefined) depth = 0;
    if (depth > maxDepth && maxDepth > 0) return '...';
    
    if (seen === undefined) seen = [];
    else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }
    
    function inspect (value, from) {
        if (from) {
            seen = seen.slice();
            seen.push(from);
        }
        return inspect_(value, opts, depth + 1, seen);
    }
    
    if (typeof obj === 'string') {
        return inspectString(obj);
    }
    else if (typeof obj === 'function') {
        var name = nameOf(obj);
        return '[Function' + (name ? ': ' + name : '') + ']';
    }
    else if (obj === null) {
        return 'null';
    }
    else if (isElement(obj)) {
        var s = '<' + String(obj.nodeName).toLowerCase();
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '="' + quote(attrs[i].value) + '"';
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) s += '...';
        s += '</' + String(obj.tagName).toLowerCase() + '>';
        return s;
    }
    else if (isArray(obj)) {
        if (obj.length === 0) return '[]';
        var xs = Array(obj.length);
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
        return '[ ' + xs.join(', ') + ' ]';
    }
    else if (typeof obj === 'object' && typeof obj.inspect === 'function') {
        return obj.inspect();
    }
    else if (typeof obj === 'object' && !isDate(obj) && !isRegExp(obj)) {
        var xs = [], keys = [];
        for (var key in obj) {
            if (has(obj, key)) keys.push(key);
        }
        keys.sort();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (/[^\w$]/.test(key)) {
                xs.push(inspect(key) + ': ' + inspect(obj[key], obj));
            }
            else xs.push(key + ': ' + inspect(obj[key], obj));
        }
        if (xs.length === 0) return '{}';
        return '{ ' + xs.join(', ') + ' }';
    }
    else return String(obj);
};

function quote (s) {
    return String(s).replace(/"/g, '&quot;');
}

function isArray (obj) {
    return {}.toString.call(obj) === '[object Array]';
}

function isDate (obj) {
    return {}.toString.call(obj) === '[object Date]';
}

function isRegExp (obj) {
    return {}.toString.call(obj) === '[object RegExp]';
}

function has (obj, key) {
    if (!{}.hasOwnProperty) return key in obj;
    return {}.hasOwnProperty.call(obj, key);
}

function nameOf (f) {
    if (f.name) return f.name;
    var m = f.toString().match(/^function\s*([\w$]+)/);
    if (m) return m[1];
}

function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) return i;
    }
    return -1;
}

function isElement (x) {
    if (!x || typeof x !== 'object') return false;
    if (typeof HTMLElement !== 'undefined') {
        return x instanceof HTMLElement;
    }
    else return typeof x.nodeName === 'string'
        && typeof x.getAttribute === 'function'
    ;
}

function inspectString (str) {
    var s = str.replace(/(['\\])/g, '\\$1').replace(/[\x00-\x1f]/g, lowbyte);
    return "'" + s + "'";
    
    function lowbyte (c) {
        var n = c.charCodeAt(0);
        var x = { 8: 'b', 9: 't', 10: 'n', 12: 'f', 13: 'r' }[n];
        if (x) return '\\' + x;
        return '\\x' + (n < 0x10 ? '0' : '') + n.toString(16);
    }
}

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/resumer/index.js":[function(require,module,exports){
(function (process){
var through = require('through');
var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

module.exports = function (write, end) {
    var tr = through(write, end);
    tr.pause();
    var resume = tr.resume;
    var pause = tr.pause;
    var paused = false;
    
    tr.pause = function () {
        paused = true;
        return pause.apply(this, arguments);
    };
    
    tr.resume = function () {
        paused = false;
        return resume.apply(this, arguments);
    };
    
    nextTick(function () {
        if (!paused) tr.resume();
    });
    
    return tr;
};

}).call(this,require('_process'))
},{"_process":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","through":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/through/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/through/index.js":[function(require,module,exports){
(function (process){
var Stream = require('stream')

// through
//
// a stream that does nothing but re-emit the input.
// useful for aggregating a series of changing but not ending streams into one stream)

exports = module.exports = through
through.through = through

//create a readable writable stream.

function through (write, end, opts) {
  write = write || function (data) { this.queue(data) }
  end = end || function () { this.queue(null) }

  var ended = false, destroyed = false, buffer = [], _ended = false
  var stream = new Stream()
  stream.readable = stream.writable = true
  stream.paused = false

//  stream.autoPause   = !(opts && opts.autoPause   === false)
  stream.autoDestroy = !(opts && opts.autoDestroy === false)

  stream.write = function (data) {
    write.call(this, data)
    return !stream.paused
  }

  function drain() {
    while(buffer.length && !stream.paused) {
      var data = buffer.shift()
      if(null === data)
        return stream.emit('end')
      else
        stream.emit('data', data)
    }
  }

  stream.queue = stream.push = function (data) {
//    console.error(ended)
    if(_ended) return stream
    if(data == null) _ended = true
    buffer.push(data)
    drain()
    return stream
  }

  //this will be registered as the first 'end' listener
  //must call destroy next tick, to make sure we're after any
  //stream piped from here.
  //this is only a problem if end is not emitted synchronously.
  //a nicer way to do this is to make sure this is the last listener for 'end'

  stream.on('end', function () {
    stream.readable = false
    if(!stream.writable && stream.autoDestroy)
      process.nextTick(function () {
        stream.destroy()
      })
  })

  function _end () {
    stream.writable = false
    end.call(stream)
    if(!stream.readable && stream.autoDestroy)
      stream.destroy()
  }

  stream.end = function (data) {
    if(ended) return
    ended = true
    if(arguments.length) stream.write(data)
    _end() // will emit or queue
    return stream
  }

  stream.destroy = function () {
    if(destroyed) return
    destroyed = true
    ended = true
    buffer.length = 0
    stream.writable = stream.readable = false
    stream.emit('close')
    return stream
  }

  stream.pause = function () {
    if(stream.paused) return
    stream.paused = true
    return stream
  }

  stream.resume = function () {
    if(stream.paused) {
      stream.paused = false
      stream.emit('resume')
    }
    drain()
    //may have become paused again,
    //as drain emits 'data'.
    if(!stream.paused)
      stream.emit('drain')
    return stream
  }
  return stream
}


}).call(this,require('_process'))
},{"_process":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","stream":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/stream-browserify/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js":[function(require,module,exports){
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

},{"tcomb":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/node_modules/tcomb/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/node_modules/tcomb/index.js":[function(require,module,exports){
module.exports=require("/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/react-vdom/node_modules/tcomb/index.js")
},{"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/react-vdom/node_modules/tcomb/index.js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/react-vdom/node_modules/tcomb/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/form.js":[function(require,module,exports){
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
},{"./lib/getAddon":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getAddon.js","./lib/getAlert":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getAlert.js","./lib/getBreakpoints":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getBreakpoints.js","./lib/getButton":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getButton.js","./lib/getButtonGroup":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getButtonGroup.js","./lib/getCheckbox":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getCheckbox.js","./lib/getCol":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getCol.js","./lib/getErrorBlock":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getErrorBlock.js","./lib/getFieldset":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getFieldset.js","./lib/getFormGroup":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getFormGroup.js","./lib/getHelpBlock":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getHelpBlock.js","./lib/getInputGroup":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getInputGroup.js","./lib/getLabel":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getLabel.js","./lib/getOffsets":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getOffsets.js","./lib/getOptGroup":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getOptGroup.js","./lib/getOption":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getOption.js","./lib/getRadio":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getRadio.js","./lib/getRow":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getRow.js","./lib/getSelect":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getSelect.js","./lib/getStatic":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getStatic.js","./lib/getTextbox":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getTextbox.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getAddon.js":[function(require,module,exports){
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
},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getAlert.js":[function(require,module,exports){
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
},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getBreakpoints.js":[function(require,module,exports){
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
},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getButton.js":[function(require,module,exports){
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

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getButtonGroup.js":[function(require,module,exports){
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


},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getCheckbox.js":[function(require,module,exports){
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
    autoFocus: true
  }

*/

function getCheckbox(opts) {

  var events = opts.events || {
    change: opts.onChange
  };

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
          events: events
        },
        ' ',
        opts.label
      ]
    }
  }
}

module.exports = getCheckbox;
},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getCol.js":[function(require,module,exports){
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
},{"./getBreakpoints":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getBreakpoints.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getErrorBlock.js":[function(require,module,exports){
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


},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getFieldset.js":[function(require,module,exports){
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


},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getFormGroup.js":[function(require,module,exports){
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
},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getHelpBlock.js":[function(require,module,exports){
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


},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getInputGroup.js":[function(require,module,exports){
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
},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getLabel.js":[function(require,module,exports){
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


},{"./mixin":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/mixin.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getOffsets.js":[function(require,module,exports){
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
},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getOptGroup.js":[function(require,module,exports){
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


},{"./getOption":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getOption.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getOption.js":[function(require,module,exports){
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


},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getRadio.js":[function(require,module,exports){
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
    autoFocus: true
  }

*/

function getRadio(opts) {

  var events = opts.events || {
    change: opts.onChange
  };

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
},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getRow.js":[function(require,module,exports){
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
},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getSelect.js":[function(require,module,exports){
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
    autoFocus: false
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
},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getStatic.js":[function(require,module,exports){
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
},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/getTextbox.js":[function(require,module,exports){
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
    autoFocus: true
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
},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom-bootstrap/lib/mixin.js":[function(require,module,exports){
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
},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom/node_modules/react/lib/cx.js":[function(require,module,exports){
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

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom/react.js":[function(require,module,exports){
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
},{"react":"react","react/lib/cx":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/uvdom/node_modules/react/lib/cx.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/lib/_empty.js":[function(require,module,exports){

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/buffer/index.js":[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('is-array')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var kMaxLength = 0x3fffffff
var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Note:
 *
 * - Implementation must support adding new properties to `Uint8Array` instances.
 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *    incorrect length in some situations.
 *
 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
 * get the Object implementation, which is slower but will work correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = (function () {
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Find the length
  var length
  if (type === 'number')
    length = subject > 0 ? subject >>> 0 : 0
  else if (type === 'string') {
    length = Buffer.byteLength(subject, encoding)
  } else if (type === 'object' && subject !== null) { // assume object is array-like
    if (subject.type === 'Buffer' && isArray(subject.data))
      subject = subject.data
    length = +subject.length > 0 ? Math.floor(+subject.length) : 0
  } else
    throw new TypeError('must start with number, buffer, array or string')

  if (length > kMaxLength)
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
      'size: 0x' + kMaxLength.toString(16) + ' bytes')

  var buf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer.TYPED_ARRAY_SUPPORT && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    if (Buffer.isBuffer(subject)) {
      for (i = 0; i < length; i++)
        buf[i] = subject.readUInt8(i)
    } else {
      for (i = 0; i < length; i++)
        buf[i] = ((subject[i] % 256) + 256) % 256
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer.TYPED_ARRAY_SUPPORT && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  if (length > 0 && length <= Buffer.poolSize)
    buf.parent = rootParent

  return buf
}

function SlowBuffer(subject, encoding, noZero) {
  if (!(this instanceof SlowBuffer))
    return new SlowBuffer(subject, encoding, noZero)

  var buf = new Buffer(subject, encoding, noZero)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b))
    throw new TypeError('Arguments must be Buffers')

  var x = a.length
  var y = b.length
  for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
  if (i !== len) {
    x = a[i]
    y = b[i]
  }
  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function (list, totalLength) {
  if (!isArray(list)) throw new TypeError('Usage: Buffer.concat(list[, length])')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (totalLength === undefined) {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    case 'hex':
      ret = str.length >>> 1
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    default:
      ret = str.length
  }
  return ret
}

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function (encoding, start, end) {
  var loweredCase = false

  start = start >>> 0
  end = end === undefined || end === Infinity ? this.length : end >>> 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase)
          throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.equals = function (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max)
      str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  return Buffer.compare(this, b)
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(byte)) throw new Error('Invalid hex string')
    buf[offset + i] = byte
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
  return charsWritten
}

function asciiWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function utf16leWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length, 2)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0

  if (length < 0 || offset < 0 || offset > this.length)
    throw new RangeError('attempt to write outside buffer bounds');

  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = utf16leWrite(this, string, offset, length)
      break
    default:
      throw new TypeError('Unknown encoding: ' + encoding)
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len;
    if (start < 0)
      start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0)
      end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start)
    end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length)
    newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0)
    throw new RangeError('offset is not uint')
  if (offset + ext > length)
    throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert)
    checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100))
    val += this[offset + i] * mul

  return val
}

Buffer.prototype.readUIntBE = function (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert)
    checkOffset(offset, byteLength, this.length)

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100))
    val += this[offset + --byteLength] * mul;

  return val
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
      ((this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      this[offset + 3])
}

Buffer.prototype.readIntLE = function (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert)
    checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100))
    val += this[offset + i] * mul
  mul *= 0x80

  if (val >= mul)
    val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert)
    checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100))
    val += this[offset + --i] * mul
  mul *= 0x80

  if (val >= mul)
    val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80))
    return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16) |
      (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
      (this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      (this[offset + 3])
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert)
    checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100))
    this[offset + i] = (value / mul) >>> 0 & 0xFF

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert)
    checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100))
    this[offset + i] = (value / mul) >>> 0 & 0xFF

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = value
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else objectWriteUInt16(this, value, offset, true)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else objectWriteUInt16(this, value, offset, false)
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = value
  } else objectWriteUInt32(this, value, offset, true)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else objectWriteUInt32(this, value, offset, false)
  return offset + 4
}

Buffer.prototype.writeIntLE = function (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkInt(this,
             value,
             offset,
             byteLength,
             Math.pow(2, 8 * byteLength - 1) - 1,
             -Math.pow(2, 8 * byteLength - 1))
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100))
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkInt(this,
             value,
             offset,
             byteLength,
             Math.pow(2, 8 * byteLength - 1) - 1,
             -Math.pow(2, 8 * byteLength - 1))
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100))
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = value
  return offset + 1
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else objectWriteUInt16(this, value, offset, true)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else objectWriteUInt16(this, value, offset, false)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else objectWriteUInt32(this, value, offset, true)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else objectWriteUInt32(this, value, offset, false)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert)
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert)
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (target_start >= target.length) target_start = target.length
  if (!target_start) target_start = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || source.length === 0) return 0

  // Fatal error conditions
  if (target_start < 0)
    throw new RangeError('targetStart out of bounds')
  if (start < 0 || start >= source.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < len; i++) {
      target[i + target_start] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-z\-]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes(string, units) {
  var codePoint, length = string.length
  var leadSurrogate = null
  units = units || Infinity
  var bytes = []
  var i = 0

  for (; i<length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {

      // last char was a lead
      if (leadSurrogate) {

        // 2 leads in a row
        if (codePoint < 0xDC00) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          leadSurrogate = codePoint
          continue
        }

        // valid surrogate pair
        else {
          codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
          leadSurrogate = null
        }
      }

      // no lead yet
      else {

        // unexpected trail
        if (codePoint > 0xDBFF) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // unpaired lead
        else if (i + 1 === length) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        else {
          leadSurrogate = codePoint
          continue
        }
      }
    }

    // valid bmp char, but last char was a lead
    else if (leadSurrogate) {
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
      leadSurrogate = null
    }

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    }
    else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    }
    else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    }
    else if (codePoint < 0x200000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    }
    else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {

    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length, unitSize) {
  if (unitSize) length -= length % unitSize;
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

},{"base64-js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib/b64.js","ieee754":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/buffer/node_modules/ieee754/index.js","is-array":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/buffer/node_modules/is-array/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib/b64.js":[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/buffer/node_modules/ieee754/index.js":[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/buffer/node_modules/is-array/index.js":[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/events/events.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/inherits/inherits_browser.js":[function(require,module,exports){
module.exports=require("/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/inherits/inherits_browser.js")
},{"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/inherits/inherits_browser.js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/node_modules/inherits/inherits_browser.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/isarray/index.js":[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/path-browserify/index.js":[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/duplex.js":[function(require,module,exports){
module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_duplex.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_duplex.js":[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
/*</replacement>*/


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

forEach(objectKeys(Writable.prototype), function(method) {
  if (!Duplex.prototype[method])
    Duplex.prototype[method] = Writable.prototype[method];
});

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  process.nextTick(this.end.bind(this));
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

}).call(this,require('_process'))
},{"./_stream_readable":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_readable.js","./_stream_writable":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_writable.js","_process":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","core-util-is":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/node_modules/core-util-is/lib/util.js","inherits":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/inherits/inherits_browser.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_passthrough.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

},{"./_stream_transform":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_transform.js","core-util-is":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/node_modules/core-util-is/lib/util.js","inherits":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/inherits/inherits_browser.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_readable.js":[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Readable;

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/


/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Readable.ReadableState = ReadableState;

var EE = require('events').EventEmitter;

/*<replacement>*/
if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

var Stream = require('stream');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var StringDecoder;

util.inherits(Readable, Stream);

function ReadableState(options, stream) {
  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = false;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // In streams that never have any data, and do push(null) right away,
  // the consumer can miss the 'end' event if they do some I/O before
  // consuming the stream.  So, we don't emit('end') until some reading
  // happens.
  this.calledRead = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (typeof chunk === 'string' && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null || chunk === undefined) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      // update the buffer info.
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront) {
        state.buffer.unshift(chunk);
      } else {
        state.reading = false;
        state.buffer.push(chunk);
      }

      if (state.needReadable)
        emitReadable(stream);

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (n === null || isNaN(n)) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  var state = this._readableState;
  state.calledRead = true;
  var nOrig = n;
  var ret;

  if (typeof n !== 'number' || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    ret = null;

    // In cases where the decoder did not receive enough data
    // to produce a full chunk, then immediately received an
    // EOF, state.buffer will contain [<Buffer >, <Buffer 00 ...>].
    // howMuchToRead will see this and coerce the amount to
    // read to zero (because it's looking at the length of the
    // first <Buffer > in state.buffer), and we'll end up here.
    //
    // This can only happen via state.decoder -- no other venue
    // exists for pushing a zero-length chunk into state.buffer
    // and triggering this behavior. In this case, we return our
    // remaining data and end the stream, if appropriate.
    if (state.length > 0 && state.decoder) {
      ret = fromList(n, state);
      state.length -= ret.length;
    }

    if (state.length === 0)
      endReadable(this);

    return ret;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;

  // if we currently have less than the highWaterMark, then also read some
  if (state.length - n <= state.highWaterMark)
    doRead = true;

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading)
    doRead = false;

  if (doRead) {
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read called its callback synchronously, then `reading`
  // will be false, and we need to re-evaluate how much data we
  // can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we happened to read() exactly the remaining amount in the
  // buffer, and the EOF has been seen at this point, then make sure
  // that we emit 'end' on the very next tick.
  if (state.ended && !state.endEmitted && state.length === 0)
    endReadable(this);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // if we've ended and we have some data left, then emit
  // 'readable' now to make sure it gets picked up.
  if (state.length > 0)
    emitReadable(stream);
  else
    endReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (state.emittedReadable)
    return;

  state.emittedReadable = true;
  if (state.sync)
    process.nextTick(function() {
      emitReadable_(stream);
    });
  else
    emitReadable_(stream);
}

function emitReadable_(stream) {
  stream.emit('readable');
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    process.nextTick(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    if (readable !== src) return;
    cleanup();
  }

  function onend() {
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (!dest._writableState || dest._writableState.needDrain)
      ondrain();
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    unpipe();
    dest.removeListener('error', onerror);
    if (EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS.
  if (!dest._events || !dest._events.error)
    dest.on('error', onerror);
  else if (isArray(dest._events.error))
    dest._events.error.unshift(onerror);
  else
    dest._events.error = [onerror, dest._events.error];



  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    // the handler that waits for readable events after all
    // the data gets sucked out in flow.
    // This would be easier to follow with a .once() handler
    // in flow(), but that is too slow.
    this.on('readable', pipeOnReadable);

    state.flowing = true;
    process.nextTick(function() {
      flow(src);
    });
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var dest = this;
    var state = src._readableState;
    state.awaitDrain--;
    if (state.awaitDrain === 0)
      flow(src);
  };
}

function flow(src) {
  var state = src._readableState;
  var chunk;
  state.awaitDrain = 0;

  function write(dest, i, list) {
    var written = dest.write(chunk);
    if (false === written) {
      state.awaitDrain++;
    }
  }

  while (state.pipesCount && null !== (chunk = src.read())) {

    if (state.pipesCount === 1)
      write(state.pipes, 0, null);
    else
      forEach(state.pipes, write);

    src.emit('data', chunk);

    // if anyone needs a drain, then we have to wait for that.
    if (state.awaitDrain > 0)
      return;
  }

  // if every destination was unpiped, either before entering this
  // function, or in the while loop, then stop flowing.
  //
  // NB: This is a pretty rare edge case.
  if (state.pipesCount === 0) {
    state.flowing = false;

    // if there were data event listeners added, then switch to old mode.
    if (EE.listenerCount(src, 'data') > 0)
      emitDataEvents(src);
    return;
  }

  // at this point, no one needed a drain, so we just ran out of data
  // on the next readable event, start it over again.
  state.ranOut = true;
}

function pipeOnReadable() {
  if (this._readableState.ranOut) {
    this._readableState.ranOut = false;
    flow(this);
  }
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data' && !this._readableState.flowing)
    emitDataEvents(this);

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        this.read(0);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  emitDataEvents(this);
  this.read(0);
  this.emit('resume');
};

Readable.prototype.pause = function() {
  emitDataEvents(this, true);
  this.emit('pause');
};

function emitDataEvents(stream, startPaused) {
  var state = stream._readableState;

  if (state.flowing) {
    // https://github.com/isaacs/readable-stream/issues/16
    throw new Error('Cannot switch to old mode now.');
  }

  var paused = startPaused || false;
  var readable = false;

  // convert to an old-style stream.
  stream.readable = true;
  stream.pipe = Stream.prototype.pipe;
  stream.on = stream.addListener = Stream.prototype.on;

  stream.on('readable', function() {
    readable = true;

    var c;
    while (!paused && (null !== (c = stream.read())))
      stream.emit('data', c);

    if (c === null) {
      readable = false;
      stream._readableState.needReadable = true;
    }
  });

  stream.pause = function() {
    paused = true;
    this.emit('pause');
  };

  stream.resume = function() {
    paused = false;
    if (readable)
      process.nextTick(function() {
        stream.emit('readable');
      });
    else
      this.read(0);
    this.emit('resume');
  };

  // now make it start, just in case it hadn't already.
  stream.emit('readable');
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    if (state.decoder)
      chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    //if (state.objectMode && util.isNullOrUndefined(chunk))
    if (state.objectMode && (chunk === null || chunk === undefined))
      return;
    else if (!state.objectMode && (!chunk || !chunk.length))
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (typeof stream[i] === 'function' &&
        typeof this[i] === 'undefined') {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted && state.calledRead) {
    state.ended = true;
    process.nextTick(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

}).call(this,require('_process'))
},{"_process":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","buffer":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/buffer/index.js","core-util-is":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/node_modules/core-util-is/lib/util.js","events":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/events/events.js","inherits":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/inherits/inherits_browser.js","isarray":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/isarray/index.js","stream":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/stream-browserify/index.js","string_decoder/":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/string_decoder/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_transform.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined)
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  var ts = this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('finish', function() {
    if ('function' === typeof this._flush)
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var rs = stream._readableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

},{"./_stream_duplex":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_duplex.js","core-util-is":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/node_modules/core-util-is/lib/util.js","inherits":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/inherits/inherits_browser.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_writable.js":[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;

/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Writable.WritableState = WritableState;


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Stream = require('stream');

util.inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;
}

function Writable(options) {
  var Duplex = require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  process.nextTick(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    process.nextTick(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (typeof cb !== 'function')
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb))
    ret = writeOrBuffer(this, state, chunk, encoding, cb);

  return ret;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      typeof chunk === 'string') {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret)
    state.needDrain = true;

  if (state.writing)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    process.nextTick(function() {
      cb(er);
    });
  else
    cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished && !state.bufferProcessing && state.buffer.length)
      clearBuffer(stream, state);

    if (sync) {
      process.nextTick(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  cb();
  if (finished)
    finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  for (var c = 0; c < state.buffer.length; c++) {
    var entry = state.buffer[c];
    var chunk = entry.chunk;
    var encoding = entry.encoding;
    var cb = entry.callback;
    var len = state.objectMode ? 1 : chunk.length;

    doWrite(stream, state, len, chunk, encoding, cb);

    // if we didn't call the onwrite immediately, then
    // it means that we need to wait until it does.
    // also, that means that the chunk and cb are currently
    // being processed, so move the buffer counter past them.
    if (state.writing) {
      c++;
      break;
    }
  }

  state.bufferProcessing = false;
  if (c < state.buffer.length)
    state.buffer = state.buffer.slice(c);
  else
    state.buffer.length = 0;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (typeof chunk !== 'undefined' && chunk !== null)
    this.write(chunk, encoding);

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    state.finished = true;
    stream.emit('finish');
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      process.nextTick(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

}).call(this,require('_process'))
},{"./_stream_duplex":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_duplex.js","_process":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","buffer":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/buffer/index.js","core-util-is":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/node_modules/core-util-is/lib/util.js","inherits":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/inherits/inherits_browser.js","stream":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/stream-browserify/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/node_modules/core-util-is/lib/util.js":[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

function isBuffer(arg) {
  return Buffer.isBuffer(arg);
}
exports.isBuffer = isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}
}).call(this,require("buffer").Buffer)
},{"buffer":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/buffer/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/passthrough.js":[function(require,module,exports){
module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_passthrough.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/readable.js":[function(require,module,exports){
var Stream = require('stream'); // hack to fix a circular dependency issue when used with browserify
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = Stream;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_duplex.js","./lib/_stream_passthrough.js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_passthrough.js","./lib/_stream_readable.js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_readable.js","./lib/_stream_transform.js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_transform.js","./lib/_stream_writable.js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_writable.js","stream":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/stream-browserify/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/transform.js":[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_transform.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/writable.js":[function(require,module,exports){
module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_writable.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/stream-browserify/index.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/events/events.js","inherits":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/inherits/inherits_browser.js","readable-stream/duplex.js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/duplex.js","readable-stream/passthrough.js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/passthrough.js","readable-stream/readable.js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/readable.js","readable-stream/transform.js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/transform.js","readable-stream/writable.js":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/writable.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/string_decoder/index.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/watchify/node_modules/browserify/node_modules/buffer/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/checkbox.js":[function(require,module,exports){
'use strict';

var test = require('tape');
var t = require('tcomb-validation');
var skin = require('../../lib/skin');
var bootstrap = require('../../lib/skins/bootstrap');
var diff = require('deep-diff').diff;
var compact = require('./compact');
var mixin = t.util.mixin;

test('bootstrap checkbox()', function (tape) {

  var base = {
    id: 'myid',
    name: 'myname',
    onChange: function () {},
    label: 'mylabel',
    value: false
  };

  var equal = function (tape, locals, expected, showDiff) {
    locals = mixin(mixin({}, base), locals, true);
    locals = new skin.Checkbox(locals);
    expected = compact(expected);
    var actual = compact(bootstrap.checkbox(locals));
    if (showDiff) {
      console.dir(diff(actual, expected));
    }
    tape.deepEqual(actual, expected);
  };

  tape.test('base', function (tape) {
    tape.plan(1);
    equal(tape, {}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'div',
        attrs: {
          className: {
            'checkbox': true
          }
        },
        children: {
          tag: 'label',
          attrs: {
            htmlFor: 'myid'
          },
          children: [
            {
              tag: 'input',
              attrs: {
                type: 'checkbox',
                name: 'myname',
                checked: false,
                id: 'myid'
              },
              events: {
                change: base.onChange
              }
            },
            ' ',
            'mylabel'
          ]
        }
      }
    });
  });

  tape.test('disabled', function (tape) {
    tape.plan(1);
    equal(tape, {disabled: true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'div',
        attrs: {
          className: {
            'checkbox': true,
            'disabled': true
          }
        },
        children: {
          tag: 'label',
          attrs: {
            htmlFor: 'myid'
          },
          children: [
            {
              tag: 'input',
              attrs: {
                disabled: true,
                type: 'checkbox',
                name: 'myname',
                checked: false,
                id: 'myid'
              },
              events: {
                change: base.onChange
              }
            },
            ' ',
            'mylabel'
          ]
        }
      }
    });
  });

  tape.test('error', function (tape) {
    tape.plan(1);
    equal(tape, {error: 'myerror', hasError: true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true, 'has-error': true}
      },
      children: [
        {
          tag: 'div',
          attrs: {
            className: {
              'checkbox': true
            }
          },
          children: {
            tag: 'label',
            attrs: {
              htmlFor: 'myid'
            },
            children: [
              {
                tag: 'input',
                attrs: {
                  type: 'checkbox',
                  name: 'myname',
                  checked: false,
                  id: 'myid'
                },
                events: {
                  change: base.onChange
                }
              },
              ' ',
              'mylabel'
            ]
          }
        },
        {
          tag: 'span',
          attrs: {
            className: {
              'help-block': true,
              'error-block': true
            }
          },
          children: 'myerror'
        }
      ]
    });
  });

  tape.test('help', function (tape) {
    tape.plan(1);
    equal(tape, {help: 'myhelp'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: [
        {
          tag: 'div',
          attrs: {
            className: {
              'checkbox': true
            }
          },
          children: {
            tag: 'label',
            attrs: {
              htmlFor: 'myid'
            },
            children: [
              {
                tag: 'input',
                attrs: {
                  type: 'checkbox',
                  name: 'myname',
                  checked: false,
                  id: 'myid'
                },
                events: {
                  change: base.onChange
                }
              },
              ' ',
              'mylabel'
            ]
          }
        },
        {
          tag: 'span',
          attrs: {
            // aria support
            id: 'myid-tip',
            // aria support
            role: 'tooltip',
            className: {
              'help-block': true
            }
          },
          children: 'myhelp'
        }
      ]
    });
  });

  tape.test('value', function (tape) {
    tape.plan(1);
    equal(tape, {value: true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'div',
        attrs: {
          className: {
            'checkbox': true
          }
        },
        children: {
          tag: 'label',
          attrs: {
            htmlFor: 'myid'
          },
          children: [
            {
              tag: 'input',
              attrs: {
                type: 'checkbox',
                name: 'myname',
                checked: true,
                id: 'myid'
              },
              events: {
                change: base.onChange
              }
            },
            ' ',
            'mylabel'
          ]
        }
      }
    });
  });

  // FIXME test config

});


},{"../../lib/skin":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skin.js","../../lib/skins/bootstrap":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skins/bootstrap/index.js","./compact":"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/compact.js","deep-diff":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/deep-diff/index.js","tape":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/index.js","tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/compact.js":[function(require,module,exports){
'use strict';

var t = require('tcomb-validation');

// simplify deepEqual tests
function compact(x) {
  if (Array.isArray(x)) {
    var arr = x.filter(function (y) { return !t.Nil.is(y); }).map(compact);
    var len = arr.length;
    if (len === 0) { return null; }
    if (len === 1) { return arr[0]; }
    return arr;
  } else if (t.Obj.is(x)) {
    var ret = {};
    var y;
    for (var k in x) {
      if (x.hasOwnProperty(k)) {
        if (!t.Nil.is(x[k]) && k !== 'events') {
          y = compact(x[k]);
          if (!t.Nil.is(y)) {
            ret[k] = y;
          }
        }
      }
    }
    return ret;
  }
  return x;
}

module.exports = compact;

},{"tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/index.js":[function(require,module,exports){
require('./checkbox');
require('./textbox');
require('./select');
require('./radio');
require('./struct');
require('./list');

},{"./checkbox":"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/checkbox.js","./list":"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/list.js","./radio":"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/radio.js","./select":"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/select.js","./struct":"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/struct.js","./textbox":"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/textbox.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/list.js":[function(require,module,exports){
'use strict';

var test = require('tape');
var t = require('tcomb-validation');
var skin = require('../../lib/skin');
var bootstrap = require('../../lib/skins/bootstrap');
var diff = require('deep-diff').diff;
var compact = require('./compact');
var mixin = t.util.mixin;

test('bootstrap list()', function (tape) {

  var base = {
    items: []
  };

  var equal = function (tape, locals, expected, showDiff) {
    locals = mixin(mixin({}, base), locals, true);
    locals = new skin.List(locals);
    expected = compact(expected);
    var actual = compact(bootstrap.list(locals));
    if (showDiff) {
      console.dir(diff(actual, expected));
    }
    tape.deepEqual(actual, expected);
  };

  tape.test('base', function (tape) {
    tape.plan(1);
    equal(tape, {}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'fieldset',
        attrs: {}
      }
    });
  });

  tape.test('disabled', function (tape) {
    tape.plan(1);
    equal(tape, {disabled: true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'fieldset',
        attrs: {
          disabled: true
        }
      }
    });
  });

  tape.test('error', function (tape) {
    tape.plan(1);
    equal(tape, {error: 'myerror', 'hasError': true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'fieldset',
        attrs: {},
        children: {
          tag: 'div',
          attrs: {
            className: {
              'alert': true,
              'alert-danger': true
            }
          },
          children: 'myerror'
        }
      }
    });
  });

  tape.test('help', function (tape) {
    tape.plan(1);
    equal(tape, {help: 'myhelp'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'fieldset',
        attrs: {},
        children: {
          tag: 'div',
          attrs: {
            className: {
              'alert': true,
              'alert-info': true
            }
          },
          children: 'myhelp'
        }
      }
    });
  });

  tape.test('legend', function (tape) {
    tape.plan(1);
    equal(tape, {legend: 'mylegend'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'fieldset',
        attrs: {},
        children: {
          tag: 'legend',
          children: 'mylegend'
        }
      }
    });
  });

  tape.test('add', function (tape) {
    tape.plan(1);
    var click = function () {};
    equal(tape, {add: {click: click, label: 'myadd'}}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'fieldset',
        attrs: {},
        children: {
          tag: 'button',
          attrs: {
            className: {
              'btn': true,
              'btn-default': true
            }
          },
          events: {
            click: click
          },
          children: 'myadd'
        }
      }
    });
  });

  // FIXME test items (buttons)
  // FIXME test config

});


},{"../../lib/skin":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skin.js","../../lib/skins/bootstrap":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skins/bootstrap/index.js","./compact":"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/compact.js","deep-diff":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/deep-diff/index.js","tape":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/index.js","tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/radio.js":[function(require,module,exports){
'use strict';

var test = require('tape');
var t = require('tcomb-validation');
var skin = require('../../lib/skin');
var bootstrap = require('../../lib/skins/bootstrap');
var diff = require('deep-diff').diff;
var compact = require('./compact');
var mixin = t.util.mixin;

test('bootstrap radio()', function (tape) {

  var base = {
    id: 'myid',
    name: 'myname',
    onChange: function () {},
    options: [
      {value: 'M', text: 'Male'},
      {value: 'F', text: 'Female'}
    ]
  };

  var equal = function (tape, locals, expected, showDiff) {
    locals = mixin(mixin({}, base), locals, true);
    locals = new skin.Radio(locals);
    expected = compact(expected);
    var actual = compact(bootstrap.radio(locals));
    if (showDiff) {
      console.dir(diff(actual, expected));
    }
    tape.deepEqual(actual, expected);
  };

  tape.test('base', function (tape) {
    tape.plan(1);
    equal(tape, {}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: [
        {
          tag: 'div',
          attrs: {
            className: {
              'radio': true
            }
          },
          children: {
            tag: 'label',
            attrs: {
              htmlFor: 'myid-M'
            },
            children: [
              {
                tag: 'input',
                attrs: {
                  type: 'radio',
                  value: 'M',
                  name: 'myname',
                  checked: false,
                  id: 'myid-M'
                },
                events: {
                  change: base.onChange
                }
              },
              ' ',
              'Male'
            ]
          },
          key: 'M'
        },
        {
          tag: 'div',
          attrs: {
            className: {
              'radio': true
            }
          },
          children: {
            tag: 'label',
            attrs: {
              htmlFor: 'myid-F'
            },
            children: [
              {
                tag: 'input',
                attrs: {
                  type: 'radio',
                  value: 'F',
                  name: 'myname',
                  checked: false,
                  id: 'myid-F'
                },
                events: {
                  change: base.onChange
                }
              },
              ' ',
              'Female'
            ]
          },
          key: 'F'
        }
      ]
    });
  });

  tape.test('disabled', function (tape) {
    tape.plan(1);
    equal(tape, {disabled: true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: [
        {
          tag: 'div',
          attrs: {
            className: {
              'radio': true,
              'disabled': true
            }
          },
          children: {
            tag: 'label',
            attrs: {
              htmlFor: 'myid-M'
            },
            children: [
              {
                tag: 'input',
                attrs: {
                  disabled: true,
                  type: 'radio',
                  value: 'M',
                  name: 'myname',
                  checked: false,
                  id: 'myid-M'
                },
                events: {
                  change: base.onChange
                }
              },
              ' ',
              'Male'
            ]
          },
          key: 'M'
        },
        {
          tag: 'div',
          attrs: {
            className: {
              'radio': true,
              'disabled': true
            }
          },
          children: {
            tag: 'label',
            attrs: {
              htmlFor: 'myid-F'
            },
            children: [
              {
                tag: 'input',
                attrs: {
                  disabled: true,
                  type: 'radio',
                  value: 'F',
                  name: 'myname',
                  checked: false,
                  id: 'myid-F'
                },
                events: {
                  change: base.onChange
                }
              },
              ' ',
              'Female'
            ]
          },
          key: 'F'
        }
      ]
    });
  });

  tape.test('error', function (tape) {
    tape.plan(1);
    equal(tape, {error: 'myerror', hasError: true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true, 'has-error': true}
      },
      children: [
        [
          {
            tag: 'div',
            attrs: {
              className: {
                'radio': true
              }
            },
            children: {
              tag: 'label',
              attrs: {
                htmlFor: 'myid-M'
              },
              children: [
                {
                  tag: 'input',
                  attrs: {
                    type: 'radio',
                    value: 'M',
                    name: 'myname',
                    checked: false,
                    id: 'myid-M'
                  },
                  events: {
                    change: base.onChange
                  }
                },
                ' ',
                'Male'
              ]
            },
            key: 'M'
          },
          {
            tag: 'div',
            attrs: {
              className: {
                'radio': true
              }
            },
            children: {
              tag: 'label',
              attrs: {
                htmlFor: 'myid-F'
              },
              children: [
                {
                  tag: 'input',
                  attrs: {
                    type: 'radio',
                    value: 'F',
                    name: 'myname',
                    checked: false,
                    id: 'myid-F'
                  },
                  events: {
                    change: base.onChange
                  }
                },
                ' ',
                'Female'
              ]
            },
            key: 'F'
          }
        ],
        {
          tag: 'span',
          attrs: {
            className: {
              'help-block': true,
              'error-block': true
            }
          },
          children: 'myerror'
        }
      ]
    });
  });

  tape.test('help', function (tape) {
    tape.plan(1);
    equal(tape, {help: 'myhelp'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: [
        [
          {
            tag: 'div',
            attrs: {
              className: {
                'radio': true
              }
            },
            children: {
              tag: 'label',
              attrs: {
                htmlFor: 'myid-M'
              },
              children: [
                {
                  tag: 'input',
                  attrs: {
                    type: 'radio',
                    value: 'M',
                    name: 'myname',
                    checked: false,
                    id: 'myid-M'
                  },
                  events: {
                    change: base.onChange
                  }
                },
                ' ',
                'Male'
              ]
            },
            key: 'M'
          },
          {
            tag: 'div',
            attrs: {
              className: {
                'radio': true
              }
            },
            children: {
              tag: 'label',
              attrs: {
                htmlFor: 'myid-F'
              },
              children: [
                {
                  tag: 'input',
                  attrs: {
                    type: 'radio',
                    value: 'F',
                    name: 'myname',
                    checked: false,
                    id: 'myid-F'
                  },
                  events: {
                    change: base.onChange
                  }
                },
                ' ',
                'Female'
              ]
            },
            key: 'F'
          }
        ],
        {
          tag: 'span',
          attrs: {
            // aria support
            id: 'myid-tip',
            // aria support
            role: 'tooltip',
            className: {
              'help-block': true
            }
          },
          children: 'myhelp'
        }
      ]
    });
  });

  tape.test('label', function (tape) {
    tape.plan(1);
    equal(tape, {label: 'mylabel'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: [
        {
          tag: 'label',
          attrs: {
            id: 'myid',
            className: {
              'control-label': true
            }
          },
          children: 'mylabel'
        },
        [
          {
            tag: 'div',
            attrs: {
              className: {
                'radio': true
              }
            },
            children: {
              tag: 'label',
              attrs: {
                htmlFor: 'myid-M'
              },
              children: [
                {
                  tag: 'input',
                  attrs: {
                    type: 'radio',
                    value: 'M',
                    name: 'myname',
                    checked: false,
                    id: 'myid-M',
                    // aria support
                    'aria-describedby': 'myid'
                  },
                  events: {
                    change: base.onChange
                  }
                },
                ' ',
                'Male'
              ]
            },
            key: 'M'
          },
          {
            tag: 'div',
            attrs: {
              className: {
                'radio': true
              }
            },
            children: {
              tag: 'label',
              attrs: {
                htmlFor: 'myid-F'
              },
              children: [
                {
                  tag: 'input',
                  attrs: {
                    type: 'radio',
                    value: 'F',
                    name: 'myname',
                    checked: false,
                    id: 'myid-F',
                    // aria support
                    'aria-describedby': 'myid'
                  },
                  events: {
                    change: base.onChange
                  }
                },
                ' ',
                'Female'
              ]
            },
            key: 'F'
          }
        ]
      ]
    });
  });

  tape.test('value', function (tape) {
    tape.plan(1);
    equal(tape, {value: 'F'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: [
        {
          tag: 'div',
          attrs: {
            className: {
              'radio': true
            }
          },
          children: {
            tag: 'label',
            attrs: {
              htmlFor: 'myid-M'
            },
            children: [
              {
                tag: 'input',
                attrs: {
                  type: 'radio',
                  value: 'M',
                  name: 'myname',
                  checked: false,
                  id: 'myid-M'
                },
                events: {
                  change: base.onChange
                }
              },
              ' ',
              'Male'
            ]
          },
          key: 'M'
        },
        {
          tag: 'div',
          attrs: {
            className: {
              'radio': true
            }
          },
          children: {
            tag: 'label',
            attrs: {
              htmlFor: 'myid-F'
            },
            children: [
              {
                tag: 'input',
                attrs: {
                  type: 'radio',
                  value: 'F',
                  name: 'myname',
                  checked: true,
                  id: 'myid-F'
                },
                events: {
                  change: base.onChange
                }
              },
              ' ',
              'Female'
            ]
          },
          key: 'F'
        }
      ]
    });
  });

  // FIXME test config

});


},{"../../lib/skin":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skin.js","../../lib/skins/bootstrap":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skins/bootstrap/index.js","./compact":"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/compact.js","deep-diff":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/deep-diff/index.js","tape":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/index.js","tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/select.js":[function(require,module,exports){
'use strict';

var test = require('tape');
var t = require('tcomb-validation');
var skin = require('../../lib/skin');
var bootstrap = require('../../lib/skins/bootstrap');
var diff = require('deep-diff').diff;
var compact = require('./compact');
var mixin = t.util.mixin;

test('bootstrap select()', function (tape) {

  var base = {
    id: 'myid',
    name: 'myname',
    onChange: function () {},
    options: [
      {value: '', text: '-'},
      {value: 'M', text: 'Male'},
      {value: 'F', text: 'Female'}
    ]
  };

  var equal = function (tape, locals, expected, showDiff) {
    locals = mixin(mixin({}, base), locals, true);
    locals = new skin.Select(locals);
    expected = compact(expected);
    var actual = compact(bootstrap.select(locals));
    if (showDiff) {
      console.dir(diff(actual, expected));
    }
    tape.deepEqual(actual, expected);
  };

  tape.test('base', function (tape) {
    tape.plan(1);
    equal(tape, {}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'select',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname'
        },
        events: {
          change: base.onChange
        },
        children: [
          {
            tag: 'option',
            attrs: {
              value: ''
            },
            children: '-',
            key: ''
          },
          {
            tag: 'option',
            attrs: {
              value: 'M'
            },
            children: 'Male',
            key: 'M'
          },
          {
            tag: 'option',
            attrs: {
              value: 'F'
            },
            children: 'Female',
            key: 'F'
          }
        ]
      }
    });
  });

  tape.test('error', function (tape) {
    tape.plan(1);
    equal(tape, {error: 'myerror', hasError: true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true, 'has-error': true}
      },
      children: [
        {
          tag: 'select',
          attrs: {
            className: {
              'form-control': true
            },
            name: 'myname'
          },
          events: {
            change: base.onChange
          },
          children: [
            {
              tag: 'option',
              attrs: {
                value: ''
              },
              children: '-',
              key: ''
            },
            {
              tag: 'option',
              attrs: {
                value: 'M'
              },
              children: 'Male',
              key: 'M'
            },
            {
              tag: 'option',
              attrs: {
                value: 'F'
              },
              children: 'Female',
              key: 'F'
            }
          ]
        },
        {
          tag: 'span',
          attrs: {
            className: {
              'help-block': true,
              'error-block': true
            }
          },
          children: 'myerror'
        }
      ]
    });
  });

  tape.test('disabled', function (tape) {
    tape.plan(1);
    equal(tape, {disabled: true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'select',
        attrs: {
          disabled: true,
          className: {
            'form-control': true
          },
          name: 'myname'
        },
        events: {
          change: base.onChange
        },
        children: [
          {
            tag: 'option',
            attrs: {
              value: ''
            },
            children: '-',
            key: ''
          },
          {
            tag: 'option',
            attrs: {
              value: 'M'
            },
            children: 'Male',
            key: 'M'
          },
          {
            tag: 'option',
            attrs: {
              value: 'F'
            },
            children: 'Female',
            key: 'F'
          }
        ]
      }
    });
  });

  tape.test('help', function (tape) {
    tape.plan(1);
    equal(tape, {help: 'myhelp'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: [
        {
          tag: 'select',
          attrs: {
            className: {
              'form-control': true
            },
            name: 'myname',
            // aria support
            'aria-describedby': 'myid-tip'
          },
          events: {
            change: base.onChange
          },
          children: [
            {
              tag: 'option',
              attrs: {
                value: ''
              },
              children: '-',
              key: ''
            },
            {
              tag: 'option',
              attrs: {
                value: 'M'
              },
              children: 'Male',
              key: 'M'
            },
            {
              tag: 'option',
              attrs: {
                value: 'F'
              },
              children: 'Female',
              key: 'F'
            }
          ]
        },
        {
          tag: 'span',
          attrs: {
            // aria support
            id: 'myid-tip',
            // aria support
            role: 'tooltip',
            className: {
              'help-block': true
            }
          },
          children: 'myhelp'
        }
      ]
    });
  });

  tape.test('label', function (tape) {
    tape.plan(1);
    equal(tape, {label: 'mylabel'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: [
        {
          tag: 'label',
          attrs: {
            htmlFor: 'myid',
            className: {
              'control-label': true
            }
          },
          children: 'mylabel'
        },
        {
          tag: 'select',
          attrs: {
            className: {
              'form-control': true
            },
            name: 'myname',
            id: 'myid'
          },
          events: {
            change: base.onChange
          },
          children: [
            {
              tag: 'option',
              attrs: {
                value: ''
              },
              children: '-',
              key: ''
            },
            {
              tag: 'option',
              attrs: {
                value: 'M'
              },
              children: 'Male',
              key: 'M'
            },
            {
              tag: 'option',
              attrs: {
                value: 'F'
              },
              children: 'Female',
              key: 'F'
            }
          ]
        }
      ]
    });
  });

  tape.test('multiple', function (tape) {
    tape.plan(1);
    equal(tape, {multiple: true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'select',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname',
          multiple: true
        },
        events: {
          change: base.onChange
        },
        children: [
          {
            tag: 'option',
            attrs: {
              value: ''
            },
            children: '-',
            key: ''
          },
          {
            tag: 'option',
            attrs: {
              value: 'M'
            },
            children: 'Male',
            key: 'M'
          },
          {
            tag: 'option',
            attrs: {
              value: 'F'
            },
            children: 'Female',
            key: 'F'
          }
        ]
      }
    });
  });

  tape.test('options', function (tape) {
    tape.plan(1);
    equal(tape, {options: [{value: 'a', text: 'b'}]}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'select',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname'
        },
        events: {
          change: base.onChange
        },
        children: {
          tag: 'option',
          attrs: {
            value: 'a'
          },
          children: 'b',
          key: 'a'
        }
      }
    });
  });

  tape.test('options (disabled)', function (tape) {
    tape.plan(1);
    equal(tape, {options: [{value: 'a', text: 'b', disabled: true}]}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'select',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname'
        },
        events: {
          change: base.onChange
        },
        children: {
          tag: 'option',
          attrs: {
            value: 'a',
            disabled: true
          },
          children: 'b',
          key: 'a'
        }
      }
    });
  });

  tape.test('optgroup', function (tape) {
    tape.plan(1);
    equal(tape, {options: [
      {label: 'group1', options: [{value: 'a', text: 'b', disabled: true}], disabled: true}
    ]}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'select',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname'
        },
        events: {
          change: base.onChange
        },
        children: {
          tag: 'optgroup',
          attrs: {
            label: 'group1',
            disabled: true
          },
          children: {
            tag: 'option',
            attrs: {
              value: 'a',
              disabled: true
            },
            children: 'b',
            key: 'a'
          },
          key: 'group1'
        }
      }
    });
  });

  tape.test('value', function (tape) {
    tape.plan(1);
    equal(tape, {value: 'F'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'select',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname',
          value: 'F'
        },
        events: {
          change: base.onChange
        },
        children: [
          {
            tag: 'option',
            attrs: {
              value: ''
            },
            children: '-',
            key: ''
          },
          {
            tag: 'option',
            attrs: {
              value: 'M'
            },
            children: 'Male',
            key: 'M'
          },
          {
            tag: 'option',
            attrs: {
              value: 'F'
            },
            children: 'Female',
            key: 'F'
          }
        ]
      }
    });
  });

  // FIXME test config

});


},{"../../lib/skin":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skin.js","../../lib/skins/bootstrap":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skins/bootstrap/index.js","./compact":"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/compact.js","deep-diff":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/deep-diff/index.js","tape":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/index.js","tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/struct.js":[function(require,module,exports){
'use strict';

var test = require('tape');
var t = require('tcomb-validation');
var skin = require('../../lib/skin');
var bootstrap = require('../../lib/skins/bootstrap');
var diff = require('deep-diff').diff;
var compact = require('./compact');
var mixin = t.util.mixin;

test('bootstrap struct()', function (tape) {

  var base = {
    inputs: {},
    order: []
  };

  var equal = function (tape, locals, expected, showDiff) {
    locals = mixin(mixin({}, base), locals, true);
    locals = new skin.Struct(locals);
    expected = compact(expected);
    var actual = compact(bootstrap.struct(locals));
    if (showDiff) {
      console.dir(diff(actual, expected));
    }
    tape.deepEqual(actual, expected);
  };

  tape.test('base', function (tape) {
    tape.plan(1);
    equal(tape, {}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'fieldset',
        attrs: {}
      }
    });
  });

  tape.test('disabled', function (tape) {
    tape.plan(1);
    equal(tape, {disabled: true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'fieldset',
        attrs: {
          disabled: true
        }
      }
    });
  });

  tape.test('error', function (tape) {
    tape.plan(1);
    equal(tape, {error: 'myerror', 'hasError': true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'fieldset',
        attrs: {},
        children: {
          tag: 'div',
          attrs: {
            className: {
              'alert': true,
              'alert-danger': true
            }
          },
          children: 'myerror'
        }
      }
    });
  });

  tape.test('help', function (tape) {
    tape.plan(1);
    equal(tape, {help: 'myhelp'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'fieldset',
        attrs: {},
        children: {
          tag: 'div',
          attrs: {
            className: {
              'alert': true,
              'alert-info': true
            }
          },
          children: 'myhelp'
        }
      }
    });
  });

  tape.test('legend', function (tape) {
    tape.plan(1);
    equal(tape, {legend: 'mylegend'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'fieldset',
        attrs: {},
        children: {
          tag: 'legend',
          children: 'mylegend'
        }
      }
    });
  });

  // FIXME test order
  // FIXME test inputs
  // FIXME test config

});


},{"../../lib/skin":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skin.js","../../lib/skins/bootstrap":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skins/bootstrap/index.js","./compact":"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/compact.js","deep-diff":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/deep-diff/index.js","tape":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/index.js","tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/textbox.js":[function(require,module,exports){
'use strict';

var test = require('tape');
var t = require('tcomb-validation');
var skin = require('../../lib/skin');
var bootstrap = require('../../lib/skins/bootstrap');
var diff = require('deep-diff').diff;
var compact = require('./compact');
var mixin = t.util.mixin;

test('bootstrap textbox()', function (tape) {

  var base = {
    id: 'myid',
    name: 'myname',
    onChange: function () {},
    type: 'text'
  };

  var equal = function (tape, locals, expected, showDiff) {
    locals = mixin(mixin({}, base), locals, true);
    locals = new skin.Textbox(locals);
    expected = compact(expected);
    var actual = compact(bootstrap.textbox(locals));
    if (showDiff) {
      console.dir(diff(actual, expected));
    }
    tape.deepEqual(actual, expected);
  };

  tape.test('base', function (tape) {
    tape.plan(1);
    equal(tape, {}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'input',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname',
          type: 'text'
        },
        events: {
          change: base.onChange
        }
      }
    });
  });

  tape.test('disabled', function (tape) {
    tape.plan(1);
    equal(tape, {disabled: true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'input',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname',
          type: 'text',
          disabled: true
        },
        events: {
          change: base.onChange
        }
      }
    });
  });

  tape.test('error', function (tape) {
    tape.plan(1);
    equal(tape, {error: 'myerror', hasError: true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true, 'has-error': true}
      },
      children: [
        {
          tag: 'input',
          attrs: {
            className: {
              'form-control': true
            },
            name: 'myname',
            type: 'text'
          },
          events: {
            change: base.onChange
          }
        },
        {
          tag: 'span',
          attrs: {
            className: {
              'help-block': true,
              'error-block': true
            }
          },
          children: 'myerror'
        }
      ]
    });
  });

  tape.test('help', function (tape) {
    tape.plan(1);
    equal(tape, {help: 'myhelp'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: [
        {
          tag: 'input',
          attrs: {
            className: {
              'form-control': true
            },
            name: 'myname',
            type: 'text',
            // aria support
            'aria-describedby': 'myid-tip'
          },
          events: {
            change: base.onChange
          }
        },
        {
          tag: 'span',
          attrs: {
            // aria support
            id: 'myid-tip',
            // aria support
            role: 'tooltip',
            className: {
              'help-block': true
            }
          },
          children: 'myhelp'
        }
      ]
    });
  });

  tape.test('label', function (tape) {
    tape.plan(1);
    equal(tape, {label: 'mylabel'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: [
        {
          tag: 'label',
          attrs: {
            htmlFor: 'myid',
            className: {
              'control-label': true
            }
          },
          children: 'mylabel'
        },
        {
          tag: 'input',
          attrs: {
            id: 'myid',
            className: {
              'form-control': true
            },
            name: 'myname',
            type: 'text'
          },
          events: {
            change: base.onChange
          }
        }
      ]
    });
  });

  tape.test('placeholder', function (tape) {
    tape.plan(1);
    equal(tape, {placeholder: 'myplaceholder'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'input',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname',
          type: 'text',
          placeholder: 'myplaceholder'
        },
        events: {
          change: base.onChange
        }
      }
    });
  });

  tape.test('type', function (tape) {
    tape.plan(1);
    equal(tape, {type: 'password'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'input',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname',
          type: 'password'
        },
        events: {
          change: base.onChange
        }
      }
    });
  });

  tape.test('value', function (tape) {
    tape.plan(1);
    equal(tape, {value: 'myvalue'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'input',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname',
          type: 'text',
          value: 'myvalue'
        },
        events: {
          change: base.onChange
        }
      }
    });
  });

  // FIXME test config

});


},{"../../lib/skin":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skin.js","../../lib/skins/bootstrap":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skins/bootstrap/index.js","./compact":"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/compact.js","deep-diff":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/deep-diff/index.js","tape":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/index.js","tcomb-validation":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tcomb-validation/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/Checkbox.js":[function(require,module,exports){
'use strict';

var test = require('tape');
var React = require('react');
var t = require('../../.');
var Checkbox = require('../../lib/components/Checkbox');
var bootstrap = require('../../lib/skins/bootstrap');
var util = require('./util');
var vdom = require('react-vdom');

var getLocals = util.getLocalsFactory(Checkbox);
var getValue = util.getValueFactory(Checkbox, bootstrap.checkbox);

test('Checkbox', function (tape) {

  tape.test('disabled', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: t.Bool}, {label: 'mylabel'}).disabled,
      null,
      'default disabled should be null');

    tape.strictEqual(
      getLocals({type: t.Bool}, {label: 'mylabel', disabled: true}).disabled,
      true,
      'should handle disabled = true');

    tape.strictEqual(
      getLocals({type: t.Bool}, {label: 'mylabel', disabled: false}).disabled,
      false,
      'should handle disabled = false');
  });

  tape.test('label', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.Bool}, {label: 'mylabel'}).label,
      'mylabel',
      'should handle label as strings');

    tape.deepEqual(
      vdom(getLocals({type: t.Bool}, {label: React.DOM.i(null, 'JSX label')}).label),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle label as JSX');
  });

  tape.test('help', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.Bool}, {help: 'mylabel'}).help,
      'mylabel',
      'should handle help as strings');

    tape.deepEqual(
      vdom(getLocals({type: t.Bool}, {help: React.DOM.i(null, 'JSX label')}).help),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle help as JSX');
  });

  tape.test('name', function (tape) {
    tape.plan(2);

    tape.ok(
      t.Str.is(getLocals({type: t.Bool}).name),
      'should have a default name');

    tape.strictEqual(
      getLocals({type: t.Bool}, {name: 'myname'}).name,
      'myname',
      'should handle name as strings');

  });

  tape.test('value', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.Bool}).value,
      false,
      'default value should be false');

    tape.strictEqual(
      getLocals({type: t.Bool}, null, true).value,
      true,
      'should handle value prop');

  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.Bool}).hasError,
      false,
      'default hasError should be false');

    tape.strictEqual(
      getLocals({type: t.Bool}, {hasError: true}).hasError,
      true,
      'should handle hasError option');
  });

  tape.test('error', function (tape) {
    tape.plan(4);

    tape.strictEqual(
      getLocals({type: t.Bool}).error,
      null,
      'default error should be null');

    tape.strictEqual(
      getLocals({type: t.Bool}, {error: 'myerror'}).error,
      'myerror',
      'should handle error option as string');

    tape.deepEqual(
      vdom(getLocals({type: t.Bool}, {error: React.DOM.i(null, 'JSX label')}).error),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle error option as JSX');

    tape.strictEqual(
      getLocals({type: t.Bool}, {error: function (value) {
        return 'error: ' + value;
      }}, true).error,
      'error: true',
      'should handle error option as a function');
  });

  tape.test('template', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: t.Bool}).template,
      bootstrap.checkbox,
      'default template should be bootstrap.checkbox');

    var template = function () {};

    tape.strictEqual(
      getLocals({type: t.Bool}, {template: template}).template,
      template,
      'should handle template option');

    tape.strictEqual(
      getLocals({type: t.Bool, templates: {checkbox: template}}).template,
      template,
      'should handle context templates');

  });

  tape.test('id', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: t.Bool}).id.substr(8, 1),
      '-',
      'default id should be a uuid');

    tape.strictEqual(
      getLocals({type: t.Bool}, {id: 'myid'}).id,
      'myid',
      'should handle id option');

    tape.strictEqual(
      getLocals({type: t.Bool}, {id: 'myid'}).name,
      'myid',
      'should use id as default name');

  });

  tape.test('autoFocus', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.Bool}).autoFocus,
      null,
      'default autoFocus should be null');

    tape.strictEqual(
      getLocals({type: t.Bool}, {autoFocus: true}).autoFocus,
      true,
      'should handle autoFocus option');

  });

  if (typeof window !== 'undefined') {

    tape.test('getValue', function (tape) {
        tape.plan(8);

        getValue(function (result) {
          tape.strictEqual(result.isValid(), true);
          tape.strictEqual(result.value, false);
        }, function (locals) {
          tape.strictEqual(locals.hasError, false);
          tape.strictEqual(locals.value, false);
        }, {type: t.Bool}, {label: 'mylabel'});

        getValue(function (result) {
          tape.strictEqual(result.isValid(), false);
          tape.strictEqual(result.value, false);
        }, function (locals, rendered) {
          if (rendered) {
            tape.strictEqual(locals.hasError, true);
            tape.strictEqual(locals.value, false);
          }
        }, {type: t.subtype(t.Bool, function (x) { return x === true; })}, {label: 'mylabel'});

    });

  }

});




},{"../../.":"/Users/giulio/Documents/Projects/github/tcomb-form/index.js","../../lib/components/Checkbox":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Checkbox.js","../../lib/skins/bootstrap":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skins/bootstrap/index.js","./util":"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/util.js","react":"react","react-vdom":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/react-vdom/index.js","tape":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/List.js":[function(require,module,exports){
'use strict';

var test = require('tape');
var React = require('react');
var t = require('../../.');
var List = require('../../lib/components/List');
var bootstrap = require('../../lib/skins/bootstrap');
var util = require('./util');
var vdom = require('react-vdom');

var getLocals = util.getLocalsFactory(List);
var getValue = util.getValueFactory(List, bootstrap.list);

test('List', function (tape) {

  tape.test('disabled', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}).disabled,
      null,
      'default disabled should be null');

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}, {disabled: true}).disabled,
      true,
      'should handle disabled = true');

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}, {disabled: false}).disabled,
      false,
      'should handle disabled = false');
  });

  tape.test('legend', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}, {legend: 'mylegend'}).legend,
      'mylegend',
      'should handle legend as strings');

    tape.deepEqual(
      vdom(getLocals({type: t.list(t.Str)}, {legend: React.DOM.i(null, 'JSX legend')}).legend),
      {tag: 'i', attrs: {}, children: 'JSX legend'},
      'should handle legend as JSX');
  });

  tape.test('help', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}, {help: 'mylabel'}).help,
      'mylabel',
      'should handle help as strings');

    tape.deepEqual(
      vdom(getLocals({type: t.list(t.Str)}, {help: React.DOM.i(null, 'JSX label')}).help),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle help as JSX');
  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}).hasError,
      false,
      'default hasError should be false');

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}, {hasError: true}).hasError,
      true,
      'should handle hasError option');
  });

  tape.test('error', function (tape) {
    tape.plan(4);

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}).error,
      null,
      'default error should be null');

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}, {error: 'myerror'}).error,
      'myerror',
      'should handle error option as string');

    tape.deepEqual(
      vdom(getLocals({type: t.list(t.Str)}, {error: React.DOM.i(null, 'JSX label')}).error),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle error option as JSX');

    tape.strictEqual(
      getLocals({type: t.list(t.Str)}, {error: function (value) {
        return 'error: ' + JSON.stringify(value);
      }}, []).error,
      'error: []',
      'should handle error option as a function');
  });

  tape.test('value', function (tape) {
    tape.plan(2);

    tape.deepEqual(
      getLocals({type: t.list(t.Str)}).value,
      [],
      'default value should be []');

    tape.deepEqual(
      getLocals({type: t.list(t.Str)}, null, ['a']).value,
      ['a'],
      'should handle value prop');

  });

  if (typeof window !== 'undefined') {

    tape.test('getValue', function (tape) {
        tape.plan(2);

        getValue(function (result) {
          tape.strictEqual(result.isValid(), true);
          tape.deepEqual(result.value, ['a', 'b']);
        }, function () {
        }, {type: t.list(t.Str)}, null, ['a', 'b']);

    });

  }

});




},{"../../.":"/Users/giulio/Documents/Projects/github/tcomb-form/index.js","../../lib/components/List":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/List.js","../../lib/skins/bootstrap":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skins/bootstrap/index.js","./util":"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/util.js","react":"react","react-vdom":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/react-vdom/index.js","tape":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/Radio.js":[function(require,module,exports){
'use strict';

var test = require('tape');
var React = require('react');
var t = require('../../.');
var Radio = require('../../lib/components/Radio');
var bootstrap = require('../../lib/skins/bootstrap');
var util = require('./util');
var vdom = require('react-vdom');

var getLocals = util.getLocalsFactory(Radio);
var getValue = util.getValueFactory(Radio, bootstrap.radio);

var Country = t.enums({
  IT: 'Italy',
  US: 'United States',
  FR: 'France'
}, 'Country');

test('Radio', function (tape) {

  tape.test('disabled', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: Country}).disabled,
      null,
      'default disabled should be null');

    tape.strictEqual(
      getLocals({type: Country}, {disabled: true}).disabled,
      true,
      'should handle disabled = true');

    tape.strictEqual(
      getLocals({type: Country}, {disabled: false}).disabled,
      false,
      'should handle disabled = false');
  });

  tape.test('label', function (tape) {
    tape.plan(5);

    tape.strictEqual(
      getLocals({type: Country}).label,
      null,
      'should default to null');

    tape.strictEqual(
      getLocals({type: Country, label: 'defaultLabel', auto: 'labels'}).label,
      'defaultLabel',
      'should have a default label if ctx.auto === `labels`');

    tape.strictEqual(
      getLocals({type: t.maybe(Country), label: 'defaultLabel', auto: 'labels'}).label,
      'defaultLabel (optional)',
      'should handle optional types if ctx.auto === `labels`');

    tape.strictEqual(
      getLocals({type: Country}, {label: 'mylabel'}).label,
      'mylabel',
      'should handle label as strings');

    tape.deepEqual(
      vdom(getLocals({type: Country}, {label: React.DOM.i(null, 'JSX label')}).label),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle label as JSX');

  });

  tape.test('help', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: Country}, {help: 'mylabel'}).help,
      'mylabel',
      'should handle help as strings');

    tape.deepEqual(
      vdom(getLocals({type: Country}, {help: React.DOM.i(null, 'JSX label')}).help),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle help as JSX');
  });

  tape.test('name', function (tape) {
    tape.plan(2);

    tape.ok(
      t.Str.is(getLocals({type: Country}).name),
      'should have a default name');

    tape.strictEqual(
      getLocals({type: Country}, {name: 'myname'}).name,
      'myname',
      'should handle name as strings');

  });

  tape.test('value', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: Country}).value,
      null,
      'default value should be null');

    tape.strictEqual(
      getLocals({type: Country}, {}, 'IT').value,
      'IT',
      'should handle value prop');

  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: Country}).hasError,
      false,
      'default hasError should be false');

    tape.strictEqual(
      getLocals({type: Country}, {hasError: true}).hasError,
      true,
      'should handle hasError option');
  });

  tape.test('error', function (tape) {
    tape.plan(4);

    tape.strictEqual(
      getLocals({type: Country}).error,
      null,
      'default error should be null');

    tape.strictEqual(
      getLocals({type: Country}, {error: 'myerror'}).error,
      'myerror',
      'should handle error option as string');

    tape.deepEqual(
      vdom(getLocals({type: Country}, {error: React.DOM.i(null, 'JSX label')}).error),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle error option as JSX');

    tape.strictEqual(
      getLocals({type: Country}, {error: function (value) {
        return 'error: ' + value;
      }}, 'IT').error,
      'error: IT',
      'should handle error option as a function');
  });

  tape.test('template', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: Country}).template,
      bootstrap.radio,
      'default template should be bootstrap.radio');

    var template = function () {};

    tape.strictEqual(
      getLocals({type: Country}, {template: template}).template,
      template,
      'should handle template option');

    tape.strictEqual(
      getLocals({type: Country, templates: {radio: template}}).template,
      template,
      'should handle context templates');

  });

  tape.test('id', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: Country}).id.substr(8, 1),
      '-',
      'default id should be a uuid');

    tape.strictEqual(
      getLocals({type: Country}, {id: 'myid'}).id,
      'myid',
      'should handle id option');

    tape.strictEqual(
      getLocals({type: Country}, {id: 'myid'}).name,
      'myid',
      'should use id as default name');

  });

  tape.test('autoFocus', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: Country}).autoFocus,
      null,
      'default autoFocus should be null');

    tape.strictEqual(
      getLocals({type: Country}, {autoFocus: true}).autoFocus,
      true,
      'should handle autoFocus option');

  });

  tape.test('options', function (tape) {
    tape.plan(2);

    tape.deepEqual(
      getLocals({type: Country}).options,
      [
        {value: 'IT', text: 'Italy'},
        {value: 'US', text: 'United States'},
        {value: 'FR', text: 'France'}
      ],
      'should retrieve options from the enum');

    tape.deepEqual(
      getLocals({type: Country}, {options: [
        {value: 'IT', text: 'Italia'},
        {value: 'US', text: 'Stati Uniti'}
      ]}).options,
      [
        {value: 'IT', text: 'Italia', disabled: null},
        {value: 'US', text: 'Stati Uniti', disabled: null}
      ],
      'should handle `option` option');

  });

  tape.test('order', function (tape) {
    tape.plan(2);

    tape.deepEqual(
      getLocals({type: Country}, {order: 'asc'}).options,
      [
        {value: 'FR', text: 'France'},
        {value: 'IT', text: 'Italy'},
        {value: 'US', text: 'United States'}
      ],
      'should handle asc order option');

    tape.deepEqual(
      getLocals({type: Country}, {order: 'desc'}).options,
      [
        {value: 'US', text: 'United States'},
        {value: 'IT', text: 'Italy'},
        {value: 'FR', text: 'France'}
      ],
      'should handle desc order option');

  });

  if (typeof window !== 'undefined') {

    tape.test('getValue', function (tape) {
        tape.plan(12);

        getValue(function (result) {
          tape.strictEqual(result.isValid(), true);
          tape.strictEqual(result.value, 'IT');
        }, function (locals) {
            tape.strictEqual(locals.hasError, false);
            tape.strictEqual(locals.value, 'IT');
        }, {type: Country}, null, 'IT');

        getValue(function (result) {
          tape.strictEqual(result.isValid(), false);
          tape.strictEqual(result.value, null);
        }, function (locals, rendered) {
          if (rendered) {
            tape.strictEqual(locals.hasError, true);
            tape.strictEqual(locals.value, null);
          }
        }, {type: Country});

        getValue(function (result) {
          tape.strictEqual(result.isValid(), true);
          tape.strictEqual(result.value, null);
        }, function (locals) {
            tape.strictEqual(locals.hasError, false);
            tape.strictEqual(locals.value, null);
        }, {type: t.maybe(Country)});

    });

  }

});




},{"../../.":"/Users/giulio/Documents/Projects/github/tcomb-form/index.js","../../lib/components/Radio":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Radio.js","../../lib/skins/bootstrap":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skins/bootstrap/index.js","./util":"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/util.js","react":"react","react-vdom":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/react-vdom/index.js","tape":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/Select.js":[function(require,module,exports){
'use strict';

var test = require('tape');
var React = require('react');
var t = require('../../.');
var Select = require('../../lib/components/Select');
var bootstrap = require('../../lib/skins/bootstrap');
var util = require('./util');
var vdom = require('react-vdom');

var getLocals = util.getLocalsFactory(Select);
var getValue = util.getValueFactory(Select, bootstrap.select);

var Country = t.enums({
  IT: 'Italy',
  US: 'United States',
  FR: 'France'
}, 'Country');

test('Select', function (tape) {

  tape.test('disabled', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: Country}).disabled,
      null,
      'default disabled should be null');

    tape.strictEqual(
      getLocals({type: Country}, {disabled: true}).disabled,
      true,
      'should handle disabled = true');

    tape.strictEqual(
      getLocals({type: Country}, {disabled: false}).disabled,
      false,
      'should handle disabled = false');
  });

  tape.test('label', function (tape) {
    tape.plan(5);

    tape.strictEqual(
      getLocals({type: Country}).label,
      null,
      'should default to null');

    tape.strictEqual(
      getLocals({type: Country, label: 'defaultLabel', auto: 'labels'}).label,
      'defaultLabel',
      'should have a default label if ctx.auto === `labels`');

    tape.strictEqual(
      getLocals({type: t.maybe(Country), label: 'defaultLabel', auto: 'labels'}).label,
      'defaultLabel (optional)',
      'should handle optional types if ctx.auto === `labels`');

    tape.strictEqual(
      getLocals({type: Country}, {label: 'mylabel'}).label,
      'mylabel',
      'should handle label as strings');

    tape.deepEqual(
      vdom(getLocals({type: Country}, {label: React.DOM.i(null, 'JSX label')}).label),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle label as JSX');

  });

  tape.test('help', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: Country}, {help: 'mylabel'}).help,
      'mylabel',
      'should handle help as strings');

    tape.deepEqual(
      vdom(getLocals({type: Country}, {help: React.DOM.i(null, 'JSX label')}).help),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle help as JSX');
  });

  tape.test('name', function (tape) {
    tape.plan(2);

    tape.ok(
      t.Str.is(getLocals({type: Country}).name),
      'should have a default name');

    tape.strictEqual(
      getLocals({type: Country}, {name: 'myname'}).name,
      'myname',
      'should handle name as strings');

  });

  tape.test('value', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: Country}).value,
      null,
      'default value should be null');

    tape.strictEqual(
      getLocals({type: Country}, {}, 'IT').value,
      'IT',
      'should handle value prop');

    tape.deepEqual(
      getLocals({type: t.list(Country)}, {}, ['IT', 'US']).value,
      ['IT', 'US'],
      'should handle multiple selectes');

  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: Country}).hasError,
      false,
      'default hasError should be false');

    tape.strictEqual(
      getLocals({type: Country}, {hasError: true}).hasError,
      true,
      'should handle hasError option');
  });

  tape.test('error', function (tape) {
    tape.plan(4);

    tape.strictEqual(
      getLocals({type: Country}).error,
      null,
      'default error should be null');

    tape.strictEqual(
      getLocals({type: Country}, {error: 'myerror'}).error,
      'myerror',
      'should handle error option as string');

    tape.deepEqual(
      vdom(getLocals({type: Country}, {error: React.DOM.i(null, 'JSX label')}).error),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle error option as JSX');

    tape.strictEqual(
      getLocals({type: Country}, {error: function (value) {
        return 'error: ' + value;
      }}, 'IT').error,
      'error: IT',
      'should handle error option as a function');
  });

  tape.test('template', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: Country}).template,
      bootstrap.select,
      'default template should be bootstrap.select');

    var template = function () {};

    tape.strictEqual(
      getLocals({type: Country}, {template: template}).template,
      template,
      'should handle template option');

    tape.strictEqual(
      getLocals({type: Country, templates: {select: template}}).template,
      template,
      'should handle context templates');

  });

  tape.test('id', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: Country}).id.substr(8, 1),
      '-',
      'default id should be a uuid');

    tape.strictEqual(
      getLocals({type: Country}, {id: 'myid'}).id,
      'myid',
      'should handle id option');

    tape.strictEqual(
      getLocals({type: Country}, {id: 'myid'}).name,
      'myid',
      'should use id as default name');

  });

  tape.test('autoFocus', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: Country}).autoFocus,
      null,
      'default autoFocus should be null');

    tape.strictEqual(
      getLocals({type: Country}, {autoFocus: true}).autoFocus,
      true,
      'should handle autoFocus option');

  });

  tape.test('options', function (tape) {
    tape.plan(2);

    tape.deepEqual(
      getLocals({type: Country}).options,
      [
        {value: '', text: '-'},
        {value: 'IT', text: 'Italy'},
        {value: 'US', text: 'United States'},
        {value: 'FR', text: 'France'}
      ],
      'should retrieve options from the enum');

    tape.deepEqual(
      getLocals({type: Country}, {options: [
        {value: 'IT', text: 'Italia'},
        {value: 'US', text: 'Stati Uniti'}
      ]}).options,
      [
        {value: '', text: '-'},
        {value: 'IT', text: 'Italia', disabled: null},
        {value: 'US', text: 'Stati Uniti', disabled: null}
      ],
      'should handle `option` option');

  });

  tape.test('order', function (tape) {
    tape.plan(2);

    tape.deepEqual(
      getLocals({type: Country}, {order: 'asc'}).options,
      [
        {value: '', text: '-'},
        {value: 'FR', text: 'France'},
        {value: 'IT', text: 'Italy'},
        {value: 'US', text: 'United States'}
      ],
      'should handle asc order option');

    tape.deepEqual(
      getLocals({type: Country}, {order: 'desc'}).options,
      [
        {value: '', text: '-'},
        {value: 'US', text: 'United States'},
        {value: 'IT', text: 'Italy'},
        {value: 'FR', text: 'France'}
      ],
      'should handle desc order option');

  });

  tape.test('nullOption', function (tape) {
    tape.plan(1);

    tape.deepEqual(
      getLocals({type: Country}, {nullOption: {value: '-1', text: 'my text'}}).options,
      [
        {value: '-1', text: 'my text', disabled: null},
        {value: 'IT', text: 'Italy'},
        {value: 'US', text: 'United States'},
        {value: 'FR', text: 'France'}
      ],
      'should add the nullOption in first position');

  });

  tape.test('multiple', function (tape) {
    tape.plan(1);

    tape.strictEqual(
      getLocals({type: t.list(Country)}).multiple,
      true,
      'should be multiple if type is a list of enums');

  });

  if (typeof window !== 'undefined') {

    tape.test('getValue', function (tape) {
        tape.plan(16);

        getValue(function (result) {
          tape.strictEqual(result.isValid(), true);
          tape.strictEqual(result.value, 'IT');
        }, function (locals) {
            tape.strictEqual(locals.hasError, false);
            tape.strictEqual(locals.value, 'IT');
        }, {type: Country}, null, 'IT');

        getValue(function (result) {
          tape.strictEqual(result.isValid(), false);
          tape.strictEqual(result.value, null);
        }, function (locals, rendered) {
          if (rendered) {
            tape.strictEqual(locals.hasError, true);
            tape.strictEqual(locals.value, null);
          }
        }, {type: Country});

        getValue(function (result) {
          tape.strictEqual(result.isValid(), true);
          tape.strictEqual(result.value, null);
        }, function (locals) {
            tape.strictEqual(locals.hasError, false);
            tape.strictEqual(locals.value, null);
        }, {type: t.maybe(Country)});

        getValue(function (result) {
          tape.strictEqual(result.isValid(), true);
          tape.deepEqual(result.value, ['IT', 'US']);
        }, function (locals) {
          tape.strictEqual(locals.hasError, false);
          tape.deepEqual(locals.value, ['IT', 'US']);
        }, {type: t.list(Country)}, null, ['IT', 'US']);

    });

  }

});




},{"../../.":"/Users/giulio/Documents/Projects/github/tcomb-form/index.js","../../lib/components/Select":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Select.js","../../lib/skins/bootstrap":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skins/bootstrap/index.js","./util":"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/util.js","react":"react","react-vdom":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/react-vdom/index.js","tape":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/Struct.js":[function(require,module,exports){
'use strict';

var test = require('tape');
var React = require('react');
var t = require('../../.');
var Struct = require('../../lib/components/Struct');
var bootstrap = require('../../lib/skins/bootstrap');
var util = require('./util');
var vdom = require('react-vdom');

var getLocals = util.getLocalsFactory(Struct);
var getValue = util.getValueFactory(Struct, bootstrap.struct);

var Country = t.enums({
  IT: 'Italy',
  US: 'United States'
}, 'Country');

var Gender = t.enums({
  M: 'Male',
  F: 'Female'
}, 'Gender');

var Person = t.struct({
  name: t.Str,
  rememberMe: t.Bool,
  country: Country,
  gender: Gender
});

test('Struct', function (tape) {

  tape.test('disabled', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: Person}).disabled,
      null,
      'default disabled should be null');

    tape.strictEqual(
      getLocals({type: Person}, {disabled: true}).disabled,
      true,
      'should handle disabled = true');

    tape.strictEqual(
      getLocals({type: Person}, {disabled: false}).disabled,
      false,
      'should handle disabled = false');
  });

  tape.test('order', function (tape) {
    tape.plan(2);

    tape.deepEqual(
      getLocals({type: Person}).order,
      ['name', 'rememberMe', 'country', 'gender'],
      'shound use Object.keys as a default');

    tape.deepEqual(
      getLocals({type: Person}, {order: ['name']}).order,
      ['name'],
      'should handle order options');

  });

  tape.test('legend', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: Person}, {legend: 'mylegend'}).legend,
      'mylegend',
      'should handle legend as strings');

    tape.deepEqual(
      vdom(getLocals({type: Person}, {legend: React.DOM.i(null, 'JSX legend')}).legend),
      {tag: 'i', attrs: {}, children: 'JSX legend'},
      'should handle legend as JSX');
  });

  tape.test('help', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: Person}, {help: 'mylabel'}).help,
      'mylabel',
      'should handle help as strings');

    tape.deepEqual(
      vdom(getLocals({type: Person}, {help: React.DOM.i(null, 'JSX label')}).help),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle help as JSX');
  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: Person}).hasError,
      false,
      'default hasError should be false');

    tape.strictEqual(
      getLocals({type: Person}, {hasError: true}).hasError,
      true,
      'should handle hasError option');
  });

  tape.test('error', function (tape) {
    tape.plan(4);

    tape.strictEqual(
      getLocals({type: Person}).error,
      null,
      'default error should be null');

    tape.strictEqual(
      getLocals({type: Person}, {error: 'myerror'}).error,
      'myerror',
      'should handle error option as string');

    tape.deepEqual(
      vdom(getLocals({type: Person}, {error: React.DOM.i(null, 'JSX label')}).error),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle error option as JSX');

    tape.strictEqual(
      getLocals({type: Person}, {error: function (value) {
        return 'error: ' + JSON.stringify(value);
      }}, {}).error,
      'error: {}',
      'should handle error option as a function');
  });

  tape.test('value', function (tape) {
    tape.plan(2);

    tape.deepEqual(
      getLocals({type: Person}).value,
      {},
      'default value should be {}');

    tape.deepEqual(
      getLocals({type: Person}, null, {name: 'Giulio'}).value,
      {name: 'Giulio'},
      'should handle value prop');

  });

  if (typeof window !== 'undefined') {

    tape.test('getValue', function (tape) {
        tape.plan(2);

        getValue(function (result) {
          tape.strictEqual(result.isValid(), true);
          tape.deepEqual(result.value, {
            name: 'Giulio',
            rememberMe: true,
            country: 'IT',
            gender: 'M'
          });
        }, function () {
        }, {type: Person}, null, {
          name: 'Giulio',
          rememberMe: true,
          country: 'IT',
          gender: 'M'
        });

    });

  }

});




},{"../../.":"/Users/giulio/Documents/Projects/github/tcomb-form/index.js","../../lib/components/Struct":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Struct.js","../../lib/skins/bootstrap":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skins/bootstrap/index.js","./util":"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/util.js","react":"react","react-vdom":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/react-vdom/index.js","tape":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/Textbox.js":[function(require,module,exports){
'use strict';

var test = require('tape');
var React = require('react');
var t = require('../../.');
var Textbox = require('../../lib/components/Textbox');
var bootstrap = require('../../lib/skins/bootstrap');
var util = require('./util');
var vdom = require('react-vdom');

var getLocals = util.getLocalsFactory(Textbox);
var getValue = util.getValueFactory(Textbox, bootstrap.textbox);

var transformer = {
  format: function (value) {
    return value.join(',');
  },
  parse: function (value) {
    return value.split(',');
  }
};

test('Textbox', function (tape) {

  tape.test('type', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.Str}).type,
      'text',
      'default type should be "text"');

    tape.strictEqual(
      getLocals({type: t.Str}, {type: 'color'}).type,
      'color',
      'should handle text option');

  });

  tape.test('label', function (tape) {
    tape.plan(5);

    tape.strictEqual(
      getLocals({type: t.Str}).label,
      null,
      'should default to null');

    tape.strictEqual(
      getLocals({type: t.Str, label: 'defaultLabel', auto: 'labels'}).label,
      'defaultLabel',
      'should have a default label if ctx.auto === `labels`');

    tape.strictEqual(
      getLocals({type: t.maybe(t.Str), label: 'defaultLabel', auto: 'labels'}).label,
      'defaultLabel (optional)',
      'should handle optional types if ctx.auto === `labels`');

    tape.strictEqual(
      getLocals({type: t.Str}, {label: 'mylabel'}).label,
      'mylabel',
      'should handle label as strings');

    tape.deepEqual(
      vdom(getLocals({type: t.Str}, {label: React.DOM.i(null, 'JSX label')}).label),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle label as JSX');

  });

  tape.test('placeholder', function (tape) {
    tape.plan(9);

    tape.strictEqual(
      getLocals({type: t.Str}).placeholder,
      null,
      'default placeholder should be null');

    tape.strictEqual(
      getLocals({type: t.Str}, {placeholder: 'myplaceholder'}).placeholder,
      'myplaceholder',
      'should handle placeholder option');

    tape.strictEqual(
      getLocals({type: t.Str}, {label: 'mylabel', placeholder: 'myplaceholder'}).placeholder,
      'myplaceholder',
      'should handle placeholder option even if a label is specified');

    tape.strictEqual(
      getLocals({type: t.Str, auto: 'placeholders'}, {label: 'mylabel'}).placeholder,
      null,
      'should be null if a label is specified');

    tape.strictEqual(
      getLocals({type: t.Str, auto: 'labels'}, {placeholder: 'myplaceholder'}).placeholder,
      'myplaceholder',
      'should handle placeholder option even if auto !== placeholders');

    tape.strictEqual(
      getLocals({type: t.Str, auto: 'none'}, {placeholder: 'myplaceholder'}).placeholder,
      'myplaceholder',
      'should handle placeholder option even if auto === none');

    tape.strictEqual(
      getLocals({type: t.Str, auto: 'placeholders', label: 'mylabel'}).placeholder,
      'mylabel',
      'should default to context default label if auto === placeholders');

    tape.strictEqual(
      getLocals({type: t.Str, auto: 'labels'}).placeholder,
      null,
      'should be null if auto !== placeholders');

    tape.strictEqual(
      getLocals({type: t.maybe(t.Str), label: 'defaultLabel', auto: 'placeholders'}).placeholder,
      'defaultLabel (optional)',
      'the fallback label should handle an optional type');

  });

  tape.test('disabled', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: t.Str}).disabled,
      null,
      'default disabled should be null');

    tape.strictEqual(
      getLocals({type: t.Str}, {disabled: true}).disabled,
      true,
      'should handle disabled = true');

    tape.strictEqual(
      getLocals({type: t.Str}, {disabled: false}).disabled,
      false,
      'should handle disabled = false');
  });

  tape.test('help', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.Str}, {help: 'mylabel'}).help,
      'mylabel',
      'should handle help as strings');

    tape.deepEqual(
      vdom(getLocals({type: t.Str}, {help: React.DOM.i(null, 'JSX label')}).help),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle help as JSX');
  });

  tape.test('name', function (tape) {
    tape.plan(2);

    tape.ok(
      t.Str.is(getLocals({type: t.Str}).name),
      'should have a default name');

    tape.strictEqual(
      getLocals({type: t.Str}, {name: 'myname'}).name,
      'myname',
      'should handle name as strings');

  });

  tape.test('transformer', function (tape) {
    tape.plan(1);

    tape.strictEqual(
      getLocals({type: t.Arr}, {transformer: transformer}, ['a', 'b']).value,
      'a,b',
      'should handle transformer option');

  });

  tape.test('value', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: t.Str}).value,
      null,
      'default value should be null');

    tape.strictEqual(
      getLocals({type: t.Str}, {}, 'a').value,
      'a',
      'should handle value prop');

    tape.strictEqual(
      getLocals({type: t.Num}, {}, 1).value,
      '1',
      'should handle numeric values');

  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.Str}).hasError,
      false,
      'default hasError should be false');

    tape.strictEqual(
      getLocals({type: t.Str}, {hasError: true}).hasError,
      true,
      'should handle hasError option');
  });

  tape.test('error', function (tape) {
    tape.plan(4);

    tape.strictEqual(
      getLocals({type: t.Str}).error,
      null,
      'default error should be null');

    tape.strictEqual(
      getLocals({type: t.Str}, {error: 'myerror'}).error,
      'myerror',
      'should handle error option as string');

    tape.deepEqual(
      vdom(getLocals({type: t.Str}, {error: React.DOM.i(null, 'JSX label')}).error),
      {tag: 'i', attrs: {}, children: 'JSX label'},
      'should handle error option as JSX');

    tape.strictEqual(
      getLocals({type: t.Str}, {error: function (value) {
        return 'error: ' + value;
      }}, 'a').error,
      'error: a',
      'should handle error option as a function');
  });

  tape.test('template', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: t.Str}).template,
      bootstrap.textbox,
      'default template should be bootstrap.textbox');

    var template = function () {};

    tape.strictEqual(
      getLocals({type: t.Str}, {template: template}).template,
      template,
      'should handle template option');

    tape.strictEqual(
      getLocals({type: t.Str, templates: {textbox: template}}).template,
      template,
      'should handle context templates');

  });

  tape.test('id', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      getLocals({type: t.Str}).id.substr(8, 1),
      '-',
      'default id should be a uuid');

    tape.strictEqual(
      getLocals({type: t.Str}, {id: 'myid'}).id,
      'myid',
      'should handle id option');

    tape.strictEqual(
      getLocals({type: t.Str}, {id: 'myid'}).name,
      'myid',
      'should use id as default name');

  });

  tape.test('autoFocus', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      getLocals({type: t.Str}).autoFocus,
      null,
      'default autoFocus should be null');

    tape.strictEqual(
      getLocals({type: t.Str}, {autoFocus: true}).autoFocus,
      true,
      'should handle autoFocus option');

  });

  if (typeof window !== 'undefined') {

    tape.test('getValue', function (tape) {
        tape.plan(20);

        getValue(function (result) {
          tape.strictEqual(result.isValid(), true);
          tape.strictEqual(result.value, null);
        }, function (locals) {
            tape.strictEqual(locals.hasError, false);
            tape.strictEqual(locals.value, null);
        }, {type: t.maybe(t.Str)});

        getValue(function (result) {
          tape.strictEqual(result.isValid(), false);
          tape.strictEqual(result.value, null);
        }, function (locals, rendered) {
          if (rendered) {
            tape.strictEqual(locals.hasError, true);
            tape.strictEqual(locals.value, null);
          }
        }, {type: t.Str});

        // should handle numeric values
        getValue(function (result) {
          tape.strictEqual(result.isValid(), true);
          tape.strictEqual(result.value, 1);
        }, function (locals) {
            tape.strictEqual(locals.hasError, false);
            tape.strictEqual(locals.value, '1');
        }, {type: t.Num}, null, 1);

        // should handle transformer option
        getValue(function (result) {
          tape.strictEqual(result.isValid(), true);
          tape.deepEqual(result.value, ['a', 'b']);
        }, function (locals) {
            tape.strictEqual(locals.hasError, false);
            tape.strictEqual(locals.value, 'a,b');
        }, {type: t.Arr}, {transformer: transformer}, ['a', 'b']);

        // hidden textbox
        getValue(function (result) {
          tape.strictEqual(result.isValid(), true);
          tape.strictEqual(result.value, null);
        }, function (locals) {
            tape.strictEqual(locals.hasError, false);
            tape.strictEqual(locals.value, null);
        }, {type: t.maybe(t.Str)}, {type: 'hidden'});

    });

  }

});




},{"../../.":"/Users/giulio/Documents/Projects/github/tcomb-form/index.js","../../lib/components/Textbox":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/components/Textbox.js","../../lib/skins/bootstrap":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/skins/bootstrap/index.js","./util":"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/util.js","react":"react","react-vdom":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/react-vdom/index.js","tape":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/tape/index.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/index.js":[function(require,module,exports){
require('./Checkbox');
require('./Textbox');
require('./Select');
require('./Radio');
require('./Struct');
require('./List');

},{"./Checkbox":"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/Checkbox.js","./List":"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/List.js","./Radio":"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/Radio.js","./Select":"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/Select.js","./Struct":"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/Struct.js","./Textbox":"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/Textbox.js"}],"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/util.js":[function(require,module,exports){
/*global document*/
'use strict';

var React = require('react');
var t = require('../../.');
var config = require('../../lib/config');
var getReport = require('../../lib/util/getReport');
var Context = require('../../lib/api').Context;

function noop() {}

function getContext(ctx) {
  return new Context(t.util.mixin({
    templates: config.templates,
    i18n: config.i18n,
    report: getReport(ctx.type),
    auto: 'placeholders'
  }, ctx, true));
}

function getLocalsFactory(factory) {
  return function getLocals(ctx, options, value, onChange) {
    console.log(React.version);
    var x;
    if (React.version.indexOf('0.13') !== -1) {
      x = new factory.type({
        ctx: getContext(ctx),
        options: options,
        value: value,
        onChange: onChange || noop
      });
    } else {
      x = new factory.type();
      x.props = {
        ctx: getContext(ctx),
        options: options,
        value: value,
        onChange: onChange || noop
      };
      x.state = x.getInitialState();
    }
    return x.getLocals();
  };
}

function getValueFactory(factory, template) {
  return function getValue(onResult, onRender, ctx, options, value, onChange) {
    var rendered = false;
    options = options || {};
    options.template = function (locals) {
      onRender(locals, rendered);
      return template(locals);
    };
    var element = React.createElement(factory, {
      ctx: getContext(ctx),
      options: options,
      value: value,
      onChange: onChange
    });
    var app = document.getElementById('app');
    var node = document.createElement('div');
    app.appendChild(node);
    var component = React.render(element, node);
    rendered = true;
    var result = component.getValue();
    onResult(result);
  };
}

module.exports = {
  getLocalsFactory: getLocalsFactory,
  getValueFactory: getValueFactory
};

},{"../../.":"/Users/giulio/Documents/Projects/github/tcomb-form/index.js","../../lib/api":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/api.js","../../lib/config":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/config.js","../../lib/util/getReport":"/Users/giulio/Documents/Projects/github/tcomb-form/lib/util/getReport.js","react":"react"}],"/Users/giulio/Documents/Projects/github/tcomb-form/test/index.js":[function(require,module,exports){
var React = require('react');
var debug = require('debug');
debug.disable('*');
window.React = React;
require('./components');
require('./bootstrap');


},{"./bootstrap":"/Users/giulio/Documents/Projects/github/tcomb-form/test/bootstrap/index.js","./components":"/Users/giulio/Documents/Projects/github/tcomb-form/test/components/index.js","debug":"/Users/giulio/Documents/Projects/github/tcomb-form/node_modules/debug/browser.js","react":"react"}]},{},["/Users/giulio/Documents/Projects/github/tcomb-form/test/index.js"]);

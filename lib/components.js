'use strict';

var React = require('react');
var t = require('tcomb-validation');
var compile = require('uvdom/react').compile;
var debug = require('debug');
var util = require('./util');

var Nil = t.Nil;
var SOURCE = '[tcomb-form]';
var log = debug(SOURCE);
var nooptions = Object.freeze({});
var noop = function () {};
var merge = util.merge;
var uuid = util.uuid;
var getOptionsOfEnum = util.getOptionsOfEnum;
var getReport = util.getReport;
var move = util.move;
var humanize = util.humanize;

// recursively create an extend method
function createExtend(oldSpec) {
  return function (spec) {
    var newSpec = merge(oldSpec, spec);
    var Component = React.createClass(newSpec);
    Component.extend = createExtend(newSpec);
    return Component;
  };
}

var Component = {

  getInitialState: function () {
    var value = this.getTransformer().format(this.props.value);
    return {
      hasError: false,
      value: value
    };
  },

  componentWillReceiveProps: function (props) {
    var value = this.getTransformer().format(props.value);
    this.setState({value: value});
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return nextState.value !== this.state.value ||
      nextState.hasError !== this.state.hasError ||
      nextProps.value !== this.state.value ||
      nextProps.options !== this.props.options ||
      nextProps.ctx.report.type !== this.props.ctx.report.type;
  },

  onChange: function (value) {
    this.setState({value: value}, function () {
      this.props.onChange(value, this.props.ctx.path);
    }.bind(this));
  },

  getTransformer: function () {
    return {
      format: function (value) { return value; },
      parse: function (value) { return value; }
    };
  },

  validate: function () {
    var value = this.getTransformer().parse(this.state.value);
    var result = t.validate(value, this.props.ctx.report.type, this.props.ctx.path);
    this.setState({hasError: !result.isValid()});
    return result;
  },

  getInnerType: function () {
    return this.props.ctx.report.innerType;
  },

  getAuto: function () {
    return this.props.options.auto || this.props.ctx.auto;
  },

  getI18n: function () {
    return this.props.options.i18n || this.props.ctx.i18n;
  },

  getDefaultLabel: function () {
    var ctx = this.props.ctx;
    if (ctx.label) {
      return ctx.label + (this.props.ctx.report.maybe ? ctx.i18n.optional : '');
    }
  },

  getLabel: function () {
    var legend = this.props.options.legend;
    var label = this.props.options.label;
    label = label || legend;
    if (Nil.is(label) && this.getAuto() === 'labels') {
      label = this.getDefaultLabel();
    }
    return label;
  },

  getError: function () {
    var error = this.props.options.error;
    return t.Func.is(error) ? error(this.state.value) : error;
  },

  hasError: function () {
    return this.props.options.hasError || this.state.hasError;
  },

  getConfig: function () {
    return merge(this.props.ctx.config, this.props.options.config);
  },

  getId: function () {
    return this.props.options.id || this._rootNodeID || uuid();
  },

  getName: function () {
    return this.props.options.name || this.props.ctx.name || this.getId();
  },

  getLocals: function () {
    var options = this.props.options;
    return {
      path: this.props.ctx.path,
      error: this.getError(),
      hasError: this.hasError(),
      label: this.getLabel(),
      onChange: this.onChange,
      config: this.getConfig(),
      value: this.state.value,
      disabled: options.disabled,
      help: options.help,
      id: this.getId(),
      name: this.getName()
    };
  },

  render: function () {
    var locals = this.getLocals();
    // getTemplate is the only required custom implementation
    if (!t.Func.is(this.getTemplate)) {
      t.fail('[tcomb-form] missing getTemplate() method for ' + this.constructor.type.displayName);
    }
    var template = this.getTemplate();
    log('render() called for `%s` field', locals.name);
    return compile(template(locals));
  }

};

Component.extend = createExtend(Component);

var Textbox = Component.extend({

  displayName: 'Textbox',

  statics: {
    transformer: Object.freeze({
      format: function (value) {
        return Nil.is(value) ? null : value;
      },
      parse: function (value) {
        return (t.Str.is(value) && value.trim() === '') || Nil.is(value) ? null : value;
      }
    }),
    numberTransformer: Object.freeze({
      format: function (value) {
        return Nil.is(value) ? value : String(value);
      },
      parse: function (value) {
        var n = parseFloat(value);
        var isNumeric = (value - n + 1) >= 0;
        return isNumeric ? n : value;
      }
    })
  },

  getTransformer: function () {
    if (this.props.options.transformer) {
      return this.props.options.transformer;
    }
    if (this.getInnerType() === t.Num) {
      return Textbox.numberTransformer;
    }
    return Textbox.transformer;
  },

  getPlaceholder: function () {
    var placeholder = this.props.options.placeholder;
    if (Nil.is(placeholder) && this.getAuto() === 'placeholders') {
      placeholder = this.getDefaultLabel();
    }
    return placeholder;
  },

  getTemplate: function () {
    return this.props.options.template || this.props.ctx.templates.textbox;
  },

  getLocals: function () {
    var options = this.props.options;
    var locals = Component.getLocals.call(this);
    locals = t.mixin(locals, {
      autoFocus: options.autoFocus,
      placeholder: this.getPlaceholder(),
      type: options.type || 'text',
      className: options.className
    });
    return locals;
  }

});

var Checkbox = Component.extend({

  displayName: 'Checkbox',

  statics: {
    transformer: Object.freeze({
      format: function (value) {
        return Nil.is(value) ? false : value;
      },
      parse: function (value) {
        return Nil.is(value) ? false : value;
      }
    })
  },

  getTransformer: function () {
    if (this.props.options && this.props.options.transformer) {
      return this.props.options.transformer;
    }
    return Checkbox.transformer;
  },

  getTemplate: function () {
    return this.props.options.template || this.props.ctx.templates.checkbox;
  },

  getLocals: function () {
    var opts = this.props.options;
    var locals = Component.getLocals.call(this);
    locals = t.mixin(locals, {
      autoFocus: opts.autoFocus,
      className: opts.className
    });
    return locals;
  }

});

function sortByText(a, b) {
  return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
}

function getComparator(order) {
  return {
    asc: sortByText,
    desc: function(a, b) { return -sortByText(a, b); }
  }[order];
}

var Select = Component.extend({

  displayName: 'Select',

  statics: {
    transformer: function (nullOption) {
      return {
        format: function (value) { return Nil.is(value) && nullOption ? nullOption.value : value; },
        parse: function (value) { return nullOption && nullOption.value === value ? null : value; }
      };
    },
    multipleTransformer: Object.freeze({
      format: function (value) { return Nil.is(value) ? [] : value; },
      parse: function (value) { return value; }
    }),
    getComparator: getComparator
  },

  getTransformer: function () {
    var options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    if (this.isMultiple()) {
      return Select.multipleTransformer;
    }
    return Select.transformer(this.getNullOption());
  },

  getNullOption: function () {
    return this.props.options.nullOption || {value: '', text: '-'};
  },

  isMultiple: function () {
    return this.getInnerType().meta.kind === 'list';
  },

  getEnum: function () {
    var innerType = this.getInnerType();
    return this.isMultiple() ? getReport(innerType.meta.type).innerType : innerType;
  },

  getOptions: function () {
    var options = this.props.options;
    var items = options.options ? options.options.slice() : getOptionsOfEnum(this.getEnum());
    if (options.order) {
      items.sort(getComparator(options.order));
    }
    var nullOption = this.getNullOption();
    if (options.nullOption !== false) {
      items.unshift(nullOption);
    }
    return items;
  },

  getTemplate: function () {
    return this.props.options.template || this.props.ctx.templates.select;
  },

  getLocals: function () {
    var opts = this.props.options;
    var locals = Component.getLocals.call(this);
    locals = t.mixin(locals, {
      autoFocus: opts.autoFocus,
      className: opts.className,
      multiple: this.isMultiple(),
      options: this.getOptions()
    });
    return locals;
  }

});

var Radio = Component.extend({

  displayName: 'Radio',

  statics: {
    transformer: Object.freeze({
      format: function (value) {
        return Nil.is(value) ? null : value;
      },
      parse: function (value) {
        return value;
      }
    })
  },

  getTransformer: function () {
    var options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    return Radio.transformer;
  },

  getOptions: function () {
    var options = this.props.options;
    var items = options.options ? options.options.slice() : getOptionsOfEnum(this.getInnerType());
    if (options.order) {
      items.sort(getComparator(options.order));
    }
    return items;
  },

  getTemplate: function () {
    return this.props.options.template || this.props.ctx.templates.radio;
  },

  getLocals: function () {
    var opts = this.props.options;
    var locals = Component.getLocals.call(this);
    locals = t.mixin(locals, {
      autoFocus: opts.autoFocus,
      className: opts.className,
      options: this.getOptions()
    });
    return locals;
  }

});

var Struct = Component.extend({

  displayName: 'Struct',

  statics: {
    transformer: Object.freeze({
      format: function (value) {
        return Nil.is(value) ? {} : value;
      },
      parse: function (value) {
        return value;
      }
    })
  },

  getTransformer: function () {
    if (this.props.options.transformer) {
      return this.props.options.transformer;
    }
    return Struct.transformer;
  },

  onChange: function (fieldName, fieldValue, path) {
    var value = t.mixin({}, this.state.value);
    value[fieldName] = fieldValue;
    this.setState({value: value}, function () {
      this.props.onChange(value, path);
    }.bind(this));
  },

  validate: function () {
    var report = this.props.ctx.report;
    var value = {};
    var errors = [];
    var hasError = false;
    var result;

    for (var ref in this.refs) {
      if (this.refs.hasOwnProperty(ref)) {
        result = this.refs[ref].validate();
        errors = errors.concat(result.errors);
        value[ref] = result.value;
      }
    }

    if (errors.length === 0) {
      value = new report.innerType(value);
      // handle subtype
      if (report.subtype && errors.length === 0) {
        result = t.validate(value, report.type, this.props.ctx.path);
        hasError = !result.isValid();
        errors = errors.concat(result.errors);
      }
    }

    this.setState({hasError: hasError});
    return new t.ValidationResult({errors: errors, value: value});
  },

  getTypeProps: function () {
    return this.getInnerType().meta.props;
  },

  getOrder: function () {
    return this.props.options.order || Object.keys(this.getTypeProps());
  },

  getInputs: function () {

    var options = this.props.options;
    var ctx = this.props.ctx;
    var props = this.getTypeProps();
    var auto = this.getAuto();
    var i18n = this.getI18n();
    var config = this.getConfig();
    var templates = this.getTemplates();
    var value = this.state.value;
    var inputs = {};

    for (var prop in props) {
      if (props.hasOwnProperty(prop)) {
        var propType = props[prop];
        var propOptions = options.fields && options.fields[prop] ? options.fields[prop] : nooptions;
        inputs[prop] = React.createElement(getComponent(propType, propOptions), {
          key: prop,
          ref: prop,
          type: propType,
          options: propOptions,
          value: value[prop],
          onChange: this.onChange.bind(this, prop),
          ctx: {
            auto: auto,
            config: config,
            name: ctx.name ? ctx.name + '[' + prop + ']' : prop,
            label: humanize(prop),
            i18n: i18n,
            report: getReport(propType),
            templates: templates,
            path: ctx.path.concat(prop)
          }
        });
      }
    }
    return inputs;
  },

  getTemplates: function () {
    return merge(this.props.ctx.templates, this.props.options.templates);
  },

  getTemplate: function () {
    return this.props.options.template || this.getTemplates().struct;
  },

  getLocals: function () {
    var options = this.props.options;
    var locals = Component.getLocals.call(this);
    locals = t.mixin(locals, {
      order: this.getOrder(),
      inputs: this.getInputs(),
      className: options.className
    });
    return locals;
  }

});

function justify(value, keys) {
  if (value.length === keys.length) { return keys; }
  var ret = [];
  for (var i = 0, len = value.length ; i < len ; i++ ) {
    ret[i] = keys[i] || uuid();
  }
  return ret;
}

var List = Component.extend({

  displayName: 'List',

  statics: {
    transformer: Object.freeze({
      format: function (value) {
        return Nil.is(value) ? [] : value;
      },
      parse: function (value) {
        return value;
      }
    })
  },

  getInitialState: function () {
    var value = this.getTransformer().format(this.props.value || []);
    return {
      hasError: false,
      value: value,
      keys: value.map(uuid)
    };
  },

  componentWillReceiveProps: function (props) {
    var value = this.getTransformer().format(props.value || []);
    this.setState({
      value: value,
      keys: justify(value, this.state.keys)
    });
  },

  getTransformer: function () {
    if (this.props.options.transformer) {
      return this.props.options.transformer;
    }
    return List.transformer;
  },

  onChange: function (value, keys, path) {
    this.setState({value: value, keys: justify(value, keys)}, function () {
      this.props.onChange(value, path || this.props.ctx.path);
    }.bind(this));
  },

  validate: function () {
    var report = this.props.ctx.report;
    var value = [];
    var errors = [];
    var hasError = false;
    var result;

    for (var i = 0, len = this.state.value.length ; i < len ; i++ ) {
      result = this.refs[i].validate();
      errors = errors.concat(result.errors);
      value.push(result.value);
    }

    // handle subtype
    if (report.subtype && errors.length === 0) {
      result = t.validate(value, report.type, this.props.ctx.path);
      hasError = !result.isValid();
      errors = errors.concat(result.errors);
    }

    this.setState({hasError: hasError});
    return new t.ValidationResult({errors: errors, value: value});
  },

  addItem: function (evt) {
    evt.preventDefault();
    var value = this.state.value.concat(undefined);
    var keys = this.state.keys.concat(uuid());
    this.onChange(value, keys, this.props.ctx.path.concat(value.length - 1));
  },

  onItemChange: function (itemIndex, itemValue, path) {
    var value = this.state.value.slice();
    value[itemIndex] = itemValue;
    this.onChange(value, this.state.keys, path);
  },

  removeItem: function (i, evt) {
    evt.preventDefault();
    var value = this.state.value.slice();
    value.splice(i, 1);
    var keys = this.state.keys.slice();
    keys.splice(i, 1);
    this.onChange(value, keys, this.props.ctx.path.concat(i));
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

  getItems: function () {

    var options = this.props.options;
    var ctx = this.props.ctx;
    var auto = this.getAuto();
    var i18n = this.getI18n();
    var config = this.getConfig();
    var templates = this.getTemplates();
    var value = this.state.value;
    var type = this.getInnerType().meta.type;
    var report = getReport(type);
    var Component = getComponent(type, options.item || nooptions);
    return value.map(function (value, i) {
      var buttons = [];
      if (!options.disableRemove) { buttons.push({ label: i18n.remove, click: this.removeItem.bind(this, i) }); }
      if (!options.disableOrder)  { buttons.push({ label: i18n.up, click: this.moveUpItem.bind(this, i) }); }
      if (!options.disableOrder)  { buttons.push({ label: i18n.down, click: this.moveDownItem.bind(this, i) }); }
      return {
        input: React.createElement(Component, {
          ref: i,
          type: type,
          options: options.item || nooptions,
          value: value,
          onChange: this.onItemChange.bind(this, i),
          ctx: {
            auto: auto,
            config: config,
            i18n: i18n,
            name: ctx.name ? ctx.name + '[' + i + ']' : String(i),
            report: report,
            templates: templates,
            path: ctx.path.concat(i)
          }
        }),
        key: this.state.keys[i],
        buttons: buttons
      };
    }.bind(this));
  },

  getTemplates: function () {
    return merge(this.props.ctx.templates, this.props.options.templates);
  },

  getTemplate: function () {
    return this.props.options.template || this.getTemplates().list;
  },

  getLocals: function () {

    var options = this.props.options;
    var i18n = this.getI18n();
    var locals = Component.getLocals.call(this);
    locals = t.mixin(locals, {
      add: options.disableAdd ? null : {
        label: i18n.add,
        click: this.addItem
      },
      items: this.getItems(),
      className: options.className
    });

    return locals;
  }

});

function getComponent(type, options) {
  if (options.factory) {
    return options.factory;
  }
  var name = t.getTypeName(type);
  switch (type.meta.kind) {
    case 'irreducible' :
      return type === t.Bool ? Checkbox : Textbox;
    case 'struct' :
      return Struct;
    case 'list' :
      return List;
    case 'enums' :
      return Select;
    case 'maybe' :
    case 'subtype' :
      return getComponent(type.meta.type, options);
    default :
      t.fail(SOURCE + ' unsupported type ' + name);
  }
}

var Form = React.createClass({

  displayName: 'Form',

  validate: function () {
    return this.refs.input.validate();
  },

  // the public api returns `null` if validation failed
  // unless the optional boolean argument `raw` is set to `true`
  getValue: function (raw) {
    var result = this.validate();
    if (raw === true) { return result; }
    if (result.isValid()) { return result.value; }
    return null;
  },

  getComponent: function (path) {
    path = t.Str.is(path) ? path.split('.') : path;
    return path.reduce(function (input, name) {
      return input.refs[name], this.refs.input;
    });
  },

  render: function () {

    var type = this.props.type;
    var options = this.props.options || nooptions;
    var templates = Form.templates;
    var i18n = Form.i18n;

    t.assert(t.Type.is(type), SOURCE + ' missing required prop type');
    t.assert(t.Obj.is(options), SOURCE + ' prop options must be an object');
    t.assert(t.Obj.is(templates), SOURCE + ' missing templates config');
    t.assert(t.Obj.is(i18n), SOURCE + ' missing i18n config');

    var factory = React.createFactory(getComponent(type, options));
    return factory({
      ref: 'input',
      type: type,
      options: options,
      value: this.props.value,
      onChange: this.props.onChange || noop,
      ctx: this.props.ctx || {
        auto: 'labels',
        i18n: i18n,
        report: getReport(type),
        templates: templates,
        path: []
      }
    });
  }

});

module.exports = {
  getComponent: getComponent,
  Component: Component,
  Textbox: Textbox,
  Checkbox: Checkbox,
  Select: Select,
  Radio: Radio,
  Struct: Struct,
  List: List,
  Form: Form
};
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

function validate() {
  var value = this.getTransformer().parse(this.state.value);
  var result = t.validate(value, this.props.ctx.report.type, this.props.ctx.path);
  this.setState({hasError: !result.isValid()});
  return result;
}

var ComponentMixin = {

  getInitialState: function () {
    t.assert(t.Func.is(this.getTransformer), '[tcomb-form] missing getTransformer');
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
      nextProps.value !== this.props.value ||
      nextProps.options !== this.props.options ||
      nextProps.ctx.report.type !== this.props.ctx.report.type;
  },

  onChange: function (value) {
    this.setState({value: value}, function () {
      this.props.onChange(value, this.props.ctx.path);
    }.bind(this));
  },

  getDefaultLabel: function () {
    var ctx = this.props.ctx;
    if (ctx.label) {
      return ctx.label + (this.props.ctx.report.maybe ? ctx.i18n.optional : '');
    }
  },

  getLabel: function () {
    var ctx = this.props.ctx;
    var legend = this.props.options.legend;
    var label = this.props.options.label;
    label = label || legend;
    if (Nil.is(label) && ctx.auto === 'labels') {
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

  getDefaultLocals: function () {
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
    var locals = this.getLocals ? this.getLocals() : this.getDefaultLocals();
    t.assert(t.Func.is(this.getTemplate), '[tcomb-form] missing getTemplate');
    var template = this.getTemplate();
    log('render() called for `%s` field', locals.name);
    return compile(template(locals));
  }

};

var textboxDefaultTransformer = {
  format: function (value) {
    return Nil.is(value) ? null : value;
  },
  parse: function (value) {
    return (t.Str.is(value) && value.trim() === '') || Nil.is(value) ? null : value;
  }
};

var textboxNumberTransformer = {
  format: function (value) {
    return Nil.is(value) ? value : String(value);
  },
  parse: function (value) {
    var n = parseFloat(value);
    var isNumeric = (value - n + 1) >= 0;
    return isNumeric ? n : value;
  }
};

var TextboxMixin = {

  mixins: [ComponentMixin],

  getTransformer: function () {
    if (this.props.options.transformer) {
      return this.props.options.transformer;
    }
    if (this.props.ctx.report.innerType === t.Num) {
      return textboxNumberTransformer;
    }
    return textboxDefaultTransformer;
  },

  validate: validate,

  getPlaceholder: function () {
    var placeholder = this.props.options.placeholder;
    if (Nil.is(placeholder) && this.props.ctx.auto === 'placeholders') {
      placeholder = this.getDefaultLabel();
    }
    return placeholder;
  },

  getLocals: function () {
    var options = this.props.options;
    var locals = this.getDefaultLocals();
    locals = t.mixin(locals, {
      autoFocus: options.autoFocus,
      placeholder: this.getPlaceholder(),
      type: options.type || 'text',
      className: options.className
    });
    return locals;
  }

};

var Textbox = React.createClass({

  displayName: 'Textbox',

  mixins: [TextboxMixin],

  getTemplate: function () {
    return this.props.options.template || this.props.ctx.templates.textbox;
  }

});

Textbox.defaultTransformer = textboxDefaultTransformer;
Textbox.numberTransformer = textboxNumberTransformer;
Textbox.Mixin = TextboxMixin;

var checkboxDefaultTransformer = {
  format: function (value) {
    return Nil.is(value) ? false : value;
  },
  parse: function (value) {
    return Nil.is(value) ? false : value;
  }
};

var CheckboxMixin = {

  mixins: [ComponentMixin],

  getTransformer: function () {
    if (this.props.options && this.props.options.transformer) {
      return this.props.options.transformer;
    }
    return checkboxDefaultTransformer;
  },

  validate: validate,

  getLocals: function () {
    var opts = this.props.options;
    var locals = this.getDefaultLocals();
    locals = t.mixin(locals, {
      autoFocus: opts.autoFocus,
      className: opts.className
    });
    return locals;
  }

};

var Checkbox = React.createClass({

  displayName: 'Checkbox',

  mixins: [CheckboxMixin],

  getTemplate: function () {
    return this.props.options.template || this.props.ctx.templates.checkbox;
  }

});

Checkbox.defaultTransformer = checkboxDefaultTransformer;
Checkbox.Mixin = CheckboxMixin;

var selectDefaultTransformer = function (nullOption) {
  return {
    format: function (value) { return Nil.is(value) && nullOption ? nullOption.value : value; },
    parse: function (value) { return nullOption && nullOption.value === value ? null : value; }
  };
};

var selectMultipleTransformer = {
  format: function (value) { return Nil.is(value) ? [] : value; },
  parse: function (value) { return value; }
};

function sortByText(a, b) {
  return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
}

function getComparator(order) {
  return {
    asc: sortByText,
    desc: function(a, b) { return -sortByText(a, b); }
  }[order];
}

var SelectMixin = {

  mixins: [ComponentMixin],

  getTransformer: function () {
    var options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    if (this.isMultiple()) {
      return selectMultipleTransformer;
    }
    return selectDefaultTransformer(this.getNullOption());
  },

  validate: validate,

  getNullOption: function () {
    return this.props.options.nullOption || {value: '', text: '-'};
  },

  isMultiple: function () {
    return this.props.ctx.report.innerType.meta.kind === 'list';
  },

  getEnum: function () {
    return this.isMultiple() ? getReport(this.props.ctx.report.innerType.meta.type).innerType : this.props.ctx.report.innerType;
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

  getLocals: function () {
    var opts = this.props.options;
    var locals = this.getDefaultLocals();

    locals = t.mixin(locals, {
      autoFocus: opts.autoFocus,
      className: opts.className,
      multiple: this.isMultiple(),
      options: this.getOptions()
    });

    return locals;
  }

};

var Select = React.createClass({

  displayName: 'Select',

  mixins: [SelectMixin],

  getTemplate: function () {
    return this.props.options.template || this.props.ctx.templates.select;
  }

});

Select.defaultTransformer = selectDefaultTransformer;
Select.multipleTransformer = selectMultipleTransformer;
Select.Mixin = SelectMixin;

var radioDefaultTransformer = {
  format: function (value) {
    return Nil.is(value) ? null : value;
  },
  parse: function (value) {
    return value;
  }
};

function sortByText(a, b) {
  return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
}

function getComparator(order) {
  return {
    asc: sortByText,
    desc: function(a, b) { return -sortByText(a, b); }
  }[order];
}

var RadioMixin = {

  mixins: [ComponentMixin],

  getTransformer: function () {
    var options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    return radioDefaultTransformer;
  },

  validate: validate,

  getOptions: function () {
    var options = this.props.options;
    var items = options.options ? options.options.slice() : getOptionsOfEnum(this.props.ctx.report.innerType);
    if (options.order) {
      items.sort(getComparator(options.order));
    }
    return items;
  },

  getLocals: function () {
    var opts = this.props.options;
    var locals = this.getDefaultLocals();

    locals = t.mixin(locals, {
      autoFocus: opts.autoFocus,
      className: opts.className,
      options: this.getOptions()
    });

    return locals;
  }

};

var Radio = React.createClass({

  displayName: 'Radio',

  mixins: [RadioMixin],

  getTemplate: function () {
    return this.props.options.template || this.props.ctx.templates.radio;
  }

});

Radio.defaultTransformer = radioDefaultTransformer;

var structDefaultTransformer = {
  format: function (value) {
    return Nil.is(value) ? {} : value;
  },
  parse: function (value) {
    return value;
  }
};

var StructMixin = {

  displayName: 'Struct',

  getInitialState: ComponentMixin.getInitialState,
  componentWillReceiveProps: ComponentMixin.componentWillReceiveProps,
  shouldComponentUpdate: ComponentMixin.shouldComponentUpdate,
  getDefaultLocals: ComponentMixin.getDefaultLocals,
  getError: ComponentMixin.getError,
  hasError: ComponentMixin.hasError,
  getConfig: ComponentMixin.getConfig,
  getDefaultLabel: ComponentMixin.getDefaultLabel,
  getLabel: ComponentMixin.getLabel,
  getId: ComponentMixin.getId,
  getName: ComponentMixin.getName,
  render: ComponentMixin.render,

  getTransformer: function () {
    if (this.props.options.transformer) {
      return this.props.options.transformer;
    }
    return structDefaultTransformer;
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

  getTemplates: function () {
    return merge(this.props.ctx.templates, this.props.options.templates);
  },

  getTypeProps: function () {
    return this.props.ctx.report.innerType.meta.props;
  },

  getOrder: function () {
    return this.props.options.order || Object.keys(this.getTypeProps());
  },

  getAuto: function () {
    return this.props.options.auto || this.props.ctx.auto;
  },

  getI81n: function () {
    return this.props.options.i18n || this.props.ctx.i18n;
  },

  getInputs: function () {

    var options = this.props.options;
    var ctx = this.props.ctx;
    var props = this.getTypeProps();
    var auto = this.getAuto();
    var i18n = this.getI81n();
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

  getLocals: function () {
    var options = this.props.options;
    var locals = this.getDefaultLocals();

    locals = t.mixin(locals, {
      order: this.getOrder(),
      inputs: this.getInputs(),
      className: options.className
    });

    return locals;
  }

};

var Struct = React.createClass({

  displayName: 'Struct',

  mixins: [StructMixin],

  getTemplate: function () {
    return this.props.options.template || this.getTemplates().struct;
  }

});

Struct.defaultTransformer = structDefaultTransformer;
Struct.Mixin = StructMixin;

var listDefaultTransformer = {
  format: function (value) {
    return Nil.is(value) ? [] : value;
  },
  parse: function (value) {
    return value;
  }
};

function justify(value, keys) {
  if (value.length === keys.length) { return keys; }
  var ret = [];
  for (var i = 0, len = value.length ; i < len ; i++ ) {
    ret[i] = keys[i] || uuid();
  }
  return ret;
}

var ListMixin = {

  displayName: 'List',

  shouldComponentUpdate: ComponentMixin.shouldComponentUpdate,
  getDefaultLocals: ComponentMixin.getDefaultLocals,
  getError: ComponentMixin.getError,
  hasError: ComponentMixin.hasError,
  getConfig: ComponentMixin.getConfig,
  getDefaultLabel: ComponentMixin.getDefaultLabel,
  getLabel: ComponentMixin.getLabel,
  getId: ComponentMixin.getId,
  getName: ComponentMixin.getName,
  render: ComponentMixin.render,

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
    return listDefaultTransformer;
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

  getTemplates: function () {
    return merge(this.props.ctx.templates, this.props.options.templates);
  },

  getAuto: function () {
    return this.props.options.auto || this.props.ctx.auto;
  },

  getI81n: function () {
    return this.props.options.i18n || this.props.ctx.i18n;
  },

  getItems: function () {

    var options = this.props.options;
    var ctx = this.props.ctx;
    var auto = this.getAuto();
    var i18n = this.getI81n();
    var config = this.getConfig();
    var templates = this.getTemplates();
    var value = this.state.value;
    var type = this.props.ctx.report.innerType.meta.type;
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

  getLocals: function () {

    var options = this.props.options;
    var i18n = this.getI81n();
    var locals = this.getDefaultLocals();
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

};

var List = React.createClass({

  displayName: 'List',

  mixins: [ListMixin],

  getTemplate: function () {
    return this.props.options.template || this.getTemplates().list;
  }

});

List.defaultTransformer = listDefaultTransformer;
List.Mixin = ListMixin;

var Dict = React.createClass({

  mixins: [ComponentMixin],

  getTransformer: function () {
    return {
      format: function (value) {
        if (t.Arr.is(value)) { return value; }
        value = value || {};
        var result = [];
        for (var key in value) {
          if (value.hasOwnProperty(key)) {
            result.push({domain: key, codomain: value[key]});
          }
        }
        return result;
      },
      parse: function (value) {
        var result = {};
        value.forEach(function (types) {
          result[types.domain] = types.codomain;
        });
        return result;
      }
    };
  },

  validate: function() {
    var result = this.refs.form.validate();
    if (!result.isValid()) { return result; }
    return validate.call(this);
  },

  getTemplate: function () {
    return function (locals) {
      var Type = t.list(t.struct({
        domain: this.props.ctx.report.innerType.meta.domain,
        codomain: this.props.ctx.report.innerType.meta.codomain
      }));
      var ctx = t.mixin({}, this.props.ctx);
      ctx.report = getReport(Type);
      return <Form
        ref="form"
        type={Type}
        options={this.props.options}
        onChange={locals.onChange}
        value={locals.value}
        ctx={ctx}
      />;
    }.bind(this);
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
    case 'dict' :
      return Dict;
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
  ComponentMixin: ComponentMixin,
  Textbox: Textbox,
  Checkbox: Checkbox,
  Select: Select,
  Radio: Radio,
  Struct: Struct,
  List: List,
  Form: Form
};
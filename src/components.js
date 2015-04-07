'use strict';

var React = require('react');
var t = require('tcomb-validation');
var compile = require('uvdom/react').compile;
var {
  humanize,
  merge,
  getTypeInfo,
  getOptionsOfEnum,
  uuid,
  move
} = require('./util');

var Nil = t.Nil;
var SOURCE = 'tcomb-form';
var nooptions = Object.freeze({});
var noop = () => {};

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
      t.fail(`[${SOURCE}] unsupported type ${name}`);
  }
}

function sortByText(a, b) {
  return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
}

function getComparator(order) {
  return {
    asc: sortByText,
    desc: (a, b) => -sortByText(a, b)
  }[order];
}

class Component extends React.Component {

  constructor(props) {
    super(props);
    this.typeInfo = getTypeInfo(props.type);
    this.state = {
      hasError: false,
      value: this.getTransformer().format(props.value)
    };
  }

  getTransformer() {
    return this.props.options.transformer || Component.defaultTransformer;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.value !== this.state.value ||
      nextState.hasError !== this.state.hasError ||
      nextProps.value !== this.props.value ||
      nextProps.options !== this.props.options ||
      nextProps.type !== this.props.type;
  }

  componentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.typeInfo = getTypeInfo(props.type);
    }
    this.setState({value: this.getTransformer().format(props.value)});
  }

  onChange(value) {
    this.setState({value}, () => {
      this.props.onChange(value, this.props.ctx.path);
    });
  }

  validate() {
    var value = this.getTransformer().parse(this.state.value);
    var result = t.validate(value, this.props.type, this.props.ctx.path);
    this.setState({hasError: !result.isValid()});
    return result;
  }

  getDefaultLabel() {
    var ctx = this.props.ctx;
    if (ctx.label) {
      return ctx.label + (this.typeInfo.isMaybe ? ctx.i18n.optional : '');
    }
  }

  getLabel() {
    var { options: { label, legend }, ctx } = this.props;
    label = label || legend;
    if (Nil.is(label) && ctx.auto === 'labels') {
      label = this.getDefaultLabel();
    }
    return label;
  }

  getPlaceholder() {
    var { options: { placeholder }, ctx } = this.props;
    if (Nil.is(placeholder) && ctx.auto === 'placeholders') {
      placeholder = this.getDefaultLabel();
    }
    return placeholder;
  }

  getError() {
    var error = this.props.options.error;
    return t.Func.is(error) ? error(this.state.value) : error;
  }

  hasError() {
    return this.props.options.hasError || this.state.hasError;
  }

  getAttrs() {
    var attrs = t.mixin({}, this.props.options.attrs);
    attrs.id = attrs.id || this._rootNodeID || uuid();
    attrs.name = attrs.name || this.props.ctx.name || attrs.id;
    if (t.Str.is(attrs.className)) { attrs.className = [attrs.className]; }
    if (t.Arr.is(attrs.className)) {
      attrs.className = attrs.className.reduce((acc, x) => {
        acc[x] = true;
        return acc;
      }, {});
    }
    return attrs;
  }

  getConfig() {
    return merge(this.props.ctx.config, this.props.options.config);
  }

  getLocals() {

    var options = this.props.options;
    var value = this.state.value;
    var locals = {
      path: this.props.ctx.path,
      error: this.getError(),
      hasError: this.hasError(),
      label: this.getLabel(),
      onChange: this.onChange.bind(this),
      placeholder: this.getPlaceholder(),
      attrs: this.getAttrs(),
      config: this.getConfig(),
      value
    };

    [
      'disabled',
      'help'
    ].forEach((name) => locals[name] = options[name]);

    return locals;
  }

  render() {
    var locals = this.getLocals();
    var template = this.getTemplate();
    return compile(template(locals));
  }

}

Component.defaultTransformer = {
  format: value => Nil.is(value) ? null : value,
  parse: value => value
};

class Textbox extends Component {

  getTransformer() {
    var options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    if (this.typeInfo.innerType === t.Num) {
      return Textbox.numberTransformer;
    }
    return Textbox.defaultTransformer;
  }

  getTemplate() {
    return this.props.options.template || this.props.ctx.templates.textbox;
  }

  getLocals() {
    var locals = super.getLocals();
    locals.type = this.props.options.type || 'text';
    return locals;
  }

}

Textbox.defaultTransformer = {
  format: value => Nil.is(value) ? null : value,
  parse: value => (t.Str.is(value) && value.trim() === '') || Nil.is(value) ? null : value
};

Textbox.numberTransformer = {
  format: value => Nil.is(value) ? null : String(value),
  parse: value => {
    var n = parseFloat(value);
    var isNumeric = (value - n + 1) >= 0;
    return isNumeric ? n : value;
  }
};

class Checkbox extends Component {

  getTransformer() {
    var options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    return Checkbox.defaultTransformer;
  }

  getTemplate() {
    return this.props.options.template || this.props.ctx.templates.checkbox;
  }

}

Checkbox.defaultTransformer = {
  format: value => Nil.is(value) ? false : value,
  parse: value => value
};

class Select extends Component {

  getTransformer() {
    var options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    return Select.defaultTransformer(this.getNullOption());
  }

  getNullOption() {
    return this.props.options.nullOption || {value: '', text: '-'};
  }

  isMultiple() {
    return this.typeInfo.innerType.meta.kind === 'list';
  }

  getEnum() {
    return this.isMultiple() ? getTypeInfo(this.typeInfo.innerType.meta.type).innerType : this.typeInfo.innerType;
  }

  getOptions() {
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
  }

  getTemplate() {
    return this.props.options.template || this.props.ctx.templates.select;
  }

  getLocals() {
    var locals = super.getLocals();
    locals.options = this.getOptions();
    locals.attrs.multiple = this.isMultiple();
    return locals;
  }

}

Select.defaultTransformer = (nullOption) => {
  return {
    format: value => {
      return Nil.is(value) && nullOption ? nullOption.value : value;
    },
    parse: value => {
      return nullOption && nullOption.value === value ? null : value;
    }
  };
};

class Radio extends Component {

  getOptions() {
    var options = this.props.options;
    var items = options.options ? options.options.slice() : getOptionsOfEnum(this.typeInfo.innerType);
    if (options.order) {
      items.sort(getComparator(options.order));
    }
    return items;
  }

  getTemplate() {
    return this.props.options.template || this.props.ctx.templates.radio;
  }

  getLocals() {
    var locals = super.getLocals();
    locals.options = this.getOptions();
    return locals;
  }

}

class Struct extends Component {

  getTransformer() {
    var options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    return Struct.defaultTransformer;
  }

  validate() {

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
      value = new this.typeInfo.innerType(value);
      if (this.typeInfo.isSubtype && errors.length === 0) {
        result = t.validate(value, this.props.type, this.props.ctx.path);
        hasError = !result.isValid();
        errors = errors.concat(result.errors);
      }
    }

    this.setState({hasError: errors.length > 0});
    return new t.ValidationResult({errors, value});
  }

  onChange(fieldName, fieldValue, path) {
    var value = t.mixin({}, this.state.value);
    value[fieldName] = fieldValue;
    this.setState({value}, function () {
      this.props.onChange(value, path);
    }.bind(this));
  }

  getTemplates() {
    return merge(this.props.ctx.templates, this.props.options.templates);
  }

  getTemplate() {
    return this.getTemplates().struct;
  }

  getTypeProps() {
    return this.typeInfo.innerType.meta.props;
  }

  getOrder() {
    return this.props.options.order || Object.keys(this.getTypeProps());
  }

  getInputs() {

    var { options, ctx } = this.props;
    var props = this.getTypeProps();
    var auto = options.auto || ctx.auto;
    var i18n = options.i18n || ctx.i18n;
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
            auto,
            config,
            name: ctx.name ? `${ctx.name}[${prop}]` : prop,
            label: humanize(prop),
            i18n,
            templates,
            path: ctx.path.concat(prop)
          }
        });
      }
    }
    return inputs;
  }

  getLocals() {

    var options = this.props.options;
    var locals = {
      path: this.props.ctx.path,
      order: this.getOrder(),
      inputs: this.getInputs(),
      error: this.getError(),
      hasError: this.hasError(),
      legend: this.getLabel()
    };

    [
      'disabled',
      'help'
    ].forEach((name) => locals[name] = options[name]);

    return locals;
  }

}

function toSameLength(value, keys) {
  if (value.length === keys.length) { return keys; }
  var ret = [];
  for (var i = 0, len = value.length ; i < len ; i++ ) {
    ret[i] = keys[i] || uuid();
  }
  return ret;
}

Struct.defaultTransformer = {
  format: value => Nil.is(value) ? {} : value,
  parse: value => value
};

class List extends Component {

  constructor(props) {
    super(props);
    this.state.keys = this.state.value.map(uuid);
  }

  getTransformer() {
    var options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    return List.defaultTransformer;
  }

  componentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.typeInfo = getTypeInfo(props.type);
    }
    var value = this.getTransformer().format(props.value);
    this.setState({
      value,
      keys: toSameLength(value, this.state.keys)
    });
  }

  validate() {

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
    if (this.typeInfo.subtype && errors.length === 0) {
      result = t.validate(value, this.props.type, this.props.ctx.path);
      hasError = !result.isValid();
      errors = errors.concat(result.errors);
    }

    this.setState({hasError: errors.length > 0});
    return new t.ValidationResult({errors: errors, value: value});
  }

  onChange(value, keys, path) {
    this.setState({value, keys: toSameLength(value, keys)}, () => {
      this.props.onChange(value, path || this.props.ctx.path);
    });
  }

  addItem(evt) {
    evt.preventDefault();
    var value = this.state.value.concat(undefined);
    var keys = this.state.keys.concat(uuid());
    this.onChange(value, keys, this.props.ctx.path.concat(value.length - 1));
  }

  onItemChange(itemIndex, itemValue, path) {
    var value = this.state.value.slice();
    value[itemIndex] = itemValue;
    this.onChange(value, this.state.keys, path);
  }

  removeItem(i, evt) {
    evt.preventDefault();
    var value = this.state.value.slice();
    value.splice(i, 1);
    var keys = this.state.keys.slice();
    keys.splice(i, 1);
    this.onChange(value, keys, this.props.ctx.path.concat(i));
  }

  moveUpItem(i, evt) {
    evt.preventDefault();
    if (i > 0) {
      this.onChange(
        move(this.state.value.slice(), i, i - 1),
        move(this.state.keys.slice(), i, i - 1)
      );
    }
  }

  moveDownItem(i, evt) {
    evt.preventDefault();
    if (i < this.state.value.length - 1) {
      this.onChange(
        move(this.state.value.slice(), i, i + 1),
        move(this.state.keys.slice(), i, i + 1)
      );
    }
  }

  getTemplates() {
    return merge(this.props.ctx.templates, this.props.options.templates);
  }

  getTemplate() {
    return this.getTemplates().list;
  }

  getI81n() {
    return this.props.options.i18n || this.props.ctx.i18n;
  }

  getItems() {

    var { options, ctx } = this.props;
    var auto = options.auto || ctx.auto;
    var i18n = this.getI81n();
    var config = this.getConfig();
    var templates = this.getTemplates();
    var value = this.state.value;
    var type = this.typeInfo.innerType.meta.type;
    var Component = getComponent(type, options.item || nooptions);
    return value.map((value, i) => {
      var buttons = [];
      if (!options.disableRemove) { buttons.push({ label: i18n.remove, click: this.removeItem.bind(this, i) }); }
      if (!options.disableOrder)  { buttons.push({ label: i18n.up, click: this.moveUpItem.bind(this, i) }); }
      if (!options.disableOrder)  { buttons.push({ label: i18n.down, click: this.moveDownItem.bind(this, i) }); }
      return {
        input: React.createElement(Component, {
          ref: i,
          type,
          options: options.item || nooptions,
          value,
          onChange: this.onItemChange.bind(this, i),
          ctx: {
            auto,
            config,
            i18n,
            name: ctx.name ? `${ctx.name}[${i}]` : String(i),
            templates,
            path: ctx.path.concat(i)
          }
        }),
        key: this.state.keys[i],
        buttons: buttons
      };
    });
  }

  getLocals() {

    var options = this.props.options;
    var i18n = this.getI81n();
    var locals = {
      path: this.props.ctx.path,
      error: this.getError(),
      hasError: this.hasError(),
      legend: this.getLabel(),
      add: options.disableAdd ? null : {
        label: i18n.add,
        click: this.addItem.bind(this)
      },
      items: this.getItems()
    };

    [
      'disabled',
      'help'
    ].forEach((name) => locals[name] = options[name]);

    return locals;
  }

}

List.defaultTransformer = {
  format: value => Nil.is(value) ? [] : value,
  parse: value => value
};

class Form {

  getValue(raw) {
    var result = this.refs.input.validate();
    return raw === true ? result :
      result.isValid() ? result.value :
      null;
  }

  getComponent(path) {
    path = t.Str.is(path) ? path.split('.') : path;
    return path.reduce((input, name) => input.refs[name], this.refs.input);
  }

  render() {

    var { type, options } = this.props;
    var { i18n, templates } = Form;

    options = options || nooptions;

    t.assert(t.Type.is(type), `[${SOURCE}] missing required prop type`);
    t.assert(t.Obj.is(options), `[${SOURCE}] prop options must be an object`);
    t.assert(t.Obj.is(templates), `[${SOURCE}] missing templates config`);
    t.assert(t.Obj.is(i18n), `[${SOURCE}] missing i18n config`);

    var Component = getComponent(type, options);

    return React.createElement(Component, {
      ref: 'input',
      type: type,
      options: options,
      value: this.props.value,
      onChange: this.props.onChange || noop,
      ctx: {
        auto: 'labels',
        templates,
        i18n,
        path: []
      }
    });
  }

}

module.exports = {
  Component,
  Textbox,
  Checkbox,
  Select,
  Radio,
  Struct,
  List,
  Form
};
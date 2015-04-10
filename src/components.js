'use strict';

import React from 'react';
import t from 'tcomb-validation';
import { compile } from 'uvdom/react';
import {
  humanize,
  merge,
  getTypeInfo,
  getOptionsOfEnum,
  uuid,
  move
} from './util';
import debug from 'debug';

const Nil = t.Nil;
const SOURCE = 'tcomb-form';
const log = debug(SOURCE);
const nooptions = Object.freeze({});
const noop = () => {};

export function getComponent(type, options) {
  if (options.factory) {
    return options.factory;
  }
  const name = t.getTypeName(type);
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
    case 'tuple' :
      return Tuple;
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

export const annotations = {

  template: function (name) {
    return function (Component) {
      Component.prototype.getTemplate = function getTemplate() {
        return this.props.options.template || this.props.ctx.templates[name];
      };
    };
  },

  attrs: function (Component) {
    Component.prototype.getAttrs = function getAttrs() {
      const attrs = t.mixin({}, this.props.options.attrs);
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
    };
    Component.locals = Component.locals.concat({
      name: 'attrs', method: 'getAttrs'
    });
  },

  placeholder: function (Component) {
    Component.prototype.getPlaceholder = function getPlaceholder() {
      const ctx = this.props.ctx;
      let placeholder = this.props.options.placeholder;
      if (Nil.is(placeholder) && ctx.auto === 'placeholders') {
        placeholder = this.getDefaultLabel();
      }
      return placeholder;
    };
    Component.locals = Component.locals.concat({
      name: 'placeholder', method: 'getPlaceholder'
    });
  }

};

export class Component extends React.Component {

  static locals = [];

  static defaultTransformer = {
    format: value => Nil.is(value) ? null : value,
    parse: value => value
  };

  constructor(props) {
    super(props);
    this.typeInfo = getTypeInfo(props.type);
    this.state = {
      hasError: false,
      value: this.getTransformer().format(props.value)
    };
  }

  getTransformer() {
    return this.props.options.transformer || this.constructor.defaultTransformer;
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
    const value = this.getTransformer().parse(this.state.value);
    const result = t.validate(value, this.props.type, this.props.ctx.path);
    this.setState({hasError: !result.isValid()});
    return result;
  }

  getDefaultLabel() {
    const ctx = this.props.ctx;
    if (ctx.label) {
      return ctx.label + (this.typeInfo.isMaybe ? ctx.i18n.optional : '');
    }
  }

  getLabel() {
    const ctx = this.props.ctx;
    const legend = this.props.options.legend;
    let label = this.props.options.label;
    label = label || legend;
    if (Nil.is(label) && ctx.auto === 'labels') {
      label = this.getDefaultLabel();
    }
    return label;
  }

  getError() {
    const error = this.props.options.error;
    return t.Func.is(error) ? error(this.state.value) : error;
  }

  hasError() {
    return this.props.options.hasError || this.state.hasError;
  }

  getConfig() {
    return merge(this.props.ctx.config, this.props.options.config);
  }

  getLocals() {

    const options = this.props.options;
    const value = this.state.value;
    const locals = {
      path: this.props.ctx.path,
      error: this.getError(),
      hasError: this.hasError(),
      label: this.getLabel(),
      onChange: this.onChange.bind(this),
      config: this.getConfig(),
      value,
      disabled: options.disabled,
      help: options.help
    };

    this.constructor.locals.forEach(({name, method}) => {
      locals[name] = this[method].call(this);
    });

    return locals;
  }

  render() {
    log('rendering %s', this.constructor.name);
    const locals = this.getLocals();
    t.assert(t.Func.is(this.getTemplate), `[${SOURCE}] missing getTemplate method of component ${this.constructor.name}`);
    const template = this.getTemplate();
    return compile(template(locals));
  }

}

@annotations.attrs
@annotations.placeholder
@annotations.template('textbox')
export class Textbox extends Component {

  static defaultTransformer = {
    format: value => Nil.is(value) ? null : value,
    parse: value => (t.Str.is(value) && value.trim() === '') || Nil.is(value) ? null : value
  };

  static numberTransformer = {
    format: value => Nil.is(value) ? null : String(value),
    parse: value => {
      const n = parseFloat(value);
      const isNumeric = (value - n + 1) >= 0;
      return isNumeric ? n : value;
    }
  };

  getTransformer() {
    const options = this.props.options;
    return options.transformer ? options.transformer :
      this.typeInfo.innerType === t.Num ? Textbox.numberTransformer :
      Textbox.defaultTransformer
  }

  getLocals() {
    const locals = super.getLocals();
    locals.type = this.props.options.type || 'text';
    return locals;
  }

}

@annotations.attrs
@annotations.template('checkbox')
export class Checkbox extends Component {

  static defaultTransformer = {
    format: value => Nil.is(value) ? false : value,
    parse: value => value
  };

  getLocals() {
    const locals = super.getLocals();
    // checkboxes must always have a label
    locals.label = locals.label || this.getDefaultLabel();
    return locals;
  }

}

@annotations.attrs
@annotations.template('select')
export class Select extends Component {

  static defaultTransformer = (nullOption) => {
    return {
      format: value => Nil.is(value) && nullOption ? nullOption.value : value,
      parse: value => nullOption && nullOption.value === value ? null : value
    };
  };

  static multipleTransformer = {
    format: value => Nil.is(value) ? [] : value,
    parse: value => value
  };

  getTransformer() {
    const options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    if (this.isMultiple()) {
      return Select.multipleTransformer;
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
    const options = this.props.options;
    const items = options.options ? options.options.slice() : getOptionsOfEnum(this.getEnum());
    if (options.order) {
      items.sort(getComparator(options.order));
    }
    const nullOption = this.getNullOption();
    if (options.nullOption !== false) {
      items.unshift(nullOption);
    }
    return items;
  }

  getLocals() {
    const locals = super.getLocals();
    locals.options = this.getOptions();
    locals.isMultiple = this.isMultiple();
    return locals;
  }

}

@annotations.attrs
@annotations.template('radio')
export class Radio extends Component {

  getOptions() {
    const options = this.props.options;
    const items = options.options ? options.options.slice() : getOptionsOfEnum(this.typeInfo.innerType);
    if (options.order) {
      items.sort(getComparator(options.order));
    }
    return items;
  }

  getLocals() {
    const locals = super.getLocals();
    locals.options = this.getOptions();
    return locals;
  }

}

export class Struct extends Component {

  static defaultTransformer = {
    format: value => Nil.is(value) ? {} : value,
    parse: value => value
  };

  validate() {

    let value = {};
    let errors = [];
    let hasError = false;
    let result;

    for (let ref in this.refs) {
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

    this.setState({hasError: hasError});
    return new t.ValidationResult({errors, value});
  }

  onChange(fieldName, fieldValue, path) {
    const value = t.mixin({}, this.state.value);
    value[fieldName] = fieldValue;
    this.setState({value}, function () {
      this.props.onChange(value, path);
    }.bind(this));
  }

  getTemplates() {
    return merge(this.props.ctx.templates, this.props.options.templates);
  }

  getTemplate() {
    return this.props.options.template || this.getTemplates().struct;
  }

  getTypeProps() {
    return this.typeInfo.innerType.meta.props;
  }

  getOrder() {
    return this.props.options.order || Object.keys(this.getTypeProps());
  }

  getInputs() {

    const { options, ctx } = this.props;
    const props = this.getTypeProps();
    const auto = options.auto || ctx.auto;
    const i18n = options.i18n || ctx.i18n;
    const config = this.getConfig();
    const templates = this.getTemplates();
    const value = this.state.value;
    const inputs = {};

    for (let prop in props) {
      if (props.hasOwnProperty(prop)) {
        const propType = props[prop];
        const propOptions = options.fields && options.fields[prop] ? options.fields[prop] : nooptions;
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
    const options = this.props.options;
    const locals = super.getLocals();
    locals.order = this.getOrder();
    locals.inputs = this.getInputs();
    return locals;
  }

}

function toSameLength(value, keys) {
  if (value.length === keys.length) { return keys; }
  const ret = [];
  for (let i = 0, len = value.length ; i < len ; i++ ) {
    ret[i] = keys[i] || uuid();
  }
  return ret;
}

export class List extends Component {

  static defaultTransformer = {
    format: value => Nil.is(value) ? [] : value,
    parse: value => value
  };

  constructor(props) {
    super(props);
    this.state.keys = this.state.value.map(uuid);
  }

  componentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.typeInfo = getTypeInfo(props.type);
    }
    const value = this.getTransformer().format(props.value);
    this.setState({
      value,
      keys: toSameLength(value, this.state.keys)
    });
  }

  validate() {

    const value = [];
    let errors = [];
    let hasError = false;
    let result;

    for (let i = 0, len = this.state.value.length ; i < len ; i++ ) {
      result = this.refs[i].validate();
      errors = errors.concat(result.errors);
      value.push(result.value);
    }

    // handle subtype
    if (this.typeInfo.isSubtype && errors.length === 0) {
      result = t.validate(value, this.props.type, this.props.ctx.path);
      hasError = !result.isValid();
      errors = errors.concat(result.errors);
    }

    this.setState({hasError: hasError});
    return new t.ValidationResult({errors: errors, value: value});
  }

  onChange(value, keys, path) {
    this.setState({value, keys: toSameLength(value, keys)}, () => {
      this.props.onChange(value, path || this.props.ctx.path);
    });
  }

  addItem(evt) {
    evt.preventDefault();
    const value = this.state.value.concat(undefined);
    const keys = this.state.keys.concat(uuid());
    this.onChange(value, keys, this.props.ctx.path.concat(value.length - 1));
  }

  onItemChange(itemIndex, itemValue, path) {
    const value = this.state.value.slice();
    value[itemIndex] = itemValue;
    this.onChange(value, this.state.keys, path);
  }

  removeItem(i, evt) {
    evt.preventDefault();
    const value = this.state.value.slice();
    value.splice(i, 1);
    const keys = this.state.keys.slice();
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
    return this.props.options.template || this.getTemplates().list;
  }

  getI81n() {
    return this.props.options.i18n || this.props.ctx.i18n;
  }

  getItems() {

    const { options, ctx } = this.props;
    const auto = options.auto || ctx.auto;
    const i18n = this.getI81n();
    const config = this.getConfig();
    const templates = this.getTemplates();
    const value = this.state.value;
    const type = this.typeInfo.innerType.meta.type;
    const Component = getComponent(type, options.item || nooptions);
    return value.map((value, i) => {
      const buttons = [];
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

    const options = this.props.options;
    const i18n = this.getI81n();
    const locals = super.getLocals();
    locals.add = options.disableAdd ? null : {
      label: i18n.add,
      click: this.addItem.bind(this)
    };
    locals.items = this.getItems();
    return locals;
  }

}

export class Form {

  getValue(raw) {
    const result = this.refs.input.validate();
    return raw === true ? result :
      result.isValid() ? result.value :
      null;
  }

  getComponent(path) {
    path = t.Str.is(path) ? path.split('.') : path;
    return path.reduce((input, name) => input.refs[name], this.refs.input);
  }

  render() {

    let options = this.props.options;
    const type = this.props.type;
    const { i18n, templates } = Form;

    options = options || nooptions;

    t.assert(t.Type.is(type), `[${SOURCE}] missing required prop type`);
    t.assert(t.Obj.is(options), `[${SOURCE}] prop options must be an object`);
    t.assert(t.Obj.is(templates), `[${SOURCE}] missing templates config`);
    t.assert(t.Obj.is(i18n), `[${SOURCE}] missing i18n config`);

    const Component = getComponent(type, options);

    return React.createElement(Component, {
      ref: 'input',
      type: type,
      options: options,
      value: this.props.value,
      onChange: this.props.onChange || noop,
      ctx: this.props.ctx || {
        auto: 'labels',
        templates,
        i18n,
        path: []
      }
    });
  }

}

export class Dict extends Component {

  static defaultTransformer = {
    format: value => {
      if (t.Arr.is(value)) { return value; }
      value = value || {};
      const result = [];
      for (let key in value) {
        if (value.hasOwnProperty(key)) {
          result.push({domain: key, codomain: value[key]});
        }
      }
      return result;
    },
    parse: value => {
      const result = {};
      value.forEach(({domain, codomain}) => result[domain] = codomain);
      return result;
    }
  };

  validate() {
    const result = this.refs.form.getValue(true);
    if (!result.isValid()) { return result; }
    return super.validate();
  }

  getTemplate() {
    return () => {
      const Type = t.list(t.struct({
        domain: this.typeInfo.innerType.meta.domain,
        codomain: this.typeInfo.innerType.meta.codomain
      }));
      return <Form
        ref="form"
        type={Type}
        options={this.props.options}
        onChange={this.onChange.bind(this)}
        value={this.state.value}
        ctx={this.props.ctx}
      />;
    };
  }

  getLocals() {}

}

export class Tuple extends Component {

  static defaultTransformer = (dict) => {
    return {
      format: value => value,
      parse: value => {
        const result = [];
        dict.meta.types.forEach((type, i) => result.push(value[i]));
        return result;
      }
    };
  };

  getTransformer() {
    const options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    return Tuple.defaultTransformer(this.typeInfo.innerType);
  }

  validate() {
    const result = this.refs.form.getValue(true);
    if (!result.isValid()) { return result; }
    return super.validate();
  }

  getTemplate() {
    return () => {
      const props = {};
      this.typeInfo.innerType.meta.types.forEach((type, i) => {
        props[i] = type;
      });
      const Type = t.struct(props);
      return <Form
        ref="form"
        type={Type}
        options={this.props.options}
        onChange={this.onChange.bind(this)}
        value={this.state.value}
        ctx={this.props.ctx}
      />;
    };
  }

  getLocals() {}

}


'use strict';

var React = require('react');
var t = require('tcomb-validation');
var compile = require('uvdom/react').compile;
var $__0=
  
  
  
  
  
  
  require('./util'),humanize=$__0.humanize,merge=$__0.merge,getTypeInfo=$__0.getTypeInfo,getOptionsOfEnum=$__0.getOptionsOfEnum,uuid=$__0.uuid,move=$__0.move;

var Nil = t.Nil;
var SOURCE = 'tcomb-form';
var nooptions = Object.freeze({});
var noop = function()  {};

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
      t.fail(("[" + SOURCE + "] unsupported type " + name));
  }
}

function sortByText(a, b) {
  return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
}

function getComparator(order) {
  return {
    asc: sortByText,
    desc: function(a, b)  {return -sortByText(a, b);}
  }[order];
}

var ____Class5=React.Component;for(var ____Class5____Key in ____Class5){if(____Class5.hasOwnProperty(____Class5____Key)){Component[____Class5____Key]=____Class5[____Class5____Key];}}var ____SuperProtoOf____Class5=____Class5===null?null:____Class5.prototype;Component.prototype=Object.create(____SuperProtoOf____Class5);Component.prototype.constructor=Component;Component.__superConstructor__=____Class5;

  function Component(props) {
    ____Class5.call(this,props);
    this.typeInfo = getTypeInfo(props.type);
    this.state = {
      hasError: false,
      value: this.getTransformer().format(props.value)
    };
  }

  Object.defineProperty(Component.prototype,"getTransformer",{writable:true,configurable:true,value:function() {
    return this.props.options.transformer || Component.defaultTransformer;
  }});

  Object.defineProperty(Component.prototype,"shouldComponentUpdate",{writable:true,configurable:true,value:function(nextProps, nextState) {
    return nextState.value !== this.state.value ||
      nextState.hasError !== this.state.hasError ||
      nextProps.value !== this.props.value ||
      nextProps.options !== this.props.options ||
      nextProps.type !== this.props.type;
  }});

  Object.defineProperty(Component.prototype,"componentWillReceiveProps",{writable:true,configurable:true,value:function(props) {
    if (props.type !== this.props.type) {
      this.typeInfo = getTypeInfo(props.type);
    }
    this.setState({value: this.getTransformer().format(props.value)});
  }});

  Object.defineProperty(Component.prototype,"onChange",{writable:true,configurable:true,value:function(value) {
    this.setState({value:value}, function()  {
      this.props.onChange(value, this.props.ctx.path);
    }.bind(this));
  }});

  Object.defineProperty(Component.prototype,"getValue",{writable:true,configurable:true,value:function() {
    var result = this.validate();
    this.setState({hasError: !result.isValid()});
    return result;
  }});

  Object.defineProperty(Component.prototype,"validate",{writable:true,configurable:true,value:function() {
    var value = this.getTransformer().parse(this.state.value);
    return t.validate(value, this.props.type, this.props.ctx.path);
  }});

  Object.defineProperty(Component.prototype,"getDefaultLabel",{writable:true,configurable:true,value:function() {
    var ctx = this.props.ctx;
    if (ctx.label) {
      return ctx.label + (this.typeInfo.isMaybe ? ctx.i18n.optional : '');
    }
  }});

  Object.defineProperty(Component.prototype,"getLabel",{writable:true,configurable:true,value:function() {
    var $__0=         this.props,$__1=$__0.options,label=$__1.label,legend=$__1.legend,ctx=$__0.ctx;
    label = label || legend;
    if (Nil.is(label) && ctx.auto === 'labels') {
      label = this.getDefaultLabel();
    }
    return label;
  }});

  Object.defineProperty(Component.prototype,"getPlaceholder",{writable:true,configurable:true,value:function() {
    var $__0=        this.props,$__1=$__0.options,placeholder=$__1.placeholder,ctx=$__0.ctx;
    if (Nil.is(placeholder) && ctx.auto === 'placeholders') {
      placeholder = this.getDefaultLabel();
    }
    return placeholder;
  }});

  Object.defineProperty(Component.prototype,"getError",{writable:true,configurable:true,value:function() {
    var error = this.props.options.error;
    return t.Func.is(error) ? error(this.state.value) : error;
  }});

  Object.defineProperty(Component.prototype,"hasError",{writable:true,configurable:true,value:function() {
    return this.props.options.hasError || this.state.hasError;
  }});

  Object.defineProperty(Component.prototype,"getAttrs",{writable:true,configurable:true,value:function() {
    var attrs = t.mixin({}, this.props.options.attrs);
    attrs.id = attrs.id || this.$Component_rootNodeID || uuid();
    attrs.name = attrs.name || this.props.ctx.name || attrs.id;
    if (t.Str.is(attrs.className)) { attrs.className = [attrs.className]; }
    if (t.Arr.is(attrs.className)) {
      attrs.className = attrs.className.reduce(function(acc, x)  {
        acc[x] = true;
        return acc;
      }, {});
    }
    return attrs;
  }});

  Object.defineProperty(Component.prototype,"getConfig",{writable:true,configurable:true,value:function() {
    return merge(this.props.ctx.config, this.props.options.config);
  }});

  Object.defineProperty(Component.prototype,"getLocals",{writable:true,configurable:true,value:function() {

    var options = this.props.options;
    var value = this.state.value;
    var locals = {
      error: this.getError(),
      hasError: this.hasError(),
      label: this.getLabel(),
      onChange: this.onChange.bind(this),
      placeholder: this.getPlaceholder(),
      attrs: this.getAttrs(),
      config: this.getConfig(),
      value:value
    };

    [
      'disabled',
      'help'
    ].forEach(function(name)  {return locals[name] = options[name];});

    return locals;
  }});

  Object.defineProperty(Component.prototype,"render",{writable:true,configurable:true,value:function() {
    var locals = this.getLocals();
    var template = this.getTemplate();
    return compile(template(locals));
  }});



Component.defaultTransformer = {
  format: function(value)  {return Nil.is(value) ? null : value;},
  parse: function(value)  {return value;}
};

for(var Component____Key in Component){if(Component.hasOwnProperty(Component____Key)){Textbox[Component____Key]=Component[Component____Key];}}var ____SuperProtoOfComponent=Component===null?null:Component.prototype;Textbox.prototype=Object.create(____SuperProtoOfComponent);Textbox.prototype.constructor=Textbox;Textbox.__superConstructor__=Component;function Textbox(){if(Component!==null){Component.apply(this,arguments);}}

  Object.defineProperty(Textbox.prototype,"getTransformer",{writable:true,configurable:true,value:function() {
    var options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    if (this.typeInfo.innerType === t.Num) {
      return Textbox.numberTransformer;
    }
    return Textbox.defaultTransformer;
  }});

  Object.defineProperty(Textbox.prototype,"getTemplate",{writable:true,configurable:true,value:function() {
    return this.props.options.template || this.props.ctx.templates.textbox;
  }});

  Object.defineProperty(Textbox.prototype,"getLocals",{writable:true,configurable:true,value:function() {
    var locals = ____SuperProtoOfComponent.getLocals.call(this);
    locals.type = this.props.options.type || 'text';
    return locals;
  }});



Textbox.defaultTransformer = {
  format: function(value)  {return Nil.is(value) ? null : value;},
  parse: function(value)  {return (t.Str.is(value) && value.trim() === '') || Nil.is(value) ? null : value;}
};

Textbox.numberTransformer = {
  format: function(value)  {return Nil.is(value) ? null : String(value);},
  parse: function(value)  {
    var n = parseFloat(value);
    var isNumeric = (value - n + 1) >= 0;
    return isNumeric ? n : value;
  }
};

for(Component____Key in Component){if(Component.hasOwnProperty(Component____Key)){Checkbox[Component____Key]=Component[Component____Key];}}Checkbox.prototype=Object.create(____SuperProtoOfComponent);Checkbox.prototype.constructor=Checkbox;Checkbox.__superConstructor__=Component;function Checkbox(){if(Component!==null){Component.apply(this,arguments);}}

  Object.defineProperty(Checkbox.prototype,"getTransformer",{writable:true,configurable:true,value:function() {
    var options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    return Checkbox.defaultTransformer;
  }});

  Object.defineProperty(Checkbox.prototype,"getTemplate",{writable:true,configurable:true,value:function() {
    return this.props.options.template || this.props.ctx.templates.checkbox;
  }});



Checkbox.defaultTransformer = {
  format: function(value)  {return Nil.is(value) ? false : value;},
  parse: function(value)  {return value;}
};

for(Component____Key in Component){if(Component.hasOwnProperty(Component____Key)){Select[Component____Key]=Component[Component____Key];}}Select.prototype=Object.create(____SuperProtoOfComponent);Select.prototype.constructor=Select;Select.__superConstructor__=Component;function Select(){if(Component!==null){Component.apply(this,arguments);}}

  Object.defineProperty(Select.prototype,"getTransformer",{writable:true,configurable:true,value:function() {
    var options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    return Select.defaultTransformer(this.getNullOption());
  }});

  Object.defineProperty(Select.prototype,"getNullOption",{writable:true,configurable:true,value:function() {
    return this.props.options.nullOption || {value: '', text: '-'};
  }});

  Object.defineProperty(Select.prototype,"isMultiple",{writable:true,configurable:true,value:function() {
    return this.typeInfo.innerType.meta.kind === 'list';
  }});

  Object.defineProperty(Select.prototype,"getEnum",{writable:true,configurable:true,value:function() {
    return this.isMultiple() ? getTypeInfo(this.typeInfo.innerType.meta.type).innerType : this.typeInfo.innerType;
  }});

  Object.defineProperty(Select.prototype,"getOptions",{writable:true,configurable:true,value:function() {
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
  }});

  Object.defineProperty(Select.prototype,"getTemplate",{writable:true,configurable:true,value:function() {
    return this.props.options.template || this.props.ctx.templates.select;
  }});

  Object.defineProperty(Select.prototype,"getLocals",{writable:true,configurable:true,value:function() {
    var locals = ____SuperProtoOfComponent.getLocals.call(this);
    locals.options = this.getOptions();
    locals.attrs.multiple = this.isMultiple();
    return locals;
  }});



Select.defaultTransformer = function(nullOption)  {
  return {
    format: function(value)  {
      return Nil.is(value) && nullOption ? nullOption.value : value;
    },
    parse: function(value)  {
      return nullOption && nullOption.value === value ? null : value;
    }
  };
};

for(Component____Key in Component){if(Component.hasOwnProperty(Component____Key)){Radio[Component____Key]=Component[Component____Key];}}Radio.prototype=Object.create(____SuperProtoOfComponent);Radio.prototype.constructor=Radio;Radio.__superConstructor__=Component;function Radio(){if(Component!==null){Component.apply(this,arguments);}}

  Object.defineProperty(Radio.prototype,"getOptions",{writable:true,configurable:true,value:function() {
    var options = this.props.options;
    var items = options.options ? options.options.slice() : getOptionsOfEnum(this.typeInfo.innerType);
    if (options.order) {
      items.sort(getComparator(options.order));
    }
    return items;
  }});

  Object.defineProperty(Radio.prototype,"getTemplate",{writable:true,configurable:true,value:function() {
    return this.props.options.template || this.props.ctx.templates.radio;
  }});

  Object.defineProperty(Radio.prototype,"getLocals",{writable:true,configurable:true,value:function() {
    var locals = ____SuperProtoOfComponent.getLocals.call(this);
    locals.options = this.getOptions();
    return locals;
  }});



for(Component____Key in Component){if(Component.hasOwnProperty(Component____Key)){Struct[Component____Key]=Component[Component____Key];}}Struct.prototype=Object.create(____SuperProtoOfComponent);Struct.prototype.constructor=Struct;Struct.__superConstructor__=Component;function Struct(){if(Component!==null){Component.apply(this,arguments);}}

  Object.defineProperty(Struct.prototype,"getTransformer",{writable:true,configurable:true,value:function() {
    var options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    return Struct.defaultTransformer;
  }});

  Object.defineProperty(Struct.prototype,"validate",{writable:true,configurable:true,value:function() {

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
      value = new this.typeInfo.innerType(value);
      if (this.typeInfo.isSubtype && errors.length === 0) {
        result = t.validate(value, this.props.type, this.props.ctx.path);
        hasError = !result.isValid();
        errors = errors.concat(result.errors);
      }
    }

    return new t.ValidationResult({errors:errors, value:value});
  }});

  Object.defineProperty(Struct.prototype,"onChange",{writable:true,configurable:true,value:function(fieldName, fieldValue, path) {
    var value = t.mixin({}, this.state.value);
    value[fieldName] = fieldValue;
    this.setState({value:value}, function () {
      this.props.onChange(value, path);
    }.bind(this));
  }});

  Object.defineProperty(Struct.prototype,"getTemplates",{writable:true,configurable:true,value:function() {
    return merge(this.props.ctx.templates, this.props.options.templates);
  }});

  Object.defineProperty(Struct.prototype,"getTemplate",{writable:true,configurable:true,value:function() {
    return this.getTemplates().struct;
  }});

  Object.defineProperty(Struct.prototype,"getTypeProps",{writable:true,configurable:true,value:function() {
    return this.typeInfo.innerType.meta.props;
  }});

  Object.defineProperty(Struct.prototype,"getOrder",{writable:true,configurable:true,value:function() {
    return this.props.options.order || Object.keys(this.getTypeProps());
  }});

  Object.defineProperty(Struct.prototype,"getInputs",{writable:true,configurable:true,value:function() {

    var $__0=     this.props,options=$__0.options,ctx=$__0.ctx;
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
            auto:auto,
            config:config,
            name: ctx.name ? (ctx.name + "[" + prop + "]") : prop,
            label: humanize(prop),
            i18n:i18n,
            templates:templates,
            path: ctx.path.concat(prop)
          }
        });
      }
    }
    return inputs;
  }});

  Object.defineProperty(Struct.prototype,"getLocals",{writable:true,configurable:true,value:function() {

    var options = this.props.options;
    var locals = {
      order: this.getOrder(),
      inputs: this.getInputs(),
      error: this.getError(),
      hasError: this.hasError(),
      legend: this.getLabel()
    };

    [
      'disabled',
      'help'
    ].forEach(function(name)  {return locals[name] = options[name];});

    return locals;
  }});



function toSameLength(value, keys) {
  if (value.length === keys.length) { return keys; }
  var ret = [];
  for (var i = 0, len = value.length ; i < len ; i++ ) {
    ret[i] = keys[i] || uuid();
  }
  return ret;
}

Struct.defaultTransformer = {
  format: function(value)  {return Nil.is(value) ? {} : value;},
  parse: function(value)  {return value;}
};

for(Component____Key in Component){if(Component.hasOwnProperty(Component____Key)){List[Component____Key]=Component[Component____Key];}}List.prototype=Object.create(____SuperProtoOfComponent);List.prototype.constructor=List;List.__superConstructor__=Component;

  function List(props) {
    Component.call(this,props);
    this.state.keys = this.state.value.map(uuid);
  }

  Object.defineProperty(List.prototype,"getTransformer",{writable:true,configurable:true,value:function() {
    var options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    return List.defaultTransformer;
  }});

  Object.defineProperty(List.prototype,"componentWillReceiveProps",{writable:true,configurable:true,value:function(props) {
    if (props.type !== this.props.type) {
      this.typeInfo = getTypeInfo(props.type);
    }
    var value = this.getTransformer().format(props.value);
    this.setState({
      value:value,
      keys: toSameLength(value, this.state.keys)
    });
  }});

  Object.defineProperty(List.prototype,"validate",{writable:true,configurable:true,value:function() {

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
    if (this.typeInfo.subtype && errors.length === 0) {
      result = t.validate(value, this.props.type, this.props.ctx.path);
      hasError = !result.isValid();
      errors = errors.concat(result.errors);
    }

    return new t.ValidationResult({errors: errors, value: value});
  }});

  Object.defineProperty(List.prototype,"onChange",{writable:true,configurable:true,value:function(value, keys, path) {
    this.setState({value:value, keys: toSameLength(value, keys)}, function()  {
      this.props.onChange(value, path || this.props.ctx.path);
    }.bind(this));
  }});

  Object.defineProperty(List.prototype,"addItem",{writable:true,configurable:true,value:function(evt) {
    evt.preventDefault();
    var value = this.state.value.concat(undefined);
    var keys = this.state.keys.concat(uuid());
    this.onChange(value, keys, this.props.ctx.path.concat(value.length - 1));
  }});

  Object.defineProperty(List.prototype,"onItemChange",{writable:true,configurable:true,value:function(itemIndex, itemValue, path) {
    var value = this.state.value.slice();
    value[itemIndex] = itemValue;
    this.onChange(value, this.state.keys, path);
  }});

  Object.defineProperty(List.prototype,"removeItem",{writable:true,configurable:true,value:function(i, evt) {
    evt.preventDefault();
    var value = this.state.value.slice();
    value.splice(i, 1);
    var keys = this.state.keys.slice();
    keys.splice(i, 1);
    this.onChange(value, keys, this.props.ctx.path.concat(i));
  }});

  Object.defineProperty(List.prototype,"moveUpItem",{writable:true,configurable:true,value:function(i, evt) {
    evt.preventDefault();
    if (i > 0) {
      this.onChange(
        move(this.state.value.slice(), i, i - 1),
        move(this.state.keys.slice(), i, i - 1)
      );
    }
  }});

  Object.defineProperty(List.prototype,"moveDownItem",{writable:true,configurable:true,value:function(i, evt) {
    evt.preventDefault();
    if (i < this.state.value.length - 1) {
      this.onChange(
        move(this.state.value.slice(), i, i + 1),
        move(this.state.keys.slice(), i, i + 1)
      );
    }
  }});

  Object.defineProperty(List.prototype,"getTemplates",{writable:true,configurable:true,value:function() {
    return merge(this.props.ctx.templates, this.props.options.templates);
  }});

  Object.defineProperty(List.prototype,"getTemplate",{writable:true,configurable:true,value:function() {
    return this.getTemplates().list;
  }});

  Object.defineProperty(List.prototype,"getI81n",{writable:true,configurable:true,value:function() {
    return this.props.options.i18n || this.props.ctx.i18n;
  }});

  Object.defineProperty(List.prototype,"getItems",{writable:true,configurable:true,value:function() {

    var $__0=     this.props,options=$__0.options,ctx=$__0.ctx;
    var auto = options.auto || ctx.auto;
    var i18n = this.getI81n();
    var config = this.getConfig();
    var templates = this.getTemplates();
    var value = this.state.value;
    var type = this.typeInfo.innerType.meta.type;
    var Component = getComponent(type, options.item || nooptions);
    return value.map(function(value, i)  {
      var buttons = [];
      if (!options.disableRemove) { buttons.push({ label: i18n.remove, click: this.removeItem.bind(this, i) }); }
      if (!options.disableOrder)  { buttons.push({ label: i18n.up, click: this.moveUpItem.bind(this, i) }); }
      if (!options.disableOrder)  { buttons.push({ label: i18n.down, click: this.moveDownItem.bind(this, i) }); }
      return {
        input: React.createElement(Component, {
          ref: i,
          type:type,
          options: options.item || nooptions,
          value:value,
          onChange: this.onItemChange.bind(this, i),
          ctx: {
            auto:auto,
            config:config,
            i18n:i18n,
            name: ctx.name ? (ctx.name + "[" + i + "]") : String(i),
            templates:templates,
            path: ctx.path.concat(i)
          }
        }),
        key: this.state.keys[i],
        buttons: buttons
      };
    }.bind(this));
  }});

  Object.defineProperty(List.prototype,"getLocals",{writable:true,configurable:true,value:function() {

    var options = this.props.options;
    var i18n = this.getI81n();
    var locals = {
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
    ].forEach(function(name)  {return locals[name] = options[name];});

    return locals;
  }});



List.defaultTransformer = {
  format: function(value)  {return Nil.is(value) ? [] : value;},
  parse: function(value)  {return value;}
};

function Form(){}

  Object.defineProperty(Form.prototype,"getValue",{writable:true,configurable:true,value:function(raw) {
    var result = this.refs.input.getValue();
    if (raw === true) { return result; }
    if (result.isValid()) { return result.value; }
    return null;
  }});

  Object.defineProperty(Form.prototype,"render",{writable:true,configurable:true,value:function() {

    var $__0=     this.props,type=$__0.type,options=$__0.options;
    var $__1=     Form,i18n=$__1.i18n,templates=$__1.templates;

    options = options || nooptions;

    t.assert(t.Type.is(type), ("[" + SOURCE + "] missing required prop type"));
    t.assert(t.Obj.is(options), ("[" + SOURCE + "] prop options must be an object"));
    t.assert(t.Obj.is(templates), ("[" + SOURCE + "] missing templates config"));
    t.assert(t.Obj.is(i18n), ("[" + SOURCE + "] missing i18n config"));

    var Component = getComponent(type, options);

    return React.createElement(Component, {
      ref: 'input',
      type: type,
      options: options,
      value: this.props.value,
      onChange: this.props.onChange || noop,
      ctx: {
        auto: 'labels',
        templates:templates,
        i18n:i18n,
        path: []
      }
    });
  }});



module.exports = {
  Component:Component,
  Textbox:Textbox,
  Checkbox:Checkbox,
  Select:Select,
  Radio:Radio,
  Struct:Struct,
  List:List,
  Form:Form
};
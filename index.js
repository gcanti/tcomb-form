/** @jsx React.DOM */

'use strict';

/*

  System A

  Input(type: Type, opts(A): maybe(Obj))
  input.render() -> A
  input.getValue(depth: maybe(Num)) -> validate.Result | type

*/

var React = require('react');
var cx =    require('react/lib/cx');
var t =     require('tcomb-validation');

var assert =      t.assert;
var Any =         t.Any;
var Nil =         t.Nil;
var Str =         t.Str;
var Bool =        t.Bool;
var Obj =         t.Obj;
var Arr =         t.Arr;
var Func =        t.Func;
var irriducible = t.irriducible;
var subtype =     t.subtype;
var maybe =       t.maybe;
var enums =       t.enums;
var list =        t.list;
var struct =      t.struct;
var func =        t.func;
var mixin =       t.util.mixin;
var isType =      t.util.isType;
var getKind =     t.util.getKind;
var getName =     t.util.getName;
var Result =      t.validate.Result;

var Type = irriducible('Type', isType);

// represents an order (asc or desc)
var Order = enums({
  asc: function (a, b) {
    return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
  },
  desc: function (a, b) {
    return a.text < b.text ? 1 : a.text > b.text ? -1 : 0;
  }
}, 'Order');

var I17n = struct({
  format: Func,
  parse:  Func
}, 'I17n');

// represents an <option>
var Option = struct({
  value:  Str,
  text:   Str
}, 'Option');

//
// utils
//

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

function stripMaybeOrSubtype(type) {
  var kind = getKind(type);
  if (kind === 'maybe' || kind === 'subtype') {
    return stripMaybeOrSubtype(type.meta.type);
  }
  return type;
}

function merge() {
  return Array.prototype.reduce.call(arguments, function (x, y) {
    return mixin(x, y, true);
  }, {});
}

function getOrElse(value, defaultValue) {
  return Nil.is(value) ? defaultValue : value;
}

function getLabel(label) {
  return label ? React.DOM.label({className: "control-label label-class"}, label) : null;
}

function getHelp(help) {
  return help ? React.DOM.span({className: "help-block"}, help) : null;
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

function remove(arr, index) {
  var ret = arr.slice();
  ret.splice(index, 1);
  return ret;
}

function move(arr, from, to) {
  var ret = arr.slice();
  if (from === to) {
    return ret;
  }
  var element = ret.splice(from, 1)[0];
  ret.splice(to, 0, element);
  return ret;
}

function moveUp(arr, i) {
  return move(arr, i, i - 1);
}

function moveDown(arr, i) {
  return move(arr, i, i + 1);
}

function getChoices(map, order, emptyChoice) {
  var choices = Object.keys(map).map(function (value, i) {
    return {value: value, text: map[value]};
  });
  // apply an order (asc, desc) to options
  choices.sort(Order.meta.map[order] || 'asc');
  if (emptyChoice) {
    // add an empty choice to the beginning
    choices.unshift(emptyChoice);
  }
  return choices;
}

// returns the list of options of a select
function getOptions(map, order, emptyOption) {
  var choices = getChoices(map, order, emptyOption);
  return choices.map(function (c, i) {
    return React.DOM.option({key: i, value: c.value}, c.text);
  });
}

function getInput(type) {
  type = stripMaybeOrSubtype(type);
  var kind = getKind(type);
  var ret = options[kind];
  if (Func.is(ret)) {
    return ret;
  }
  ret = ret[getName(type)];
  if (Func.is(ret)) {
    return ret;
  }
  return textbox;
}

function getInitialState() {
  return { hasError: false };
}

function getValue(type, rawValue) {
  return function () {
    var value = rawValue || this.getRawValue();
    var result = t.validate(value, type);
    var isValid = result.isValid();
    this.setState({hasError: !isValid});
    return isValid ? type(value) : result;
  };
}

function getOptionalLabel(name, optional) {
  name = humanize(name);
  return optional ?
    React.DOM.span(null, name, React.DOM.small({className: "text-muted"}, optional)) :
    React.DOM.span(null, name);
}

//
// textbox
//

// attr `type` of input tag
var TypeAttr = enums.of('text textarea password color date datetime datetime-local email month number range search tel time url week', 'TypeAttr');

function textboxOpts(type) {
  return struct({
    type:         maybe(TypeAttr),
    value:        maybe(type),
    label:        Any,
    help:         Any,
    groupClasses: maybe(Obj),
    placeholder:  maybe(Str),
    i17n:         maybe(I17n)
  }, 'TextboxOpts');
}

function textbox(type, opts) {

  assert(isType(type));

  opts = new (textboxOpts(type))(opts || {});

  var defaultValue = getOrElse(opts.value, null);
  if (opts.i17n) {
    defaultValue = opts.i17n.format(defaultValue);
  }

  var label = getLabel(opts.label);
  var help = getHelp(opts.help);

  return React.createClass({
    
    displayName: 'Textbox',
    
    getInitialState: getInitialState,
    
    getRawValue: function () {
      var value = this.refs.input.getDOMNode().value.trim() || null;
      if (opts.i17n) {
        value = opts.i17n.parse(value);
      }
      return value;
    },
    
    getValue: getValue(type),

    render: function () {

      var groupClasses = mixin({
        'form-group': true,
        'has-error': this.state.hasError
      }, opts.groupClasses);

      var input = opts.type === 'textarea' ? 
        React.DOM.textarea({ref: "input", className: "form-control", defaultValue: defaultValue, placeholder: opts.placeholder}) :
        React.DOM.input({ref: "input", className: "form-control", type: opts.type || 'text', defaultValue: defaultValue, placeholder: opts.placeholder});

      return (
        React.DOM.div({className: cx(groupClasses)}, 
          label, 
          input, 
          help
        )
      );
    }

  });

}

//
// select
//

// select accepts only enums or maybe(enums)
var EnumType = subtype(Type, function (type) {
  var kind = getKind(type);
  if (kind === 'enums') {
    return true;
  }
  return kind === 'maybe' && getKind(type.meta.type) === 'enums';
}, 'EnumType');

function selectOpts(type) {
  return struct({
    value:        maybe(type),
    label:        Any,
    help:         Any, 
    groupClasses: maybe(Obj),
    emptyOption:  maybe(Option),
    order:        maybe(Order)
  }, 'SelectOpts');
}

function select(type, opts) {

  type = EnumType(type);
  opts = new (selectOpts(type))(opts || {});

  var Enum = stripMaybeOrSubtype(type);
  var emptyValue = opts.emptyOption ? opts.emptyOption.value : null;
  var defaultValue = getOrElse(opts.value, emptyValue);
  var label = getLabel(opts.label);
  var help = getHelp(opts.help);
  var options = getOptions(Enum.meta.map, opts.order, opts.emptyOption);

  return React.createClass({
    
    displayName: 'Select',
    
    getInitialState: getInitialState,
    
    getRawValue: function () {
      var value = this.refs.input.getDOMNode().value;
      return value === emptyValue ? null : value;
    },
    
    getValue: getValue(type),

    render: function () {

      var groupClasses = mixin({
        'form-group': true,
        'has-error': this.state.hasError
      }, opts.groupClasses);

      return (
        React.DOM.div({className: cx(groupClasses)}, 
          label, 
          React.DOM.select({ref: "input", className: "form-control", defaultValue: defaultValue}, 
            options
          ), 
          help
        )
      );
    }

  });

}

//
// radio
//

function radioOpts(type) {
  return struct({
    value:        Any,
    label:        Any,
    help:         Any, 
    groupClasses: maybe(Obj),
    order:        maybe(Order)
  }, 'RadioOpts');
}

function radio(type, opts) {

  type = EnumType(type);
  opts = new (radioOpts(type))(opts || {});

  var Enum = stripMaybeOrSubtype(type);
  var defaultValue = getOrElse(opts.value, null);
  var label = getLabel(opts.label);
  var help = getHelp(opts.help);
  var choices = getChoices(Enum.meta.map, opts.order);
  var len = choices.length;
  var name = uuid();

  return React.createClass({
    
    displayName: 'Radio',
    
    getInitialState: getInitialState,
    
    getRawValue: function () {
      var value = null;
      for (var i = 0 ; i < len ; i++ ) {
        var node = this.refs[name + i].getDOMNode();
        if (node.checked) {
          value = node.value;
          break;
        }
      }
      return value;
    },
    
    getValue: getValue(type),

    render: function () {

      var groupClasses = mixin({
        'form-group': true,
        'has-error': this.state.hasError
      }, opts.groupClasses);

      var radios = choices.map(function (c, i) {
        return (
          React.DOM.div({className: "radio", key: i}, 
            React.DOM.label(null, 
              React.DOM.input({type: "radio", ref: name + i, name: name, value: c.value, defaultChecked: c.value === defaultValue}), 
              c.text
            )
          )
        );
      });

      return (
        React.DOM.div({className: cx(groupClasses)}, 
          label, 
          radios, 
          help
        )
      );
    }

  });

}

//
// checkbox
//

// checkbox accepts only Bool, subtypes of Bool
var CheckboxType = subtype(Type, function (type) {
  if (type === Bool) {
    return true;
  }
  return getKind(type) === 'subtype' && type.meta.type === Bool;
}, 'CheckboxType');

function checkboxOpts(type) {
  return struct({
    value:        maybe(type),
    label:        Any,
    help:         Any, 
    groupClasses: maybe(Obj)
  }, 'CheckboxOpts');
}

function checkbox(type, opts) {

  type = CheckboxType(type);
  opts = new (checkboxOpts(type))(opts || {});

  var defaultValue = getOrElse(opts.value, false);
  var help = getHelp(opts.help);

  return React.createClass({
    
    displayName: 'Checkbox',
    
    getInitialState: getInitialState,
    
    getRawValue: function () {
      return this.refs.input.getDOMNode().checked;
    },
    
    getValue: getValue(type),

    render: function () {

      var groupClasses = mixin({
        'form-group': true,
        'has-error': this.state.hasError
      }, opts.groupClasses);

      return (
        React.DOM.div({className: cx(groupClasses)}, 
          React.DOM.div({className: "checkbox"}, 
            React.DOM.label(null, 
              React.DOM.input({ref: "input", type: "checkbox", defaultChecked: defaultValue}), " ", opts.label
            )
          ), 
          help
        )
      );
    }

  });

}

//
// createForm
//

// createForm accepts only structs or subtypes of a struct
var FormType = subtype(Type, function (type) {
  var kind = getKind(type)
  if (kind === 'struct') {
    return true;
  }
  return kind === 'subtype' && getKind(type.meta.type) === 'struct';
}, 'FormType');

var FormAuto = enums.of('none placeholders labels', 'FormAuto');

var FormOpts = struct({
  value:  maybe(Obj),
  label:  Any,
  auto:   maybe(FormAuto),
  order:  maybe(list(Str)),
  fields: maybe(Obj)
}, 'FormOpts');

function createForm(type, opts) {

  type = FormType(type);
  opts = new FormOpts(opts || {});

  var Struct = stripMaybeOrSubtype(type);
  var props = Struct.meta.props;
  var keys = Object.keys(props);
  var order = opts.order || keys;
  var len = order.length;
  assert(keys.length === len, 'Invalid `order` of value `%j` supplied to `createForm`, all type props must be specified', order);
  var fields = opts.fields || {};
  var defaultValue = opts.value || {};
  var label = getLabel(opts.label);

  var auto = opts.auto || 'placeholders';
  var factories = order.map(function (name) {
    var type = props[name];

    // copy opts to preserve the original
    var o = mixin({value: defaultValue[name]}, fields[name]);

    // get the input from the type
    var Input = o.input ? o.input : getInput(type);

    // handle optional fields
    var optional = getKind(type) === 'maybe' ? ' (optional)' : '';

    // lists, forms, checkboxes and radios must always have a label
    if (Input === createList || Input === createForm || Input === checkbox || Input === radio) {
      o.label = o.label || getOptionalLabel(name, optional);
    }

    if (Input === createForm) {
      o.auto = auto;
    } else {

      if (auto === 'labels') {
        o.label = o.label || getOptionalLabel(name, optional);
        if (Input === select) {
          o.emptyOption = o.emptyOption || {value: '', text: '-'};
        }
      } else if (auto === 'placeholders' && !o.label) {
        if (Input === select) {
          o.emptyOption = o.emptyOption || {value: '', text: humanize('Select your ' + name + optional)};
        } else if (Input === textbox) {
          o.placeholder = o.placeholder || humanize(name + optional);
        }
      }

    }

    return Input(type, o);
  });

  return React.createClass({

    displayName: 'Form',

    getInitialState: getInitialState,

    getValue: function (depth) {

      depth = depth || 0;

      var errors = [];
      var value = {};
      var result;
      
      for ( var i = 0 ; i < len ; i++ ) {
        var name = order[i];
        var result = this.refs[name].getValue(depth + 1);
        if (Result.is(result)) {
          errors = errors.concat(result.errors);
        } else {
          value[name] = result;
        }
      }
      if (errors.length) {
        return depth ? new Result({errors: errors}) : null;
      }

      result = t.validate(new Struct(value), type);
      var isValid = result.isValid();
      this.setState({hasError: !isValid});
      return isValid ? type(value) : depth ? result : null;
    },

    render: function () {

      var classes = {
        'form-group': true,
        'has-error': this.state.hasError
      };

      var children = order.map(function (name, i) {
        return factories[i]({key: i, ref: name});
      });

      return (
        React.DOM.div({className: cx(classes)}, 
          label, 
          children
        )
      );
    }

  });

}

//
// list
//

// createList accepts only lists or subtypes of a lists
var ListType = subtype(Type, function (type) {
  var kind = getKind(type)
  if (kind === 'list') {
    return true;
  }
  return kind === 'subtype' && getKind(type.meta.type) === 'list';
}, 'ListType');

var ListOpts = struct({
  value: maybe(Arr),
  label: Any
}, 'ListOpts');

function createList(type, opts) {

  type = ListType(type);
  opts = new ListOpts(opts || {});

  var List = stripMaybeOrSubtype(type);
  var ItemType = stripMaybeOrSubtype(List.meta.type);
  var Input = opts.input || getInput(ItemType);
  var defaultValue = getOrElse(opts.value, []);
  var label = getLabel(opts.label);

  return React.createClass({

    displayName: 'List',

    getInitialState: function () {
      return { hasError: false, value: defaultValue };
    },

    getValue: function (depth) {

      depth = depth || 0;

      var errors = [];
      var value = [];
      var result;
      
      for ( var i = 0, len = this.state.value.length ; i < len ; i++ ) {
        var result = this.refs[i].getValue(depth + 1);
        if (Result.is(result)) {
          errors = errors.concat(result.errors);
        } else {
          value.push(result);
        }
      }
      if (errors.length) {
        return depth ? new Result({errors: errors}) : null;
      }

      result = t.validate(value, type);
      var isValid = result.isValid();
      this.setState({hasError: !isValid, value: value});
      return isValid ? type(value) : depth ? result : null;
    },

    add: function (evt) {
      evt.preventDefault();
      var value = this.state.value.concat(null);
      this.setState({hasError: this.state.hasError, value: value});
    },

    remove: function (i, evt) {
      evt.preventDefault();
      var value = remove(this.state.value, i);
      this.setState({hasError: this.state.hasError, value: value});
    },

    moveUp: function (i, evt) {
      evt.preventDefault();
      if (i > 0) {
        var value = moveUp(this.state.value, i);
        this.setState({hasError: this.state.hasError, value: value});
      }
    },

    moveDown: function (i, evt) {
      evt.preventDefault();
      if (i < this.state.value.length - 1) {
        var value = moveDown(this.state.value, i);
        this.setState({hasError: this.state.hasError, value: value});
      }
    },

    render: function () {

      var classes = {
        'form-group': true,
        'has-error': this.state.hasError
      };

      var children = [];
      for ( var i = 0, len = this.state.value.length ; i < len ; i++ ) {
        var o = {value: this.state.value[i]};
        children.push(
          React.DOM.div({className: "row"}, 
            React.DOM.div({className: "col-md-7"}, 
              Input(ItemType, o)({key: i, ref: i})
            ), 
            React.DOM.div({className: "col-md-5"}, 
              React.DOM.div({className: "btn-group"}, 
                React.DOM.button({className: "btn btn-default", onClick: this.remove.bind(this, i)}, "Remove"), 
                React.DOM.button({className: "btn btn-default", onClick: this.moveUp.bind(this, i)}, "Up"), 
                React.DOM.button({className: "btn btn-default", onClick: this.moveDown.bind(this, i)}, "Down")
              )
            )
          )
        );
      }

      return (
        React.DOM.div({className: cx(classes)}, 
          label, 
          children, 
          React.DOM.div({className: "form-group"}, 
            React.DOM.button({className: "btn btn-default", onClick: this.add}, "Add")
          )
        )
      );
    }

  });

}

var options = {
  irriducible: {
    Bool: checkbox
  },
  enums: select,
  struct: createForm,
  list: createList
};

t.form = {
  options: options,
  util: {
    humanize: humanize
  },
  textbox: textbox,
  Option: Option,
  select: select,
  radio: radio,
  checkbox: checkbox,
  createForm: createForm,
  createList: createList
};

module.exports = t;


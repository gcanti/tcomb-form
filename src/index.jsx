/** @jsx React.DOM */

'use strict';

/*

  System A

  Input(type: Type, opts(A): maybe(Obj))
  input.render() -> A
  input.getRawValue() -> Any
  input.getValue() -> validate.Result | type
  input.setErrors(errors: maybe(list(Err)))

*/

var React = require('react');
var cx =    require('react/lib/cx');
var t =     require('tcomb-validation');

var assert = t.assert;
var Any = t.Any;
var Nil = t.Nil;
var Str = t.Str;
var Bool = t.Bool;
var Obj = t.Obj;
var Func = t.Func;
var irriducible = t.irriducible;
var maybe = t.maybe;
var enums = t.enums;
var list = t.list;
var struct = t.struct;
var func = t.func;
var mixin = t.util.mixin;
var isType = t.util.isType;
var getKind = t.util.getKind;
var getName = t.util.getName;
var Result = t.validate.Result;

//
// domain
//

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

// attr `type` of input tag
var TypeAttr = enums.of('text textarea password color date datetime datetime-local email month number range search tel time url week', 'TypeAttr');

var TextboxOpts = struct({
  type:         maybe(TypeAttr),
  value:        Any,
  label:        Any,
  help:         Any,
  groupClasses: maybe(Obj),
  placeholder:  maybe(Str),
  i17n:         maybe(I17n)
}, 'TextboxOpts');

// select accepts only enums
var EnumType = irriducible('EnumType', function (type) {
  return isType(type) && getKind(stripMaybeOrSubtype(type)) === 'enums';
});

var SelectOpts = struct({
  value:        Any,
  label:        Any,
  help:         Any, 
  groupClasses: maybe(Obj),
  emptyOption:  maybe(Option),
  order:        maybe(Order)
}, 'SelectOpts');

var RadioOpts = struct({
  value:        Any,
  label:        Any,
  help:         Any, 
  groupClasses: maybe(Obj),
  order:        maybe(Order)
}, 'RadioOpts');

// checkbox accepts only Bool, subtypes of Str or maybe of Str
var CheckboxType = irriducible('CheckboxType', function (type) {
  return isType(type) && stripMaybeOrSubtype(type) === Bool;
});

var CheckboxOpts = struct({
  value:        Any,
  label:        Any,
  help:         Any, 
  groupClasses: maybe(Obj)
}, 'CheckboxOpts');

// form accepts only structs or subtypes of a struct
var FormType = irriducible('FormType', function (type) {
  return isType(type) && getKind(stripMaybeOrSubtype(type)) === 'struct';
});

var FormAuto = enums.of('none placeholders labels', 'FormAuto');

var FormOpts = struct({
  auto:   maybe(FormAuto),
  order:  maybe(list(Str)),
  fields: maybe(Obj),
  value:  Any
});

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
  return label ? <label className="control-label label-class">{label}</label> : null;
}

function getHelp(help) {
  return help ? <span className="help-block">{help}</span> : null;
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
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
    return <option key={i} value={c.value}>{c.text}</option>;
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

function setErrors(errors) {
  var hasError = !Nil.is(errors);
  if (hasError !== this.state.hasError) {
    this.setState({ hasError: hasError });
  }
}

function getValue(type) {
  return function () {
    var value = this.getRawValue();
    var result = t.validate(value, type);
    this.setErrors(result.errors);
    return result.isValid() ? type(value) : result;
  };
}

function getOptionalLabel(name, optional) {
  name = humanize(name);
  return optional ?
    <span>{name}<small className="text-muted">{optional}</small></span> :
    <span>{name}</span>;
}

//
// textbox
//

var textbox = func([Any, maybe(TextboxOpts)], function (type, opts) {

  opts = opts || {};

  var defaultValue = getOrElse(opts.value, '');
  if (opts.i17n) {
    defaultValue = opts.i17n.format(defaultValue);
  }

  var label = getLabel(opts.label);
  var help = getHelp(opts.help);

  return React.createClass({
    
    displayName: 'Textbox',
    
    getInitialState: getInitialState,
    
    setErrors: setErrors,
    
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
        <textarea ref="input" className="form-control" defaultValue={defaultValue} placeholder={opts.placeholder}/> :
        <input ref="input" className="form-control" type={opts.type || 'text'} defaultValue={defaultValue} placeholder={opts.placeholder}/>;

      return (
        <div className={cx(groupClasses)}>
          {label}
          {input}
          {help}
        </div>
      );
    }

  });

});

//
// select
//

var select = func([EnumType, maybe(SelectOpts)], function (type, opts) {

  opts = opts || {};
  var emptyValue = opts.emptyOption ? opts.emptyOption.value : '';
  var defaultValue = getOrElse(opts.value, emptyValue);
  var label = getLabel(opts.label);
  var help = getHelp(opts.help);
  var options = getOptions(stripMaybeOrSubtype(type).meta.map, opts.order, opts.emptyOption);

  return React.createClass({
    
    displayName: 'Select',
    
    getInitialState: getInitialState,
    
    setErrors: setErrors,
    
    getRawValue: function () {
      return this.refs.input.getDOMNode().value.trim() || null;
    },
    
    getValue: getValue(type),

    render: function () {

      var groupClasses = mixin({
        'form-group': true,
        'has-error': this.state.hasError
      }, opts.groupClasses);

      return (
        <div className={cx(groupClasses)}>
          {label}
          <select ref="input" className="form-control" defaultValue={defaultValue}>
            {options}
          </select>
          {help}
        </div>
      );
    }

  });

});

//
// radio
//

var radio = func([EnumType, maybe(RadioOpts)], function (type, opts) {

  opts = opts || {};
  var defaultValue = getOrElse(opts.value, '');
  var label = getLabel(opts.label);
  var help = getHelp(opts.help);
  var choices = getChoices(stripMaybeOrSubtype(type).meta.map, opts.order);
  var len = choices.length;
  var name = uuid();

  return React.createClass({
    
    displayName: 'Radio',
    
    getInitialState: getInitialState,
    
    setErrors: setErrors,
    
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
          <div className="radio" key={i}>
            <label>
              <input type="radio" ref={name + i} name={name} value={c.value} defaultChecked={c.value === defaultValue}></input>
              {c.text}
            </label>
          </div>
        );
      });

      return (
        <div className={cx(groupClasses)}>
          {label}
          {radios}
          {help}
        </div>
      );
    }

  });

});

//
// checkbox
//

var checkbox = func([CheckboxType, maybe(CheckboxOpts)], function (type, opts) {

  opts = opts || {};
  var defaultValue = getOrElse(opts.value, false);
  var help = getHelp(opts.help);

  return React.createClass({
    
    displayName: 'Checkbox',
    
    getInitialState: getInitialState,
    
    setErrors: setErrors,
    
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
        <div className={cx(groupClasses)}>
          <div className="checkbox">
            <label>
              <input ref="input" type="checkbox" defaultChecked={defaultValue}/> {opts.label}
            </label>
          </div>
          {help}
        </div>
      );
    }

  });

});

//
// form
//

var form = func([FormType, maybe(FormOpts)], function (type, opts) {

  opts = opts || {};
  var props = stripMaybeOrSubtype(type).meta.props;
  var auto = opts.auto || 'placeholders';
  var keys = Object.keys(props);
  var order = opts.order || keys;
  assert(keys.length === order.length, 'Invalid `order` of value `%j` supplied to `form`, all type props must be specified', order);
  var fields = opts.fields || {};
  var value = opts.value || {};

  var factories = order.map(function (name) {
    var type = props[name];

    // copy opts to preserve original
    var o = mixin({value: value[name]}, fields[name]);

    // get the input from the type
    var Input = o.input ? o.input : getInput(type);

    if (Input === form) {
      // sub form
      o.auto = auto
    } else {

      // handle optional fields
      var optional = getKind(type) === 'maybe' ? ' (optional)' : '';

      // checkboxes and radios need always a label
      if (Input === checkbox || Input === radio) {
        o.label = o.label || getOptionalLabel(name, optional);
      }

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

    setErrors: function (errors, depth) {
      
      depth = depth || 0;
      errors = errors || [];
      
      var errorsByProp = {};
      var hasError = false;
      errors.forEach(function (err) {
        if (err.path.length === depth) {
          // in this case the error is relative to the whole form
          // it happend when type is a subtype of a struct
          // and the validation fails
          hasError = true;
        } else {
          var name = err.path[depth];
          errorsByProp[name] = errorsByProp[name] || [];
          errorsByProp[name].push(err); 
        }
      });

      order.forEach(function (name) {
        this.refs[name].setErrors(errorsByProp[name], depth + 1);
      }.bind(this));

      if (hasError !== this.state.hasError) {
        this.setState({ hasError: hasError });
      }

    },
    
    getRawValue: function () {
      var ret = {};
      order.forEach(function (name) {
        ret[name] = this.refs[name].getRawValue();
      }.bind(this));
      return ret;
    },
    
    getValue: getValue(type),

    render: function () {

      var classes = {
        'has-error': this.state.hasError
      };

      var children = order.map(function (name, i) {
        return factories[i]({key: i, ref: name});
      });

      return <div className={cx(classes)}>{children}</div>;
    }

  });

});

//
// list
//
var ListType = Any;
var ListOpts = Any;

var createList = func([ListType, maybe(ListOpts)], function (type, opts) {

  opts = opts || {};
  var itemType = stripMaybeOrSubtype(type).meta.type;
  var Input = opts.input || getInput(itemType);
  var defaultValue = getOrElse(opts.value, []);

  return React.createClass({

    displayName: 'List',

    getInitialState: function () {
      return { hasError: false, value: defaultValue };
    },

    setErrors: function (errors, depth) {
      var hasError = !Nil.is(errors);
      if (hasError !== this.state.hasError) {
        this.setState({ hasError: hasError, value: this.state.value });
      }
    },
    
    getRawValue: function () {
      return null;
      return this.state.value;
    },
    
    getValue: getValue(type),

    render: function () {

      var classes = {
        'has-error': this.state.hasError
      };

      var children = this.state.value.map(function (value, i) {
        return Input(itemType, opts.item);
      });

      return <div className={cx(classes)}>{children}</div>;
    }

  });

});
var options = {
  irriducible: {
    Bool: checkbox
  },
  enums: select,
  struct: form,
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
  form: form,
  createList: createList
};

module.exports = t;


/** @jsx React.DOM */

'use strict';

/*

  System A

  Input(type: Type, opts(A): maybe(Obj))
  input.render() -> A
  input.getRawValue() -> Any
  input.getValue() -> validate.Result | type
  input.setErrors(errors: maybe(list(Err)))

  - Default conversions from types to inputs

  Str -> textbox, textarea (default textbox)
  Num -> textbox
  Bool -> checkbox
  enums -> select, radio (deafult select)
  struct -> form
  list(struct) -> tab, panel, accordion

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
var irriducible = t.irriducible;
var maybe = t.maybe;
var enums = t.enums;
var list = t.list;
var struct = t.struct;
var func = t.func;
var mixin = t.util.mixin;
var isType = t.util.isType;
var isKind = t.util.isKind;
var getKind = t.util.getKind;
var getName = t.util.getName;
var Result = t.validate.Result;

//
// utils
//

// extract the type from a maybe or a subtype
// TODO remove once landed in tcomb
function extractType(type) {
  return type.meta.type ? extractType(type.meta.type) : type;
}

// TODO remove once landed in tcomb
function merge() {
  return Array.prototype.reduce.call(arguments, function (x, y) {
    return mixin(x, y, true);
  }, {});
}

// TODO remove once landed in tcomb
function getOrElse(value, defaultValue) {
  return Nil.is(value) ? defaultValue : value;
}

var Order = enums({
  asc: function (a, b) {
    return a.caption < b.caption ? -1 : a.caption > b.caption ? 1 : 0;
  },
  desc: function (a, b) {
    return a.caption < b.caption ? 1 : a.caption > b.caption ? -1 : 0;
  }
}, 'Order');

// returns the list of options of a select or a radio
function getOptions(type, opts) {
  var map = type.meta.map;
  var options = Object.keys(map).map(function (value, i) {
    return {value: value, caption: map[value]};
  });
  // apply an order (asc, desc) to options if specified
  if (opts.order) {
    options.sort(Order.meta.map[opts.order]);
  }
  // convert options to tags
  options = options.map(function (o, i) {
    return <option key={i} value={o.value}>{o.caption}</option>;
  });
  // add an emptyOption to the beginning if specified
  if (opts.emptyOption) {
    options.unshift(
      <option key={-1} value={opts.emptyOption.value}>{opts.emptyOption.caption}</option>
    );
  }
  return options;
}

// TODO finish
function getInput(type) {
  type = extractType(type);
  var kind = getKind(type);
  switch (kind) {
    case 'irriducible' :
      if (type === Bool) {
        return Checkbox;
      }
      return Textbox;
    case 'enums' :
      return Select;
    case 'struct' :
      return Form;
    default :
      t.fail('Unhandled kind `%s`', kind);
  }
}

//
// Textbox
//

// Textbox accepts only Str, subtypes of Str or maybe of Str
var TextboxType = irriducible('Textbox.Type', function (type) {
  return isType(type) && extractType(type) === Str;
});

// attr `type` of input tag
var TextboxOptsType = enums.of('text textarea password color date datetime datetime-local email month number range search tel time url week', 'Textbox.Opts.Type');

var TextboxOpts = struct({
  type: maybe(TextboxOptsType),
  value: Any, // TODO add contraints
  label: Any, // TODO add contraints
  help: Any,  // TODO add contraints
  groupClasses: maybe(Obj),
  placeholder: maybe(Str)
}, 'Textbox.Opts');

var Textbox = func([TextboxType, maybe(TextboxOpts)], function (type, opts) {

  opts = opts || TextboxOpts({});
  var defaultValue = getOrElse(opts.value, '');
  var label = opts.label ? <label className="control-label label-class">{opts.label}</label> : null;
  var help = opts.label ? <span className="help-block">{opts.label}</span> : null;

  return React.createClass({
    
    displayName: 'Textbox',
    
    getInitialState: function () {
      return { hasError: false };
    },
    
    setErrors: function (errors) {
      var hasError = !Nil.is(errors);
      if (hasError !== this.state.hasError) {
        this.setState({ hasError: hasError });
      }
    },
    
    getRawValue: function () {
      return this.refs.input.getDOMNode().value.trim() || null;
    },
    
    getValue: function () {
      var value = this.getRawValue();
      var result = t.validate(value, type);
      this.setErrors(result.errors);
      return result.isValid() ? type(value) : result;
    },

    render: function () {

      var groupClasses = mixin({
        'form-group': true,
        'has-error': this.state.hasError
      }, opts.groupClasses || {});

      var input = opts.type === 'textarea' ? 
        <textarea ref="input" className="form-control" defaultValue={defaultValue}/> :
        <input ref="input" className="form-control" type={opts.type || 'text'} defaultValue={defaultValue}/>;

      return (
        <div className={cx(groupClasses)}>
          {label}
          {input}
        </div>
      );
    }

  });

});

//
// Select
//

// Select accepts only enums
var SelectType = irriducible('Select.Type', function (type) {
  return isType(type) && isKind(extractType(type), 'enums');
});

// represents an <option>
var Option = struct({
  value: Str,
  caption: Str
}, 'Select.Option');

var SelectOpts = struct({
  value: Any, // TODO add contraints
  label: Any, // TODO add contraints
  help: Any,  // TODO add contraints
  groupClasses: maybe(Obj),
  emptyOption: maybe(Option),
  order: maybe(Order)
}, 'Select.Opts');

var Select = func([SelectType, maybe(SelectOpts)], function (type, opts) {

  opts = opts || SelectOpts({});
  var emptyValue = opts.emptyOption ? opts.emptyOption.value : '';
  var defaultValue = getOrElse(opts.value, emptyValue);
  var label = opts.label ? <label className="control-label label-class">{opts.label}</label> : null;
  var help = opts.label ? <span className="help-block">{opts.label}</span> : null;
  var options = getOptions(extractType(type), opts);

  return React.createClass({
    
    displayName: 'Select',
    
    getInitialState: function () {
      return { hasError: false };
    },
    
    setErrors: function (errors) {
      var hasError = !Nil.is(errors);
      if (hasError !== this.state.hasError) {
        this.setState({ hasError: hasError });
      }
    },
    
    getRawValue: function () {
      return this.refs.input.getDOMNode().value.trim() || null;
    },
    
    getValue: function () {
      var value = this.getRawValue();
      var result = t.validate(value, type);
      this.setErrors(result.errors);
      return result.isValid() ? type(value) : result;
    },

    render: function () {

      var groupClasses = mixin({
        'form-group': true,
        'has-error': this.state.hasError
      }, opts.groupClasses || {});

      return (
        <div className={cx(groupClasses)}>
          {label}
          <select ref="input" className="form-control" defaultValue={defaultValue}>
            {options}
          </select>
        </div>
      );
    }

  });

});

Select.defaultEmptyOption = new Option({value: '', caption: '-'});

//
// Checkbox
//

// Checkbox accepts only Bool, subtypes of Str or maybe of Str
var CheckboxType = irriducible('Checkbox.Type', function (type) {
  return isType(type) && extractType(type) === Bool;
});

var CheckboxOpts = struct({
  value: Any, // TODO add contraints
  label: Any, // TODO add contraints
  help: Any,  // TODO add contraints
  groupClasses: maybe(Obj)
}, 'Checkbox.Opts');

var Checkbox = func([CheckboxType, maybe(CheckboxOpts)], function (type, opts) {

  opts = opts || CheckboxOpts({});
  var defaultValue = getOrElse(opts.value, false);
  var help = opts.label ? <span className="help-block">{opts.label}</span> : null;

  return React.createClass({
    
    displayName: 'Checkbox',
    
    getInitialState: function () {
      return { hasError: false };
    },
    
    setErrors: function (errors) {
      var hasError = !Nil.is(errors);
      if (hasError !== this.state.hasError) {
        this.setState({ hasError: hasError });
      }
    },
    
    getRawValue: function () {
      return this.refs.input.getDOMNode().checked;
    },
    
    getValue: function () {
      var value = this.getRawValue();
      var result = t.validate(value, type);
      this.setErrors(result.errors);
      return result.isValid() ? type(value) : result;
    },

    render: function () {

      var groupClasses = mixin({
        'form-group': true,
        'has-error': this.state.hasError
      }, opts.groupClasses || {});

      return (
        <div className={cx(groupClasses)}>
          <div className="checkbox">
            <label>
              <input ref="input" type="checkbox" defaultValue={defaultValue}/> {opts.label}
            </label>
          </div>
        </div>
      );
    }

  });

});

//
// Form
//

// Form accepts only structs or subtypes of struct
var FormType = irriducible('Form.Type', function (type) {
  return isType(type) && isKind(extractType(type), 'struct');
});

var FormOpts = struct({
  order: maybe(list(Str)),
  fields: maybe(Obj)
});

var Form = func([FormType, maybe(FormOpts)], function (type, opts) {

  var innerType = extractType(type);
  var props = innerType.meta.props;

  opts = opts || FormOpts({});
  // inputsOrder is useful both for ordering and filtering fields
  // TODO controllare che ci siano tutti i campi
  var order = opts.order || Object.keys(props);
  var fields = opts.fields || {};

  var factories = order.map(function (name) {
    var type = props[name];
    var Input = getInput(type);
    // pass to child input its options
    return Input(type, fields[name]);
  });

  return React.createClass({

    displayName: 'Form',

    getInitialState: function () {
      return { hasError: false };
    },

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
    
    getValue: function () {
      var value = this.getRawValue();
      var result = t.validate(value, type);
      this.setErrors(result.errors);
      return result.isValid() ? type(value) : result;
    },

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

t.form = {
  Textbox: Textbox,
  Option: Option,
  Select: Select,
  Form: Form
};

module.exports = t;


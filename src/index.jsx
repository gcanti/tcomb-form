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
var Func = t.Func;
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

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

var Order = enums({
  asc: function (a, b) {
    return a.caption < b.caption ? -1 : a.caption > b.caption ? 1 : 0;
  },
  desc: function (a, b) {
    return a.caption < b.caption ? 1 : a.caption > b.caption ? -1 : 0;
  }
}, 'Order');

function getChoices(map, order, emptyChoice) {
  var choices = Object.keys(map).map(function (value, i) {
    return {value: value, caption: map[value]};
  });
  // apply an order (asc, desc) to options if specified
  if (order) {
    choices.sort(Order.meta.map[order]);
  }
  // add an empty choice to the beginning if specified
  if (emptyChoice) {
    choices.unshift(emptyChoice);
  }
  return choices;
}

// returns the list of options of a select
function getOptions(map, order, emptyOption) {
  var choices = getChoices(map, order, emptyOption);
  return choices.map(function (c, i) {
    return <option key={i} value={c.value}>{c.caption}</option>;
  });
}

// TODO finish
function getInput(type, opts) {
  if (opts && opts.input) {
    return opts.input;
  }
  type = extractType(type);
  var kind = getKind(type);
  switch (kind) {
    case 'irriducible' :
      if (type === Bool) {
        return checkbox;
      }
      return textbox;
    case 'enums' :
      return select;
    case 'struct' :
      return form;
    default :
      t.fail('Unhandled kind `%s`', kind);
  }
}

var I18n = struct({
  format: Func,
  parse: Func
});

//
// textbox
//

// attr `type` of input tag
var TextboxOptsType = enums.of('text textarea password color date datetime datetime-local email month number range search tel time url week', 'Textbox.Opts.Type');

var TextboxOpts = struct({
  type: maybe(TextboxOptsType),
  value: Any, // TODO add contraints
  label: Any, // TODO add contraints
  help: Any,  // TODO add contraints
  groupClasses: maybe(Obj),
  placeholder: maybe(Str),
  i18n: maybe(I18n)
}, 'Textbox.Opts');

var textbox = func([Any, maybe(TextboxOpts)], function (type, opts) {

  opts = opts || TextboxOpts({});
  var defaultValue = getOrElse(opts.value, '');
  var i18n = opts.i18n || {};
  if (i18n.format) {
    defaultValue = i18n.format(defaultValue);
  }
  var label = opts.label ? <label className="control-label label-class">{opts.label}</label> : null;
  var help = opts.help ? <span className="help-block">{opts.help}</span> : null;

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
      var value = this.refs.input.getDOMNode().value.trim() || null;
      if (i18n.parse) {
        value = i18n.parse(value);
      }
      return value;
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

// select accepts only enums
var EnumType = irriducible('EnumType', function (type) {
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

var select = func([EnumType, maybe(SelectOpts)], function (type, opts) {

  opts = opts || SelectOpts({});
  var emptyValue = opts.emptyOption ? opts.emptyOption.value : '';
  var defaultValue = getOrElse(opts.value, emptyValue);
  var label = opts.label ? <label className="control-label label-class">{opts.label}</label> : null;
  var help = opts.help ? <span className="help-block">{opts.help}</span> : null;
  var options = getOptions(extractType(type).meta.map, opts.order, opts.emptyOption);

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
          {help}
        </div>
      );
    }

  });

});

select.defaultEmptyOption = new Option({value: '', caption: '-'});

//
// radio
//

var RadioOpts = struct({
  value: Any, // TODO add contraints
  label: Any, // TODO add contraints
  help: Any,  // TODO add contraints
  groupClasses: maybe(Obj),
  order: maybe(Order)
}, 'Radio.Opts');

var radio = func([EnumType, maybe(RadioOpts)], function (type, opts) {

  opts = opts || RadioOpts({});
  var defaultValue = getOrElse(opts.value, '');
  var label = opts.label ? <label className="control-label label-class">{opts.label}</label> : null;
  var help = opts.help ? <span className="help-block">{opts.help}</span> : null;
  var choices = getChoices(extractType(type).meta.map, opts.order);
  var len = choices.length;
  var name = uuid();

  return React.createClass({
    
    displayName: 'Radio',
    
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

      var radios = choices.map(function (c, i) {
        return (
          <div className="radio" key={i}>
            <label>
              <input type="radio" ref={name + i} name={name} value={c.value} defaultChecked={c.value === defaultValue}></input>
              {c.caption}
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

// checkbox accepts only Bool, subtypes of Str or maybe of Str
var CheckboxType = irriducible('Checkbox.Type', function (type) {
  return isType(type) && extractType(type) === Bool;
});

var CheckboxOpts = struct({
  value: Any, // TODO add contraints
  label: Any, // TODO add contraints
  help: Any,  // TODO add contraints
  groupClasses: maybe(Obj)
}, 'Checkbox.Opts');

var checkbox = func([CheckboxType, maybe(CheckboxOpts)], function (type, opts) {

  opts = opts || CheckboxOpts({});
  var defaultValue = getOrElse(opts.value, false);
  var help = opts.help ? <span className="help-block">{opts.help}</span> : null;

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

// form accepts only structs or subtypes of struct
var FormType = irriducible('Form.Type', function (type) {
  return isType(type) && isKind(extractType(type), 'struct');
});

var FormOpts = struct({
  order: maybe(list(Str)),
  fields: maybe(Obj)
});

var form = func([FormType, maybe(FormOpts)], function (type, opts) {

  var innerType = extractType(type);
  var props = innerType.meta.props;

  opts = opts || FormOpts({});
  // inputsOrder is useful both for ordering and filtering fields
  // TODO controllare che ci siano tutti i campi
  var keys = Object.keys(props);
  var order = opts.order || keys;
  assert(keys.length === order.length, 'Invalid `order` of value `%j` supplied to `form`, all type props must be specified', order);
  var fields = opts.fields || {};

  var factories = order.map(function (name) {
    var type = props[name];
    var opts = fields[name];
    var Input = getInput(type, opts);
    // pass to child input its options
    return Input(type, opts);
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
  textbox: textbox,
  Option: Option,
  select: select,
  radio: radio,
  checkbox: checkbox,
  form: form
};

module.exports = t;


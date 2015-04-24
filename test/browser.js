(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function _interopRequireWildcard(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
};

var _classCallCheck = function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
};

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

var _inherits = function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
};

exports.__esModule = true;
exports.getComponent = getComponent;

var _React = require('react');

var _React2 = _interopRequireWildcard(_React);

var _t = require('tcomb-validation');

var _t2 = _interopRequireWildcard(_t);

var _compile = require('uvdom/react');

var _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move = require('./util');

var _debug = require('debug');

var _debug2 = _interopRequireWildcard(_debug);

var _classnames = require('classnames');

var _classnames2 = _interopRequireWildcard(_classnames);

'use strict';

var Nil = _t2['default'].Nil;
var assert = _t2['default'].assert;
var SOURCE = 'tcomb-form';
var log = _debug2['default'](SOURCE);
var noobj = Object.freeze({});
var noarr = Object.freeze([]);
var noop = function noop() {};

function getComponent(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    name = undefined;
    _again = false;
    var type = _x,
        options = _x2;

    if (options.factory) {
      return options.factory;
    }
    var name = _t2['default'].getTypeName(type);
    switch (type.meta.kind) {
      case 'irreducible':
        return type === _t2['default'].Bool ? Checkbox : type === _t2['default'].Dat ? Datetime : Textbox;
      case 'struct':
        return Struct;
      case 'list':
        return List;
      case 'enums':
        return Select;
      case 'dict':
        return Dict;
      case 'tuple':
        return Tuple;
      case 'maybe':
      case 'subtype':
        _x = type.meta.type;
        _x2 = options;
        _again = true;
        continue _function;

      default:
        _t2['default'].fail('[' + SOURCE + '] unsupported type ' + name);
    }
  }
}

function sortByText(a, b) {
  return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
}

function getComparator(order) {
  return ({
    asc: sortByText,
    desc: function desc(a, b) {
      return -sortByText(a, b);
    }
  })[order];
}

var decorators = {

  template: function template(name) {
    return function (Component) {
      Component.prototype.getTemplate = function getTemplate() {
        return this.props.options.template || this.props.ctx.templates[name];
      };
    };
  },

  attrs: function attrs(Component) {
    Component.prototype.getAttrs = function getAttrs() {
      var attrs = _t2['default'].mixin({}, this.props.options.attrs);
      attrs.id = this.getId();
      attrs.name = this.getName();
      if (attrs.className) {
        var _attrs$className;

        attrs.className = (_attrs$className = {}, _attrs$className[_classnames2['default'](attrs.className)] = true, _attrs$className);
      }
      return attrs;
    };
  },

  placeholder: function placeholder(Component) {
    Component.prototype.getPlaceholder = function getPlaceholder() {
      var attrs = this.props.options.attrs || noobj;
      var placeholder = attrs.placeholder;
      if (Nil.is(placeholder) && this.getAuto() === 'placeholders') {
        placeholder = this.getDefaultLabel();
      }
      return placeholder;
    };
  },

  templates: function templates(Component) {
    Component.prototype.getTemplates = function getTemplates() {
      return _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.merge(this.props.ctx.templates, this.props.options.templates);
    };
  }

};

exports.decorators = decorators;

var Component = (function (_React$Component) {
  function Component(props) {
    _classCallCheck(this, Component);

    _React$Component.call(this, props);
    this.typeInfo = _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.getTypeInfo(props.type);
    this.state = {
      hasError: false,
      value: this.getTransformer().format(props.value)
    };
  }

  _inherits(Component, _React$Component);

  Component.prototype.getTransformer = function getTransformer() {
    return this.props.options.transformer || this.constructor.transformer;
  };

  Component.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return nextState.value !== this.state.value || nextState.hasError !== this.state.hasError || nextProps.options !== this.props.options || nextProps.type !== this.props.type;
  };

  Component.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.typeInfo = _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.getTypeInfo(props.type);
    }
    this.setState({ value: this.getTransformer().format(props.value) });
  };

  Component.prototype.onChange = function onChange(value) {
    var _this6 = this;

    this.setState({ value: value }, function () {
      _this6.props.onChange(value, _this6.props.ctx.path);
    });
  };

  Component.prototype.validate = function validate() {
    var value = this.getTransformer().parse(this.state.value);
    var result = _t2['default'].validate(value, this.props.type, this.props.ctx.path);
    this.setState({ hasError: !result.isValid() });
    return result;
  };

  Component.prototype.getAuto = function getAuto() {
    return this.props.options.auto || this.props.ctx.auto;
  };

  Component.prototype.getI18n = function getI18n() {
    return this.props.options.i18n || this.props.ctx.i18n;
  };

  Component.prototype.getDefaultLabel = function getDefaultLabel() {
    var ctx = this.props.ctx;
    if (ctx.label) {
      return ctx.label + (this.typeInfo.isMaybe ? ctx.i18n.optional : '');
    }
  };

  Component.prototype.getLabel = function getLabel() {
    var ctx = this.props.ctx;
    var legend = this.props.options.legend;
    var label = this.props.options.label;
    label = label || legend;
    if (Nil.is(label) && ctx.auto === 'labels') {
      label = this.getDefaultLabel();
    }
    return label;
  };

  Component.prototype.getError = function getError() {
    var error = this.props.options.error;
    return _t2['default'].Func.is(error) ? error(this.state.value) : error;
  };

  Component.prototype.hasError = function hasError() {
    return this.props.options.hasError || this.state.hasError;
  };

  Component.prototype.getConfig = function getConfig() {
    return _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.merge(this.props.ctx.config, this.props.options.config);
  };

  Component.prototype.getId = function getId() {
    var attrs = this.props.options.attrs || noobj;
    return attrs.id || _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.uuid();
  };

  Component.prototype.getName = function getName() {
    return this.props.options.name || this.props.ctx.name || this.getId();
  };

  Component.prototype.getLocals = function getLocals() {
    var options = this.props.options;
    var value = this.state.value;
    return {
      path: this.props.ctx.path,
      error: this.getError(),
      hasError: this.hasError(),
      label: this.getLabel(),
      onChange: this.onChange.bind(this),
      config: this.getConfig(),
      value: value,
      disabled: options.disabled,
      help: options.help
    };
  };

  Component.prototype.render = function render() {
    log('rendering %s', this.constructor.name);
    var locals = this.getLocals();
    // getTemplate is the only required implementation when extending Component
    assert(_t2['default'].Func.is(this.getTemplate), '[' + SOURCE + '] missing getTemplate method of component ' + this.constructor.name);
    var template = this.getTemplate();
    return _compile.compile(template(locals));
  };

  _createClass(Component, null, [{
    key: 'transformer',
    value: {
      format: function format(value) {
        return Nil.is(value) ? null : value;
      },
      parse: function parse(value) {
        return value;
      }
    },
    enumerable: true
  }]);

  return Component;
})(_React2['default'].Component);

exports.Component = Component;

function toNull(value) {
  return _t2['default'].Str.is(value) && value.trim() === '' || Nil.is(value) ? null : value;
}

function parseNumber(value) {
  var n = parseFloat(value);
  var isNumeric = value - n + 1 >= 0;
  return isNumeric ? n : toNull(value);
}

var Textbox = (function (_Component) {
  function Textbox() {
    _classCallCheck(this, _Textbox);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(Textbox, _Component);

  var _Textbox = Textbox;

  _Textbox.prototype.getTransformer = function getTransformer() {
    var options = this.props.options;
    return options.transformer ? options.transformer : this.typeInfo.innerType === _t2['default'].Num ? Textbox.numberTransformer : Textbox.transformer;
  };

  _Textbox.prototype.getLocals = function getLocals() {
    var locals = _Component.prototype.getLocals.call(this);
    locals.attrs = this.getAttrs();
    locals.attrs.placeholder = this.getPlaceholder();
    locals.type = this.props.options.type || 'text';
    return locals;
  };

  _createClass(_Textbox, null, [{
    key: 'transformer',
    value: {
      format: function format(value) {
        return Nil.is(value) ? null : value;
      },
      parse: toNull
    },
    enumerable: true
  }, {
    key: 'numberTransformer',
    value: {
      format: function format(value) {
        return Nil.is(value) ? null : String(value);
      },
      parse: parseNumber
    },
    enumerable: true
  }]);

  Textbox = decorators.template('textbox')(Textbox) || Textbox;
  Textbox = decorators.placeholder(Textbox) || Textbox;
  Textbox = decorators.attrs(Textbox) || Textbox;
  return Textbox;
})(Component);

exports.Textbox = Textbox;

var Checkbox = (function (_Component2) {
  function Checkbox() {
    _classCallCheck(this, _Checkbox);

    if (_Component2 != null) {
      _Component2.apply(this, arguments);
    }
  }

  _inherits(Checkbox, _Component2);

  var _Checkbox = Checkbox;

  _Checkbox.prototype.getLocals = function getLocals() {
    var locals = _Component2.prototype.getLocals.call(this);
    locals.attrs = this.getAttrs();
    // checkboxes must always have a label
    locals.label = locals.label || this.getDefaultLabel();
    return locals;
  };

  _createClass(_Checkbox, null, [{
    key: 'transformer',
    value: {
      format: function format(value) {
        return Nil.is(value) ? false : value;
      },
      parse: function parse(value) {
        return value;
      }
    },
    enumerable: true
  }]);

  Checkbox = decorators.template('checkbox')(Checkbox) || Checkbox;
  Checkbox = decorators.attrs(Checkbox) || Checkbox;
  return Checkbox;
})(Component);

exports.Checkbox = Checkbox;

var Select = (function (_Component3) {
  function Select() {
    _classCallCheck(this, _Select);

    if (_Component3 != null) {
      _Component3.apply(this, arguments);
    }
  }

  _inherits(Select, _Component3);

  var _Select = Select;

  _Select.prototype.getTransformer = function getTransformer() {
    var options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    if (this.isMultiple()) {
      return Select.multipleTransformer;
    }
    return Select.transformer(this.getNullOption());
  };

  _Select.prototype.getNullOption = function getNullOption() {
    return this.props.options.nullOption || { value: '', text: '-' };
  };

  _Select.prototype.isMultiple = function isMultiple() {
    return this.typeInfo.innerType.meta.kind === 'list';
  };

  _Select.prototype.getEnum = function getEnum() {
    return this.isMultiple() ? _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.getTypeInfo(this.typeInfo.innerType.meta.type).innerType : this.typeInfo.innerType;
  };

  _Select.prototype.getOptions = function getOptions() {
    var options = this.props.options;
    var items = options.options ? options.options.slice() : _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.getOptionsOfEnum(this.getEnum());
    if (options.order) {
      items.sort(getComparator(options.order));
    }
    var nullOption = this.getNullOption();
    if (!this.isMultiple() && options.nullOption !== false) {
      items.unshift(nullOption);
    }
    return items;
  };

  _Select.prototype.getLocals = function getLocals() {
    var locals = _Component3.prototype.getLocals.call(this);
    locals.attrs = this.getAttrs();
    locals.options = this.getOptions();
    locals.isMultiple = this.isMultiple();
    return locals;
  };

  _createClass(_Select, null, [{
    key: 'transformer',
    value: function value(nullOption) {
      return {
        format: function format(value) {
          return Nil.is(value) && nullOption ? nullOption.value : value;
        },
        parse: function parse(value) {
          return nullOption && nullOption.value === value ? null : value;
        }
      };
    },
    enumerable: true
  }, {
    key: 'multipleTransformer',
    value: {
      format: function format(value) {
        return Nil.is(value) ? noarr : value;
      },
      parse: function parse(value) {
        return value;
      }
    },
    enumerable: true
  }]);

  Select = decorators.template('select')(Select) || Select;
  Select = decorators.attrs(Select) || Select;
  return Select;
})(Component);

exports.Select = Select;

var Radio = (function (_Component4) {
  function Radio() {
    _classCallCheck(this, _Radio);

    if (_Component4 != null) {
      _Component4.apply(this, arguments);
    }
  }

  _inherits(Radio, _Component4);

  var _Radio = Radio;

  _Radio.prototype.getOptions = function getOptions() {
    var options = this.props.options;
    var items = options.options ? options.options.slice() : _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.getOptionsOfEnum(this.typeInfo.innerType);
    if (options.order) {
      items.sort(getComparator(options.order));
    }
    return items;
  };

  _Radio.prototype.getLocals = function getLocals() {
    var locals = _Component4.prototype.getLocals.call(this);
    locals.attrs = this.getAttrs();
    locals.options = this.getOptions();
    return locals;
  };

  Radio = decorators.template('radio')(Radio) || Radio;
  Radio = decorators.attrs(Radio) || Radio;
  return Radio;
})(Component);

exports.Radio = Radio;

var Datetime = (function (_Component5) {
  function Datetime() {
    _classCallCheck(this, _Datetime);

    if (_Component5 != null) {
      _Component5.apply(this, arguments);
    }
  }

  _inherits(Datetime, _Component5);

  var _Datetime = Datetime;

  _Datetime.prototype.getOrder = function getOrder() {
    return this.props.options.order || ['M', 'D', 'YY'];
  };

  _Datetime.prototype.getLocals = function getLocals() {
    var locals = _Component5.prototype.getLocals.call(this);
    locals.order = this.getOrder();
    return locals;
  };

  _createClass(_Datetime, null, [{
    key: 'transformer',
    value: {
      format: function format(value) {
        return _t2['default'].Arr.is(value) ? value : _t2['default'].Dat.is(value) ? [value.getFullYear(), value.getMonth(), value.getDate()].map(String) : [null, null, null];
      },
      parse: function parse(value) {
        value = value.map(parseNumber);
        return value.every(_t2['default'].Num.is) ? new Date(value[0], value[1], value[2]) : value.every(Nil.is) ? null : value;
      }
    },
    enumerable: true
  }]);

  Datetime = decorators.template('date')(Datetime) || Datetime;
  return Datetime;
})(Component);

exports.Datetime = Datetime;

var Struct = (function (_Component6) {
  function Struct() {
    _classCallCheck(this, _Struct);

    if (_Component6 != null) {
      _Component6.apply(this, arguments);
    }
  }

  _inherits(Struct, _Component6);

  var _Struct = Struct;

  _Struct.prototype.validate = function validate() {
    var value = {};
    var errors = [];
    var hasError = false;
    var result = undefined;

    for (var ref in this.refs) {
      if (this.refs.hasOwnProperty(ref)) {
        result = this.refs[ref].validate();
        errors = errors.concat(result.errors);
        value[ref] = result.value;
      }
    }

    if (errors.length === 0) {
      var InnerType = this.typeInfo.innerType;
      value = new InnerType(value);
      if (this.typeInfo.isSubtype && errors.length === 0) {
        result = _t2['default'].validate(value, this.props.type, this.props.ctx.path);
        hasError = !result.isValid();
        errors = errors.concat(result.errors);
      }
    }

    this.setState({ hasError: hasError });
    return new _t2['default'].ValidationResult({ errors: errors, value: value });
  };

  _Struct.prototype.onChange = function onChange(fieldName, fieldValue, path, kind) {
    var value = _t2['default'].mixin({}, this.state.value);
    value[fieldName] = fieldValue;
    this.setState({ value: value }, (function () {
      this.props.onChange(value, path, kind);
    }).bind(this));
  };

  _Struct.prototype.getTemplate = function getTemplate() {
    return this.props.options.template || this.getTemplates().struct;
  };

  _Struct.prototype.getTypeProps = function getTypeProps() {
    return this.typeInfo.innerType.meta.props;
  };

  _Struct.prototype.getOrder = function getOrder() {
    return this.props.options.order || Object.keys(this.getTypeProps());
  };

  _Struct.prototype.getInputs = function getInputs() {
    var _props = this.props;
    var options = _props.options;
    var ctx = _props.ctx;

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
        var propOptions = options.fields && options.fields[prop] ? options.fields[prop] : noobj;
        inputs[prop] = _React2['default'].createElement(getComponent(propType, propOptions), {
          key: prop,
          ref: prop,
          type: propType,
          options: propOptions,
          value: value[prop],
          onChange: this.onChange.bind(this, prop),
          ctx: {
            auto: auto,
            config: config,
            name: ctx.name ? '' + ctx.name + '[' + prop + ']' : prop,
            label: _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.humanize(prop),
            i18n: i18n,
            templates: templates,
            path: ctx.path.concat(prop)
          }
        });
      }
    }
    return inputs;
  };

  _Struct.prototype.getLocals = function getLocals() {
    var options = this.props.options;
    var locals = _Component6.prototype.getLocals.call(this);
    locals.order = this.getOrder();
    locals.inputs = this.getInputs();
    return locals;
  };

  _createClass(_Struct, null, [{
    key: 'transformer',
    value: {
      format: function format(value) {
        return Nil.is(value) ? noobj : value;
      },
      parse: function parse(value) {
        return value;
      }
    },
    enumerable: true
  }]);

  Struct = decorators.templates(Struct) || Struct;
  return Struct;
})(Component);

exports.Struct = Struct;

function toSameLength(value, keys) {
  if (value.length === keys.length) {
    return keys;
  }
  var ret = [];
  for (var i = 0, len = value.length; i < len; i++) {
    ret[i] = keys[i] || _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.uuid();
  }
  return ret;
}

var List = (function (_Component7) {
  function List(props) {
    _classCallCheck(this, _List);

    _Component7.call(this, props);
    this.state.keys = this.state.value.map(_humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.uuid);
  }

  _inherits(List, _Component7);

  var _List = List;

  _List.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.typeInfo = _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.getTypeInfo(props.type);
    }
    var value = this.getTransformer().format(props.value);
    this.setState({
      value: value,
      keys: toSameLength(value, this.state.keys)
    });
  };

  _List.prototype.validate = function validate() {
    var value = [];
    var errors = [];
    var hasError = false;
    var result = undefined;

    for (var i = 0, len = this.state.value.length; i < len; i++) {
      result = this.refs[i].validate();
      errors = errors.concat(result.errors);
      value.push(result.value);
    }

    // handle subtype
    if (this.typeInfo.isSubtype && errors.length === 0) {
      result = _t2['default'].validate(value, this.props.type, this.props.ctx.path);
      hasError = !result.isValid();
      errors = errors.concat(result.errors);
    }

    this.setState({ hasError: hasError });
    return new _t2['default'].ValidationResult({ errors: errors, value: value });
  };

  _List.prototype.onChange = function onChange(value, keys, path, kind) {
    var _this7 = this;

    this.setState({ value: value, keys: toSameLength(value, keys) }, function () {
      _this7.props.onChange(value, path, kind);
    });
  };

  _List.prototype.addItem = function addItem(evt) {
    evt.preventDefault();
    var value = this.state.value.concat(undefined);
    var keys = this.state.keys.concat(_humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.uuid());
    this.onChange(value, keys, this.props.ctx.path.concat(value.length - 1), 'add');
  };

  _List.prototype.onItemChange = function onItemChange(itemIndex, itemValue, path) {
    var value = this.state.value.slice();
    value[itemIndex] = itemValue;
    this.onChange(value, this.state.keys, path);
  };

  _List.prototype.removeItem = function removeItem(i, evt) {
    evt.preventDefault();
    var value = this.state.value.slice();
    value.splice(i, 1);
    var keys = this.state.keys.slice();
    keys.splice(i, 1);
    this.onChange(value, keys, this.props.ctx.path.concat(i), 'remove');
  };

  _List.prototype.moveUpItem = function moveUpItem(i, evt) {
    evt.preventDefault();
    if (i > 0) {
      this.onChange(_humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.move(this.state.value.slice(), i, i - 1), _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.move(this.state.keys.slice(), i, i - 1), this.props.ctx.path.concat(i), 'moveUp');
    }
  };

  _List.prototype.moveDownItem = function moveDownItem(i, evt) {
    evt.preventDefault();
    if (i < this.state.value.length - 1) {
      this.onChange(_humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.move(this.state.value.slice(), i, i + 1), _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.move(this.state.keys.slice(), i, i + 1), this.props.ctx.path.concat(i), 'moveDown');
    }
  };

  _List.prototype.getTemplate = function getTemplate() {
    return this.props.options.template || this.getTemplates().list;
  };

  _List.prototype.getItems = function getItems() {
    var _this8 = this;

    var _props2 = this.props;
    var options = _props2.options;
    var ctx = _props2.ctx;

    var auto = this.getAuto();
    var i18n = this.getI18n();
    var config = this.getConfig();
    var templates = this.getTemplates();
    var value = this.state.value;
    var type = this.typeInfo.innerType.meta.type;
    var Component = getComponent(type, options.item || noobj);
    return value.map(function (value, i) {
      var buttons = [];
      if (!options.disableRemove) {
        buttons.push({ label: i18n.remove, click: _this8.removeItem.bind(_this8, i) });
      }
      if (!options.disableOrder) {
        buttons.push({ label: i18n.up, click: _this8.moveUpItem.bind(_this8, i) });
      }
      if (!options.disableOrder) {
        buttons.push({ label: i18n.down, click: _this8.moveDownItem.bind(_this8, i) });
      }
      return {
        input: _React2['default'].createElement(Component, {
          ref: i,
          type: type,
          options: options.item || noobj,
          value: value,
          onChange: _this8.onItemChange.bind(_this8, i),
          ctx: {
            auto: auto,
            config: config,
            i18n: i18n,
            name: ctx.name ? '' + ctx.name + '[' + i + ']' : String(i),
            templates: templates,
            path: ctx.path.concat(i)
          }
        }),
        key: _this8.state.keys[i],
        buttons: buttons
      };
    });
  };

  _List.prototype.getLocals = function getLocals() {
    var options = this.props.options;
    var i18n = this.getI18n();
    var locals = _Component7.prototype.getLocals.call(this);
    locals.add = options.disableAdd ? null : {
      label: i18n.add,
      click: this.addItem.bind(this)
    };
    locals.items = this.getItems();
    return locals;
  };

  _createClass(_List, null, [{
    key: 'transformer',
    value: {
      format: function format(value) {
        return Nil.is(value) ? noarr : value;
      },
      parse: function parse(value) {
        return value;
      }
    },
    enumerable: true
  }]);

  List = decorators.templates(List) || List;
  return List;
})(Component);

exports.List = List;

var Form = (function () {
  function Form() {
    _classCallCheck(this, Form);
  }

  Form.prototype.validate = function validate() {
    return this.refs.input.validate();
  };

  Form.prototype.getValue = function getValue(raw) {
    var result = this.validate();
    return raw === true ? result : result.isValid() ? result.value : null;
  };

  Form.prototype.getComponent = function getComponent(path) {
    path = _t2['default'].Str.is(path) ? path.split('.') : path;
    return path.reduce(function (input, name) {
      return input.refs[name];
    }, this.refs.input);
  };

  Form.prototype.render = function render() {
    var _props3 = this.props;
    var type = _props3.type;
    var _props3$options = _props3.options;
    var options = _props3$options === undefined ? noobj : _props3$options;
    var i18n = Form.i18n;
    var templates = Form.templates;

    assert(_t2['default'].Type.is(type), '[' + SOURCE + '] missing required prop type');
    assert(_t2['default'].Obj.is(options), '[' + SOURCE + '] prop options must be an object');
    assert(_t2['default'].Obj.is(templates), '[' + SOURCE + '] missing templates config');
    assert(_t2['default'].Obj.is(i18n), '[' + SOURCE + '] missing i18n config');

    var Component = getComponent(type, options);
    return _React2['default'].createElement(Component, {
      ref: 'input',
      type: type,
      options: options,
      value: this.props.value,
      onChange: this.props.onChange || noop,
      ctx: this.props.ctx || {
        auto: 'labels',
        templates: templates,
        i18n: i18n,
        path: []
      }
    });
  };

  return Form;
})();

exports.Form = Form;

},{"./util":3,"classnames":4,"debug":5,"react":"react","tcomb-validation":21,"uvdom/react":45}],2:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function _interopRequireWildcard(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
};

exports.__esModule = true;
exports.textbox = textbox;
exports.checkbox = checkbox;
exports.select = select;
exports.radio = radio;
exports.date = date;
exports.struct = struct;
exports.list = list;

var _t = require('tcomb-validation');

var _t2 = _interopRequireWildcard(_t);

var _bootstrap = require('uvdom-bootstrap');

var _bootstrap2 = _interopRequireWildcard(_bootstrap);

'use strict';

var Any = _t2['default'].Any;
var maybe = _t2['default'].maybe;
var noobj = {};

var Positive = _t2['default'].subtype(_t2['default'].Num, function (n) {
  return n % 1 === 0 && n >= 0;
}, 'Positive');

var Cols = _t2['default'].subtype(_t2['default'].tuple([Positive, Positive]), function (cols) {
  return cols[0] + cols[1] === 12;
}, 'Cols');

var Breakpoints = _t2['default'].struct({
  xs: maybe(Cols),
  sm: maybe(Cols),
  md: maybe(Cols),
  lg: maybe(Cols)
}, 'Breakpoints');

Breakpoints.prototype.getBreakpoints = function (index) {
  var breakpoints = {};
  for (var size in this) {
    if (this.hasOwnProperty(size) && !_t2['default'].Nil.is(this[size])) {
      breakpoints[size] = this[size][index];
    }
  }
  return breakpoints;
};

Breakpoints.prototype.getLabelClassName = function () {
  return _bootstrap2['default'].getBreakpoints(this.getBreakpoints(0));
};

Breakpoints.prototype.getInputClassName = function () {
  return _bootstrap2['default'].getBreakpoints(this.getBreakpoints(1));
};

Breakpoints.prototype.getOffsetClassName = function () {
  return _t2['default'].mixin(_bootstrap2['default'].getOffsets(this.getBreakpoints(1)), _bootstrap2['default'].getBreakpoints(this.getBreakpoints(1)));
};

Breakpoints.prototype.getFieldsetClassName = function () {
  return {
    'col-xs-12': true
  };
};

var Size = _t2['default'].enums.of('xs sm md lg', 'Size');

var TextboxConfig = _t2['default'].struct({
  addonBefore: Any,
  addonAfter: Any,
  horizontal: maybe(Breakpoints),
  size: maybe(Size)
}, 'TextboxConfig');

var CheckboxConfig = _t2['default'].struct({
  horizontal: maybe(Breakpoints)
}, 'CheckboxConfig');

var SelectConfig = _t2['default'].struct({
  addonBefore: Any,
  addonAfter: Any,
  horizontal: maybe(Breakpoints),
  size: maybe(Size)
}, 'SelectConfig');

var RadioConfig = _t2['default'].struct({
  horizontal: maybe(Breakpoints)
}, 'RadioConfig');

var DateConfig = _t2['default'].struct({
  horizontal: maybe(Breakpoints)
}, 'DateConfig');

var StructConfig = _t2['default'].struct({
  horizontal: maybe(Breakpoints)
}, 'StructConfig');

var ListConfig = _t2['default'].struct({
  horizontal: maybe(Breakpoints)
}, 'ListConfig');

function getLabel(_ref) {
  var label = _ref.label;
  var breakpoints = _ref.breakpoints;
  var htmlFor = _ref.htmlFor;
  var id = _ref.id;

  if (!label) {
    return;
  }

  var align = null;
  var className = null;

  if (breakpoints) {
    align = 'right';
    className = breakpoints.getLabelClassName();
  }

  return _bootstrap2['default'].getLabel({
    align: align,
    className: className,
    htmlFor: htmlFor,
    id: id,
    label: label
  });
}

function getHelp(_ref2) {
  var help = _ref2.help;
  var attrs = _ref2.attrs;

  if (!help) {
    return;
  }
  return _bootstrap2['default'].getHelpBlock({
    help: help,
    id: attrs.id + '-tip'
  });
}

function getError(_ref3) {
  var hasError = _ref3.hasError;
  var error = _ref3.error;

  if (!hasError || !error) {
    return;
  }
  return _bootstrap2['default'].getErrorBlock({
    error: error,
    hasError: hasError
  });
}

function getHiddenTextbox(_ref4) {
  var value = _ref4.value;
  var name = _ref4.name;

  return {
    tag: 'input',
    attrs: {
      type: 'hidden',
      value: value,
      name: name
    }
  };
}

function textbox(locals) {

  var config = new TextboxConfig(locals.config || noobj);

  if (locals.type === 'hidden') {
    return getHiddenTextbox(locals);
  }

  var attrs = _t2['default'].mixin({}, locals.attrs);
  var control = undefined;

  if (locals.type === 'static') {
    control = _bootstrap2['default'].getStatic(locals.value);
  } else {

    var tag = 'textarea';
    if (locals.type !== 'textarea') {
      tag = 'input';
      attrs.type = locals.type;
    }

    attrs.className = _t2['default'].mixin({}, attrs.className);
    attrs.className['form-control'] = true;

    attrs.disabled = locals.disabled;
    if (locals.type !== 'file') {
      attrs.value = locals.value;
    }
    attrs.onChange = locals.type === 'file' ? function (evt) {
      return locals.onChange(evt.target.files[0]);
    } : function (evt) {
      return locals.onChange(evt.target.value);
    };

    if (locals.help) {
      attrs['aria-describedby'] = attrs['aria-describedby'] || attrs.id + '-tip';
    }

    control = {
      tag: tag,
      attrs: attrs
    };
    if (config.addonBefore || config.addonAfter) {
      control = _bootstrap2['default'].getInputGroup([config.addonBefore ? _bootstrap2['default'].getAddon(config.addonBefore) : null, control, config.addonAfter ? _bootstrap2['default'].getAddon(config.addonAfter) : null]);
    }
  }

  var horizontal = config.horizontal;
  var label = getLabel({
    label: locals.label,
    htmlFor: attrs.id,
    breakpoints: config.horizontal
  });
  var error = getError(locals);
  var help = getHelp(locals);

  var children = [label, control, error, help];

  if (horizontal) {
    children = [label, {
      tag: 'div',
      attrs: {
        className: label ? horizontal.getInputClassName() : horizontal.getOffsetClassName()
      },
      children: [control, error, help]
    }];
  }

  return _bootstrap2['default'].getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children: children
  });
}

function checkbox(locals) {

  var config = new CheckboxConfig(locals.config || noobj);

  var attrs = _t2['default'].mixin({}, locals.attrs);
  attrs.type = 'checkbox';
  attrs.disabled = locals.disabled;
  attrs.checked = locals.value;
  attrs.onChange = function (evt) {
    return locals.onChange(evt.target.checked);
  };

  if (locals.help) {
    attrs['aria-describedby'] = attrs['aria-describedby'] || attrs.id + '-tip';
  }

  var control = _bootstrap2['default'].getCheckbox(attrs, locals.label);

  var error = getError(locals);
  var help = getHelp(locals);
  var children = [control, error, help];

  if (config.horizontal) {
    children = {
      tag: 'div',
      attrs: {
        className: config.horizontal.getOffsetClassName()
      },
      children: children
    };
  }

  return _bootstrap2['default'].getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children: children
  });
}

function select(locals) {

  var config = new SelectConfig(locals.config || noobj);

  var attrs = _t2['default'].mixin({}, locals.attrs);

  attrs.className = _t2['default'].mixin({}, attrs.className);
  attrs.className['form-control'] = true;

  attrs.multiple = locals.isMultiple;
  attrs.disabled = locals.disabled;
  attrs.value = locals.value;
  attrs.onChange = function (evt) {
    var value = locals.isMultiple ? Array.prototype.slice.call(evt.target.options).filter(function (option) {
      return option.selected;
    }).map(function (option) {
      return option.value;
    }) : evt.target.value;
    locals.onChange(value);
  };

  if (locals.help) {
    attrs['aria-describedby'] = attrs['aria-describedby'] || attrs.id + '-tip';
  }

  var options = locals.options.map(function (x) {
    return x.label ? _bootstrap2['default'].getOptGroup(x) : _bootstrap2['default'].getOption(x);
  });

  var control = {
    tag: 'select',
    attrs: attrs,
    children: options
  };

  var horizontal = config.horizontal;
  var label = getLabel({
    label: locals.label,
    htmlFor: attrs.id,
    breakpoints: config.horizontal
  });
  var error = getError(locals);
  var help = getHelp(locals);
  var children = [label, control, error, help];

  if (horizontal) {
    children = [label, {
      tag: 'div',
      attrs: {
        className: label ? horizontal.getInputClassName() : horizontal.getOffsetClassName()
      },
      children: [control, error, help]
    }];
  }

  return _bootstrap2['default'].getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children: children
  });
}

function radio(locals) {

  var config = new RadioConfig(locals.config || noobj);

  var id = locals.attrs.id;
  var onChange = function onChange(evt) {
    return locals.onChange(evt.target.value);
  };

  var controls = locals.options.map(function (option, i) {

    var attrs = _t2['default'].mixin({}, locals.attrs);
    attrs.type = 'radio';
    attrs.checked = option.value === locals.value;
    attrs.disabled = locals.disabled;
    attrs.value = option.value;
    attrs.autoFocus = attrs.autoFocus && i === 0;
    attrs.id = '' + id + '_' + i;
    attrs['aria-describedby'] = attrs['aria-describedby'] || (locals.label ? id : null);
    attrs.onChange = onChange;

    return _bootstrap2['default'].getRadio(attrs, option.text, option.value);
  });

  var horizontal = config.horizontal;
  var label = getLabel({
    label: locals.label,
    id: id,
    breakpoints: config.horizontal
  });
  var error = getError(locals);
  var help = getHelp(locals);
  var children = [label, controls, error, help];

  if (horizontal) {
    children = [label, {
      tag: 'div',
      attrs: {
        className: label ? horizontal.getInputClassName() : horizontal.getOffsetClassName()
      },
      children: [controls, error, help]
    }];
  }

  return _bootstrap2['default'].getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children: children
  });
}

function range(n) {
  var result = [];
  for (var i = 1; i <= n; i++) {
    result.push(i);
  }
  return result;
}

function padLeft(x, len) {
  var str = String(x);
  var times = len - str.length;
  for (var i = 0; i < times; i++) {
    str = '0' + str;
  }
  return str;
}

function toOption(value, text) {
  return {
    tag: 'option',
    attrs: { value: value + '' },
    children: text
  };
}

var nullOption = [toOption('', '-')];

var days = nullOption.concat(range(31).map(function (i) {
  return toOption(i, padLeft(i, 2));
}));

var months = nullOption.concat(range(12).map(function (i) {
  return toOption(i - 1, padLeft(i, 2));
}));

function date(locals) {

  var config = new DateConfig(locals.config || noobj);
  var value = locals.value.slice();

  function onDayChange(evt) {
    value[2] = evt.target.value === '-' ? null : evt.target.value;
    locals.onChange(value);
  }

  function onMonthChange(evt) {
    value[1] = evt.target.value === '-' ? null : evt.target.value;
    locals.onChange(value);
  }

  function onYearChange(evt) {
    value[0] = evt.target.value.trim() === '' ? null : evt.target.value.trim();
    locals.onChange(value);
  }

  var parts = {

    D: {
      tag: 'li',
      key: 'D',
      children: {
        tag: 'select',
        attrs: {
          className: {
            'form-control': true
          },
          value: value[2]
        },
        events: {
          change: onDayChange
        },
        children: days
      }
    },

    M: {
      tag: 'li',
      key: 'M',
      children: {
        tag: 'select',
        attrs: {
          className: {
            'form-control': true
          },
          value: value[1]
        },
        events: {
          change: onMonthChange
        },
        children: months
      }
    },

    YY: {
      tag: 'li',
      key: 'YY',
      children: {
        tag: 'input',
        attrs: {
          type: 'text',
          size: 5,
          className: {
            'form-control': true
          },
          value: value[0]
        },
        events: {
          change: onYearChange
        }
      }
    }

  };

  var control = {
    tag: 'ul',
    attrs: {
      className: {
        'nav nav-pills': true
      }
    },
    children: locals.order.map(function (id) {
      return parts[id];
    })
  };

  var horizontal = config.horizontal;
  var label = getLabel({
    label: locals.label,
    id: locals.id,
    breakpoints: config.horizontal
  });
  var error = getError(locals);
  var help = getHelp(locals);
  var children = [label, control, error, help];

  if (horizontal) {
    children = [label, {
      tag: 'div',
      attrs: {
        className: label ? horizontal.getInputClassName() : horizontal.getOffsetClassName()
      },
      children: [control, error, help]
    }];
  }

  return _bootstrap2['default'].getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    hasError: locals.hasError,
    children: children
  });
}

function struct(locals) {

  var config = new StructConfig(locals.config || noobj);
  var children = [];

  if (locals.help) {
    children.push(_bootstrap2['default'].getAlert({
      children: locals.help
    }));
  }

  if (locals.error && locals.hasError) {
    children.push(_bootstrap2['default'].getAlert({
      type: 'danger',
      children: locals.error
    }));
  }

  children = children.concat(locals.order.map(function (name) {
    return locals.inputs[name];
  }));

  var className = null;
  if (config.horizontal) {
    className = config.horizontal.getFieldsetClassName();
  }
  if (locals.className) {
    className = className || {};
    className[locals.className] = true;
  }

  return _bootstrap2['default'].getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    children: _bootstrap2['default'].getFieldset({
      className: className,
      disabled: locals.disabled,
      legend: locals.label,
      children: children
    })
  });
}

function list(locals) {

  var config = new ListConfig(locals.config || noobj);
  var children = [];

  if (locals.help) {
    children.push(_bootstrap2['default'].getAlert({
      children: locals.help
    }));
  }

  if (locals.error && locals.hasError) {
    children.push(_bootstrap2['default'].getAlert({
      type: 'danger',
      children: locals.error
    }));
  }

  children = children.concat(locals.items.map(function (item) {
    if (item.buttons.length === 0) {
      return _bootstrap2['default'].getRow({
        key: item.key,
        children: [_bootstrap2['default'].getCol({
          breakpoints: { xs: 12 },
          children: item.input
        })]
      });
    }
    return _bootstrap2['default'].getRow({
      key: item.key,
      children: [_bootstrap2['default'].getCol({
        breakpoints: { sm: 8, xs: 6 },
        children: item.input
      }), _bootstrap2['default'].getCol({
        breakpoints: { sm: 4, xs: 6 },
        children: _bootstrap2['default'].getButtonGroup(item.buttons.map(function (button, i) {
          return _bootstrap2['default'].getButton({
            click: button.click,
            key: i,
            label: button.label
          });
        }))
      })]
    });
  }));

  if (locals.add) {
    children.push(_bootstrap2['default'].getButton(locals.add));
  }

  var fieldsetClassName = null;
  if (config.horizontal) {
    fieldsetClassName = config.horizontal.getFieldsetClassName();
  }
  if (locals.className) {
    fieldsetClassName = fieldsetClassName || {};
    fieldsetClassName[locals.className] = true;
  }

  return _bootstrap2['default'].getFormGroup({
    className: 'form-group-depth-' + locals.path.length,
    children: _bootstrap2['default'].getFieldset({
      className: fieldsetClassName,
      disabled: locals.disabled,
      legend: locals.label,
      children: children
    })
  });
}

},{"tcomb-validation":21,"uvdom-bootstrap":23}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.getOptionsOfEnum = getOptionsOfEnum;
exports.getTypeInfo = getTypeInfo;
exports.humanize = humanize;
exports.merge = merge;
exports.move = move;
exports.uuid = uuid;

var _mixin = require('tcomb-validation');

'use strict';

function getOptionsOfEnum(type) {
  var enums = type.meta.map;
  return Object.keys(enums).map(function (value) {
    return {
      value: value,
      text: enums[value]
    };
  });
}

function getTypeInfo(type) {

  var innerType = type;
  var isMaybe = false;
  var isSubtype = false;
  var kind;

  while (innerType) {
    kind = innerType.meta.kind;
    if (kind === 'maybe') {
      isMaybe = true;
      innerType = innerType.meta.type;
      continue;
    }
    if (kind === 'subtype') {
      isSubtype = true;
      innerType = innerType.meta.type;
      continue;
    }
    break;
  }

  return {
    isMaybe: isMaybe,
    isSubtype: isSubtype,
    innerType: innerType
  };
}

// thanks to https://github.com/epeli/underscore.string

function underscored(s) {
  return s.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function humanize(s) {
  return capitalize(underscored(s).replace(/_id$/, '').replace(/_/g, ' '));
}

function merge(a, b) {
  return _mixin.mixin(_mixin.mixin({}, a), b, true);
}

function move(arr, fromIndex, toIndex) {
  var element = arr.splice(fromIndex, 1)[0];
  arr.splice(toIndex, 0, element);
  return arr;
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : r & 3 | 8;
    return v.toString(16);
  });
}

},{"tcomb-validation":21}],4:[function(require,module,exports){
function classNames() {
	var classes = '';
	var arg;

	for (var i = 0; i < arguments.length; i++) {
		arg = arguments[i];
		if (!arg) {
			continue;
		}

		if ('string' === typeof arg || 'number' === typeof arg) {
			classes += ' ' + arg;
		} else if (Object.prototype.toString.call(arg) === '[object Array]') {
			classes += ' ' + classNames.apply(null, arg);
		} else if ('object' === typeof arg) {
			for (var key in arg) {
				if (!arg.hasOwnProperty(key) || !arg[key]) {
					continue;
				}
				classes += ' ' + key;
			}
		}
	}
	return classes.substr(1);
}

// safely export classNames in case the script is included directly on a page
if (typeof module !== 'undefined' && module.exports) {
	module.exports = classNames;
}

},{}],5:[function(require,module,exports){

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
  storage = localstorage();

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

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

},{"./debug":6}],6:[function(require,module,exports){

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

},{"ms":7}],7:[function(require,module,exports){
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
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
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

},{}],8:[function(require,module,exports){
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
        props = t.mixin(props, x.props, true);
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
},{"tcomb":22}],9:[function(require,module,exports){
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

    process.on('exit', function (code) {
        // let the process exit cleanly.
        if (code !== 0) {
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
},{"./lib/default_stream":10,"./lib/results":11,"./lib/test":12,"_process":56,"defined":16,"through":20}],10:[function(require,module,exports){
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
},{"_process":56,"fs":46,"through":20}],11:[function(require,module,exports){
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
},{"_process":56,"events":52,"inherits":17,"object-inspect":18,"resumer":19,"through":20}],12:[function(require,module,exports){
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
    if (arguments.length >= 1 && !!err) {
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

    if (typeof expected === 'function' && caught) {
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
},{"_process":56,"deep-equal":13,"defined":16,"events":52,"inherits":17,"path":55}],13:[function(require,module,exports){
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
  return typeof a === typeof b;
}

},{"./lib/is_arguments.js":14,"./lib/keys.js":15}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
exports = module.exports = typeof Object.keys === 'function'
  ? Object.keys : shim;

exports.shim = shim;
function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}

},{}],16:[function(require,module,exports){
module.exports = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) return arguments[i];
    }
};

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
module.exports = function inspect_ (obj, opts, depth, seen) {
    if (!opts) opts = {};
    
    var maxDepth = opts.depth === undefined ? 5 : opts.depth;
    if (depth === undefined) depth = 0;
    if (depth >= maxDepth && maxDepth > 0
    && obj && typeof obj === 'object') {
        return '[Object]';
    }
    
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
        s += '</' + String(obj.nodeName).toLowerCase() + '>';
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
    else if (isError(obj)) {
        var parts = [];
        for (var key in obj) {
            if (!has(obj, key)) continue;
            
            if (/[^\w$]/.test(key)) {
                parts.push(inspect(key) + ': ' + inspect(obj[key]));
            }
            else {
                parts.push(key + ': ' + inspect(obj[key]));
            }
        }
        if (parts.length === 0) return '[' + obj + ']';
        return '{ [' + obj + '] ' + parts.join(', ') + ' }';
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

function isArray (obj) { return toStr(obj) === '[object Array]' }
function isDate (obj) { return toStr(obj) === '[object Date]' }
function isRegExp (obj) { return toStr(obj) === '[object RegExp]' }
function isError (obj) { return toStr(obj) === '[object Error]' }

function has (obj, key) {
    if (!{}.hasOwnProperty) return key in obj;
    return {}.hasOwnProperty.call(obj, key);
}

function toStr (obj) {
    return Object.prototype.toString.call(obj);
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
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string'
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

},{}],19:[function(require,module,exports){
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
},{"_process":56,"through":20}],20:[function(require,module,exports){
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
    if(data === null) _ended = true
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
},{"_process":56,"stream":68}],21:[function(require,module,exports){
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd && typeof __fbBatchedBridgeConfig === 'undefined') {
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
  var format = t.format;

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

  function validate(x, type, path) {
    return new ValidationResult(recurse(x, type, path || []));
  }

  function recurse(x, type, path) {
    return validators[type.meta.kind](x, type, path);
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
  t.mixin(t, {
    ValidationError: ValidationError,
    ValidationResult: ValidationResult,
    validate: validate
  });

  return t;

}));

},{"tcomb":22}],22:[function(require,module,exports){
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd && typeof __fbBatchedBridgeConfig === 'undefined') {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.t = factory();
  }
}(this, function () {

  'use strict';

  function fail(message) {
    throw new TypeError(message);
  }

  function assert(guard, message) {
    if (guard !== true) {
      message = message ? format.apply(null, slice.call(arguments, 1)) : 'assert failed';
      exports.fail(message);
    }
  }

  //
  // utils
  //

  var slice = Array.prototype.slice;

  function mixin(target, source, overwrite) {
    if (Nil.is(source)) { return target; }
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

  function getFunctionName(f) {
    assert(typeof f === 'function', 'Invalid argument `f` = `%s` supplied to `getFunctionName()`', f);
    return f.displayName || f.name || format('<function%s>', f.length);
  }

  function replacer(key, value) {
    return Func.is(value) ? getFunctionName(value) : value;
  }

  format.formatters = {
    s: function (x) { return String(x); },
    j: function (x) {
      try { // handle circular references
        return JSON.stringify(x, replacer);
      } catch (e) {
        return String(x);
      }
    }
  };

  function getTypeName(type) {
    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `getTypeName()`', type);
    return type.meta.name;
  }

  function blockNew(x, type) {
    assert(!(x instanceof type), 'Operator `new` is forbidden for type `%s`', getTypeName(type));
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
    '$apply': function (f, value) {
      assert(Func.is(f));
      return f(value);
    },
    '$push': function (elements, arr) {
      assert(Arr.is(elements));
      assert(Arr.is(arr));
      return arr.concat(elements);
    },
    '$remove': function (keys, obj) {
      assert(Arr.is(keys));
      assert(Obj.is(obj));
      for (var i = 0, len = keys.length ; i < len ; i++ ) {
        delete obj[keys[i]];
      }
      return obj;
    },
    '$set': function (value) {
      return value;
    },
    '$splice': function (splices, arr) {
      assert(list(Arr).is(splices));
      assert(Arr.is(arr));
      return splices.reduce(function (acc, splice) {
        acc.splice.apply(acc, splice);
        return acc;
      }, arr);
    },
    '$swap': function (config, arr) {
      assert(Obj.is(config));
      assert(Num.is(config.from));
      assert(Num.is(config.to));
      assert(Arr.is(arr));
      var element = arr[config.to];
      arr[config.to] = arr[config.from];
      arr[config.from] = element;
      return arr;
    },
    '$unshift': function (elements, arr) {
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

    assert(typeof name === 'string', 'Invalid argument `name` = `%s` supplied to `irreducible()`', name);
    assert(typeof is === 'function', 'Invalid argument `is` = `%s` supplied to `irreducible()`', is);

    function Irreducible(value) {
      blockNew(this, Irreducible);
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

  var Any = irreducible('Any', function () {
    return true;
  });

  var Nil = irreducible('Nil', function (x) {
    return x === null || x === void 0;
  });

  var Str = irreducible('Str', function (x) {
    return typeof x === 'string';
  });

  var Num = irreducible('Num', function (x) {
    return typeof x === 'number' && isFinite(x) && !isNaN(x);
  });

  var Bool = irreducible('Bool', function (x) {
    return x === true || x === false;
  });

  var Arr = irreducible('Arr', function (x) {
    return x instanceof Array;
  });

  var Obj = irreducible('Obj', function (x) {
    return !Nil.is(x) && typeof x === 'object' && !Arr.is(x);
  });

  var Func = irreducible('Func', function (x) {
    return typeof x === 'function';
  });

  var Err = irreducible('Err', function (x) {
    return x instanceof Error;
  });

  var Re = irreducible('Re', function (x) {
    return x instanceof RegExp;
  });

  var Dat = irreducible('Dat', function (x) {
    return x instanceof Date;
  });

  var Type = irreducible('Type', function (x) {
    return Func.is(x) && Obj.is(x.meta);
  });

  function struct(props, name) {

    assert(dict(Str, Type).is(props), 'Invalid argument `props` = `%s` supplied to `struct` combinator', props);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `struct` combinator', name);
    name = name || format('{%s}', Object.keys(props).map(function (prop) {
      return format('%s: %s', prop, getTypeName(props[prop]));
    }).join(', '));

    function Struct(value, mut) {
      // makes Struct idempotent
      if (Struct.is(value)) {
        return value;
      }
      assert(Obj.is(value), 'Invalid argument `value` = `%s` supplied to struct type `%s`', value, name);
      // makes `new` optional
      if (!(this instanceof Struct)) {
        return new Struct(value, mut);
      }
      for (var k in props) {
        if (props.hasOwnProperty(k)) {
          var expected = props[k];
          var actual = value[k];
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

    Struct.is = function (x) {
      return x instanceof Struct;
    };

    Struct.update = function (instance, spec) {
      return new Struct(exports.update(instance, spec));
    };

    Struct.extend = function (arr, name) {
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

    assert(list(Type).is(types), 'Invalid argument `types` = `%s` supplied to `union` combinator', types);
    var len = types.length;
    var defaultName = types.map(getTypeName).join(' | ');
    assert(len >= 2, 'Invalid argument `types` = `%s` supplied to `union` combinator, provide at least two types', defaultName);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `union` combinator', name);
    name = name || defaultName;

    function Union(value, mut) {
      blockNew(this, Union);
      assert(Func.is(Union.dispatch), 'Unimplemented `dispatch()` function for union type `%s`', name);
      var type = Union.dispatch(value);
      assert(Type.is(type), 'The `dispatch()` function of union type `%s` returns no type constructor', name);
      return type(value, mut);
    }

    Union.meta = {
      kind: 'union',
      types: types,
      name: name
    };

    Union.displayName = name;

    Union.is = function (x) {
      return types.some(function (type) {
        return type.is(x);
      });
    };

    // default dispatch implementation
    Union.dispatch = function (x) {
      for (var i = 0 ; i < len ; i++ ) {
        if (types[i].is(x)) {
          return types[i];
        }
      }
    };

    return Union;
  }

  function maybe(type, name) {

    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `maybe` combinator', type);
    // makes the combinator idempotent and handle Any, Nil
    if (type.meta.kind === 'maybe' || type === Any || type === Nil) {
      return type;
    }
    assert(Nil.is(name) || Str.is(name), 'Invalid argument `name` = `%s` supplied to `maybe` combinator', name);
    name = name || ('?' + getTypeName(type));

    function Maybe(value, mut) {
      blockNew(this, Maybe);
      return Nil.is(value) ? null : type(value, mut);
    }

    Maybe.meta = {
      kind: 'maybe',
      type: type,
      name: name
    };

    Maybe.displayName = name;

    Maybe.is = function (x) {
      return Nil.is(x) || type.is(x);
    };

    return Maybe;
  }

  function enums(map, name) {

    assert(Obj.is(map), 'Invalid argument `map` = `%s` supplied to `enums` combinator', map);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `enums` combinator', name);
    var keys = Object.keys(map); // cache enums
    name = name || keys.map(function (k) { return JSON.stringify(k); }).join(' | ');

    function Enums(value) {
      blockNew(this, Enums);
      assert(Enums.is(value), 'Invalid argument `value` = `%s` supplied to enums type `%s`, expected one of %j', value, name, keys);
      return value;
    }

    Enums.meta = {
      kind: 'enums',
      map: map,
      name: name
    };

    Enums.displayName = name;

    Enums.is = function (x) {
      return Str.is(x) && map.hasOwnProperty(x);
    };

    return Enums;
  }

  enums.of = function (keys, name) {
    keys = Str.is(keys) ? keys.split(' ') : keys;
    var value = {};
    keys.forEach(function (k) {
      value[k] = k;
    });
    return enums(value, name);
  };

  function tuple(types, name) {

    assert(list(Type).is(types), 'Invalid argument `types` = `%s` supplied to `tuple` combinator', types);
    var len = types.length; // cache types length
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `tuple` combinator', name);
    name = name || format('[%s]', types.map(getTypeName).join(', '));

    function isTuple(x) {
      return types.every(function (type, i) {
        return type.is(x[i]);
      });
    }

    function Tuple(value, mut) {
      assert(Arr.is(value) && value.length === len, 'Invalid argument `value` = `%s` supplied to tuple type `%s`, expected an `Arr` of length `%s`', value, name, len);
      var frozen = (mut !== true);
      // makes Tuple idempotent
      if (isTuple(value) && Object.isFrozen(value) === frozen) {
        return value;
      }
      var arr = [];
      for (var i = 0 ; i < len ; i++) {
        var expected = types[i];
        var actual = value[i];
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

    Tuple.is = function (x) {
      return Arr.is(x) && x.length === len && isTuple(x);
    };

    Tuple.update = function (instance, spec) {
      return Tuple(exports.update(instance, spec));
    };

    return Tuple;
  }

  function subtype(type, predicate, name) {

    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `subtype` combinator', type);
    assert(Func.is(predicate), 'Invalid argument `predicate` = `%s` supplied to `subtype` combinator', predicate);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `subtype` combinator', name);
    name = name || format('{%s | %s}', getTypeName(type), getFunctionName(predicate));

    function Subtype(value, mut) {
      blockNew(this, Subtype);
      var x = type(value, mut);
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

    Subtype.is = function (x) {
      return type.is(x) && predicate(x);
    };

    Subtype.update = function (instance, spec) {
      return Subtype(exports.update(instance, spec));
    };

    return Subtype;
  }

  function list(type, name) {

    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `list` combinator', type);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `list` combinator', name);
    name = name || format('Array<%s>', getTypeName(type));

    function isList(x) {
      return x.every(type.is);
    }

    function List(value, mut) {
      assert(Arr.is(value), 'Invalid argument `value` = `%s` supplied to list type `%s`', value, name);
      var frozen = (mut !== true);
      // makes List idempotent
      if (isList(value) && Object.isFrozen(value) === frozen) {
        return value;
      }
      var arr = [];
      for (var i = 0, len = value.length ; i < len ; i++ ) {
        var actual = value[i];
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

    List.is = function (x) {
      return Arr.is(x) && isList(x);
    };

    List.update = function (instance, spec) {
      return List(exports.update(instance, spec));
    };

    return List;
  }

  function dict(domain, codomain, name) {

    assert(Type.is(domain), 'Invalid argument `domain` = `%s` supplied to `dict` combinator', domain);
    assert(Type.is(codomain), 'Invalid argument `codomain` = `%s` supplied to `dict` combinator', codomain);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `dict` combinator', name);
    name = name || format('{[key:%s]: %s}', getTypeName(domain), getTypeName(codomain));

    function isDict(x) {
      for (var k in x) {
        if (x.hasOwnProperty(k)) {
          if (!domain.is(k) || !codomain.is(x[k])) { return false; }
        }
      }
      return true;
    }

    function Dict(value, mut) {
      assert(Obj.is(value), 'Invalid argument `value` = `%s` supplied to dict type `%s`', value, name);
      var frozen = (mut !== true);
      // makes Dict idempotent
      if (isDict(value) && Object.isFrozen(value) === frozen) {
        return value;
      }
      var obj = {};
      for (var k in value) {
        if (value.hasOwnProperty(k)) {
          k = domain(k);
          var actual = value[k];
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

    Dict.is = function (x) {
      return Obj.is(x) && isDict(x);
    };

    Dict.update = function (instance, spec) {
      return Dict(exports.update(instance, spec));
    };

    return Dict;
  }

  function isInstrumented(f) {
    return Func.is(f) && Obj.is(f.type);
  }

  function func(domain, codomain, name) {

    // handle handy syntax for unary functions
    domain = Arr.is(domain) ? domain : [domain];
    assert(list(Type).is(domain), 'Invalid argument `domain` = `%s` supplied to `func` combinator', domain);
    assert(Type.is(codomain), 'Invalid argument `codomain` = `%s` supplied to `func` combinator', codomain);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `func` combinator', name);
    name = name || format('(%s) => %s', domain.map(getTypeName).join(', '), getTypeName(codomain));
    var domainLen = domain.length; // cache the domain length

    function Func(value) {
      // automatically instrument the function
      if (!isInstrumented(value)) {
        return Func.of(value);
      }
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

    Func.is = function (x) {
      return isInstrumented(x) &&
        x.type.domain.length === domainLen &&
        x.type.domain.every(function (type, i) {
          return type === domain[i];
        }) &&
        x.type.codomain === codomain;
    };

    Func.of = function (f) {

      assert(typeof f === 'function');

      // makes Func.of idempotent
      if (Func.is(f)) {
        return f;
      }

      function fn() {
        var args = slice.call(arguments);
        var len = args.length;
        var argsType = tuple(domain.slice(0, len));
        args = argsType(args);
        if (len === domainLen) {
          /* jshint validthis: true */
          return codomain(f.apply(this, args));
        } else {
          var curried = Function.prototype.bind.apply(f, [this].concat(args));
          var newdomain = func(domain.slice(len), codomain);
          return newdomain.of(curried);
        }
      }

      fn.type = {
        domain: domain,
        codomain: codomain,
        f: f
      };

      fn.displayName = getFunctionName(f);

      return fn;

    };

    return Func;

  }

  var exports = {
    format: format,
    getFunctionName: getFunctionName,
    getTypeName: getTypeName,
    mixin: mixin,
    slice: slice,
    shallowCopy: shallowCopy,
    update: update,
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

  return exports;

}));

},{}],23:[function(require,module,exports){
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
  getStatic: require('./lib/getStatic')
};
},{"./lib/getAddon":24,"./lib/getAlert":25,"./lib/getBreakpoints":26,"./lib/getButton":27,"./lib/getButtonGroup":28,"./lib/getCheckbox":29,"./lib/getCol":30,"./lib/getErrorBlock":31,"./lib/getFieldset":32,"./lib/getFormGroup":33,"./lib/getHelpBlock":34,"./lib/getInputGroup":35,"./lib/getLabel":36,"./lib/getOffsets":37,"./lib/getOptGroup":38,"./lib/getOption":39,"./lib/getRadio":40,"./lib/getRow":41,"./lib/getStatic":42}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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


},{}],29:[function(require,module,exports){
'use strict';

function getCheckbox(attrs, label) {
  return {
    tag: 'div',
    attrs: {
      className: {
        'checkbox': true,
        'disabled': attrs.disabled
      }
    },
    children: {
      tag: 'label',
      attrs: {
        htmlFor: attrs.id
      },
      children: [
        {
          tag: 'input',
          attrs: attrs
        },
        ' ',
        label
      ]
    }
  };
}

module.exports = getCheckbox;
},{}],30:[function(require,module,exports){
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
},{"./getBreakpoints":26}],31:[function(require,module,exports){
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


},{}],32:[function(require,module,exports){
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


},{}],33:[function(require,module,exports){
'use strict';

function getFormGroup(opts) {

  var className = {
    'form-group': true,
    'has-error': opts.hasError
  };
  if (opts.className) {
    className[opts.className] = true;
  }

  return {
    tag: 'div',
    attrs: {
      className: className
    },
    children: opts.children
  };
}

module.exports = getFormGroup;
},{}],34:[function(require,module,exports){
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


},{}],35:[function(require,module,exports){
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
},{}],36:[function(require,module,exports){
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


},{"./mixin":43}],37:[function(require,module,exports){
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
},{}],38:[function(require,module,exports){
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


},{"./getOption":39}],39:[function(require,module,exports){
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


},{}],40:[function(require,module,exports){
'use strict';

function getRadio(attrs, text, key) {
  return {
    tag: 'div',
    attrs: {
      className: {
        'radio': true,
        'disabled': attrs.disabled
      }
    },
    children: {
      tag: 'label',
      attrs: {
        htmlFor: attrs.id,
      },
      children: [
        {
          tag: 'input',
          attrs: attrs
        },
        ' ',
        text
      ]
    },
    key: key
  };
}

module.exports = getRadio;
},{}],41:[function(require,module,exports){
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
},{}],42:[function(require,module,exports){
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
},{}],43:[function(require,module,exports){
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
},{}],44:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],45:[function(require,module,exports){
'use strict';

var React = require('react');
var cx = require('classnames');

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
},{"classnames":44,"react":"react"}],46:[function(require,module,exports){

},{}],47:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],48:[function(require,module,exports){
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
    return arr.foo() === 42 && // typed array instances can be augmented
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
function Buffer (subject, encoding) {
  var self = this
  if (!(self instanceof Buffer)) return new Buffer(subject, encoding)

  var type = typeof subject
  var length

  if (type === 'number') {
    length = +subject
  } else if (type === 'string') {
    length = Buffer.byteLength(subject, encoding)
  } else if (type === 'object' && subject !== null) {
    // assume object is array-like
    if (subject.type === 'Buffer' && isArray(subject.data)) subject = subject.data
    length = +subject.length
  } else {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (length > kMaxLength) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum size: 0x' +
      kMaxLength.toString(16) + ' bytes')
  }

  if (length < 0) length = 0
  else length >>>= 0 // coerce to uint32

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    self = Buffer._augment(new Uint8Array(length)) // eslint-disable-line consistent-this
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    self.length = length
    self._isBuffer = true
  }

  var i
  if (Buffer.TYPED_ARRAY_SUPPORT && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    self._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    if (Buffer.isBuffer(subject)) {
      for (i = 0; i < length; i++) {
        self[i] = subject.readUInt8(i)
      }
    } else {
      for (i = 0; i < length; i++) {
        self[i] = ((subject[i] % 256) + 256) % 256
      }
    }
  } else if (type === 'string') {
    self.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer.TYPED_ARRAY_SUPPORT) {
    for (i = 0; i < length; i++) {
      self[i] = 0
    }
  }

  if (length > 0 && length <= Buffer.poolSize) self.parent = rootParent

  return self
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

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

Buffer.isEncoding = function isEncoding (encoding) {
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

Buffer.concat = function concat (list, totalLength) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

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

Buffer.byteLength = function byteLength (str, encoding) {
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
Buffer.prototype.toString = function toString (encoding, start, end) {
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
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function set (v, offset) {
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
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
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
  var charsWritten = blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
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

  if (length < 0 || offset < 0 || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

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

Buffer.prototype.toJSON = function toJSON () {
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

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) >>> 0 & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) >>> 0 & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
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

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = value
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkInt(
      this, value, offset, byteLength,
      Math.pow(2, 8 * byteLength - 1) - 1,
      -Math.pow(2, 8 * byteLength - 1)
    )
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkInt(
      this, value, offset, byteLength,
      Math.pow(2, 8 * byteLength - 1) - 1,
      -Math.pow(2, 8 * byteLength - 1)
    )
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = value
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, target_start, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (target_start >= target.length) target_start = target.length
  if (!target_start) target_start = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (target_start < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - target_start < end - start) {
    end = target.length - target_start + start
  }

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
Buffer.prototype.fill = function fill (value, start, end) {
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
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
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
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
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
  arr.indexOf = BP.indexOf
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

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []
  var i = 0

  for (; i < length; i++) {
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
        } else {
          // valid surrogate pair
          codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
          leadSurrogate = null
        }
      } else {
        // no lead yet

        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else {
          // valid lead
          leadSurrogate = codePoint
          continue
        }
      }
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
      leadSurrogate = null
    }

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x200000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
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

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
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

},{"base64-js":49,"ieee754":50,"is-array":51}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
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

},{}],51:[function(require,module,exports){

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

},{}],52:[function(require,module,exports){
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

},{}],53:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"dup":17}],54:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],55:[function(require,module,exports){
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
},{"_process":56}],56:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

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
process.umask = function() { return 0; };

},{}],57:[function(require,module,exports){
module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":58}],58:[function(require,module,exports){
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
},{"./_stream_readable":60,"./_stream_writable":62,"_process":56,"core-util-is":63,"inherits":53}],59:[function(require,module,exports){
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

},{"./_stream_transform":61,"core-util-is":63,"inherits":53}],60:[function(require,module,exports){
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


/*<replacement>*/
var debug = require('util');
if (debug && debug.debuglog) {
  debug = debug.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/


util.inherits(Readable, Stream);

function ReadableState(options, stream) {
  var Duplex = require('./_stream_duplex');

  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
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

  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.readableObjectMode;

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
  var Duplex = require('./_stream_duplex');

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

  if (util.isString(chunk) && !state.objectMode) {
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
  } else if (util.isNullOrUndefined(chunk)) {
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

      if (!addToFront)
        state.reading = false;

      // if we want the data now, just emit it.
      if (state.flowing && state.length === 0 && !state.sync) {
        stream.emit('data', chunk);
        stream.read(0);
      } else {
        // update the buffer info.
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront)
          state.buffer.unshift(chunk);
        else
          state.buffer.push(chunk);

        if (state.needReadable)
          emitReadable(stream);
      }

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
  return this;
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

  if (isNaN(n) || util.isNull(n)) {
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
  debug('read', n);
  var state = this._readableState;
  var nOrig = n;

  if (!util.isNumber(n) || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended)
      endReadable(this);
    else
      emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0)
      endReadable(this);
    return null;
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
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  }

  if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read pushed data synchronously, then `reading` will be false,
  // and we need to re-evaluate how much data we can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  var ret;
  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (util.isNull(ret)) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we tried to read() past the EOF, then emit end on the next tick.
  if (nOrig !== n && state.ended && state.length === 0)
    endReadable(this);

  if (!util.isNull(ret))
    this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!util.isBuffer(chunk) &&
      !util.isString(chunk) &&
      !util.isNullOrUndefined(chunk) &&
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

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync)
      process.nextTick(function() {
        emitReadable_(stream);
      });
    else
      emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
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
    debug('maybeReadMore read 0');
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
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

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
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain &&
        (!dest._writableState || dest._writableState.needDrain))
      ondrain();
  }

  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    if (false === ret) {
      debug('false write response, pause',
            src._readableState.awaitDrain);
      src._readableState.awaitDrain++;
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
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
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain)
      state.awaitDrain--;
    if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
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

  // If listening to data, and it has not explicitly been paused,
  // then call resume to start the flow of data on the next tick.
  if (ev === 'data' && false !== this._readableState.flowing) {
    this.resume();
  }

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        var self = this;
        process.nextTick(function() {
          debug('readable nexttick read 0');
          self.read(0);
        });
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
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    if (!state.reading) {
      debug('resume read 0');
      this.read(0);
    }
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(function() {
      resume_(stream, state);
    });
  }
}

function resume_(stream, state) {
  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading)
    stream.read(0);
}

Readable.prototype.pause = function() {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  if (state.flowing) {
    do {
      var chunk = stream.read();
    } while (null !== chunk && state.flowing);
  }
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    debug('wrapped data');
    if (state.decoder)
      chunk = state.decoder.write(chunk);
    if (!chunk || !state.objectMode && !chunk.length)
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
    if (util.isFunction(stream[i]) && util.isUndefined(this[i])) {
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
    debug('wrapped _read', n);
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

  if (!state.endEmitted) {
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
},{"./_stream_duplex":58,"_process":56,"buffer":48,"core-util-is":63,"events":52,"inherits":53,"isarray":54,"stream":68,"string_decoder/":69,"util":47}],61:[function(require,module,exports){
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

  if (!util.isNullOrUndefined(data))
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

  this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('prefinish', function() {
    if (util.isFunction(this._flush))
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

  if (!util.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {
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
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

},{"./_stream_duplex":58,"core-util-is":63,"inherits":53}],62:[function(require,module,exports){
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
  var Duplex = require('./_stream_duplex');

  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.writableObjectMode;

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

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
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

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

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
  if (!util.isBuffer(chunk) &&
      !util.isString(chunk) &&
      !util.isNullOrUndefined(chunk) &&
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

  if (util.isFunction(encoding)) {
    cb = encoding;
    encoding = null;
  }

  if (util.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (!util.isFunction(cb))
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function() {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function() {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing &&
        !state.corked &&
        !state.finished &&
        !state.bufferProcessing &&
        state.buffer.length)
      clearBuffer(this, state);
  }
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      util.isString(chunk)) {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  if (util.isBuffer(chunk))
    encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret)
    state.needDrain = true;

  if (state.writing || state.corked)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, false, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev)
    stream._writev(chunk, state.onwrite);
  else
    stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    process.nextTick(function() {
      state.pendingcb--;
      cb(er);
    });
  else {
    state.pendingcb--;
    cb(er);
  }

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

    if (!finished &&
        !state.corked &&
        !state.bufferProcessing &&
        state.buffer.length) {
      clearBuffer(stream, state);
    }

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
  state.pendingcb--;
  cb();
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

  if (stream._writev && state.buffer.length > 1) {
    // Fast case, write everything using _writev()
    var cbs = [];
    for (var c = 0; c < state.buffer.length; c++)
      cbs.push(state.buffer[c].callback);

    // count the one we are adding, as well.
    // TODO(isaacs) clean this up
    state.pendingcb++;
    doWrite(stream, state, true, state.length, state.buffer, '', function(err) {
      for (var i = 0; i < cbs.length; i++) {
        state.pendingcb--;
        cbs[i](err);
      }
    });

    // Clear buffer
    state.buffer = [];
  } else {
    // Slow case, write chunks one-by-one
    for (var c = 0; c < state.buffer.length; c++) {
      var entry = state.buffer[c];
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);

      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        c++;
        break;
      }
    }

    if (c < state.buffer.length)
      state.buffer = state.buffer.slice(c);
    else
      state.buffer.length = 0;
  }

  state.bufferProcessing = false;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));

};

Writable.prototype._writev = null;

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (util.isFunction(chunk)) {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (util.isFunction(encoding)) {
    cb = encoding;
    encoding = null;
  }

  if (!util.isNullOrUndefined(chunk))
    this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

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

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else
      prefinish(stream, state);
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
},{"./_stream_duplex":58,"_process":56,"buffer":48,"core-util-is":63,"inherits":53,"stream":68}],63:[function(require,module,exports){
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
},{"buffer":48}],64:[function(require,module,exports){
module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":59}],65:[function(require,module,exports){
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = require('stream');
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":58,"./lib/_stream_passthrough.js":59,"./lib/_stream_readable.js":60,"./lib/_stream_transform.js":61,"./lib/_stream_writable.js":62,"stream":68}],66:[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":61}],67:[function(require,module,exports){
module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":62}],68:[function(require,module,exports){
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

},{"events":52,"inherits":53,"readable-stream/duplex.js":57,"readable-stream/passthrough.js":64,"readable-stream/readable.js":65,"readable-stream/transform.js":66,"readable-stream/writable.js":67}],69:[function(require,module,exports){
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

},{"buffer":48}],70:[function(require,module,exports){
module.exports={
  "name": "tcomb-form",
  "version": "0.5.0",
  "description": "React.js powered UI library for developing forms writing less code",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Compiling tests. Once finished open ./test/index.html in your browser...\" && watchify -t [babelify --stage 0 --loose] test/index.js -o test/browser.js  -v -x react",
    "start": "echo \"Compiling src -> lib...\" && babel ./src -d ./lib -w --stage 0 --loose",
    "dist": "browserify -r ./index.js:tcomb-form -x react | uglifyjs -c > ./dist/tcomb-form.js",
    "dev": "watchify -t [babelify --stage 0 --loose] dev/dev.jsx -o dev/dev.js -v -x react",
    "lint": "eslint . --ext .js --ext .jsx"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/gcanti/tcomb-form.git"
  },
  "author": "Giulio Canti <giulio.canti@gmail.com>",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/gcanti/tcomb-form/issues"
  },
  "homepage": "https://github.com/gcanti/tcomb-form",
  "peerDependencies": {
    "react": "^0.13.0",
    "tcomb-validation": "^1.0.3"
  },
  "dependencies": {
    "classnames": "^1.2.0",
    "debug": "^2.1.1",
    "uvdom": "^0.1.2",
    "uvdom-bootstrap": "^0.2.3"
  },
  "devDependencies": {
    "babel": "^5.1.10",
    "babel-eslint": "^3.0.1",
    "babelify": "^6.0.2",
    "eslint": "^0.19.0",
    "eslint-plugin-react": "^2.1.1",
    "react-vdom": "^0.2.3",
    "tape": "^4.0.0",
    "watchify": "^3.1.0"
  },
  "tags": [
    "form",
    "forms",
    "validation",
    "generation",
    "react",
    "react-component"
  ],
  "keywords": [
    "form",
    "forms",
    "validation",
    "generation",
    "react",
    "react-component"
  ]
}

},{}],71:[function(require,module,exports){
'use strict';

var tape = require('tape');
var t = require('tcomb');
var bootstrap = require('../../lib/templates/bootstrap');
var Checkbox = require('../../lib/components').Checkbox;
var React = require('react');
var vdom = require('react-vdom');
var util = require('./util');
var ctx = util.ctx;
var ctxPlaceholders = util.ctxPlaceholders;
var renderComponent = util.getRenderComponent(Checkbox);

var transformer = {
  format: function format(value) {
    return t.Str.is(value) ? value : value === true ? '1' : '0';
  },
  parse: function parse(value) {
    return value === '1';
  }
};

tape('Checkbox', function (tape) {

  tape.test('label', function (tape) {
    tape.plan(4);

    tape.strictEqual(new Checkbox({
      type: t.Bool,
      options: {},
      ctx: ctx
    }).getLocals().label, 'Default label', 'should have a default label');

    tape.strictEqual(new Checkbox({
      type: t.Bool,
      options: {},
      ctx: ctxPlaceholders
    }).getLocals().label, 'Default label', 'should have a default label even if auto !== labels');

    tape.strictEqual(new Checkbox({
      type: t.Bool,
      options: { label: 'mylabel' },
      ctx: ctx
    }).getLocals().label, 'mylabel', 'should handle label option as string');

    tape.deepEqual(vdom(new Checkbox({
      type: t.Bool,
      options: { label: React.DOM.i(null, 'JSX label') },
      ctx: ctx
    }).getLocals().label), { tag: 'i', attrs: {}, children: 'JSX label' }, 'should handle label option as JSX');
  });

  tape.test('help', function (tape) {
    tape.plan(2);

    tape.strictEqual(new Checkbox({
      type: t.Bool,
      options: { help: 'myhelp' },
      ctx: ctx
    }).getLocals().help, 'myhelp', 'should handle help option as string');

    tape.deepEqual(vdom(new Checkbox({
      type: t.Bool,
      options: { help: React.DOM.i(null, 'JSX help') },
      ctx: ctx
    }).getLocals().help), { tag: 'i', attrs: {}, children: 'JSX help' }, 'should handle help option as JSX');
  });

  tape.test('value', function (tape) {
    tape.plan(3);

    tape.strictEqual(new Checkbox({
      type: t.Bool,
      options: {},
      ctx: ctx
    }).getLocals().value, false, 'default value should be false');

    tape.strictEqual(new Checkbox({
      type: t.Bool,
      options: {},
      ctx: ctx,
      value: false
    }).getLocals().value, false, 'should handle value option');

    tape.strictEqual(new Checkbox({
      type: t.Bool,
      options: {},
      ctx: ctx,
      value: true
    }).getLocals().value, true, 'should handle value option');
  });

  tape.test('transformer', function (tape) {
    tape.plan(1);

    tape.strictEqual(new Checkbox({
      type: t.Bool,
      options: { transformer: transformer },
      ctx: ctx,
      value: true
    }).getLocals().value, '1', 'should handle transformer option (format)');
  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    var True = t.subtype(t.Bool, function (value) {
      return value === true;
    });

    tape.strictEqual(new Checkbox({
      type: True,
      options: {},
      ctx: ctx
    }).getLocals().hasError, false, 'default hasError should be false');

    tape.strictEqual(new Checkbox({
      type: True,
      options: { hasError: true },
      ctx: ctx
    }).getLocals().hasError, true, 'should handle hasError option');
  });

  tape.test('error', function (tape) {
    tape.plan(3);

    tape.strictEqual(new Checkbox({
      type: t.Bool,
      options: {},
      ctx: ctx
    }).getLocals().error, undefined, 'default error should be undefined');

    tape.strictEqual(new Checkbox({
      type: t.Bool,
      options: { error: 'myerror' },
      ctx: ctx
    }).getLocals().error, 'myerror', 'should handle error option');

    tape.strictEqual(new Checkbox({
      type: t.Bool,
      options: { error: function error(value) {
          return 'error: ' + value;
        } },
      ctx: ctx,
      value: 'a'
    }).getLocals().error, 'error: a', 'should handle error option as a function');
  });

  tape.test('template', function (tape) {
    tape.plan(2);

    tape.strictEqual(new Checkbox({
      type: t.Bool,
      options: {},
      ctx: ctx
    }).getTemplate(), bootstrap.checkbox, 'default template should be bootstrap.checkbox');

    var template = function template() {};

    tape.strictEqual(new Checkbox({
      type: t.Bool,
      options: { template: template },
      ctx: ctx
    }).getTemplate(), template, 'should handle template option');
  });

  if (typeof window !== 'undefined') {

    tape.test('validate', function (tape) {
      tape.plan(6);

      var result;

      // required type, default value
      result = renderComponent({
        type: t.Bool
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, false);

      // required type, setting a value
      result = renderComponent({
        type: t.Bool,
        value: true
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, true);

      result = renderComponent({
        type: t.Bool,
        options: { transformer: transformer },
        value: true
      }).validate();

      // 'should handle transformer option (parse)'
      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, true);
    });
  }
});

},{"../../lib/components":1,"../../lib/templates/bootstrap":2,"./util":77,"react":"react","react-vdom":8,"tape":9,"tcomb":22}],72:[function(require,module,exports){
'use strict';

var tape = require('tape');
var t = require('tcomb');
var bootstrap = require('../../lib/templates/bootstrap');
var Component = require('../../lib/components').Component;
var React = require('react');
var vdom = require('react-vdom');
var util = require('./util');
var ctx = util.ctx;

tape('Component', function (tape) {

  tape.test('typeInfo', function (tape) {
    tape.plan(3);

    var component = new Component({
      type: t.Str,
      options: {},
      ctx: ctx
    });

    tape.deepEqual(component.typeInfo, {
      isMaybe: false,
      isSubtype: false,
      innerType: t.Str
    });

    component = new Component({
      type: t.maybe(t.Str),
      options: {},
      ctx: ctx
    });

    tape.deepEqual(component.typeInfo, {
      isMaybe: true,
      isSubtype: false,
      innerType: t.Str
    });

    component = new Component({
      type: t.subtype(t.Str, function () {
        return true;
      }),
      options: {},
      ctx: ctx
    });

    tape.deepEqual(component.typeInfo, {
      isMaybe: false,
      isSubtype: true,
      innerType: t.Str
    });
  });

  tape.test('getId()', function (tape) {
    tape.plan(2);

    tape.strictEqual(t.Str.is(new Component({
      type: t.Str,
      options: {},
      ctx: ctx
    }).getId()), true, 'should return a random uuid');

    tape.strictEqual(new Component({
      type: t.Str,
      options: { attrs: { id: 'myid' } },
      ctx: ctx
    }).getId(), 'myid', 'should return a random uuid');
  });
});

},{"../../lib/components":1,"../../lib/templates/bootstrap":2,"./util":77,"react":"react","react-vdom":8,"tape":9,"tcomb":22}],73:[function(require,module,exports){
'use strict';

var tape = require('tape');
var t = require('tcomb');
var bootstrap = require('../../lib/templates/bootstrap');
var Radio = require('../../lib/components').Radio;
var React = require('react');
var vdom = require('react-vdom');
var util = require('./util');
var ctx = util.ctx;
var renderComponent = util.getRenderComponent(Radio);

var transformer = {
  format: function format(value) {
    return t.Str.is(value) ? value : value === true ? '1' : '0';
  },
  parse: function parse(value) {
    return value === '1';
  }
};

tape('Radio', function (tape) {

  var Country = t.enums({
    IT: 'Italy',
    FR: 'France',
    US: 'United States'
  });

  tape.test('label', function (tape) {
    tape.plan(4);

    tape.strictEqual(new Radio({
      type: Country,
      options: {},
      ctx: ctx
    }).getLocals().label, 'Default label', 'should have a default label');

    tape.strictEqual(new Radio({
      type: Country,
      options: { label: 'mylabel' },
      ctx: ctx
    }).getLocals().label, 'mylabel', 'should handle label option as string');

    tape.deepEqual(vdom(new Radio({
      type: Country,
      options: { label: React.DOM.i(null, 'JSX label') },
      ctx: ctx
    }).getLocals().label), { tag: 'i', attrs: {}, children: 'JSX label' }, 'should handle label option as JSX');

    tape.strictEqual(new Radio({
      type: t.maybe(Country),
      options: {},
      ctx: ctx
    }).getLocals().label, 'Default label (optional)', 'should handle optional types');
  });

  tape.test('help', function (tape) {
    tape.plan(2);

    tape.strictEqual(new Radio({
      type: Country,
      options: { help: 'myhelp' },
      ctx: ctx
    }).getLocals().help, 'myhelp', 'should handle help option as string');

    tape.deepEqual(vdom(new Radio({
      type: Country,
      options: { help: React.DOM.i(null, 'JSX help') },
      ctx: ctx
    }).getLocals().help), { tag: 'i', attrs: {}, children: 'JSX help' }, 'should handle help option as JSX');
  });

  tape.test('value', function (tape) {
    tape.plan(1);

    tape.strictEqual(new Radio({
      type: Country,
      options: {},
      ctx: ctx,
      value: 'a'
    }).getLocals().value, 'a', 'should handle value option');
  });

  tape.test('transformer', function (tape) {
    tape.plan(1);

    tape.strictEqual(new Radio({
      type: t.maybe(t.Bool),
      options: {
        transformer: transformer,
        options: [{ value: '0', text: 'No' }, { value: '1', text: 'Yes' }]
      },
      ctx: ctx,
      value: true
    }).getLocals().value, '1', 'should handle transformer option (format)');
  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    tape.strictEqual(new Radio({
      type: Country,
      options: {},
      ctx: ctx
    }).getLocals().hasError, false, 'default hasError should be false');

    tape.strictEqual(new Radio({
      type: Country,
      options: { hasError: true },
      ctx: ctx
    }).getLocals().hasError, true, 'should handle hasError option');
  });

  tape.test('error', function (tape) {
    tape.plan(3);

    tape.strictEqual(new Radio({
      type: Country,
      options: {},
      ctx: ctx
    }).getLocals().error, undefined, 'default error should be undefined');

    tape.strictEqual(new Radio({
      type: Country,
      options: { error: 'myerror' },
      ctx: ctx
    }).getLocals().error, 'myerror', 'should handle error option');

    tape.strictEqual(new Radio({
      type: Country,
      options: {
        error: function error(value) {
          return 'error: ' + value;
        }
      },
      ctx: ctx,
      value: 'a'
    }).getLocals().error, 'error: a', 'should handle error option as a function');
  });

  tape.test('template', function (tape) {
    tape.plan(2);

    tape.strictEqual(new Radio({
      type: Country,
      options: {},
      ctx: ctx
    }).getTemplate(), bootstrap.radio, 'default template should be bootstrap.eadio');

    var template = function template() {};

    tape.strictEqual(new Radio({
      type: Country,
      options: { template: template },
      ctx: ctx
    }).getTemplate(), template, 'should handle template option');
  });

  tape.test('options', function (tape) {
    tape.plan(1);

    tape.deepEqual(new Radio({
      type: Country,
      options: {
        options: [{ value: 'IT', text: 'Italia' }, { value: 'US', text: 'Stati Uniti' }]
      },
      ctx: ctx
    }).getLocals().options, [{ text: 'Italia', value: 'IT' }, { text: 'Stati Uniti', value: 'US' }], 'should handle options option');
  });

  tape.test('order', function (tape) {
    tape.plan(2);

    tape.deepEqual(new Radio({
      type: Country,
      options: { order: 'asc' },
      ctx: ctx
    }).getLocals().options, [{ text: 'France', value: 'FR' }, { text: 'Italy', value: 'IT' }, { text: 'United States', value: 'US' }], 'should handle order = asc option');

    tape.deepEqual(new Radio({
      type: Country,
      options: { order: 'desc' },
      ctx: ctx
    }).getLocals().options, [{ text: 'United States', value: 'US' }, { text: 'Italy', value: 'IT' }, { text: 'France', value: 'FR' }], 'should handle order = desc option');
  });

  if (typeof window !== 'undefined') {

    tape.test('validate', function (tape) {
      tape.plan(8);

      var result;

      // required type, default value
      result = renderComponent({
        type: Country
      }).validate();

      tape.strictEqual(result.isValid(), false);
      tape.strictEqual(result.value, null);

      // required type, setting a value
      result = renderComponent({
        type: Country,
        value: 'IT'
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, 'IT');

      // optional type
      result = renderComponent({
        type: t.maybe(Country)
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, null);

      result = renderComponent({
        type: t.maybe(t.Bool),
        options: {
          transformer: transformer,
          options: [{ value: '0', text: 'No' }, { value: '1', text: 'Yes' }]
        },
        value: true
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, true);
    });
  }
});

},{"../../lib/components":1,"../../lib/templates/bootstrap":2,"./util":77,"react":"react","react-vdom":8,"tape":9,"tcomb":22}],74:[function(require,module,exports){
'use strict';

var tape = require('tape');
var t = require('tcomb');
var bootstrap = require('../../lib/templates/bootstrap');
var Select = require('../../lib/components').Select;
var React = require('react');
var vdom = require('react-vdom');
var util = require('./util');
var ctx = util.ctx;
var renderComponent = util.getRenderComponent(Select);

var transformer = {
  format: function format(value) {
    return t.Str.is(value) ? value : value === true ? '1' : '0';
  },
  parse: function parse(value) {
    return value === '1';
  }
};

tape('Select', function (tape) {

  var Country = t.enums({
    IT: 'Italy',
    FR: 'France',
    US: 'United States'
  });

  tape.test('label', function (tape) {
    tape.plan(4);

    tape.strictEqual(new Select({
      type: Country,
      options: {},
      ctx: ctx
    }).getLocals().label, 'Default label', 'should have a default label');

    tape.strictEqual(new Select({
      type: Country,
      options: { label: 'mylabel' },
      ctx: ctx
    }).getLocals().label, 'mylabel', 'should handle label option as string');

    tape.deepEqual(vdom(new Select({
      type: Country,
      options: { label: React.DOM.i(null, 'JSX label') },
      ctx: ctx
    }).getLocals().label), { tag: 'i', attrs: {}, children: 'JSX label' }, 'should handle label option as JSX');

    tape.strictEqual(new Select({
      type: t.maybe(Country),
      options: {},
      ctx: ctx
    }).getLocals().label, 'Default label (optional)', 'should handle optional types');
  });

  tape.test('help', function (tape) {
    tape.plan(2);

    tape.strictEqual(new Select({
      type: Country,
      options: { help: 'myhelp' },
      ctx: ctx
    }).getLocals().help, 'myhelp', 'should handle help option as string');

    tape.deepEqual(vdom(new Select({
      type: Country,
      options: { help: React.DOM.i(null, 'JSX help') },
      ctx: ctx
    }).getLocals().help), { tag: 'i', attrs: {}, children: 'JSX help' }, 'should handle help option as JSX');
  });

  tape.test('value', function (tape) {
    tape.plan(2);

    tape.strictEqual(new Select({
      type: Country,
      options: {},
      ctx: ctx
    }).getLocals().value, '', 'default value should be nullOption.value');

    tape.strictEqual(new Select({
      type: Country,
      options: {},
      ctx: ctx,
      value: 'a'
    }).getLocals().value, 'a', 'should handle value option');
  });

  tape.test('transformer', function (tape) {
    tape.plan(1);

    tape.strictEqual(new Select({
      type: t.maybe(t.Bool),
      options: {
        transformer: transformer,
        options: [{ value: '0', text: 'No' }, { value: '1', text: 'Yes' }]
      },
      ctx: ctx,
      value: true
    }).getLocals().value, '1', 'should handle transformer option (format)');
  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    tape.strictEqual(new Select({
      type: Country,
      options: {},
      ctx: ctx
    }).getLocals().hasError, false, 'default hasError should be false');

    tape.strictEqual(new Select({
      type: Country,
      options: { hasError: true },
      ctx: ctx
    }).getLocals().hasError, true, 'should handle hasError option');
  });

  tape.test('error', function (tape) {
    tape.plan(3);

    tape.strictEqual(new Select({
      type: Country,
      options: {},
      ctx: ctx
    }).getLocals().error, undefined, 'default error should be undefined');

    tape.strictEqual(new Select({
      type: Country,
      options: { error: 'myerror' },
      ctx: ctx
    }).getLocals().error, 'myerror', 'should handle error option');

    tape.strictEqual(new Select({
      type: Country,
      options: {
        error: function error(value) {
          return 'error: ' + value;
        }
      },
      ctx: ctx,
      value: 'a'
    }).getLocals().error, 'error: a', 'should handle error option as a function');
  });

  tape.test('template', function (tape) {
    tape.plan(2);

    tape.strictEqual(new Select({
      type: Country,
      options: {},
      ctx: ctx
    }).getTemplate(), bootstrap.select, 'default template should be bootstrap.select');

    var template = function template() {};

    tape.strictEqual(new Select({
      type: Country,
      options: { template: template },
      ctx: ctx
    }).getTemplate(), template, 'should handle template option');
  });

  tape.test('options', function (tape) {
    tape.plan(1);

    tape.deepEqual(new Select({
      type: Country,
      options: {
        options: [{ value: 'IT', text: 'Italia' }, { value: 'US', text: 'Stati Uniti' }]
      },
      ctx: ctx
    }).getLocals().options, [{ text: '-', value: '' }, { text: 'Italia', value: 'IT' }, { text: 'Stati Uniti', value: 'US' }], 'should handle options option');
  });

  tape.test('order', function (tape) {
    tape.plan(2);

    tape.deepEqual(new Select({
      type: Country,
      options: { order: 'asc' },
      ctx: ctx
    }).getLocals().options, [{ text: '-', value: '' }, { text: 'France', value: 'FR' }, { text: 'Italy', value: 'IT' }, { text: 'United States', value: 'US' }], 'should handle order = asc option');

    tape.deepEqual(new Select({
      type: Country,
      options: { order: 'desc' },
      ctx: ctx
    }).getLocals().options, [{ text: '-', value: '' }, { text: 'United States', value: 'US' }, { text: 'Italy', value: 'IT' }, { text: 'France', value: 'FR' }], 'should handle order = desc option');
  });

  tape.test('nullOption', function (tape) {
    tape.plan(2);

    tape.deepEqual(new Select({
      type: Country,
      options: {
        nullOption: { value: '', text: 'Select a country' }
      },
      ctx: ctx
    }).getLocals().options, [{ value: '', text: 'Select a country' }, { text: 'Italy', value: 'IT' }, { text: 'France', value: 'FR' }, { text: 'United States', value: 'US' }], 'should handle nullOption option');

    tape.deepEqual(new Select({
      type: Country,
      options: {
        nullOption: false
      },
      ctx: ctx,
      value: 'US'
    }).getLocals().options, [{ text: 'Italy', value: 'IT' }, { text: 'France', value: 'FR' }, { text: 'United States', value: 'US' }], 'should skip the nullOption if nullOption = false');
  });

  if (typeof window !== 'undefined') {

    tape.test('validate', function (tape) {
      tape.plan(16);

      var result;

      // required type, default value
      result = renderComponent({
        type: Country
      }).validate();

      tape.strictEqual(result.isValid(), false);
      tape.strictEqual(result.value, null);

      // required type, setting a value
      result = renderComponent({
        type: Country,
        value: 'IT'
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, 'IT');

      // optional type
      result = renderComponent({
        type: t.maybe(Country)
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, null);

      // option groups
      var Car = t.enums.of('Audi Chrysler Ford Renault Peugeot');
      result = renderComponent({
        type: Car,
        options: {
          options: [{ value: 'Audi', text: 'Audi' }, // an option
          { label: 'US', options: [// a group of options
            { value: 'Chrysler', text: 'Chrysler' }, { value: 'Ford', text: 'Ford' }] }, { label: 'France', options: [// another group of options
            { value: 'Renault', text: 'Renault' }, { value: 'Peugeot', text: 'Peugeot' }], disabled: true } // use `disabled: true` to disable an optgroup
          ]
        },
        value: 'Ford'
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, 'Ford');

      //
      // multiple select
      //

      // default value should be []
      result = renderComponent({
        type: t.list(Country)
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.deepEqual(result.value, []);

      // setting a value
      result = renderComponent({
        type: t.list(Country),
        value: ['IT', 'US']
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.deepEqual(result.value, ['IT', 'US']);

      // subtyped multiple select
      result = renderComponent({
        type: t.subtype(t.list(Country), function (x) {
          return x.length >= 2;
        }),
        value: ['IT']
      }).validate();

      tape.strictEqual(result.isValid(), false);
      tape.deepEqual(result.value, ['IT']);

      // should handle transformer option (parse)
      result = renderComponent({
        type: t.maybe(t.Bool),
        options: {
          transformer: transformer,
          options: [{ value: '0', text: 'No' }, { value: '1', text: 'Yes' }]
        },
        value: true
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.deepEqual(result.value, true);
    });
  }
});

},{"../../lib/components":1,"../../lib/templates/bootstrap":2,"./util":77,"react":"react","react-vdom":8,"tape":9,"tcomb":22}],75:[function(require,module,exports){
'use strict';

var tape = require('tape');
var t = require('tcomb');
var bootstrap = require('../../lib/templates/bootstrap');
var Textbox = require('../../lib/components').Textbox;
var React = require('react');
var vdom = require('react-vdom');
var util = require('./util');
var ctx = util.ctx;
var ctxPlaceholders = util.ctxPlaceholders;
var ctxNone = util.ctxNone;
var renderComponent = util.getRenderComponent(Textbox);

var transformer = {
  format: function format(value) {
    return Array.isArray(value) ? value : value.split(' ');
  },
  parse: function parse(value) {
    return value.join(' ');
  }
};

tape('Textbox', function (tape) {

  tape.test('path', function (tape) {
    tape.plan(1);

    tape.deepEqual(new Textbox({
      type: t.Str,
      options: {},
      ctx: ctx
    }).getLocals().path, ['defaultPath'], 'should handle the path');
  });

  tape.test('attrs', function (tape) {
    tape.plan(1);

    tape.strictEqual(new Textbox({
      type: t.Num,
      options: {
        type: 'number',
        attrs: {
          min: 0
        }
      },
      ctx: ctx
    }).getLocals().attrs.min, 0, 'should handle attrs option');
  });

  tape.test('attrs.events', function (tape) {
    tape.plan(1);

    function onBlur() {}

    tape.deepEqual(new Textbox({
      type: t.Str,
      options: {
        attrs: {
          id: 'myid',
          onBlur: onBlur
        }
      },
      ctx: ctx
    }).getLocals().attrs, {
      name: 'defaultName',
      id: 'myid',
      onBlur: onBlur,
      placeholder: undefined
    }, 'should handle events');
  });

  tape.test('attrs.className', function (tape) {
    tape.plan(3);

    tape.deepEqual(new Textbox({
      type: t.Str,
      options: {
        attrs: {
          id: 'myid',
          className: 'myclass'
        }
      },
      ctx: ctx
    }).getLocals().attrs, {
      name: 'defaultName',
      id: 'myid',
      className: {
        myclass: true
      },
      placeholder: undefined
    }, 'should handle classNames as strings');

    tape.deepEqual(new Textbox({
      type: t.Str,
      options: {
        attrs: {
          id: 'myid',
          className: ['myclass1', 'myclass2']
        }
      },
      ctx: ctx
    }).getLocals().attrs, {
      name: 'defaultName',
      id: 'myid',
      className: {
        'myclass1 myclass2': true
      },
      placeholder: undefined
    }, 'should handle classNames as arrays');

    tape.deepEqual(new Textbox({
      type: t.Str,
      options: {
        attrs: {
          id: 'myid',
          className: {
            myclass1: true,
            myclass2: true
          }
        }
      },
      ctx: ctx
    }).getLocals().attrs, {
      name: 'defaultName',
      id: 'myid',
      className: {
        'myclass1 myclass2': true
      },
      placeholder: undefined
    }, 'should handle classNames as object');
  });

  tape.test('label', function (tape) {
    tape.plan(4);

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: {},
      ctx: ctx
    }).getLocals().label, 'Default label', 'should have a default label');

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: { label: 'mylabel' },
      ctx: ctx
    }).getLocals().label, 'mylabel', 'should handle label option as string');

    tape.deepEqual(vdom(new Textbox({
      type: t.Str,
      options: { label: React.DOM.i(null, 'JSX label') },
      ctx: ctx
    }).getLocals().label), { tag: 'i', attrs: {}, children: 'JSX label' }, 'should handle label option as JSX');

    tape.strictEqual(new Textbox({
      type: t.maybe(t.Str),
      options: {},
      ctx: ctx
    }).getLocals().label, 'Default label (optional)', 'should handle optional types');
  });

  tape.test('attrs.placeholder', function (tape) {
    tape.plan(6);

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: {},
      ctx: ctx
    }).getLocals().attrs.placeholder, undefined, 'default placeholder should be undefined');

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: { attrs: { placeholder: 'myplaceholder' } },
      ctx: ctx
    }).getLocals().attrs.placeholder, 'myplaceholder', 'should handle placeholder option');

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: { label: 'mylabel', attrs: { placeholder: 'myplaceholder' } },
      ctx: ctx
    }).getLocals().attrs.placeholder, 'myplaceholder', 'should handle placeholder option even if a label is specified');

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: {},
      ctx: ctxPlaceholders
    }).getLocals().attrs.placeholder, 'Default label', 'should have a default placeholder if auto = placeholders');

    tape.strictEqual(new Textbox({
      type: t.maybe(t.Str),
      options: {},
      ctx: ctxPlaceholders
    }).getLocals().attrs.placeholder, 'Default label (optional)', 'should handle optional types if auto = placeholders');

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: { attrs: { placeholder: 'myplaceholder' } },
      ctx: ctxNone
    }).getLocals().attrs.placeholder, 'myplaceholder', 'should handle placeholder option even if auto === none');
  });

  tape.test('disabled', function (tape) {
    tape.plan(3);

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: {},
      ctx: ctx
    }).getLocals().disabled, undefined, 'default disabled should be undefined');

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: { disabled: true },
      ctx: ctx
    }).getLocals().disabled, true, 'should handle disabled = true');

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: { disabled: false },
      ctx: ctx
    }).getLocals().disabled, false, 'should handle disabled = false');
  });

  tape.test('help', function (tape) {
    tape.plan(2);

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: { help: 'myhelp' },
      ctx: ctx
    }).getLocals().help, 'myhelp', 'should handle help option as string');

    tape.deepEqual(vdom(new Textbox({
      type: t.Str,
      options: { help: React.DOM.i(null, 'JSX help') },
      ctx: ctx
    }).getLocals().help), { tag: 'i', attrs: {}, children: 'JSX help' }, 'should handle help option as JSX');
  });

  tape.test('value', function (tape) {
    tape.plan(3);

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: {},
      ctx: ctx
    }).getLocals().value, null, 'default value should be null');

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: {},
      ctx: ctx,
      value: 'a'
    }).getLocals().value, 'a', 'should handle value option');

    tape.strictEqual(new Textbox({
      type: t.Num,
      options: {},
      ctx: ctx,
      value: 1.1
    }).getLocals().value, '1.1', 'should handle numeric values');
  });

  tape.test('transformer', function (tape) {
    tape.plan(1);

    tape.deepEqual(new Textbox({
      type: t.Str,
      options: { transformer: transformer },
      ctx: ctx,
      value: 'a b'
    }).getLocals().value, ['a', 'b'], 'should handle transformer option (format)');
  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: {},
      ctx: ctx
    }).getLocals().hasError, false, 'default hasError should be false');

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: { hasError: true },
      ctx: ctx
    }).getLocals().hasError, true, 'should handle hasError option');

    var textbox = new Textbox({
      type: t.Str,
      options: {},
      ctx: ctx
    });
  });

  tape.test('error', function (tape) {
    tape.plan(3);

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: {},
      ctx: ctx
    }).getLocals().error, undefined, 'default error should be undefined');

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: { error: 'myerror' },
      ctx: ctx
    }).getLocals().error, 'myerror', 'should handle error option');

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: {
        error: function error(value) {
          return 'error: ' + value;
        }
      },
      ctx: ctx,
      value: 'a'
    }).getLocals().error, 'error: a', 'should handle error option as a function');
  });

  tape.test('template', function (tape) {
    tape.plan(2);

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: {},
      ctx: ctx
    }).getTemplate(), bootstrap.textbox, 'default template should be bootstrap.textbox');

    var template = function template() {};

    tape.strictEqual(new Textbox({
      type: t.Str,
      options: { template: template },
      ctx: ctx
    }).getTemplate(), template, 'should handle template option');
  });

  if (typeof window !== 'undefined') {

    tape.test('validate', function (tape) {
      tape.plan(20);

      var result;

      // required type, default value
      result = renderComponent({
        type: t.Str
      }).validate();

      tape.strictEqual(result.isValid(), false);
      tape.strictEqual(result.value, null);

      // required type, setting a value
      result = renderComponent({
        type: t.Str,
        value: 'a'
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, 'a');

      // string type with numeric value
      result = renderComponent({
        type: t.Str,
        value: '123'
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, '123');

      // optional type
      result = renderComponent({
        type: t.maybe(t.Str)
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, null);

      // numeric type
      result = renderComponent({
        type: t.Num,
        value: 1
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, 1);

      // optional numeric type
      result = renderComponent({
        type: t.maybe(t.Num),
        value: ''
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, null);

      // numeric type with stringy value
      result = renderComponent({
        type: t.Num,
        value: '1.01'
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, 1.01);

      // subtype, setting a valid value
      result = renderComponent({
        type: t.subtype(t.Num, function (n) {
          return n >= 0;
        }),
        value: 1
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, 1);

      // subtype, setting an invalid value
      result = renderComponent({
        type: t.subtype(t.Num, function (n) {
          return n >= 0;
        }),
        value: -1
      }).validate();

      tape.strictEqual(result.isValid(), false);
      tape.strictEqual(result.value, -1);

      // should handle transformer option (parse)
      result = renderComponent({
        type: t.Str,
        options: { transformer: transformer },
        value: ['a', 'b']
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value, 'a b');
    });
  }
});

},{"../../lib/components":1,"../../lib/templates/bootstrap":2,"./util":77,"react":"react","react-vdom":8,"tape":9,"tcomb":22}],76:[function(require,module,exports){
'use strict';

require('./Component');
require('./Textbox');
require('./Checkbox');
require('./Select');
require('./Radio');

},{"./Checkbox":71,"./Component":72,"./Radio":73,"./Select":74,"./Textbox":75}],77:[function(require,module,exports){
'use strict';

var t = require('tcomb');
var React = require('react');
var bootstrap = require('../../lib/templates/bootstrap');

var ctx = {
  auto: 'labels',
  config: {},
  name: 'defaultName',
  label: 'Default label',
  i18n: {
    optional: ' (optional)',
    add: 'Add',
    remove: 'Remove',
    up: 'Up',
    down: 'Down'
  },
  templates: bootstrap,
  path: ['defaultPath']
};

function getContext(options) {
  return t.mixin(t.mixin({}, ctx), options, true);
}

var ctxPlaceholders = getContext({ auto: 'placeholders' });
var ctxNone = getContext({ auto: 'none' });

function getRenderComponent(Component) {
  return function renderComponent(props) {
    props.options = props.options || {};
    props.ctx = props.ctx || ctx;
    var app = document.getElementById('app');
    var node = document.createElement('div');
    app.appendChild(node);
    return React.render(React.createElement(Component, props), node);
  };
}

module.exports = {
  ctx: ctx,
  ctxPlaceholders: ctxPlaceholders,
  ctxNone: ctxNone,
  getRenderComponent: getRenderComponent
};

},{"../../lib/templates/bootstrap":2,"react":"react","tcomb":22}],78:[function(require,module,exports){
// setup runner title
'use strict';

var pkg = require('../package.json');
var title = 'tcomb-form v' + pkg.version + ' tests runner';
document.title = title;
document.getElementById('title').innerHTML = title;

// load tests
require('./components');
require('./templates');

},{"../package.json":70,"./components":76,"./templates":80}],79:[function(require,module,exports){
'use strict';

var tape = require('tape');
var bootstrap = require('../../lib/templates/bootstrap');

tape('textbox', function (tape) {

  var textbox = bootstrap.textbox;

  tape.test('static', function (tape) {
    tape.plan(1);

    tape.deepEqual(textbox({ type: 'static', attrs: {}, path: [] }).children[1].attrs.className, { 'form-control-static': true }, 'should handle static type');
  });

  tape.test('depth', function (tape) {
    tape.plan(1);

    tape.deepEqual(textbox({ type: 'static', attrs: {}, path: [] }).attrs.className, { 'form-group': true, 'form-group-depth-0': true, 'has-error': undefined }, 'should handle form depth');
  });
});

},{"../../lib/templates/bootstrap":2,"tape":9}],80:[function(require,module,exports){
'use strict';

require('./bootstrap');

},{"./bootstrap":79}]},{},[78]);

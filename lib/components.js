'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.getComponent = getComponent;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _tcombValidation = require('tcomb-validation');

var _tcombValidation2 = _interopRequireDefault(_tcombValidation);

var _uvdomReact = require('uvdom/react');

var _util = require('./util');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Nil = _tcombValidation2['default'].Nil;
var assert = _tcombValidation2['default'].assert;
var SOURCE = 'tcomb-form';
var log = (0, _debug2['default'])(SOURCE);
var noobj = Object.freeze({});
var noarr = Object.freeze([]);
var noop = function noop() {};

function getComponent(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var type = _x,
        options = _x2;
    name = undefined;
    _again = false;

    if (options.factory) {
      return options.factory;
    }
    var name = _tcombValidation2['default'].getTypeName(type);
    switch (type.meta.kind) {
      case 'irreducible':
        return type === _tcombValidation2['default'].Bool ? Checkbox : type === _tcombValidation2['default'].Dat ? Datetime : Textbox;
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
        _tcombValidation2['default'].fail('[' + SOURCE + '] unsupported type ' + name);
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
      var attrs = _tcombValidation2['default'].mixin({}, this.props.options.attrs);
      attrs.id = this.getId();
      attrs.name = this.getName();
      if (attrs.className) {
        var _attrs$className;

        attrs.className = (_attrs$className = {}, _attrs$className[(0, _classnames2['default'])(attrs.className)] = true, _attrs$className);
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
      return (0, _util.merge)(this.props.ctx.templates, this.props.options.templates);
    };
  }

};

exports.decorators = decorators;

var Component = (function (_React$Component) {
  function Component(props) {
    _classCallCheck(this, Component);

    _React$Component.call(this, props);
    this.typeInfo = (0, _util.getTypeInfo)(props.type);
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
    var should = nextState.value !== this.state.value || nextState.hasError !== this.state.hasError || nextProps.options !== this.props.options || nextProps.type !== this.props.type;
    //log('shouldComponentUpdate', this.constructor.name, should);
    return should;
  };

  Component.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.typeInfo = (0, _util.getTypeInfo)(props.type);
    }
    this.setState({ value: this.getTransformer().format(props.value) });
  };

  Component.prototype.onChange = function onChange(value) {
    var _this = this;

    this.setState({ value: value }, function () {
      _this.props.onChange(value, _this.props.ctx.path);
    });
  };

  Component.prototype.validate = function validate() {
    var value = this.getTransformer().parse(this.state.value);
    var result = _tcombValidation2['default'].validate(value, this.props.type, this.props.ctx.path);
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
    return _tcombValidation2['default'].Func.is(error) ? error(this.state.value) : error;
  };

  Component.prototype.hasError = function hasError() {
    return this.props.options.hasError || this.state.hasError;
  };

  Component.prototype.getConfig = function getConfig() {
    return (0, _util.merge)(this.props.ctx.config, this.props.options.config);
  };

  Component.prototype.getId = function getId() {
    var attrs = this.props.options.attrs || noobj;
    return attrs.id || this.props.ctx.uid.next();
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
    //log('rendering %s', this.constructor.name);
    var locals = this.getLocals();
    // getTemplate is the only required implementation when extending Component
    assert(_tcombValidation2['default'].Func.is(this.getTemplate), '[' + SOURCE + '] missing getTemplate method of component ' + this.constructor.name);
    var template = this.getTemplate();
    return (0, _uvdomReact.compile)(template(locals));
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
})(_react2['default'].Component);

exports.Component = Component;

function toNull(value) {
  return _tcombValidation2['default'].Str.is(value) && value.trim() === '' || Nil.is(value) ? null : value;
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
    return options.transformer ? options.transformer : this.typeInfo.innerType === _tcombValidation2['default'].Num ? Textbox.numberTransformer : Textbox.transformer;
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
    return this.isMultiple() ? (0, _util.getTypeInfo)(this.typeInfo.innerType.meta.type).innerType : this.typeInfo.innerType;
  };

  _Select.prototype.getOptions = function getOptions() {
    var options = this.props.options;
    var items = options.options ? options.options.slice() : (0, _util.getOptionsOfEnum)(this.getEnum());
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
    value: function (nullOption) {
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
    var items = options.options ? options.options.slice() : (0, _util.getOptionsOfEnum)(this.typeInfo.innerType);
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
        return _tcombValidation2['default'].Arr.is(value) ? value : _tcombValidation2['default'].Dat.is(value) ? [value.getFullYear(), value.getMonth(), value.getDate()].map(String) : [null, null, null];
      },
      parse: function parse(value) {
        value = value.map(parseNumber);
        return value.every(_tcombValidation2['default'].Num.is) ? new Date(value[0], value[1], value[2]) : value.every(Nil.is) ? null : value;
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
        result = _tcombValidation2['default'].validate(value, this.props.type, this.props.ctx.path);
        hasError = !result.isValid();
        errors = errors.concat(result.errors);
      }
    }

    this.setState({ hasError: hasError });
    return new _tcombValidation2['default'].ValidationResult({ errors: errors, value: value });
  };

  _Struct.prototype.onChange = function onChange(fieldName, fieldValue, path, kind) {
    // optimise re-rendering
    var value = _tcombValidation2['default'].mixin({}, this.state.value);
    value[fieldName] = fieldValue;
    this.state.value = value;
    this.props.onChange(value, path, kind);
    /*
    const value = t.mixin({}, this.state.value);
    value[fieldName] = fieldValue;
    this.setState({value}, function () {
      this.props.onChange(value, path, kind);
    }.bind(this));
    */
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
        inputs[prop] = _react2['default'].createElement(getComponent(propType, propOptions), {
          key: prop,
          ref: prop,
          type: propType,
          options: propOptions,
          value: value[prop],
          onChange: this.onChange.bind(this, prop),
          ctx: {
            uid: ctx.uid,
            auto: auto,
            config: config,
            name: ctx.name ? '' + ctx.name + '[' + prop + ']' : prop,
            label: (0, _util.humanize)(prop),
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

function toSameLength(value, keys, uid) {
  if (value.length === keys.length) {
    return keys;
  }
  var ret = [];
  for (var i = 0, len = value.length; i < len; i++) {
    ret[i] = keys[i] || uid.next();
  }
  return ret;
}

var List = (function (_Component7) {
  function List(props) {
    _classCallCheck(this, _List);

    _Component7.call(this, props);
    this.state.keys = this.state.value.map(function () {
      return props.ctx.uid.next();
    });
  }

  _inherits(List, _Component7);

  var _List = List;

  _List.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.typeInfo = (0, _util.getTypeInfo)(props.type);
    }
    var value = this.getTransformer().format(props.value);
    this.setState({
      value: value,
      keys: toSameLength(value, this.state.keys, props.ctx.uid)
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
      result = _tcombValidation2['default'].validate(value, this.props.type, this.props.ctx.path);
      hasError = !result.isValid();
      errors = errors.concat(result.errors);
    }

    this.setState({ hasError: hasError });
    return new _tcombValidation2['default'].ValidationResult({ errors: errors, value: value });
  };

  _List.prototype.onChange = function onChange(value, keys, path, kind) {
    var _this2 = this;

    keys = toSameLength(value, keys, this.props.ctx.uid);
    if (!kind) {
      // optimise re-rendering
      this.state.value = value;
      this.state.keys = keys;
      this.props.onChange(value, path, kind);
    } else {
      this.setState({ value: value, keys: keys }, function () {
        _this2.props.onChange(value, path, kind);
      });
    }
  };

  _List.prototype.addItem = function addItem(evt) {
    evt.preventDefault();
    var value = this.state.value.concat(undefined);
    var keys = this.state.keys.concat(this.props.ctx.uid.next());
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
      this.onChange((0, _util.move)(this.state.value.slice(), i, i - 1), (0, _util.move)(this.state.keys.slice(), i, i - 1), this.props.ctx.path.concat(i), 'moveUp');
    }
  };

  _List.prototype.moveDownItem = function moveDownItem(i, evt) {
    evt.preventDefault();
    if (i < this.state.value.length - 1) {
      this.onChange((0, _util.move)(this.state.value.slice(), i, i + 1), (0, _util.move)(this.state.keys.slice(), i, i + 1), this.props.ctx.path.concat(i), 'moveDown');
    }
  };

  _List.prototype.getTemplate = function getTemplate() {
    return this.props.options.template || this.getTemplates().list;
  };

  _List.prototype.getItems = function getItems() {
    var _this3 = this;

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
        buttons.push({ label: i18n.remove, click: _this3.removeItem.bind(_this3, i) });
      }
      if (!options.disableOrder) {
        buttons.push({ label: i18n.up, click: _this3.moveUpItem.bind(_this3, i) });
      }
      if (!options.disableOrder) {
        buttons.push({ label: i18n.down, click: _this3.moveDownItem.bind(_this3, i) });
      }
      return {
        input: _react2['default'].createElement(Component, {
          ref: i,
          type: type,
          options: options.item || noobj,
          value: value,
          onChange: _this3.onItemChange.bind(_this3, i),
          ctx: {
            uid: ctx.uid,
            auto: auto,
            config: config,
            i18n: i18n,
            name: ctx.name ? '' + ctx.name + '[' + i + ']' : String(i),
            templates: templates,
            path: ctx.path.concat(i)
          }
        }),
        key: _this3.state.keys[i],
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

var Form = (function (_React$Component2) {
  function Form() {
    _classCallCheck(this, Form);

    if (_React$Component2 != null) {
      _React$Component2.apply(this, arguments);
    }
  }

  _inherits(Form, _React$Component2);

  Form.prototype.validate = function validate() {
    return this.refs.input.validate();
  };

  Form.prototype.getValue = function getValue(raw) {
    var result = this.validate();
    return raw === true ? result : result.isValid() ? result.value : null;
  };

  Form.prototype.getComponent = function getComponent(path) {
    path = _tcombValidation2['default'].Str.is(path) ? path.split('.') : path;
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

    assert(_tcombValidation2['default'].Type.is(type), '[' + SOURCE + '] missing required prop type');
    assert(_tcombValidation2['default'].Obj.is(options), '[' + SOURCE + '] prop options must be an object');
    assert(_tcombValidation2['default'].Obj.is(templates), '[' + SOURCE + '] missing templates config');
    assert(_tcombValidation2['default'].Obj.is(i18n), '[' + SOURCE + '] missing i18n config');

    var Component = getComponent(type, options);
    return _react2['default'].createElement(Component, {
      ref: 'input',
      type: type,
      options: options,
      value: this.props.value,
      onChange: this.props.onChange || noop,
      ctx: this.props.ctx || {
        uid: new _util.UIDGenerator(this._reactInternalInstance ? this._reactInternalInstance._rootNodeID : ''),
        auto: 'labels',
        templates: templates,
        i18n: i18n,
        path: []
      }
    });
  };

  return Form;
})(_react2['default'].Component);

exports.Form = Form;
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

'use strict';

var Nil = _t2['default'].Nil;
var SOURCE = 'tcomb-form';
var log = _debug2['default'](SOURCE);
var nooptions = Object.freeze({});
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
        return type === _t2['default'].Bool ? Checkbox : Textbox;
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

var annotations = {

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
      attrs.id = attrs.id || this._rootNodeID || _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.uuid();
      attrs.name = attrs.name || this.props.ctx.name || attrs.id;
      if (_t2['default'].Str.is(attrs.className)) {
        attrs.className = [attrs.className];
      }
      if (_t2['default'].Arr.is(attrs.className)) {
        attrs.className = attrs.className.reduce(function (acc, x) {
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

  placeholder: function placeholder(Component) {
    Component.prototype.getPlaceholder = function getPlaceholder() {
      var placeholder = this.props.options.placeholder;
      if (Nil.is(placeholder) && this.getAuto() === 'placeholders') {
        placeholder = this.getDefaultLabel();
      }
      return placeholder;
    };
    Component.locals = Component.locals.concat({
      name: 'placeholder', method: 'getPlaceholder'
    });
  }

};

exports.annotations = annotations;

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
    return this.props.options.transformer || this.constructor.defaultTransformer;
  };

  Component.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return nextState.value !== this.state.value || nextState.hasError !== this.state.hasError || nextProps.value !== this.props.value || nextProps.options !== this.props.options || nextProps.type !== this.props.type;
  };

  Component.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.typeInfo = _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.getTypeInfo(props.type);
    }
    this.setState({ value: this.getTransformer().format(props.value) });
  };

  Component.prototype.onChange = function onChange(value) {
    var _this2 = this;

    this.setState({ value: value }, function () {
      _this2.props.onChange(value, _this2.props.ctx.path);
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

  Component.prototype.getLocals = function getLocals() {
    var _this3 = this;

    var options = this.props.options;
    var value = this.state.value;
    var locals = {
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

    this.constructor.locals.forEach(function (_ref) {
      var name = _ref.name;
      var method = _ref.method;

      locals[name] = _this3[method].call(_this3);
    });

    return locals;
  };

  Component.prototype.render = function render() {
    log('rendering %s', this.constructor.name);
    var locals = this.getLocals();
    _t2['default'].assert(_t2['default'].Func.is(this.getTemplate), '[' + SOURCE + '] missing getTemplate method of component ' + this.constructor.name);
    var template = this.getTemplate();
    return _compile.compile(template(locals));
  };

  _createClass(Component, null, [{
    key: 'locals',
    enumerable: true,
    value: []
  }, {
    key: 'defaultTransformer',
    enumerable: true,
    value: {
      format: function format(value) {
        return Nil.is(value) ? null : value;
      },
      parse: function parse(value) {
        return value;
      }
    }
  }]);

  return Component;
})(_React2['default'].Component);

exports.Component = Component;

var Textbox = (function (_Component) {
  function Textbox() {
    _classCallCheck(this, _Textbox);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(Textbox, _Component);

  Textbox.prototype.getTransformer = function getTransformer() {
    var options = this.props.options;
    return options.transformer ? options.transformer : this.typeInfo.innerType === _t2['default'].Num ? Textbox.numberTransformer : Textbox.defaultTransformer;
  };

  Textbox.prototype.getLocals = function getLocals() {
    var locals = _Component.prototype.getLocals.call(this);
    locals.type = this.props.options.type || 'text';
    return locals;
  };

  _createClass(Textbox, null, [{
    key: 'defaultTransformer',
    enumerable: true,
    value: {
      format: function format(value) {
        return Nil.is(value) ? null : value;
      },
      parse: function parse(value) {
        return _t2['default'].Str.is(value) && value.trim() === '' || Nil.is(value) ? null : value;
      }
    }
  }, {
    key: 'numberTransformer',
    enumerable: true,
    value: {
      format: function format(value) {
        return Nil.is(value) ? null : String(value);
      },
      parse: function parse(value) {
        var n = parseFloat(value);
        var isNumeric = value - n + 1 >= 0;
        return isNumeric ? n : value;
      }
    }
  }]);

  var _Textbox = Textbox;
  Textbox = annotations.attrs(Textbox) || Textbox;
  Textbox = annotations.placeholder(Textbox) || Textbox;
  Textbox = annotations.template('textbox')(Textbox) || Textbox;
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

  Checkbox.prototype.getLocals = function getLocals() {
    var locals = _Component2.prototype.getLocals.call(this);
    // checkboxes must always have a label
    locals.label = locals.label || this.getDefaultLabel();
    return locals;
  };

  _createClass(Checkbox, null, [{
    key: 'defaultTransformer',
    enumerable: true,
    value: {
      format: function format(value) {
        return Nil.is(value) ? false : value;
      },
      parse: function parse(value) {
        return value;
      }
    }
  }]);

  var _Checkbox = Checkbox;
  Checkbox = annotations.attrs(Checkbox) || Checkbox;
  Checkbox = annotations.template('checkbox')(Checkbox) || Checkbox;
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

  Select.prototype.getTransformer = function getTransformer() {
    var options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    if (this.isMultiple()) {
      return Select.multipleTransformer;
    }
    return Select.defaultTransformer(this.getNullOption());
  };

  Select.prototype.getNullOption = function getNullOption() {
    return this.props.options.nullOption || { value: '', text: '-' };
  };

  Select.prototype.isMultiple = function isMultiple() {
    return this.typeInfo.innerType.meta.kind === 'list';
  };

  Select.prototype.getEnum = function getEnum() {
    return this.isMultiple() ? _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.getTypeInfo(this.typeInfo.innerType.meta.type).innerType : this.typeInfo.innerType;
  };

  Select.prototype.getOptions = function getOptions() {
    var options = this.props.options;
    var items = options.options ? options.options.slice() : _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.getOptionsOfEnum(this.getEnum());
    if (options.order) {
      items.sort(getComparator(options.order));
    }
    var nullOption = this.getNullOption();
    if (options.nullOption !== false) {
      items.unshift(nullOption);
    }
    return items;
  };

  Select.prototype.getLocals = function getLocals() {
    var locals = _Component3.prototype.getLocals.call(this);
    locals.options = this.getOptions();
    locals.isMultiple = this.isMultiple();
    return locals;
  };

  _createClass(Select, null, [{
    key: 'defaultTransformer',
    enumerable: true,
    value: function (nullOption) {
      return {
        format: function format(value) {
          return Nil.is(value) && nullOption ? nullOption.value : value;
        },
        parse: function parse(value) {
          return nullOption && nullOption.value === value ? null : value;
        }
      };
    }
  }, {
    key: 'multipleTransformer',
    enumerable: true,
    value: {
      format: function format(value) {
        return Nil.is(value) ? [] : value;
      },
      parse: function parse(value) {
        return value;
      }
    }
  }]);

  var _Select = Select;
  Select = annotations.attrs(Select) || Select;
  Select = annotations.template('select')(Select) || Select;
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

  Radio.prototype.getOptions = function getOptions() {
    var options = this.props.options;
    var items = options.options ? options.options.slice() : _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.getOptionsOfEnum(this.typeInfo.innerType);
    if (options.order) {
      items.sort(getComparator(options.order));
    }
    return items;
  };

  Radio.prototype.getLocals = function getLocals() {
    var locals = _Component4.prototype.getLocals.call(this);
    locals.options = this.getOptions();
    return locals;
  };

  var _Radio = Radio;
  Radio = annotations.attrs(Radio) || Radio;
  Radio = annotations.template('radio')(Radio) || Radio;
  return Radio;
})(Component);

exports.Radio = Radio;

var Struct = (function (_Component5) {
  function Struct() {
    _classCallCheck(this, Struct);

    if (_Component5 != null) {
      _Component5.apply(this, arguments);
    }
  }

  _inherits(Struct, _Component5);

  Struct.prototype.validate = function validate() {

    var value = {};
    var errors = [];
    var hasError = false;
    var result = undefined;

    for (var _ref3 in this.refs) {
      if (this.refs.hasOwnProperty(_ref3)) {
        result = this.refs[_ref3].validate();
        errors = errors.concat(result.errors);
        value[_ref3] = result.value;
      }
    }

    if (errors.length === 0) {
      value = new this.typeInfo.innerType(value);
      if (this.typeInfo.isSubtype && errors.length === 0) {
        result = _t2['default'].validate(value, this.props.type, this.props.ctx.path);
        hasError = !result.isValid();
        errors = errors.concat(result.errors);
      }
    }

    this.setState({ hasError: hasError });
    return new _t2['default'].ValidationResult({ errors: errors, value: value });
  };

  Struct.prototype.onChange = function onChange(fieldName, fieldValue, path) {
    var value = _t2['default'].mixin({}, this.state.value);
    value[fieldName] = fieldValue;
    this.setState({ value: value }, (function () {
      this.props.onChange(value, path);
    }).bind(this));
  };

  Struct.prototype.getTemplates = function getTemplates() {
    return _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.merge(this.props.ctx.templates, this.props.options.templates);
  };

  Struct.prototype.getTemplate = function getTemplate() {
    return this.props.options.template || this.getTemplates().struct;
  };

  Struct.prototype.getTypeProps = function getTypeProps() {
    return this.typeInfo.innerType.meta.props;
  };

  Struct.prototype.getOrder = function getOrder() {
    return this.props.options.order || Object.keys(this.getTypeProps());
  };

  Struct.prototype.getInputs = function getInputs() {
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
        var propOptions = options.fields && options.fields[prop] ? options.fields[prop] : nooptions;
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

  Struct.prototype.getLocals = function getLocals() {
    var options = this.props.options;
    var locals = _Component5.prototype.getLocals.call(this);
    locals.order = this.getOrder();
    locals.inputs = this.getInputs();
    return locals;
  };

  _createClass(Struct, null, [{
    key: 'defaultTransformer',
    enumerable: true,
    value: {
      format: function format(value) {
        return Nil.is(value) ? {} : value;
      },
      parse: function parse(value) {
        return value;
      }
    }
  }]);

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

var List = (function (_Component6) {
  function List(props) {
    _classCallCheck(this, List);

    _Component6.call(this, props);
    this.state.keys = this.state.value.map(_humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.uuid);
  }

  _inherits(List, _Component6);

  List.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.typeInfo = _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.getTypeInfo(props.type);
    }
    var value = this.getTransformer().format(props.value);
    this.setState({
      value: value,
      keys: toSameLength(value, this.state.keys)
    });
  };

  List.prototype.validate = function validate() {

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

  List.prototype.onChange = function onChange(value, keys, path) {
    var _this4 = this;

    this.setState({ value: value, keys: toSameLength(value, keys) }, function () {
      _this4.props.onChange(value, path || _this4.props.ctx.path);
    });
  };

  List.prototype.addItem = function addItem(evt) {
    evt.preventDefault();
    var value = this.state.value.concat(undefined);
    var keys = this.state.keys.concat(_humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.uuid());
    this.onChange(value, keys, this.props.ctx.path.concat(value.length - 1));
  };

  List.prototype.onItemChange = function onItemChange(itemIndex, itemValue, path) {
    var value = this.state.value.slice();
    value[itemIndex] = itemValue;
    this.onChange(value, this.state.keys, path);
  };

  List.prototype.removeItem = function removeItem(i, evt) {
    evt.preventDefault();
    var value = this.state.value.slice();
    value.splice(i, 1);
    var keys = this.state.keys.slice();
    keys.splice(i, 1);
    this.onChange(value, keys, this.props.ctx.path.concat(i));
  };

  List.prototype.moveUpItem = function moveUpItem(i, evt) {
    evt.preventDefault();
    if (i > 0) {
      this.onChange(_humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.move(this.state.value.slice(), i, i - 1), _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.move(this.state.keys.slice(), i, i - 1));
    }
  };

  List.prototype.moveDownItem = function moveDownItem(i, evt) {
    evt.preventDefault();
    if (i < this.state.value.length - 1) {
      this.onChange(_humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.move(this.state.value.slice(), i, i + 1), _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.move(this.state.keys.slice(), i, i + 1));
    }
  };

  List.prototype.getTemplates = function getTemplates() {
    return _humanize$merge$getTypeInfo$getOptionsOfEnum$uuid$move.merge(this.props.ctx.templates, this.props.options.templates);
  };

  List.prototype.getTemplate = function getTemplate() {
    return this.props.options.template || this.getTemplates().list;
  };

  List.prototype.getItems = function getItems() {
    var _this5 = this;

    var _props2 = this.props;
    var options = _props2.options;
    var ctx = _props2.ctx;

    var auto = this.getAuto();
    var i18n = this.getI18n();
    var config = this.getConfig();
    var templates = this.getTemplates();
    var value = this.state.value;
    var type = this.typeInfo.innerType.meta.type;
    var Component = getComponent(type, options.item || nooptions);
    return value.map(function (value, i) {
      var buttons = [];
      if (!options.disableRemove) {
        buttons.push({ label: i18n.remove, click: _this5.removeItem.bind(_this5, i) });
      }
      if (!options.disableOrder) {
        buttons.push({ label: i18n.up, click: _this5.moveUpItem.bind(_this5, i) });
      }
      if (!options.disableOrder) {
        buttons.push({ label: i18n.down, click: _this5.moveDownItem.bind(_this5, i) });
      }
      return {
        input: _React2['default'].createElement(Component, {
          ref: i,
          type: type,
          options: options.item || nooptions,
          value: value,
          onChange: _this5.onItemChange.bind(_this5, i),
          ctx: {
            auto: auto,
            config: config,
            i18n: i18n,
            name: ctx.name ? '' + ctx.name + '[' + i + ']' : String(i),
            templates: templates,
            path: ctx.path.concat(i)
          }
        }),
        key: _this5.state.keys[i],
        buttons: buttons
      };
    });
  };

  List.prototype.getLocals = function getLocals() {

    var options = this.props.options;
    var i18n = this.getI18n();
    var locals = _Component6.prototype.getLocals.call(this);
    locals.add = options.disableAdd ? null : {
      label: i18n.add,
      click: this.addItem.bind(this)
    };
    locals.items = this.getItems();
    return locals;
  };

  _createClass(List, null, [{
    key: 'defaultTransformer',
    enumerable: true,
    value: {
      format: function format(value) {
        return Nil.is(value) ? [] : value;
      },
      parse: function parse(value) {
        return value;
      }
    }
  }]);

  return List;
})(Component);

exports.List = List;

var Dict = (function (_Component7) {
  function Dict() {
    _classCallCheck(this, Dict);

    if (_Component7 != null) {
      _Component7.apply(this, arguments);
    }
  }

  _inherits(Dict, _Component7);

  Dict.prototype.validate = function validate() {
    var result = this.refs.form.validate();
    if (!result.isValid()) {
      return result;
    }
    return _Component7.prototype.validate.call(this);
  };

  Dict.prototype.getTemplate = function getTemplate() {
    var _this6 = this;

    return function () {
      var Type = _t2['default'].list(_t2['default'].struct({
        domain: _this6.typeInfo.innerType.meta.domain,
        codomain: _this6.typeInfo.innerType.meta.codomain
      }));
      return _React2['default'].createElement(Form, {
        ref: 'form',
        type: Type,
        options: _this6.props.options,
        onChange: _this6.onChange.bind(_this6),
        value: _this6.state.value,
        ctx: _this6.props.ctx
      });
    };
  };

  Dict.prototype.getLocals = function getLocals() {};

  _createClass(Dict, null, [{
    key: 'defaultTransformer',
    enumerable: true,
    value: {
      format: function format(value) {
        if (_t2['default'].Arr.is(value)) {
          return value;
        }
        value = value || {};
        var result = [];
        for (var key in value) {
          if (value.hasOwnProperty(key)) {
            result.push({ domain: key, codomain: value[key] });
          }
        }
        return result;
      },
      parse: function parse(value) {
        var result = {};
        value.forEach(function (_ref2) {
          var domain = _ref2.domain;
          var codomain = _ref2.codomain;
          return result[domain] = codomain;
        });
        return result;
      }
    }
  }]);

  return Dict;
})(Component);

exports.Dict = Dict;

var Tuple = (function (_Component8) {
  function Tuple() {
    _classCallCheck(this, Tuple);

    if (_Component8 != null) {
      _Component8.apply(this, arguments);
    }
  }

  _inherits(Tuple, _Component8);

  Tuple.prototype.getTransformer = function getTransformer() {
    var options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    return Tuple.defaultTransformer(this.typeInfo.innerType);
  };

  Tuple.prototype.validate = function validate() {
    var result = this.refs.form.validate;
    if (!result.isValid()) {
      return result;
    }
    return _Component8.prototype.validate.call(this);
  };

  Tuple.prototype.getTemplate = function getTemplate() {
    var _this7 = this;

    return function () {
      var props = {};
      _this7.typeInfo.innerType.meta.types.forEach(function (type, i) {
        props[i] = type;
      });
      var Type = _t2['default'].struct(props);
      return _React2['default'].createElement(Form, {
        ref: 'form',
        type: Type,
        options: _this7.props.options,
        onChange: _this7.onChange.bind(_this7),
        value: _this7.state.value,
        ctx: _this7.props.ctx
      });
    };
  };

  Tuple.prototype.getLocals = function getLocals() {};

  _createClass(Tuple, null, [{
    key: 'defaultTransformer',
    enumerable: true,
    value: function (dict) {
      return {
        format: function format(value) {
          return value;
        },
        parse: function parse(value) {
          var result = [];
          dict.meta.types.forEach(function (type, i) {
            return result.push(value[i]);
          });
          return result;
        }
      };
    }
  }]);

  return Tuple;
})(Component);

exports.Tuple = Tuple;

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

    var options = this.props.options;
    var type = this.props.type;
    var i18n = Form.i18n;
    var templates = Form.templates;

    options = options || nooptions;

    _t2['default'].assert(_t2['default'].Type.is(type), '[' + SOURCE + '] missing required prop type');
    _t2['default'].assert(_t2['default'].Obj.is(options), '[' + SOURCE + '] prop options must be an object');
    _t2['default'].assert(_t2['default'].Obj.is(templates), '[' + SOURCE + '] missing templates config');
    _t2['default'].assert(_t2['default'].Obj.is(i18n), '[' + SOURCE + '] missing i18n config');

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
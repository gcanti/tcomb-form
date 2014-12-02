'use strict';

//============
// api -> dsl
//============

var t = require('tcomb-validation');
var api = require('./api');
var dsl = require('./dsl');
var humanize = require('./humanize');

var mixin = t.util.mixin;

module.exports = toDSL;

// transforms a type in a dsl representing the result
function toDSL(type, options) {
  var defaultCtx = {
    path: [],
    key: 'root'
  };
  return recurse(type, options, defaultCtx);
}

function recurse(type, options, ctx) {
  options = options || {};
  var Api = analyze(type);
  return new Api(options).toDSL(type, ctx);
}

// detects which api is being used
function analyze(type) {
  var kind = t.util.getKind(type);
  switch (kind) {
    case 'irriducible' :
      if (type === t.Bool) {
        return api.Checkbox;
      }
      return api.Textbox;
    case 'struct' :
      return api.Struct;
    case 'list' :
      return api.List;
    case 'enums' :
      return api.Select;
    case 'maybe' :
    case 'subtype' :
      return analyze(type.meta.type);
    default :
      t.fail(t.util.format('cannot handle %s', t.util.getName(type)));
  }
}

api.Textbox.prototype.toDSL = function (type, ctx) {

  var label = this.label;
  if (!label && ctx.auto === 'labels') {
    label = ctx.label;
  }

  // labels have priority over placeholders
  var placeholder = label ? null : (this.placeholder || ctx.label);

  var name = this.name || getName(ctx);

  return new dsl.Textbox({
    type: type,
    key: ctx.key,
    label: label,
    help: this.help,
    error: this.message,
    hasError: this.hasError,
    attrs: {
      type: this.type || 'text',
      name: name,
      placeholder: placeholder,
      defaultValue: this.value
    }
  });
};

api.Checkbox.prototype.toDSL = function (type, ctx) {

  var label = this.label;
  // checkboxes must always have a label
  if (!label) {
    label = ctx.label;
  }

  var name = this.name || getName(ctx);

  return new dsl.Checkbox({
    type: type,
    key: ctx.key,
    label: label,
    help: this.help,
    error: this.message,
    hasError: this.hasError,
    attrs: {
      name: name,
      defaultChecked: this.value
    }
  });
};

api.Select.prototype.toDSL = function (type, ctx) {
  var renderAs = this.renderAs || 'select';
  return api.Select.renderers[renderAs].call(this, type, ctx);
};

api.Select.renderers = {

  select: function (type, ctx) {

    var label = this.label;
    if (!label && ctx.auto === 'labels') {
      label = ctx.label;
    }

    var name = this.name || getName(ctx);

    var options = getOptions.call(this, type);

    return new dsl.Select({
      type: type,
      key: ctx.key,
      label: label,
      help: this.help,
      error: this.message,
      hasError: this.hasError,
      attrs: {
        name: name,
        defaultValue: this.value
      },
      options: options
    });

  },

  radio: function (type, ctx) {

    var label = this.label;
    if (!label && ctx.auto === 'labels') {
      label = ctx.label;
    }

    var name = this.name || getName(ctx);

    var options = getOptions.call(this, type);

    return new dsl.Radio({
      type: type,
      key: ctx.key,
      label: label,
      help: this.help,
      error: this.message,
      hasError: this.hasError,
      attrs: {
        name: name,
        defaultValue: this.value
      },
      options: options
    });

  }

};

function getOptions(type) {
  var options = this.options ? this.options.slice() : getOptionsOfEnum(type);
  if (this.order) {
    // sort options
    options.sort(api.Order.meta.map[this.order]);
  }

  if (this.emptyOption) {
    // add the empty choice in first position
    options.unshift(this.emptyOption);
  }
  return options;
}

function getOptionsOfEnum(type) {
  var map = type.meta.map;
  return Object.keys(map).map(function (k) {
    return {
      value: k,
      text: map[k]
    };
  });
}

api.Struct.prototype.toDSL = function (type, ctx) {

  var props = type.meta.props;
  var order = this.order || Object.keys(props);
  var fields = this.fields || {};
  var auto = this.auto || ctx.auto;
  var value = this.value || {};

  var label = this.label;
  if (!label && ctx.auto !== 'none') {
    label = ctx.label;
  }

  var rows = order.map(function (prop) {
    var options = mixin({}, fields[prop]);
    options.value = either(options.value, value[prop]);
    return recurse(props[prop], options, {
      path: ctx.path.concat(prop),
      key: prop,
      auto: auto,
      label: humanize(prop)
    });
  });

  return new dsl.Struct({
    type: type,
    key: ctx.key,
    label: label,
    error: this.message,
    hasError: this.hasError,
    rows: rows
  });
};

api.List.prototype.toDSL = function (type, ctx) {

  var itemType = type.meta.type;
  var options = mixin({}, this.item);
  var value = this.value || [];
  var auto = this.auto || ctx.auto;

  var label = this.label;
  if (!label && ctx.auto !== 'none') {
    label = ctx.label;
  }

  var rows = value.map(function (value, i) {
    options.value = value;
    return recurse(itemType, options, {
      path: ctx.path.concat(i),
      key: i + '',
      auto: auto,
      label: humanize('#' + i)
    });
  });

  return new dsl.List({
    type: type,
    key: ctx.key,
    value: value,
    label: label,
    error: this.message,
    hasError: this.hasError,
    rows: rows
  });
};

/*

  Proposals:

  - RFC 6901
  JavaScript Object Notation (JSON) Pointer
  http://tools.ietf.org/html/rfc6901

  - W3C HTML JSON form submission
  http://www.w3.org/TR/html-json-forms/

*/
function getName(ctx) {
  return ctx.path.join('/');
}

function either(a, b) {
  return t.Nil.is(a) ? b : a;
}

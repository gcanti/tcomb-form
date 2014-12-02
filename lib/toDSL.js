'use strict';

//============
// api -> dsl
//============

var t = require('tcomb-validation');
var api = require('./api');
var dsl = require('./dsl');
var humanize = require('./humanize');

var mixin = t.util.mixin;
var getKind = t.util.getKind;
var Bundle = api.Bundle;

module.exports = toDSL;

var defaultBundle = new Bundle({
  optionalLabel: ' (optional)',
  addLabel: 'Add',
  removeLabel: 'Remove',
  upLabel: 'Up',
  downLabel: 'Down'
});

// transforms a type in a dsl representing the result
function toDSL(type, options) {
  var defaultCtx = {
    bundle: defaultBundle,
    path: [],
    key: 'root'
  };
  return recurse(type, options, defaultCtx);
}

function recurse(type, options, ctx) {
  options = options || {};
  var Api = analyze(type);
  var report = {
    type: type,
    isOptional: isOptional(type)
  };
  return new Api(options).toDSL(report, ctx);
}

// detects which api is being used
function analyze(type) {
  var kind = getKind(type);
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
      return analyze(type.meta.type);
    case 'subtype' :
      return analyze(type.meta.type);
    default :
      t.fail(t.util.format('cannot handle %s', type.meta.name));
  }
}

function isOptional(type) {
  var kind = getKind(type);
  switch (kind) {
    case 'maybe' :
      return true;
    case 'subtype' :
      return isOptional(type.meta.type);
    default :
      return false;
  }
}

api.Textbox.prototype.toDSL = function (report, ctx) {

  var label = this.label;
  if (!label && ctx.auto === 'labels') {
    label = ctx.label;
  }
  if (label && report.isOptional) {
    label += ctx.bundle.optionalLabel;
  }

  // labels have priority over placeholders
  var placeholder = null;
  if (!label) {
    var placeholder = this.placeholder || ctx.label;
    if (placeholder && report.isOptional) {
      placeholder += ctx.bundle.optionalLabel;
    }
  }

  var name = this.name || getName(ctx);

  return new dsl.Textbox({
    type: report.type,
    key: ctx.key,
    label: label,
    help: this.help,
    error: this.message,
    hasError: !!this.hasError,
    typeAttr: this.type || 'text',
    name: name,
    placeholder: placeholder,
    value: this.value,
    readOnly: !!this.readOnly,
    disabled: !!this.disabled
  });
};

api.Checkbox.prototype.toDSL = function (report, ctx) {

  var label = this.label;
  // checkboxes must always have a label
  if (!label) {
    label = ctx.label;
  }

  var name = this.name || getName(ctx);

  return new dsl.Checkbox({
    type: report.type,
    key: ctx.key,
    label: label,
    help: this.help,
    error: this.message,
    hasError: !!this.hasError,
    name: name,
    value: this.value
  });
};

api.Select.prototype.toDSL = function (report, ctx) {
  var renderAs = this.renderAs || 'select';
  return api.Select.renderers[renderAs].call(this, report, ctx);
};

api.Select.renderers = {

  select: function (report, ctx) {

    var label = this.label;
    if (!label && ctx.auto === 'labels') {
      label = ctx.label;
    }
    if (label && report.isOptional) {
      label += ctx.bundle.optionalLabel;
    }

    var name = this.name || getName(ctx);

    var options = getOptions.call(this, report.type);

    return new dsl.Select({
      type: report.type,
      key: ctx.key,
      label: label,
      help: this.help,
      error: this.message,
      hasError: !!this.hasError,
      name: name,
      value: this.value,
      disabled: !!this.disabled,
      options: options
    });

  },

  radio: function (report, ctx) {

    var label = this.label;
    if (!label && ctx.auto === 'labels') {
      label = ctx.label;
    }
    if (label && report.isOptional) {
      label += ctx.bundle.optionalLabel;
    }

    var name = this.name || getName(ctx);

    var options = getOptions.call(this, report.type);

    return new dsl.Radio({
      type: report.type,
      key: ctx.key,
      label: label,
      help: this.help,
      error: this.message,
      hasError: !!this.hasError,
      name: name,
      value: this.value,
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

api.Struct.prototype.toDSL = function (report, ctx) {

  t.assert(!report.isOptional, 'optional structs are not supported');

  var props = report.type.meta.props;
  var order = this.order || Object.keys(props);
  var fields = this.fields || {};
  var auto = this.auto || ctx.auto;
  var bundle = this.bundle || ctx.bundle;
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
      label: humanize(prop),
      bundle: bundle
    });
  });

  return new dsl.Struct({
    type: report.type,
    key: ctx.key,
    label: label,
    error: this.message,
    hasError: !!this.hasError,
    rows: rows
  });
};

api.List.prototype.toDSL = function (report, ctx) {

  t.assert(!report.isOptional, 'optional lists are not supported');

  var itemType = report.type.meta.type;
  var auto = this.auto || ctx.auto;
  var bundle = this.bundle || ctx.bundle;
  var value = this.value || [];

  var label = this.label;
  if (!label && ctx.auto !== 'none') {
    label = ctx.label;
  }

  var options = mixin({}, this.item);
  function getRow(value, i) {
    options.value = value;
    return recurse(itemType, options, {
      path: ctx.path.concat(i),
      key: i + '',
      auto: auto,
      label: humanize('#' + (i + 1)),
      bundle: bundle
    });
  }

  var rows = value.map(getRow);

  return new dsl.List({
    type: report.type,
    key: ctx.key,
    value: value,
    label: label,
    error: this.message,
    hasError: !!this.hasError,
    rows: rows,
    getRow: this.disableAdd ? null : getRow,
    // FIXME
    addLabel: this.disableAdd ? null : bundle.addLabel,
    removeLabel: this.disableRemove ? null : bundle.removeLabel,
    upLabel: this.disableOrder ? null : bundle.upLabel,
    downLabel: this.disableOrder ? null : bundle.downLabel
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

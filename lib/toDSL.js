'use strict';

//
// api -> dsl
//

var t = require('tcomb-validation');
var api = require('./api');
var dsl = require('./dsl');
var humanize = require('./humanize');

var assert = t.assert;
var mixin = t.util.mixin;
var getKind = t.util.getKind;

var Transformer = dsl.Transformer;
var Bundle = api.Bundle;
var Context = api.Context;

module.exports = toDSL;

function getChain(type) {

  var T = type;
  var kind;
  var chain = [];

  while (true) {
    kind = getKind(T);
    chain.push({
      type: T,
      kind: kind
    });
    if (kind in {maybe: 1, subtype: 1, list: 1}) {
      T = T.meta.type;
      continue;
    } else {
      break;
    }
  }

  return chain;

}

function isOptional(chain) {
  return chain[0].kind === 'maybe' || (chain[0].kind === 'subtype' && chain[1].kind === 'maybe');
}

var defaultBundle = new Bundle({
  optional: ' (optional)',
  add: 'Add',
  remove: 'Remove',
  up: 'Up',
  down: 'Down'
});

var defaultTransformer = new Transformer({
  from: t.Num,
  format: function (value) {
    return t.Nil.is(value) ? value : String(value);
  },
  parse: function (value) {
    var n = parseFloat(value);
    return isNaN(n) ? null : n;
  }
});

// transforms a type in a DSL representing the whole form
function toDSL(type, options) {

  var defaultCtx = new Context({
    bundle: options.bundle || defaultBundle,
    auto: options.auto || 'placeholders',
    path: [],
    key: 'root'
  });

  return recurse(getChain(type), options, defaultCtx);
}

function recurse(chain, options, ctx) {

  options = options || {};

  // detects which api is being used
  // [extension point]
  var Api = options.api || getAPI(chain);

  // converts the api call into the internal DSL
  return new Api(options).toDSL(chain, ctx);
}

// detects which api is being used
function getAPI(chain) {
  switch (chain[0].kind) {
    case 'irriducible' :
      return (chain[0].type === t.Bool) ?
        api.Checkbox :
        api.Textbox;
    case 'struct' :
      return api.Struct;
    case 'list' :
      return api.List;
    case 'enums' :
      return api.Select;
    case 'maybe' :
    case 'subtype' :
      return getAPI(chain.slice(1));
    default :
      t.fail(t.util.format('cannot handle %s', chain[0].type.meta.name));
  }
}

api.Textbox.prototype.toDSL = function (chain, ctx) {

  var label = this.label;
  if (!label && ctx.auto === 'labels') {
    label = ctx.label;
  }
  if (label && isOptional(chain)) {
    label += ctx.bundle.optional;
  }

  // labels have priority over placeholders
  var placeholder = null;
  if (!label) {
    var placeholder = this.placeholder || ctx.label;
    if (placeholder && isOptional(chain)) {
      placeholder += ctx.bundle.optional;
    }
  }

  var name = this.name || getName(ctx);

  var transformer = this.transformer;
  if (!transformer && chain[chain.length - 1].type === t.Num) {
    transformer = defaultTransformer;
  }

  return new dsl.Textbox({
    type: chain[0].type,
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
    disabled: !!this.disabled,
    transformer: transformer
  });
};

api.Checkbox.prototype.toDSL = function (chain, ctx) {

  // checkboxes must always have a label
  var label = this.label;
  if (!label) {
    label = ctx.label;
  }

  var name = this.name || getName(ctx);

  return new dsl.Checkbox({
    type: chain[0].type,
    key: ctx.key,
    label: label,
    help: this.help,
    error: this.message,
    hasError: !!this.hasError,
    name: name,
    value: this.value,
    disabled: !!this.disabled
  });
};

api.Select.prototype.toDSL = function (chain, ctx) {
  var renderAs = this.renderAs || 'select';
  assert(api.Select.renderers.hasOwnProperty(renderAs), 'invalid `renderAs` option `%s` supplied to api.Select.renderers', renderAs);
  return api.Select.renderers[renderAs].call(this, chain, ctx);
};

api.Select.renderers = {

  select: function (chain, ctx) {

    var label = this.label;
    if (!label && ctx.auto === 'labels') {
      label = ctx.label;
    }
    if (label && isOptional(chain)) {
      label += ctx.bundle.optional;
    }

    var name = this.name || getName(ctx);

    var options = getOptions.call(this, chain[chain.length - 1].type);

    return new dsl.Select({
      type: chain[0].type,
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

  radio: function (chain, ctx) {

    var label = this.label;
    if (!label && ctx.auto === 'labels') {
      label = ctx.label;
    }
    if (label && isOptional(chain)) {
      label += ctx.bundle.optional;
    }

    var name = this.name || getName(ctx);

    var options = getOptions.call(this, chain[chain.length - 1].type);

    return new dsl.Radio({
      type: chain[0].type,
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

  var options = this.options ?
    this.options.slice() : // copy to keep the original unchanged
    getOptionsOfEnum(type);

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

api.Struct.prototype.toDSL = function (chain, ctx) {

  assert(!isOptional(chain), 'optional structs are not (yet) supported');

  var props = chain[0].type.meta.props;
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
    return recurse(getChain(props[prop]), options, new Context({
      path: ctx.path.concat(prop),
      key: prop,
      auto: auto,
      label: humanize(prop),
      bundle: bundle
    }));
  });

  return new dsl.Struct({
    type: chain[0].type,
    key: ctx.key,
    label: label,
    error: this.message,
    hasError: !!this.hasError,
    rows: rows
  });
};

api.List.prototype.toDSL = function (chain, ctx) {

  assert(!isOptional(chain), 'optional lists are not (yet) supported');

  var itemChain = chain.slice(1);
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
    return recurse(itemChain, options, new Context({
      path: ctx.path.concat(i),
      key: i + '',
      auto: auto,
      label: humanize('#' + (i + 1)),
      bundle: bundle
    }));
  }

  var rows = value.map(getRow);

  return new dsl.List({
    type: chain[0].type,
    key: ctx.key,
    value: value,
    label: label,
    error: this.message,
    hasError: !!this.hasError,
    rows: rows,
    getRow: this.disableAdd ? null : getRow,
    add: this.disableAdd ? null : bundle.add,
    remove: this.disableRemove ? null : bundle.remove,
    up: this.disableOrder ? null : bundle.up,
    down: this.disableOrder ? null : bundle.down
  });
};

//
// helpers
//

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

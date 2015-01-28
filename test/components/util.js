/*global document*/
'use strict';

var React = require('react');
var t = require('../../.');
var config = require('../../lib/config');
var getReport = require('../../lib/util/getReport');
var Context = require('../../lib/api').Context;

function noop() {}

function getContext(ctx) {
  return new Context(t.util.mixin({
    templates: config.templates,
    i18n: config.i18n,
    report: getReport(ctx.type),
    auto: 'placeholders'
  }, ctx, true));
}

function getLocalsFactory(factory) {
  return function getLocals(ctx, options, value, onChange) {
    var x = new factory.type();
    x.props = {
      ctx: getContext(ctx),
      options: options,
      value: value,
      onChange: onChange || noop
    };
    x.state = x.getInitialState();
    return x.getLocals();
  };
}

function getValueFactory(factory, template) {
  return function getValue(onResult, onRender, ctx, options, value, onChange) {
    var rendered = false;
    options = options || {};
    options.template = function (locals) {
      onRender(locals, rendered);
      return template(locals);
    };
    var element = React.createElement(factory, {
      ctx: getContext(ctx),
      options: options,
      value: value,
      onChange: onChange
    });
    var app = document.getElementById('app');
    var node = document.createElement('div');
    app.appendChild(node);
    var component = React.render(element, node);
    rendered = true;
    var result = component.getValue();
    onResult(result);
  };
}

module.exports = {
  getLocalsFactory: getLocalsFactory,
  getValueFactory: getValueFactory
};
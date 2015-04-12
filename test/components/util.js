/*global document*/
'use strict';

var React = require('react');
var t = require('../../.');
var Form = require('../../lib/components').Form;
var getReport = require('../../lib/util').getReport;

function noop() {}

function getContext(ctx) {
  return t.mixin({
    templates: Form.templates,
    i18n: Form.i18n,
    report: getReport(ctx.type),
    auto: 'placeholders',
    path: []
  }, ctx, true);
}

function getInstance(factory, ctx, options, value, onChange) {
  var x;
  if (React.version.indexOf('0.13') !== -1) {
    x = new factory({
      ctx: getContext(ctx),
      options: options || {},
      value: value,
      onChange: onChange || noop
    });
  } else {
    x = new factory.type();
    x.props = {
      ctx: getContext(ctx),
      options: options || {},
      value: value,
      onChange: onChange || noop
    };
    x.state = x.getInitialState();
  }
  return x;
}

function getLocalsFactory(factory) {
  return function getLocals(ctx, options, value, onChange) {
    return getInstance(factory, ctx, options, value, onChange).getLocals();
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
    var result = component.validate();
    onResult(result);
  };
}

module.exports = {
  getInstance: getInstance,
  getLocalsFactory: getLocalsFactory,
  getValueFactory: getValueFactory
};
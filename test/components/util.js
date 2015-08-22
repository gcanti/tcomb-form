'use strict';

var t = require('tcomb-validation');
var React = require('react');
var bootstrap = require('../../lib/templates/bootstrap');
var UIDGenerator = require('../../lib/util').UIDGenerator;

var ctx = {
  uidGenerator: new UIDGenerator('root'),
  auto: 'labels',
  config: {},
  name: 'defaultName',
  label: 'Default label',
  i18n: {
    optional: ' (optional)',
    required: '',
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

var ctxPlaceholders = getContext({auto: 'placeholders'});
var ctxNone = getContext({auto: 'none'});

function getRenderComponent(Component) {
  return function renderComponent(props) {
    props.options = props.options || {};
    props.ctx = props.ctx || ctx;
    var node = document.createElement('div');
    document.body.appendChild(node);
    return React.render(React.createElement(Component, props), node);
  };
}


module.exports = {
  ctx: ctx,
  ctxPlaceholders: ctxPlaceholders,
  ctxNone: ctxNone,
  getRenderComponent: getRenderComponent
};

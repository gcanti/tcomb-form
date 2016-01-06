import t from 'tcomb-validation'
import React from 'react'
import ReactDOM from 'react-dom'
import bootstrap from 'tcomb-form-templates-bootstrap'
import { UIDGenerator } from '../../src/util'

const ctx = {
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
}

function getContext(options) {
  return t.mixin(t.mixin({}, ctx), options, true)
}

const ctxPlaceholders = getContext({auto: 'placeholders'})
const ctxNone = getContext({auto: 'none'})

function getRenderComponent(Component) {
  return (props) => {
    props.options = props.options || {}
    props.ctx = props.ctx || ctx
    const node = document.createElement('div')
    document.body.appendChild(node)
    return ReactDOM.render(React.createElement(Component, props), node)
  }
}

export default {
  ctx,
  ctxPlaceholders,
  ctxNone,
  getRenderComponent
}

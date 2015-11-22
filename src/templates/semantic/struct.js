import { compile } from 'uvdom/react'
import getAlert from './getAlert'

function create(overrides = {}) {
  function struct(locals) {
    let children = []

    if (locals.help) {
      children.push(struct.renderHelp(locals))
    }

    if (locals.error && locals.hasError) {
      children.push(struct.renderError(locals))
    }

    children = children.concat(locals.order.map(name => locals.inputs[name]))

    return struct.renderFieldset(children, locals)
  }

  struct.renderHelp = overrides.renderHelp || function renderHelp(locals) {
    return getAlert('info', locals.help)
  }

  struct.renderError = overrides.renderError || function renderError(locals) {
    return getAlert('error', locals.error)
  }

  struct.renderLegend = overrides.renderLegend || function renderLegend(locals) {
    return {
      tag: 'h4',
      attrs: {
        className: {
          ui: true,
          dividing: true,
          header: true
        }
      },
      children: locals.label
    }
  }

  struct.renderFieldset = overrides.renderFieldset || function renderFieldset(fieldset, locals) {
    const children = locals.label ? [struct.renderLegend(locals)].concat(fieldset) : fieldset
    return {
      tag: 'fieldset',
      attrs: {
        disabled: locals.disabled,
        style: locals.path.length === 0 ? {
          border: 0,
          margin: 0,
          padding: 0
        } : null,
        className: {
          ui: true,
          form: true,
          segment: locals.path.length > 0,
          error: locals.hasError
        }
      },
      children
    }
  }

  struct.clone = function clone(newOverrides = {}) {
    return create({...overrides, ...newOverrides})
  }

  struct.toReactElement = compile

  return struct
}

export default create()

import t from 'tcomb-validation'
import { compile } from 'uvdom/react'
import getLabel from './getLabel'
import getError from './getError'
import getHelp from './getHelp'

function create(overrides = {}) {
  function checkbox(locals) {
    locals.attrs = checkbox.getAttrs(locals)
    return checkbox.renderHorizontal(locals)
  }

  checkbox.getAttrs = overrides.getAttrs || function getAttrs(locals) {
    const attrs = t.mixin({}, locals.attrs)
    attrs.type = 'checkbox'
    attrs.disabled = locals.disabled
    attrs.checked = locals.value
    attrs.onChange = evt => locals.onChange(evt.target.checked)
    if (locals.help) {
      attrs['aria-describedby'] = attrs['aria-describedby'] || (attrs.id + '-tip')
    }
    return attrs
  }

  checkbox.renderCheckbox = overrides.renderCheckbox || function renderCheckbox(locals) {
    return {
      tag: 'input',
      attrs: locals.attrs
    }
  }

  checkbox.renderLabel = overrides.renderLabel || function renderLabel(locals) {
    return getLabel({
      label: locals.label,
      htmlFor: locals.attrs.id
    })
  }

  checkbox.renderError = overrides.renderError || function renderError(locals) {
    return getError(locals)
  }

  checkbox.renderHelp = overrides.renderHelp || function renderHelp(locals) {
    return getHelp(locals)
  }

  checkbox.renderHorizontal = overrides.renderHorizontal || function renderHorizontal(locals) {
    const className = {
      inline: true,
      field: true,
      error: locals.hasError,
      disabled: locals.disabled,
      [`${locals.config.wide} wide`]: !t.Nil.is(locals.config.wide),
      [`field-depth-${locals.path.length}`]: true,
      [`field-${locals.path.join('-')}`]: locals.path.length > 0
    }
    return {
      tag: 'div',
      attrs: {
        className
      },
      children: {
        tag: 'div',
        attrs: {
          className: {
            ui: true,
            checkbox: true
          }
        },
        children: [
          checkbox.renderCheckbox(locals),
          checkbox.renderLabel(locals),
          checkbox.renderError(locals),
          checkbox.renderHelp(locals)
        ]
      }
    }
  }

  checkbox.clone = function clone(newOverrides = {}) {
    return create({...overrides, ...newOverrides})
  }

  checkbox.toReactElement = compile

  return checkbox
}

export default create()

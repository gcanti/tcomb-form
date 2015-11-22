import t from 'tcomb-validation'
import { compile } from 'uvdom/react'
import bootstrap from 'uvdom-bootstrap'
import Breakpoints from './Breakpoints'
import getError from './getError'
import getHelp from './getHelp'

const CheckboxConfig = t.struct({
  horizontal: t.maybe(Breakpoints)
}, 'CheckboxConfig')

function create(overrides = {}) {
  function checkbox(locals) {
    locals.config = checkbox.getConfig(locals)

    const children = locals.config.horizontal ?
      checkbox.renderHorizontal(locals) :
      checkbox.renderVertical(locals)

    return checkbox.renderFormGroup(children, locals)
  }

  checkbox.getConfig = overrides.getConfig || function getConfig(locals) {
    return new CheckboxConfig(locals.config || {})
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
    const attrs = checkbox.getAttrs(locals)
    return bootstrap.getCheckbox(attrs, locals.label)
  }

  checkbox.renderError = overrides.renderError || function renderError(locals) {
    return getError(locals)
  }

  checkbox.renderHelp = overrides.renderHelp || function renderHelp(locals) {
    return getHelp(locals)
  }

  checkbox.renderVertical = overrides.renderVertical || function renderVertical(locals) {
    return [
      checkbox.renderCheckbox(locals),
      checkbox.renderError(locals),
      checkbox.renderHelp(locals)
    ]
  }

  checkbox.renderHorizontal = overrides.renderHorizontal || function renderHorizontal(locals) {
    return {
      tag: 'div',
      attrs: {
        className: locals.config.horizontal.getOffsetClassName()
      },
      children: [
        checkbox.renderCheckbox(locals),
        checkbox.renderError(locals),
        checkbox.renderHelp(locals)
      ]
    }
  }

  checkbox.renderFormGroup = overrides.renderFormGroup || function renderFormGroup(children, locals) {
    return bootstrap.getFormGroup({
      className: 'form-group-depth-' + locals.path.length,
      hasError: locals.hasError,
      children
    })
  }

  checkbox.clone = function clone(newOverrides = {}) {
    return create({...overrides, ...newOverrides})
  }

  checkbox.toReactElement = compile

  return checkbox
}

export default create()

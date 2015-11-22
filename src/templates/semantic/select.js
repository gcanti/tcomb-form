import t from 'tcomb-validation'
import { compile } from 'uvdom/react'
import getLabel from './getLabel'
import getError from './getError'
import getHelp from './getHelp'

function getOption(opts) {
  return {
    tag: 'option',
    attrs: {
      disabled: opts.disabled,
      value: opts.value
    },
    children: opts.text,
    key: opts.value
  }
}

function getOptGroup(opts) {
  return {
    tag: 'optgroup',
    attrs: {
      disabled: opts.disabled,
      label: opts.label
    },
    children: opts.options.map(getOption),
    key: opts.label
  }
}

function create(overrides = {}) {
  function select(locals) {
    locals.attrs = select.getAttrs(locals)
    return select.renderVertical(locals)
  }

  select.getAttrs = overrides.getAttrs || function getAttrs(locals) {
    const attrs = t.mixin({}, locals.attrs)
    attrs.className = t.mixin({}, attrs.className)
    attrs.className['form-control'] = true
    attrs.multiple = locals.isMultiple
    attrs.disabled = locals.disabled
    attrs.value = locals.value
    attrs.onChange = evt => {
      const value = locals.isMultiple ?
        Array.prototype.slice.call(evt.target.options)
          .filter(option => option.selected)
          .map(option => option.value) :
        evt.target.value
      locals.onChange(value)
    }
    if (locals.help) {
      attrs['aria-describedby'] = attrs['aria-describedby'] || (attrs.id + '-tip')
    }
    return attrs
  }

  select.renderOptions = overrides.renderOptions || function renderOptions(locals) {
    return locals.options.map(x => x.label ?
      getOptGroup(x) :
      getOption(x)
    )
  }

  select.renderSelect = overrides.renderSelect || function renderSelect(locals) {
    return {
      tag: 'select',
      attrs: locals.attrs,
      children: select.renderOptions(locals)
    }
  }

  select.renderLabel = overrides.renderLabel || function renderLabel(locals) {
    return getLabel({
      label: locals.label,
      htmlFor: locals.attrs.id,
      breakpoints: locals.config.horizontal
    })
  }

  select.renderError = overrides.renderError || function renderError(locals) {
    return getError(locals)
  }

  select.renderHelp = overrides.renderHelp || function renderHelp(locals) {
    return getHelp(locals)
  }

  select.renderVertical = overrides.renderVertical || function renderVertical(locals) {
    return {
      tag: 'div',
      attrs: {
        className: {
          field: true,
          error: locals.hasError,
          disabled: locals.disabled,
          [`${locals.config.wide} wide`]: !t.Nil.is(locals.config.wide)
        }
      },
      children: [
        select.renderLabel(locals),
        select.renderSelect(locals),
        select.renderError(locals),
        select.renderHelp(locals)
      ]
    }
  }

  select.clone = function clone(newOverrides = {}) {
    return create({...overrides, ...newOverrides})
  }

  select.toReactElement = compile

  return select
}

export default create()

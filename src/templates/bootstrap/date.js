import t from 'tcomb-validation'
import { compile } from 'uvdom/react'
import bootstrap from 'uvdom-bootstrap'
import Breakpoints from './Breakpoints'
import getLabel from './getLabel'
import getError from './getError'
import getHelp from './getHelp'

const DateConfig = t.struct({
  horizontal: t.maybe(Breakpoints)
}, 'DateConfig')

function range(n) {
  const result = []
  for (let i = 1; i <= n; i++) { result.push(i) }
  return result
}

function padLeft(x, len) {
  let str = String(x)
  const times = len - str.length
  for (let i = 0; i < times; i++ ) { str = '0' + str }
  return str
}

function toOption(value, text) {
  return {
    tag: 'option',
    attrs: {value: value + ''},
    children: text
  }
}

const nullOption = [toOption('', '-')]

const days = nullOption.concat(range(31).map((i) => toOption(i, padLeft(i, 2))))

const months = nullOption.concat(range(12).map((i) => toOption(i - 1, padLeft(i, 2))))

function create(overrides = {}) {
  function date(locals) {
    locals.config = date.getConfig(locals)
    locals.attrs = date.getAttrs(locals)

    const children = locals.config.horizontal ?
      date.renderHorizontal(locals) :
      date.renderVertical(locals)

    return date.renderFormGroup(children, locals)
  }

  date.getConfig = overrides.getConfig || function getConfig(locals) {
    return new DateConfig(locals.config || {})
  }

  date.getAttrs = overrides.getAttrs || function getAttrs(locals) {
    return t.mixin({}, locals.attrs)
  }

  date.renderLabel = overrides.renderLabel || function renderLabel(locals) {
    return getLabel({
      label: locals.label,
      breakpoints: locals.config.horizontal
    })
  }

  date.renderError = overrides.renderError || function renderError(locals) {
    return getError(locals)
  }

  date.renderHelp = overrides.renderHelp || function renderHelp(locals) {
    return getHelp(locals)
  }

  date.renderDate = overrides.renderDate || function renderDate(locals) {
    const value = locals.value = locals.value.slice()

    function onDayChange(evt) {
      value[2] = evt.target.value === '-' ? null : evt.target.value
      locals.onChange(value)
    }

    function onMonthChange(evt) {
      value[1] = evt.target.value === '-' ? null : evt.target.value
      locals.onChange(value)
    }

    function onYearChange(evt) {
      value[0] = evt.target.value.trim() === '' ? null : evt.target.value.trim()
      locals.onChange(value)
    }

    const parts = {
      D: {
        tag: 'li',
        key: 'D',
        children: {
          tag: 'select',
          attrs: {
            disabled: locals.disabled,
            className: {
              'form-control': true
            },
            value: value[2]
          },
          events: {
            change: onDayChange
          },
          children: days
        }
      },
      M: {
        tag: 'li',
        key: 'M',
        children: {
          tag: 'select',
          attrs: {
            disabled: locals.disabled,
            className: {
              'form-control': true
            },
            value: value[1]
          },
          events: {
            change: onMonthChange
          },
          children: months
        }
      },
      YY: {
        tag: 'li',
        key: 'YY',
        children: {
          tag: 'input',
          attrs: {
            disabled: locals.disabled,
            type: 'text',
            size: 5,
            className: {
              'form-control': true
            },
            value: value[0]
          },
          events: {
            change: onYearChange
          }
        }
      }
    }

    return {
      tag: 'ul',
      attrs: {
        className: {
          'nav nav-pills': true
        }
      },
      children: locals.order.map((id) => parts[id])
    }
  }

  date.renderVertical = overrides.renderVertical || function renderVertical(locals) {
    return [
      date.renderLabel(locals),
      date.renderDate(locals),
      date.renderError(locals),
      date.renderHelp(locals)
    ]
  }

  date.renderHorizontal = overrides.renderHorizontal || function renderHorizontal(locals) {
    const label = date.renderLabel(locals)
    return [
      label,
      {
        tag: 'div',
        attrs: {
          className: label ? locals.config.horizontal.getInputClassName() : locals.config.horizontal.getOffsetClassName()
        },
        children: [
          date.renderDate(locals),
          date.renderError(locals),
          date.renderHelp(locals)
        ]
      }
    ]
  }

  date.renderFormGroup = overrides.renderFormGroup || function renderFormGroup(children, locals) {
    let className = `form-group-depth-${locals.path.length}`
    if (locals.path.length > 0) {
      className += ` form-group-${locals.path.join('-')}`
    }
    return bootstrap.getFormGroup({
      className,
      hasError: locals.hasError,
      children
    })
  }

  date.clone = function clone(newOverrides = {}) {
    return create({...overrides, ...newOverrides})
  }

  date.toReactElement = compile

  return date
}

export default create()

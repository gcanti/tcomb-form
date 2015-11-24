import t from 'tcomb-validation'
import { compile } from 'uvdom/react'
import getLabel from './getLabel'
import getError from './getError'
import getHelp from './getHelp'

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
    locals.attrs = date.getAttrs(locals)
    return date.renderVertical(locals)
  }

  date.getAttrs = overrides.getAttrs || function getAttrs(locals) {
    return t.mixin({}, locals.attrs)
  }

  date.renderDate = overrides.renderDate || function renderCheckbox(locals) {
    const value = locals.value.slice()

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
        tag: 'div',
        key: 'D',
        attrs: {
          className: {
            field: true
          }
        },
        children: {
          tag: 'select',
          attrs: {
            disabled: locals.disabled,
            value: value[2]
          },
          events: {
            change: onDayChange
          },
          children: days
        }
      },

      M: {
        tag: 'div',
        key: 'M',
        attrs: {
          className: {
            field: true
          }
        },
        children: {
          tag: 'select',
          attrs: {
            disabled: locals.disabled,
            value: value[1]
          },
          events: {
            change: onMonthChange
          },
          children: months
        }
      },

      YY: {
        tag: 'div',
        key: 'YY',
        attrs: {
          className: {
            field: true
          }
        },
        children: {
          tag: 'input',
          attrs: {
            disabled: locals.disabled,
            type: 'text',
            size: 5,
            value: value[0]
          },
          events: {
            change: onYearChange
          }
        }
      }

    }

    return {
      tag: 'div',
      attrs: {
        className: {
          inline: true,
          fields: true
        }
      },
      children: locals.order.map((id) => parts[id])
    }
  }

  date.renderLabel = overrides.renderLabel || function renderLabel(locals) {
    return getLabel({
      label: locals.label,
      htmlFor: locals.attrs.id
    })
  }

  date.renderError = overrides.renderError || function renderError(locals) {
    return getError(locals)
  }

  date.renderHelp = overrides.renderHelp || function renderHelp(locals) {
    return getHelp(locals)
  }

  date.renderVertical = overrides.renderVertical || function renderVertical(locals) {
    const className = {
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
      children: [
        date.renderLabel(locals),
        date.renderDate(locals),
        date.renderError(locals),
        date.renderHelp(locals)
      ]
    }
  }

  date.clone = function clone(newOverrides = {}) {
    return create({...overrides, ...newOverrides})
  }

  date.toReactElement = compile

  return date
}

export default create()

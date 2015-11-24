import { compile } from 'uvdom/react'
import getAlert from './getAlert'

function getButton(options) {
  return {
    tag: 'button',
    attrs: {
      className: {
        ui: true,
        basic: true,
        button: true
      }
    },
    events: {
      click: options.click
    },
    children: options.label,
    key: options.key
  }
}

function getRow(options) {
  return {
    tag: 'div',
    attrs: {
      className: {
        ui: true,
        grid: true
      }
    },
    children: options.children,
    key: options.key
  }
}

function getCol(options) {
  return {
    tag: 'div',
    attrs: {
      className: options.className
    },
    children: options.children
  }
}

function getButtonGroup(buttons) {
  return {
    tag: 'div',
    attrs: {
      className: {
        ui: true,
        basic: true,
        buttons: true
      }
    },
    children: buttons
  }
}

function create(overrides = {}) {
  function list(locals) {
    let children = []

    if (locals.help) {
      children.push(list.renderHelp(locals))
    }

    if (locals.error && locals.hasError) {
      children.push(list.renderError(locals))
    }

    children = children.concat(locals.items.map((item) => {
      return item.buttons.length === 0 ?
        list.renderRowWithoutButtons(item, locals) :
        list.renderRow(item, locals)
    }))

    if (locals.add) {
      children.push(list.renderAddButton(locals))
    }

    return list.renderFieldset(children, locals)
  }

  list.renderHelp = overrides.renderHelp || function renderHelp(locals) {
    return getAlert('info', locals.help)
  }

  list.renderError = overrides.renderError || function renderError(locals) {
    return getAlert('error', locals.error)
  }

  list.renderRowWithoutButtons = overrides.renderRowWithoutButtons || function renderRowWithoutButtons(item /* , locals*/) {
    return getRow({
      key: item.key,
      children: [
        getCol({
          className: {
            six: true,
            wide: true,
            column: true
          },
          children: item.input
        })
      ]
    })
  }

  list.renderRowButton = overrides.renderRowButton || function renderRowButton(button) {
    return getButton({
      click: button.click,
      key: button.type,
      label: button.label
    })
  }

  list.renderButtonGroup = overrides.renderButtonGroup || function renderButtonGroup(buttons /* , locals*/) {
    return getButtonGroup(buttons.map(list.renderRowButton))
  }

  list.renderRow = overrides.renderRow || function renderRow(row, locals) {
    return getRow({
      key: row.key,
      children: [
        getCol({
          className: {
            eight: true,
            wide: true,
            column: true
          },
          children: row.input
        }),
        getCol({
          className: {
            four: true,
            wide: true,
            column: true
          },
          children: list.renderButtonGroup(row.buttons, locals)
        })
      ]
    })
  }

  list.renderAddButton = overrides.renderAddButton || function renderAddButton(locals) {
    return {
      tag: 'div',
      attrs: {
        style: {
          marginTop: '1em'
        }
      },
      children: getButton(locals.add)
    }
  }

  list.renderLegend = overrides.renderLegend || function renderLegend(locals) {
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

  list.renderFieldset = overrides.renderFieldset || function renderFieldset(fieldset, locals) {
    const children = locals.label ? [list.renderLegend(locals)].concat(fieldset) : fieldset
    const len = locals.path.length
    const className = {
      ui: true,
      form: true,
      segment: locals.path.length > 0,
      error: locals.hasError,
      'fieldset': true,
      [`fieldset-depth-${len}`]: true,
      [`fieldset-${locals.path.join('-')}`]: len > 0,
      [locals.className]: !!locals.className
    }
    return {
      tag: 'fieldset',
      attrs: {
        disabled: locals.disabled,
        style: locals.path.length === 0 ? {
          border: 0,
          margin: 0,
          padding: 0
        } : null,
        className
      },
      children
    }
  }

  list.clone = function clone(newOverrides = {}) {
    return create({...overrides, ...newOverrides})
  }

  list.toReactElement = compile

  return list
}

export default create()

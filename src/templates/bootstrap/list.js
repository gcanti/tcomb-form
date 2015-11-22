import { compile } from 'uvdom/react'
import bootstrap from 'uvdom-bootstrap'

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
    return bootstrap.getAlert({
      children: locals.help
    })
  }

  list.renderError = overrides.renderError || function renderError(locals) {
    return bootstrap.getAlert({
      type: 'danger',
      children: locals.error
    })
  }

  list.renderRowWithoutButtons = overrides.renderRowWithoutButtons || function renderRowWithoutButtons(item /* , locals*/) {
    return bootstrap.getRow({
      key: item.key,
      children: [
        bootstrap.getCol({
          breakpoints: {xs: 12},
          children: item.input
        })
      ]
    })
  }

  list.renderRowButton = overrides.renderRowButton || function renderRowButton(button) {
    return bootstrap.getButton({
      click: button.click,
      key: button.type,
      label: button.label,
      className: 'btn-' + button.type
    })
  }

  list.renderButtonGroup = overrides.renderButtonGroup || function renderButtonGroup(buttons /* , locals*/) {
    return bootstrap.getButtonGroup(buttons.map(list.renderRowButton))
  }

  list.renderRow = overrides.renderRow || function renderRow(row, locals) {
    return bootstrap.getRow({
      key: row.key,
      children: [
        bootstrap.getCol({
          breakpoints: {sm: 8, xs: 6},
          children: row.input
        }),
        bootstrap.getCol({
          breakpoints: {sm: 4, xs: 6},
          children: list.renderButtonGroup(row.buttons, locals)
        })
      ]
    })
  }

  list.renderAddButton = overrides.renderAddButton || function renderAddButton(locals) {
    const button = locals.add
    return {
      tag: 'div',
      attrs: { className: 'row' },
      children: {
        tag: 'div',
        attrs: { className: 'col-lg-12' },
        children: {
          tag: 'div',
          attrs: { style: {marginBottom: '15px'} },
          children: bootstrap.getButton({
            click: button.click,
            label: button.label,
            className: 'btn-' + button.type
          })
        }
      }
    }
  }

  list.renderFieldset = overrides.renderFieldset || function renderFieldset(children, locals) {
    const className = {}
    if (locals.className) {
      className[locals.className] = true
    }
    return bootstrap.getFieldset({
      className,
      disabled: locals.disabled,
      legend: locals.label,
      children
    })
  }

  list.clone = function clone(newOverrides = {}) {
    return create({...overrides, ...newOverrides})
  }

  list.toReactElement = compile

  return list
}

export default create()


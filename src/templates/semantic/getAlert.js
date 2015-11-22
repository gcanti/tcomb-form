export default function getAlert(type, children) {
  const className = {
    ui: true,
    message: true
  }
  className[type] = true
  return {
    tag: 'div',
    attrs: { className: className },
    children: children
  }
}

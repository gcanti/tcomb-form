export default function getError(locals) {
  if (locals.hasError && locals.error) {
    return {
      tag: 'div',
      attrs: {
        className: 'ui pointing label visible red'
      },
      children: locals.error
    }
  }
}

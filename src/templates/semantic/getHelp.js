export default function getHelp({help, attrs}) {
  if (help) {
    return {
      tag: 'div',
      attrs: {
        className: 'ui pointing label visible',
        id: attrs.id + '-tip'
      },
      children: help
    }
  }
}

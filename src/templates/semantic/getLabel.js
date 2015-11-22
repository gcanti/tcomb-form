export default function getLabel(opts) {
  if (opts.label) {
    return {
      tag: 'label',
      attrs: {
        htmlFor: opts.htmlFor,
        id: opts.id
      },
      children: opts.label
    }
  }
}

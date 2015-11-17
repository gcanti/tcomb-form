export default function getHelp(locals) {
  if (!locals.help) { return; }
  return {
    tag: 'div',
    attrs: {
      className: 'ui pointing label visible',
      id: locals.id + '-tip'
    },
    children: locals.help
  };
}

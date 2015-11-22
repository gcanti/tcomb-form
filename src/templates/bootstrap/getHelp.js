import bootstrap from 'uvdom-bootstrap'

export default function getHelp({help, attrs}) {
  if (help) {
    return bootstrap.getHelpBlock({
      help,
      id: attrs.id + '-tip'
    })
  }
}

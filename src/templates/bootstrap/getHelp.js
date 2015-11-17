import bootstrap from 'uvdom-bootstrap';

export default function getHelp({help, attrs}) {
  if (!help) { return; }
  return bootstrap.getHelpBlock({
    help,
    id: attrs.id + '-tip'
  });
}

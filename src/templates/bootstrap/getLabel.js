import bootstrap from 'uvdom-bootstrap'

export default function getLabel({label, breakpoints, htmlFor, id, align}) {
  if (label) {
    const className = breakpoints ? breakpoints.getLabelClassName() : null
    return bootstrap.getLabel({
      align,
      className,
      htmlFor,
      id,
      label
    })
  }
}

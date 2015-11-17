import bootstrap from 'uvdom-bootstrap';

export default function getError({hasError, error}) {
  if (!hasError || !error) { return; }
  return bootstrap.getErrorBlock({
    error,
    hasError
  });
}

//
// Proposals:
//
// - RFC 6901
// JavaScript Object Notation (JSON) Pointer
// http://tools.ietf.org/html/rfc6901
//
// - W3C HTML JSON form submission
// http://www.w3.org/TR/html-json-forms/

module.exports = getNameAttribute;

function getNameAttribute(path) {
  return path.join('/');
}
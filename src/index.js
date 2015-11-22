/* global File */
import t from 'tcomb-validation'
import * as components from './components'

t.form = components
t.form.File = t.irreducible('File', x => x instanceof File)

module.exports = t

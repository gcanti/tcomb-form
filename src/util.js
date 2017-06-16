import t, { mixin } from 'tcomb-validation'

export function getOptionsOfEnum(type) {
  const enums = type.meta.map
  return Object.keys(enums).map(value => {
    return {
      value,
      text: enums[value]
    }
  })
}

export function getTypeInfo(type) {
  let innerType = type
  let isMaybe = false
  let isSubtype = false
  let kind
  let innerGetValidationErrorMessage

  while (innerType) {
    kind = innerType.meta.kind
    if (t.Function.is(innerType.getValidationErrorMessage)) {
      innerGetValidationErrorMessage = innerType.getValidationErrorMessage
    }
    if (kind === 'maybe') {
      isMaybe = true
      innerType = innerType.meta.type
      continue
    }
    if (kind === 'subtype') {
      isSubtype = true
      innerType = innerType.meta.type
      continue
    }
    break
  }

  const getValidationErrorMessage = innerGetValidationErrorMessage ? (value, path, context) => {
    const result = t.validate(value, type, {path, context})
    if (!result.isValid()) {
      for (let i = 0, len = result.errors.length; i < len; i++ ) {
        if (t.Function.is(result.errors[i].expected.getValidationErrorMessage)) {
          return result.errors[i].message
        }
      }
      return innerGetValidationErrorMessage(value, path, context)
    }
  } : undefined

  return {
    type,
    isMaybe,
    isSubtype,
    innerType,
    getValidationErrorMessage
  }
}

// thanks to https://github.com/epeli/underscore.string

function underscored(s) {
  return s.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase()
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function humanize(s) {
  return capitalize(underscored(s).replace(/_id$/, '').replace(/_/g, ' '))
}

export function merge(a, b) {
  return mixin(mixin({}, a), b, true)
}

export function move(arr, fromIndex, toIndex) {
  const element = arr.splice(fromIndex, 1)[0]
  arr.splice(toIndex, 0, element)
  return arr
}

export class UIDGenerator {

  constructor(seed) {
    this.seed = 'tfid-' + seed + '-'
    this.counter = 0
  }

  next() {
    return this.seed + (this.counter++)
  }

}

function containsUnion(type) {
  switch (type.meta.kind) {
  case 'union' :
    return true
  case 'maybe' :
  case 'subtype' :
    return containsUnion(type.meta.type)
  default :
    return false
  }
}

function getUnionConcreteType(type, value) {
  const kind = type.meta.kind
  if (kind === 'union') {
    const concreteType = type.dispatch(value)
    if (process.env.NODE_ENV !== 'production') {
      t.assert(t.isType(concreteType), () => 'Invalid value ' + t.assert.stringify(value) + ' supplied to ' + t.getTypeName(type) + ' (no constructor returned by dispatch)' )
    }
    return concreteType
  } else if (kind === 'maybe') {
    const maybeConcrete = t.maybe(getUnionConcreteType(type.meta.type, value), type.meta.name)
    maybeConcrete.getValidationErrorMessage = type.getValidationErrorMessage
    maybeConcrete.getTcombFormFactory = type.getTcombFormFactory
    return maybeConcrete
  } else if (kind === 'subtype') {
    const subtypeConcrete = t.subtype(getUnionConcreteType(type.meta.type, value), type.meta.predicate, type.meta.name)
    subtypeConcrete.getValidationErrorMessage = type.getValidationErrorMessage
    subtypeConcrete.getTcombFormFactory = type.getTcombFormFactory
    return subtypeConcrete
  }
}

export function getTypeFromUnion(type, value) {
  if (containsUnion(type)) {
    return getUnionConcreteType(type, value)
  }
  return type
}

function getUnion(type) {
  if (type.meta.kind === 'union') {
    return type
  }
  return getUnion(type.meta.type)
}

function findIndex(arr, element) {
  for (let i = 0, len = arr.length; i < len; i++ ) {
    if (arr[i] === element) {
      return i
    }
  }
  return -1
}

export function getBaseComponentOptions(options, defaultOptions, value, type) {
  if (t.Nil.is(options)) {
    return defaultOptions
  }
  if (t.Function.is(options)) {
    return options(value)
  }
  if (t.Array.is(options) && containsUnion(type)) {
    const union = getUnion(type)
    const concreteType = union.dispatch(value)
    const index = findIndex(union.meta.types, concreteType)
    // recurse
    return getComponentOptions(options[index], defaultOptions, value, concreteType) // eslint-disable-line no-use-before-define
  }
  return options
}

export function getComponentOptions(options, defaultOptions, value, type) {
  const opts = getBaseComponentOptions(options, defaultOptions, value, type)
  if (t.Function.is(type.getTcombFormOptions)) {
    return type.getTcombFormOptions(opts)
  }
  return opts
}

export function isArraysShallowDiffers(array, other) {
  if (array === other) {
    return false
  }

  const { length } = array
  if (length !== other.length) {
    return true
  }

  let index = -1
  while (++index < length) {
    if (array[index] !== other[index]) {
      return true
    }
  }

  return false
}

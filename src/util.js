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
    this.seed = seed
    this.counter = 0
  }

  next() {
    return this.seed + (this.counter++)
  }

}

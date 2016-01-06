import tape from 'tape'
import t from 'tcomb-validation'
import bootstrap from 'tcomb-form-templates-bootstrap'
import React from 'react'
import { Radio } from '../../src/components'
import { ctx, getRenderComponent } from './util'
const renderComponent = getRenderComponent(Radio)

const transformer = {
  format: (value) => {
    if (t.String.is(value)) {
      return value
    } else if (value === true) {
      return '1'
    }
    return '0'
  },
  parse: (value) => value === '1'
}

tape('Radio', ({ test }) => {
  const Country = t.enums({
    'IT': 'Italy',
    'FR': 'France',
    'US': 'United States'
  })

  test('label', (assert) => {
    assert.plan(5)

    assert.strictEqual(
      new Radio({
        type: Country,
        options: {},
        ctx: ctx
      }).getLocals().label,
      'Default label',
      'should have a default label')

    assert.strictEqual(
      new Radio({
        type: Country,
        options: {label: 'mylabel'},
        ctx: ctx
      }).getLocals().label,
      'mylabel',
      'should handle label option as string')

    const actual = new Radio({
      type: Country,
      options: {label: React.DOM.i(null, 'JSX label')},
      ctx: ctx
    }).getLocals().label
    assert.equal(actual.type, 'i')
    assert.equal(actual.props.children, 'JSX label')

    assert.strictEqual(
      new Radio({
        type: t.maybe(Country),
        options: {},
        ctx: ctx
      }).getLocals().label,
      'Default label (optional)',
      'should handle optional types')
  })

  test('help', (assert) => {
    assert.plan(3)

    assert.strictEqual(
      new Radio({
        type: Country,
        options: {help: 'myhelp'},
        ctx: ctx
      }).getLocals().help,
      'myhelp',
      'should handle help option as string')

    const actual = new Radio({
      type: Country,
      options: {help: React.DOM.i(null, 'JSX help')},
      ctx: ctx
    }).getLocals().help
    assert.equal(actual.type, 'i')
    assert.equal(actual.props.children, 'JSX help')
  })

  test('value', (assert) => {
    assert.plan(1)

    assert.strictEqual(
      new Radio({
        type: Country,
        options: {},
        ctx: ctx,
        value: 'a'
      }).getLocals().value,
      'a',
      'should handle value option')
  })

  test('transformer', (assert) => {
    assert.plan(1)

    assert.strictEqual(
      new Radio({
        type: t.maybe(t.Bool),
        options: {
          transformer: transformer,
          options: [
            {value: '0', text: 'No'},
            {value: '1', text: 'Yes'}
          ]
        },
        ctx: ctx,
        value: true
      }).getLocals().value,
      '1',
      'should handle transformer option (format)')
  })

  test('hasError', (assert) => {
    assert.plan(2)

    assert.strictEqual(
      new Radio({
        type: Country,
        options: {},
        ctx: ctx
      }).getLocals().hasError,
      false,
      'default hasError should be false')

    assert.strictEqual(
      new Radio({
        type: Country,
        options: {hasError: true},
        ctx: ctx
      }).getLocals().hasError,
      true,
      'should handle hasError option')
  })

  test('error', (assert) => {
    assert.plan(3)

    assert.strictEqual(
      new Radio({
        type: Country,
        options: {},
        ctx: ctx
      }).getLocals().error,
      undefined,
      'default error should be undefined')

    assert.strictEqual(
      new Radio({
        type: Country,
        options: {error: 'myerror', hasError: true},
        ctx: ctx
      }).getLocals().error,
      'myerror',
      'should handle error option')

    assert.strictEqual(
      new Radio({
        type: Country,
        options: {
          error: (value) => 'error: ' + value,
          hasError: true
        },
        ctx: ctx,
        value: 'a'
      }).getLocals().error,
      'error: a',
      'should handle error option as a function')
  })

  test('template', (assert) => {
    assert.plan(2)

    assert.strictEqual(
      new Radio({
        type: Country,
        options: {},
        ctx: ctx
      }).getTemplate(),
      bootstrap.radio,
      'default template should be bootstrap.eadio')

    const template = () => {}

    assert.strictEqual(
      new Radio({
        type: Country,
        options: {template: template},
        ctx: ctx
      }).getTemplate(),
      template,
      'should handle template option')
  })

  test('options', (assert) => {
    assert.plan(1)

    assert.deepEqual(
      new Radio({
        type: Country,
        options: {
          options: [
            {value: 'IT', text: 'Italia'},
            {value: 'US', text: 'Stati Uniti'}
          ]
        },
        ctx: ctx
      }).getLocals().options,
      [
        { text: 'Italia', value: 'IT' },
        { text: 'Stati Uniti', value: 'US' }
      ],
      'should handle options option')
  })

  test('order', (assert) => {
    assert.plan(2)

    assert.deepEqual(
      new Radio({
        type: Country,
        options: {order: 'asc'},
        ctx: ctx
      }).getLocals().options,
      [
        { text: 'France', value: 'FR' },
        { text: 'Italy', value: 'IT' },
        { text: 'United States', value: 'US' }
      ],
      'should handle order = asc option')

    assert.deepEqual(
      new Radio({
        type: Country,
        options: {order: 'desc'},
        ctx: ctx
      }).getLocals().options,
      [
        { text: 'United States', value: 'US' },
        { text: 'Italy', value: 'IT' },
        { text: 'France', value: 'FR' }
      ],
      'should handle order = desc option')
  })

  if (typeof window !== 'undefined') {
    test('validate', (assert) => {
      assert.plan(8)

      let result

      // required type, default value
      result = renderComponent({
        type: Country
      }).validate()

      assert.strictEqual(result.isValid(), false)
      assert.strictEqual(result.value, null)

      // required type, setting a value
      result = renderComponent({
        type: Country,
        value: 'IT'
      }).validate()

      assert.strictEqual(result.isValid(), true)
      assert.strictEqual(result.value, 'IT')

      // optional type
      result = renderComponent({
        type: t.maybe(Country)
      }).validate()

      assert.strictEqual(result.isValid(), true)
      assert.strictEqual(result.value, null)

      result = renderComponent({
        type: t.maybe(t.Bool),
        options: {
          transformer: transformer,
          options: [
            {value: '0', text: 'No'},
            {value: '1', text: 'Yes'}
          ]
        },
        value: true
      }).validate()

      assert.strictEqual(result.isValid(), true)
      assert.strictEqual(result.value, true)
    })
  }
})

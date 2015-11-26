import tape from 'tape'
import t from 'tcomb-validation'
import bootstrap from '../../src/templates/bootstrap'
import React from 'react'
import { Checkbox } from '../../src/components'
import { ctx, ctxPlaceholders, getRenderComponent } from './util'
const renderComponent = getRenderComponent(Checkbox)

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

tape('Checkbox', ({ test }) => {
  test('label', (assert) => {
    assert.plan(5)

    assert.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {},
        ctx: ctx
      }).getLocals().label,
      'Default label',
      'should have a default label')

    assert.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {},
        ctx: ctxPlaceholders
      }).getLocals().label,
      'Default label',
      'should have a default label even if auto !== labels')

    assert.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {label: 'mylabel'},
        ctx: ctx
      }).getLocals().label,
      'mylabel',
      'should handle label option as string')

    const actual = new Checkbox({
      type: t.Bool,
      options: {label: React.DOM.i(null, 'JSX label')},
      ctx: ctx
    }).getLocals().label
    assert.equal(actual.type, 'i')
    assert.equal(actual.props.children, 'JSX label')
  })

  test('help', (assert) => {
    assert.plan(3)

    assert.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {help: 'myhelp'},
        ctx: ctx
      }).getLocals().help,
      'myhelp',
      'should handle help option as string')

    const actual = new Checkbox({
      type: t.Bool,
      options: {help: React.DOM.i(null, 'JSX help')},
      ctx: ctx
    }).getLocals().help
    assert.equal(actual.type, 'i')
    assert.equal(actual.props.children, 'JSX help')
  })

  test('value', (assert) => {
    assert.plan(3)

    assert.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {},
        ctx: ctx
      }).getLocals().value,
      false,
      'default value should be false')

    assert.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {},
        ctx: ctx,
        value: false
      }).getLocals().value,
      false,
      'should handle value option')

    assert.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {},
        ctx: ctx,
        value: true
      }).getLocals().value,
      true,
      'should handle value option')
  })

  test('transformer', (assert) => {
    assert.plan(1)

    assert.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {transformer: transformer},
        ctx: ctx,
        value: true
      }).getLocals().value,
      '1',
      'should handle transformer option (format)')
  })

  test('hasError', (assert) => {
    assert.plan(2)

    const True = t.subtype(t.Bool, (value) => value === true)

    assert.strictEqual(
      new Checkbox({
        type: True,
        options: {},
        ctx: ctx
      }).getLocals().hasError,
      false,
      'default hasError should be false')

    assert.strictEqual(
      new Checkbox({
        type: True,
        options: {hasError: true},
        ctx: ctx
      }).getLocals().hasError,
      true,
      'should handle hasError option')
  })

  test('error', (assert) => {
    assert.plan(3)

    assert.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {},
        ctx: ctx
      }).getLocals().error,
      undefined,
      'default error should be undefined')

    assert.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {error: 'myerror', hasError: true},
        ctx: ctx
      }).getLocals().error,
      'myerror',
      'should handle error option')

    assert.strictEqual(
      new Checkbox({
        type: t.Bool,
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
      new Checkbox({
        type: t.Bool,
        options: {},
        ctx: ctx
      }).getTemplate(),
      bootstrap.checkbox,
      'default template should be bootstrap.checkbox')

    const template = () => {}

    assert.strictEqual(
      new Checkbox({
        type: t.Bool,
        options: {template: template},
        ctx: ctx
      }).getTemplate(),
      template,
      'should handle template option')
  })

  if (typeof window !== 'undefined') {
    test('validate', (assert) => {
      assert.plan(6)

      let result

      // required type, default value
      result = renderComponent({
        type: t.Bool
      }).validate()

      assert.strictEqual(result.isValid(), true)
      assert.strictEqual(result.value, false)

      // required type, setting a value
      result = renderComponent({
        type: t.Bool,
        value: true
      }).validate()

      assert.strictEqual(result.isValid(), true)
      assert.strictEqual(result.value, true)

      result = renderComponent({
        type: t.Bool,
        options: {transformer: transformer},
        value: true
      }).validate()

      // 'should handle transformer option (parse)'
      assert.strictEqual(result.isValid(), true)
      assert.strictEqual(result.value, true)
    })
  }
})

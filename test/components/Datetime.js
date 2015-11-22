import tape from 'tape'
import t from 'tcomb-validation'
import bootstrap from '../../src/templates/bootstrap'
import React from 'react'
import { Datetime } from '../../src/components'
import { ctx, getRenderComponent } from './util'
const renderComponent = getRenderComponent(Datetime)

tape('Datetime', ({ test }) => {
  test('label', (assert) => {
    assert.plan(4)

    assert.strictEqual(
      new Datetime({
        type: t.Dat,
        options: {},
        ctx: ctx
      }).getLocals().label,
      'Default label',
      'should have a default label')

    assert.strictEqual(
      new Datetime({
        type: t.Dat,
        options: {label: 'mylabel'},
        ctx: ctx
      }).getLocals().label,
      'mylabel',
      'should handle label option as string')

    const actual = new Datetime({
      type: t.Dat,
      options: {label: React.DOM.i(null, 'JSX label')},
      ctx: ctx
    }).getLocals().label
    assert.equal(actual.type, 'i')
    assert.equal(actual.props.children, 'JSX label')
  })

  test('help', (assert) => {
    assert.plan(3)

    assert.strictEqual(
      new Datetime({
        type: t.Dat,
        options: {help: 'myhelp'},
        ctx: ctx
      }).getLocals().help,
      'myhelp',
      'should handle help option as string')

    const actual = new Datetime({
      type: t.Dat,
      options: {help: React.DOM.i(null, 'JSX help')},
      ctx: ctx
    }).getLocals().help
    assert.equal(actual.type, 'i')
    assert.equal(actual.props.children, 'JSX help')
  })

  test('value', (assert) => {
    assert.plan(2)

    assert.deepEqual(
      new Datetime({
        type: t.Dat,
        options: {},
        ctx: ctx
      }).getLocals().value,
      [null, null, null],
      'default value should be [null, null, null]')

    assert.deepEqual(
      new Datetime({
        type: t.Dat,
        options: {},
        ctx: ctx,
        value: new Date(1973, 10, 30)
      }).getLocals().value,
      ['1973', '10', '30'],
      'should handle value option')
  })

  test('hasError', (assert) => {
    assert.plan(2)

    assert.strictEqual(
      new Datetime({
        type: t.Dat,
        options: {},
        ctx: ctx
      }).getLocals().hasError,
      false,
      'default hasError should be false')

    assert.strictEqual(
      new Datetime({
        type: t.Dat,
        options: {hasError: true},
        ctx: ctx
      }).getLocals().hasError,
      true,
      'should handle hasError option')
  })

  test('error', (assert) => {
    assert.plan(3)

    assert.strictEqual(
      new Datetime({
        type: t.Dat,
        options: {},
        ctx: ctx
      }).getLocals().error,
      undefined,
      'default error should be undefined')

    assert.strictEqual(
      new Datetime({
        type: t.Dat,
        options: {error: 'myerror', hasError: true},
        ctx: ctx
      }).getLocals().error,
      'myerror',
      'should handle error option')

    assert.deepEqual(
      new Datetime({
        type: t.Dat,
        options: {
          error: (value) => 'error: ' + value.getFullYear(),
          hasError: true
        },
        ctx: ctx,
        value: new Date(1973, 10, 30)
      }).getLocals().error,
      'error: 1973',
      'should handle error option as a function')
  })

  test('template', (assert) => {
    assert.plan(2)

    assert.strictEqual(
      new Datetime({
        type: t.Dat,
        options: {},
        ctx: ctx
      }).getTemplate(),
      bootstrap.date,
      'default template should be bootstrap.date')

    const template = () => {}

    assert.strictEqual(
      new Datetime({
        type: t.Dat,
        options: {template: template},
        ctx: ctx
      }).getTemplate(),
      template,
      'should handle template option')
  })

  if (typeof window !== 'undefined') {
    test('validate', (assert) => {
      assert.plan(4)

      let result

      // required type, default value
      result = renderComponent({
        type: t.Dat
      }).validate()

      assert.strictEqual(result.isValid(), false)
      assert.deepEqual(result.value, null)

      // required type, setting a value
      result = renderComponent({
        type: t.Dat,
        value: new Date(1973, 10, 30)
      }).validate()

      assert.strictEqual(result.isValid(), true)
      assert.strictEqual(result.value.getFullYear(), 1973)
    })
  }
})


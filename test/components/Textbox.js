import tape from 'tape'
import t from 'tcomb-validation'
import bootstrap from '../../src/templates/bootstrap'
import React from 'react'
import { Textbox } from '../../src/components'
import { ctx, ctxPlaceholders, ctxNone, getRenderComponent } from './util'
const renderComponent = getRenderComponent(Textbox)

const transformer = {
  format: (value) => Array.isArray(value) ? value : value.split(' '),
  parse: (value) => value.join(' ')
}

tape('Textbox', ({ test }) => {
  test('path', (assert) => {
    assert.plan(1)

    assert.deepEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().path,
      [ 'defaultPath' ],
      'should handle the path')
  })

  test('attrs', (assert) => {
    assert.plan(1)

    assert.strictEqual(
      new Textbox({
        type: t.Num,
        options: {
          type: 'number',
          attrs: {
            min: 0
          }
        },
        ctx: ctx
      }).getLocals().attrs.min,
      0,
      'should handle attrs option')
  })

  test('attrs.events', (assert) => {
    assert.plan(1)

    function onBlur() {}

    assert.deepEqual(
      new Textbox({
        type: t.Str,
        options: {
          attrs: {
            id: 'myid',
            onBlur: onBlur
          }
        },
        ctx: ctx
      }).getLocals().attrs,
      {
        name: 'defaultName',
        id: 'myid',
        onBlur: onBlur,
        placeholder: undefined
      },
      'should handle events')
  })

  test('attrs.className', (assert) => {
    assert.plan(3)

    assert.deepEqual(
      new Textbox({
        type: t.Str,
        options: {
          attrs: {
            id: 'myid',
            className: 'myclass'
          }
        },
        ctx: ctx
      }).getLocals().attrs,
      {
        name: 'defaultName',
        id: 'myid',
        className: {
          myclass: true
        },
        placeholder: undefined
      },
      'should handle classNames as strings')

    assert.deepEqual(
      new Textbox({
        type: t.Str,
        options: {
          attrs: {
            id: 'myid',
            className: ['myclass1', 'myclass2']
          }
        },
        ctx: ctx
      }).getLocals().attrs,
      {
        name: 'defaultName',
        id: 'myid',
        className: {
          'myclass1 myclass2': true
        },
        placeholder: undefined
      },
      'should handle classNames as arrays')

    assert.deepEqual(
      new Textbox({
        type: t.Str,
        options: {
          attrs: {
            id: 'myid',
            className: {
              myclass1: true,
              myclass2: true
            }
          }
        },
        ctx: ctx
      }).getLocals().attrs,
      {
        name: 'defaultName',
        id: 'myid',
        className: {
          'myclass1 myclass2': true
        },
        placeholder: undefined
      },
      'should handle classNames as object')
  })

  test('label', (assert) => {
    assert.plan(6)

    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().label,
      'Default label',
      'should have a default label')

    ctx.i18n.required = ' (required)'
    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().label,
      'Default label (required)',
      'should have a default label')
    ctx.i18n.required = ''

    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {label: 'mylabel'},
        ctx: ctx
      }).getLocals().label,
      'mylabel',
      'should handle label option as string')

    const actual = new Textbox({
      type: t.Str,
      options: {label: React.DOM.i(null, 'JSX label')},
      ctx: ctx
    }).getLocals().label
    assert.equal(actual.type, 'i')
    assert.equal(actual.props.children, 'JSX label')

    assert.strictEqual(
      new Textbox({
        type: t.maybe(t.Str),
        options: {},
        ctx: ctx
      }).getLocals().label,
      'Default label (optional)',
      'should handle optional types')
  })

  test('attrs.placeholder', (assert) => {
    assert.plan(6)

    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().attrs.placeholder,
      undefined,
      'default placeholder should be undefined')

    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {attrs: {placeholder: 'myplaceholder'}},
        ctx: ctx
      }).getLocals().attrs.placeholder,
      'myplaceholder',
      'should handle placeholder option')

    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {label: 'mylabel', attrs: {placeholder: 'myplaceholder'}},
        ctx: ctx
      }).getLocals().attrs.placeholder,
      'myplaceholder',
      'should handle placeholder option even if a label is specified')

    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctxPlaceholders
      }).getLocals().attrs.placeholder,
      'Default label',
      'should have a default placeholder if auto = placeholders')

    assert.strictEqual(
      new Textbox({
        type: t.maybe(t.Str),
        options: {},
        ctx: ctxPlaceholders
      }).getLocals().attrs.placeholder,
      'Default label (optional)',
      'should handle optional types if auto = placeholders')

    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {attrs: {placeholder: 'myplaceholder'}},
        ctx: ctxNone
      }).getLocals().attrs.placeholder,
      'myplaceholder',
      'should handle placeholder option even if auto === none')
  })

  test('disabled', (assert) => {
    assert.plan(3)

    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().disabled,
      undefined,
      'default disabled should be undefined')

    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {disabled: true},
        ctx: ctx
      }).getLocals().disabled,
      true,
      'should handle disabled = true')

    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {disabled: false},
        ctx: ctx
      }).getLocals().disabled,
      false,
      'should handle disabled = false')
  })

  test('help', (assert) => {
    assert.plan(3)

    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {help: 'myhelp'},
        ctx: ctx
      }).getLocals().help,
      'myhelp',
      'should handle help option as string')

    const actual = new Textbox({
      type: t.Str,
      options: {help: React.DOM.i(null, 'JSX help')},
      ctx: ctx
    }).getLocals().help
    assert.equal(actual.type, 'i')
    assert.equal(actual.props.children, 'JSX help')
  })

  test('value', (assert) => {
    assert.plan(3)

    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().value,
      null,
      'default value should be null')

    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx,
        value: 'a'
      }).getLocals().value,
      'a',
      'should handle value option')

    assert.strictEqual(
      new Textbox({
        type: t.Num,
        options: {},
        ctx: ctx,
        value: 1.1
      }).getLocals().value,
      '1.1',
      'should handle numeric values')
  })

  test('transformer', (assert) => {
    assert.plan(1)

    assert.deepEqual(
      new Textbox({
        type: t.Str,
        options: {transformer: transformer},
        ctx: ctx,
        value: 'a b'
      }).getLocals().value,
      ['a', 'b'],
      'should handle transformer option (format)')
  })

  test('hasError', (assert) => {
    assert.plan(2)

    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().hasError,
      false,
      'default hasError should be false')

    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {hasError: true},
        ctx: ctx
      }).getLocals().hasError,
      true,
      'should handle hasError option')
  })

  test('error', (assert) => {
    assert.plan(3)

    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().error,
      undefined,
      'default error should be undefined')

    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {error: 'myerror', hasError: true},
        ctx: ctx
      }).getLocals().error,
      'myerror',
      'should handle error option')

    assert.strictEqual(
      new Textbox({
        type: t.Str,
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
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getTemplate(),
      bootstrap.textbox,
      'default template should be bootstrap.textbox')

    const template = () => {}

    assert.strictEqual(
      new Textbox({
        type: t.Str,
        options: {template: template},
        ctx: ctx
      }).getTemplate(),
      template,
      'should handle template option')
  })

  if (typeof window !== 'undefined') {
    test('validate', (assert) => {
      assert.plan(20)

      let result

      // required type, default value
      result = renderComponent({
        type: t.Str
      }).validate()

      assert.strictEqual(result.isValid(), false)
      assert.strictEqual(result.value, null)

      // required type, setting a value
      result = renderComponent({
        type: t.Str,
        value: 'a'
      }).validate()

      assert.strictEqual(result.isValid(), true)
      assert.strictEqual(result.value, 'a')

      // string type with numeric value
      result = renderComponent({
        type: t.Str,
        value: '123'
      }).validate()

      assert.strictEqual(result.isValid(), true)
      assert.strictEqual(result.value, '123')

      // optional type
      result = renderComponent({
        type: t.maybe(t.Str)
      }).validate()

      assert.strictEqual(result.isValid(), true)
      assert.strictEqual(result.value, null)

      // numeric type
      result = renderComponent({
        type: t.Num,
        value: 1
      }).validate()

      assert.strictEqual(result.isValid(), true)
      assert.strictEqual(result.value, 1)

      // optional numeric type
      result = renderComponent({
        type: t.maybe(t.Num),
        value: ''
      }).validate()

      assert.strictEqual(result.isValid(), true)
      assert.strictEqual(result.value, null)

      // numeric type with stringy value
      result = renderComponent({
        type: t.Num,
        value: '1.01'
      }).validate()

      assert.strictEqual(result.isValid(), true)
      assert.strictEqual(result.value, 1.01)

      // subtype, setting a valid value
      result = renderComponent({
        type: t.subtype(t.Num, (n) => n >= 0),
        value: 1
      }).validate()

      assert.strictEqual(result.isValid(), true)
      assert.strictEqual(result.value, 1)

      // subtype, setting an invalid value
      result = renderComponent({
        type: t.subtype(t.Num, (n) => n >= 0),
        value: -1
      }).validate()

      assert.strictEqual(result.isValid(), false)
      assert.strictEqual(result.value, -1)

      // should handle transformer option (parse)
      result = renderComponent({
        type: t.Str,
        options: {transformer: transformer},
        value: ['a', 'b']
      }).validate()

      assert.strictEqual(result.isValid(), true)
      assert.strictEqual(result.value, 'a b')
    })
  }
})

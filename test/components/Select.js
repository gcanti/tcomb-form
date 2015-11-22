import tape from 'tape'
import t from 'tcomb-validation'
import bootstrap from '../../src/templates/bootstrap'
import React from 'react'
import { Select } from '../../src/components'
import { ctx, getRenderComponent } from './util'
const renderComponent = getRenderComponent(Select)

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

tape('Select', ({ test }) => {
  const Country = t.enums({
    'IT': 'Italy',
    'FR': 'France',
    'US': 'United States'
  })

  test('label', (assert) => {
    assert.plan(5)

    assert.strictEqual(
      new Select({
        type: Country,
        options: {},
        ctx: ctx
      }).getLocals().label,
      'Default label',
      'should have a default label')

    assert.strictEqual(
      new Select({
        type: Country,
        options: {label: 'mylabel'},
        ctx: ctx
      }).getLocals().label,
      'mylabel',
      'should handle label option as string')

    const actual = new Select({
      type: Country,
      options: {label: React.DOM.i(null, 'JSX label')},
      ctx: ctx
    }).getLocals().label
    assert.equal(actual.type, 'i')
    assert.equal(actual.props.children, 'JSX label')

    assert.strictEqual(
      new Select({
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
      new Select({
        type: Country,
        options: {help: 'myhelp'},
        ctx: ctx
      }).getLocals().help,
      'myhelp',
      'should handle help option as string')

    const actual = new Select({
      type: Country,
      options: {help: React.DOM.i(null, 'JSX help')},
      ctx: ctx
    }).getLocals().help
    assert.equal(actual.type, 'i')
    assert.equal(actual.props.children, 'JSX help')
  })

  test('value', (assert) => {
    assert.plan(2)

    assert.strictEqual(
      new Select({
        type: Country,
        options: {},
        ctx: ctx
      }).getLocals().value,
      '',
      'default value should be nullOption.value')

    assert.strictEqual(
      new Select({
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
      new Select({
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
      new Select({
        type: Country,
        options: {},
        ctx: ctx
      }).getLocals().hasError,
      false,
      'default hasError should be false')

    assert.strictEqual(
      new Select({
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
      new Select({
        type: Country,
        options: {},
        ctx: ctx
      }).getLocals().error,
      undefined,
      'default error should be undefined')

    assert.strictEqual(
      new Select({
        type: Country,
        options: {error: 'myerror', hasError: true},
        ctx: ctx
      }).getLocals().error,
      'myerror',
      'should handle error option')

    assert.strictEqual(
      new Select({
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
      new Select({
        type: Country,
        options: {},
        ctx: ctx
      }).getTemplate(),
      bootstrap.select,
      'default template should be bootstrap.select')

    const template = () => {}

    assert.strictEqual(
      new Select({
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
      new Select({
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
        { text: '-', value: '' },
        { text: 'Italia', value: 'IT' },
        { text: 'Stati Uniti', value: 'US' }
      ],
      'should handle options option')
  })

  test('order', (assert) => {
    assert.plan(2)

    assert.deepEqual(
      new Select({
        type: Country,
        options: {order: 'asc'},
        ctx: ctx
      }).getLocals().options,
      [
        { text: '-', value: '' },
        { text: 'France', value: 'FR' },
        { text: 'Italy', value: 'IT' },
        { text: 'United States', value: 'US' }
      ],
      'should handle order = asc option')

    assert.deepEqual(
      new Select({
        type: Country,
        options: {order: 'desc'},
        ctx: ctx
      }).getLocals().options,
      [
        { text: '-', value: '' },
        { text: 'United States', value: 'US' },
        { text: 'Italy', value: 'IT' },
        { text: 'France', value: 'FR' }
      ],
      'should handle order = desc option')
  })

  test('nullOption', (assert) => {
    assert.plan(2)

    assert.deepEqual(
      new Select({
        type: Country,
        options: {
          nullOption: {value: '', text: 'Select a country'}
        },
        ctx: ctx
      }).getLocals().options,
      [
        { value: '', text: 'Select a country' },
        { text: 'Italy', value: 'IT' },
        { text: 'France', value: 'FR' },
        { text: 'United States', value: 'US' }
      ],
      'should handle nullOption option')

    assert.deepEqual(
      new Select({
        type: Country,
        options: {
          nullOption: false
        },
        ctx: ctx,
        value: 'US'
      }).getLocals().options,
      [
        { text: 'Italy', value: 'IT' },
        { text: 'France', value: 'FR' },
        { text: 'United States', value: 'US' }
      ],
      'should skip the nullOption if nullOption = false')
  })

  if (typeof window !== 'undefined') {
    test('validate', (assert) => {
      assert.plan(16)

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

      // option groups
      const Car = t.enums.of('Audi Chrysler Ford Renault Peugeot')
      result = renderComponent({
        type: Car,
        options: {
          options: [
            {value: 'Audi', text: 'Audi'}, // an option
            {label: 'US', options: [ // a group of options
              {value: 'Chrysler', text: 'Chrysler'},
              {value: 'Ford', text: 'Ford'}
            ]},
            {label: 'France', options: [ // another group of options
              {value: 'Renault', text: 'Renault'},
              {value: 'Peugeot', text: 'Peugeot'}
            ], disabled: true} // use `disabled: true` to disable an optgroup
          ]
        },
        value: 'Ford'
      }).validate()

      assert.strictEqual(result.isValid(), true)
      assert.strictEqual(result.value, 'Ford')

      //
      // multiple select
      //

      // default value should be []
      result = renderComponent({
        type: t.list(Country)
      }).validate()

      assert.strictEqual(result.isValid(), true)
      assert.deepEqual(result.value, [])

      // setting a value
      result = renderComponent({
        type: t.list(Country),
        value: ['IT', 'US']
      }).validate()

      assert.strictEqual(result.isValid(), true)
      assert.deepEqual(result.value, ['IT', 'US'])

      // subtyped multiple select
      result = renderComponent({
        type: t.subtype(t.list(Country), (x) => x.length >= 2),
        value: ['IT']
      }).validate()

      assert.strictEqual(result.isValid(), false)
      assert.deepEqual(result.value, ['IT'])

      // should handle transformer option (parse)
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
      assert.deepEqual(result.value, true)
    })
  }
})


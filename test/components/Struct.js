import tape from 'tape'
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import t from '../../src/main'
import { Struct, Form } from '../../src/components'
import { ctx } from './util'

tape('Struct', ({ test }) => {
  test('options can be a function', (assert) => {
    assert.plan(2)

    let component = new Struct({
      type: t.struct({
        name: t.String
      }),
      options: {
        fields: {
          name: value => ({ disabled: value === 'a' })
        }
      },
      ctx: ctx
    })

    assert.strictEqual(component.getInputs().name.props.options.disabled, false)

    component = new Struct({
      type: t.struct({
        name: t.String
      }),
      options: {
        fields: {
          name: value => ({ disabled: value === 'a' })
        }
      },
      ctx: ctx,
      value: { name: 'a' }
    })

    assert.strictEqual(component.getInputs().name.props.options.disabled, true)
  })

  test('manages refs correctly', (assert) => {
    assert.plan(4)

    const modelA = t.struct({
      name: t.String
    })
    const modelB = modelA.extend({
      age: t.Number
    })

    let formRef = null
    const setRef = ref => {
      formRef = ref
    }

    const formProps = {
      key: 'form',
      ref: setRef,
      value: {
        name: 'test',
        age: 5
      }
    }

    const formB = React.createElement(Form, {
      ...formProps,
      type: modelB,
    })

    const renderer = ReactTestRenderer.create(formB)

    assert.strictEqual(Object.keys(formRef.inputRef.childRefs).length, 2, 'should have 2 ref keys')
    assert.strictEqual(formRef.validate().errors.length, 0, 'validation works')

    const formA = React.createElement(Form, {
      ...formProps,
      type: modelA,
    })

    renderer.update(formA)

    assert.strictEqual(Object.keys(formRef.inputRef.childRefs).length, 1, 'should have 1 ref keys')
    assert.strictEqual(formRef.validate().errors.length, 0, 'validation works')
  })
})

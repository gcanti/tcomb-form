import tape from 'tape'
import t from 'tcomb-validation'
import { Struct } from '../../src/components'
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
})

import tape from 'tape'
import t from 'tcomb-validation'
import { List } from '../../src/components'
import { ctx } from './util'

tape('List', ({ test }) => {
  test('should support unions', (assert) => {
    assert.plan(2)

    const AccountType = t.enums.of([
      'type 1',
      'type 2',
      'other'
    ], 'AccountType')

    const KnownAccount = t.struct({
      type: AccountType
    }, 'KnownAccount')

    const UnknownAccount = KnownAccount.extend({
      label: t.String,
    }, 'UnknownAccount')

    const Account = t.union([KnownAccount, UnknownAccount], 'Account')

    Account.dispatch = value => value && value.type === 'other' ? UnknownAccount : KnownAccount

    let component = new List({
      type: t.list(Account),
      ctx: ctx,
      options: {},
      value: [
        { type: 'type 1' }
      ]
    })

    assert.strictEqual(component.getItems()[0].input.props.type, KnownAccount)

    component = new List({
      type: t.list(Account),
      ctx: ctx,
      options: {},
      value: [
        { type: 'other' }
      ]
    })

    assert.strictEqual(component.getItems()[0].input.props.type, UnknownAccount)
  })
})

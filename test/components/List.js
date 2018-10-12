import tape from 'tape'
import t from 'tcomb-validation'
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import { UIDGenerator } from '../../src/util'
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

  test('should properly track refs for cases with asynchronous items elements manipulations', (assert) => {
    assert.plan(4)

    class LayoutWithAsyncItemsRender extends React.Component {
      state = {
        items: [],
      }

      componentWillReceiveProps() {
        this.updateItemsFromProps()
      }

      updateItemsFromProps() {
        this.setState({
          items: this.props.items,
        })
      }

      removeFirstItem() {
        this.props.items[0].buttons[0].click()
      }

      render() {
        const currentItems = this.props.items
        const prevItems = this.state.items

        return (
          <div>
            {currentItems.map(item => (
              <div key={item.key}>
                {item.input}
              </div>
            ))}
            {
              /*
              * We render removed children to emulate disappear animation,
              * tools like react-transition-group do the same.
              * `updateItemsFromProps` method sync items passed by factory with internal state
              * so it can be used like animation finish handler.
              */
            }
            {prevItems.map(prevItem => {
              // item already rendered
              if (currentItems.some(curItem => curItem.key === prevItem.key)) {
                return null
              }

              return (
                <div key={prevItem.key}>
                  {prevItem.input}
                </div>
              )
            })}
          </div>
        )
      }
    }

    let usersRef = null
    let usersLayoutRef = null
    const users = React.createElement(List, {
      ref: ref => usersRef = ref,
      type: t.list(t.String),
      value: ['Bob', 'Alice'],
      options: {
        template: locals => React.createElement(LayoutWithAsyncItemsRender, {
          ...locals,
          ref: ref => usersLayoutRef = ref,
        }),
      },
      onChange() {},
      ctx: {
        context: {},
        uidGenerator: new UIDGenerator('0'),
        i18n: {},
        path: [],
        templates: {
          textbox: () => null,
        },
      }
    })

    /**
     * Initial render. For 2 passed values should be collected 2 refs
     */
    const renderer = ReactTestRenderer.create(users)
    assert.strictEqual(Object.keys(usersRef.childRefs).length, 2, '#1.1')

    /**
     * Remove first item from value. Factory produce single child that will override ref for
     * "removed" child that still exists in layout state.
     * It happens because now both children pretend to set ref for same index.
     */
    usersLayoutRef.removeFirstItem()
    renderer.update(users)
    assert.strictEqual(Object.keys(usersRef.childRefs).length, 1, '#1.2')
    /**
     * Ensure that List has ref to correct (actual) item
     */
    assert.strictEqual(usersRef.childRefs[0].props.value, 'Alice', '#1.3')

    /**
     * Apply changes in layout and remove cached outdated child from elements tree.
     * It will try to remove ref for index that it has in model previously.
     * It should not remove ref for element that has same index in actual value state.
     */
    usersLayoutRef.updateItemsFromProps()
    renderer.update(users)
    assert.strictEqual(Object.keys(usersRef.childRefs).length, 1, '#1.4')
  })
})

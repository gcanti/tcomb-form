import tape from 'tape'
import { humanize, move } from '../src/util'

tape('util', ({ test }) => {
  test('humanize', (assert) => {
    assert.plan(1)
    assert.strictEqual(humanize('birthDate'), 'Birth date')
  })

  test('move', (assert) => {
    assert.plan(2)
    const initial = [1, 2, 3]
    const actual = move(initial, 1, 2)
    const expected = [1, 3, 2]
    assert.strictEqual(initial, actual)
    assert.deepEqual(actual, expected)
  })
})

import tape from 'tape'
import { humanize, move, isArraysDiffers } from '../src/util'

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

  test('isArraysDiffers', (assert) => {
    assert.plan(4)

    const array = ['foo', 1]
    let other = ['bar', 1]
    assert.equal(isArraysDiffers(array, other), true)

    other[0] = 'foo'
    assert.equal(isArraysDiffers(array, other), false)

    other.push('baz')
    assert.equal(isArraysDiffers(array, other), true)

    other = array
    assert.equal(isArraysDiffers(array, other), false)
  })
})

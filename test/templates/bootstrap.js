import tape from 'tape'
import bootstrap from '../../src/templates/bootstrap'

tape('textbox', ({ test }) => {
  const textbox = bootstrap.textbox

  test('static', (assert) => {
    assert.plan(1)

    assert.deepEqual(
      textbox({type: 'static', attrs: {}, path: []}).children[1].attrs.className,
      { 'form-control-static': true },
      'should handle static type')
  })

  test('depth', (assert) => {
    assert.plan(1)

    assert.deepEqual(
      textbox({type: 'static', attrs: {}, path: []}).attrs.className,
      {'form-group': true, 'form-group-depth-0': true, 'has-error': undefined},
      'should handle form depth')
  })
})

tape('date', ({ test }) => {
  const date = bootstrap.date

  test('should handle help option', (assert) => {
    assert.plan(1)

    assert.deepEqual(
      date({value: [1973, 10, 30], order: ['M', 'D', 'YY'], path: [], help: 'my help', attrs: {id: 'myId'}}).children[3].tag,
      'span')
  })
})

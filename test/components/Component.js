import tape from 'tape'
import t from 'tcomb-validation'
import { Component, getComponent } from '../../src/components'
import { ctx } from './util'

tape('Component', ({ test }) => {
  test('getComponent publi API', (assert) => {
    assert.plan(1)
    assert.ok(t.Function.is(getComponent))
  })

  test('getValidationErrorMessage', (assert) => {
    assert.plan(16)

    let component = new Component({
      type: t.String,
      options: {hasError: true},
      ctx: ctx
    })

    assert.strictEqual(component.getError(), undefined, '#1')

    component = new Component({
      type: t.maybe(t.String),
      options: {hasError: true},
      ctx: ctx
    })

    assert.strictEqual(component.getError(), undefined, '#2')

    const Password = t.refinement(t.String, (s) => s.length > 6)

    component = new Component({
      type: Password,
      options: {hasError: true},
      ctx: ctx
    })

    assert.strictEqual(component.getError(), undefined, '#3')

    Password.getValidationErrorMessage = () => 'bad password'

    component = new Component({
      type: Password,
      options: {hasError: false},
      ctx: ctx
    })

    assert.strictEqual(component.getError(), undefined, '#4.1')

    component = new Component({
      type: Password,
      options: {hasError: true},
      ctx: ctx
    })

    assert.strictEqual(component.getError(), 'bad password', '#4.2')

    component = new Component({
      type: t.maybe(Password),
      options: {hasError: true},
      ctx: ctx
    })

    assert.strictEqual(component.getError(), undefined, '#5')

    component = new Component({
      type: t.maybe(Password),
      options: {hasError: true},
      ctx: ctx,
      value: 'a'
    })

    assert.strictEqual(component.getError(), 'bad password', '#6')

    t.String.getValidationErrorMessage = () => 'bad string'

    component = new Component({
      type: Password,
      options: {hasError: true},
      ctx: ctx
    })

    assert.strictEqual(component.getError(), 'bad string', '#7')

    delete t.String.getValidationErrorMessage

    const Age = t.refinement(t.Number, (n) => n > 6)

    component = new Component({
      type: Age,
      options: {hasError: true},
      ctx: ctx
    })

    assert.strictEqual(component.getError(), undefined, '#8')

    component = new Component({
      type: t.maybe(Age),
      options: {hasError: true},
      ctx: ctx
    })

    assert.strictEqual(component.getError(), undefined, '#9')

    Age.getValidationErrorMessage = () => 'bad age'

    component = new Component({
      type: Age,
      options: {hasError: true},
      ctx: ctx
    })

    assert.strictEqual(component.getError(), 'bad age', '#10')

    component = new Component({
      type: t.maybe(Age),
      options: {hasError: true},
      ctx: ctx
    })

    assert.strictEqual(component.getError(), undefined, '#11')

    component = new Component({
      type: t.maybe(Age),
      options: {hasError: true},
      ctx: ctx,
      value: 'a'
    })

    assert.strictEqual(component.getError(), 'bad age', '#12')

    t.Number.getValidationErrorMessage = () => 'bad number'

    component = new Component({
      type: Age,
      options: {hasError: true},
      ctx: ctx,
      value: 'a'
    })

    assert.strictEqual(component.getError(), 'bad number', '#13')

    component = new Component({
      type: Age,
      options: {hasError: true},
      ctx: ctx,
      value: 1
    })

    assert.strictEqual(component.getError(), 'bad age', '#14')

    component = new Component({
      type: t.maybe(Age),
      options: {hasError: true},
      ctx: ctx
    })

    assert.strictEqual(component.getError(), undefined, '#15')

    delete t.Number.getValidationErrorMessage
  })

  test('typeInfo', (assert) => {
    assert.plan(3)

    const MaybeString = t.maybe(t.String)
    const Subtype = t.subtype(t.String, () => true )

    let component = new Component({
      type: t.String,
      options: {},
      ctx: ctx
    })

    assert.deepEqual(component.typeInfo, {
      type: t.String,
      isMaybe: false,
      isSubtype: false,
      innerType: t.Str,
      getValidationErrorMessage: undefined
    })

    component = new Component({
      type: MaybeString,
      options: {},
      ctx: ctx
    })

    assert.deepEqual(component.typeInfo, {
      type: MaybeString,
      isMaybe: true,
      isSubtype: false,
      innerType: t.Str,
      getValidationErrorMessage: undefined
    })

    component = new Component({
      type: Subtype,
      options: {},
      ctx: ctx
    })

    assert.deepEqual(component.typeInfo, {
      type: Subtype,
      isMaybe: false,
      isSubtype: true,
      innerType: t.Str,
      getValidationErrorMessage: undefined
    })
  })

  test('getId()', (assert) => {
    assert.plan(1)

    assert.strictEqual(
      new Component({
        type: t.Str,
        options: {attrs: {id: 'myid'}},
        ctx: ctx
      }).getId(),
      'myid',
      'should return the provided id')
  })
})

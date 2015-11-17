# Changelog

> **Tags:**
> - [New Feature]
> - [Bug Fix]
> - [Breaking Change]
> - [Documentation]
> - [Internal]
> - [Polish]
> - [Experimental]

**Note**: Gaps between patch versions are faulty/broken releases.
**Note**: A feature tagged as Experimental is in a high state of flux, you're at risk of it changing without notice.

## v0.7.7

- **Bug Fix**
    - Incosistent calling of tcomb-validation validate function in getTypeInfo and components for struct and list types, fix #253
- **Experimental**
    - if a type owns a `getTcombFormFactory(options)` static function, it will be used to retrieve the suitable factory

    ```js
    // instead of
    const Country = t.enums.of(['IT', 'US'], 'Country');

    const Type = t.struct({
      country: Country
    });

    const options = {
      fields: {
        country: {
          factory: t.form.Radio
        }
      }
    };

    // you can write
    const Country = t.enums.of(['IT', 'US'], 'Country');

    Country.getTcombFormFactory = function () {
      return t.form.Radio;
    };

    const Type = t.struct({
      country: Country
    });
    ```

- **Internal**
    - remove `raw` param in `getValue` API
    - remove deprecated types
    - factor out UIDGenerator from `Form` render method
    - optimise getError(): return an error message only if `hasError === true`
    - split bootstrap templates
    - split semantic templates

## v0.7.6

- **Bug Fix**
    - de-optimise structs / lists onChange, fix #235
- **Experimental**
    - add support for maybe structs and maybe lists, fix #236

## v0.7.5

- **Bug Fix**
    - optional refinement with custom error message not passing locals.error, fix #230
    - Kind is undefined in onChange for nested List, fix #231
- **Internal**
    - custom error function now takes a parsed value

## v0.7.4

- **New Feature**
    - pass the component options to the error option function, fix #222
- **Bug Fix**
    - Inconsistent error message creation process between `validate(val, type)` and form validation, fix #221
    - Radio component does not have a transformer in IE10-, fix #226
- **Internal**
    - upgrade to react v0.14

## v0.7.3

- **New Feature**
    - add the type to template locals, fix #210
- **Bug Fix**
    - Fields are wrapped in a form-group, fix #215

## v0.7.2

- **Bug Fix**
    - Add className to locals of Struct and List (thanks @jsor)

## v0.7.1

- **Internal**
    - upgrade to latest version of tcomb-validation (2.2.0)
    - removed react-dom dependency
    - removed debug dependency
- **New Feature**
    - added argument `context` to `error` options that are functions (new signature: `error(value, path, context)`)
    - added `error` option default if the type constructor owns a `getValidationErrorMessage(value, path, context)` function
    - added `context` prop to all components (passed into `error` as `context` argument)

## v0.7.0

- **Breaking Change**
    - upgrade to react v0.14.0-rc1, fix #194

## v0.6.4

- **New Feature**
    - added a `required` field to i18n, fix #181

## v0.6.3

- **Bug Fix**
    - `help` option for `t.Dat` gives bootstrap error #164

## v0.6.2

- **Internal**
    + upgrade to latest version of tcomb-validation (2.0.0)

## v0.6.1

- **Internal**
    + memoise `t.form.Component::getId()`
- **Bug Fix**
    + Encountered two children with the same key fix #152

## v0.6.0

- **Breaking Change**
    + upgrade to tcomb-validation v2.0.0-beta

## v0.5.5

- **Internal**
    + Relax Bootstrap columns constraint #149

## v0.5.4

- **Bug Fix**
    + Unable to disable t.Dat field #137
- **New Feature**
    + t.Dat basic template (semantic skin)

## v0.5.3

- **New Feature**
    + Add buttonBefore support (bootstrap skin) #126
- **Bug Fix**
    + fix server-side rendering markup differences #124
- **Internal**
    + tcomb-validation: upgrade to latest version

## v0.5.2

- **New Feature**
    + Add buttonAfter support (bootstrap skin) #126
- **Documentation**
    + Add `attrs` option
    + Add Date input
    + Fix wrong imports in Customizations section
- **Internal**
    + Optimise stuct and list re-rendering on value change
    + fix server-side rendering markup differences #124

## v0.5.1

- **Bug Fix**
    + Remove wrong label id attribute in date template (bootstrap skin)

## v0.5

- **New Feature**
    + Add attributes and events (`attrs` option) #76, #91, #53, #67
    + Add bootstrap static control, #92
    + Set class on form-group div indicating its depth within form, #64
    + Added `kind` param to `onChange` handler
- **Breaking Change**
    + Drop support for React v0.12.x
    + Moved `placeholder` option within `attrs` option
    + Moved `id` option within `attrs` option
- **Bug Fix**
    + Remove class "has-error" from empty optional numeric field #113
- **Documentation**
    + Add GUIDE.md
- **Internal**
    + Complete code refactoring

## v0.4.10

- **New Feature**
    + Add experimental semantic ui skin
- **Bug Fix**
    + Fix `nullOption` was incorrectly added to multiple selects

## v0.4.9

- **New Feature**
    + added `template` option to structs and lists
    + added `Component.extend` API
    + added `getComponent(path)` API
    + added basic date component
- **Internal**
    + complete code refactoring

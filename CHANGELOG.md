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

## v0.9.10

- **Bug Fix**
    - struct's and list's validate() now set hasError to true when there are errors, fix #350 (@gcanti, thanks @volkanunsal)

## v0.9.9

- **Bug Fix**
    - retain static functions when constructing concrete type from union (@minedeljkovic)

## v0.9.8

- **Bug Fix**
    - `_nativeContainerInfo` no longer exists in React v15.2.0, use `_hostContainerInfo` instead, fix #345 (thanks @kikoanis)
    - `transformer.parse` was not called for structs and lists (@gcanti)
- **Experimental**
    - add support for interfaces (tcomb ^3.1.0), fix #341 (@gcanti)

## v0.9.7

- **New Feature**
    - add support for union options (thanks @minedeljkovic)

## v0.9.6

- **Bug Fix**
    - Broken with jspm, fix #331 (thanks @abhishiv)

## v0.9.5

- **Bug Fix**
    - check for existing index in `List`'s `getValue` method, fix #322 (thanks @rajeshps)

## v0.9.4

- **Bug Fix**
    - fix broken server side rendering with React v15.0.0, fix https://github.com/gcanti/tcomb-form-templates-bootstrap/issues/7
    - Optional or subtyped unions, fix #319

## v0.9.3

- **Internal**
    - Move React to peerDependecies and devDependencies, fix #313 (thanks @maksis)

## v0.9.2

- **Internal**
    - use empty string instead of null in textbox format, fix #308 (thanks @snadn). Reference https://facebook.github.io/react/blog/#new-deprecations-introduced-with-a-warning

## v0.9.1

- **Bug Fix**
    - upgrade to `tcomb-form-templates-bootstrap` v0.2, ref https://github.com/gcanti/tcomb-json-schema/issues/22

## v0.9.0

**Warning**. If you don't rely in your codebase on the property `maybe(MyType)(undefined) === null` this **is not a breaking change** for you.

- **Breaking Change**
    - upgrade to `tcomb-validation` v3.0.0
- **Polish**
    - remove `evt.preventDefault()` calls

## v0.8.2

- **New Feature**
    - now `options` can also be a function `(value: any) -> object`
    - support for unions, fix #297
    - add new `isPristine` field to components `state`
- **Documentation**
    - add issue template (new GitHub feature)

## v0.8.1

- **New Feature**
    - add dist configuration for [npmcdn](https://npmcdn.com/)

## v0.8.0

- **Breaking Change**
    - drop `uvdom`, `uvdom-bootstrap` dependencies
    - bootstrap templates in its own repo [tcomb-form-templates-bootstrap](https://github.com/gcanti/tcomb-form-templates-bootstrap)
    - semantic templates in its own repo [tcomb-form-templates-semantic](https://github.com/gcanti/tcomb-form-templates-semantic)

**Migration guide**

`tcomb-form` follows semver and technically this is a breaking change (hence the minor version bump).
However, if you are using the default bootstrap templates, the default language (english) and you are not relying on the `uvdom` and `uvdom-bootstrap` modules, this is **not a breaking change** for you.

### How to

**I'm using the default bootstrap templates and the default language (english)**

This is easy: nothing changed for you.

**I'm using the default bootstrap templates but I override the language**

```diff
var t = require('tcomb-form/lib');
-var templates = require('tcomb-form/lib/templates/bootstrap');
+var templates = require('tcomb-form/node_modules/tcomb-form-templates-bootstrap');

t.form.Form.templates = templates;
t.form.Form.i18n = {
  ...
};
```

(contributions to `src/i18n` folder welcome!)

**I'm using the default language (english) but I override the templates**

```sh
npm install tcomb-form-templates-semantic --save
```

```diff
var t = require('tcomb-form/lib');
var i18n = require('tcomb-form/lib/i18n/en');
-var templates = require('tcomb-form/lib/templates/semantic');
+var templates = require('tcomb-form-templates-semantic');

t.form.Form.i18n = i18n;
t.form.Form.templates = templates;
```

## v0.7.10

- **Bug Fix**
    - IE8 issue, 'this.refs.input' is null or not and object, fix #268

## v0.7.9

- **Bug Fix**
    - use keys returned from getTypeProps as refs, #269

## v0.7.8

**Warning**. `uvdom` dependency is deprecated and will be removed in the next releases. If you are using custom templates based on `uvdom`, please add a static function `toReactElement` before upgrading to v0.8:

```js
const Type = t.struct({
  name: t.String
})

import { compile } from 'uvdom/react'

function myTemplate(locals) {
  return {tag: 'input', attrs: { value: locals.value }}
}

myTemplate.toReactElement = compile // <= here

const options = {
  fields: {
    name: {
      template: myTemplate
    }
  }
}
```

- **New Feature**
    - complete refactoring of bootstrap templates, fix #254
        - add a type property to button locals
        - one file for each template
        - every template own a series of render* function that can be overridden

        **Example**

        ```js
        const Type = t.struct({
          name: t.String
        })

        const myTemplate = t.form.Form.templates.textbox.clone({
          // override default implementation
          renderInput: (locals) => {
            return <input value={locals.value} />
          }
        })

        const options = {
          fields: {
            name: {
              template: myTemplate
            }
          }
        }
        ```

        - more style classes for styling purposes, fix #171

        **Example**

        ```js
        const Type = t.struct({
          name: t.String,
          rememberMe: t.Boolean
        })
        ```

        outputs

        ```html
        <!-- fieldset fieldset-depth-<path depth> -->
        <fieldset class="fieldset fieldset-depth-0" data-reactid=".0.0">
          <!-- form-group form-group-depth-<path depth> form-group-<field name> -->
          <div class="form-group form-group-depth-1 form-group-name" data-reactid=".0.0.$name">
            ...
          </div>
          <div class="form-group form-group-depth-1 form-group-rememberMe" data-reactid=".0.0.$rememberMe">
            ...
          </div>
        </fieldset>
        ```

    - complete refactoring of semantic templates
        - add a type property to button locals
        - one file for each template
        - every template own a series of render* function that can be overridden
        - more style classes for styling purposes, fix #171
    - add `context` prop to template `locals`
- **Bug Fix**
    - Incosistent calling of tcomb-validation `validate` function in `getTypeInfo` and components for struct and list types, fix #253
    - avoid useless re-renderings of Datetime when the value is undefined
- **Experimental**
    - if a type owns a `getTcombFormFactory(options)` static function, it will be used to retrieve the suitable factory

    **Example**

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

    Country.getTcombFormFactory = function (/*options*/) {
      return t.form.Radio;
    };

    const Type = t.struct({
      country: Country
    });

    const options = {};
    ```

- **Internal**
    - remove `raw` param in `getValue` API (use `validate()` API instead)
    - remove deprecated types short alias from tests
    - factor out UIDGenerator from `Form` render method
    - optimize `getError()` return an error message only if `hasError === true`

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

# Changelog

> **Tags:**
> - [New Feature]
> - [Bug Fix]
> - [Breaking Change]
> - [Documentation]
> - [Internal]
> - [Polish]

**Note**: Gaps between patch versions are faulty/broken releases.

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

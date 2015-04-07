# new API proposal

```
type Label = string | ReactElement;
type ErrorMessage = Label | (value: any) => Label;
type Template = (locals: Object) => ReactElement;
type Transformer = {
  format: (value: any) => any;
  parse: (value: any) => any;
};
```

## Component

Base class for components.

```js
{
  attrs: {}, // added feature (handle attributes and events)
  config: {}, // custom config for the template
  component?: ReactClass,
  disabled?: boolean,
  error?: ErrorMessage,
  hasError?: boolean,
  help?: Label,
  label?: Label,
  template?: Template,
  transformer?: Transformer
}
```

## Textbox

Extends `Component`.

```js
{
  type: 'textarea' | 'text' | html5 types
}
```

# Breaking changes

- drop support for React v0.12.x

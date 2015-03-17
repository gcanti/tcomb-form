/// <reference path="react.d.ts" />
/// <reference path="tcomb.d.ts" />

declare module tcomb {

  module form {

    type Type = Function;

    type Template = (locals: any) => React.ReactElement<any>;

    interface Skin {
      name?:    string;
      textbox:  Template;
      checkbox: Template;
      select:   Template;
      radio:    Template;
      struct:   Template;
      list:     Template;
    }

    interface I18n {
      optional: string;
      add: string;
      remove: string;
      up: string;
      down: string;
    }

    interface Transformer<From, To> {
      format: (value: From) => To;
      parse: (value: To) => From;
    }

    interface Report {
      innerType?: Type;
      maybe?: boolean;
      subtype?: boolean;
      type: Type
    }

    interface Context {
      auto: string;
      config?: Object;
      i18n: I18n;
      label?: string;
      name?: string;
      report: Report;
      templates: {[key: string]: Template;};
    }

    interface Component extends React.ComponentClass<{
      options?: Object;
      ctx: Context;
      value: any;
      onChange: (value: any) => void;
    }> {}

    interface Config {
      templates?: Skin;
      i18n: I18n;
      transformers: {[key: string]: Transformer<any, any>;};
      irreducibles: {[key: string]: Component;};
    }

    type Label = string | React.ReactElement<any>;

    type ErrorMessage = string | ((value: any) => Label);

    interface TextboxOptions {
      autoFocus?: boolean;
      config?: Object;
      disabled?: boolean;
      error?: ErrorMessage;
      hasError?: boolean;
      help?: Label;
      id?: string;
      label?: Label;
      name?: string;
      placeholder?: string;
      template?: Template;
      transformer?: Transformer<any, any>;
      type?: string;
      className?: string;
    }

    interface CheckboxOptions {
      autoFocus?: boolean;
      config?: Object;
      disabled?: boolean;
      hasError?: boolean;
      help?: Label;
      id?: string;
      error?: ErrorMessage;
      label?: Label;
      name?: string;
      template?: Template;
      className?: string;
    }

    type Order = string;

    interface Option {
      disabled?: boolean;
      text: string;
      value: string;
    }

    interface OptGroup {
      disabled?: boolean;
      label: string;
      options: Array<Option>
    }

    interface SelectOptions {
      autoFocus?: boolean;
      config?: Object;
      disabled?: boolean;
      hasError?: boolean;
      help?: Label;
      id?: string;
      error?: ErrorMessage;
      label?: Label;
      name?: string;
      nullOption?: Option | boolean;
      options?: Array<Option | OptGroup>;
      order?: Order;
      template?: Template;
      className?: string;
    }

    interface RadioOptions {
      autoFocus?: boolean;
      config?: Object;
      disabled?: boolean;
      hasError?: boolean;
      help?: Label;
      id?: string;
      error?: ErrorMessage;
      label?: Label;
      name?: string;
      options?: Array<Option>;
      order?: Order;
      template?: Template;
      className?: string;
    }

    interface StructOptions {
      auto?: string;
      config?: Object;
      disabled?: boolean;
      fields?: {[key: string]: Options;};
      i18n?: I18n;
      hasError?: boolean;
      help?: Label;
      error?: ErrorMessage;
      legend?: Label;
      order?: Array<Label>;
      templates?: {[key: string]: Template;};
      className?: string;
    }

    interface ListOptions {
      auto?: string;
      config?: Object;
      disableAdd?: boolean;
      disableRemove?: boolean;
      disableOrder?: boolean;
      disabled?: boolean;
      i18n?: I18n
      item?: Options;
      hasError?: boolean;
      help?: Label;
      error?: ErrorMessage;
      legend?: Label;
      templates?: {[key: string]: Template;};
      className?: string;
    }

    type FormOptions = StructOptions | ListOptions;

    type Options = StructOptions | ListOptions | TextboxOptions | CheckboxOptions | SelectOptions | RadioOptions;

    interface FormProps {
      type: Type;
      options?: FormOptions;
      value?: any;
      onChange?: (value: any) => void;
    }

    interface Form extends React.ComponentClass<FormProps> {}

    //
    // exports
    //

    export var config:    Config;
    export var Form:      Form;
    export var Select:    Component;
    export var Radio:     Component;

  }

}

declare module 'tcomb-form' {
  export = tcomb
}

declare module 'tcomb-form/lib/skins/bootstrap' {
  var templates: tcomb.form.Skin;
  export = templates
}
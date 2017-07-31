import * as React from 'react';
import * as t from 'tcomb-validation';

export * from 'tcomb-validation';



type Path = Array<string | number>;

/**
 * - add: List item added.
 * - remove: List item removed.
 * - moveUp: List item moved up.
 * - moveDown: List item moved down.
 */
type ChangeKind = 'add' | 'remove' | 'moveUp' | 'moveDown';

declare namespace form {

    type PlaceholderOptions = 'auto' | 'none';

    type ErrorMessage = JSX.Element | ((value: any, path: Path, context: any) => JSX.Element);

    type TcombI18NOptions = {
        add: string;
        down: string;
        /**
         * Suffix for optional fields.
         */
        optional: string;
        /**
         * Suffix for required fields.
         */
        required: string;
        remove: string;
        up: string;
    }

    interface TemplateLocals {
        attrs: any;
        config: any;
        context: any;
        disabled?: boolean;
        error?: React.ReactNode;
        hasError?: boolean;
        label?: React.ReactNode;
        onChange: (value: any) => void;
        path: Path;
        typeInfo: any;
        value: any;

        inputs: { [name: string]: React.ReactElement<any> }
    }

    interface Transformer {
        /**
         * From actual value to value used in the input.
         */
        format(value: any): any;
        /**
         * From value in the input to actual value.
         */
        parse(value: any): any;
    }

    type TemplateFunction = (locals: TemplateLocals) => React.ReactNode;
    type ErrorMessageFunction = (value: any, path: Path, context: any) => React.ReactNode | null;

    type TcombRenderingOptions = {
        label?: React.ReactNode;
        help?: React.ReactNode;
        disabled?: boolean;
        template?: TemplateFunction;
        transformer?: Transformer;

        error?: React.ReactNode | ErrorMessageFunction;
        hasError?: boolean;

        i18n?: TcombI18NOptions;

        config?: any;
    }

    type TcombStructOptions = TcombRenderingOptions & {
        auto?: PlaceholderOptions;
        legend?: JSX.Element;
        fields?: { [field: string]: TcombFieldOptions };
        order?: Array<string>;
    }

    type TcombListOptions = TcombRenderingOptions & {
        item?: TcombRenderingOptions;
        disableOrder?: boolean;
    }

    type TcombFieldAttrs = {
        className?: string | { [cls: string]: boolean } | Array<string>;

        [attr: string]: any;
    }

    type SelectOption = { 
        value: string;
        text: string;
        disabled?: boolean;
        options?: Array<SelectOption>;
    };

    type TcombFieldOptions = TcombRenderingOptions & {
        type?: string;

        options?: Array<SelectOption>;

        nullOption?: false | SelectOption;

        order?: 'asc' | 'desc' | Array<'D' | 'M' | 'YY'>;

        attrs?: TcombFieldAttrs;

        factory?: Component;
    }

    interface TCombFormProps {
        /**
         * Current raw value.
         */
        value: any;
        /**
         * Type used to create the form.
         */
        type: t.Type<any>;
        /**
         * Options for customizing the appearance of the rendered form.
         */
        options?: TcombRenderingOptions;
        /**
         * Called when the raw value of the form changes.
         * 
         * @param raw Current raw value (may be invalid)
         * @param path Path to the field that triggered the change
         * @param kind The type of change on a list (may be undefined). 
         */
        onChange?: (raw: any, path: Path, kind?: ChangeKind) => void;

    }

    export class Component extends React.Component {
        validate(): t.ValidationResult;
    }

    export class Radio extends Component {}
    export class Select extends Component {}
    export class Textbox extends Component {}
    export class Checkbox extends Component {}
    export class Datetime extends Component {}
    export class Struct extends Component {}
    export class List extends Component {}
    
    interface TcombTemplate {
        getTemplate(): TemplateFunction;
        clone(spec: any): TcombTemplate;
    }

    export class Form extends React.Component<TCombFormProps> {
        /**
         * Validates the form and returns the resulting value.
         * If validation failed, this will return null.
         */
        getValue(): any;
        /**
         * Returns the field component for the specified path.
         */
        getComponent(path: Path): Component;
        /**
         * Validates the current form value.
         */
        validate(): t.ValidationResult;

        templates: { [name: string]: TcombTemplate };

        i18n: TcombI18NOptions;
    }
}

// Augment the 'tcomb' module.

declare module 'tcomb' {
    export interface Type<T> extends t.Type<T> {
        getTcombFormFactory(options: form.TcombRenderingOptions): form.Component;
        getTcombFormOptions(options: form.TcombRenderingOptions): form.TcombRenderingOptions;
    }
}

export { form };
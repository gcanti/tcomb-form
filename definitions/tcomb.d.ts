declare module tcomb {

  export function format(pattern: string, ...values: any[]): string;
  export function getFunctionName(x: Function): string;
  interface Type {
    meta: {
      kind: string;
      name: string;
    };
    displayName: string;
    is(x: any): boolean;
  }
  export function getTypeName(type: Type): string;
  export function mixin(target: Object, source: Object, overwrite?: boolean): Object;
  export var slice: typeof Array.prototype.slice;
  export function shallowCopy<A extends Object>(x: A): A;
  export function update<A extends Type>(instance: A, spec: Object): A; // FIXME narrow down spec
  export function assert(guard: boolean, message?: string, ...values: any[]): void;
  export function fail(message: string): void;
  type Predicate = (x: any) => boolean;
  interface Irreducible<A> extends Type {
    (x: A): A;
  }
  export function irreducible<Primitive>(name: string, is: Predicate): Irreducible<Primitive>;
  export var Any: Irreducible<any>;
  export var Nil: Irreducible<any>;
  export var Str: Irreducible<string>;
  export var Num: Irreducible<number>;
  export var Bool: Irreducible<boolean>;
  export var Arr: Irreducible<Array<any>>;
  export var Obj: Irreducible<Object>;
  export var Func: Irreducible<Function>;
  export var Err: Irreducible<Error>;
  export var Re: Irreducible<RegExp>;
  export var Dat: Irreducible<Date>;
  export var Type: Irreducible<Type>;
  interface Struct<Properties> extends Type {
    new (values: Properties, mutable?: boolean): Properties;
    (values: Properties, mutable?: boolean): Properties;
    meta: {
      kind: string;
      name: string;
      props: Properties;
    }
    update(instance: Struct<Properties>, spec: Object): Struct<Properties>;
  }
  export function struct<Properties>(props: Properties, name?: string): Struct<Properties>;

}

declare module 'tcomb' {
  export = tcomb
}
import type { ReactElement } from "react";
import { GroupClass } from "./config";
import type {
  BasePropClass,
  ComponentCollectionPropClass,
  ComponentPropClass,
  ExternalWidgetClass,
  InlineWidgetClass,
  TokenWidgetClass,
} from "./config";
import type { ZodEnum, z } from "zod";

export type ExtractInnerTypeFromInlineWidget<T> = T extends InlineWidgetClass<
  infer U
>
  ? U
  : never;

export type ExtractInnerTypeFromTokenWidget<T> = T extends TokenWidgetClass<
  infer U
>
  ? U
  : never;

export type ExtractInnerTypeFromExternalWidget<T> =
  T extends ExternalWidgetClass<infer U> ? U : never;

// flatten the schema keys - base props are referenced as is, GroupClasss are referenced
// with a dot notation so we can access nested properties
// in the next step and remove the GroupClass wrapper
export type SchemaToPaths<
  T extends Record<string, GroupClass<any> | BasePropClass<any>>,
  Key = keyof T
> = Key extends string
  ? T[Key] extends BasePropClass<any>
    ? `${Key}`
    : T[Key] extends GroupClass<any>
    ? `${Key}.${SchemaToPaths<T[Key]["_props"]>}`
    : never
  : never;

// Recursively get the types of each nested property of a schema
// This is used to get the inner type e.g. BaseType<string> becomes string
// eg. GroupClass<{ a: BaseType<string> }> becomes { a: string }
export type ExtrapolateTypes<T> = T extends ComponentCollectionPropClass<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  infer SchemaProps,
  any
>
  ? SchemaProps extends Record<
      string,
      BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
    >
    ? Array<{ [K in keyof SchemaProps]: ExtrapolateTypes<SchemaProps[K]> }>
    : Array<{}> // if the schema props are empty, we return an empty array
  : // for a component prop, we need to extrapolate the schema props into a single object
  T extends ComponentPropClass<
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      infer SchemaProps,
      any
    >
  ? SchemaProps extends Record<
      string,
      BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
    >
    ? {
        [K in keyof SchemaProps]: ExtrapolateTypes<SchemaProps[K]>;
      }
    : {} // if the schema props are empty, we return an empty object
  : // this is any other type of prop

  T extends BasePropClass<infer U>
  ? U extends ZodEnum<any>
    ? z.infer<U> // return the zod enum type inferred correctly
    : U
  : T extends GroupClass<infer G>
  ? ExtrapolateTypes<G>
  : T extends Record<
      string,
      BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
    >
  ? { [K in keyof T]: ExtrapolateTypes<T[K]> }
  : never;

// Split a string by a delimiter - use to break the path into individual keys
export type Split<
  S extends string,
  D extends string
> = S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];

// Get the type of a nested property of an object by providing a path
export type GetType<O, P extends any[]> = P extends [infer Head, ...infer Tail]
  ? Head extends keyof O
    ? Tail extends []
      ? O[Head]
      : GetType<O[Head], Tail>
    : never
  : never;

// Get the type from the base of the object. This is a starting point for the path
// We recurse over the rest of the object from here
export type PathToType<P extends string, O> = GetType<O, Split<P, ".">>;

// Rename the keys of an object by removing the GroupClass wrapper
// We only use the dot notation on GroupClasss - so we can remove the GroupClass wrapper
// when we see a dot in the key
// This is achieved by looping over the paths in the format paths = "key1" | "key2" | "someGroupClass.key3"
export type RenameKeys<T> = {
  [K in keyof T as K extends `${infer GroupClassKey}.${infer ObjectKey}`
    ? ObjectKey
    : K]: T[K];
};

////////////////////////////////////////////////////////////////////////////////
// TYPES FOR DEALING WITH COMPONENT TYPE PROPS CASTING TO REACT ELEMENTS ///////
////////////////////////////////////////////////////////////////////////////////

export type ExtrapolateComponentTypes<T> = T extends BasePropClass<infer U>
  ? T extends ComponentCollectionPropClass<
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >
    ? ReactElement[]
    : T extends ComponentPropClass<
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any
      >
    ? ReactElement
    : "IGNORE"
  : T extends GroupClass<infer G>
  ? ExtrapolateComponentTypes<G>
  : T extends Record<
      string,
      BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
    >
  ? { [K in keyof T]: ExtrapolateComponentTypes<T[K]> }
  : "IGNORE";

type Ignore<T> = T extends "IGNORE" ? never : T;

type FilterIgnore<T> = {
  [P in keyof T as Ignore<T[P]> extends never ? never : P]: T[P];
};

export type CastToReactElement<T> = T extends ReactElement | ReactElement[]
  ? T
  : T extends string
  ? never
  : T;

export type SchemaToPathsReactElements<
  T extends Record<string, GroupClass<any> | BasePropClass<any>>,
  Key = keyof T
> = Key extends string
  ? T[Key] extends BasePropClass<any>
    ? `${Key}`
    : T[Key] extends GroupClass<any>
    ? `${Key}.${SchemaToPathsReactElements<T[Key]["_props"]>}`
    : never
  : never;

export type FlattenSchemaAndCastToReactElement<
  T extends Record<string, GroupClass<any> | BasePropClass<any>>
> = FilterIgnore<
  CastToReactElement<
    RenameKeys<
      MappedPaths<
        ExtrapolateComponentTypes<T>,
        ExcludeSkippedProps<SchemaToPathsReactElements<T>>
      >
    >
  >
>;

// components prop

type CastArrayToUnion<T> = T extends Array<infer U> ? U : never;

export type ExtrapolateComponentTypesToDownstreamParams<T> =
  T extends BasePropClass<infer U>
    ? T extends ComponentCollectionPropClass<
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any
      >
      ? Array<Record<string, any>>
      : T extends ComponentPropClass<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >
      ? Record<string, any>
      : "IGNORE"
    : T extends GroupClass<infer G>
    ? ExtrapolateComponentTypesToDownstreamParams<G>
    : T extends Record<
        string,
        BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
      >
    ? { [K in keyof T]: ExtrapolateComponentTypesToDownstreamParams<T[K]> }
    : "IGNORE";

export type CastToDownstreamParams<T> = T extends
  | Record<string, any>
  | Array<Record<string, any>>
  ? T
  : T extends string
  ? never
  : T;

export type FlattenSchemaAndCastToDownstreamParams<
  T extends Record<string, GroupClass<any> | BasePropClass<any>>
> = FilterIgnore<
  CastToDownstreamParams<
    RenameKeys<
      MappedPaths<
        ExtrapolateComponentTypesToDownstreamParams<T>,
        ExcludeSkippedProps<SchemaToPathsReactElements<T>>
      >
    >
  >
>;

////

type StringToElement<T> = T extends string
  ? ReactElement
  : T extends string[]
  ? ReactElement[]
  : never;

export type ConvertToReactElement<T> = {
  [K in keyof T]: StringToElement<T[K]>;
};

// TODO: Assert the length of the union is the same as the length of the paths - to ensure no dulicates used

// exclude any paths that are in the component collection prop
export type ExcludeSkippedProps<T extends string> =
  T extends "SKIP_THIS_PROPERTY" ? never : T;

// Map the paths to the types of the schema
export type MappedPaths<Object, Paths extends string> = {
  [P in Paths]: PathToType<P, Object>;
};

export type FlattenSchema<
  T extends Record<string, GroupClass<any> | BasePropClass<any>>
> = RenameKeys<
  MappedPaths<ExtrapolateTypes<T>, ExcludeSkippedProps<SchemaToPaths<T>>>
>;

//// Extract props from linked components

// Used to add children to a component
export type WithChildren<
  T,
  HasChildren extends boolean
> = HasChildren extends true ? T & { children: React.ReactNode } : T;

type __easyblocks = {
  id: string;
  isEditing: boolean;
  isSelected?: boolean | undefined;
};

export type WithEasyblocksAndId<
  T,
  IsReusable extends boolean
> = IsReusable extends true
  ? T & { _id: string }
  : T & { _easyblocks: __easyblocks };

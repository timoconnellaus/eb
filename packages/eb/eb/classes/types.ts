import {
  group,
  numberProp,
  stringProp,
  inlineCustom,
  tokenCustom,
  externalCustom,
} from "../test";
import type { BaseProp } from "./props/BaseProp";
import type { Group } from "./props/group";
import type { ExternalWidget } from "./widgets/external-widget";
import type { InlineWidget } from "./widgets/inline-widget";
import type { TokenWidget } from "./widgets/token-widget";

export type ExtractInnerTypeFromInlineWidget<T> = T extends InlineWidget<
  infer U
>
  ? U
  : never;

export type ExtractInnerTypeFromTokenWidget<T> = T extends TokenWidget<infer U>
  ? U
  : never;

export type ExtractInnerTypeFromExternalWidget<T> = T extends ExternalWidget<
  infer U
>
  ? U
  : never;

// flatten the schema keys - base props are referenced as is, groups are referenced
// with a dot notation so we can access nested properties
// in the next step and remove the group wrapper
export type SchemaToPaths<
  T extends Record<string, Group<any> | BaseProp<any>>,
  Key = keyof T
> = Key extends string
  ? T[Key] extends BaseProp<any>
    ? // we don't want to include the component collection prop in the final output as it's not a value
      T[Key] extends ComponentCollectionProp<
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
      ? `SKIP_THIS_PROPERTY`
      : `${Key}`
    : T[Key] extends Group<any>
    ? `${Key}.${SchemaToPaths<T[Key]["_props"]>}`
    : never
  : never;

// Recursively get the types of each nested property of a schema
// This is used to get the inner type e.g. BaseType<string> becomes string
// eg. Group<{ a: BaseType<string> }> becomes { a: string }
export type ExtrapolateTypes<T> = T extends BaseProp<infer U>
  ? U
  : T extends Group<infer G>
  ? ExtrapolateTypes<G>
  : T extends Record<
      string,
      BaseProp<any> | Group<Record<string, BaseProp<any>>>
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

// Rename the keys of an object by removing the group wrapper
// We only use the dot notation on groups - so we can remove the group wrapper
// when we see a dot in the key
// This is achieved by looping over the paths in the format paths = "key1" | "key2" | "someGroup.key3"
export type RenameKeys<T> = {
  [K in keyof T as K extends `${infer GroupKey}.${infer ObjectKey}`
    ? ObjectKey
    : K]: T[K];
};

// TODO: Assert the length of the union is the same as the length of the paths - to ensure no dulicates used
// conver a union to an intersection
// type UnionToIntersection<U> =
//   (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

// // get the last element of a union - we use this to get the type
// type LastOf<T> =
//   UnionToIntersection<T extends any ? (x: T) => void : never> extends (x: infer L) => void ? L : never;

// // convert a union to a tuple
// type UnionToTuple<T, L = LastOf<T>> =
//   [T] extends [never] ? [] : [...UnionToTuple<Exclude<T, L>>, L];

// type LengthOfUnion<T> = UnionToTuple<T>['length']

// type AssertSameLength<U1, U2> = LengthOfUnion<U1> extends LengthOfUnion<U2> ?
//   (LengthOfUnion<U2> extends LengthOfUnion<U1> ? true : never) : never;

// type test = "a" | "b"
// type test2 = "a" | "b" | "c"
// type test3 = AssertSameLength<test, test2>

// exclude any paths that are in the component collection prop
type ExcludeSkippedProps<T extends string> = T extends "SKIP_THIS_PROPERTY"
  ? never
  : T;

// Map the paths to the types of the schema
export type MappedPaths<Object, Paths extends string> = {
  [P in Paths]: PathToType<P, Object>;
};

export type FlattenSchema<
  T extends Record<string, Group<any> | BaseProp<any>>
> = RenameKeys<
  MappedPaths<ExtrapolateTypes<T>, ExcludeSkippedProps<SchemaToPaths<T>>>
>;

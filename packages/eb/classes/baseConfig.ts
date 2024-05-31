import type { ExternalWidget } from "./widgets/external-widget";
import type { InlineWidget } from "./widgets/inline-widget";
import type { TokenWidget } from "./widgets/token-widget";
import type { Widgets } from "./widgets/widgets";
import type { StandardTokenTypes, Tokens, TokenSet } from "./tokens";
import type { Devices } from "./devices";
import { InlineType, TokenType, ExternalType } from "./types";
import type { DefinitionInputType, DefinitionOutputType } from "./definition";
import type { LocalSchemaProp, SchemaProp } from "@easyblocks/core";
import { BaseProp } from "./props/BaseProp";
import type { z, ZodType } from "zod";
import { StringProp } from "./props/StringProp";
import { NumberProp } from "./props/NumberProp";
import { CustomProp } from "./props/CustomProp";

type ExtractInnerTypeFromInlineWidget<T> = T extends InlineWidget<infer U>
  ? U
  : never;

type ExtractInnerTypeFromTokenWidget<T> = T extends TokenWidget<infer U>
  ? U
  : never;

type ExtractInnerTypeFromExternalWidget<T> = T extends ExternalWidget<infer U>
  ? U
  : never;

// flatten the schema keys - base props are referenced as is, groups are referenced
// with a dot notation so we can access nested properties
// in the next step and remove the group wrapper
type SchemaToPaths<
  T extends Record<string, Group<any> | BaseProp<any>>,
  Key = keyof T
> = Key extends string
  ? T[Key] extends BaseProp<any>
    ? `${Key}`
    : T[Key] extends Group<any>
    ? `${Key}.${SchemaToPaths<T[Key]["_props"]>}`
    : never
  : never;

// Recursively get the types of each nested property of a schema
// This is used to get the inner type e.g. BaseType<string> becomes string
// eg. Group<{ a: BaseType<string> }> becomes { a: string }
type ExtrapolateTypes<T> = T extends BaseProp<infer U>
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
type Split<
  S extends string,
  D extends string
> = S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];

// Get the type of a nested property of an object by providing a path
type GetType<O, P extends any[]> = P extends [infer Head, ...infer Tail]
  ? Head extends keyof O
    ? Tail extends []
      ? O[Head]
      : GetType<O[Head], Tail>
    : never
  : never;

// Get the type from the base of the object. This is a starting point for the path
// We recurse over the rest of the object from here
type PathToType<P extends string, O> = GetType<O, Split<P, ".">>;

// Rename the keys of an object by removing the group wrapper
// We only use the dot notation on groups - so we can remove the group wrapper
// when we see a dot in the key
// This is achieved by looping over the paths in the format paths = "key1" | "key2" | "someGroup.key3"
type RenameKeys<T> = {
  [K in keyof T as K extends `${infer GroupKey}.${infer ObjectKey}`
    ? ObjectKey
    : K]: T[K];
};

// Map the paths to the types of the schema
type MappedPaths<Object, Paths extends string> = {
  [P in Paths]: PathToType<P, Object>;
};

type FlattenSchema<T extends Record<string, Group<any> | BaseProp<any>>> =
  RenameKeys<MappedPaths<ExtrapolateTypes<T>, SchemaToPaths<T>>>;

interface BaseConfigProps<
  InlineWidgets extends Record<string, InlineWidget<any>>,
  TokenWidgets extends Record<string, TokenWidget<any>>,
  ExternalWidgets extends Record<string, ExternalWidget<any>>,
  CustomTokens extends Record<string, TokenSet<any, any, any>>,
  StandardTokens extends Partial<StandardTokenTypes>
> {
  widgets?: Widgets<InlineWidgets, TokenWidgets, ExternalWidgets>;
  tokens?: Tokens<CustomTokens, StandardTokens>;
  devices?: Devices;
}

class BaseConfig<
  InlineWidgets extends Record<string, InlineWidget<any>>,
  TokenWidgets extends Record<string, TokenWidget<any>>,
  ExternalWidgets extends Record<string, ExternalWidget<any>>,
  CustomTokens extends Record<string, TokenSet<any, any, any>>,
  StandardTokens extends Partial<StandardTokenTypes>
> {
  private _widgets?: Widgets<InlineWidgets, TokenWidgets, ExternalWidgets>;
  private _tokens?: Tokens<CustomTokens, StandardTokens>;
  private _devices: Devices;

  constructor(
    props: BaseConfigProps<
      InlineWidgets,
      TokenWidgets,
      ExternalWidgets,
      CustomTokens,
      StandardTokens
    >
  ) {
    this._widgets =
      props.widgets ??
      ({} as Widgets<InlineWidgets, TokenWidgets, ExternalWidgets>);
    this._tokens = props.tokens ?? ({} as Tokens<CustomTokens, StandardTokens>);
    this._devices = props.devices ?? ({} as Devices);
  }

  inlineType<K extends keyof InlineWidgets>(inlineWidgetKey: K) {
    return new InlineType<InlineWidgets, K>(inlineWidgetKey);
  }

  tokenType<
    K extends keyof TokenWidgets,
    TK extends keyof CustomTokens | keyof StandardTokens
  >(tokenKey: TK) {
    return new TokenType<TokenWidgets, K, CustomTokens, StandardTokens, TK>(
      tokenKey
    );
  }

  externalType<K extends keyof ExternalWidgets>(externalWidgetKeys: Array<K>) {
    return new ExternalType<ExternalWidgets, K>(externalWidgetKeys);
  }

  baseConfigWithTypes<
    InlineTypes extends Record<string, InlineType<InlineWidgets, any>>,
    TokenTypes extends Record<
      string,
      TokenType<TokenWidgets, any, CustomTokens, StandardTokens>
    >,
    ExternalTypes extends Record<string, ExternalType<ExternalWidgets, any>>
  >(props: {
    inlineTypes?: InlineTypes;
    tokenTypes?: TokenTypes;
    externalTypes?: ExternalTypes;
  }) {
    return new BaseConfigWithTypes<
      InlineWidgets,
      TokenWidgets,
      ExternalWidgets,
      CustomTokens,
      StandardTokens,
      InlineTypes,
      TokenTypes,
      ExternalTypes
    >({
      baseConfig: {
        widgets: this._widgets,
        tokens: this._tokens,
        devices: this._devices,
      },
      inlineTypes: props.inlineTypes ?? ({} as InlineTypes),
      tokenTypes: props.tokenTypes ?? ({} as TokenTypes),
      externalTypes: props.externalTypes ?? ({} as ExternalTypes),
    });
  }

  _def() {
    return {
      widgets: this._widgets?._def(),
      tokens: this._tokens?._def(),
      devices: this._devices,
    };
  }
}

export const baseConfig = <
  InlineWidgets extends Record<string, InlineWidget<any>>,
  TokenWidgets extends Record<string, TokenWidget<any>>,
  ExternalWidgets extends Record<string, ExternalWidget<any>>,
  CustomTokens extends Record<string, TokenSet<any, any, any>>,
  StandardTokens extends Partial<StandardTokenTypes>
>(
  props: BaseConfigProps<
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens
  >
) =>
  new BaseConfig<
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens
  >(props);

class BaseConfigWithTypes<
  InlineWidgets extends Record<string, InlineWidget<any>>,
  TokenWidgets extends Record<string, TokenWidget<any>>,
  ExternalWidgets extends Record<string, ExternalWidget<any>>,
  CustomTokens extends Record<string, TokenSet<any, any, any>>,
  StandardTokens extends Partial<StandardTokenTypes>,
  InlineTypes extends Record<string, InlineType<InlineWidgets, any>>,
  TokenTypes extends Record<
    string,
    TokenType<TokenWidgets, any, CustomTokens, StandardTokens>
  >,
  ExternalTypes extends Record<string, ExternalType<ExternalWidgets, any>>
> {
  private _baseConfig: BaseConfig<
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens
  >;
  private _inlineTypes: InlineTypes;
  private _tokenTypes: TokenTypes;
  private _externalTypes: ExternalTypes;

  _def() {
    return {
      baseConfig: this._baseConfig._def(),
      inlineTypes: this._inlineTypes,
      tokenTypes: this._tokenTypes,
      externalTypes: this._externalTypes,
    };
  }

  definition<U>(input: DefinitionInputType<U>): DefinitionOutputType<U> {
    return {
      schema: input.schema,
      styles: (values: U) => input.styles({ values }),
      // schemaDef: (): SchemaProp[] => {
      //   const result: SchemaProp[] = [];
      //   Object.keys(input.schema.structure).forEach((key) => {
      //     const prop = input.schema.structure[key];
      //     const schema = prop.getSchema();
      //     result.push({
      //       prop: key,
      //       ...schema,
      //     });
      //   });
      //   return result;
      // },
    };
  }

  schema<
    T extends Record<
      string,
      BaseProp<any> | Group<Record<string, BaseProp<any>>>
    >
  >(
    schema: T
  ): {
    structure: FlattenSchema<T>;
  } {
    const schemaStructure: any = {};
    Object.keys(schema).forEach((key) => {
      const prop = schema[key as keyof T];
      schemaStructure[key as keyof T] =
        prop instanceof Group ? prop._props : prop;
    });
    return {
      structure: schemaStructure,
    };
  }

  stringProp() {
    return new StringProp();
  }

  numberProp() {
    return new NumberProp();
  }

  group<T extends Record<string, BaseProp<any>>>(props: T): Group<T> {
    return new Group<T>(props);
  }

  inlineCustom<K extends Extract<keyof InlineTypes, string>>(
    inlineType: K
  ): CustomProp<ExtractInnerTypeFromInlineWidget<InlineWidgets[K]>> {
    return new CustomProp<ExtractInnerTypeFromInlineWidget<InlineWidgets[K]>>(
      inlineType
    );
  }

  tokenCustom<K extends Extract<keyof TokenTypes, string>>(
    tokenType: K
  ): CustomProp<ExtractInnerTypeFromTokenWidget<TokenWidgets[K]>> {
    return new CustomProp<ExtractInnerTypeFromTokenWidget<TokenWidgets[K]>>(
      tokenType
    );
  }

  externalCustom<K extends Extract<keyof ExternalTypes, string>>(
    externalType: K
  ): CustomProp<ExtractInnerTypeFromExternalWidget<ExternalWidgets[K]>> {
    return new CustomProp<
      ExtractInnerTypeFromExternalWidget<ExternalWidgets[K]>
    >(externalType);
  }

  constructor(props: {
    baseConfig: BaseConfigProps<
      InlineWidgets,
      TokenWidgets,
      ExternalWidgets,
      CustomTokens,
      StandardTokens
    >;
    inlineTypes?: InlineTypes;
    tokenTypes?: TokenTypes;
    externalTypes?: ExternalTypes;
  }) {
    this._baseConfig = baseConfig(props.baseConfig);
    this._inlineTypes = props.inlineTypes ?? ({} as InlineTypes);
    this._tokenTypes = props.tokenTypes ?? ({} as TokenTypes);
    this._externalTypes = props.externalTypes ?? ({} as ExternalTypes);
  }
}

export class Group<T extends Record<string, BaseProp<any>>> {
  _props: T;

  constructor(props: T) {
    this._props = props;
  }

  _def() {
    return {
      props: this._props,
    };
  }
}

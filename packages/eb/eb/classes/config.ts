import type { ExternalWidget } from "./widgets/external-widget";
import type { InlineWidget } from "./widgets/inline-widget";
import type { TokenWidget } from "./widgets/token-widget";
import type { Widgets } from "./widgets/widgets";
import type { StandardTokenTypes, Tokens, TokenSet } from "./tokens";
import type { Devices } from "./devices";
import { InlineType, TokenType, ExternalType } from "./easyblocks-types";
import { Definition, type DefinitionInputType } from "./definition";
import { BaseProp } from "./props/BaseProp";
import { StringProp } from "./props/StringProp";
import { NumberProp } from "./props/NumberProp";
import { CustomProp } from "./props/CustomProp";
import { Group } from "./props/group";
import type {
  ExtractInnerTypeFromExternalWidget,
  ExtractInnerTypeFromInlineWidget,
  ExtractInnerTypeFromTokenWidget,
  FlattenSchema,
} from "./types";
import { ComponentCollectionProp } from "./props/ComponentCollection";

interface BaseConfigProps<
  InlineWidgets extends Record<string, InlineWidget<any>>,
  TokenWidgets extends Record<string, TokenWidget<any>>,
  ExternalWidgets extends Record<string, ExternalWidget<any>>,
  CustomTokens extends Record<string, TokenSet<any, any, any>>,
  StandardTokens extends Partial<StandardTokenTypes>,
  ComponentNameType extends string,
  ComponentTypes extends ComponentNameType[]
> {
  widgets?: Widgets<InlineWidgets, TokenWidgets, ExternalWidgets>;
  tokens?: Tokens<CustomTokens, StandardTokens>;
  devices?: Devices;
  componentTypes: ComponentTypes;
}

class BaseConfig<
  InlineWidgets extends Record<string, InlineWidget<any>>,
  TokenWidgets extends Record<string, TokenWidget<any>>,
  ExternalWidgets extends Record<string, ExternalWidget<any>>,
  CustomTokens extends Record<string, TokenSet<any, any, any>>,
  StandardTokens extends Partial<StandardTokenTypes>,
  ComponentNameType extends string,
  ComponentTypes extends ComponentNameType[]
> {
  private _widgets?: Widgets<InlineWidgets, TokenWidgets, ExternalWidgets>;
  private _tokens?: Tokens<CustomTokens, StandardTokens>;
  private _devices: Devices;
  private _componentTypes: ComponentTypes;

  constructor(
    props: BaseConfigProps<
      InlineWidgets,
      TokenWidgets,
      ExternalWidgets,
      CustomTokens,
      StandardTokens,
      ComponentNameType,
      ComponentTypes
    >
  ) {
    this._widgets =
      props.widgets ??
      ({} as Widgets<InlineWidgets, TokenWidgets, ExternalWidgets>);
    this._tokens = props.tokens ?? ({} as Tokens<CustomTokens, StandardTokens>);
    this._devices = props.devices ?? ({} as Devices);
    this._componentTypes = props.componentTypes;
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
    componentTypes?: ComponentTypes;
  }) {
    return new BaseConfigWithTypes<
      InlineWidgets,
      TokenWidgets,
      ExternalWidgets,
      CustomTokens,
      StandardTokens,
      InlineTypes,
      TokenTypes,
      ExternalTypes,
      ComponentNameType,
      ComponentTypes
    >({
      baseConfig: {
        widgets: this._widgets,
        tokens: this._tokens,
        devices: this._devices,
        componentTypes: this._componentTypes,
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
  StandardTokens extends Partial<StandardTokenTypes>,
  ComponentType extends string,
  ComponentTypes extends ComponentType[]
>(
  props: BaseConfigProps<
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    ComponentType,
    ComponentTypes
  >
) =>
  new BaseConfig<
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    ComponentType,
    ComponentTypes
  >(props);

export class BaseConfigWithTypes<
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
  ExternalTypes extends Record<string, ExternalType<ExternalWidgets, any>>,
  ComponentType extends string,
  ComponentTypes extends ComponentType[]
> {
  private _baseConfig: BaseConfig<
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    ComponentType,
    ComponentTypes
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

  definition<U>(
    input: DefinitionInputType<U, ComponentType, ComponentTypes>
  ): Definition<
    U,
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    InlineTypes,
    TokenTypes,
    ExternalTypes,
    ComponentType,
    ComponentTypes
  > {
    return new Definition<
      U,
      InlineWidgets,
      TokenWidgets,
      ExternalWidgets,
      CustomTokens,
      StandardTokens,
      InlineTypes,
      TokenTypes,
      ExternalTypes,
      ComponentType,
      ComponentTypes
    >(input);
  }

  // definition<U>(
  //   input: DefinitionInputType<U, ComponentType, ComponentTypes>
  // ): DefinitionOutputType<U, ComponentType, ComponentTypes> {
  //   return {
  //     schema: input.schema,
  //     styles: (values: U) => input.styles({ values }),
  //     type: input.type,

  //     // schemaDef: (): SchemaProp[] => {
  //     //   const result: SchemaProp[] = [];
  //     //   Object.keys(input.schema.structure).forEach((key) => {
  //     //     const prop = input.schema.structure[key];
  //     //     const schema = prop.getSchema();
  //     //     result.push({
  //     //       prop: key,
  //     //       ...schema,
  //     //     });
  //     //   });
  //     //   return result;
  //     // },
  //   };
  // }

  schema<
    T extends Record<
      string,
      BaseProp<any> | Group<Record<string, BaseProp<any>>>
    >
  >(schema: T): FlattenSchema<T> {
    const schemaStructure: any = {};
    Object.keys(schema).forEach((key) => {
      const prop = schema[key as keyof T];
      if (prop instanceof Group) {
        const groupProps = prop._props;
        Object.keys(groupProps).forEach((key) => {
          const gProp = groupProps[key as keyof T as string];
          schemaStructure[key as keyof T as string] = gProp;
        });
      } else if (prop instanceof ComponentCollectionProp) {
        // skip they aren't available in values
      } else {
        schemaStructure[key as keyof T as string] = prop;
      }
    });
    return schemaStructure;
  }

  stringProp() {
    return new StringProp();
  }

  numberProp() {
    return new NumberProp();
  }

  // componentCollectionProp<
  //   T,
  //   InlineWidgets,
  //   TokenWidgets,
  //   ExternalWidgets,
  //   CustomTokens,
  //   StandardTokens,
  //   InlineTypes,
  //   TokenTypes,
  //   ExternalTypes,
  //   ComponentType,
  //   ComponentTypes,
  //   Definition
  // >(components: Definition[]) {
  //   return new ComponentCollectionProp<Definition[]>(components);
  // }

  componentCollectionProp<U>(
    input: Definition<
      U,
      InlineWidgets,
      TokenWidgets,
      ExternalWidgets,
      CustomTokens,
      StandardTokens,
      InlineTypes,
      TokenTypes,
      ExternalTypes,
      ComponentType,
      ComponentTypes
    >[]
  ): ComponentCollectionProp<
    U,
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    InlineTypes,
    TokenTypes,
    ExternalTypes,
    ComponentType,
    ComponentTypes
  > {
    return new ComponentCollectionProp<
      U,
      InlineWidgets,
      TokenWidgets,
      ExternalWidgets,
      CustomTokens,
      StandardTokens,
      InlineTypes,
      TokenTypes,
      ExternalTypes,
      ComponentType,
      ComponentTypes
    >(input);
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
      StandardTokens,
      ComponentType,
      ComponentTypes
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

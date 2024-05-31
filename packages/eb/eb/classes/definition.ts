import type {
  NoCodeComponentStylesFunctionResult,
  NoCodeComponentAutoFunction,
  SchemaProp,
  NoCodeComponentStylesFunction,
} from "@easyblocks/core";
import type { ZodType, z } from "zod";
import type { InlineType, TokenType, ExternalType } from "./easyblocks-types";
import type { TokenSet, StandardTokenTypes } from "./tokens";
import type { ExternalWidget } from "./widgets/external-widget";
import type { InlineWidget } from "./widgets/inline-widget";
import type { TokenWidget } from "./widgets/token-widget";

type StyleFunction<T> = (params: {
  values: T;
}) => NoCodeComponentStylesFunctionResult;

// type TWFunction<T> = (props: {
//   props:
//   tw:
//   components:
// })

export type DefinitionInputType<
  T,
  ComponentType extends string,
  ComponentTypes extends ComponentType[]
> = {
  id: string;
  schema: T;
  type?: ComponentTypes[number] | Array<ComponentTypes[number]>;
  label?: string;
  pasteSlots?: Array<string>;

  // label?: string;
  // styles?: NoCodeComponentStylesFunction<Values, Params>;
  // editing?: NoCodeComponentEditingFunction<Values, Params>;
  // auto?: NoCodeComponentAutoFunction<Values, Params>;
  // change?: NoCodeComponentChangeFunction;
  // pasteSlots?: Array<string>;
  // thumbnail?: string;
  // preview?: (input: {
  //     values: Values;
  //     externalData: ExternalData;
  // }) => SidebarPreviewVariant | undefined;
  // allowSave?: boolean;
  // rootParams?: RootParameter[];
};

export type DefinitionOutputType<
  T,
  ComponentType extends string,
  ComponentTypes extends ComponentType[]
> = {
  id: string;
  schema: T;
  type?: ComponentTypes[number] | Array<ComponentTypes[number]>;
};

//   // schemaDef: () => SchemaProp[];
// };

// Define the definition class
// Add root params
// Add the definition of the component

export class Definition<
  T,
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
  private _id: string;
  private _schema: T;
  private _noCodeComponent?: ComponentStyles<
    T,
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
  >;
  private _type?: ComponentTypes[number] | Array<ComponentTypes[number]>;
  private _label?: string;
  private _pasteSlots?: Array<string>;

  constructor(props: DefinitionInputType<T, ComponentType, ComponentTypes>) {
    this._id = props.id;
    this._schema = props.schema;
    this._type = props.type;
    this._label = props.label;
    this._pasteSlots = props.pasteSlots;
  }

  styles(styles: StyleFunction<T>) {
    return new ComponentStyles<
      T,
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
    >(styles);
  }

  // styles(styles: StyleFunction<T>) {
  //   this._styles = new DefinitionStyles<
  //     T,
  //     InlineWidgets,
  //     TokenWidgets,
  //     ExternalWidgets,
  //     CustomTokens,
  //     StandardTokens,
  //     InlineTypes,
  //     TokenTypes,
  //     ExternalTypes,
  //     ComponentType,
  //     ComponentTypes
  //   >(styles);
  //   return this;
  // }

  _def(): DefinitionOutputType<T, ComponentType, ComponentTypes> {
    return {
      schema: this._schema,
      type: this._type,
      id: this._id,
    };
  }
}

class ComponentStyles<
  T,
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
  private _styles?: StyleFunction<T>;

  constructor(styles: StyleFunction<T>) {
    this._styles = styles;
  }
}

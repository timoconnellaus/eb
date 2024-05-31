import type {
  ComponentCollectionSchemaProp,
  NumberSchemaProp,
} from "@easyblocks/core";
import type { ZodType } from "zod";
import { z } from "zod";
import { BaseProp } from "./BaseProp";
import { Definition } from "../definition";
import type { InlineType, TokenType, ExternalType } from "../easyblocks-types";
import type { TokenSet, StandardTokenTypes } from "../tokens";
import type { ExternalWidget } from "../widgets/external-widget";
import type { InlineWidget } from "../widgets/inline-widget";
import type { TokenWidget } from "../widgets/token-widget";

export class ComponentCollectionProp<
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
> extends BaseProp<string> {
  private _components: Definition<
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
  >[];

  constructor(
    components: Definition<
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
    >[]
  ) {
    super();
    this._components = components;
  }

  _def(): Omit<ComponentCollectionSchemaProp, "prop"> {
    return {
      type: "component-collection",
      accepts: this._components.map((c) => c._def().id),
    };
  }
}

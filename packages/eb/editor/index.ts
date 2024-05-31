import { EasyblocksEditor as EasyblocksEditorMain } from "@easyblocks/editor";
import type { ComponentProps } from "react";
import type { BaseConfigWithTypes } from "../eb/classes/config";
import type { Config } from "@easyblocks/core";
import type { TokenSet, StandardTokenTypes } from "../eb/classes/tokens";
import type { ExternalWidget } from "../eb/classes/widgets/external-widget";
import type { InlineWidget } from "../eb/classes/widgets/inline-widget";
import type { TokenWidget } from "../eb/classes/widgets/token-widget";
import type {
  ExternalType,
  InlineType,
  TokenType,
} from "../eb/classes/easyblocks-types";

type EasyBlocksEditorProps = ComponentProps<typeof EasyblocksEditorMain>;

type Props<
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
> = {
  eb: BaseConfigWithTypes<
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    InlineTypes,
    TokenTypes,
    ExternalTypes
  >;
};

function EBEditor<
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
>(
  props: Props<
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    InlineTypes,
    TokenTypes,
    ExternalTypes
  >
) {
  const config: Config = {};

  const EBConfig: EasyBlocksEditorProps = {};

  return EasyblocksEditorMain(EBConfig);
}

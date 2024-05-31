import type { StandardTokenTypes, TokenSet } from "../tokens";
import type { InlineWidget } from "../widgets/inline-widget";
import type { TokenWidget } from "../widgets/token-widget";

type ExtractInnerTypeFromInlineWidget<T> = T extends InlineWidget<infer U>
  ? U
  : never;

export class InlineType<InlineWidgets, K extends keyof InlineWidgets> {
  private _widgetKey: K;
  private _defaultValue?: ExtractInnerTypeFromInlineWidget<InlineWidgets[K]>;

  defaultValue(value: ExtractInnerTypeFromInlineWidget<InlineWidgets[K]>) {
    this._defaultValue = value;
    return this;
  }

  constructor(widgetKey: K) {
    this._widgetKey = widgetKey;
  }
}

type ExtractInnerTypeFromTokenWidget<T> = T extends TokenWidget<infer U>
  ? U
  : never;

export class TokenType<
  TokenWidgets,
  WK extends keyof TokenWidgets,
  CustomTokens extends Record<string, TokenSet<any, any, any>>,
  StandardTokens extends Partial<StandardTokenTypes>,
  TK extends keyof CustomTokens | keyof StandardTokens =
    | keyof CustomTokens
    | keyof StandardTokens
> {
  private _tokenKey: TK;
  private _widgetKey?: WK;
  private _defaultValue?: ExtractInnerTypeFromTokenWidget<TokenWidgets[WK]>;

  defaultValue(value: ExtractInnerTypeFromTokenWidget<TokenWidgets[WK]>) {
    this._defaultValue = value;
    return this;
  }

  customValueWidget(value: WK) {
    this._widgetKey = value;
    return this;
  }

  // TODO: We want the types to be forced to match. This is hard to do!
  constructor(tokenKey: TK) {
    this._tokenKey = tokenKey;
  }
}

export class ExternalType<ExternalWidgets, WK extends keyof ExternalWidgets> {
  private _externalWidgetKeys: Array<WK>;

  constructor(externalWidgetKeys: Array<WK>) {
    this._externalWidgetKeys = externalWidgetKeys;
  }
}

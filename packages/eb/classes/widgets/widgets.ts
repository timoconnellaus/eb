import type { NonNullish } from "@easyblocks/core";
import { ExternalWidget } from "./external-widget";
import { InlineWidget } from "./inline-widget";
import type { TokenWidget } from "./token-widget";

interface WidgetsProps<
  Inline extends Record<string, InlineWidget<any>>,
  Token extends Record<string, TokenWidget<any>>,
  External extends Record<string, ExternalWidget<any>>
> {
  inline?: Inline;
  token?: Token;
  external?: External;
}

export class Widgets<
  Inline extends Record<string, InlineWidget<any>>,
  Token extends Record<string, TokenWidget<any>>,
  External extends Record<string, ExternalWidget<any>>
> {
  private _inline: Inline;
  private _token: Token;
  private _external: External;

  constructor(props: WidgetsProps<Inline, Token, External>) {
    this._inline = props.inline ?? ({} as Inline);
    this._token = props.token ?? ({} as Token);
    this._external = props.external ?? ({} as External);
  }

  _def() {
    return {
      inline: this._inline,
      token: this._token,
      external: this._external,
    };
  }
}

export function widgets<
  Inline extends Record<string, InlineWidget<any>>,
  Token extends Record<string, TokenWidget<any>>,
  External extends Record<string, ExternalWidget<any>>
>(
  props: WidgetsProps<Inline, Token, External>
): Widgets<Inline, Token, External> {
  return new Widgets<Inline, Token, External>(props);
}

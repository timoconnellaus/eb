import type { NonNullish } from "@easyblocks/core";
import type { InlineWidgetConfig, InlineWidgetProps } from "./inline-widget";
import { InlineWidget } from "./inline-widget";

export type TokenWidgetProps<T extends NonNullish> = InlineWidgetProps<T>;
export type TokenWidgetConfig<T extends NonNullish> = InlineWidgetConfig<T>;
export class TokenWidget<T extends NonNullish> extends InlineWidget<T> {
  constructor(props: TokenWidgetProps<T>) {
    super(props);
  }
}
export const tokenWidget = <T extends NonNullish>(
  props: TokenWidgetProps<T>
): TokenWidget<T> => new TokenWidget(props);
